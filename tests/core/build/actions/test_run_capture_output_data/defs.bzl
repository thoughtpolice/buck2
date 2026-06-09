# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is dual-licensed under either the MIT license found in the
# LICENSE-MIT file in the root directory of this source tree or the Apache
# License, Version 2.0 found in the LICENSE-APACHE file in the root directory
# of this source tree. You may select, at your option, one of the
# above-listed licenses.

def _capture_impl(ctx):
    stdout = ctx.actions.declare_output("stdout.txt")
    stderr = ctx.actions.declare_output("stderr.txt")
    out = ctx.actions.declare_output("out.txt")
    ctx.actions.run(
        ["sh", ctx.attrs.script, out.as_output()],
        category = "test",
        local_only = True,
        stdout = stdout.as_output(),
        stderr = stderr.as_output(),
    )
    return [DefaultInfo(
        default_output = out,
        sub_targets = {
            "stderr": [DefaultInfo(default_output = stderr)],
            "stdout": [DefaultInfo(default_output = stdout)],
        },
    )]

capture = rule(
    impl = _capture_impl,
    attrs = {"script": attrs.source()},
)

# An action whose only output is its captured stdout.
def _capture_only_impl(ctx):
    stdout = ctx.actions.declare_output("stdout.txt")
    ctx.actions.run(
        ["sh", ctx.attrs.script],
        category = "test",
        local_only = True,
        stdout = stdout.as_output(),
    )
    return [DefaultInfo(default_output = stdout)]

capture_only = rule(
    impl = _capture_only_impl,
    attrs = {"script": attrs.source()},
)

def _capture_content_based_impl(ctx):
    stdout = ctx.actions.declare_output("stdout.txt", has_content_based_path = True)
    ctx.actions.run(
        ["sh", ctx.attrs.script],
        category = "test",
        local_only = True,
        stdout = stdout.as_output(),
    )
    return [DefaultInfo(default_output = stdout)]

capture_content_based = rule(
    impl = _capture_content_based_impl,
    attrs = {"script": attrs.source()},
)

# Analysis error: the same artifact cannot capture both streams.
def _capture_same_artifact_impl(ctx):
    log = ctx.actions.declare_output("log")
    ctx.actions.run(
        ["sh", ctx.attrs.script],
        category = "test",
        stdout = log.as_output(),
        stderr = log.as_output(),
    )
    return [DefaultInfo(default_output = log)]

capture_same_artifact = rule(
    impl = _capture_same_artifact_impl,
    attrs = {"script": attrs.source()},
)

# Analysis error: a capture artifact cannot also be an output on the command line.
def _capture_also_output_impl(ctx):
    out = ctx.actions.declare_output("out")
    ctx.actions.run(
        ["sh", ctx.attrs.script, out.as_output()],
        category = "test",
        stdout = out.as_output(),
    )
    return [DefaultInfo(default_output = out)]

capture_also_output = rule(
    impl = _capture_also_output_impl,
    attrs = {"script": attrs.source()},
)
