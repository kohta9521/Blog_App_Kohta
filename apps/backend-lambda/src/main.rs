use lambda_http::{run, service_fn, Body, Error, Request, RequestExt, Response};
use serde::{Deserialize, Serialize};
use serde_json::json;
use tracing::info;
use std::time::{SystemTime, UNIX_EPOCH};

/// Hello World APIのレスポンス構造
#[derive(Serialize, Deserialize)]
struct HelloResponse {
    message: String,
    environment: String,
    timestamp: String,
}

/// メインのハンドラー関数
/// Lambda関数が呼び出されるたびに実行される
async fn function_handler(event: Request) -> Result<Response<Body>, Error> {
    // リクエスト情報をログに記録
    info!("Handling request: {:?}", event.uri());
    
    // 環境変数から環境名を取得（dev/prod）
    let environment = std::env::var("ENVIRONMENT").unwrap_or_else(|_| "unknown".to_string());
    
    // パスパラメータやクエリパラメータを取得する例
    let path = event.uri().path();
    let _query_params = event.query_string_parameters();
    
    // 現在のタイムスタンプを取得（UnixタイムスタンプをISO 8601形式に変換）
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();
    let timestamp_str = format_timestamp(timestamp);
    
    // レスポンスの作成
    let response_body = match path {
        // ヘルスチェックエンドポイント
        "/health" => {
            json!({
                "status": "healthy",
                "environment": environment,
                "timestamp": timestamp_str
            })
        },
        // Hello Worldエンドポイント
        "/" | "/hello" => {
            let hello_response = HelloResponse {
                message: "Hello World from Rust Lambda! 🦀".to_string(),
                environment: environment.clone(),
                timestamp: timestamp_str.clone(),
            };
            serde_json::to_value(hello_response)?
        },
        // その他のパス
        _ => {
            json!({
                "error": "Not Found",
                "path": path,
                "environment": environment
            })
        }
    };

    // CORS対応のレスポンスヘッダーを設定
    // 環境変数からフロントエンドURLを取得
    let allowed_origin = std::env::var("ALLOWED_ORIGIN")
        .unwrap_or_else(|_| "*".to_string());
    
    let response = Response::builder()
        .status(if path == "/" || path == "/hello" || path == "/health" { 200 } else { 404 })
        .header("content-type", "application/json")
        .header("access-control-allow-origin", allowed_origin)
        .header("access-control-allow-methods", "GET, POST, OPTIONS")
        .header("access-control-allow-headers", "Content-Type")
        .body(Body::Text(response_body.to_string()))?;

    Ok(response)
}

/// UnixタイムスタンプをISO 8601形式の文字列に変換
fn format_timestamp(timestamp: u64) -> String {
    // 簡易的なISO 8601形式への変換
    // 本番環境では chrono を使うことを推奨
    let seconds = timestamp % 60;
    let minutes = (timestamp / 60) % 60;
    let hours = (timestamp / 3600) % 24;
    let days = timestamp / 86400;
    
    // 1970-01-01からの日数を年月日に変換（簡易版）
    let year = 1970 + (days / 365);
    let day_of_year = days % 365;
    let month = (day_of_year / 30) + 1;
    let day = (day_of_year % 30) + 1;
    
    format!(
        "{:04}-{:02}-{:02}T{:02}:{:02}:{:02}Z",
        year, month, day, hours, minutes, seconds
    )
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    // ログの初期化
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .with_target(false)
        .without_time()
        .init();

    info!("🦀 Starting Rust Lambda Function...");

    // Lambda Runtimeを起動
    run(service_fn(function_handler)).await
}
