use serde::{Deserialize, Serialize};
use utoipa::{ToSchema, IntoParams};

/// グリーティングレスポンス
#[derive(Serialize, ToSchema)]
pub struct GreetingResponse {
    /// 挨拶メッセージ
    #[schema(example = "Hello Rust Backend! 🦀")]
    pub message: String,
    /// メッセージ生成時刻
    #[schema(example = "2026-01-12T12:00:00Z")]
    pub timestamp: String,
}

/// グリーティングメタ情報
#[derive(Serialize, ToSchema)]
pub struct GreetingMeta {
    /// サービス名
    pub service: String,
    /// 使用言語
    pub language: String,
    /// 使用フレームワーク
    pub framework: String,
}

/// カスタムグリーティングメタ情報
#[derive(Serialize, ToSchema)]
pub struct CustomGreetingMeta {
    /// サービス名
    pub service: String,
    /// グリーティングタイプ
    #[serde(rename = "type")]
    pub greeting_type: String,
}

/// クエリパラメータ
#[derive(Deserialize, ToSchema, IntoParams)]
pub struct GreetingQuery {
    /// 挨拶対象の名前（オプション）
    #[schema(example = "Kohta")]
    pub name: Option<String>,
}

impl GreetingResponse {
    pub fn new(message: String) -> Self {
        Self {
            message,
            timestamp: chrono::Utc::now().to_rfc3339(),
        }
    }

    pub fn rust_greeting() -> Self {
        Self::new("Hello Rust Backend! 🦀".to_string())
    }

    pub fn custom_greeting(name: Option<String>) -> Self {
        let message = match name {
            Some(n) => format!("Hello {}, welcome to Rust Backend! 🦀", n),
            None => "Hello there, welcome to Rust Backend! 🦀".to_string(),
        };
        Self::new(message)
    }
}

impl GreetingMeta {
    pub fn default() -> Self {
        Self {
            service: "blog-backend".to_string(),
            language: "Rust".to_string(),
            framework: "Axum".to_string(),
        }
    }
}

impl CustomGreetingMeta {
    pub fn default() -> Self {
        Self {
            service: "blog-backend".to_string(),
            greeting_type: "custom_greeting".to_string(),
        }
    }
}
