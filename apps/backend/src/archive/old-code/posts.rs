// ============================================
// Handler: Posts (記事APIハンドラー)
// ============================================
// HTTPリクエストを受け取り、レスポンスを返す
// 
// 💡 ポイント:
// - Axumのハンドラー関数
// - State(pool)でデータベース接続プールを取得
// - Json(...)でJSONレスポンスを返す

use axum::{
    extract::State,
    http::StatusCode,
    response::{IntoResponse, Json},
};
use sqlx::PgPool;
use tracing::{error, info};

use crate::{
    models::{PostListItem, PostListResponse},
    repositories::PostRepository,
};

/// GET /api/v1/posts - 記事一覧を取得
/// 
/// # 引数
/// - `State(pool)`: データベース接続プール（Axumが自動注入）
/// 
/// # 戻り値
/// - 成功時: `200 OK` + JSON（記事一覧）
/// - 失敗時: `500 Internal Server Error`
/// 
/// # HTTPの流れ
/// 1. クライアントから GET /api/v1/posts リクエスト
/// 2. Axumがこの関数を呼び出す
/// 3. データベースから記事を取得
/// 4. JSONに変換してレスポンス
/// 
/// # OpenAPI定義
/// - Swagger UIで自動表示される
#[utoipa::path(
    get,
    path = "/api/v1/posts",
    tag = "posts",
    summary = "記事一覧取得",
    description = "公開済みのブログ記事一覧を取得します（新しい順）",
    responses(
        (status = 200, description = "記事一覧の取得に成功", body = PostListResponse),
        (status = 500, description = "サーバーエラー")
    )
)]
pub async fn list_posts(
    State(pool): State<PgPool>,
) -> Result<Json<PostListResponse>, impl IntoResponse> {
    // ログ出力（デバッグ用）
    info!("📝 Fetching posts list...");

    // 1. リポジトリを作成
    let repo = PostRepository::new(pool);

    // 2. データベースから記事を取得
    let posts: Vec<crate::domain::entities::Post> = match repo.find_all_published().await {
        Ok(posts) => posts,
        Err(e) => {
            // エラーログ出力
            error!("❌ Failed to fetch posts: {:?}", e);
            // クライアントにエラーレスポンスを返す
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(serde_json::json!({
                    "error": "Failed to fetch posts",
                    "message": "データベースエラーが発生しました"
                })),
            ));
        }
    };

    // 3. 総件数を取得
    let total = match repo.count_published().await {
        Ok(count) => count,
        Err(e) => {
            error!("❌ Failed to count posts: {:?}", e);
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(serde_json::json!({
                    "error": "Failed to count posts",
                    "message": "データベースエラーが発生しました"
                })),
            ));
        }
    };

    // 4. EntityをAPIレスポンス用に変換
    let post_items: Vec<PostListItem> = posts
        .into_iter()              // 配列をイテレータに変換
        .map(|post| post.into())  // 各PostをPostListItemに変換
        .collect();               // 再び配列に戻す

    // 5. レスポンスを作成
    let response = PostListResponse {
        posts: post_items,
        total,
        page: 1,        // 将来のページネーション用
        per_page: 20,   // 将来のページネーション用
    };

    // 成功ログ
    info!("✅ Successfully fetched {} posts", total);

    // 6. JSONレスポンスを返す
    Ok(Json(response))
}

// ============================================
// 💡 用語解説
// ============================================
// 
// #[utoipa::path(...)]
//   → OpenAPI仕様を自動生成するマクロ
//   → Swagger UIで表示される情報を定義
// 
// async fn list_posts(...)
//   → 非同期ハンドラー関数
//   → Axumが自動的に呼び出す
// 
// State(pool): State<PgPool>
//   → Axumの状態抽出（State Extractor）
//   → main.rsで.with_state(pool)で渡したデータベースプールを取得
//   → 自動的にCloneされる
// 
// Result<Json<PostListResponse>, impl IntoResponse>
//   → 戻り値の型
//   → 成功時: Json(レスポンス)
//   → 失敗時: (StatusCode, Json) などのエラー
// 
// impl IntoResponse
//   → 「IntoResponseトレイトを実装する何か」
//   → 具体的な型を書かなくても良い（型推論）
// 
// Json(...)
//   → Axumの型（JSONレスポンスを返す）
//   → 自動的にContent-Type: application/jsonをセット
// 
// match ... { Ok(...) => ..., Err(...) => ... }
//   → パターンマッチング（エラーハンドリング）
//   → Resultの中身によって処理を分岐
// 
// return Err((StatusCode::..., Json(...)))
//   → 早期リターン（関数を即座に終了）
//   → エラーレスポンスを返す
// 
// .into_iter()
//   → 所有権を移動するイテレータ
//   → 元の配列は使えなくなる（消費される）
// 
// .map(|post| post.into())
//   → 各要素を変換
//   → |post| はクロージャ（無名関数）
//   → post.into() で From traitを使って変換
// 
// .collect()
//   → イテレータを配列に戻す
// 
// info!(...) / error!(...)
//   → tracingクレートのログマクロ
//   → コンソールに出力される

