# Swagger UI ガイド

## 概要

このバックエンドは [utoipa](https://github.com/juhaku/utoipa) と [utoipa-swagger-ui](https://github.com/juhaku/utoipa) を使用して、OpenAPI 3.0 仕様に準拠した API ドキュメントを自動生成しています。

## アクセス方法

### ローカル開発環境

```bash
# Docker Compose で起動
docker compose -f docker-compose.dev.yml up -d

# Swagger UI にアクセス
open http://localhost:8000/swagger-ui

# OpenAPI JSON 仕様を取得
curl http://localhost:8000/api-docs/openapi.json
```

### 本番環境

```
https://api.blog.example.com/swagger-ui
```

## エンドポイント一覧

### ヘルスチェック

- **GET** `/health` - サーバーの稼働状態を確認

### 挨拶 API

- **GET** `/api/v1/hello` - Rust バックエンドからの標準挨拶
- **GET** `/api/v1/hello/custom?name={name}` - カスタム挨拶

### 言語情報 API

- **GET** `/api/v1/locales` - 全言語取得
- **GET** `/api/v1/locales/active` - 有効な言語のみ取得
- **GET** `/api/v1/locales/{code}` - 特定言語取得（例: `/api/v1/locales/ja`）

## OpenAPI 定義の更新方法

新しいエンドポイントを追加する場合：

### 1. ハンドラーに `utoipa::path` アノテーションを追加

```rust
/// src/handlers/your_handler.rs
use utoipa::ToSchema;

#[utoipa::path(
    get,
    path = "/api/v1/your-endpoint",
    tag = "your-tag",
    summary = "エンドポイントの概要",
    description = "エンドポイントの詳細説明",
    responses(
        (status = 200, description = "成功", body = YourResponse),
        (status = 404, description = "見つかりません"),
        (status = 500, description = "サーバーエラー")
    )
)]
pub async fn your_handler() -> Json<YourResponse> {
    // ...
}

// レスポンス型に ToSchema を追加
#[derive(Serialize, ToSchema)]
pub struct YourResponse {
    #[schema(example = "example value")]
    pub field: String,
}
```

### 2. `src/models/api_doc.rs` を更新

```rust
#[derive(OpenApi)]
#[openapi(
    paths(
        // 既存のパス...
        crate::handlers::your_module::your_handler,  // 追加
    ),
    components(schemas(
        // 既存のスキーマ...
        crate::handlers::your_module::YourResponse,  // 追加
    )),
    tags(
        // 既存のタグ...
        (name = "your-tag", description = "タグの説明"),  // 追加
    ),
    // ...
)]
pub struct ApiDoc;
```

### 3. ビルドして確認

```bash
cargo check
docker compose -f docker-compose.dev.yml up -d --build backend
```

## OpenAPI 仕様のエクスポート

OpenAPI JSON をエクスポートしてクライアントコード生成に使用できます：

```bash
# JSON をファイルに保存
curl http://localhost:8000/api-docs/openapi.json > openapi.json

# TypeScript クライアント生成（例）
npx @openapitools/openapi-generator-cli generate \
  -i openapi.json \
  -g typescript-axios \
  -o ./generated/api-client
```

## トラブルシューティング

### Swagger UI が表示されない

1. コンテナが起動しているか確認
   ```bash
   docker compose -f docker-compose.dev.yml ps
   ```

2. ログを確認
   ```bash
   docker compose -f docker-compose.dev.yml logs backend
   ```

3. ヘルスチェックエンドポイントで確認
   ```bash
   curl http://localhost:8000/health
   ```

### 新しいエンドポイントが表示されない

1. `api_doc.rs` の `paths` に追加されているか確認
2. ハンドラーに `#[utoipa::path(...)]` アノテーションが付いているか確認
3. レスポンス型に `ToSchema` が derive されているか確認
4. ビルドエラーがないか確認

```bash
cargo check
```

## 参考リンク

- [utoipa ドキュメント](https://docs.rs/utoipa/)
- [OpenAPI 3.0 仕様](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
