# 📚 チュートリアル 01: Localesテーブルで学ぶRust + SQLの基礎

## 🎯 このチュートリアルで学ぶこと

1. **SQL基礎**: テーブル作成、データ挿入、クエリ実行
2. **Rust基礎**: 構造体、async/await、エラーハンドリング
3. **Axum**: HTTPハンドラー、JSONレスポンス
4. **SQLx**: データベース接続、クエリ実行

---

## 📋 学習ステップ

### Step 1: データベース準備（SQL）
### Step 2: Rustの構造体定義（Entity）
### Step 3: データベースアクセス層（Repository）
### Step 4: HTTPハンドラー（Handler）
### Step 5: ルーティング設定（Routes）
### Step 6: 動作確認

---

## Step 1: データベース準備

### 1-1. PostgreSQL起動

```bash
# プロジェクトルートで実行
docker-compose up -d postgres
```

### 1-2. マイグレーション実行

```bash
cd apps/backend

# テーブル作成
psql -h localhost -p 5432 -U blog_user -d blog_dev -f migrations/001_create_locales_table.sql

# データ挿入
psql -h localhost -p 5432 -U blog_user -d blog_dev -f migrations/002_insert_locales_data.sql
```

パスワード: `blog_password`

### 1-3. 確認

```sql
-- psqlに接続
psql -h localhost -p 5432 -U blog_user -d blog_dev

-- データを確認
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

## Step 2: Rustの構造体定義（Entity）

### 2-1. ファイル構成

```
src/
├── entities/
│   ├── mod.rs        # モジュール宣言
│   └── locale.rs     # Localeエンティティ ← これから作る
```

### 2-2. entities/locale.rs の作成

このファイルで定義すること:
1. データベースの行（レコード）を表す構造体
2. データベースから取得するためのメソッド

---

## Step 3: データベースアクセス層（Repository）

Repositoryパターンとは?
- データベースアクセスのロジックを1箇所にまとめる設計パターン
- ハンドラーからはRepositoryを通してデータベースにアクセス
- テストや変更が容易になる

### 3-1. ファイル構成

```
src/
├── repositories/
│   ├── mod.rs              # モジュール宣言
│   └── locale_repository.rs # Localeリポジトリ ← これから作る
```

---

## Step 4: HTTPハンドラー（Handler）

Handlerとは?
- HTTPリクエストを受け取り、レスポンスを返す関数
- ビジネスロジックを実行し、結果をJSON形式で返す

### 4-1. ファイル構成

```
src/
├── handlers/
│   ├── mod.rs       # モジュール宣言
│   └── locales.rs   # Localesハンドラー ← これから作る
```

### 4-2. 実装するエンドポイント

```
GET /api/v1/locales          - 全言語取得
GET /api/v1/locales/active   - 有効な言語のみ取得
GET /api/v1/locales/:code    - 特定言語取得（例: /api/v1/locales/ja）
```

---

## Step 5: ルーティング設定

### 5-1. routes/mod.rs の更新

エンドポイントとハンドラーを紐付ける

---

## Step 6: 動作確認

### 6-1. サーバー起動

```bash
cd apps/backend
cargo run
```

### 6-2. APIテスト

```bash
# 全言語取得
curl http://localhost:8000/api/v1/locales

# 有効な言語のみ取得
curl http://localhost:8000/api/v1/locales/active

# 特定言語取得
curl http://localhost:8000/api/v1/locales/ja
```

---

## 🎓 学習のポイント

### SQLで学ぶこと
- ✅ CREATE TABLE（テーブル作成）
- ✅ PRIMARY KEY（主キー）
- ✅ UNIQUE制約（一意制約）
- ✅ DEFAULT値（デフォルト値）
- ✅ INDEX（インデックス）
- ✅ INSERT INTO（データ挿入）
- ✅ SELECT文（データ取得）

### Rustで学ぶこと
- ✅ 構造体（struct）
- ✅ derive属性（自動実装）
- ✅ Option型（NULL対応）
- ✅ Result型（エラーハンドリング）
- ✅ async/await（非同期処理）
- ✅ sqlx::query_as!（型安全なクエリ）

### Axumで学ぶこと
- ✅ ハンドラー関数
- ✅ State（状態管理）
- ✅ Json（JSONレスポンス）
- ✅ Path（URLパラメータ）
- ✅ ルーティング

---

## 📝 次のチュートリアル予告

**チュートリアル 02: Topics + Topic_Translations で多言語パターンを学ぶ**

内容:
- 1対多の関係（1つのTopicに複数の翻訳）
- JOIN（テーブル結合）
- 外部キー制約
- より複雑なクエリ

---

このチュートリアルを通じて、Rust + SQL の基礎をしっかり理解しましょう！
