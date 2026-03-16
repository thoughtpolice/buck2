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
use std::path::Path;
use std::path::PathBuf;
use std::process::Command;

use landlock::AccessFs;
use landlock::BitFlags;
use landlock::Ruleset;
use landlock::RulesetAttr;
use landlock::RulesetCreated;
use landlock::RulesetCreatedAttr;
use landlock::make_bitflags;
use landlock::path_beneath_rules;

// Access flags matching the original hand-rolled constants exactly.
// Using `from_all(ABI::V1)` would be more restrictive (adds RemoveDir,
// RemoveFile, MakeSock, MakeFifo, MakeBlock to the handled set).
const FS_READ: BitFlags<AccessFs> = make_bitflags!(AccessFs::{
    Execute | ReadFile | ReadDir
});

const FS_WRITE: BitFlags<AccessFs> = make_bitflags!(AccessFs::{
    WriteFile | MakeChar | MakeDir | MakeReg | MakeSym
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

/// Default system paths that should be accessible to sandboxed actions.
fn default_read_paths() -> Vec<PathBuf> {
    [
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
    ]
    .iter()
    .filter(|p| Path::new(p).exists())
    .map(PathBuf::from)
    .collect()
}

fn default_read_write_paths() -> Vec<PathBuf> {
    ["/dev/null", "/dev/zero", "/dev/urandom", "/dev/random"]
        .iter()
        .filter(|p| Path::new(p).exists())
        .map(PathBuf::from)
        .collect()
}

/// Prepared Landlock rules. All path fds are opened in the parent process
/// so the pre_exec closure only needs to perform syscalls.
pub struct LandlockRules {
    ruleset: RulesetCreated,
}

impl LandlockRules {
    /// Prepare Landlock rules for a sandboxed action.
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

        // System defaults.
        let ruleset = ruleset
            .add_rules(path_beneath_rules(default_read_paths(), FS_READ))
            .map_err(|e| {
                buck2_error::buck2_error!(
                    buck2_error::ErrorTag::Environment,
                    "Landlock add default read rules: {}",
                    e
                )
            })?
            .add_rules(path_beneath_rules(
                default_read_write_paths(),
                FS_READ_WRITE,
            ))
            .map_err(|e| {
                buck2_error::buck2_error!(
                    buck2_error::ErrorTag::Environment,
                    "Landlock add default read-write rules: {}",
                    e
                )
            })?;

        // User-specified paths.
        let ruleset = ruleset
            .add_rules(path_beneath_rules(read_paths, FS_READ))
            .map_err(|e| {
                buck2_error::buck2_error!(
                    buck2_error::ErrorTag::Environment,
                    "Landlock add user read rules: {}",
                    e
                )
            })?
            .add_rules(path_beneath_rules(write_paths, FS_READ_WRITE))
            .map_err(|e| {
                buck2_error::buck2_error!(
                    buck2_error::ErrorTag::Environment,
                    "Landlock add user write rules: {}",
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
    pub fn new(read_paths: Vec<PathBuf>, write_paths: Vec<PathBuf>) -> Self {
        Self {
            read_paths: read_paths
                .into_iter()
                .map(|p| p.to_string_lossy().into_owned())
                .collect(),
            write_paths: write_paths
                .into_iter()
                .map(|p| p.to_string_lossy().into_owned())
                .collect(),
        }
    }
}
