# ⚡ Backend - Rust API Server

<div align="center">

![Rust](https://img.shields.io/badge/Rust-2024_Edition-000000?style=for-the-badge&logo=rust&logoColor=white)
![Tokio](https://img.shields.io/badge/Tokio-Async_Runtime-000000?style=for-the-badge&logo=rust&logoColor=white)
![Axum](https://img.shields.io/badge/Axum-Web_Framework-000000?style=for-the-badge&logo=rust&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)

**高性能・型安全なRust製APIサーバー - テックブログのバックエンド**

</div>

---

## 🏗️ アーキテクチャ概要

### 📁 ディレクトリ構造（予定）

```
apps/backend/
├── 📦 src/
│   ├── 🚀 main.rs              # アプリケーションエントリポイント
│   ├── 🌐 api/                 # HTTP API レイヤー
│   │   ├── mod.rs
│   │   ├── 📝 posts.rs         # ブログ記事API (/posts, /posts/{id})
│   │   ├── 💚 health.rs        # ヘルスチェック (/health)
│   │   └── 🔍 search.rs        # 検索API (/search)
│   ├── 🏛️ domain/              # ドメインロジック
│   │   ├── mod.rs
│   │   ├── 📄 post.rs          # Post エンティティ・ビジネスロジック
│   │   ├── 👤 user.rs          # User エンティティ（将来）
│   │   └── 🏷️ tag.rs           # Tag エンティティ（将来）
│   ├── 🏗️ infrastructure/      # インフラストラクチャ層
│   │   ├── mod.rs
│   │   ├── 🗄️ database.rs      # データベース接続・設定
│   │   ├── 📊 repositories/    # データアクセス層
│   │   │   ├── mod.rs
│   │   │   └── post_repository.rs
│   │   └── 🔌 external/        # 外部サービス連携
│   │       └── mod.rs
│   ├── 🔒 security/            # セキュリティ層
│   │   ├── mod.rs
│   │   ├── 🛡️ headers.rs       # セキュリティヘッダー
│   │   ├── 🔐 auth.rs          # 認証・認可（将来）
│   │   └── 🚦 cors.rs          # CORS設定
│   ├── 🛠️ utils/               # ユーティリティ
│   │   ├── mod.rs
│   │   ├── ⚠️ error.rs         # エラーハンドリング
│   │   └── 📝 logger.rs        # ログ設定
│   └── ⚙️ config/              # 設定管理
│       ├── mod.rs
│       └── database.rs
├── 📋 Cargo.toml               # 依存関係・プロジェクト設定
├── 🗄️ migrations/              # データベースマイグレーション（予定）
│   └── 001_create_posts.sql
├── 🧪 tests/                   # 統合テスト（予定）
│   └── api_tests.rs
└── 📄 README.md                # このファイル
```

---

## 🛠️ 技術スタック

<table>
<tr>
<th>🏗️ Core Framework</th>
<th>🗄️ Database</th>
<th>🔧 Development</th>
</tr>
<tr>
<td>

**Rust 2024 Edition**
- メモリ安全性
- ゼロコスト抽象化
- 並行処理サポート

**Tokio**
- 非同期ランタイム
- 高性能I/O
- 並行処理

**Axum**
- モダンWebフレームワーク
- 型安全なルーティング
- ミドルウェアサポート

</td>
<td>

**SQLx**
- コンパイル時SQL検証
- 非同期データベースドライバ
- マイグレーション対応

**PostgreSQL**
- ACID準拠
- 高性能・高機能
- JSON対応

</td>
<td>

**Cargo**
- パッケージ管理
- ビルドシステム
- テストランナー

**serde**
- シリアライゼーション
- JSON/YAML対応

**tracing**
- 構造化ログ
- 分散トレーシング

</td>
</tr>
</table>

---

## 🚀 開発環境セットアップ

### 1. Rust環境の準備

```bash
# Rustのインストール（未インストールの場合）
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 最新版への更新
rustup update

# 2024 Editionの確認
rustc --version
```

### 2. 依存関係のインストール

```bash
# プロジェクトルートから
cd apps/backend

# 依存関係の確認・インストール
cargo check

# ビルド
cargo build

# リリースビルド
cargo build --release
```

### 3. 開発サーバーの起動

```bash
# 開発サーバー起動 (http://localhost:8000)
cargo run

# ファイル変更時の自動再起動（cargo-watch使用）
cargo install cargo-watch
cargo watch -x run

# テスト実行
cargo test

# フォーマット
cargo fmt

# Lintチェック
cargo clippy
```

### 4. データベース設定

```bash
# PostgreSQL起動（Docker使用）
docker run --name blog-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=blog_dev \
  -p 5432:5432 \
  -d postgres:15

# 環境変数設定
export DATABASE_URL="postgresql://postgres:password@localhost:5432/blog_dev"

# マイグレーション実行（SQLx CLI使用）
cargo install sqlx-cli
sqlx migrate run
```

---

## 🏛️ レイヤードアーキテクチャ

### API Layer（HTTP境界）

```rust
// src/api/posts.rs
use axum::{extract::Path, http::StatusCode, response::Json, routing::get, Router};
use crate::domain::post::Post;

pub fn posts_router() -> Router {
    Router::new()
        .route("/posts", get(list_posts).post(create_post))
        .route("/posts/:id", get(get_post).put(update_post).delete(delete_post))
}

async fn list_posts() -> Result<Json<Vec<Post>>, StatusCode> {
    // ドメインサービスを呼び出し
    todo!("Implement list_posts")
}

async fn get_post(Path(id): Path<u32>) -> Result<Json<Post>, StatusCode> {
    // ドメインサービスを呼び出し
    todo!("Implement get_post")
}
```

### Domain Layer（ビジネスロジック）

```rust
// src/domain/post.rs
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Post {
    pub id: u32,
    pub title: String,
    pub slug: String,
    pub content: String,
    pub excerpt: Option<String>,
    pub published: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Post {
    pub fn new(title: String, content: String) -> Self {
        let slug = Self::generate_slug(&title);
        let now = Utc::now();
        
        Self {
            id: 0, // データベースで自動生成
            title,
            slug,
            content,
            excerpt: None,
            published: false,
            created_at: now,
            updated_at: now,
        }
    }
    
    pub fn generate_slug(title: &str) -> String {
        title
            .to_lowercase()
            .chars()
            .map(|c| if c.is_alphanumeric() { c } else { '-' })
            .collect::<String>()
            .split('-')
            .filter(|s| !s.is_empty())
            .collect::<Vec<_>>()
            .join("-")
    }
    
    pub fn publish(&mut self) {
        self.published = true;
        self.updated_at = Utc::now();
    }
}
```

### Infrastructure Layer（データアクセス）

```rust
// src/infrastructure/repositories/post_repository.rs
use sqlx::{PgPool, Row};
use crate::domain::post::Post;

pub struct PostRepository {
    pool: PgPool,
}

impl PostRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
    
    pub async fn find_all(&self) -> Result<Vec<Post>, sqlx::Error> {
        let posts = sqlx::query_as!(
            Post,
            "SELECT id, title, slug, content, excerpt, published, created_at, updated_at 
             FROM posts 
             ORDER BY created_at DESC"
        )
        .fetch_all(&self.pool)
        .await?;
        
        Ok(posts)
    }
    
    pub async fn find_by_id(&self, id: u32) -> Result<Option<Post>, sqlx::Error> {
        let post = sqlx::query_as!(
            Post,
            "SELECT id, title, slug, content, excerpt, published, created_at, updated_at 
             FROM posts 
             WHERE id = $1",
            id as i32
        )
        .fetch_optional(&self.pool)
        .await?;
        
        Ok(post)
    }
    
    pub async fn save(&self, post: &Post) -> Result<Post, sqlx::Error> {
        let saved_post = sqlx::query_as!(
            Post,
            "INSERT INTO posts (title, slug, content, excerpt, published, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, title, slug, content, excerpt, published, created_at, updated_at",
            post.title,
            post.slug,
            post.content,
            post.excerpt,
            post.published,
            post.created_at,
            post.updated_at
        )
        .fetch_one(&self.pool)
        .await?;
        
        Ok(saved_post)
    }
}
```

---

## 🔒 セキュリティ設計

### セキュリティヘッダー

```rust
// src/security/headers.rs
use axum::{
    http::{header, HeaderValue, Request, Response},
    middleware::Next,
    response::IntoResponse,
};

pub async fn security_headers<B>(
    request: Request<B>,
    next: Next<B>,
) -> impl IntoResponse {
    let mut response = next.run(request).await;
    
    let headers = response.headers_mut();
    
    // セキュリティヘッダーの設定
    headers.insert(
        header::CONTENT_SECURITY_POLICY,
        HeaderValue::from_static("default-src 'self'"),
    );
    headers.insert(
        header::X_FRAME_OPTIONS,
        HeaderValue::from_static("DENY"),
    );
    headers.insert(
        "X-Content-Type-Options",
        HeaderValue::from_static("nosniff"),
    );
    headers.insert(
        "Strict-Transport-Security",
        HeaderValue::from_static("max-age=31536000; includeSubDomains"),
    );
    
    response
}
```

### CORS設定

```rust
// src/security/cors.rs
use tower_http::cors::{Any, CorsLayer};

pub fn cors_layer() -> CorsLayer {
    CorsLayer::new()
        .allow_origin(Any) // 開発環境用、本番では特定ドメインに制限
        .allow_methods(Any)
        .allow_headers(Any)
}
```

---

## ⚠️ エラーハンドリング

```rust
// src/utils/error.rs
use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;

#[derive(Debug)]
pub enum AppError {
    DatabaseError(sqlx::Error),
    NotFound(String),
    ValidationError(String),
    InternalServerError(String),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            AppError::DatabaseError(err) => {
                tracing::error!("Database error: {:?}", err);
                (StatusCode::INTERNAL_SERVER_ERROR, "Internal server error")
            }
            AppError::NotFound(msg) => (StatusCode::NOT_FOUND, msg.as_str()),
            AppError::ValidationError(msg) => (StatusCode::BAD_REQUEST, msg.as_str()),
            AppError::InternalServerError(msg) => {
                tracing::error!("Internal server error: {}", msg);
                (StatusCode::INTERNAL_SERVER_ERROR, "Internal server error")
            }
        };

        let body = Json(json!({
            "error": error_message,
            "status": status.as_u16()
        }));

        (status, body).into_response()
    }
}
```

---

## 📊 データベース設計

### Posts テーブル

```sql
-- migrations/001_create_posts.sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_published ON posts(published);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

---

## 🧪 テスト戦略

### ユニットテスト

```rust
// src/domain/post.rs
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generate_slug() {
        let title = "Hello World! This is a Test.";
        let slug = Post::generate_slug(title);
        assert_eq!(slug, "hello-world-this-is-a-test");
    }

    #[test]
    fn test_publish() {
        let mut post = Post::new("Test Title".to_string(), "Test content".to_string());
        assert!(!post.published);
        
        post.publish();
        assert!(post.published);
    }
}
```

### 統合テスト

```rust
// tests/api_tests.rs
use axum_test::TestServer;
use your_app::create_app;

#[tokio::test]
async fn test_health_endpoint() {
    let app = create_app().await;
    let server = TestServer::new(app).unwrap();
    
    let response = server.get("/health").await;
    response.assert_status_ok();
    response.assert_json(&serde_json::json!({
        "status": "ok"
    }));
}
```

---

## 📦 Cargo.toml 設定

```toml
[package]
name = "backend"
version = "0.1.0"
edition = "2024"

[dependencies]
# Web Framework
axum = "0.7"
tokio = { version = "1.0", features = ["full"] }
tower = "0.4"
tower-http = { version = "0.5", features = ["cors", "trace"] }

# Database
sqlx = { version = "0.7", features = ["runtime-tokio-rustls", "postgres", "chrono", "uuid"] }

# Serialization
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"

# Date/Time
chrono = { version = "0.4", features = ["serde"] }

# Logging
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["env-filter"] }

# Configuration
dotenvy = "0.15"

# Error Handling
anyhow = "1.0"
thiserror = "1.0"

[dev-dependencies]
axum-test = "14.0"
```

---

## 🚀 デプロイ設定

### Docker対応

```dockerfile
# Dockerfile
FROM rust:1.75 as builder

WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src ./src

RUN cargo build --release

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/backend /usr/local/bin/backend

EXPOSE 8000

CMD ["backend"]
```

### 環境変数

```bash
# .env.example
DATABASE_URL=postgresql://postgres:password@localhost:5432/blog_dev
RUST_LOG=info
SERVER_PORT=8000
SERVER_HOST=0.0.0.0
```

---

## 🚀 今後の開発予定

- [ ] **基本API**: CRUD操作の実装
- [ ] **認証システム**: JWT認証・認可
- [ ] **検索機能**: 全文検索・タグ検索
- [ ] **キャッシュ**: Redis連携
- [ ] **ファイルアップロード**: 画像・ファイル管理
- [ ] **API ドキュメント**: OpenAPI/Swagger
- [ ] **メトリクス**: Prometheus対応
- [ ] **ログ集約**: 構造化ログ・分散トレーシング
- [ ] **バックアップ**: データベースバックアップ自動化

---

<div align="center">

**⚡ このRust APIサーバーは、高性能・型安全・保守性を重視した**  
**モダンなバックエンドアーキテクチャを目指しています。**

[![Rust](https://img.shields.io/badge/Made%20with-Rust-black?style=flat-square&logo=rust)](https://www.rust-lang.org/)
[![Axum](https://img.shields.io/badge/Powered%20by-Axum-black?style=flat-square)](https://github.com/tokio-rs/axum)

</div>
