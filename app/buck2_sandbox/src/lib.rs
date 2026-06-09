/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is dual-licensed under either the MIT license found in the
 * LICENSE-MIT file in the root directory of this source tree or the Apache
 * License, Version 2.0 found in the LICENSE-APACHE file in the root directory
 * of this source tree. You may select, at your option, one of the
 * above-listed licenses.
 */

#[cfg(unix)]
pub mod symlink_farm;

#[cfg(target_os = "linux")]
pub mod landlock;

use buck2_core::execution_types::executor_config::LocalSandboxMode;

/// Resolve the effective sandbox mode based on platform capabilities.
/// On non-Unix platforms, sandboxing is not available.
/// On non-Linux Unix, Landlock is not available so we fall back to Symlink.
pub fn effective_sandbox_mode(requested: LocalSandboxMode) -> LocalSandboxMode {
    match requested {
        LocalSandboxMode::Disabled => LocalSandboxMode::Disabled,
        #[cfg(not(unix))]
        _ => {
            tracing::warn!(
                "Sandbox mode `{:?}` requested but not supported on this platform, falling back to Disabled",
                requested,
            );
            LocalSandboxMode::Disabled
        }
        #[cfg(all(unix, not(target_os = "linux")))]
        LocalSandboxMode::Landlock => {
            tracing::warn!(
                "Landlock sandbox requested but not available on non-Linux, falling back to Symlink"
            );
            LocalSandboxMode::Symlink
        }
        #[cfg(all(unix, not(target_os = "linux")))]
        LocalSandboxMode::Symlink | LocalSandboxMode::Native => LocalSandboxMode::Symlink,
        #[cfg(target_os = "linux")]
        LocalSandboxMode::Landlock | LocalSandboxMode::Native => {
            if landlock::landlock_abi_version().is_some() {
                LocalSandboxMode::Landlock
            } else {
                tracing::warn!(
                    "Landlock not available on this kernel, falling back to Symlink sandbox"
                );
                LocalSandboxMode::Symlink
            }
        }
        #[cfg(target_os = "linux")]
        LocalSandboxMode::Symlink => LocalSandboxMode::Symlink,
    }
}
