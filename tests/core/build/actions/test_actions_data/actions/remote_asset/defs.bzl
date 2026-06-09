# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is dual-licensed under either the MIT license found in the
# LICENSE-MIT file in the root directory of this source tree or the Apache
# License, Version 2.0 found in the LICENSE-APACHE file in the root directory
# of this source tree. You may select, at your option, one of the
# above-listed licenses.

def _remote_asset_impl(ctx: AnalysisContext):
    urls = ctx.attrs.urls[0] if ctx.attrs.as_single and ctx.attrs.urls else ctx.attrs.urls
    out = ctx.actions.download_remote_asset(
        ctx.label.name,
        urls,
        qualifiers = ctx.attrs.qualifiers,
        is_directory = ctx.attrs.is_directory,
        is_executable = ctx.attrs.is_executable,
        timeout_seconds = 30,
    )
    return [DefaultInfo(default_output = out)]

remote_asset = rule(
    impl = _remote_asset_impl,
    attrs = {
        "as_single": attrs.bool(default = False),
        "is_directory": attrs.bool(default = False),
        "is_executable": attrs.bool(default = False),
        "qualifiers": attrs.dict(key = attrs.string(), value = attrs.string(), sorted = False),
        "urls": attrs.list(attrs.string()),
    },
)
