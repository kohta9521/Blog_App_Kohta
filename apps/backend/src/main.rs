use axum::http::{header::{ACCEPT, AUTHORIZATION, CONTENT_TYPE}, HeaderValue, Method};
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use tracing::info;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod handlers;
mod models;
mod routes;

use routes::create_router;


#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // ログ設定の初期化
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "backend=info,tower_http=info".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    info!("🦀 Starting Rust Blog Backend Server...");

    // CORS設定
    let cors = CorsLayer::new()
        .allow_origin("http://localhost:3000".parse::<HeaderValue>()?)
        .allow_origin("http://localhost:3001".parse::<HeaderValue>()?)
        .allow_methods([Method::GET, Method::POST, Method::PATCH, Method::DELETE])
        .allow_credentials(true)
        .allow_headers([AUTHORIZATION, ACCEPT, CONTENT_TYPE]);

    // ルーター設定
    let app = create_router()
        .layer(TraceLayer::new_for_http())
        .layer(cors);

    // サーバー設定
    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "8000".to_string())
        .parse::<u16>()?;

    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port)).await?;

    info!("🚀 Server running on http://0.0.0.0:{}", port);
    info!("📋 Health check: http://0.0.0.0:{}/health", port);
    info!("👋 Hello endpoint: http://0.0.0.0:{}/api/v1/hello", port);
    info!("📚 Swagger UI: http://0.0.0.0:{}/swagger-ui", port);
    info!("📄 OpenAPI JSON: http://0.0.0.0:{}/api-docs/openapi.json", port);

    // サーバー起動
    axum::serve(listener, app).await?;

    Ok(())
}
