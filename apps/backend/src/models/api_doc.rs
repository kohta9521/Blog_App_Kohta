use utoipa::OpenApi;

// OpenAPI定義のみ - スキーマは各ハンドラで自動生成

/// OpenAPIドキュメント定義
#[derive(OpenApi)]
#[openapi(
    paths(
        crate::handlers::health::health_check,
        crate::handlers::greeting::hello_rust,
        crate::handlers::greeting::custom_hello,
        crate::handlers::locales::list_locales,
        crate::handlers::locales::list_active_locales,
        crate::handlers::locales::get_locale_by_code
    ),
    components(schemas(
        crate::models::HealthResponse,
        crate::models::GreetingResponse,
        crate::models::GreetingMeta,
        crate::models::CustomGreetingMeta,
        crate::models::GreetingQuery,
        crate::handlers::locales::LocaleResponse,
        crate::handlers::locales::LocalesListResponse
    )),
    tags(
        (name = "health", description = "ヘルスチェック関連API"),
        (name = "greeting", description = "挨拶関連API"),
        (name = "locales", description = "言語情報関連API")
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
pub struct ApiDoc;
