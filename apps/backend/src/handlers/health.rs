use axum::response::Json;
use tracing::info;

use crate::models::HealthResponse;

/// GET /health - ヘルスチェック
#[utoipa::path(
    get,
    path = "/health",
    tag = "health",
    summary = "ヘルスチェック",
    description = "サービスの稼働状態を確認します",
    responses(
        (status = 200, description = "サービス正常"),
        (status = 500, description = "サービス異常")
    )
)]
pub async fn health_check() -> Json<HealthResponse> {
    info!("Health check endpoint called");
    Json(HealthResponse::healthy())
}
