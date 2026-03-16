/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is dual-licensed under either the MIT license found in the
 * LICENSE-MIT file in the root directory of this source tree or the Apache
 * License, Version 2.0 found in the LICENSE-APACHE file in the root directory
 * of this source tree. You may select, at your option, one of the
 * above-listed licenses.
 */

use std::collections::HashSet;
use std::path::Path;
use std::path::PathBuf;

use buck2_core::fs::project_rel_path::ProjectRelativePath;
use buck2_core::fs::project_rel_path::ProjectRelativePathBuf;
use buck2_error::BuckErrorContext;

/// A temporary directory containing only symlinks to declared inputs.
/// Actions are executed with this directory as the project root, ensuring
/// they cannot read undeclared inputs.
pub struct SymlinkFarm {
    root: tempfile::TempDir,
}

impl SymlinkFarm {
    /// Build a symlink farm.
    ///
    /// For each input path `p`, creates `sandbox_root/p` -> `project_root/p`.
    /// For each output path, creates the parent directories so the action
    /// can write to them.
    /// Also creates the working directory inside the sandbox.
    pub async fn build(
        project_root: &Path,
        inputs: &[ProjectRelativePathBuf],
        outputs: &[ProjectRelativePathBuf],
        scratch_path: Option<&ProjectRelativePathBuf>,
        working_directory: &ProjectRelativePath,
    ) -> buck2_error::Result<Self> {
        let project_root = project_root.to_owned();
        let inputs = inputs.to_vec();
        let outputs = outputs.to_vec();
        let scratch_path = scratch_path.cloned();
        let working_directory = working_directory.to_owned();

        tokio::task::spawn_blocking(move || {
            Self::build_sync(
                &project_root,
                &inputs,
                &outputs,
                scratch_path.as_ref(),
                &working_directory,
            )
        })
        .await
        .buck_error_context("Symlink farm task panicked")?
    }

    fn build_sync(
        project_root: &Path,
        inputs: &[ProjectRelativePathBuf],
        outputs: &[ProjectRelativePathBuf],
        scratch_path: Option<&ProjectRelativePathBuf>,
        working_directory: &ProjectRelativePath,
    ) -> buck2_error::Result<Self> {
        // Place sandbox under buck-out so it's on the same filesystem as
        // the project, enabling O(1) rename for output collection.
        let sandbox_base = project_root.join("buck-out/v2/tmp/sandbox");
        std::fs::create_dir_all(&sandbox_base)
            .buck_error_context("Failed to create sandbox base directory")?;

        let root = tempfile::TempDir::new_in(&sandbox_base)
            .buck_error_context("Failed to create sandbox temp directory")?;

        let sandbox_root = root.path();

        // Track which directories we've already created.
        let mut created_dirs: HashSet<PathBuf> = HashSet::new();

        let ensure_parent = |path: &Path, created_dirs: &mut HashSet<PathBuf>| -> buck2_error::Result<()> {
            if let Some(parent) = path.parent() {
                if !created_dirs.contains(parent) {
                    std::fs::create_dir_all(parent)
                        .buck_error_context("Failed to create parent directory in sandbox")?;
                    created_dirs.insert(parent.to_owned());
                }
            }
            Ok(())
        };

        // Create symlinks for inputs.
        for input in inputs {
            let sandbox_path = sandbox_root.join(input.as_str());
            let real_path = project_root.join(input.as_str());

            // Only create symlink if the target actually exists.
            if real_path.exists() {
                ensure_parent(&sandbox_path, &mut created_dirs)?;
                std::os::unix::fs::symlink(&real_path, &sandbox_path)
                    .with_buck_error_context(|| {
                        format!(
                            "Failed to symlink {} -> {}",
                            sandbox_path.display(),
                            real_path.display()
                        )
                    })?;
            }
        }

        // Create parent directories for outputs so the action can write to them.
        for output in outputs {
            let sandbox_path = sandbox_root.join(output.as_str());
            ensure_parent(&sandbox_path, &mut created_dirs)?;
        }

        // Create scratch directory if specified.
        if let Some(scratch) = scratch_path {
            let scratch_dir = sandbox_root.join(scratch.as_str());
            if !created_dirs.contains(scratch_dir.as_path()) {
                std::fs::create_dir_all(&scratch_dir)
                    .buck_error_context("Failed to create scratch directory in sandbox")?;
                created_dirs.insert(scratch_dir);
            }
        }

        // Ensure working directory exists.
        let wd = sandbox_root.join(working_directory.as_str());
        if !created_dirs.contains(wd.as_path()) {
            std::fs::create_dir_all(&wd)
                .buck_error_context("Failed to create working directory in sandbox")?;
        }

        Ok(Self { root })
    }

    /// The sandbox root path.
    pub fn root(&self) -> &Path {
        self.root.path()
    }

    /// Move outputs from sandbox back to project root.
    ///
    /// Uses rename (same-filesystem atomic move) with fallback to copy+delete
    /// for cross-device situations.
    pub async fn collect_outputs(
        &self,
        project_root: &Path,
        outputs: &[ProjectRelativePathBuf],
    ) -> buck2_error::Result<()> {
        let sandbox_root = self.root.path().to_owned();
        let project_root = project_root.to_owned();
        let outputs = outputs.to_vec();

        tokio::task::spawn_blocking(move || {
            Self::collect_outputs_sync(&sandbox_root, &project_root, &outputs)
        })
        .await
        .buck_error_context("Output collection task panicked")?
    }

    fn collect_outputs_sync(
        sandbox_root: &Path,
        project_root: &Path,
        outputs: &[ProjectRelativePathBuf],
    ) -> buck2_error::Result<()> {
        for output in outputs {
            let src = sandbox_root.join(output.as_str());
            let dst = project_root.join(output.as_str());

            if !src.exists() {
                // Output was not produced — the existing output validation
                // in the executor will catch this.
                continue;
            }

            // Ensure destination parent exists.
            if let Some(parent) = dst.parent() {
                std::fs::create_dir_all(parent).with_buck_error_context(|| {
                    format!("Failed to create output parent dir: {}", parent.display())
                })?;
            }

            // Try rename first (same filesystem, O(1)).
            match std::fs::rename(&src, &dst) {
                Ok(()) => {}
                Err(e) if e.raw_os_error() == Some(libc::EXDEV) => {
                    // Cross-device: fall back to copy.
                    if src.is_dir() {
                        copy_dir_recursive(&src, &dst)?;
                    } else {
                        std::fs::copy(&src, &dst).with_buck_error_context(|| {
                            format!(
                                "Failed to copy output {} -> {}",
                                src.display(),
                                dst.display()
                            )
                        })?;
                    }
                    // Clean up source after successful copy.
                    let _ = if src.is_dir() {
                        std::fs::remove_dir_all(&src)
                    } else {
                        std::fs::remove_file(&src)
                    };
                }
                Err(e) => {
                    return Err(buck2_error::Error::from(e)).with_buck_error_context(|| {
                        format!(
                            "Failed to move output {} -> {}",
                            src.display(),
                            dst.display()
                        )
                    });
                }
            }
        }

        Ok(())
    }
}

fn copy_dir_recursive(src: &Path, dst: &Path) -> buck2_error::Result<()> {
    std::fs::create_dir_all(dst).with_buck_error_context(|| {
        format!("Failed to create directory: {}", dst.display())
    })?;

    for entry in std::fs::read_dir(src).with_buck_error_context(|| {
        format!("Failed to read directory: {}", src.display())
    })? {
        let entry = entry.buck_error_context("Failed to read directory entry")?;
        let src_path = entry.path();
        let dst_path = dst.join(entry.file_name());

        if src_path.is_dir() {
            copy_dir_recursive(&src_path, &dst_path)?;
        } else {
            std::fs::copy(&src_path, &dst_path).with_buck_error_context(|| {
                format!(
                    "Failed to copy {} -> {}",
                    src_path.display(),
                    dst_path.display()
                )
            })?;
        }
    }

    Ok(())
}
