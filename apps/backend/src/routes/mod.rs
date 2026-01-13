// ============================================
// Routes Module (ルーティング設定)
// ============================================
// URLとハンドラー関数を紐付ける
// 
// 💡 ポイント:
// - Router::new()でルーターを作成
// - .route(パス, メソッド(ハンドラー))で登録
// - .merge()で他のルーターを統合

use axum::{routing::get, Router};
use sqlx::PgPool;
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

use crate::{handlers, models::ApiDoc};

/// アプリケーション全体のルーターを作成
/// 
/// # 引数
/// なし（State<PgPool>はmain.rsで.with_state()で渡す）
/// 
/// # 戻り値
/// - `Router<PgPool>`: ルーター（PgPoolをStateとして持つ）
/// 
/// # ルーティング構成
/// ```
/// /health                       → ヘルスチェック
/// /api/v1/health                → ヘルスチェック（バージョン付き）
/// /api/v1/hello                 → 挨拶API
/// /api/v1/hello/custom          → カスタム挨拶API
/// /api/v1/posts                 → 記事一覧取得 ← NEW!
/// /swagger-ui                   → Swagger UI
/// /api-docs/openapi.json        → OpenAPI仕様
/// ```
pub fn create_router() -> Router<PgPool> {
    Router::new()
        // ルートレベル（Docker用）
        .route("/health", get(handlers::health::health_check))
        
        // API v1 - Health & Greeting
        .route("/api/v1/health", get(handlers::health::health_check))
        .route("/api/v1/hello", get(handlers::greeting::hello_rust))
        .route("/api/v1/hello/custom", get(handlers::greeting::custom_hello))
        
        // API v1 - Posts (記事関連) ← NEW!
        .route("/api/v1/posts", get(handlers::posts::list_posts))
        
        // Swagger UI
        .merge(SwaggerUi::new("/swagger-ui")
            .url("/api-docs/openapi.json", ApiDoc::openapi()))
}

// ============================================
// 💡 用語解説
// ============================================
// 
// Router<PgPool>
//   → PgPool（データベース接続プール）を状態として持つルーター
//   → ハンドラーでState<PgPool>として取得できる
// 
// .route(パス, メソッド(ハンドラー))
//   → URLパスとHTTPメソッド、ハンドラー関数を紐付け
//   → get(...): GETリクエスト
//   → post(...): POSTリクエスト
//   → put(...): PUTリクエスト
//   → delete(...): DELETEリクエスト
// 
// .merge(...)
//   → 別のルーターを統合
//   → ここではSwagger UIのルーターを統合
// 
// handlers::posts::list_posts
//   → handlers/posts.rsのlist_posts関数
//   → モジュールパスで関数を指定

