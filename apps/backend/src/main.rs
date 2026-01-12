use axum::{
    extract::Query,
    http::{header::{ACCEPT, AUTHORIZATION, CONTENT_TYPE}, HeaderValue, Method},
    response::Json,
    routing::get,
    Router,
};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use tracing::{info, warn};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

/// ヘルスチェックレスポンス
#[derive(Serialize)]
struct HealthResponse {
    status: String,
    timestamp: String,
    version: String,
    service: String,
}

/// グリーティングレスポンス
#[derive(Serialize)]
struct GreetingResponse {
    message: String,
    timestamp: String,
}

/// クエリパラメータ
#[derive(Deserialize)]
struct GreetingQuery {
    name: Option<String>,
}

/// GET /health - ヘルスチェック
async fn health_check() -> Json<HealthResponse> {
    info!("Health check endpoint called");
    
    Json(HealthResponse {
        status: "healthy".to_string(),
        timestamp: chrono::Utc::now().to_rfc3339(),
        version: env!("CARGO_PKG_VERSION").to_string(),
        service: "blog-backend".to_string(),
    })
}

/// GET /api/v1/hello - Rustバックエンドからの挨拶
async fn hello_rust() -> Json<Value> {
    info!("Hello Rust endpoint called");
    
    let greeting = GreetingResponse {
        message: "Hello Rust Backend! 🦀".to_string(),
        timestamp: chrono::Utc::now().to_rfc3339(),
    };

    Json(json!({
        "greeting": greeting,
        "meta": {
            "service": "blog-backend",
            "language": "Rust",
            "framework": "Axum"
        }
    }))
}

/// GET /api/v1/hello/custom?name=<name> - カスタム挨拶
async fn custom_hello(Query(params): Query<GreetingQuery>) -> Json<Value> {
    info!("Custom hello endpoint called with name: {:?}", params.name);
    
    let message = match params.name {
        Some(name) => format!("Hello {}, welcome to Rust Backend! 🦀", name),
        None => "Hello there, welcome to Rust Backend! 🦀".to_string(),
    };

    let greeting = GreetingResponse {
        message,
        timestamp: chrono::Utc::now().to_rfc3339(),
    };

    Json(json!({
        "greeting": greeting,
        "meta": {
            "service": "blog-backend",
            "type": "custom_greeting"
        }
    }))
}

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
    let app = Router::new()
        // ルートレベル（Docker用）
        .route("/health", get(health_check))
        // API v1
        .route("/api/v1/health", get(health_check))
        .route("/api/v1/hello", get(hello_rust))
        .route("/api/v1/hello/custom", get(custom_hello))
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

    // サーバー起動
    axum::serve(listener, app).await?;

    Ok(())
}
