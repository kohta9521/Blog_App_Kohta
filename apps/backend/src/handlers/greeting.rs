use axum::{extract::Query, response::Json};
use serde_json::{json, Value};
use tracing::info;

use crate::models::{GreetingResponse, GreetingMeta, CustomGreetingMeta, GreetingQuery};

/// GET /api/v1/hello - Rustバックエンドからの挨拶
#[utoipa::path(
    get,
    path = "/api/v1/hello",
    tag = "greeting",
    summary = "Rust挨拶",
    description = "Rustバックエンドからの標準的な挨拶メッセージを返します",
    responses(
        (status = 200, description = "挨拶メッセージ")
    )
)]
pub async fn hello_rust() -> Json<Value> {
    info!("Hello Rust endpoint called");
    
    let greeting = GreetingResponse::rust_greeting();
    let meta = GreetingMeta::default();

    Json(json!({
        "greeting": greeting,
        "meta": meta
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
        (status = 200, description = "カスタム挨拶メッセージ")
    )
)]
pub async fn custom_hello(Query(params): Query<GreetingQuery>) -> Json<Value> {
    info!("Custom hello endpoint called with name: {:?}", params.name);
    
    let greeting = GreetingResponse::custom_greeting(params.name);
    let meta = CustomGreetingMeta::default();

    Json(json!({
        "greeting": greeting,
        "meta": meta
    }))
}
