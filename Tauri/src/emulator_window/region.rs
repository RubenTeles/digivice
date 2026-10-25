use std::mem::size_of;

use windows::core::Error;
use windows::Win32::Foundation::{HWND, RECT};
use windows::Win32::Graphics::Gdi::{
    CombineRgn, CreateRectRgn, DeleteObject, GetMonitorInfoW, MonitorFromWindow, SetWindowRgn,
    HRGN, MONITORINFO, MONITOR_DEFAULTTONEAREST, RGN_DIFF, RGN_ERROR,
};
use windows::Win32::UI::WindowsAndMessaging::GetWindowRect;

use super::ScreenRect;

struct OwnedRegion(HRGN);

impl OwnedRegion {
    fn rectangle(left: i32, top: i32, right: i32, bottom: i32) -> windows::core::Result<Self> {
        // SAFETY: plain GDI call; the returned region is owned and deleted by OwnedRegion.
        let region = unsafe { CreateRectRgn(left, top, right, bottom) };
        if region.is_invalid() {
            return Err(Error::from_win32());
        }

        Ok(Self(region))
    }

    fn raw(&self) -> HRGN {
        self.0
    }

    /// Hands ownership over (e.g. to SetWindowRgn); the region is no longer deleted on drop.
    fn into_raw(self) -> HRGN {
        let region = self.0;
        std::mem::forget(self);
        region
    }
}

impl Drop for OwnedRegion {
    fn drop(&mut self) {
        // SAFETY: the region is owned by this wrapper and not selected into any device context.
        unsafe {
            let _ = DeleteObject(self.0.into());
        }
    }
}

/// Removes `hole` (screen coordinates) from the window shape: drawing and clicks there reach whatever is behind.
pub fn cut_hole(window: HWND, hole: &ScreenRect) -> windows::core::Result<()> {
    let mut window_rect = RECT::default();
    // SAFETY: `window_rect` is a valid out pointer for the Digivice window handle.
    unsafe { GetWindowRect(window, &mut window_rect)? };

    let work_area = monitor_work_area(window)?;

    // Window regions are relative to the window rect. A maximized window overhangs its monitor by the
    // invisible borders; once a region is set that overhang becomes visible, so the shape stops at the work area.
    let shape = OwnedRegion::rectangle(
        work_area.left.max(window_rect.left) - window_rect.left,
        work_area.top.max(window_rect.top) - window_rect.top,
        work_area.right.min(window_rect.right) - window_rect.left,
        work_area.bottom.min(window_rect.bottom) - window_rect.top,
    )?;
    let hole_left = hole.x - window_rect.left;
    let hole_top = hole.y - window_rect.top;
    let cut = OwnedRegion::rectangle(
        hole_left,
        hole_top,
        hole_left + hole.width,
        hole_top + hole.height,
    )?;

    // SAFETY: both regions are valid and owned; the destination may be one of the sources.
    let combined = unsafe {
        CombineRgn(
            Some(shape.raw()),
            Some(shape.raw()),
            Some(cut.raw()),
            RGN_DIFF,
        )
    };
    if combined == RGN_ERROR {
        return Err(Error::from_win32());
    }

    let region = shape.into_raw();
    // SAFETY: on success the system owns `region`; on failure it stays ours and is deleted below.
    if unsafe { SetWindowRgn(window, Some(region), true) } == 0 {
        drop(OwnedRegion(region));
        return Err(Error::from_win32());
    }

    Ok(())
}

/// Monitor area without the taskbar, in screen coordinates.
fn monitor_work_area(window: HWND) -> windows::core::Result<RECT> {
    let mut monitor_info = MONITORINFO {
        cbSize: size_of::<MONITORINFO>() as u32,
        ..Default::default()
    };

    // SAFETY: MONITOR_DEFAULTTONEAREST always returns a monitor; `monitor_info` has cbSize set as required.
    let has_info = unsafe {
        let monitor = MonitorFromWindow(window, MONITOR_DEFAULTTONEAREST);
        GetMonitorInfoW(monitor, &mut monitor_info)
    };
    if !has_info.as_bool() {
        return Err(Error::from_win32());
    }

    Ok(monitor_info.rcWork)
}

pub fn clear(window: HWND) -> windows::core::Result<()> {
    // SAFETY: a null region restores the default window shape.
    if unsafe { SetWindowRgn(window, None, true) } == 0 {
        return Err(Error::from_win32());
    }

    Ok(())
}
