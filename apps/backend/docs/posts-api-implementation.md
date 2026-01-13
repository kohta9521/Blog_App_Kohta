# 📝 Posts一覧取得API実装 - 完全ガイド

## ✅ 完成しました！

```bash
# APIテスト
curl http://localhost:8000/api/v1/posts | jq '.'

# Swagger UI
open http://localhost:8000/swagger-ui
```

---

## 🏗️ 実装したファイル一覧

### 1. Domain Entity（データ構造）
```
src/domain/
├── mod.rs                    # ← NEW!
└── entities/
    ├── mod.rs                # ← 更新
    └── post.rs               # ← NEW! (102行)
```

**役割:** データベースのpostsテーブルと1対1対応する構造体

### 2. API Response Model
```
src/models/
├── mod.rs                    # ← 更新
└── post.rs                   # ← NEW! (169行)
```

**役割:** クライアントに返すJSON形式の定義

### 3. Repository（データアクセス層）
```
src/repositories/
├── mod.rs                    # ← NEW!
└── post_repository.rs        # ← NEW! (183行)
```

**役割:** データベースからデータを取得

### 4. Handler（コントローラー）
```
src/handlers/
├── mod.rs                    # ← 更新
└── posts.rs                  # ← NEW! (158行)
```

**役割:** HTTPリクエストを受け取り、レスポンスを返す

### 5. Routing（ルーティング）
```
src/routes/
└── mod.rs                    # ← 更新
```

**役割:** URLとハンドラーを紐付け

### 6. その他
```
src/
├── main.rs                   # ← 更新（domainとrepositoriesを追加）
└── models/api_doc.rs         # ← 更新（postsタグを追加）
```

---

## 🔄 データの流れ（リクエスト → レスポンス）

```
1. HTTPリクエスト
   ↓
   GET /api/v1/posts

2. Routing（routes/mod.rs）
   ↓
   .route("/api/v1/posts", get(handlers::posts::list_posts))

3. Handler（handlers/posts.rs）
   ↓
   async fn list_posts(State(pool): State<PgPool>) { ... }
   ├─ State<PgPool>を取得（データベース接続プール）
   └─ PostRepositoryを作成

4. Repository（repositories/post_repository.rs）
   ↓
   repo.find_all_published().await
   └─ SQLクエリ実行: SELECT * FROM posts WHERE published = true ...

5. Database（PostgreSQL）
   ↓
   データベースから記事データを取得

6. Entity → Response変換（models/post.rs）
   ↓
   Post (Entity) → PostListItem (Response)
   └─ From trait実装で自動変換

7. JSON Response
   ↓
   {
     "posts": [...],
     "total": 3,
     "page": 1,
     "per_page": 20
   }
```

---

## 🎨 クリーンアーキテクチャの層

```
┌──────────────────────────────────────┐
│  Routes (ルーティング)                 │  ← URLとハンドラーの紐付け
│  src/routes/mod.rs                   │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│  Handlers (コントローラー)             │  ← HTTPの入出力を処理
│  src/handlers/posts.rs               │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│  Repositories (データアクセス層)       │  ← データベースとやり取り
│  src/repositories/post_repository.rs │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│  Domain (エンティティ)                │  ← データの型定義
│  src/domain/entities/post.rs         │
└──────────────────────────────────────┘
              ↓
         PostgreSQL
```

---

## 📊 重要なRust/Axumの概念

### 1. State Extractor

```rust
async fn list_posts(State(pool): State<PgPool>) { ... }
```

- `State<PgPool>`: Axumの状態抽出
- `main.rs`で`.with_state(pool)`で渡したデータを取得
- 自動的にCloneされる

### 2. async/await

```rust
let posts = repo.find_all_published().await?;
```

- `async fn`: 非同期関数
- `.await`: 非同期処理の完了を待つ
- `?`: エラーが発生したら早期リターン

### 3. Result型でエラーハンドリング

```rust
match repo.find_all_published().await {
    Ok(posts) => posts,
    Err(e) => {
        return Err((StatusCode::INTERNAL_SERVER_ERROR, ...));
    }
}
```

- `Result<T, E>`: 成功時Ok、失敗時Err
- `match`でパターンマッチング

### 4. From trait（型変換）

```rust
impl From<PostEntity> for PostListItem { ... }

// 使用例
let response: PostListItem = entity.into();
```

- 型Aから型Bへの変換を定義
- `.into()`で自動変換

### 5. SQLx（型安全なSQL）

```rust
let posts = sqlx::query_as::<_, Post>(
    "SELECT * FROM posts WHERE published = true"
)
.fetch_all(&pool)
.await?;
```

- `query_as`: SQLの結果を構造体に自動マッピング
- プレースホルダー`$1`でSQLインジェクション対策

### 6. イテレータチェーン

```rust
let items: Vec<PostListItem> = posts
    .into_iter()              // 配列→イテレータ
    .map(|post| post.into())  // 各要素を変換
    .collect();               // イテレータ→配列
```

- 関数型プログラミングスタイル
- 効率的なデータ変換

---

## 🧪 テスト方法

### 1. cURLでテスト

```bash
# 記事一覧取得
curl http://localhost:8000/api/v1/posts

# jqで整形
curl -s http://localhost:8000/api/v1/posts | jq '.'

# ヘッダーも表示
curl -v http://localhost:8000/api/v1/posts
```

### 2. Swagger UIでテスト

```bash
open http://localhost:8000/swagger-ui
```

1. 「posts」セクションを開く
2. 「GET /api/v1/posts」をクリック
3. 「Try it out」ボタンをクリック
4. 「Execute」ボタンをクリック

### 3. HTTPieでテスト（見やすい）

```bash
# HTTPieをインストール
brew install httpie

# リクエスト
http GET localhost:8000/api/v1/posts
```

---

## 📈 次の実装候補

### 1. 記事詳細取得

```rust
// GET /api/v1/posts/:slug
pub async fn get_post_by_slug(
    State(pool): State<PgPool>,
    Path(slug): Path<String>,
) -> Result<Json<PostDetailResponse>, impl IntoResponse> {
    // ...
}
```

### 2. カテゴリでフィルタリング

```rust
// GET /api/v1/posts?category_id=1
pub async fn list_posts(
    State(pool): State<PgPool>,
    Query(params): Query<PostQueryParams>,
) -> Result<Json<PostListResponse>, impl IntoResponse> {
    // ...
}
```

### 3. ページネーション

```rust
// GET /api/v1/posts?page=2&per_page=10
pub async fn list_posts(
    State(pool): State<PgPool>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<PostListResponse>, impl IntoResponse> {
    // ...
}
```

### 4. 記事作成・更新・削除

```rust
// POST /api/v1/posts
pub async fn create_post(...) { ... }

// PUT /api/v1/posts/:id
pub async fn update_post(...) { ... }

// DELETE /api/v1/posts/:id
pub async fn delete_post(...) { ... }
```

---

## 💡 学んだRustの重要概念

### 所有権（Ownership）
- 各値には1つの所有者がいる
- 所有者がスコープを抜けると値は解放される
- `.clone()`で明示的にコピー

### 借用（Borrowing）
- `&`: 不変参照（読み取り専用）
- `&mut`: 可変参照（書き換え可能）

### ライフタイム
- 参照が有効な期間
- コンパイラが自動的にチェック

### エラーハンドリング
- `Result<T, E>`: 回復可能なエラー
- `Option<T>`: 値の有無
- `panic!`: 回復不可能なエラー

### トレイト（Trait）
- 共通の動作を定義
- `Serialize`, `Deserialize`, `FromRow` など

---

## 🎓 まとめ

今回実装したもの:
✅ データベースからブログ記事を取得するAPI
✅ クリーンアーキテクチャの各層を実装
✅ 型安全なデータ変換
✅ エラーハンドリング
✅ OpenAPI仕様の自動生成

次のステップ:
→ 記事詳細取得API
→ カテゴリ・タグAPI
→ 検索・フィルタリング
→ 記事作成・更新・削除（管理画面用）

お疲れ様でした！🎉

