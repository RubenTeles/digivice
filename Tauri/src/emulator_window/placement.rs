use std::ffi::c_void;
use std::mem::size_of;

use windows::Win32::Foundation::{HWND, RECT};
use windows::Win32::Graphics::Dwm::{DwmGetWindowAttribute, DWMWA_EXTENDED_FRAME_BOUNDS};
use windows::Win32::UI::WindowsAndMessaging::{
    GetWindowRect, IsIconic, IsZoomed, SetForegroundWindow, SetWindowPos, ShowWindow, HWND_TOP,
    SWP_SHOWWINDOW, SW_RESTORE,
};

use super::ScreenRect;

pub fn place_window(window: HWND, target: &ScreenRect) -> windows::core::Result<()> {
    // SAFETY: plain Win32 calls on a window handle found by `find_main_window`.
    unsafe {
        // A maximized window ignores SetWindowPos sizing, and invisible borders differ while maximized.
        if IsIconic(window).as_bool() || IsZoomed(window).as_bool() {
            let _ = ShowWindow(window, SW_RESTORE);
        }
    }

    let mut window_rect = RECT::default();
    let mut visible_rect = RECT::default();

    // SAFETY: both RECTs are valid out pointers and `cbattribute` matches the RECT size.
    unsafe {
        GetWindowRect(window, &mut window_rect)?;
        DwmGetWindowAttribute(
            window,
            DWMWA_EXTENDED_FRAME_BOUNDS,
            &mut visible_rect as *mut RECT as *mut c_void,
            size_of::<RECT>() as u32,
        )?;
    }

    // Windows 10/11 frames include invisible resize borders; grow the target so the visible part matches it.
    let left_border = visible_rect.left - window_rect.left;
    let top_border = visible_rect.top - window_rect.top;
    let right_border = window_rect.right - visible_rect.right;
    let bottom_border = window_rect.bottom - visible_rect.bottom;

    // SAFETY: plain Win32 calls on the same window handle.
    unsafe {
        SetWindowPos(
            window,
            Some(HWND_TOP),
            target.x - left_border,
            target.y - top_border,
            target.width + left_border + right_border,
            target.height + top_border + bottom_border,
            SWP_SHOWWINDOW,
        )?;
        let _ = SetForegroundWindow(window);
    }

    Ok(())
}
