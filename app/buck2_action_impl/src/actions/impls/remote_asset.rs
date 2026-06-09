/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is dual-licensed under either the MIT license found in the
 * LICENSE-MIT file in the root directory of this source tree or the Apache
 * License, Version 2.0 found in the LICENSE-APACHE file in the root directory
 * of this source tree. You may select, at your option, one of the
 * above-listed licenses.
 */

use std::borrow::Cow;
use std::slice;
use std::sync::Arc;
use std::time::Duration;

use allocative::Allocative;
use async_trait::async_trait;
use buck2_artifact::artifact::build_artifact::BuildArtifact;
use buck2_build_api::actions::Action;
use buck2_build_api::actions::ActionExecutionCtx;
use buck2_build_api::actions::UnregisteredAction;
use buck2_build_api::actions::execute::action_executor::ActionExecutionKind;
use buck2_build_api::actions::execute::action_executor::ActionExecutionMetadata;
use buck2_build_api::actions::execute::action_executor::ActionOutputs;
use buck2_build_api::actions::execute::error::ExecuteError;
use buck2_build_api::artifact_groups::ArtifactGroup;
use buck2_build_signals::env::WaitingData;
use buck2_common::file_ops::metadata::FileDigest;
use buck2_common::file_ops::metadata::FileMetadata;
use buck2_common::file_ops::metadata::TrackedFileDigest;
use buck2_common::io::trace::TracingIoProvider;
use buck2_core::category::CategoryRef;
use buck2_core::execution_types::executor_config::RemoteExecutorUseCase;
use buck2_error::BuckErrorContext;
use buck2_execute::artifact_value::ArtifactValue;
use buck2_execute::digest::CasDigestFromReExt;
use buck2_execute::digest::CasDigestToReExt;
use buck2_execute::directory::ActionDirectoryEntry;
use buck2_execute::directory::INTERNER;
use buck2_execute::directory::re_directory_to_re_tree;
use buck2_execute::directory::re_tree_to_directory;
use buck2_execute::execute::command_executor::ActionExecutionTimingData;
use buck2_execute::materialize::materializer::CasDownloadInfo;
use buck2_execute::materialize::materializer::DeclareArtifactPayload;
use buck2_hash::BuckIndexSet;
use chrono::DateTime;
use chrono::Utc;
use dupe::Dupe;
use pagable::Pagable;
use pagable::pagable_typetag;
use remote_execution as RE;
use starlark::values::OwnedFrozenValue;

use crate::actions::impls::offline;

#[derive(Debug, buck2_error::Error)]
#[buck2(tag = Input)]
enum RemoteAssetActionError {
    #[error("A Remote Asset action must have exactly one output, got {0}")]
    WrongNumberOfOutputs(usize),
}

#[derive(Debug, Allocative, Pagable)]
pub(crate) struct UnregisteredRemoteAssetAction {
    pub(crate) uris: Vec<String>,
    pub(crate) qualifiers: Vec<(String, String)>,
    pub(crate) is_directory: bool,
    pub(crate) is_executable: bool,
    pub(crate) timeout_seconds: Option<u64>,
    pub(crate) re_use_case: RemoteExecutorUseCase,
}

impl UnregisteredAction for UnregisteredRemoteAssetAction {
    fn register(
        self: Box<Self>,
        outputs: BuckIndexSet<BuildArtifact>,
        _starlark_data: Option<OwnedFrozenValue>,
        _error_handler: Option<OwnedFrozenValue>,
    ) -> buck2_error::Result<Box<dyn Action>> {
        Ok(Box::new(RemoteAssetAction::new(outputs, *self)?))
    }
}

#[derive(Debug, Allocative, Pagable)]
struct RemoteAssetAction {
    output: BuildArtifact,
    inner: UnregisteredRemoteAssetAction,
}

impl RemoteAssetAction {
    fn new(
        outputs: BuckIndexSet<BuildArtifact>,
        inner: UnregisteredRemoteAssetAction,
    ) -> buck2_error::Result<Self> {
        let outputs_len = outputs.len();
        let mut outputs = outputs.into_iter();
        match (outputs.next(), outputs.next()) {
            (Some(output), None) => Ok(Self { output, inner }),
            _ => Err(RemoteAssetActionError::WrongNumberOfOutputs(outputs_len).into()),
        }
    }

    async fn execute_for_offline(
        &self,
        ctx: &mut dyn ActionExecutionCtx,
    ) -> buck2_error::Result<(ActionOutputs, ActionExecutionMetadata)> {
        let outputs = offline::declare_copy_from_offline_cache(ctx, &[&self.output]).await?;
        Ok((
            outputs,
            ActionExecutionMetadata {
                execution_kind: ActionExecutionKind::Deferred,
                timing: ActionExecutionTimingData::default(),
                input_files_bytes: None,
                waiting_data: WaitingData::new(),
            },
        ))
    }

    async fn artifact_value(
        &self,
        ctx: &mut dyn ActionExecutionCtx,
        digest: FileDigest,
        expires_at: DateTime<Utc>,
    ) -> buck2_error::Result<ArtifactValue> {
        if self.inner.is_directory {
            let re_client = ctx.re_client().with_use_case(self.inner.re_use_case);
            let root_directory = re_client
                .download_typed_blobs::<RE::Directory>(None, vec![digest.to_re()])
                .await?
                .into_iter()
                .next()
                .ok_or_else(|| {
                    buck2_error::internal_error!(
                        "CAS returned no Directory for Remote Asset digest {}",
                        digest
                    )
                })?;
            let tree = re_directory_to_re_tree(root_directory, &re_client).await?;
            let directory = re_tree_to_directory(
                &tree,
                &expires_at,
                ctx.digest_config(),
                ctx.output_trees_download_config()
                    .fingerprint_re_output_trees_eagerly(),
            )
            .buck_error_context("Invalid directory returned by Remote Asset")?;

            Ok(ArtifactValue::new(
                ActionDirectoryEntry::Dir(
                    directory
                        .fingerprint(ctx.digest_config().as_directory_serializer())
                        .shared(&*INTERNER),
                ),
                None,
            ))
        } else {
            let digest = TrackedFileDigest::new_expires(
                digest,
                expires_at,
                ctx.digest_config().cas_digest_config(),
            );
            Ok(ArtifactValue::file(FileMetadata {
                digest,
                is_executable: self.inner.is_executable,
            }))
        }
    }
}

#[pagable_typetag]
#[async_trait]
impl Action for RemoteAssetAction {
    fn kind(&self) -> buck2_data::ActionKind {
        buck2_data::ActionKind::RemoteAsset
    }

    fn inputs(&self) -> buck2_error::Result<Cow<'_, [ArtifactGroup]>> {
        Ok(Cow::Borrowed(&[]))
    }

    fn outputs(&self) -> Cow<'_, [BuildArtifact]> {
        Cow::Borrowed(slice::from_ref(&self.output))
    }

    fn first_output(&self) -> &BuildArtifact {
        &self.output
    }

    fn category(&self) -> CategoryRef<'_> {
        CategoryRef::unchecked_new("remote_asset")
    }

    fn identifier(&self) -> Option<&str> {
        Some(self.output.get_path().path().as_str())
    }

    async fn execute(
        &self,
        ctx: &mut dyn ActionExecutionCtx,
        waiting_data: WaitingData,
    ) -> Result<(ActionOutputs, ActionExecutionMetadata), ExecuteError> {
        if ctx.run_action_knobs().use_network_action_output_cache {
            return self.execute_for_offline(ctx).await.map_err(Into::into);
        }

        let response = ctx
            .re_client()
            .with_use_case(self.inner.re_use_case)
            .fetch_remote_asset(
                self.inner.uris.clone(),
                self.inner.qualifiers.clone(),
                self.inner.is_directory,
                ctx.digest_config()
                    .cas_digest_config()
                    .preferred_algorithm(),
                self.inner.timeout_seconds.map(Duration::from_secs),
            )
            .await
            .with_buck_error_context(|| {
                format!(
                    "Error fetching Remote Asset from {}",
                    self.inner.uris.join(", ")
                )
            })?;

        let digest = FileDigest::from_re(&response.digest, ctx.digest_config())
            .buck_error_context("Invalid digest returned by Remote Asset")?;
        let expires_at = response.expires_at.unwrap_or(DateTime::<Utc>::UNIX_EPOCH);
        let value = self.artifact_value(ctx, digest, expires_at).await?;

        let path = ctx.fs().resolve_build(
            self.output.get_path(),
            if self.output.get_path().is_content_based_path() {
                Some(value.content_based_path_hash())
            } else {
                None
            }
            .as_ref(),
        )?;
        let configuration_path = ctx
            .materializer()
            .maybe_eager_configuration_path(ctx.fs(), self.output.get_path())?;
        ctx.materializer()
            .declare_cas_many(
                Arc::new(CasDownloadInfo::new_declared(self.inner.re_use_case)),
                vec![DeclareArtifactPayload {
                    path,
                    artifact: value.dupe(),
                    configuration_path,
                }],
            )
            .await?;

        let io_provider = ctx.io_provider();
        if let Some(tracer) = TracingIoProvider::from_io(&*io_provider) {
            let offline_cache_path =
                offline::declare_copy_to_offline_output_cache(ctx, &self.output, value.dupe())
                    .await?;
            tracer.add_buck_out_entry(offline_cache_path);
        }

        Ok((
            ActionOutputs::from_single(self.output.get_path().dupe(), value),
            ActionExecutionMetadata {
                execution_kind: ActionExecutionKind::Deferred,
                timing: ActionExecutionTimingData::default(),
                input_files_bytes: None,
                waiting_data,
            },
        ))
    }
}
