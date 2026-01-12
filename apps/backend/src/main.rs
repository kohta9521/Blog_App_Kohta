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
use tracing::{info};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use utoipa::{OpenApi, ToSchema, IntoParams};
use utoipa_swagger_ui::SwaggerUi;

/// OpenAPIドキュメント定義
#[derive(OpenApi)]
#[openapi(
    paths(health_check, hello_rust, custom_hello),
    components(schemas(HealthResponse, GreetingResponse, GreetingMeta, CustomGreetingMeta)),
    tags(
        (name = "health", description = "ヘルスチェック関連API"),
        (name = "greeting", description = "挨拶関連API")
    ),
    info(
        title = "Blog Backend API",
        description = "Rust製テックブログバックエンドAPI",
        version = "0.1.0",
        contact(
            name = "Kohta",
            email = "contact@example.com"
        )
    ),
    servers(
        (url = "http://localhost:8000", description = "開発環境"),
        (url = "https://api.blog.example.com", description = "本番環境")
    )
)]
struct ApiDoc;

/// ヘルスチェックレスポンス
#[derive(Serialize, ToSchema)]
#[schema(example = json!({
    "status": "healthy",
    "timestamp": "2026-01-12T12:00:00Z",
    "version": "0.1.0",
    "service": "blog-backend"
}))]
struct HealthResponse {
    /// サービスの状態
    #[schema(example = "healthy")]
    status: String,
    /// チェック実行時刻
    #[schema(example = "2026-01-12T12:00:00Z")]
    timestamp: String,
    /// アプリケーションバージョン
    #[schema(example = "0.1.0")]
    version: String,
    /// サービス名
    #[schema(example = "blog-backend")]
    service: String,
}

/// グリーティングレスポンス
#[derive(Serialize, ToSchema)]
#[schema(example = json!({
    "message": "Hello Rust Backend! 🦀",
    "timestamp": "2026-01-12T12:00:00Z"
}))]
struct GreetingResponse {
    /// 挨拶メッセージ
    #[schema(example = "Hello Rust Backend! 🦀")]
    message: String,
    /// メッセージ生成時刻
    #[schema(example = "2026-01-12T12:00:00Z")]
    timestamp: String,
}

/// グリーティングメタ情報
#[derive(Serialize, ToSchema)]
struct GreetingMeta {
    /// サービス名
    service: String,
    /// 使用言語
    language: String,
    /// 使用フレームワーク
    framework: String,
}

/// カスタムグリーティングメタ情報
#[derive(Serialize, ToSchema)]
struct CustomGreetingMeta {
    /// サービス名
    service: String,
    /// グリーティングタイプ
    #[serde(rename = "type")]
    greeting_type: String,
}

/// クエリパラメータ
#[derive(Deserialize, ToSchema, IntoParams)]
struct GreetingQuery {
    /// 挨拶対象の名前（オプション）
    #[schema(example = "Kohta")]
    name: Option<String>,
}

/// GET /health - ヘルスチェック
#[utoipa::path(
    get,
    path = "/health",
    tag = "health",
    summary = "ヘルスチェック",
    description = "サービスの稼働状態を確認します",
    responses(
        (status = 200, description = "サービス正常", body = HealthResponse),
        (status = 500, description = "サービス異常")
    )
)]
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
#[utoipa::path(
    get,
    path = "/api/v1/hello",
    tag = "greeting",
    summary = "Rust挨拶",
    description = "Rustバックエンドからの標準的な挨拶メッセージを返します",
    responses(
        (status = 200, description = "挨拶メッセージ", body = Value,
        example = json!({
            "greeting": {
                "message": "Hello Rust Backend! 🦀",
                "timestamp": "2026-01-12T12:00:00Z"
            },
            "meta": {
                "service": "blog-backend",
                "language": "Rust",
                "framework": "Axum"
            }
        }))
    )
)]
async fn hello_rust() -> Json<Value> {
    info!("Hello Rust endpoint called");

    let greeting = GreetingResponse {
        message: "Hello Rust Backend! 🦀".to_string(),
        timestamp: chrono::Utc::now().to_rfc3339(),
    };

    Json(json!({
        "greeting": greeting,
        "meta": GreetingMeta {
            service: "blog-backend".to_string(),
            language: "Rust".to_string(),
            framework: "Axum".to_string(),
        }
    }))
}

/// GET /api/v1/hello/custom?name=<name> - カスタム挨拶
#[utoipa::path(
    get,
    path = "/api/v1/hello/custom",
    tag = "greeting",
    summary = "カスタム挨拶",
    description = "名前を指定してパーソナライズされた挨拶メッセージを返します",
    params(GreetingQuery),
    responses(
        (status = 200, description = "カスタム挨拶メッセージ", body = Value,
        example = json!({
            "greeting": {
                "message": "Hello Kohta, welcome to Rust Backend! 🦀",
                "timestamp": "2026-01-12T12:00:00Z"
            },
            "meta": {
                "service": "blog-backend",
                "type": "custom_greeting"
            }
        }))
    )
)]
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
        "meta": CustomGreetingMeta {
            service: "blog-backend".to_string(),
            greeting_type: "custom_greeting".to_string(),
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
        // Swagger UI
        .merge(SwaggerUi::new("/swagger-ui")
            .url("/api-docs/openapi.json", ApiDoc::openapi()))
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
