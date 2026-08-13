/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is dual-licensed under either the MIT license found in the
 * LICENSE-MIT file in the root directory of this source tree or the Apache
 * License, Version 2.0 found in the LICENSE-APACHE file in the root directory
 * of this source tree. You may select, at your option, one of the
 * above-listed licenses.
 */

use buck2_core::io_counters::IoCounterKey;
use buck2_event_observer::humanized::HumanizedBytes;
use buck2_event_observer::re_state::NetworkStats;
use buck2_event_observer::re_state::ReState;
use buck2_event_observer::two_snapshots::TwoSnapshots;
use superconsole::Component;
use superconsole::Dimensions;
use superconsole::DrawMode;
use superconsole::Line;
use superconsole::Lines;

use crate::subscribers::superconsole::SuperConsoleConfig;

pub(crate) struct IoHeader<'s> {
    pub(crate) super_console_config: &'s SuperConsoleConfig,
    pub(crate) re_state: &'s ReState,
    pub(crate) two_snapshots: &'s TwoSnapshots,
}

impl Component for IoHeader<'_> {
    type Error = buck2_error::Error;

    fn draw_unchecked(
        &self,
        _dimensions: Dimensions,
        mode: DrawMode,
    ) -> buck2_error::Result<Lines> {
        render(
            self.two_snapshots,
            self.re_state,
            mode,
            self.super_console_config.enable_io,
        )
    }
}

pub fn io_in_flight_non_zero_counters(
    snapshot: &buck2_data::Snapshot,
) -> impl Iterator<Item = (IoCounterKey, u32)> + '_ {
    IoCounterKey::ALL
        .iter()
        .map(|key| {
            let value = match key {
                IoCounterKey::Stat => snapshot.io_in_flight_stat,
                IoCounterKey::Copy => snapshot.io_in_flight_copy,
                IoCounterKey::Symlink => snapshot.io_in_flight_symlink,
                IoCounterKey::Hardlink => snapshot.io_in_flight_hardlink,
                IoCounterKey::MkDir => snapshot.io_in_flight_mk_dir,
                IoCounterKey::ReadDir => snapshot.io_in_flight_read_dir,
                IoCounterKey::ReadDirEden => snapshot.io_in_flight_read_dir_eden,
                IoCounterKey::RmDir => snapshot.io_in_flight_rm_dir,
                IoCounterKey::RmDirAll => snapshot.io_in_flight_rm_dir_all,
                IoCounterKey::StatEden => snapshot.io_in_flight_stat_eden,
                IoCounterKey::Chmod => snapshot.io_in_flight_chmod,
                IoCounterKey::ReadLink => snapshot.io_in_flight_read_link,
                IoCounterKey::Remove => snapshot.io_in_flight_remove,
                IoCounterKey::Rename => snapshot.io_in_flight_rename,
                IoCounterKey::Read => snapshot.io_in_flight_read,
                IoCounterKey::Write => snapshot.io_in_flight_write,
                IoCounterKey::Canonicalize => snapshot.io_in_flight_canonicalize,
                IoCounterKey::EdenSettle => snapshot.io_in_flight_eden_settle,
            };
            (*key, value)
        })
        .filter(|(_, value)| *value > 0)
}

/// One memory field, rendering the running value and its peak side by side as
/// `Label = <current> (max <peak>)`. Either half is dropped when the platform or
/// the allocator does not report it, and the field disappears entirely when
/// neither is available.
fn memory_field(label: &str, current: Option<u64>, max: Option<u64>) -> Option<String> {
    match (current, max) {
        (Some(current), Some(max)) => Some(format!(
            "{label} = {} (max {})",
            HumanizedBytes::fixed_width(current),
            HumanizedBytes::new(max)
        )),
        (Some(current), None) => Some(format!(
            "{label} = {}",
            HumanizedBytes::fixed_width(current)
        )),
        (None, Some(max)) => Some(format!("Max {label} = {}", HumanizedBytes::new(max))),
        (None, None) => None,
    }
}

fn do_render(
    two_snapshots: &TwoSnapshots,
    snapshot: &buck2_data::Snapshot,
    network: Option<NetworkStats>,
) -> buck2_error::Result<Lines> {
    let mut lines = Vec::new();

    let mut allocator = Vec::new();
    // Current RSS is unavailable on non-Linux Unix platforms, so max RSS is kept
    // independent of it rather than gated on it.
    allocator.extend(memory_field(
        "RSS",
        snapshot.buck2_rss,
        (snapshot.buck2_max_rss > 0).then_some(snapshot.buck2_max_rss),
    ));
    allocator.extend(memory_field(
        "Active",
        snapshot.malloc_bytes_active,
        two_snapshots.max_malloc_bytes_active,
    ));
    allocator.extend(memory_field(
        "Allocated",
        snapshot.malloc_bytes_allocated,
        two_snapshots.max_malloc_bytes_allocated,
    ));
    if let (Some(active), Some(allocated)) = (
        snapshot.malloc_bytes_active,
        snapshot.malloc_bytes_allocated,
    ) {
        let slack = active.saturating_sub(allocated);
        let percent = if allocated == 0 {
            String::new()
        } else {
            format!(" ({:.1}%)", 100.0 * slack as f64 / allocated as f64)
        };
        allocator.push(format!("Slack = {}{}", HumanizedBytes::new(slack), percent));
    }
    if let Some(cgroup) = &snapshot.allprocs_cgroup {
        allocator.push(format!(
            "Cgroup swap = {}",
            HumanizedBytes::new(cgroup.swap_bytes)
        ));
    }
    if !allocator.is_empty() {
        lines.push(Line::unstyled(&format!("Memory: {}", allocator.join("  ")))?);
    }

    let mut parts = Vec::new();
    if let Some(stats) = network {
        parts.push(format!(
            "Network: {}",
            stats.display_up_down(DrawMode::Normal)
        ));
    }
    let user_cpu_percents = two_snapshots.user_cpu_percents();
    let system_cpu_percents = two_snapshots.system_cpu_percents();
    if user_cpu_percents.is_some() || system_cpu_percents.is_some() {
        let mut cpu_str_parts = vec!["buckd CPU".to_owned()];
        if let Some(p) = user_cpu_percents {
            cpu_str_parts.push(format!("user = {p}%"));
        }
        if let Some(p) = system_cpu_percents {
            cpu_str_parts.push(format!("system = {p}%"));
        }
        let cpu_str = cpu_str_parts.join("  ");
        parts.push(cpu_str);
    }

    if !parts.is_empty() {
        lines.push(Line::from_iter([superconsole::Span::new_unstyled(
            parts.join("  "),
        )?]));
    }

    Ok(Lines(lines))
}

fn render(
    two_snapshots: &TwoSnapshots,
    re_state: &ReState,
    draw_mode: DrawMode,
    enabled: bool,
) -> buck2_error::Result<Lines> {
    if !enabled {
        return Ok(Lines::new());
    }
    // Total network traffic shares the I/O stats line rather than living in
    // the session info block.
    let network = re_state.network_stats(two_snapshots);
    // The other stats are instantaneous and meaningless once the command is
    // over; only the network totals survive into the final render.
    if let DrawMode::Final = draw_mode {
        return Ok(Lines(
            network
                .map(|stats| {
                    Line::unstyled(&format!(
                        "Network: {}",
                        stats.display_up_down(DrawMode::Final)
                    ))
                })
                .transpose()?
                .into_iter()
                .collect(),
        ));
    }
    if let Some((_, snapshot)) = &two_snapshots.last {
        do_render(two_snapshots, snapshot, network)
    } else {
        Ok(Lines::new())
    }
}
