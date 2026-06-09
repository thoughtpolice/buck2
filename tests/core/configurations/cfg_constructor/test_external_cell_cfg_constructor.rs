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

/// `set_cfg_constructor` called from an external cell's `PACKAGE` is silently ignored: the
/// external cell has its own call, and the root cell's constructor is used instead.
#[buck_test]
async fn test_external_cell_set_cfg_constructor_silently_ignored(
    buck: &Buck,
) -> anyhow::Result<()> {
    let result = buck.cquery(&["root//:test"]).await?;
    assert!(result.stdout.contains("root//:test"));
    Ok(())
}

/// Targets in an external cell whose `PACKAGE` calls `set_cfg_constructor` still work, because
/// the call is silently ignored.
#[buck_test]
async fn test_external_cell_target_succeeds_with_cfg_constructor(
    buck: &Buck,
) -> anyhow::Result<()> {
    let result = buck.cquery(&["external_cell//:external_test"]).await?;
    assert!(result.stdout.contains("external_cell//:external_test"));
    // The external cell's constructor was not used.
    assert!(!result.stdout.contains("SHOULD_NOT_BE_USED"));
    Ok(())
}
