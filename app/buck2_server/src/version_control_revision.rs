/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under both the MIT license found in the
 * LICENSE-MIT file in the root directory of this source tree and the Apache
 * License, Version 2.0 found in the LICENSE-APACHE file in the root directory
 * of this source tree.
 */

use buck2_events::dispatch::EventDispatcher;
use buck2_util::properly_reaped_child::reap_on_drop_command;
use tokio::sync::OnceCell;

/// Spawn tasks to collect version control information
/// and return a droppable handle that will cancel them on drop.
pub(crate) fn spawn_version_control_collector(dispatch: EventDispatcher) -> AbortOnDropHandle {
    AbortOnDropHandle {
        handle: tokio::spawn(async move {
            let event = create_revision_data().await;
            dispatch.instant_event(event);
        }),
    }
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
    Unknown,
}

async fn create_revision_data() -> buck2_data::VersionControlRevision {
    let mut revision = buck2_data::VersionControlRevision::default();
    match repo_type().await {
        Ok(repo_vcs) => {
            match repo_vcs {
                RepoVcs::Hg => {
                    if let Err(e) = add_hg_data(&mut revision).await {
                        revision.command_error = Some(e.to_string());
                    }
                }
                RepoVcs::Git => {
                    // TODO(rajneeshl): Implement the git data
                }
                RepoVcs::Unknown => {
                    revision.command_error = Some("Unknown repository type".to_owned());
                }
            }
        }
        Err(e) => {
            revision.command_error = Some(e.to_string());
        }
    }
    revision
}

async fn add_hg_data(revision: &mut buck2_data::VersionControlRevision) -> buck2_error::Result<()> {
    // We fire 2 hg command in parallel:
    //  The `hg whereami` returns the full hash of the revision
    //  The `hg status` returns if there are any local changes
    let whereami_command = reap_on_drop_command("hg", &["whereami"])?;
    let status_command = reap_on_drop_command("hg", &["status"])?;

    let (whereami_output, status_output) =
        tokio::join!(whereami_command.output(), status_command.output());

    match whereami_output {
        Ok(result) => {
            if !result.status.success() {
                revision.command_error = Some(format!(
                    "Command `hg whereami` failed with error code {}; stderr:\n{}",
                    result.status,
                    std::str::from_utf8(&result.stderr)?
                ));
                return Ok(());
            }
            let stdout = std::str::from_utf8(&result.stdout)?.trim();
            if stdout.len() == 40 {
                revision.hg_revision = Some(stdout.to_owned());
            } else {
                revision.command_error = Some(format!("Unexpected revision : {}", stdout));
            }
        }
        Err(e) => {
            revision.command_error =
                Some(format!("Command `hg whereami` failed with error: {:?}", e));
        }
    }

    match status_output {
        Ok(result) => {
            if !result.status.success() {
                revision.command_error = Some(format!(
                    "Command `hg status` failed with error code {}; stderr:\n{}",
                    result.status,
                    std::str::from_utf8(&result.stderr)?
                ));
                return Ok(());
            }
            revision.hg_has_local_changes =
                Some(!std::str::from_utf8(&result.stdout)?.trim().is_empty());
            return Ok(());
        }
        Err(e) => {
            revision.command_error =
                Some(format!("Command `hg status` failed with error: {:?}", e));
        }
    };
    Ok(())
}

async fn repo_type() -> buck2_error::Result<&'static RepoVcs> {
    static REPO_TYPE: OnceCell<buck2_error::Result<RepoVcs>> = OnceCell::const_new();

    async fn repo_type_impl() -> buck2_error::Result<RepoVcs> {
        // Create futures for both VCS checks, wrapping the command creation in Result
        let hg_future = async {
            if let Ok(hg_command) = reap_on_drop_command("hg", &["root"]) {
                if let Ok(output) = hg_command.output().await {
                    if let Ok(stdout) = std::str::from_utf8(&output.stdout) {
                        if !stdout.trim().is_empty() {
                            return true;
                        }
                    }
                }
            }
            false
        };

        let git_future = async {
            if let Ok(git_command) =
                reap_on_drop_command("git", &["rev-parse", "--is-inside-work-tree"])
            {
                if let Ok(output) = git_command.output().await {
                    if let Ok(stdout) = std::str::from_utf8(&output.stdout) {
                        if stdout.trim() == "true" {
                            return true;
                        }
                    }
                }
            }
            false
        };

        // Run both checks in parallel
        let (is_hg, is_git) = tokio::join!(hg_future, git_future);

        // Return the first matching VCS type
        Ok(if is_hg {
            RepoVcs::Hg
        } else if is_git {
            RepoVcs::Git
        } else {
            RepoVcs::Unknown
        })
    }

    REPO_TYPE
        .get_or_init(repo_type_impl)
        .await
        .as_ref()
        .map_err(|e| e.clone())
}
