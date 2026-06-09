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

use buck2_e2e::prelude::*;

/// Writes an executable script; only the tests that run on Unix use it.
#[cfg(unix)]
fn write_executable(path: &Path, contents: &str) -> std::io::Result<()> {
    use std::os::unix::fs::PermissionsExt;
    std::fs::write(path, contents)?;
    std::fs::set_permissions(path, std::fs::Permissions::from_mode(0o755))
}

#[cfg(not(unix))]
fn write_executable(_path: &Path, _contents: &str) -> std::io::Result<()> {
    unimplemented!("executable bits are Unix-only")
}

#[buck_test]
async fn test_argfile_with_cell(buck: &Buck) -> anyhow::Result<()> {
    let res = buck
        .audit_config(&["@cell1//argfile", "--cell", "root", "foo.bar"])
        .await?;
    assert!(res.stdout.contains("bar = 1"));
    Ok(())
}

#[buck_test]
async fn test_argfile_from_cwd_cell(buck: &Buck) -> anyhow::Result<()> {
    let res = buck
        .audit_config(&["@//argfile", "--cell", "root", "foo.bar"])
        .rel_cwd("cell1")
        .await?;
    assert!(res.stdout.contains("bar = 1"));
    Ok(())
}

#[buck_test]
async fn test_executable_argfile(buck: &Buck) -> anyhow::Result<()> {
    let res = buck
        .audit_config(&[
            "@//exec_argfile.py#iphonesimulator-x86_64",
            "--cell",
            "root",
            "foo.bar",
        ])
        .await?;
    assert!(res.stdout.contains("bar = 1"));
    Ok(())
}

#[buck_test(skip_for_os = ["windows"])]
async fn test_python_argfile_interpreter(buck: &Buck, tmp_path: &Path) -> anyhow::Result<()> {
    let python = tmp_path.join("python");
    write_executable(&python, "#!/bin/sh\necho --config=foo.bar=2\n")?;
    let res = buck
        .audit_config(&[
            "@//exec_argfile.py#iphonesimulator-x86_64",
            "--cell",
            "root",
            "foo.bar",
        ])
        .env("BUCK2_ARGFILE_PYTHON", &python)
        .await?;
    assert!(res.stdout.contains("bar = 2"));
    Ok(())
}

#[buck_test(skip_for_os = ["windows"])]
async fn test_shebang_argfile(buck: &Buck) -> anyhow::Result<()> {
    write_executable(
        &buck.cwd().join("shebang_argfile"),
        "#!/bin/sh\n\
         test \"$BUCK2_ARG_FILE $*\" = \"1 --flavors opt\" || exit 1\n\
         echo --config=foo.bar=1\n",
    )?;
    let res = buck
        .audit_config(&["@//shebang_argfile#opt", "--cell", "root", "foo.bar"])
        .await?;
    assert!(res.stdout.contains("bar = 1"));
    Ok(())
}

#[buck_test]
async fn test_stdin_argfile(buck: &Buck) -> anyhow::Result<()> {
    let res = buck
        .audit_config(&["@-", "--cell", "root", "foo.bar"])
        .stdin("--config=foo.bar=1")
        .await?;
    assert!(res.stdout.contains("bar = 1"));
    Ok(())
}
