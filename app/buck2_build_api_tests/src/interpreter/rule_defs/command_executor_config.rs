/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is dual-licensed under either the MIT license found in the
 * LICENSE-MIT file in the root directory of this source tree or the Apache
 * License, Version 2.0 found in the LICENSE-APACHE file in the root directory
 * of this source tree. You may select, at your option, one of the
 * above-listed licenses.
 */

use buck2_build_api::interpreter::rule_defs::command_executor_config::register_command_executor_config;
use buck2_interpreter_for_build::interpreter::testing::Tester;
use indoc::indoc;

#[test]
fn test_local_sandbox_paths() -> buck2_error::Result<()> {
    let mut tester = Tester::new()?;
    tester.additional_globals(register_command_executor_config);
    tester.run_starlark_bzl_test(indoc!(
        r#"
        def assert_contains(haystack, needle):
            if needle not in haystack:
                fail("expected `%s` in `%s`" % (needle, haystack))

        def test():
            configured = CommandExecutorConfig(
                local_enabled = True,
                remote_enabled = False,
                local_sandbox_mode = "landlock",
                local_sandbox_read_paths = ["/usr", "/opt/tools"],
                local_sandbox_write_paths = [],
            )
            assert_contains(
                repr(configured),
                'sandbox_paths: LocalSandboxPaths { read: Some(["/usr", "/opt/tools"]), write: Some([]) }',
            )

            default = CommandExecutorConfig(local_enabled = True, remote_enabled = False)
            assert_contains(
                repr(default),
                "sandbox_paths: LocalSandboxPaths { read: None, write: None }",
            )
        "#
    ))?;

    tester.run_starlark_bzl_test_expecting_error(
        indoc!(
            r#"
            def test():
                CommandExecutorConfig(
                    local_enabled = True,
                    remote_enabled = False,
                    local_sandbox_write_paths = ["/dev/null", "tmp"],
                )
            "#
        ),
        "Sandbox paths must be absolute, got `tmp`",
    );
    Ok(())
}
