mod commands;
mod memory;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .manage(memory::MemoryState::default())
    .invoke_handler(tauri::generate_handler![commands::read_ram])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
