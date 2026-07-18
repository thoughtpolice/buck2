# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is dual-licensed under either the MIT license found in the
# LICENSE-MIT file in the root directory of this source tree or the Apache
# License, Version 2.0 found in the LICENSE-APACHE file in the root directory
# of this source tree. You may select, at your option, one of the
# above-listed licenses.

load("@prelude//rust:clippy_configuration.bzl", native_clippy_configuration = "clippy_configuration")

def clippy_configuration(name, clippy_toml_src, **kwargs):
    # buck2 fork: keep passing the placeholder upstream dropped in da1ae56c41. The
    # `bootstrap/buck2` release bundles a prelude from before that commit, where
    # `toml_merge_tool` is still required, so without it every BUCK file calling this
    # fails to evaluate. The in-repo prelude accepts it either way. Drop this once
    # `bootstrap/buck2` points at a release cut after 2026-10-07.
    native_clippy_configuration(name = name, clippy_toml_src = clippy_toml_src, toml_merge_tool = "prelude//:none", **kwargs)
