mod error;
mod finder;
mod frame;
mod placement;
mod region;
mod state;

pub use error::EmulatorWindowError;
pub use state::EmulatorWindowState;

use windows::Win32::Foundation::HWND;
use windows::Win32::UI::WindowsAndMessaging::IsWindow;

use crate::memory::{find_process_id, EMULATOR_PROCESS_NAME};
use state::StrippedFrame;

/// Screen coordinates in physical pixels.
pub struct ScreenRect {
    pub x: i32,
    pub y: i32,
    pub width: i32,
    pub height: i32,
}

/// Removes DuckStation's frame, places it on `target` and cuts the same area out of the Digivice window.
pub fn fit(
    state: &EmulatorWindowState,
    digivice_window: HWND,
    target: ScreenRect,
) -> Result<(), EmulatorWindowError> {
    let process_id = find_process_id(EMULATOR_PROCESS_NAME)
        .map_err(EmulatorWindowError::placement_failed)?
        .ok_or_else(EmulatorWindowError::process_not_found)?;

    let emulator_window =
        finder::find_main_window(process_id).ok_or_else(EmulatorWindowError::window_not_found)?;

    // Restored first so the style saved for later does not carry the maximized/minimized bit.
    placement::restore_window(emulator_window);

    // Without the frame there are no invisible borders, so placement fills the whole target.
    strip_emulator_frame(state, emulator_window).map_err(EmulatorWindowError::placement_failed)?;

    placement::place_window(emulator_window, &target)
        .map_err(EmulatorWindowError::placement_failed)?;

    region::cut_hole(digivice_window, &target).map_err(EmulatorWindowError::placement_failed)
}

pub fn release(
    state: &EmulatorWindowState,
    digivice_window: HWND,
) -> Result<(), EmulatorWindowError> {
    restore_emulator_frame(state);
    region::clear(digivice_window).map_err(EmulatorWindowError::placement_failed)
}

/// Restores only what `fit` removed; a DuckStation that was never fitted (e.g. fullscreen) is left untouched.
pub fn restore_emulator_frame(state: &EmulatorWindowState) {
    let mut stripped_slot = state
        .0
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner());

    let Some(stripped) = stripped_slot.take() else {
        return;
    };

    let window = HWND(stripped.window as *mut _);
    // SAFETY: IsWindow only checks whether the handle still identifies a window (DuckStation may have closed).
    if !unsafe { IsWindow(Some(window)) }.as_bool() {
        return;
    }

    let _ = frame::apply_style(window, stripped.original_style);
}

fn strip_emulator_frame(
    state: &EmulatorWindowState,
    emulator_window: HWND,
) -> windows::core::Result<()> {
    let mut stripped_slot = state
        .0
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner());

    let window_key = emulator_window.0 as isize;
    let original_style = match stripped_slot.as_ref() {
        // Refit: reapply in case DuckStation (Qt) recreated its frame, e.g. after leaving fullscreen.
        Some(stripped) if stripped.window == window_key => stripped.original_style,
        // First fit, or DuckStation restarted with a new window.
        _ => frame::read_style(emulator_window),
    };

    *stripped_slot = Some(StrippedFrame {
        window: window_key,
        original_style,
    });

    frame::apply_style(emulator_window, frame::without_frame(original_style))
}
