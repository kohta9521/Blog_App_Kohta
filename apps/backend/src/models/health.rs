use serde::Serialize;
use utoipa::ToSchema;

/// ヘルスチェックレスポンス
#[derive(Serialize, ToSchema)]
pub struct HealthResponse {
    /// サービスの状態
    #[schema(example = "healthy")]
    pub status: String,
    /// チェック実行時刻
    #[schema(example = "2026-01-12T12:00:00Z")]
    pub timestamp: String,
    /// アプリケーションバージョン
    #[schema(example = "0.1.0")]
    pub version: String,
    /// サービス名
    #[schema(example = "blog-backend")]
    pub service: String,
}

impl HealthResponse {
    pub fn healthy() -> Self {
        Self {
            status: "healthy".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
            version: env!("CARGO_PKG_VERSION").to_string(),
            service: "blog-backend".to_string(),
        }
    }
}
