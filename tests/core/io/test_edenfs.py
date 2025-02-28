# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under both the MIT license found in the
# LICENSE-MIT file in the root directory of this source tree and the Apache
# License, Version 2.0 found in the LICENSE-APACHE file in the root directory
# of this source tree.

# pyre-strict

import subprocess

from buck2.tests.core.common.io.file_watcher import (
    FileWatcherProvider,
    get_file_watcher_events,
)
from buck2.tests.core.common.io.file_watcher_dir_tests import (
    run_create_directory_test,
    run_remove_directory_test,
    run_rename_directory_test,
)
from buck2.tests.core.common.io.file_watcher_file_tests import (
    run_create_file_test,
    run_modify_file_test,
    run_remove_file_test,
    run_rename_file_test,
    run_replace_file_test,
)
from buck2.tests.core.common.io.file_watcher_scm_tests import (
    run_checkout_mergebase_changes_test,
    run_checkout_with_mergebase_test,
    run_rebase_with_mergebase_test,
    run_restack_with_mergebase_test,
)
from buck2.tests.core.common.io.file_watcher_tests import (
    FileSystemType,
    setup_file_watcher_test,
)

from buck2.tests.e2e_util.api.buck import Buck
from buck2.tests.e2e_util.buck_workspace import buck_test


@buck_test(setup_eden=True)
async def test_edenfs_create_file(buck: Buck) -> None:
    await run_create_file_test(
        buck, FileSystemType.EDEN_FS, FileWatcherProvider.EDEN_FS
    )


@buck_test(setup_eden=True)
async def test_edenfs_modify_file(buck: Buck) -> None:
    await run_modify_file_test(
        buck, FileSystemType.EDEN_FS, FileWatcherProvider.EDEN_FS
    )


@buck_test(setup_eden=True)
async def test_edenfs_remove_file(buck: Buck) -> None:
    await run_remove_file_test(
        buck, FileSystemType.EDEN_FS, FileWatcherProvider.EDEN_FS
    )


@buck_test(setup_eden=True)
async def test_edenfs_rename_file(buck: Buck) -> None:
    await run_rename_file_test(
        buck, FileSystemType.EDEN_FS, FileWatcherProvider.EDEN_FS
    )


# File replace is not supported on Windows
@buck_test(setup_eden=True, skip_for_os=["windows"])
async def test_edenfs_replace_file(buck: Buck) -> None:
    await run_replace_file_test(
        buck, FileSystemType.EDEN_FS, FileWatcherProvider.EDEN_FS
    )


@buck_test(setup_eden=True)
async def test_edenfs_create_directory(buck: Buck) -> None:
    await run_create_directory_test(
        buck, FileSystemType.EDEN_FS, FileWatcherProvider.EDEN_FS
    )


@buck_test(setup_eden=True)
async def test_edenfs_remove_directory(buck: Buck) -> None:
    await run_remove_directory_test(
        buck, FileSystemType.EDEN_FS, FileWatcherProvider.EDEN_FS
    )


@buck_test(setup_eden=True)
async def test_edenfs_rename_directory(buck: Buck) -> None:
    await run_rename_directory_test(
        buck, FileSystemType.EDEN_FS, FileWatcherProvider.EDEN_FS
    )


@buck_test(setup_eden=True)
async def test_edenfs_checkout_mergebase_changes(buck: Buck) -> None:
    await run_checkout_mergebase_changes_test(
        buck, FileSystemType.EDEN_FS, FileWatcherProvider.EDEN_FS
    )


@buck_test(setup_eden=True)
async def test_edenfs_checkout_with_mergebase(buck: Buck) -> None:
    await run_checkout_with_mergebase_test(
        buck, FileSystemType.EDEN_FS, FileWatcherProvider.EDEN_FS
    )


@buck_test(setup_eden=True)
async def test_edenfs_rebase_with_mergebase(buck: Buck) -> None:
    await run_rebase_with_mergebase_test(
        buck, FileSystemType.EDEN_FS, FileWatcherProvider.EDEN_FS
    )


@buck_test(setup_eden=True)
async def test_edenfs_restack_with_mergebase(buck: Buck) -> None:
    await run_restack_with_mergebase_test(
        buck, FileSystemType.EDEN_FS, FileWatcherProvider.EDEN_FS
    )


@buck_test(setup_eden=True)
async def test_edenfs_truncate_journal(buck: Buck) -> None:
    await setup_file_watcher_test(buck)
    subprocess.run(["edenfsctl", "debug", "flush_journal"], cwd=buck.cwd)

    is_fresh_instance, _ = await get_file_watcher_events(buck)
    assert is_fresh_instance
