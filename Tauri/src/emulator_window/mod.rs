mod error;
mod finder;
mod placement;

pub use error::EmulatorWindowError;

use crate::memory::{find_process_id, EMULATOR_PROCESS_NAME};

/// Screen coordinates in physical pixels.
pub struct ScreenRect {
    pub x: i32,
    pub y: i32,
    pub width: i32,
    pub height: i32,
}

pub fn fit(target: ScreenRect) -> Result<(), EmulatorWindowError> {
    let process_id = find_process_id(EMULATOR_PROCESS_NAME)
        .map_err(EmulatorWindowError::placement_failed)?
        .ok_or_else(EmulatorWindowError::process_not_found)?;

    let window =
        finder::find_main_window(process_id).ok_or_else(EmulatorWindowError::window_not_found)?;

    placement::place_window(window, &target).map_err(EmulatorWindowError::placement_failed)
}
