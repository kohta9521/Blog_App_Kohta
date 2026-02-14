// ============================================
// Repository: Post (記事データアクセス層)
// ============================================
// データベースとの通信を担当
// 
// 💡 ポイント:
// - SQLクエリを実行してデータを取得/更新
// - ビジネスロジックは含めない（純粋なデータアクセス）
// - Result型でエラーハンドリング

use sqlx::{PgPool, Result};
use crate::domain::entities::Post;

/// 記事リポジトリ
/// 
/// # 責務
/// - データベースから記事を取得
/// - 記事の作成・更新・削除
/// - 検索・フィルタリング
pub struct PostRepository {
    /// データベース接続プール
    pool: PgPool,
}

impl PostRepository {
    /// 新しいリポジトリを作成
    /// 
    /// # 引数
    /// - `pool`: データベース接続プール
    /// 
    /// # 戻り値
    /// - `PostRepository`: 記事リポジトリのインスタンス
    /// 
    /// # 使用例
    /// ```
    /// let repo = PostRepository::new(pool.clone());
    /// ```
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    /// すべての記事を取得（公開済みのみ）
    /// 
    /// # 戻り値
    /// - `Result<Vec<Post>>`: 成功時は記事の配列、失敗時はエラー
    /// 
    /// # SQL解説
    /// ```sql
    /// SELECT * FROM posts
    /// WHERE published = true          -- 公開済みのみ
    ///   AND deleted_at IS NULL        -- 削除されていない
    /// ORDER BY published_at DESC      -- 公開日時の新しい順
    /// ```
    pub async fn find_all_published(&self) -> Result<Vec<Post>> {
        let posts = sqlx::query_as::<_, Post>(
            r#"
            SELECT 
                id, slug, uuid,
                title_ja, content_ja, excerpt_ja, seo_title_ja, seo_description_ja,
                title_en, content_en, excerpt_en, seo_title_en, seo_description_en,
                category_id, author_id, featured_image_id,
                status, published, published_at, scheduled_at,
                view_count, reading_time_ja, reading_time_en, content_format,
                created_at, updated_at, deleted_at
            FROM posts
            WHERE published = true
              AND deleted_at IS NULL
            ORDER BY published_at DESC
            "#
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(posts)
    }

    /// すべての記事を取得（管理者用・下書きも含む）
    /// 
    /// # 戻り値
    /// - `Result<Vec<Post>>`: 成功時は記事の配列、失敗時はエラー
    pub async fn find_all(&self) -> Result<Vec<Post>> {
        let posts = sqlx::query_as::<_, Post>(
            r#"
            SELECT 
                id, slug, uuid,
                title_ja, content_ja, excerpt_ja, seo_title_ja, seo_description_ja,
                title_en, content_en, excerpt_en, seo_title_en, seo_description_en,
                category_id, author_id, featured_image_id,
                status, published, published_at, scheduled_at,
                view_count, reading_time_ja, reading_time_en, content_format,
                created_at, updated_at, deleted_at
            FROM posts
            WHERE deleted_at IS NULL
            ORDER BY created_at DESC
            "#
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(posts)
    }

    /// 記事をスラッグで検索
    /// 
    /// # 引数
    /// - `slug`: URL用スラッグ（例: "getting-started-with-rust"）
    /// 
    /// # 戻り値
    /// - `Result<Option<Post>>`: 見つかった場合はSome(Post)、見つからない場合はNone
    pub async fn find_by_slug(&self, slug: &str) -> Result<Option<Post>> {
        let post = sqlx::query_as::<_, Post>(
            r#"
            SELECT 
                id, slug, uuid,
                title_ja, content_ja, excerpt_ja, seo_title_ja, seo_description_ja,
                title_en, content_en, excerpt_en, seo_title_en, seo_description_en,
                category_id, author_id, featured_image_id,
                status, published, published_at, scheduled_at,
                view_count, reading_time_ja, reading_time_en, content_format,
                created_at, updated_at, deleted_at
            FROM posts
            WHERE slug = $1
              AND deleted_at IS NULL
            "#
        )
        .bind(slug)
        .fetch_optional(&self.pool)
        .await?;

        Ok(post)
    }

    /// 公開済み記事の総数を取得
    /// 
    /// # 戻り値
    /// - `Result<i64>`: 成功時は記事数、失敗時はエラー
    pub async fn count_published(&self) -> Result<i64> {
        let count: (i64,) = sqlx::query_as(
            r#"
            SELECT COUNT(*) 
            FROM posts
            WHERE published = true
              AND deleted_at IS NULL
            "#
        )
        .fetch_one(&self.pool)
        .await?;

        Ok(count.0)
    }
}

// ============================================
// 💡 用語解説
// ============================================
// 
// async fn
//   → 非同期関数（awaitで待機可能）
//   → データベースアクセスなどI/O処理は非同期が推奨
// 
// Result<T>
//   → 成功時はOk(値)、失敗時はErr(エラー)
//   → エラーハンドリングの標準的な方法
// 
// Vec<Post>
//   → Post構造体の動的配列
// 
// Option<Post>
//   → 値があればSome(Post)、なければNone
//   → データベースで見つからない場合に使用
// 
// sqlx::query_as::<_, Post>(...)
//   → SQLクエリを実行して、結果をPost構造体に変換
//   → <_, Post>の「_」は型推論（コンパイラが自動判定）
// 
// r#"..."#
//   → 生文字列リテラル（エスケープ不要）
//   → SQLの改行や引用符をそのまま書ける
// 
// $1, $2, ...
//   → SQLのプレースホルダー（パラメータ）
//   → SQLインジェクション対策（自動エスケープ）
// 
// .bind(slug)
//   → プレースホルダー$1にslugの値をバインド
// 
// .fetch_all(&self.pool)
//   → 全ての行を取得（Vec<Post>）
// 
// .fetch_optional(&self.pool)
//   → 0または1行を取得（Option<Post>）
// 
// .fetch_one(&self.pool)
//   → 必ず1行を取得（なければエラー）
// 
// .await?
//   → 非同期処理を待機
//   → ?はエラーが発生したら早期リターン
// 
// &self
//   → 自分自身への参照（メソッド呼び出し時の第一引数）
// 
// &str
//   → 文字列スライスの参照（所有権を移動しない）

