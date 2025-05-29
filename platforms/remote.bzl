# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under both the MIT license found in the
# LICENSE-MIT file in the root directory of this source tree and the Apache
# License, Version 2.0 found in the LICENSE-APACHE file in the root directory
# of this source tree.

def _host_cpu_configuration() -> str:
    arch = host_info().arch
    if arch.is_aarch64:
        return "prelude//cpu:arm64"
    elif arch.is_arm:
        return "prelude//cpu:arm32"
    elif arch.is_i386:
        return "prelude//cpu:x86_32"
    else:
        return "prelude//cpu:x86_64"

def _host_os_configuration() -> str:
    os = host_info().os
    if os.is_macos:
        return "prelude//os:macos"
    elif os.is_windows:
        return "prelude//os:windows"
    else:
        return "prelude//os:linux"

def _platforms(ctx):
    constraints = dict()
    constraints.update(ctx.attrs._cpu[ConfigurationInfo].constraints)
    constraints.update(ctx.attrs._os[ConfigurationInfo].constraints)
    configuration = ConfigurationInfo(
        constraints = constraints,
        values = {},
    )

    name = ctx.label.raw_target()

    # FIXME (aseipp): needs to match rust-toolchain, somehow...
    image = "docker://ghcr.io/thoughtpolice/buck2:sha-829fc8b8ea40cb948dd8b2d0a5d9aba4bba652b9"
    remote_enabled = read_config("buck2_re_client", "enabled", default="false")
    if remote_enabled == "true":
        remote_enabled = True
    else:
        remote_enabled = False

    platform = ExecutionPlatformInfo(
        label = name,
        configuration = configuration,
        executor_config = CommandExecutorConfig(
            local_enabled = True,
            remote_enabled = remote_enabled,
            use_limited_hybrid = True,
            remote_execution_properties = {
                "OSFamily": "Linux",
                "container-image": image,
            },
            remote_execution_use_case = "buck2-default",
            remote_output_paths = "output_paths",
        ),
    )

    return [
        DefaultInfo(),
        platform,
        PlatformInfo(label = str(name), configuration = configuration),
        ExecutionPlatformRegistrationInfo(platforms = [platform]),
    ]

native_remote_execution_platforms = rule(
    impl = _platforms,
    attrs = {
        '_cpu': attrs.default_only(attrs.dep(providers = [ConfigurationInfo], default = _host_cpu_configuration())),
        '_os': attrs.default_only(attrs.dep(providers = [ConfigurationInfo], default = _host_os_configuration())),
    },
)
