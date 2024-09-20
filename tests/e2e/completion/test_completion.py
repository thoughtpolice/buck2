# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under both the MIT license found in the
# LICENSE-MIT file in the root directory of this source tree and the Apache
# License, Version 2.0 found in the LICENSE-APACHE file in the root directory
# of this source tree.

# pyre-strict

import os
import platform
import subprocess
from pathlib import Path

from buck2.tests.e2e_util.api.buck import Buck
from buck2.tests.e2e_util.buck_workspace import buck_test

# FIXME(JakobDegen): `zsh` not avaialable on Linux CI
# FIXME(JakobDegen): `fish` not avaialable on any CI
SHELLS = ["bash", "zsh"] if platform.system() == "Darwin" else ["bash"]


def completion_test(
    name: str,
    input: str,
    expected: list[str],
    shells: list[str] = SHELLS,
) -> None:
    async def impl(buck: Buck) -> None:
        tmp_path = Path(buck.cwd).parent / "tmp"
        tmp_path.mkdir(exist_ok=True)

        verify_bin = Path(os.environ["BUCK2_COMPLETION_VERIFY"])

        for shell in shells:
            if shell not in SHELLS:
                continue
            get_completions = await buck.completion(shell)
            completions_path = tmp_path / f"completion.{shell}"
            completions_path.write_text(get_completions.stdout)

            shell_home = (tmp_path / f"{shell}_tmp").absolute()
            shell_home.mkdir(exist_ok=True)

            # Write this to a script to make it easier to debug with `BUCK_E2E_KEEP_TMP=1`
            script = "\n".join(
                [
                    "#!/bin/sh",
                    f'export PATH="{buck.path_to_executable.parent.absolute()}:$PATH"',
                    "export BUCK2_COMPLETION_TIMEOUT=30000",
                    f"rm -r -- {shell_home}/*",
                    f"{verify_bin.absolute()} {shell} {completions_path.absolute()} {shell_home}",
                ]
            )
            script_path = tmp_path / f"test_{shell}.sh"
            script_path.write_text(script)
            script_path.chmod(0o755)

            actual = subprocess.check_output(
                script_path.absolute(),
                input="buck2 " + input,
                text=True,
                cwd=buck.cwd,
            )
            actual = actual.strip().split("\n")
            assert actual == expected, "testing shell: " + shell

    globals()[name] = buck_test(inplace=False)(impl)


completion_test(
    name="test_completes_simple_partial_directory",
    input="build d",
    expected=["dir1/", "dir1:", "dir2/"],
)

completion_test(
    name="test_completes_simple_directory",
    input="build dir",
    expected=["dir1/", "dir1:", "dir2/"],
)

completion_test(
    name="test_completes_simple_cells",
    input="build cell",
    expected=["cell2a//", "cell2a//:", "cell3//", "cell3//:"],
)

# FIXME(JakobDegen): Why doesn't this output the same thing as zsh?
completion_test(
    name="test_completes_rule_bash",
    input="build dir1:target1",
    expected=["target1a", "target1b"],
    shells=["bash"],
)

completion_test(
    name="test_completes_rule_zsh",
    input="build dir1:target1",
    expected=["dir1:target1a", "dir1:target1b"],
    shells=["zsh"],
)