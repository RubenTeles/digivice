// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod emulator_window;
mod memory;

use tauri::{Manager, RunEvent};
use tauri_plugin_window_state::StateFlags;

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    // Decorations are hidden while DuckStation is fitted; that must not outlive the session.
    .plugin(
      tauri_plugin_window_state::Builder::default()
        .with_state_flags(StateFlags::all() & !StateFlags::DECORATIONS)
        .build(),
    )
    .manage(memory::MemoryState::default())
    .manage(emulator_window::EmulatorWindowState::default())
    .invoke_handler(tauri::generate_handler![
      commands::read_ram,
      commands::fit_emulator_window,
      commands::release_emulator_window
    ])
    .build(tauri::generate_context!())
    .expect("error while building tauri application")
    .run(|app, event| {
      // Closing the Digivice while fitted must give DuckStation its frame back.
      if let RunEvent::Exit = event {
        emulator_window::restore_emulator_frame(&app.state::<emulator_window::EmulatorWindowState>());
      }
    });
}
