/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is dual-licensed under either the MIT license found in the
 * LICENSE-MIT file in the root directory of this source tree or the Apache
 * License, Version 2.0 found in the LICENSE-APACHE file in the root directory
 * of this source tree. You may select, at your option, one of the
 * above-listed licenses.
 */

//! Per-thread allocated/deallocated byte counters for allocators that do not keep their own.
//!
//! jemalloc keeps cumulative per-thread totals (`thread.allocatedp` / `thread.deallocatedp`),
//! which DICE reads around paging work to attribute the memory it moves. mimalloc has no
//! equivalent: its release build compiles byte statistics out, and its stats getters aggregate
//! per heap or per process. [`CountingAlloc`] wraps any [`GlobalAlloc`] and keeps the same two
//! totals in thread-locals, with the same attribution: a free counts on the thread that frees,
//! whichever thread allocated.
//!
//! Sizes are the requested `Layout` sizes, not the allocator's size classes, so totals run a
//! little below what jemalloc reports for the same work. Only differences over a window are
//! meaningful anyway.

use std::alloc::GlobalAlloc;
use std::alloc::Layout;
use std::cell::Cell;
use std::sync::atomic::AtomicBool;
use std::sync::atomic::Ordering;

struct Counters {
    allocated: Cell<u64>,
    deallocated: Cell<u64>,
}

thread_local! {
    // `const` initialization and no `Drop` keep this usable from inside the allocator: access
    // never allocates, never registers a destructor, and stays valid while the thread exits.
    static COUNTERS: Counters = const {
        Counters {
            allocated: Cell::new(0),
            deallocated: Cell::new(0),
        }
    };
}

/// Set once the process's global allocator is a [`CountingAlloc`], so that
/// [`thread_alloc_counters`] can tell "no counting" apart from "counted nothing".
static INSTALLED: AtomicBool = AtomicBool::new(false);

#[inline]
fn add_allocated(bytes: usize) {
    let _ignored = COUNTERS.try_with(|c| {
        c.allocated
            .set(c.allocated.get().wrapping_add(bytes as u64))
    });
}

#[inline]
fn add_deallocated(bytes: usize) {
    let _ignored = COUNTERS.try_with(|c| {
        c.deallocated
            .set(c.deallocated.get().wrapping_add(bytes as u64))
    });
}

/// A [`GlobalAlloc`] that forwards to `A` and counts bytes per thread.
pub struct CountingAlloc<A> {
    inner: A,
}

impl<A> CountingAlloc<A> {
    pub const fn new(inner: A) -> Self {
        Self { inner }
    }

    /// Declares that this is the process's `#[global_allocator]`. Call it early in `main`.
    /// Until it is called, [`thread_alloc_counters`] returns `None`.
    pub fn mark_installed(&self) {
        INSTALLED.store(true, Ordering::Relaxed);
    }
}

unsafe impl<A: GlobalAlloc> GlobalAlloc for CountingAlloc<A> {
    #[inline]
    unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
        let ptr = unsafe { self.inner.alloc(layout) };
        if !ptr.is_null() {
            add_allocated(layout.size());
        }
        ptr
    }

    #[inline]
    unsafe fn alloc_zeroed(&self, layout: Layout) -> *mut u8 {
        let ptr = unsafe { self.inner.alloc_zeroed(layout) };
        if !ptr.is_null() {
            add_allocated(layout.size());
        }
        ptr
    }

    #[inline]
    unsafe fn dealloc(&self, ptr: *mut u8, layout: Layout) {
        unsafe { self.inner.dealloc(ptr, layout) };
        add_deallocated(layout.size());
    }

    #[inline]
    unsafe fn realloc(&self, ptr: *mut u8, layout: Layout, new_size: usize) -> *mut u8 {
        let new_ptr = unsafe { self.inner.realloc(ptr, layout, new_size) };
        // On failure the old block is untouched, so nothing moved.
        if !new_ptr.is_null() {
            add_deallocated(layout.size());
            add_allocated(new_size);
        }
        new_ptr
    }
}

/// The calling thread's cumulative `(allocated, deallocated)` bytes, or `None` when the global
/// allocator is not a [`CountingAlloc`]. Matches `dice::ThreadAllocCountersFn`.
pub fn thread_alloc_counters() -> Option<(u64, u64)> {
    if !INSTALLED.load(Ordering::Relaxed) {
        return None;
    }
    COUNTERS
        .try_with(|c| (c.allocated.get(), c.deallocated.get()))
        .ok()
}

#[cfg(test)]
mod tests {
    use std::alloc::System;

    use super::*;

    // The test binary's global allocator is something else, so these drive a local
    // `CountingAlloc` directly: only its calls move this thread's counters.
    static ALLOC: CountingAlloc<System> = CountingAlloc::new(System);

    fn counters() -> (u64, u64) {
        ALLOC.mark_installed();
        thread_alloc_counters().unwrap()
    }

    #[test]
    fn counts_alloc_realloc_and_dealloc() {
        let (a0, d0) = counters();
        let layout = Layout::from_size_align(100, 8).unwrap();
        unsafe {
            let p = ALLOC.alloc(layout);
            assert!(!p.is_null());
            assert_eq!(counters(), (a0 + 100, d0));

            let p = ALLOC.realloc(p, layout, 300);
            assert!(!p.is_null());
            assert_eq!(counters(), (a0 + 400, d0 + 100));

            ALLOC.dealloc(p, Layout::from_size_align(300, 8).unwrap());
            assert_eq!(counters(), (a0 + 400, d0 + 400));

            let z = ALLOC.alloc_zeroed(layout);
            assert!(!z.is_null());
            ALLOC.dealloc(z, layout);
        }
        assert_eq!(counters(), (a0 + 500, d0 + 500));
    }

    #[test]
    fn a_free_counts_on_the_freeing_thread() {
        let layout = Layout::from_size_align(64, 8).unwrap();
        let ptr = unsafe { ALLOC.alloc(layout) } as usize;
        let (other_alloc, other_dealloc) = std::thread::spawn(move || {
            let (a0, d0) = counters();
            unsafe { ALLOC.dealloc(ptr as *mut u8, layout) };
            let (a1, d1) = counters();
            (a1 - a0, d1 - d0)
        })
        .join()
        .unwrap();
        assert_eq!((other_alloc, other_dealloc), (0, 64));
    }
}
