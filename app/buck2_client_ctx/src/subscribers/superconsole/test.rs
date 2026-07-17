/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is dual-licensed under either the MIT license found in the
 * LICENSE-MIT file in the root directory of this source tree or the Apache
 * License, Version 2.0 found in the LICENSE-APACHE file in the root directory
 * of this source tree. You may select, at your option, one of the
 * above-listed licenses.
 */

use std::collections::VecDeque;
use std::time::Duration;

use buck2_error::internal_error;
use buck2_event_observer::display;
use buck2_event_observer::test_state::TestState;
use crossterm::style::Color;
use crossterm::style::ContentStyle;
use superconsole::Component;
use superconsole::Dimensions;
use superconsole::DrawMode;
use superconsole::Line;
use superconsole::Lines;
use superconsole::Span;
use superconsole::SpanError;

use crate::subscribers::superconsole::SessionInfo;

struct TestCounterComponent;

pub struct TestCounterColumn {
    label: &'static str,
    color: Option<Color>,
    get_from_test_state: fn(&TestState) -> u64,
    get_from_test_statues: fn(
        &buck2_cli_proto::test_response::TestStatuses,
    ) -> &Option<buck2_cli_proto::CounterWithExamples>,
}

impl TestCounterColumn {
    pub const LISTING_FAIL: TestCounterColumn = TestCounterColumn {
        label: "Listing Fail",
        color: Some(Color::Red),
        get_from_test_state: |test_state| test_state.listing_failed,
        get_from_test_statues: |test_statuses| &test_statuses.listing_failed,
    };
    const DISCOVERED: TestCounterColumn = TestCounterColumn {
        label: "Discovered",
        color: None,
        get_from_test_state: |test_state| test_state.discovered,
        get_from_test_statues: |_test_statuses| &None,
    };
    pub const PASS: TestCounterColumn = TestCounterColumn {
        label: "Pass",
        color: Some(Color::Green),
        get_from_test_state: |test_state| test_state.pass,
        get_from_test_statues: |test_statuses| &test_statuses.passed,
    };
    pub const FAIL: TestCounterColumn = TestCounterColumn {
        label: "Fail",
        color: Some(Color::Red),
        get_from_test_state: |test_state| test_state.fail,
        get_from_test_statues: |test_statuses| &test_statuses.failed,
    };
    pub const FATAL: TestCounterColumn = TestCounterColumn {
        label: "Fatal",
        color: Some(Color::Red),
        get_from_test_state: |test_state| test_state.fatal,
        get_from_test_statues: |test_statuses| &test_statuses.fatals,
    };
    pub const SKIP: TestCounterColumn = TestCounterColumn {
        label: "Skip",
        color: Some(Color::Yellow),
        get_from_test_state: |test_state| test_state.skipped,
        get_from_test_statues: |test_statuses| &test_statuses.skipped,
    };
    pub const OMIT: TestCounterColumn = TestCounterColumn {
        label: "Omit",
        color: Some(Color::Magenta),
        get_from_test_state: |test_state| test_state.omitted,
        get_from_test_statues: |test_statuses| &test_statuses.omitted,
    };
    pub const TIMEOUT: TestCounterColumn = TestCounterColumn {
        label: "Timeout",
        color: Some(Color::Yellow),
        get_from_test_state: |test_state| test_state.timeout,
        get_from_test_statues: |test_statuses| &test_statuses.timed_out,
    };

    pub const INFRA_FAILURE: TestCounterColumn = TestCounterColumn {
        label: "Infra Failure",
        color: Some(Color::Magenta),
        get_from_test_state: |test_state| test_state.infra_failure,
        get_from_test_statues: |test_statuses| &test_statuses.infra_failure,
    };

    fn to_span_from_test_state(&self, test_state: &TestState) -> Result<Span, SpanError> {
        StylizedCount {
            label: self.label,
            count: (self.get_from_test_state)(test_state),
            color: self.color,
        }
        .to_span()
    }

    pub fn to_span_from_test_statuses(
        &self,
        test_statuses: &buck2_cli_proto::test_response::TestStatuses,
    ) -> buck2_error::Result<Span> {
        StylizedCount {
            label: self.label,
            count: (self.get_from_test_statues)(test_statuses)
                .as_ref()
                .ok_or_else(|| internal_error!("Missing {} in TestStatuses", self.label))?
                .count,
            color: self.color,
        }
        .to_span()
        .map_err(|e| e.into())
    }
}

impl TestCounterComponent {
    fn draw_unchecked(
        &self,
        test_state: &TestState,
        _dimensions: Dimensions,
        mode: DrawMode,
    ) -> buck2_error::Result<Lines> {
        if matches!(mode, DrawMode::Final) {
            return Ok(Lines::new());
        }

        // TODO(brasselsprouts): use the outer try_into conversion on Lines.

        // Status columns are kept in the same order as the final
        // "Tests finished:" summary printed by the test command.
        let mut spans = Vec::new();
        if test_state.listing_failed > 0 {
            spans.push(TestCounterColumn::LISTING_FAIL.to_span_from_test_state(test_state)?);
            spans.push(". ".try_into()?);
        }
        // Not every runner reports discovery (the OSS external runner does
        // not), so only show the column once something was discovered.
        if test_state.discovered > 0 {
            spans.push(TestCounterColumn::DISCOVERED.to_span_from_test_state(test_state)?);
            spans.push(". ".try_into()?);
        }
        spans.push(TestCounterColumn::PASS.to_span_from_test_state(test_state)?);
        spans.push(". ".try_into()?);
        spans.push(TestCounterColumn::FAIL.to_span_from_test_state(test_state)?);
        spans.push(". ".try_into()?);
        spans.push(TestCounterColumn::TIMEOUT.to_span_from_test_state(test_state)?);
        spans.push(". ".try_into()?);
        spans.push(TestCounterColumn::FATAL.to_span_from_test_state(test_state)?);
        spans.push(". ".try_into()?);
        spans.push(TestCounterColumn::SKIP.to_span_from_test_state(test_state)?);
        spans.push(". ".try_into()?);
        spans.push(TestCounterColumn::OMIT.to_span_from_test_state(test_state)?);
        spans.push(". ".try_into()?);
        spans.push(TestCounterColumn::INFRA_FAILURE.to_span_from_test_state(test_state)?);
        Ok(Lines::from_iter([Line::from_iter(spans)]))
    }
}

/// Draw the test summary line above the `timed_list`
pub(crate) struct TestHeader<'a> {
    pub(crate) session_info: &'a SessionInfo,
    pub(crate) test_state: &'a TestState,
}

impl Component for TestHeader<'_> {
    type Error = buck2_error::Error;

    fn draw_unchecked(
        &self,
        dimensions: superconsole::Dimensions,
        mode: superconsole::DrawMode,
    ) -> buck2_error::Result<superconsole::Lines> {
        // TPX announces a test session up front, but the internal runner and
        // the OSS external runner never report one, so also show the counters
        // once any test activity has been observed.
        if self.session_info.test_session.is_some() || self.test_state.has_activity() {
            TestCounterComponent.draw_unchecked(self.test_state, dimensions, mode)
        } else {
            Ok(Lines::new())
        }
    }
}

/// Number of finished tests retained for the streaming window. The window only
/// ever renders the most recent `max_lines`, so this just needs to comfortably
/// exceed any plausible `[ui] thread_line_limit`.
pub(crate) const FINISHED_TESTS_CAPACITY: usize = 500;

/// A finished test result retained for the streaming finished-tests window.
pub(crate) struct FinishedTest {
    status: i32,
    name: String,
    duration: Option<Duration>,
}

impl FinishedTest {
    pub(crate) fn new(result: &buck2_data::TestResult) -> Self {
        Self {
            status: result.status,
            name: result.name.clone(),
            duration: display::test_result_duration(result),
        }
    }
}

/// A bounded, live-rendered window of the most recently finished tests, drawn in
/// the style of the running-actions list. Bounded by `[ui] thread_line_limit`
/// (`max_lines`) so a large run's finished tests never grow the scrollback.
pub(crate) struct FinishedTestList<'a> {
    pub(crate) finished: &'a VecDeque<FinishedTest>,
    pub(crate) max_lines: usize,
}

impl Component for FinishedTestList<'_> {
    type Error = buck2_error::Error;

    fn draw_unchecked(&self, dimensions: Dimensions, mode: DrawMode) -> buck2_error::Result<Lines> {
        // This window is part of the ephemeral live canvas; problem results are
        // still emitted to the scrollback and the end-of-run summary is printed
        // separately, so it draws nothing on the final render.
        if matches!(mode, DrawMode::Final) || self.finished.is_empty() {
            return Ok(Lines::new());
        }

        // One row is spent on the rule above the results and one on the blank
        // line that keeps them from running into the build progress below;
        // show the most recent results in between and let older ones scroll
        // out of the window.
        let shown = self.max_lines.saturating_sub(2).min(self.finished.len());
        if shown == 0 {
            return Ok(Lines::new());
        }

        // A rule separates the window from the components above, matching the
        // running-actions list below it.
        let mut lines = vec![Line::unstyled(&"─".repeat(dimensions.width))?];
        for finished in self.finished.iter().skip(self.finished.len() - shown) {
            lines.push(display::test_result_oneline(
                finished.status,
                &finished.name,
                finished.duration,
            )?);
        }
        lines.push(Line::default());
        Ok(Lines(lines))
    }
}

pub fn span_from_build_failure_count(count: u64) -> Result<Span, SpanError> {
    StylizedCount {
        label: "Build failure",
        count,
        color: Some(Color::Red),
    }
    .to_span()
}

/// A count that receives color if and only if it's > 0
struct StylizedCount {
    label: &'static str,
    count: u64,
    color: Option<Color>,
}

impl StylizedCount {
    /// Turn this StylizedCount into a Superconsole Span.
    fn to_span(&self) -> Result<superconsole::Span, SpanError> {
        let mut style = ContentStyle::default();
        if self.count > 0 {
            style.foreground_color = self.color;
        }
        style
            .apply(format!("{} {}", self.label, self.count))
            .try_into()
    }
}

#[cfg(test)]
mod tests {
    use buck2_wrapper_common::invocation_id::TraceId;

    use super::*;

    fn session_info(test_session: Option<buck2_data::TestSessionInfo>) -> SessionInfo {
        SessionInfo {
            trace_id: TraceId::null(),
            test_session,
            legacy_dice: false,
        }
    }

    fn test_session() -> Option<buck2_data::TestSessionInfo> {
        Some(buck2_data::TestSessionInfo {
            info: "test session".to_owned(),
            test_session_id: None,
        })
    }

    fn draw(
        session_info: &SessionInfo,
        test_state: &TestState,
        mode: DrawMode,
    ) -> buck2_error::Result<String> {
        let lines = TestHeader {
            session_info,
            test_state,
        }
        .draw_unchecked(
            Dimensions {
                width: 120,
                height: 1,
            },
            mode,
        )?;
        Ok(lines.fmt_for_test().to_string())
    }

    #[test]
    fn test_hidden_without_session_or_activity() -> buck2_error::Result<()> {
        let output = draw(&session_info(None), &TestState::default(), DrawMode::Normal)?;
        assert_eq!(output, "");
        Ok(())
    }

    #[test]
    fn test_shown_on_activity_without_session() -> buck2_error::Result<()> {
        let state = TestState {
            pass: 1,
            ..TestState::default()
        };
        let output = draw(&session_info(None), &state, DrawMode::Normal)?;
        pretty_assertions::assert_eq!(
            output,
            "<span fg=green>Pass 1</span>. Fail 0. Timeout 0. Fatal 0. \
             Skip 0. Omit 0. Infra Failure 0\n"
        );
        Ok(())
    }

    #[test]
    fn test_shown_with_session_and_zero_counts() -> buck2_error::Result<()> {
        let output = draw(
            &session_info(test_session()),
            &TestState::default(),
            DrawMode::Normal,
        )?;
        pretty_assertions::assert_eq!(
            output,
            "Pass 0. Fail 0. Timeout 0. Fatal 0. Skip 0. Omit 0. Infra Failure 0\n"
        );
        Ok(())
    }

    #[test]
    fn test_column_order_matches_final_summary() -> buck2_error::Result<()> {
        let state = TestState {
            discovered: 1,
            pass: 2,
            fail: 3,
            timeout: 4,
            fatal: 5,
            skipped: 6,
            omitted: 7,
            infra_failure: 8,
            listing_failed: 9,
            ..TestState::default()
        };
        let output = draw(&session_info(None), &state, DrawMode::Normal)?;
        pretty_assertions::assert_eq!(
            output,
            "<span fg=red>Listing Fail 9</span>. Discovered 1. \
             <span fg=green>Pass 2</span>. <span fg=red>Fail 3</span>. \
             <span fg=yellow>Timeout 4</span>. <span fg=red>Fatal 5</span>. \
             <span fg=yellow>Skip 6</span>. <span fg=magenta>Omit 7</span>. \
             <span fg=magenta>Infra Failure 8</span>\n"
        );
        Ok(())
    }

    #[test]
    fn test_final_mode_renders_nothing() -> buck2_error::Result<()> {
        let state = TestState {
            pass: 1,
            ..TestState::default()
        };
        let output = draw(&session_info(test_session()), &state, DrawMode::Final)?;
        assert_eq!(output, "");
        Ok(())
    }
}
