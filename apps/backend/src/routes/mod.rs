use axum::{routing::get, Router};
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

use crate::{handlers, models::ApiDoc};

/// アプリケーション全体のルーターを作成
pub fn create_router() -> Router {
    Router::new()
        // ルートレベル（Docker用）
        .route("/health", get(handlers::health::health_check))
        // API v1
        .route("/api/v1/health", get(handlers::health::health_check))
        .route("/api/v1/hello", get(handlers::greeting::hello_rust))
        .route("/api/v1/hello/custom", get(handlers::greeting::custom_hello))
        // Swagger UI
        .merge(SwaggerUi::new("/swagger-ui")
            .url("/api-docs/openapi.json", ApiDoc::openapi()))
}
