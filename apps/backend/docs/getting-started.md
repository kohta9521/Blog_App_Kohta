# 🚀 Getting Started - Backend

## ✅ 完成した機能

### 1. データベース

- ✅ PostgreSQL 15 (Docker Compose)
- ✅ 8 テーブルの完全なスキーマ
- ✅ 多言語対応（日本語・英語）
- ✅ サンプルデータ（記事 3 件、カテゴリ 5 件、タグ 15 件）

### 2. Rust バックエンド

- ✅ Axum Web フレームワーク
- ✅ SQLx データベース接続
- ✅ OpenAPI/Swagger UI
- ✅ CORS 設定
- ✅ 構造化ログ

---

## 🏃 クイックスタート

### 1. データベース起動

```bash
# プロジェクトルートで実行
cd /path/to/blog
docker-compose up -d postgres
```

### 2. データベース確認（Postico）

```
ホスト:      localhost
ポート:      5432
ユーザー:    blog_user
パスワード:  blog_password
データベース: blog_dev
```

詳細: [Postico 接続ガイド](./postico-setup.md)

### 3. バックエンドサーバー起動

```bash
cd apps/backend
cargo run
```

### 4. 動作確認

```bash
# ヘルスチェック
curl http://localhost:8000/health

# 挨拶API
curl http://localhost:8000/api/v1/hello

# Swagger UI
open http://localhost:8000/swagger-ui
```

---

## 📊 エンドポイント一覧

### 現在利用可能

| Method | Path                              | 説明                             |
| ------ | --------------------------------- | -------------------------------- |
| GET    | `/health`                         | ヘルスチェック                   |
| GET    | `/api/v1/health`                  | ヘルスチェック（バージョン付き） |
| GET    | `/api/v1/hello`                   | Rust 挨拶                        |
| GET    | `/api/v1/hello/custom?name=Kohta` | カスタム挨拶                     |
| GET    | `/swagger-ui`                     | Swagger UI                       |
| GET    | `/api-docs/openapi.json`          | OpenAPI 仕様                     |

### 実装予定

| Method | Path                  | 説明         |
| ------ | --------------------- | ------------ |
| GET    | `/api/v1/posts`       | 記事一覧取得 |
| GET    | `/api/v1/posts/:slug` | 記事詳細取得 |
| POST   | `/api/v1/posts`       | 記事作成     |
| PUT    | `/api/v1/posts/:id`   | 記事更新     |
| DELETE | `/api/v1/posts/:id`   | 記事削除     |
| GET    | `/api/v1/categories`  | カテゴリ一覧 |
| GET    | `/api/v1/tags`        | タグ一覧     |

---

## 🗄️ データベーススキーマ

### テーブル構成

1. **users** - 著者・管理者
2. **categories** - カテゴリ（技術、チュートリアル、考察、ニュース、キャリア）
3. **tags** - タグ（Rust, React, Next.js, TypeScript, Docker など）
4. **posts** - ブログ記事（Markdown 形式、多言語対応）
5. **post_tags** - 記事とタグの関連
6. **post_relations** - 記事間の関連（前後・おすすめ）
7. **media** - メディアファイル管理
8. **post_revisions** - 記事の変更履歴

詳細: [データベース設計書](./database-schema.md)

---

## 🔧 開発コマンド

### ビルド

```bash
# デバッグビルド
cargo build

# リリースビルド
cargo build --release

# チェックのみ（速い）
cargo check
```

### 実行

```bash
# 開発モード
cargo run

# 環境変数を指定して実行
DATABASE_URL=postgresql://blog_user:blog_password@localhost:5432/blog_dev cargo run

# ファイル変更時の自動再起動
cargo install cargo-watch
cargo watch -x run
```

### テスト

```bash
# すべてのテスト実行
cargo test

# 詳細出力
cargo test -- --nocapture
```

### フォーマット・Lint

```bash
# コードフォーマット
cargo fmt

# Lint
cargo clippy

# Lint（すべての警告を表示）
cargo clippy -- -W clippy::all
```

---

## 📂 プロジェクト構造

```
apps/backend/
├── src/
│   ├── main.rs              # エントリポイント
│   ├── database.rs          # データベース接続
│   ├── routes/              # ルーティング
│   │   └── mod.rs
│   ├── handlers/            # APIハンドラー
│   │   ├── health.rs
│   │   ├── greeting.rs
│   │   └── mod.rs
│   ├── models/              # データモデル
│   │   ├── api_doc.rs       # OpenAPI定義
│   │   ├── health.rs
│   │   ├── greeting.rs
│   │   └── mod.rs
│   └── domain/              # ドメインロジック（将来）
│       └── entities/
├── migrations/              # マイグレーションSQL
│   ├── 001_create_base_tables.sql
│   └── 002_insert_initial_data.sql
├── docs/                    # ドキュメント
│   ├── database-schema.md   # DB設計書
│   ├── postico-setup.md     # Postico接続ガイド
│   └── getting-started.md   # このファイル
├── Cargo.toml               # 依存関係
├── Dockerfile               # Dockerイメージ
└── README.md
```

---

## 🐳 Docker

### ローカルビルド

```bash
docker build -t blog-backend .
```

### 実行

```bash
docker run -p 8000:8000 \
  -e DATABASE_URL=postgresql://blog_user:blog_password@host.docker.internal:5432/blog_dev \
  blog-backend
```

---

## 🔍 トラブルシューティング

### データベースに接続できない

```bash
# PostgreSQLが起動しているか確認
docker ps | grep blog-postgres

# 起動していない場合
docker-compose up -d postgres

# ログを確認
docker logs blog-postgres
```

### ポート 8000 が使用中

```bash
# 使用中のプロセスを確認
lsof -i :8000

# プロセスを終了
kill -9 <PID>

# または別のポートを使用
PORT=8080 cargo run
```

### マイグレーションエラー

```bash
# データベースをリセット
docker-compose down -v
docker-compose up -d postgres

# マイグレーションを再実行
cd apps/backend
PGPASSWORD=blog_password psql -h localhost -U blog_user -d blog_dev -f migrations/001_create_base_tables.sql
PGPASSWORD=blog_password psql -h localhost -U blog_user -d blog_dev -f migrations/002_insert_initial_data.sql
```

---

## 📚 参考リンク

- [Axum Documentation](https://docs.rs/axum/latest/axum/)
- [SQLx Documentation](https://docs.rs/sqlx/latest/sqlx/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Rust Book (日本語)](https://doc.rust-jp.rs/book-ja/)

---

## 🎯 次のステップ

1. **ブログ記事 API 実装**

   - [ ] 記事一覧取得
   - [ ] 記事詳細取得
   - [ ] 記事作成・更新・削除

2. **認証・認可**

   - [ ] JWT 認証
   - [ ] ロール管理

3. **高度な機能**
   - [ ] 全文検索
   - [ ] ページネーション
   - [ ] キャッシュ（Redis）
   - [ ] 画像アップロード
