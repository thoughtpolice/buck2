# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is dual-licensed under either the MIT license found in the
# LICENSE-MIT file in the root directory of this source tree or the Apache
# License, Version 2.0 found in the LICENSE-APACHE file in the root directory
# of this source tree. You may select, at your option, one of the
# above-listed licenses.

script = """
import sys;
if '--list' in sys.argv:
    print('test1\\n')
sys.exit(0)
"""

internal_script = """
import os
import sys

if '--list' in sys.argv:
    print('test1')
else:
    assert 'test1' in sys.argv
    assert os.environ['SEED']
    print('PASS')
"""

def _parse_internal_listing(stdout):
    if stdout.strip() != "test1":
        fail("unexpected listing output: {}".format(stdout))
    return [{"name": "test1", "filter": "test1"}]

def _parse_internal_result(stdout, stderr, exit_code):
    if exit_code == 0:
        return [{"name": "test1", "status": "PASS"}]
    return [{
        "name": "test1",
        "status": "FAIL",
        "message": stderr,
    }]

def _simple_test_impl(ctx):
    out = ctx.actions.declare_output("file", has_content_based_path = False)
    ctx.actions.run(
        ["touch", out.as_output()],
        category = "touch",
    )
    env = {}
    if ctx.attrs.seed:
        env["SEED"] = ctx.attrs.seed
    return [
        DefaultInfo(out),
        ExternalRunnerTestInfo(
            command = ["fbpython", "-c", script],
            use_project_relative_paths = True,
            type = "lionhead",
            supports_test_execution_caching = ctx.attrs.supports_test_execution_caching,
            env = env,
        ),
    ]

simple_test = rule(
    attrs = {
        "seed": attrs.string(default = ""),
        "supports_test_execution_caching": attrs.bool(default = False),
    },
    impl = _simple_test_impl,
)

def _internal_cache_test_impl(ctx):
    env = {"SEED": ctx.attrs.seed}
    return [
        DefaultInfo(),
        InternalRunnerTestInfo(
            type = "internal_cache_test",
            command = ["fbpython", "-c", internal_script],
            listing_command = ["fbpython", "-c", internal_script, "--list"],
            env = env,
            use_project_relative_paths = True,
            parse_test_listing = _parse_internal_listing,
            parse_test_result = _parse_internal_result,
            supports_test_execution_caching = True,
        ),
    ]

internal_cache_test = rule(
    attrs = {
        "seed": attrs.string(),
    },
    impl = _internal_cache_test_impl,
)
