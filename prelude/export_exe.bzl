# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is dual-licensed under either the MIT license found in the
# LICENSE-MIT file in the root directory of this source tree or the Apache
# License, Version 2.0 found in the LICENSE-APACHE file in the root directory
# of this source tree. You may select, at your option, one of the
# above-listed licenses.

def _export_exe_impl(ctx: AnalysisContext) -> list[Provider]:
    if ctx.attrs.src and ctx.attrs.exe:
        fail("Must supply one of src or exe to export_exe")

    src = ctx.attrs.src if ctx.attrs.src else ctx.attrs.exe

    return [
        DefaultInfo(),
        RunInfo(
            args = cmd_args(src),
        ),
    ]

_export_exe = rule(
    doc = """Exports a file as an executable, for use in $(exe) macros or as a valid target for an exec_dep().
    Accepts either a string `src`, which is a relative path to a file that will be directly referenced,
    or an arg `exe` which should be a path to an executable relative to a $(location) macro.

    The first form is a more ergonomic replacement for export_file + command_alias. Eg. Instead of

    export_file(
        name = "script_sh",
        src = "bin/script.sh",
    )

    command_alias(
        name = "script.sh"
        exe = ":script_sh",
    )

    You can write

    export_exe(
        name = "script.sh",
        src = "bin/script.sh",
    )

    The latter form allows executing checked in binaries with required resources (eg. runtime shared libraries)
    without unnecessary indirection via another rule which allows args, like command_alias. Eg. instead of

    export_file(
        name = "bin"
        src = "bin",
        mode = "reference",
    )

    export_file(
        name = "exec.sh",
        src = "exec.sh",
    )

    command_alias(
        name = "compiler",
        exe = ":exec.sh", # Just calls exec $@
        args = [
            "$(location :bin)/compiler",
        ],
    )

    You can write

    export_file(
        name = "bin",
        src = "bin",
        mode = "reference",
    )

    export_exe(
        name = "compiler",
        exe = "$(location :bin)/compiler",
    )
    """,
    impl = _export_exe_impl,
    attrs = {
        "exe": attrs.option(attrs.arg(), default = None, doc = "arg which should evaluate to a path to an executable binary"),
        "src": attrs.option(attrs.source(), default = None, doc = "path to an executable binary relative to this package"),
    },
)

def export_exe(name, exe = None, src = None, **kwargs):
    # If neither `exe` nor `src` is passed, treat the target's name as the src.
    #
    #     export_exe(
    #         name = "script.sh",
    #     )
    #
    # is equivalent to:
    #
    #     export_exe(
    #         name = "script.sh",
    #         src = "script.sh",
    #     )
    #
    _export_exe(
        name = name,
        exe = exe,
        src = src if (exe or src) else name,
        **kwargs
    )
