/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is dual-licensed under either the MIT license found in the
 * LICENSE-MIT file in the root directory of this source tree or the Apache
 * License, Version 2.0 found in the LICENSE-APACHE file in the root directory
 * of this source tree. You may select, at your option, one of the
 * above-listed licenses.
 */

use buck2_e2e::prelude::*;
use buck2_e2e::utils::read_what_ran;

#[buck_test(skip_for_os = ["windows"])]
async fn test_run_capture_stdout_stderr(buck: &Buck) -> anyhow::Result<()> {
    let result = buck
        .build(&["//:capture", "//:capture[stdout]", "//:capture[stderr]"])
        .await?;
    let report = result.build_report()?;
    assert_eq!(
        std::fs::read_to_string(report.output_for_target("//:capture")?)?,
        "this is a file\n"
    );
    assert_eq!(
        std::fs::read_to_string(report.output_for_sub_target("//:capture", "stdout")?)?,
        "this is stdout\n"
    );
    assert_eq!(
        std::fs::read_to_string(report.output_for_sub_target("//:capture", "stderr")?)?,
        "this is stderr\n"
    );
    Ok(())
}

#[buck_test(skip_for_os = ["windows"])]
async fn test_run_capture_only_output(buck: &Buck) -> anyhow::Result<()> {
    // An action does not need any outputs besides its captured streams.
    let result = buck.build(&["//:capture_only"]).await?;
    let output = result
        .build_report()?
        .output_for_target("//:capture_only")?;
    assert_eq!(std::fs::read_to_string(output)?, "this is stdout\n");
    Ok(())
}

#[buck_test(skip_for_os = ["windows"])]
async fn test_run_capture_content_based_path(buck: &Buck) -> anyhow::Result<()> {
    let result = buck.build(&["//:capture_content_based"]).await?;
    let output = result
        .build_report()?
        .output_for_target("//:capture_content_based")?;
    assert_eq!(std::fs::read_to_string(output)?, "this is stdout\n");
    Ok(())
}

#[buck_test(skip_for_os = ["windows"])]
async fn test_run_capture_rebuild_is_no_op(buck: &Buck) -> anyhow::Result<()> {
    buck.build(&["//:capture"]).await?;
    let result = buck.build(&["//:capture"]).await?;
    assert!(read_what_ran(buck, &[]).await?.is_empty());
    let output = result.build_report()?.output_for_target("//:capture")?;
    assert_eq!(std::fs::read_to_string(output)?, "this is a file\n");
    Ok(())
}

#[buck_test(skip_for_os = ["windows"])]
async fn test_run_capture_same_artifact_is_error(buck: &Buck) {
    buck.build(&["//:capture_same_artifact"])
        .await
        .expect_failure()
        .assert_stderr_matches("cannot capture to the same artifact");
}

#[buck_test(skip_for_os = ["windows"])]
async fn test_run_capture_artifact_also_output_is_error(buck: &Buck) {
    buck.build(&["//:capture_also_output"])
        .await
        .expect_failure()
        .assert_stderr_matches("is also used as an output elsewhere in the action");
}
