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


@buck_test(inplace=False, data_dir="bxl/simple")
async def test_lazy_configured_target(buck: Buck) -> None:
    await buck.bxl(
        "//bxl/lazy_configured_target_node.bxl:lazy_configured_target_node_resolve",
    )


@buck_test(inplace=False, data_dir="bxl/simple")
async def test_lazy_configured_target_error(buck: Buck) -> None:
    await expect_failure(
        buck.bxl(
            "//bxl/lazy_configured_target_node.bxl:lazy_configured_target_node_resolve_error"
        ),
        stderr_regex="root//incompatible_targets:incompatible",
    )


@buck_test(inplace=False, data_dir="bxl/simple")
async def test_lazy_configured_target_catch_error(buck: Buck) -> None:
    await buck.bxl(
        "//bxl/lazy_configured_target_node.bxl:lazy_configured_target_node_resolve_catch_error",
    )


@buck_test(inplace=False, data_dir="bxl/simple")
async def test_lazy_configured_target_node_pattern(buck: Buck) -> None:
    await buck.bxl(
        "//bxl/lazy_configured_target_node.bxl:lazy_configured_target_node_pattern",
    )
