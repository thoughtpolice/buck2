/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is dual-licensed under either the MIT license found in the
 * LICENSE-MIT file in the root directory of this source tree or the Apache
 * License, Version 2.0 found in the LICENSE-APACHE file in the root directory
 * of this source tree. You may select, at your option, one of the
 * above-listed licenses.
 */

use std::path::Path;
use std::path::PathBuf;

use buck2_core::soft_error;
use buck2_data::VersionControlRevision;
use buck2_events::dispatch::EventDispatcher;
use buck2_fs::async_fs_util;
use buck2_fs::paths::abs_norm_path::AbsNormPathBuf;
use buck2_fs::paths::abs_path::AbsPath;
use buck2_fs::paths::forward_rel_path::ForwardRelativePath;
use buck2_util::properly_reaped_child::reap_on_drop_command;
use futures::future::BoxFuture;
use futures::stream::FuturesUnordered;
use tokio::sync::OnceCell;
use tokio_stream::StreamExt;

/// Spawn tasks to collect version control information
/// and return a droppable handle that will cancel them on drop.
pub(crate) fn spawn_version_control_collector(
    dispatch: EventDispatcher,
    repo_root: AbsNormPathBuf,
) -> AbortOnDropHandle {
    buck2_core::execution_types::revision::clear_revision();
    let handle = tokio::spawn(async move {
        let mut tasks = FuturesUnordered::<BoxFuture<VersionControlRevision>>::new();

        tasks.push(Box::pin(create_revision_data(
            &repo_root,
            RevisionDataType::CurrentRevision,
        )));
        tasks.push(Box::pin(create_revision_data(
            &repo_root,
            RevisionDataType::Status,
        )));

        while let Some(event) = tasks.next().await {
            if let Some(error) = &event.command_error {
                soft_error!(
                    "spawn_version_control_collector_failed",
                    buck2_error::buck2_error!(buck2_error::ErrorTag::Input, "{}", error),
                    quiet: true
                )
                .ok();
            }

            dispatch.instant_event(event);
        }
    });

    AbortOnDropHandle { handle }
}

/// Abort the underlying task on drop.
pub(crate) struct AbortOnDropHandle {
    pub handle: tokio::task::JoinHandle<()>,
}

impl Drop for AbortOnDropHandle {
    fn drop(&mut self) {
        self.handle.abort();
    }
}

#[derive(Clone, Copy, Debug)]
enum RepoVcs {
    Hg,
    Git,
    Jj,
    Unknown,
}

#[derive(Clone, Copy, Debug)]
enum RevisionDataType {
    CurrentRevision,
    Status,
}

async fn create_revision_data(
    repo_root: &AbsNormPathBuf,
    revision_type: RevisionDataType,
) -> buck2_data::VersionControlRevision {
    let mut revision = buck2_data::VersionControlRevision::default();
    match repo_type(repo_root).await {
        Ok(repo_vcs) => match repo_vcs {
            RepoVcs::Hg => create_hg_data(&mut revision, revision_type, repo_root).await,
            RepoVcs::Git => create_git_data(&mut revision, revision_type, repo_root).await,
            RepoVcs::Jj => create_jj_data(&mut revision, revision_type, repo_root).await,
            RepoVcs::Unknown => {
                revision.command_error = Some("Unknown repository type".to_owned());
            }
        },
        Err(e) => {
            revision.command_error = Some(format!("Failed to get repository type: {e:#}"));
        }
    }
    revision
}

async fn create_hg_data(
    revision: &mut buck2_data::VersionControlRevision,
    revision_type: RevisionDataType,
    repo_root: &AbsNormPathBuf,
) {
    match revision_type {
        RevisionDataType::CurrentRevision => get_hg_revision(revision, repo_root).await,
        RevisionDataType::Status => get_hg_status(revision).await,
    }
}

async fn get_hg_revision(
    revision: &mut buck2_data::VersionControlRevision,
    repo_root: &AbsNormPathBuf,
) {
    // The contents of dirstate may be arbitrarily large, but the id is always
    // in the first 20 bytes, so we only need to read the first 20 bytes
    let mut buffer = [0; 20];
    let dirstate = repo_root
        .join(ForwardRelativePath::new(".hg").unwrap())
        .join(ForwardRelativePath::new("dirstate").unwrap());

    if let Err(e) = async_fs_util::read(&dirstate, &mut buffer).await {
        revision.command_error = Some(format!(
            "Failed to read the first 20 bytes of {}: {:#}",
            dirstate.display(),
            e.categorize_internal(),
        ));
        return;
    }

    let curr_revision = buffer.iter().map(|b| format!("{b:02x}")).collect();
    revision.hg_revision = Some(curr_revision);
}

async fn get_hg_status(revision: &mut buck2_data::VersionControlRevision) {
    // `hg status` returns if there are any local changes
    let status_output = match reap_on_drop_command("hg", &["status"], Some(&[("HGPLAIN", "1")])) {
        Ok(command) => command.output().await,
        Err(e) => {
            revision.command_error =
                Some(format!("reap_on_drop_command for `hg status` failed: {e}"));
            return;
        }
    };

    match status_output {
        Ok(result) => {
            if !result.status.success() {
                let stderr = match std::str::from_utf8(&result.stderr) {
                    Ok(s) => s,
                    Err(e) => {
                        revision.command_error = Some(format!("hg status stderr is not utf8: {e}"));
                        return;
                    }
                };
                revision.command_error = Some(format!(
                    "Command `hg status` failed with error code {}; stderr: {}",
                    result.status, stderr
                ));
                return;
            }

            let stdout = match std::str::from_utf8(&result.stdout) {
                Ok(s) => s.trim(),
                Err(e) => {
                    revision.command_error = Some(format!("hg status stdout is not utf8: {e}"));
                    return;
                }
            };
            revision.has_local_changes = Some(!stdout.is_empty());
        }
        Err(e) => {
            revision.command_error = Some(format!("Command `hg status` failed with error: {e:?}"));
        }
    };
}

async fn create_git_data(
    revision: &mut buck2_data::VersionControlRevision,
    revision_type: RevisionDataType,
    repo_root: &AbsNormPathBuf,
) {
    match revision_type {
        RevisionDataType::CurrentRevision => get_git_revision(revision, repo_root).await,
        RevisionDataType::Status => get_git_status(revision, repo_root).await,
    }
}

async fn get_git_revision(
    revision: &mut buck2_data::VersionControlRevision,
    repo_root: &AbsNormPathBuf,
) {
    // `git rev-parse HEAD` resolves the current commit hash. This handles
    // packed refs, detached HEADs, etc. without us having to parse `.git`.
    match run_git(repo_root, &["rev-parse", "HEAD"]).await {
        Ok(stdout) => revision.git_revision = Some(stdout.trim().to_owned()),
        Err(e) => revision.command_error = Some(e),
    }
}

async fn get_git_status(
    revision: &mut buck2_data::VersionControlRevision,
    repo_root: &AbsNormPathBuf,
) {
    // `git status --porcelain` prints one line per change; empty output means
    // there are no local changes. Note that this counts untracked files as local
    // changes (they show up as `??` lines), matching the behavior of `hg status`.
    match run_git(repo_root, &["status", "--porcelain"]).await {
        Ok(stdout) => revision.has_local_changes = Some(!stdout.trim().is_empty()),
        Err(e) => revision.command_error = Some(e),
    }
}

/// Run a `git` command rooted at `repo_root`, returning its stdout on success or
/// an error message describing the failure.
async fn run_git(repo_root: &AbsNormPathBuf, args: &[&str]) -> Result<String, String> {
    let Some(repo_root) = repo_root.as_path().to_str() else {
        return Err(format!(
            "Repository root is not valid utf8: {}",
            repo_root.as_path().display()
        ));
    };

    // `-C <repo_root>` makes git operate on the repository regardless of the
    // daemon's current working directory.
    let mut full_args = vec!["-C", repo_root];
    full_args.extend_from_slice(args);

    // `GIT_OPTIONAL_LOCKS=0` prevents git from taking the index lock or
    // refreshing the index on disk, so we don't contend with a concurrent user
    // `git` invocation (e.g. for `git status`).
    let output = match reap_on_drop_command("git", &full_args, Some(&[("GIT_OPTIONAL_LOCKS", "0")]))
    {
        Ok(command) => command.output().await,
        Err(e) => {
            return Err(format!(
                "reap_on_drop_command for `git {}` failed: {e}",
                args.join(" ")
            ));
        }
    };

    let result = match output {
        Ok(result) => result,
        Err(e) => {
            return Err(format!(
                "Command `git {}` failed with error: {e:?}",
                args.join(" ")
            ));
        }
    };

    if !result.status.success() {
        let stderr = match std::str::from_utf8(&result.stderr) {
            Ok(s) => s,
            Err(e) => return Err(format!("git {} stderr is not utf8: {e}", args.join(" "))),
        };
        return Err(format!(
            "Command `git {}` failed with error code {}; stderr: {}",
            args.join(" "),
            result.status,
            stderr
        ));
    }

    match std::str::from_utf8(&result.stdout) {
        Ok(s) => Ok(s.to_owned()),
        Err(e) => Err(format!("git {} stdout is not utf8: {e}", args.join(" "))),
    }
}

async fn create_jj_data(
    revision: &mut buck2_data::VersionControlRevision,
    revision_type: RevisionDataType,
    repo_root: &AbsNormPathBuf,
) {
    match revision_type {
        RevisionDataType::CurrentRevision => get_jj_revision(revision, repo_root).await,
        RevisionDataType::Status => get_jj_status(revision, repo_root).await,
    }
}

/// The change ID of `@` on the first line, the commit IDs of its parents on
/// the second. `@` itself is the working-copy commit, whose hash is amended on
/// every snapshot; its first parent is the stable revision the build is based
/// on, and is what `git rev-parse HEAD` reports in colocated repos.
const JJ_REVISION_TEMPLATE: &str =
    r#"change_id ++ "\n" ++ parents.map(|c| c.commit_id()).join(",")"#;

async fn get_jj_revision(
    revision: &mut buck2_data::VersionControlRevision,
    repo_root: &AbsNormPathBuf,
) {
    let mut jj = buck2_data::JujutsuData::default();

    jj.version = jj_capabilities().await.version.clone();
    // Colocated repos have a `.git` repository next to `.jj`.
    jj.colocated = Some(
        async_fs_util::metadata(repo_root.join(ForwardRelativePath::new(".git").unwrap()))
            .await
            .is_ok(),
    );

    match run_jj(
        repo_root,
        &["log", "--no-graph", "-r", "@", "-T", JJ_REVISION_TEMPLATE],
    )
    .await
    {
        Ok(stdout) => match stdout.trim_end().split_once('\n') {
            Some((change_id, parents)) => {
                jj.change_id = Some(change_id.to_owned());
                // First parent only: `@` can be a merge, but `git_revision` is
                // documented as a single 40 character hash.
                match parents.split(',').next() {
                    Some(parent) if !parent.is_empty() => {
                        revision.git_revision = Some(parent.to_owned());
                    }
                    _ => add_jj_error(
                        revision,
                        format!("`jj log` reported no parents for @: {stdout:?}"),
                    ),
                }
            }
            None => add_jj_error(revision, format!("Unexpected `jj log` output: {stdout:?}")),
        },
        Err(e) => add_jj_error(revision, e),
    }

    match jj_backend(repo_root).await {
        Ok(backend) => jj.backend = Some(backend),
        Err(e) => add_jj_error(revision, e),
    }

    match jj_workspace_name(repo_root).await {
        Ok(workspace) => jj.workspace = workspace,
        Err(e) => add_jj_error(revision, e),
    }

    revision.jj = Some(jj);
}

async fn get_jj_status(
    revision: &mut buck2_data::VersionControlRevision,
    repo_root: &AbsNormPathBuf,
) {
    // `empty` is true when `@` has no changes relative to its parents. Because
    // we pass `--ignore-working-copy`, this reflects the working copy as of
    // the last time jj snapshotted it, not necessarily the files on disk:
    // edits made since the user's last jj command are not counted.
    match run_jj(
        repo_root,
        &[
            "log",
            "--no-graph",
            "-r",
            "@",
            "-T",
            r#"if(empty, "clean", "dirty")"#,
        ],
    )
    .await
    {
        Ok(stdout) => match stdout.trim() {
            "clean" => revision.has_local_changes = Some(false),
            "dirty" => revision.has_local_changes = Some(true),
            other => add_jj_error(
                revision,
                format!("Unexpected `jj log` status output: {other:?}"),
            ),
        },
        Err(e) => add_jj_error(revision, e),
    }
}

/// The jj probes are independent; keep the first error and append the rest.
fn add_jj_error(revision: &mut buck2_data::VersionControlRevision, error: String) {
    match &mut revision.command_error {
        Some(existing) => {
            existing.push_str("; ");
            existing.push_str(&error);
        }
        None => revision.command_error = Some(error),
    }
}

/// Read the backing store type (e.g. "git") from `.jj/repo/store/type`. In
/// secondary workspaces `.jj/repo` is a file whose contents are the path of
/// the real repo directory, relative to the `.jj` directory containing it.
async fn jj_backend(repo_root: &AbsNormPathBuf) -> Result<String, String> {
    let jj_dir = repo_root.join(ForwardRelativePath::new(".jj").unwrap());
    let repo_pointer = jj_dir.join(ForwardRelativePath::new("repo").unwrap());

    let metadata = async_fs_util::metadata(&repo_pointer).await.map_err(|e| {
        format!(
            "Failed to stat {}: {:#}",
            repo_pointer.display(),
            e.categorize_internal()
        )
    })?;

    let repo_dir: PathBuf = if metadata.is_dir() {
        repo_pointer.as_path().to_path_buf()
    } else {
        let contents = async_fs_util::read_to_string(&repo_pointer)
            .await
            .map_err(|e| {
                format!(
                    "Failed to read {}: {:#}",
                    repo_pointer.display(),
                    e.categorize_internal()
                )
            })?;
        let target = Path::new(contents.trim());
        if target.is_absolute() {
            target.to_path_buf()
        } else {
            jj_dir.as_path().join(target)
        }
    };

    let type_path = repo_dir.join("store").join("type");
    let type_path = AbsPath::new(&type_path)
        .map_err(|e| format!("Invalid jj store path {}: {:#}", type_path.display(), e))?;
    match async_fs_util::read_to_string(type_path).await {
        Ok(s) => Ok(s.trim().to_owned()),
        Err(e) => Err(format!(
            "Failed to read {}: {:#}",
            type_path.display(),
            e.categorize_internal()
        )),
    }
}

/// Resolve the current workspace name by matching workspace roots against
/// `repo_root`. `WorkspaceRef` templates expose no "current workspace" flag,
/// and the `working_copies` commit keyword renders empty for single-workspace
/// repos, so root matching is the only exact answer.
async fn jj_workspace_name(repo_root: &AbsNormPathBuf) -> Result<Option<String>, String> {
    let stdout = run_jj(
        repo_root,
        &["workspace", "list", "-T", r#"name ++ "\t" ++ root ++ "\n""#],
    )
    .await?;

    let workspaces: Vec<(&str, &str)> = stdout
        .lines()
        .filter_map(|line| line.split_once('\t'))
        .collect();

    let repo_root = repo_root.as_path().to_str();
    let matched = workspaces
        .iter()
        .find(|(_, root)| repo_root == Some(*root))
        .map(|(name, _)| (*name).to_owned());

    // The workspace we run in always has its root at `repo_root`, but be
    // defensive about path representation mismatches when there is no
    // ambiguity anyway.
    Ok(matched.or_else(|| match workspaces.as_slice() {
        [(name, _)] => Some((*name).to_owned()),
        _ => None,
    }))
}

struct JjCapabilities {
    /// Full `jj --version` output, unset when jj could not be executed.
    version: Option<String>,
    supports_no_integrate_operation: bool,
}

/// Probe the jj binary once per daemon: its version, and whether it supports
/// `--no-integrate-operation`. A jj that knows the flag accepts it in front of
/// `--version`; an older one fails to parse the command line, and we retry
/// without it.
async fn jj_capabilities() -> &'static JjCapabilities {
    static JJ_CAPABILITIES: OnceCell<JjCapabilities> = OnceCell::const_new();
    JJ_CAPABILITIES
        .get_or_init(|| async {
            match jj_version_output(&["--no-integrate-operation", "--version"]).await {
                Ok(version) => JjCapabilities {
                    version: Some(version),
                    supports_no_integrate_operation: true,
                },
                Err(_) => JjCapabilities {
                    version: jj_version_output(&["--version"]).await.ok(),
                    supports_no_integrate_operation: false,
                },
            }
        })
        .await
}

async fn jj_version_output(args: &[&str]) -> Result<String, String> {
    let output = reap_on_drop_command("jj", args, None)
        .map_err(|e| format!("reap_on_drop_command for `jj --version` failed: {e}"))?
        .output()
        .await
        .map_err(|e| format!("Command `jj --version` failed with error: {e:?}"))?;
    if !output.status.success() {
        return Err(format!(
            "Command `jj --version` failed with error code {}",
            output.status
        ));
    }
    match std::str::from_utf8(&output.stdout) {
        Ok(s) => Ok(s.trim().to_owned()),
        Err(e) => Err(format!("jj --version stdout is not utf8: {e}")),
    }
}

/// Run a `jj` command against the repo at `repo_root`, returning its stdout on
/// success or an error message describing the failure.
///
/// Every invocation passes `--ignore-working-copy` so the daemon never
/// snapshots (or updates) the user's working copy, and, when supported,
/// `--no-integrate-operation` so that reconciling concurrent operations does
/// not advance the operation log either: the probes are fully read-only.
async fn run_jj(repo_root: &AbsNormPathBuf, args: &[&str]) -> Result<String, String> {
    let Some(repo_root) = repo_root.as_path().to_str() else {
        return Err(format!(
            "Repository root is not valid utf8: {}",
            repo_root.as_path().display()
        ));
    };

    let mut full_args = vec![
        "-R",
        repo_root,
        "--ignore-working-copy",
        "--color=never",
        "--no-pager",
    ];
    if jj_capabilities().await.supports_no_integrate_operation {
        full_args.push("--no-integrate-operation");
    }
    full_args.extend_from_slice(args);

    let output = match reap_on_drop_command("jj", &full_args, None) {
        Ok(command) => command.output().await,
        Err(e) => {
            return Err(format!(
                "reap_on_drop_command for `jj {}` failed: {e}",
                args.join(" ")
            ));
        }
    };

    let result = match output {
        Ok(result) => result,
        Err(e) => {
            return Err(format!(
                "Command `jj {}` failed with error: {e:?}",
                args.join(" ")
            ));
        }
    };

    if !result.status.success() {
        let stderr = match std::str::from_utf8(&result.stderr) {
            Ok(s) => s,
            Err(e) => return Err(format!("jj {} stderr is not utf8: {e}", args.join(" "))),
        };
        return Err(format!(
            "Command `jj {}` failed with error code {}; stderr: {}",
            args.join(" "),
            result.status,
            stderr
        ));
    }

    match std::str::from_utf8(&result.stdout) {
        Ok(s) => Ok(s.to_owned()),
        Err(e) => Err(format!("jj {} stdout is not utf8: {e}", args.join(" "))),
    }
}

async fn repo_type(repo_root: &AbsNormPathBuf) -> buck2_error::Result<&'static RepoVcs> {
    static REPO_TYPE: OnceCell<buck2_error::Result<RepoVcs>> = OnceCell::const_new();
    async fn repo_type_impl(repo_root: &AbsNormPathBuf) -> buck2_error::Result<RepoVcs> {
        let (hg_metadata, git_metadata, jj_metadata) = tokio::join!(
            async_fs_util::metadata(repo_root.join(ForwardRelativePath::new(".hg").unwrap())),
            async_fs_util::metadata(repo_root.join(ForwardRelativePath::new(".git").unwrap())),
            async_fs_util::metadata(repo_root.join(ForwardRelativePath::new(".jj").unwrap()))
        );

        let is_hg = hg_metadata.is_ok_and(|output| output.is_dir());
        // `.git` can be a symlink or a file with contents like:
        //
        //     gitdir: /home/dog/buck2/.git/worktrees/buck3
        let is_git = git_metadata.is_ok();
        // Colocated jj repos have both `.jj` and `.git`; jj is the source of
        // truth there (it manages the git HEAD), so check it first.
        let is_jj = jj_metadata.is_ok_and(|output| output.is_dir());

        if is_jj {
            Ok(RepoVcs::Jj)
        } else if is_hg {
            Ok(RepoVcs::Hg)
        } else if is_git {
            Ok(RepoVcs::Git)
        } else {
            Ok(RepoVcs::Unknown)
        }
    }

    REPO_TYPE
        .get_or_init(|| repo_type_impl(repo_root))
        .await
        .as_ref()
        .map_err(|e| e.clone())
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Run a `git` command in `repo_root`, panicking on failure. Used to set up
    /// and inspect test repositories.
    async fn git(repo_root: &AbsNormPathBuf, args: &[&str]) -> String {
        run_git(repo_root, args)
            .await
            .unwrap_or_else(|e| panic!("`git {}` failed: {e}", args.join(" ")))
    }

    /// Initialize an empty git repo with a deterministic identity so that commits
    /// succeed even in environments without a global git config.
    async fn init_git_repo(repo_root: &AbsNormPathBuf) {
        git(repo_root, &["init", "-q"]).await;
        git(repo_root, &["config", "user.name", "Buck Test"]).await;
        git(
            repo_root,
            &["config", "user.email", "buck-test@example.com"],
        )
        .await;
        git(repo_root, &["config", "commit.gpgsign", "false"]).await;
    }

    fn temp_repo_root(temp_dir: &tempfile::TempDir) -> buck2_error::Result<AbsNormPathBuf> {
        AbsNormPathBuf::try_from(temp_dir.path().to_path_buf())
    }

    fn write_file(repo_root: &AbsNormPathBuf, name: &str, contents: &str) {
        let repo_path = std::path::Path::new(repo_root.as_path().to_str().unwrap());
        std::fs::write(repo_path.join(name), contents).unwrap();
    }

    #[tokio::test]
    async fn test_get_git_revision_matches_head() -> buck2_error::Result<()> {
        let temp_dir = tempfile::tempdir()?;
        let repo_root = temp_repo_root(&temp_dir)?;
        init_git_repo(&repo_root).await;
        write_file(&repo_root, "file.txt", "hello");
        git(&repo_root, &["add", "file.txt"]).await;
        git(&repo_root, &["commit", "-q", "-m", "initial"]).await;

        let head = git(&repo_root, &["rev-parse", "HEAD"]).await;
        let head = head.trim();

        let mut revision = VersionControlRevision::default();
        get_git_revision(&mut revision, &repo_root).await;

        assert_eq!(revision.command_error, None);
        assert_eq!(revision.git_revision.as_deref(), Some(head));
        let git_revision = revision.git_revision.unwrap();
        assert_eq!(git_revision.len(), 40);
        assert!(git_revision.chars().all(|c| c.is_ascii_hexdigit()));
        Ok(())
    }

    #[tokio::test]
    async fn test_get_git_status_clean() -> buck2_error::Result<()> {
        let temp_dir = tempfile::tempdir()?;
        let repo_root = temp_repo_root(&temp_dir)?;
        init_git_repo(&repo_root).await;
        write_file(&repo_root, "file.txt", "hello");
        git(&repo_root, &["add", "file.txt"]).await;
        git(&repo_root, &["commit", "-q", "-m", "initial"]).await;

        let mut revision = VersionControlRevision::default();
        get_git_status(&mut revision, &repo_root).await;

        assert_eq!(revision.command_error, None);
        assert_eq!(revision.has_local_changes, Some(false));
        Ok(())
    }

    /// Deterministic identity so commits succeed without user config.
    const JJ_TEST_IDENTITY: &[&str] = &[
        "--config",
        "user.name=Buck Test",
        "--config",
        "user.email=buck-test@example.com",
    ];

    /// Run a raw `jj` command, panicking on failure. These tests require the
    /// `jj` binary on PATH, matching how the git tests require `git`.
    async fn jj_raw(args: &[&str]) -> String {
        let output = reap_on_drop_command("jj", args, None)
            .unwrap_or_else(|e| panic!("reap_on_drop_command for `jj` failed: {e}"))
            .output()
            .await
            .unwrap_or_else(|e| panic!("`jj {}` failed to run: {e}", args.join(" ")));
        assert!(
            output.status.success(),
            "`jj {}` failed: {}",
            args.join(" "),
            String::from_utf8_lossy(&output.stderr)
        );
        String::from_utf8(output.stdout).unwrap()
    }

    /// Run a `jj` command against `repo_root`. Setup commands must snapshot
    /// the working copy, so unlike `run_jj` this passes no
    /// `--ignore-working-copy`.
    async fn jj(repo_root: &AbsNormPathBuf, args: &[&str]) -> String {
        let root = repo_root.as_path().to_str().unwrap();
        let mut full_args = vec!["-R", root];
        full_args.extend_from_slice(JJ_TEST_IDENTITY);
        full_args.extend_from_slice(args);
        jj_raw(&full_args).await
    }

    async fn init_jj_repo(repo_root: &AbsNormPathBuf, colocate: bool) {
        let root = repo_root.as_path().to_str().unwrap();
        let mut args = vec!["git", "init"];
        if colocate {
            args.push("--colocate");
        } else {
            // Newer jj colocates by default. The config form (unlike the
            // newer `--no-colocate` flag) is accepted-and-ignored by older
            // jj versions, which never colocate by default anyway.
            args.push("--config");
            args.push("git.colocate=false");
        }
        args.push(root);
        jj_raw(&args).await;
    }

    /// Canonicalized variant of [`temp_repo_root`]: jj records canonical
    /// workspace roots (relevant on macOS where temp dirs live behind a
    /// symlink), and `jj_workspace_name` matches roots by string equality.
    fn jj_temp_repo_root(temp_dir: &tempfile::TempDir) -> buck2_error::Result<AbsNormPathBuf> {
        AbsNormPathBuf::try_from(temp_dir.path().canonicalize()?)
    }

    #[tokio::test]
    async fn test_get_jj_revision_reports_parent_and_change_id() -> buck2_error::Result<()> {
        let temp_dir = tempfile::tempdir()?;
        let repo_root = jj_temp_repo_root(&temp_dir)?;
        init_jj_repo(&repo_root, false).await;
        write_file(&repo_root, "file.txt", "hello");
        jj(&repo_root, &["commit", "-m", "initial"]).await;

        let parent = jj(
            &repo_root,
            &["log", "--no-graph", "-r", "@-", "-T", "commit_id"],
        )
        .await;
        let change_id = jj(
            &repo_root,
            &["log", "--no-graph", "-r", "@", "-T", "change_id"],
        )
        .await;

        let mut revision = VersionControlRevision::default();
        get_jj_revision(&mut revision, &repo_root).await;

        assert_eq!(revision.command_error, None);
        assert_eq!(revision.git_revision.as_deref(), Some(parent.trim()));
        let git_revision = revision.git_revision.unwrap();
        assert_eq!(git_revision.len(), 40);
        assert!(git_revision.chars().all(|c| c.is_ascii_hexdigit()));

        let jj_data = revision.jj.unwrap();
        assert_eq!(jj_data.change_id.as_deref(), Some(change_id.trim()));
        let recorded_change_id = jj_data.change_id.unwrap();
        assert_eq!(recorded_change_id.len(), 32);
        // Change IDs use jj's reverse hex alphabet, z (0) through k (15).
        assert!(recorded_change_id.chars().all(|c| ('k'..='z').contains(&c)));
        assert_eq!(jj_data.backend.as_deref(), Some("git"));
        assert_eq!(jj_data.colocated, Some(false));
        assert_eq!(jj_data.workspace.as_deref(), Some("default"));
        assert!(jj_data.version.is_some_and(|v| v.starts_with("jj ")));
        Ok(())
    }

    #[tokio::test]
    async fn test_get_jj_revision_colocated_matches_git_head() -> buck2_error::Result<()> {
        let temp_dir = tempfile::tempdir()?;
        let repo_root = jj_temp_repo_root(&temp_dir)?;
        init_jj_repo(&repo_root, true).await;
        write_file(&repo_root, "file.txt", "hello");
        jj(&repo_root, &["commit", "-m", "initial"]).await;

        // In a colocated repo jj keeps the git HEAD at @'s first parent, so
        // the jj path must report the same hash the git path would have.
        let head = git(&repo_root, &["rev-parse", "HEAD"]).await;

        let mut revision = VersionControlRevision::default();
        get_jj_revision(&mut revision, &repo_root).await;

        assert_eq!(revision.command_error, None);
        assert_eq!(revision.git_revision.as_deref(), Some(head.trim()));
        let jj_data = revision.jj.unwrap();
        assert_eq!(jj_data.colocated, Some(true));
        assert_eq!(jj_data.backend.as_deref(), Some("git"));
        Ok(())
    }

    #[tokio::test]
    async fn test_get_jj_workspace_name_secondary_workspace() -> buck2_error::Result<()> {
        let temp_dir = tempfile::tempdir()?;
        let repo_root = jj_temp_repo_root(&temp_dir)?;
        init_jj_repo(&repo_root, false).await;
        write_file(&repo_root, "file.txt", "hello");
        jj(&repo_root, &["commit", "-m", "initial"]).await;

        let ws_dir = tempfile::tempdir()?;
        let ws_path = ws_dir.path().canonicalize()?.join("buck-test-ws");
        jj(&repo_root, &["workspace", "add", ws_path.to_str().unwrap()]).await;
        let ws_root = AbsNormPathBuf::try_from(ws_path)?;

        let mut revision = VersionControlRevision::default();
        get_jj_revision(&mut revision, &ws_root).await;

        assert_eq!(revision.command_error, None);
        let jj_data = revision.jj.unwrap();
        assert_eq!(jj_data.workspace.as_deref(), Some("buck-test-ws"));
        // `.jj/repo` is a pointer file in secondary workspaces; the backend
        // must resolve through it.
        assert_eq!(jj_data.backend.as_deref(), Some("git"));
        Ok(())
    }

    #[tokio::test]
    async fn test_get_jj_status_clean() -> buck2_error::Result<()> {
        let temp_dir = tempfile::tempdir()?;
        let repo_root = jj_temp_repo_root(&temp_dir)?;
        init_jj_repo(&repo_root, false).await;
        write_file(&repo_root, "file.txt", "hello");
        jj(&repo_root, &["commit", "-m", "initial"]).await;

        let mut revision = VersionControlRevision::default();
        get_jj_status(&mut revision, &repo_root).await;

        assert_eq!(revision.command_error, None);
        assert_eq!(revision.has_local_changes, Some(false));
        Ok(())
    }

    #[tokio::test]
    async fn test_get_jj_status_dirty_after_snapshot() -> buck2_error::Result<()> {
        let temp_dir = tempfile::tempdir()?;
        let repo_root = jj_temp_repo_root(&temp_dir)?;
        init_jj_repo(&repo_root, false).await;
        write_file(&repo_root, "file.txt", "hello");
        jj(&repo_root, &["commit", "-m", "initial"]).await;

        write_file(&repo_root, "file2.txt", "world");
        // Any jj command without --ignore-working-copy snapshots the edit.
        jj(&repo_root, &["status"]).await;

        let mut revision = VersionControlRevision::default();
        get_jj_status(&mut revision, &repo_root).await;

        assert_eq!(revision.command_error, None);
        assert_eq!(revision.has_local_changes, Some(true));
        Ok(())
    }

    #[tokio::test]
    async fn test_get_jj_status_ignores_unsnapshotted_edits() -> buck2_error::Result<()> {
        let temp_dir = tempfile::tempdir()?;
        let repo_root = jj_temp_repo_root(&temp_dir)?;
        init_jj_repo(&repo_root, false).await;
        write_file(&repo_root, "file.txt", "hello");
        jj(&repo_root, &["commit", "-m", "initial"]).await;

        write_file(&repo_root, "file2.txt", "world");

        let mut revision = VersionControlRevision::default();
        get_jj_status(&mut revision, &repo_root).await;

        // Deliberate: the daemon never snapshots, so edits made since the
        // user's last jj command are invisible to the status probe.
        assert_eq!(revision.command_error, None);
        assert_eq!(revision.has_local_changes, Some(false));
        Ok(())
    }
}
