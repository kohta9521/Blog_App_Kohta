use utoipa::OpenApi;

// OpenAPI定義のみ - スキーマは各ハンドラで自動生成

/// OpenAPIドキュメント定義
#[derive(OpenApi)]
#[openapi(
    paths(
        crate::handlers::health::health_check,
        crate::handlers::greeting::hello_rust,
        crate::handlers::greeting::custom_hello,
        crate::handlers::posts::list_posts
    ),
    components(schemas(
        crate::models::PostListItem,
        crate::models::PostListResponse
    )),
    tags(
        (name = "health", description = "ヘルスチェック関連API"),
        (name = "greeting", description = "挨拶関連API"),
        (name = "posts", description = "記事関連API")
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
