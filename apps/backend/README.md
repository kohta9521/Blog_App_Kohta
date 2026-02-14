# Blog Backend (Rust/Axum)

Rust製のブログバックエンドAPI。Axum + PostgreSQL + Swagger UI/OpenAPI。

## 🚀 クイックスタート

### Docker で起動（推奨）

```bash
# プロジェクトルートから開発環境を起動
docker compose -f docker-compose.dev.yml up -d

# ログを確認
docker compose -f docker-compose.dev.yml logs -f backend

# 停止
docker compose -f docker-compose.dev.yml down
```

### ローカルで起動

```bash
# 環境変数を設定
cp .env.example .env

# データベースを起動
docker compose -f ../../docker-compose.dev.yml up -d postgres

# アプリケーションを起動
cargo run

# 開発モード（ホットリロード）
cargo watch -x run
```

## 📚 API ドキュメント (Swagger UI)

バックエンドが起動したら、以下のURLにアクセス：

### Swagger UI
```
http://localhost:8000/swagger-ui
```

対話的にAPIをテストできます。

### OpenAPI JSON
```
http://localhost:8000/api-docs/openapi.json
```

OpenAPI 3.0 仕様のJSON。クライアントコード生成などに使用できます。

## 🔌 エンドポイント

### ヘルスチェック
- **GET** `/health` - サーバー稼働確認

### 挨拶 API
- **GET** `/api/v1/hello` - Rust バックエンドからの挨拶
- **GET** `/api/v1/hello/custom?name={name}` - カスタム挨拶

### 言語情報 API
- **GET** `/api/v1/locales` - 全言語取得
- **GET** `/api/v1/locales/active` - 有効な言語のみ取得
- **GET** `/api/v1/locales/{code}` - 特定言語取得（例: `/api/v1/locales/ja`）

## 🧪 テスト

```bash
# ヘルスチェック
curl http://localhost:8000/health

# 全言語取得
curl http://localhost:8000/api/v1/locales

# 特定言語取得
curl http://localhost:8000/api/v1/locales/ja

# カスタム挨拶
curl "http://localhost:8000/api/v1/hello/custom?name=Kohta"
```

## 🛠️ 開発

### ディレクトリ構成

```
src/
├── main.rs              # エントリーポイント
├── routes/mod.rs        # ルーティング設定
├── handlers/            # HTTPハンドラー
│   ├── health.rs        # ヘルスチェック
│   ├── greeting.rs      # 挨拶API
│   └── locales.rs       # 言語情報API
├── models/              # データモデル & OpenAPI定義
│   ├── api_doc.rs       # OpenAPI設定
│   ├── health.rs        # ヘルスチェックレスポンス
│   └── greeting.rs      # 挨拶レスポンス
├── entities/            # エンティティ（DB対応）
│   └── locale.rs        # Localeエンティティ
├── repositories/        # データアクセス層
│   └── locale_repository.rs
└── database.rs          # DB接続

docs/
└── SWAGGER.md           # Swagger/OpenAPI詳細ドキュメント

migrations/              # データベースマイグレーション
```

### 新しいエンドポイントの追加

1. **ハンドラーを作成** (`src/handlers/your_handler.rs`)
   ```rust
   #[utoipa::path(
       get,
       path = "/api/v1/your-endpoint",
       tag = "your-tag",
       responses(
           (status = 200, description = "成功", body = YourResponse)
       )
   )]
   pub async fn your_handler() -> Json<YourResponse> {
       // 実装
   }
   ```

2. **OpenAPI定義に追加** (`src/models/api_doc.rs`)
   ```rust
   paths(
       // 既存...
       crate::handlers::your_module::your_handler,
   ),
   components(schemas(
       // 既存...
       YourResponse,
   )),
   ```

3. **ルーティングに追加** (`src/routes/mod.rs`)
   ```rust
   .route("/api/v1/your-endpoint", get(handlers::your_module::your_handler))
   ```

詳細は [`docs/SWAGGER.md`](./docs/SWAGGER.md) を参照。

## 🗄️ データベース

PostgreSQL を使用。

### マイグレーション

```bash
# sqlx-cliをインストール
cargo install sqlx-cli --no-default-features --features postgres

# マイグレーション実行
sqlx migrate run

# マイグレーション作成
sqlx migrate add <migration_name>
```

### 接続情報

- **Host:** `localhost`
- **Port:** `5433` (Docker) / `5432` (ローカル)
- **Database:** `blog_dev`
- **User:** `blog_user`
- **Password:** `blog_password`

接続文字列:
```
postgresql://blog_user:blog_password@localhost:5433/blog_dev
```

## 📦 依存関係

主な使用クレート：

- **axum** (0.8) - Webフレームワーク
- **tokio** (1.38) - 非同期ランタイム
- **sqlx** (0.8) - データベースクライアント
- **utoipa** (5.1) - OpenAPI生成
- **utoipa-swagger-ui** (9.0) - Swagger UI
- **tower-http** (0.6) - ミドルウェア (CORS, Tracing)
- **tracing** (0.1) - ログ出力

## 🔧 トラブルシューティング

### Swagger UIが表示されない

1. バックエンドが起動しているか確認
   ```bash
   curl http://localhost:8000/health
   ```

2. コンテナログを確認
   ```bash
   docker compose -f ../../docker-compose.dev.yml logs backend
   ```

### データベースに接続できない

1. PostgreSQLが起動しているか確認
   ```bash
   docker compose -f ../../docker-compose.dev.yml ps postgres
   ```

2. ヘルスチェックを確認
   ```bash
   docker compose -f ../../docker-compose.dev.yml exec postgres \
     pg_isready -U blog_user -d blog_dev
   ```

### ビルドエラー

```bash
# 依存関係をクリーン
cargo clean

# 再ビルド
cargo build
```

## 📝 ライセンス

MIT
