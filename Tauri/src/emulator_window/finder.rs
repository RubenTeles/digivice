use windows::core::BOOL;
use windows::Win32::Foundation::{HWND, LPARAM};
use windows::Win32::UI::WindowsAndMessaging::{
    EnumWindows, GetWindow, GetWindowThreadProcessId, IsWindowVisible, GW_OWNER,
};

struct WindowSearch {
    process_id: u32,
    found: Option<HWND>,
}

/// Main window = visible, top-level and without owner (skips Qt dialogs and tool windows).
pub fn find_main_window(process_id: u32) -> Option<HWND> {
    let mut search = WindowSearch {
        process_id,
        found: None,
    };

    // SAFETY: `search` outlives the synchronous EnumWindows call, which is the only reader of the pointer.
    // The Err returned when the callback stops the enumeration early is expected and ignored.
    let _ = unsafe {
        EnumWindows(
            Some(collect_main_window),
            LPARAM(&mut search as *mut WindowSearch as isize),
        )
    };

    search.found
}

unsafe extern "system" fn collect_main_window(window: HWND, parameter: LPARAM) -> BOOL {
    // SAFETY: `parameter` is the `WindowSearch` pointer passed by `find_main_window`, alive during enumeration.
    let search = unsafe { &mut *(parameter.0 as *mut WindowSearch) };

    let mut window_process_id = 0u32;
    // SAFETY: `window` comes from EnumWindows and `window_process_id` is a valid out pointer.
    unsafe { GetWindowThreadProcessId(window, Some(&mut window_process_id)) };
    if window_process_id != search.process_id {
        return BOOL(1);
    }

    // SAFETY: plain Win32 queries on a window handle provided by EnumWindows.
    let is_visible = unsafe { IsWindowVisible(window) }.as_bool();
    // SAFETY: same as above; GetWindow fails when the window has no owner.
    let has_owner = unsafe { GetWindow(window, GW_OWNER) }.is_ok();
    if !is_visible || has_owner {
        return BOOL(1);
    }

    search.found = Some(window);
    BOOL(0)
}
