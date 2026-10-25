use serde::Deserialize;
use tauri::ipc::Response;
use tauri::{State, WebviewWindow};
use windows::Win32::Foundation::HWND;

use crate::emulator_window::{self, EmulatorWindowError, EmulatorWindowState, ScreenRect};
use crate::memory::{MemoryError, MemorySession, MemoryState};

#[tauri::command]
pub async fn read_ram(state: State<'_, MemoryState>) -> Result<Response, MemoryError> {
    let mut session_slot = state
        .0
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner());

    // A mapping kept open survives the emulator exiting and would return frozen RAM.
    if session_slot
        .as_ref()
        .is_some_and(|session| !session.is_alive())
    {
        *session_slot = None;
    }

    let session = match session_slot.take() {
        Some(session) => session,
        None => MemorySession::connect()?,
    };

    // On failure the session is dropped, so the next call reconnects from scratch.
    let bytes = session.copy_ram()?;
    *session_slot = Some(session);
    Ok(Response::new(bytes))
}

/// Area relative to the Digivice webview, in physical pixels.
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EmulatorArea {
    x: i32,
    y: i32,
    width: i32,
    height: i32,
}

fn digivice_window_handle(window: &WebviewWindow) -> Result<HWND, EmulatorWindowError> {
    let handle = window
        .hwnd()
        .map_err(EmulatorWindowError::placement_failed)?;

    // Tauri links a newer `windows` crate; both HWND types wrap the same raw pointer.
    Ok(HWND(handle.0))
}

fn to_screen_rect(
    window: &WebviewWindow,
    area: EmulatorArea,
) -> Result<ScreenRect, EmulatorWindowError> {
    let origin = window
        .inner_position()
        .map_err(EmulatorWindowError::placement_failed)?;

    Ok(ScreenRect {
        x: origin.x + area.x,
        y: origin.y + area.y,
        width: area.width,
        height: area.height,
    })
}

#[tauri::command]
pub fn fit_emulator_window(
    window: WebviewWindow,
    state: State<'_, EmulatorWindowState>,
    area: EmulatorArea,
) -> Result<(), EmulatorWindowError> {
    emulator_window::fit(
        &state,
        digivice_window_handle(&window)?,
        to_screen_rect(&window, area)?,
    )
}

#[tauri::command]
pub fn release_emulator_window(
    window: WebviewWindow,
    state: State<'_, EmulatorWindowState>,
) -> Result<(), EmulatorWindowError> {
    emulator_window::release(&state, digivice_window_handle(&window)?)
}

#[tauri::command]
pub fn suspend_emulator_cut(window: WebviewWindow) -> Result<(), EmulatorWindowError> {
    emulator_window::suspend_cut(digivice_window_handle(&window)?)
}

#[tauri::command]
pub fn resume_emulator_cut(
    window: WebviewWindow,
    area: EmulatorArea,
) -> Result<(), EmulatorWindowError> {
    emulator_window::resume_cut(
        digivice_window_handle(&window)?,
        to_screen_rect(&window, area)?,
    )
}
