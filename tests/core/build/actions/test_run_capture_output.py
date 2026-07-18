# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is dual-licensed under either the MIT license found in the
# LICENSE-MIT file in the root directory of this source tree or the Apache
# License, Version 2.0 found in the LICENSE-APACHE file in the root directory
# of this source tree. You may select, at your option, one of the
# above-listed licenses.

# pyre-strict


from buck2.tests.e2e_util.api.buck import Buck
from buck2.tests.e2e_util.asserts import expect_failure
from buck2.tests.e2e_util.buck_workspace import buck_test
from buck2.tests.e2e_util.helper.utils import read_what_ran


@buck_test(skip_for_os=["windows"])
async def test_run_capture_stdout_stderr(buck: Buck) -> None:
    result = await buck.build(
        "//:capture",
        "//:capture[stdout]",
        "//:capture[stderr]",
    )
    report = result.get_build_report()
    assert report.output_for_target("//:capture").read_text() == "this is a file\n"
    assert (
        report.output_for_target("//:capture", "stdout").read_text()
        == "this is stdout\n"
    )
    assert (
        report.output_for_target("//:capture", "stderr").read_text()
        == "this is stderr\n"
    )


@buck_test(skip_for_os=["windows"])
async def test_run_capture_only_output(buck: Buck) -> None:
    # An action does not need any outputs besides its captured streams.
    result = await buck.build("//:capture_only")
    output = result.get_build_report().output_for_target("//:capture_only")
    assert output.read_text() == "this is stdout\n"


@buck_test(skip_for_os=["windows"])
async def test_run_capture_content_based_path(buck: Buck) -> None:
    result = await buck.build("//:capture_content_based")
    output = result.get_build_report().output_for_target("//:capture_content_based")
    assert output.read_text() == "this is stdout\n"


@buck_test(skip_for_os=["windows"])
async def test_run_capture_rebuild_is_no_op(buck: Buck) -> None:
    await buck.build("//:capture")
    result = await buck.build("//:capture")
    assert await read_what_ran(buck) == []
    output = result.get_build_report().output_for_target("//:capture")
    assert output.read_text() == "this is a file\n"


@buck_test(skip_for_os=["windows"])
async def test_run_capture_same_artifact_is_error(buck: Buck) -> None:
    await expect_failure(
        buck.build("//:capture_same_artifact"),
        stderr_regex="cannot capture to the same artifact",
    )


@buck_test(skip_for_os=["windows"])
async def test_run_capture_artifact_also_output_is_error(buck: Buck) -> None:
    await expect_failure(
        buck.build("//:capture_also_output"),
        stderr_regex="is also used as an output elsewhere in the action",
    )
