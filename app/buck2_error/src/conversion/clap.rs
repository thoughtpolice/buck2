/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is dual-licensed under either the MIT license found in the
 * LICENSE-MIT file in the root directory of this source tree or the Apache
 * License, Version 2.0 found in the LICENSE-APACHE file in the root directory
 * of this source tree. You may select, at your option, one of the
 * above-listed licenses.
 */

use clap::error::ErrorKind;

use crate::conversion::from_any_with_tag;

impl From<clap::error::Error> for crate::Error {
    #[cold]
    #[track_caller]
    fn from(value: clap::error::Error) -> Self {
        match value.kind() {
            // Io/Format are issues with writing to `stderr`/`stdout`, so it shouldn't be an User Error
            // Perhaps this is more accurate as Environment Error, we can change it based on data later
            ErrorKind::Io | ErrorKind::Format => from_any_with_tag(value, crate::ErrorTag::Clap),
            _ => from_any_with_tag(value, crate::ErrorTag::Input),
        }
    }
}
