use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;


#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]

pub struct Locale {
    pub locale_id: i32,
    pub code: String,
    pub name: String,
    pub is_default: bool,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
}

impl Locale {
    pub fn is_japanese(&self) -> bool {
        self.code == "ja"
    }
    pub fn is_english(&self) -> bool {
        self.code == "en"
    }
    pub fn display_info(&self) -> String {
        let default_str = if self.is_default { " - Default" } else { "" };
        let active_str = if self.is_active { "Active" } else { "Inactive" };
        format!(
            "{} ({}) - {}{}",
            self.name, self.code, active_str, default_str
        )
    }
}
