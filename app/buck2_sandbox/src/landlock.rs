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
//! Uses raw syscalls via `libc` to apply Landlock rules in a `pre_exec` hook,
//! restricting the spawned process to only declared input/output paths plus
//! essential system paths.

use std::os::fd::RawFd;
use std::os::unix::io::AsRawFd;
use std::os::unix::process::CommandExt;
use std::path::Path;
use std::path::PathBuf;
use std::process::Command;
use std::sync::Arc;

// Landlock ABI constants (from linux/landlock.h).
const LANDLOCK_CREATE_RULESET_VERSION: u32 = 1 << 0;

// Access rights for files (ABI v1+).
const LANDLOCK_ACCESS_FS_EXECUTE: u64 = 1 << 0;
const LANDLOCK_ACCESS_FS_WRITE_FILE: u64 = 1 << 1;
const LANDLOCK_ACCESS_FS_READ_FILE: u64 = 1 << 2;
const LANDLOCK_ACCESS_FS_READ_DIR: u64 = 1 << 3;
// const LANDLOCK_ACCESS_FS_REMOVE_DIR: u64 = 1 << 4;
// const LANDLOCK_ACCESS_FS_REMOVE_FILE: u64 = 1 << 5;
const LANDLOCK_ACCESS_FS_MAKE_CHAR: u64 = 1 << 6;
const LANDLOCK_ACCESS_FS_MAKE_DIR: u64 = 1 << 7;
const LANDLOCK_ACCESS_FS_MAKE_REG: u64 = 1 << 8;
// const LANDLOCK_ACCESS_FS_MAKE_SOCK: u64 = 1 << 9;
// const LANDLOCK_ACCESS_FS_MAKE_FIFO: u64 = 1 << 10;
// const LANDLOCK_ACCESS_FS_MAKE_BLOCK: u64 = 1 << 11;
const LANDLOCK_ACCESS_FS_MAKE_SYM: u64 = 1 << 12;

const LANDLOCK_RULE_PATH_BENEATH: libc::c_int = 1;

const LANDLOCK_ACCESS_FS_READ: u64 =
    LANDLOCK_ACCESS_FS_READ_FILE | LANDLOCK_ACCESS_FS_READ_DIR | LANDLOCK_ACCESS_FS_EXECUTE;

const LANDLOCK_ACCESS_FS_WRITE: u64 = LANDLOCK_ACCESS_FS_WRITE_FILE
    | LANDLOCK_ACCESS_FS_MAKE_CHAR
    | LANDLOCK_ACCESS_FS_MAKE_DIR
    | LANDLOCK_ACCESS_FS_MAKE_REG
    | LANDLOCK_ACCESS_FS_MAKE_SYM;

const LANDLOCK_ACCESS_FS_READ_WRITE: u64 = LANDLOCK_ACCESS_FS_READ | LANDLOCK_ACCESS_FS_WRITE;

/// Kernel structs for Landlock syscalls.
#[repr(C)]
struct LandlockRulesetAttr {
    handled_access_fs: u64,
    _handled_access_net: u64,
}

#[repr(C)]
struct LandlockPathBeneathAttr {
    allowed_access: u64,
    parent_fd: RawFd,
}

/// Detect if Landlock is available and which ABI version.
pub fn landlock_abi_version() -> Option<u32> {
    let attr = LandlockRulesetAttr {
        handled_access_fs: 0,
        _handled_access_net: 0,
    };
    let ret = unsafe {
        libc::syscall(
            libc::SYS_landlock_create_ruleset,
            &attr as *const LandlockRulesetAttr,
            std::mem::size_of::<LandlockRulesetAttr>(),
            LANDLOCK_CREATE_RULESET_VERSION,
        )
    };
    if ret >= 0 {
        Some(ret as u32)
    } else {
        None
    }
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

/// Pre-opened file descriptor for a path, to be used inside a pre_exec closure.
struct PreOpenedFd {
    fd: RawFd,
    access: u64,
}

impl Drop for PreOpenedFd {
    fn drop(&mut self) {
        unsafe {
            libc::close(self.fd);
        }
    }
}

/// Prepared Landlock rules. All path open() calls happen here (in the parent
/// process), so the pre_exec closure only needs to use the pre-opened fds.
pub struct LandlockRules {
    fds: Vec<PreOpenedFd>,
    handled_access_fs: u64,
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
        let handled_access_fs = LANDLOCK_ACCESS_FS_READ_WRITE;

        let mut fds = Vec::new();

        // System defaults.
        for path in default_read_paths() {
            if let Some(fd) = open_path_fd(&path) {
                fds.push(PreOpenedFd {
                    fd,
                    access: LANDLOCK_ACCESS_FS_READ,
                });
            }
        }
        for path in default_read_write_paths() {
            if let Some(fd) = open_path_fd(&path) {
                fds.push(PreOpenedFd {
                    fd,
                    access: LANDLOCK_ACCESS_FS_READ_WRITE,
                });
            }
        }

        // User-specified read paths.
        for path in read_paths {
            if let Some(fd) = open_path_fd(path) {
                fds.push(PreOpenedFd {
                    fd,
                    access: LANDLOCK_ACCESS_FS_READ,
                });
            }
        }

        // User-specified write paths.
        for path in write_paths {
            if let Some(fd) = open_path_fd(path) {
                fds.push(PreOpenedFd {
                    fd,
                    access: LANDLOCK_ACCESS_FS_READ_WRITE,
                });
            }
        }

        Ok(Self {
            fds,
            handled_access_fs,
        })
    }
}

fn open_path_fd(path: &Path) -> Option<RawFd> {
    let file = std::fs::File::options()
        .read(true)
        .open(path)
        .ok()?;
    // Intentionally leak the file; we manage the fd manually.
    let fd = file.as_raw_fd();
    std::mem::forget(file);
    Some(fd)
}

/// Apply Landlock rules via `pre_exec` hook on a `Command`.
///
/// The pre_exec closure captures the `Arc<LandlockRules>` and only performs
/// syscalls (no allocation), following the pattern from `Cgroup::setup_command`.
pub fn setup_landlock_pre_exec(cmd: &mut Command, rules: &Arc<LandlockRules>) {
    let rules = rules.clone();

    // Safety: The closure only performs syscalls, which are async-signal-safe.
    // No allocations or complex operations that could deadlock after fork.
    unsafe {
        cmd.pre_exec(move || {
            apply_landlock_rules(&rules)
                .map_err(|e| std::io::Error::new(std::io::ErrorKind::PermissionDenied, e))
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

/// Apply Landlock rules inside a pre_exec closure (async-signal-safe).
fn apply_landlock_rules(rules: &LandlockRules) -> Result<(), String> {
    // 1. Create ruleset.
    let attr = LandlockRulesetAttr {
        handled_access_fs: rules.handled_access_fs,
        _handled_access_net: 0,
    };
    let ruleset_fd = unsafe {
        libc::syscall(
            libc::SYS_landlock_create_ruleset,
            &attr as *const LandlockRulesetAttr,
            std::mem::size_of::<LandlockRulesetAttr>(),
            0u32,
        )
    };
    if ruleset_fd < 0 {
        return Err("landlock_create_ruleset failed".to_owned());
    }
    let ruleset_fd = ruleset_fd as RawFd;

    // 2. Add rules for each pre-opened fd.
    for pre_opened in &rules.fds {
        let path_beneath = LandlockPathBeneathAttr {
            allowed_access: pre_opened.access,
            parent_fd: pre_opened.fd,
        };
        let ret = unsafe {
            libc::syscall(
                libc::SYS_landlock_add_rule,
                ruleset_fd,
                LANDLOCK_RULE_PATH_BENEATH,
                &path_beneath as *const LandlockPathBeneathAttr,
                0u32,
            )
        };
        if ret < 0 {
            unsafe { libc::close(ruleset_fd) };
            return Err("landlock_add_rule failed".to_owned());
        }
    }

    // 3. Required before restrict_self.
    let ret = unsafe { libc::prctl(libc::PR_SET_NO_NEW_PRIVS, 1, 0, 0, 0) };
    if ret < 0 {
        unsafe { libc::close(ruleset_fd) };
        return Err("prctl(PR_SET_NO_NEW_PRIVS) failed".to_owned());
    }

    // 4. Enforce.
    let ret = unsafe {
        libc::syscall(libc::SYS_landlock_restrict_self, ruleset_fd, 0u32)
    };
    unsafe { libc::close(ruleset_fd) };
    if ret < 0 {
        return Err("landlock_restrict_self failed".to_owned());
    }

    Ok(())
}
