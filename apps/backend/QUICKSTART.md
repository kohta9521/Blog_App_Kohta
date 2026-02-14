# 🚀 Locales API クイックスタート

## ✅ このガイドの目的

`Locales`テーブルを使って、Rust + SQL の基礎を学びます。
超詳細な解説付きなので、写経しながら理解を深めてください！

---

## 📋 前提条件

- Docker Desktop がインストールされている
- Rust がインストールされている（`rustc --version`で確認）
- PostgreSQLクライアント（psqlまたはPostico）

---

## Step 1: データベースの準備

### 1-1. PostgreSQL起動

```bash
# プロジェクトルートで実行
cd /Users/kohtakochi/kohta/blog
docker-compose up -d postgres
```

### 1-2. 接続確認

```bash
# psqlで接続
psql -h localhost -p 5432 -U blog_user -d blog_dev

# パスワード: blog_password

# 接続できたら \q で終了
```

### 1-3. マイグレーション実行

```bash
cd apps/backend

# テーブル作成
psql -h localhost -p 5432 -U blog_user -d blog_dev -f migrations/001_create_locales_table.sql

# データ挿入
psql -h localhost -p 5432 -U blog_user -d blog_dev -f migrations/002_insert_locales_data.sql
```

### 1-4. データ確認

```bash
psql -h localhost -p 5432 -U blog_user -d blog_dev

# SQLで確認
SELECT * FROM locales;
```

期待される結果:
```
 locale_id | code |   name   | is_default | is_active |         created_at
-----------+------+----------+------------+-----------+---------------------------
         1 | ja   | Japanese | t          | t         | 2026-02-10 10:30:00+09:00
         2 | en   | English  | f          | t         | 2026-02-10 10:30:05+09:00
```

---

## Step 2: Rustコードの確認

### 2-1. ファイル構成

```
src/
├── entities/
│   ├── mod.rs                    # ✅ 作成済み
│   └── locale.rs                 # ✅ 作成済み（超詳細解説付き）
├── repositories/
│   ├── mod.rs                    # ✅ 作成済み
│   └── locale_repository.rs      # ✅ 作成済み（超詳細解説付き）
├── handlers/
│   ├── mod.rs                    # ✅ 更新済み
│   └── locales.rs                # ✅ 作成済み（超詳細解説付き）
├── routes/
│   └── mod.rs                    # ✅ 更新済み
└── main.rs                       # ✅ 更新済み
```

### 2-2. 各ファイルの役割

| ファイル | 役割 | 学べること |
|---------|------|-----------|
| `entities/locale.rs` | データベースの行を表す構造体 | struct, derive, 型の対応 |
| `repositories/locale_repository.rs` | データベースアクセス層 | sqlx, async/await, クエリ |
| `handlers/locales.rs` | HTTPリクエスト処理 | Axum, JSON, エラーハンドリング |
| `routes/mod.rs` | URLとハンドラーの紐付け | ルーティング |

---

## Step 3: サーバー起動

### 3-1. ビルド&実行

```bash
cd apps/backend
cargo run
```

### 3-2. 起動確認

ログに以下が表示されればOK:

```
🦀 Starting Rust Blog Backend Server...
📊 Connecting to database...
✅ Database connection successful!
🚀 Server running on http://0.0.0.0:8000
📋 Health check: http://0.0.0.0:8000/health
👋 Hello endpoint: http://0.0.0.0:8000/api/v1/hello
🌐 Locales API: http://0.0.0.0:8000/api/v1/locales
📚 Swagger UI: http://0.0.0.0:8000/swagger-ui
```

---

## Step 4: API動作確認

### 4-1. 全言語取得

```bash
curl http://localhost:8000/api/v1/locales | jq
```

期待されるレスポンス:
```json
{
  "locales": [
    {
      "locale_id": 1,
      "code": "ja",
      "name": "Japanese",
      "is_default": true,
      "is_active": true
    },
    {
      "locale_id": 2,
      "code": "en",
      "name": "English",
      "is_default": false,
      "is_active": true
    }
  ],
  "total": 2
}
```

### 4-2. 有効な言語のみ取得

```bash
curl http://localhost:8000/api/v1/locales/active | jq
```

### 4-3. 特定言語取得（日本語）

```bash
curl http://localhost:8000/api/v1/locales/ja | jq
```

期待されるレスポンス:
```json
{
  "locale_id": 1,
  "code": "ja",
  "name": "Japanese",
  "is_default": true,
  "is_active": true
}
```

### 4-4. 特定言語取得（英語）

```bash
curl http://localhost:8000/api/v1/locales/en | jq
```

### 4-5. 存在しない言語（404エラー）

```bash
curl http://localhost:8000/api/v1/locales/zh | jq
```

期待されるレスポンス:
```json
{
  "error": "Locale not found",
  "message": "言語コード 'zh' が見つかりません"
}
```

---

## Step 5: コードを読んで理解を深める

### 5-1. 読む順番

1. **entities/locale.rs**
   - データベースとRustの型の対応を理解
   - `#[derive(...)]`の意味を理解
   - 構造体とメソッドの書き方を学ぶ

2. **repositories/locale_repository.rs**
   - `sqlx::query_as!`の使い方を理解
   - `async/await`の基礎を学ぶ
   - `Result`と`Option`のエラーハンドリングを理解

3. **handlers/locales.rs**
   - Axumのハンドラー関数の書き方を学ぶ
   - `State`と`Path`の使い方を理解
   - JSONレスポンスの作り方を学ぶ

4. **routes/mod.rs**
   - URLとハンドラーの紐付け方を理解

### 5-2. 実験してみよう

#### 実験1: 新しい言語を追加

```sql
-- psqlで実行
INSERT INTO locales (code, name, is_default, is_active) 
VALUES ('zh', 'Chinese', FALSE, TRUE);
```

APIで確認:
```bash
curl http://localhost:8000/api/v1/locales | jq
```

#### 実験2: 言語を無効化

```sql
-- psqlで実行
UPDATE locales SET is_active = FALSE WHERE code = 'zh';
```

APIで確認:
```bash
curl http://localhost:8000/api/v1/locales/active | jq
```

#### 実験3: 新しいメソッドを追加

`entities/locale.rs`に以下を追加:

```rust
pub fn is_chinese(&self) -> bool {
    self.code == "zh"
}
```

再ビルド&実行:
```bash
cargo run
```

---

## 📚 学習のポイント

### SQLで学んだこと
- ✅ `CREATE TABLE` - テーブル作成
- ✅ `PRIMARY KEY` - 主キー
- ✅ `SERIAL` - 自動採番
- ✅ `UNIQUE` - 一意制約
- ✅ `NOT NULL` - NULL不可
- ✅ `DEFAULT` - デフォルト値
- ✅ `BOOLEAN` - 真偽値
- ✅ `TIMESTAMP WITH TIME ZONE` - タイムゾーン付き日時
- ✅ `CREATE INDEX` - インデックス
- ✅ `INSERT INTO` - データ挿入
- ✅ `SELECT` - データ取得
- ✅ `WHERE` - 条件指定
- ✅ `ORDER BY` - ソート
- ✅ `COUNT(*)` - 行数カウント

### Rustで学んだこと
- ✅ `struct` - 構造体
- ✅ `#[derive(...)]` - トレイトの自動実装
- ✅ `impl` - 実装ブロック
- ✅ `pub` - 公開指定子
- ✅ `mod` - モジュール
- ✅ `use` - インポート
- ✅ `async fn` - 非同期関数
- ✅ `.await` - 非同期処理の完了待ち
- ✅ `Result<T, E>` - エラーハンドリング
- ✅ `Option<T>` - NULL対応
- ✅ `?演算子` - エラー伝播
- ✅ `match` - パターンマッチング
- ✅ `Vec<T>` - 動的配列
- ✅ `.into()` - 型変換

### Axumで学んだこと
- ✅ `Router` - ルーティング
- ✅ `State<T>` - 状態管理
- ✅ `Path<T>` - URLパラメータ
- ✅ `Json<T>` - JSONレスポンス
- ✅ `StatusCode` - HTTPステータス

### SQLxで学んだこと
- ✅ `PgPool` - データベース接続プール
- ✅ `sqlx::query_as!` - 型安全なクエリ
- ✅ `.fetch_all()` - 全行取得
- ✅ `.fetch_one()` - 1行取得
- ✅ `.fetch_optional()` - 0または1行取得
- ✅ `$1, $2, ...` - プレースホルダー

---

## 🎓 次のステップ

### チュートリアル 02: Topics + Topic_Translations

次は、1対多の関係（1つのTopicに複数の翻訳）を学びます。

内容:
- 外部キー制約
- JOINによるテーブル結合
- より複雑なクエリ
- 多言語パターンの実装

準備ができたら、次のチュートリアルに進みましょう！

---

## 🆘 トラブルシューティング

### データベースに接続できない

```bash
# Dockerコンテナの状態確認
docker ps

# PostgreSQLコンテナが起動していない場合
docker-compose up -d postgres
```

### ビルドエラー

```bash
# 依存関係の再取得
cargo clean
cargo build
```

### ポートが使用中

```bash
# 既存のプロセスを確認
lsof -i :8000

# プロセスを停止
kill -9 <PID>
```

---

## 📝 まとめ

おめでとうございます！🎉

あなたは以下を学びました:
1. PostgreSQLでテーブルを作成
2. Rustで構造体を定義
3. SQLxでデータベースアクセス
4. AxumでREST APIを実装
5. JSONレスポンスを返す

これで、Rust + SQLの基礎が身につきました！
次のチュートリアルで、さらに複雑な機能に挑戦しましょう！
