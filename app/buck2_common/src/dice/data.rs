/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is dual-licensed under either the MIT license found in the
 * LICENSE-MIT file in the root directory of this source tree or the Apache
 * License, Version 2.0 found in the LICENSE-APACHE file in the root directory
 * of this source tree. You may select, at your option, one of the
 * above-listed licenses.
 */

//! Core data on dice

use std::sync::Arc;

use dice::DiceData;
use dice::DiceDataBuilder;
use dupe::Dupe;

use crate::cas_digest::CasDigestConfig;
use crate::io::IoProvider;

pub trait HasIoProvider {
    // TODO(bobyf) can we make this not an arc
    fn get_io_provider(&self) -> Arc<dyn IoProvider>;
}

pub trait SetIoProvider {
    fn set_io_provider(&mut self, fs: Arc<dyn IoProvider>);
}

impl HasIoProvider for DiceData {
    fn get_io_provider(&self) -> Arc<dyn IoProvider> {
        self.get::<Arc<dyn IoProvider>>()
            .expect("project filesystem should be set")
            .dupe()
    }
}

impl SetIoProvider for DiceDataBuilder {
    fn set_io_provider(&mut self, fs: Arc<dyn IoProvider>) {
        self.set(fs)
    }
}

pub mod testing {
    use buck2_core::fs::project::ProjectRootTemp;

    use super::*;
    use crate::io::fs::FsIoProvider;

    pub trait SetTestingIoProvider {
        fn set_testing_io_provider(&mut self, fs: &ProjectRootTemp);
    }

    impl SetTestingIoProvider for DiceDataBuilder {
        fn set_testing_io_provider(&mut self, fs: &ProjectRootTemp) {
            self.set_io_provider(Arc::new(FsIoProvider::new(
                fs.path().dupe(),
                CasDigestConfig::testing_default(),
            )))
        }
    }
}
