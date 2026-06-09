/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is dual-licensed under either the MIT license found in the
 * LICENSE-MIT file in the root directory of this source tree or the Apache
 * License, Version 2.0 found in the LICENSE-APACHE file in the root directory
 * of this source tree. You may select, at your option, one of the
 * above-listed licenses.
 */

//! Landlock LSM integration for kernel-enforced filesystem sandboxing.
//!
//! Uses the `landlock` crate to apply Landlock rules in a `pre_exec` hook,
//! restricting the spawned process to only declared input/output paths plus
//! essential system paths.

use std::os::unix::process::CommandExt;
use std::path::PathBuf;
use std::process::Command;

use buck2_core::execution_types::executor_config::LocalSandboxPaths;
use landlock::AccessFs;
use landlock::BitFlags;
use landlock::Ruleset;
use landlock::RulesetAttr;
use landlock::RulesetCreated;
use landlock::RulesetCreatedAttr;
use landlock::make_bitflags;
use landlock::path_beneath_rules;

// Access flags for the Landlock sandbox.
//
// FS_WRITE includes Refer (ABI v2) so that cross-directory rename/link
// operations succeed inside writable paths. Without Refer in the handled
// set, the kernel unconditionally denies all cross-directory renames with
// EXDEV — breaking tools like rustc that write to a temp file then rename.
// The crate's BestEffort mode silently drops Refer on v1-only kernels.
const FS_READ: BitFlags<AccessFs> = make_bitflags!(AccessFs::{
    Execute | ReadFile | ReadDir
});

const FS_WRITE: BitFlags<AccessFs> = make_bitflags!(AccessFs::{
    WriteFile | MakeChar | MakeDir | MakeReg | MakeSym | Refer
});

const FS_READ_WRITE: BitFlags<AccessFs> = FS_READ.union_c(FS_WRITE);

/// Detect if Landlock is available.
pub fn landlock_abi_version() -> Option<u32> {
    // Probe kernel support by attempting to create a minimal ruleset.
    // Callers only use is_some()/is_none().
    Ruleset::default()
        .handle_access(AccessFs::Execute)
        .ok()?
        .create()
        .ok()?;
    Some(1)
}

/// System paths a sandboxed action may read and execute beneath, unless its executor configures
/// its own list. Paths that don't exist are skipped when the rules are built.
pub const DEFAULT_READ_PATHS: &[&str] = &[
    "/bin",
    "/usr/bin",
    "/usr/local/bin",
    "/sbin",
    "/usr/sbin",
    "/lib",
    "/usr/lib",
    "/lib64",
    "/usr/lib64",
    "/etc",
    "/proc/self",
    "/nix/store",
];

/// System paths a sandboxed action may read and write beneath, unless its executor configures
/// its own list.
pub const DEFAULT_WRITE_PATHS: &[&str] = &["/dev/null", "/dev/zero", "/dev/urandom", "/dev/random"];

/// Prepared Landlock rules. All path fds are opened in the parent process
/// so the pre_exec closure only needs to perform syscalls.
pub struct LandlockRules {
    ruleset: RulesetCreated,
}

impl LandlockRules {
    /// Prepare Landlock rules for a sandboxed action. The action can access nothing outside
    /// these paths, so they must include the system paths it needs. [`LandlockPaths::new`] adds
    /// those.
    ///
    /// `read_paths`: paths the action is allowed to read (inputs + system paths)
    /// `write_paths`: paths the action is allowed to write (outputs + scratch)
    pub fn prepare(
        read_paths: &[PathBuf],
        write_paths: &[PathBuf],
    ) -> buck2_error::Result<Self> {
        let ruleset = Ruleset::default()
            .handle_access(FS_READ_WRITE)
            .map_err(|e| {
                buck2_error::buck2_error!(
                    buck2_error::ErrorTag::Environment,
                    "Landlock handle_access: {}",
                    e
                )
            })?
            .create()
            .map_err(|e| {
                buck2_error::buck2_error!(
                    buck2_error::ErrorTag::Environment,
                    "Landlock create ruleset: {}",
                    e
                )
            })?;

        let ruleset = ruleset
            .add_rules(path_beneath_rules(read_paths, FS_READ))
            .map_err(|e| {
                buck2_error::buck2_error!(
                    buck2_error::ErrorTag::Environment,
                    "Landlock add read rules: {}",
                    e
                )
            })?
            .add_rules(path_beneath_rules(write_paths, FS_READ_WRITE))
            .map_err(|e| {
                buck2_error::buck2_error!(
                    buck2_error::ErrorTag::Environment,
                    "Landlock add write rules: {}",
                    e
                )
            })?;

        Ok(Self { ruleset })
    }
}

/// Apply Landlock rules via `pre_exec` hook on a `Command`.
///
/// Takes ownership of `LandlockRules` because `restrict_self()` consumes the ruleset.
pub fn setup_landlock_pre_exec(cmd: &mut Command, rules: LandlockRules) {
    let mut ruleset = Some(rules.ruleset);

    // Safety: restrict_self() internally only performs prctl + landlock_restrict_self
    // syscalls + close(fd) via OwnedFd drop. No heap allocations on the happy path.
    unsafe {
        cmd.pre_exec(move || {
            if let Some(rs) = ruleset.take() {
                rs.restrict_self()
                    .map(|_status| ())
                    .map_err(|e| std::io::Error::other(e))
            } else {
                Ok(())
            }
        });
    }
}

/// Collect the read/write paths to pass to the forkserver for Landlock enforcement.
pub struct LandlockPaths {
    pub read_paths: Vec<String>,
    pub write_paths: Vec<String>,
}

impl LandlockPaths {
    /// `read_paths` and `write_paths` are the paths the action itself needs. The system paths
    /// its executor configures are added after them, or the defaults for a list left unset.
    pub fn new(
        read_paths: Vec<PathBuf>,
        write_paths: Vec<PathBuf>,
        system_paths: &LocalSandboxPaths,
    ) -> Self {
        fn with_system_paths(
            paths: Vec<PathBuf>,
            system_paths: Option<&[String]>,
            defaults: &[&str],
        ) -> Vec<String> {
            let paths = paths.into_iter().map(|p| p.to_string_lossy().into_owned());
            match system_paths {
                Some(system_paths) => paths.chain(system_paths.iter().cloned()).collect(),
                None => paths
                    .chain(defaults.iter().map(|p| (*p).to_owned()))
                    .collect(),
            }
        }

        Self {
            read_paths: with_system_paths(
                read_paths,
                system_paths.read.as_deref(),
                DEFAULT_READ_PATHS,
            ),
            write_paths: with_system_paths(
                write_paths,
                system_paths.write.as_deref(),
                DEFAULT_WRITE_PATHS,
            ),
        }
    }
}

#[cfg(test)]
mod tests {
    use std::path::Path;

    use super::*;

    /// Run `cat path` under `rules`, returning what it printed, or `None` if it failed.
    fn cat_under(rules: LandlockRules, path: &Path) -> Option<String> {
        let mut cmd = Command::new("cat");
        cmd.arg(path);
        setup_landlock_pre_exec(&mut cmd, rules);
        let output = cmd.output().expect("spawning cat");
        output
            .status
            .success()
            .then(|| String::from_utf8(output.stdout).unwrap())
    }

    #[test]
    fn test_rules_allow_only_the_given_paths() {
        if landlock_abi_version().is_none() {
            eprintln!("Landlock isn't available on this kernel, skipping");
            return;
        }

        let dir = tempfile::tempdir().unwrap();
        let file = dir.path().join("file");
        std::fs::write(&file, "hello").unwrap();

        // Every default read path except /etc, plus the temp dir.
        let read_paths: Vec<PathBuf> = DEFAULT_READ_PATHS
            .iter()
            .filter(|p| **p != "/etc")
            .map(PathBuf::from)
            .chain([dir.path().to_owned()])
            .collect();
        let prepare = || LandlockRules::prepare(&read_paths, &[]).unwrap();

        assert_eq!(cat_under(prepare(), &file).as_deref(), Some("hello"));
        assert!(
            cat_under(prepare(), Path::new("/etc/passwd")).is_none(),
            "/etc is a default read path, but it wasn't in the list, so it must be denied"
        );
    }

    #[test]
    fn test_paths_fall_back_to_defaults() {
        let paths = LandlockPaths::new(
            vec![PathBuf::from("/sandbox")],
            vec![PathBuf::from("/sandbox")],
            &LocalSandboxPaths::default(),
        );
        assert_eq!(paths.read_paths[0], "/sandbox");
        assert_eq!(&paths.read_paths[1..], DEFAULT_READ_PATHS);
        assert_eq!(paths.write_paths[0], "/sandbox");
        assert_eq!(&paths.write_paths[1..], DEFAULT_WRITE_PATHS);
    }

    #[test]
    fn test_configured_paths_replace_defaults() {
        let system_paths = LocalSandboxPaths {
            read: Some(vec!["/opt/tools".to_owned()]),
            write: Some(Vec::new()),
        };
        let paths = LandlockPaths::new(
            vec![PathBuf::from("/sandbox")],
            vec![PathBuf::from("/sandbox")],
            &system_paths,
        );
        assert_eq!(paths.read_paths, ["/sandbox", "/opt/tools"]);
        assert_eq!(paths.write_paths, ["/sandbox"]);
    }
}
