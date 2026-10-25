use windows::Win32::Foundation::HWND;
use windows::Win32::UI::WindowsAndMessaging::{
    GetWindowLongPtrW, SetWindowLongPtrW, SetWindowPos, GWL_STYLE, SWP_FRAMECHANGED,
    SWP_NOACTIVATE, SWP_NOMOVE, SWP_NOSIZE, SWP_NOZORDER, WS_CAPTION, WS_MAXIMIZEBOX,
    WS_MINIMIZEBOX, WS_SYSMENU, WS_THICKFRAME,
};

const FRAME_STYLES: u32 =
    WS_CAPTION.0 | WS_THICKFRAME.0 | WS_SYSMENU.0 | WS_MINIMIZEBOX.0 | WS_MAXIMIZEBOX.0;

pub fn read_style(window: HWND) -> isize {
    // SAFETY: plain Win32 query on the emulator window handle.
    unsafe { GetWindowLongPtrW(window, GWL_STYLE) }
}

pub fn without_frame(style: isize) -> isize {
    style & !(FRAME_STYLES as isize)
}

pub fn apply_style(window: HWND, style: isize) -> windows::core::Result<()> {
    // SAFETY: plain Win32 calls on the emulator window handle; SWP_FRAMECHANGED makes the new style take effect
    // without moving, resizing or reordering the window.
    unsafe {
        SetWindowLongPtrW(window, GWL_STYLE, style);
        SetWindowPos(
            window,
            None,
            0,
            0,
            0,
            0,
            SWP_FRAMECHANGED | SWP_NOMOVE | SWP_NOSIZE | SWP_NOZORDER | SWP_NOACTIVATE,
        )
    }
}
