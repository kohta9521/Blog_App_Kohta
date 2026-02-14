
use axum::{
    extract::{Path, State},  // URLパラメータと状態を取得
    http::StatusCode,        // HTTPステータスコード（200, 404, 500など）
    response::{IntoResponse, Json},  // JSONレスポンス
};
use serde::{Deserialize, Serialize};  // JSON変換
use sqlx::PgPool;  // PostgreSQL接続プール
use tracing::{error, info};  // ログ出力
use utoipa::ToSchema;  // OpenAPIスキーマ生成

use crate::{
    entities::Locale,  // Localeエンティティ
    repositories::LocaleRepository,  // LocaleRepository
};

// ============================================
// レスポンス用の構造体
// ============================================
//
// 💡 なぜエンティティをそのまま返さない?
// 1. APIレスポンスの形式をカスタマイズしたい
// 2. 内部実装とAPI仕様を分離したい
// 3. 将来の変更に柔軟に対応するため

// --------------------------------------------------------
// LocaleResponse: 単一言語のレスポンス
// --------------------------------------------------------
#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct LocaleResponse {
    /// 言語ID
    #[schema(example = 1)]
    pub locale_id: i32,
    /// 言語コード
    #[schema(example = "ja")]
    pub code: String,
    /// 言語名
    #[schema(example = "日本語")]
    pub name: String,
    /// デフォルト言語フラグ
    #[schema(example = true)]
    pub is_default: bool,
    /// 有効化フラグ
    #[schema(example = true)]
    pub is_active: bool,
}

// EntityからResponseへの変換を実装
//
// 💡 From トレイト:
// - ある型から別の型への変換を定義
// - .into()メソッドで変換できるようになる
//
// 💡 使用例:
//   let locale: Locale = ...;
//   let response: LocaleResponse = locale.into();
impl From<Locale> for LocaleResponse {
    fn from(locale: Locale) -> Self {
        Self {
            locale_id: locale.locale_id,
            code: locale.code,
            name: locale.name,
            is_default: locale.is_default,
            is_active: locale.is_active,
        }
    }
}

// --------------------------------------------------------
// LocalesListResponse: 言語一覧のレスポンス
// --------------------------------------------------------
//
// 💡 なぜ配列をラップする?
// - 将来的にメタ情報を追加しやすい
// - 例: total（総数）、page（ページ番号）など
#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct LocalesListResponse {
    /// 言語一覧
    pub locales: Vec<LocaleResponse>,
    /// 総数
    #[schema(example = 2)]
    pub total: usize,
}

// ============================================
// Handler関数
// ============================================

// --------------------------------------------------------
// list_locales: 全言語取得
// --------------------------------------------------------
//
// 💡 エンドポイント: GET /api/v1/locales
//
// 💡 引数:
//   State(pool): State<PgPool>
//   - Axumの状態抽出（State Extractor）
//   - main.rsで.with_state(pool)で渡したPgPoolを取得
//   - 自動的にCloneされる
//
// 💡 戻り値:
//   Result<Json<LocalesListResponse>, impl IntoResponse>
//   - 成功時: Json(レスポンス) → 200 OK
//   - 失敗時: (StatusCode, Json(エラー)) → 500 Error
//
// 💡 使用例:
//   curl http://localhost:8000/api/v1/locales
#[utoipa::path(
    get,
    path = "/api/v1/locales",
    tag = "locales",
    summary = "全言語取得",
    description = "登録されているすべての言語情報を取得します",
    responses(
        (status = 200, description = "言語一覧", body = LocalesListResponse),
        (status = 500, description = "サーバーエラー")
    )
)]
pub async fn list_locales(
    State(pool): State<PgPool>,
) -> Result<Json<LocalesListResponse>, impl IntoResponse> {
    // ------------------------------------------------
    // 1. ログ出力（デバッグ用）
    // ------------------------------------------------
    //
    // 💡 info!マクロ:
    // - tracingクレートのログマクロ
    // - コンソールに出力される
    // - レベル: error! > warn! > info! > debug! > trace!
    info!("🌐 Fetching all locales...");
    
    // ------------------------------------------------
    // 2. Repositoryを作成
    // ------------------------------------------------
    //
    // 💡 LocaleRepository::new(pool):
    // - poolを渡して新しいRepositoryインスタンスを作成
    let repo = LocaleRepository::new(pool);
    
    // ------------------------------------------------
    // 3. データベースから言語を取得
    // ------------------------------------------------
    //
    // 💡 matchによるエラーハンドリング:
    // - Result<T, E>をパターンマッチング
    // - Ok(value) → 成功、valueを使用
    // - Err(e) → エラー、エラーレスポンスを返す
    let locales = match repo.find_all().await {
        Ok(locales) => locales,  // 成功 → localesを取り出す
        Err(e) => {
            // ------------------------------------------------
            // エラー処理
            // ------------------------------------------------
            //
            // 💡 error!マクロ:
            // - エラーレベルのログ出力
            // - {:?}でDebug形式で出力
            error!("❌ Failed to fetch locales: {:?}", e);
            
            // ------------------------------------------------
            // エラーレスポンスを返す
            // ------------------------------------------------
            //
            // 💡 return Err(...):
            // - 早期リターン（関数を即座に終了）
            // - タプル (StatusCode, Json) を返す
            //
            // 💡 serde_json::json!マクロ:
            // - JSONを簡単に作成できる
            // - 例: json!({"key": "value"})
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,  // 500エラー
                Json(serde_json::json!({
                    "error": "Failed to fetch locales",
                    "message": "データベースエラーが発生しました"
                })),
            ));
        }
    };
    
    // ------------------------------------------------
    // 4. EntityをResponseに変換
    // ------------------------------------------------
    //
    // 💡 イテレータチェーン:
    // locales (Vec<Locale>)
    //   ↓ .into_iter() : 所有権を移動するイテレータ
    //   ↓ .map(|l| l.into()) : 各LocaleをLocaleResponseに変換
    //   ↓ .collect() : Vec<LocaleResponse>に集める
    let locale_responses: Vec<LocaleResponse> = locales
        .into_iter()  // イテレータに変換
        .map(|locale| locale.into())  // LocaleをLocaleResponseに変換
        .collect();  // Vec<LocaleResponse>に集める
    
    // ------------------------------------------------
    // 5. レスポンスを作成
    // ------------------------------------------------
    let total = locale_responses.len();  // 総数
    
    let response = LocalesListResponse {
        locales: locale_responses,
        total,
    };
    
    // ------------------------------------------------
    // 6. 成功ログ出力
    // ------------------------------------------------
    info!("✅ Successfully fetched {} locales", total);
    
    // ------------------------------------------------
    // 7. JSONレスポンスを返す
    // ------------------------------------------------
    //
    // 💡 Ok(Json(response)):
    // - Result型の成功値
    // - Json()でJSONレスポンスに変換
    // - Content-Type: application/jsonが自動設定される
    Ok(Json(response))
}

// --------------------------------------------------------
// list_active_locales: 有効な言語のみ取得
// --------------------------------------------------------
//
// 💡 エンドポイント: GET /api/v1/locales/active
//
// 💡 用途:
// - ユーザーが選択できる言語の一覧を表示
// - 無効化された言語を除外
#[utoipa::path(
    get,
    path = "/api/v1/locales/active",
    tag = "locales",
    summary = "有効な言語のみ取得",
    description = "有効化されている言語のみを取得します",
    responses(
        (status = 200, description = "有効な言語一覧", body = LocalesListResponse),
        (status = 500, description = "サーバーエラー")
    )
)]
pub async fn list_active_locales(
    State(pool): State<PgPool>,
) -> Result<Json<LocalesListResponse>, impl IntoResponse> {
    info!("🌐 Fetching active locales...");
    
    let repo = LocaleRepository::new(pool);
    
    // find_active()で有効な言語のみ取得
    let locales = match repo.find_active().await {
        Ok(locales) => locales,
        Err(e) => {
            error!("❌ Failed to fetch active locales: {:?}", e);
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(serde_json::json!({
                    "error": "Failed to fetch active locales",
                    "message": "データベースエラーが発生しました"
                })),
            ));
        }
    };
    
    let locale_responses: Vec<LocaleResponse> = locales
        .into_iter()
        .map(|locale| locale.into())
        .collect();
    
    let total = locale_responses.len();
    
    let response = LocalesListResponse {
        locales: locale_responses,
        total,
    };
    
    info!("✅ Successfully fetched {} active locales", total);
    
    Ok(Json(response))
}

// --------------------------------------------------------
// get_locale_by_code: 特定言語取得
// --------------------------------------------------------
//
// 💡 エンドポイント: GET /api/v1/locales/:code
//
// 💡 引数:
//   Path(code): Path<String>
//   - Axumのパス抽出（Path Extractor）
//   - URLの:codeの部分を取得
//   - 例: /api/v1/locales/ja → code = "ja"
//
// 💡 使用例:
//   curl http://localhost:8000/api/v1/locales/ja
#[utoipa::path(
    get,
    path = "/api/v1/locales/{code}",
    tag = "locales",
    summary = "特定言語取得",
    description = "言語コードを指定して特定の言語情報を取得します",
    params(
        ("code" = String, Path, description = "言語コード（例: ja, en）")
    ),
    responses(
        (status = 200, description = "言語情報", body = LocaleResponse),
        (status = 404, description = "言語が見つかりません"),
        (status = 500, description = "サーバーエラー")
    )
)]
pub async fn get_locale_by_code(
    State(pool): State<PgPool>,
    Path(code): Path<String>,  // URLパラメータを取得
) -> Result<Json<LocaleResponse>, impl IntoResponse> {
    info!("🌐 Fetching locale: {}", code);
    
    let repo = LocaleRepository::new(pool);
    
    // ------------------------------------------------
    // find_by_code()で特定言語を取得
    // ------------------------------------------------
    //
    // 💡 戻り値: Result<Option<Locale>, sqlx::Error>
    // - 見つかった: Ok(Some(locale))
    // - 見つからない: Ok(None)
    // - エラー: Err(e)
    let locale_opt = match repo.find_by_code(&code).await {
        Ok(locale_opt) => locale_opt,
        Err(e) => {
            error!("❌ Failed to fetch locale {}: {:?}", code, e);
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(serde_json::json!({
                    "error": "Failed to fetch locale",
                    "message": "データベースエラーが発生しました"
                })),
            ));
        }
    };
    
    // ------------------------------------------------
    // Optionのハンドリング
    // ------------------------------------------------
    //
    // 💡 matchでOption<Locale>を分岐:
    // - Some(locale) → 見つかった
    // - None → 見つからない（404エラー）
    match locale_opt {
        Some(locale) => {
            info!("✅ Found locale: {}", locale.name);
            
            // LocaleをLocaleResponseに変換
            let response: LocaleResponse = locale.into();
            
            Ok(Json(response))
        }
        None => {
            // ------------------------------------------------
            // 404 Not Found
            // ------------------------------------------------
            info!("⚠️ Locale not found: {}", code);
            
            Err((
                StatusCode::NOT_FOUND,  // 404エラー
                Json(serde_json::json!({
                    "error": "Locale not found",
                    "message": format!("言語コード '{}' が見つかりません", code)
                })),
            ))
        }
    }
}

// ============================================
// 💡 Rust用語解説
// ============================================
//
// async fn
//   → 非同期関数（Futureを返す）
//
// State<T>
//   → Axumの状態抽出
//   → main.rsで.with_state()で渡した値を取得
//
// Path<T>
//   → Axumのパス抽出
//   → URLの:paramの部分を取得
//
// Json<T>
//   → JSONレスポンス
//   → Serializeトレイトを実装した型をJSONに変換
//
// IntoResponse
//   → HTTPレスポンスに変換できる型
//   → Json, StatusCode, (StatusCode, Json)などが実装
//
// Result<T, E>
//   → 成功（Ok）またはエラー（Err）
//
// Option<T>
//   → 値がある（Some）またはない（None）
//
// match
//   → パターンマッチング
//   → 値を分岐して処理
//
// return Err(...)
//   → 早期リターン
//   → 関数を即座に終了してエラーを返す
//
// .into()
//   → Fromトレイトを使った型変換
//
// ============================================
// 💡 HTTPステータスコード
// ============================================
//
// 200 OK
//   → 成功
//
// 404 Not Found
//   → リソースが見つからない
//
// 500 Internal Server Error
//   → サーバー内部エラー
//
// ============================================
// 💡 次のステップ
// ============================================
// 1. routes/mod.rsでエンドポイントを登録
// 2. main.rsでモジュールをインポート
// 3. サーバーを起動して動作確認
