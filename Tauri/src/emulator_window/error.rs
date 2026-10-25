use serde::Serialize;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EmulatorWindowError {
    pub code: &'static str,
    pub detail: Option<String>,
}

impl EmulatorWindowError {
    pub fn process_not_found() -> Self {
        Self {
            code: "process_not_found",
            detail: None,
        }
    }

    pub fn window_not_found() -> Self {
        Self {
            code: "window_not_found",
            detail: None,
        }
    }

    pub fn placement_failed(detail: impl ToString) -> Self {
        Self {
            code: "placement_failed",
            detail: Some(detail.to_string()),
        }
    }
}
