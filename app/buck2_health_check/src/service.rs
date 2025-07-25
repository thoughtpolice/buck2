/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is dual-licensed under either the MIT license found in the
 * LICENSE-MIT file in the root directory of this source tree or the Apache
 * License, Version 2.0 found in the LICENSE-APACHE file in the root directory
 * of this source tree. You may select, at your option, one of the
 * above-listed licenses.
 */

#[cfg(fbcode_build)]
pub(crate) mod health_check_rpc_client;
#[cfg(fbcode_build)]
pub mod health_check_rpc_server;

pub(crate) mod health_check_executor;
pub(crate) mod health_check_in_process_service;
