use std::sync::Mutex;

/// DuckStation window whose frame was removed while fitted, with the style to restore.
/// The HWND is kept as `isize` because raw pointers are not `Send`, as Tauri managed state requires.
pub struct StrippedFrame {
    pub window: isize,
    pub original_style: isize,
}

#[derive(Default)]
pub struct EmulatorWindowState(pub Mutex<Option<StrippedFrame>>);
