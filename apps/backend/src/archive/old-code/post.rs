// ============================================
// API Response Models: Post (記事API用)
// ============================================
// クライアント（フロントエンド）に返すJSON形式のデータ構造
// 
// 💡 ポイント:
// - Domain Entityとは別に定義（API用に最適化）
// - 不要な情報は含めない（セキュリティ・パフォーマンス）
// - ToSchemaでOpenAPI仕様を自動生成

use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::domain::entities::Post as PostEntity;

/// 記事一覧レスポンス用（簡易版）
/// 
/// # 用途
/// - 一覧表示（content本文は含めない）
/// - プレビュー表示
/// 
/// # EntityとResponseの違い
/// - Entity: データベースの完全な表現（全フィールド）
/// - Response: APIで返す形式（必要な情報のみ）
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct PostListItem {
    /// 記事ID
    #[schema(example = 1)]
    pub id: i32,
    
    /// URL用スラッグ
    #[schema(example = "getting-started-with-rust")]
    pub slug: String,
    
    /// UUID
    #[schema(example = "550e8400-e29b-41d4-a716-446655440000")]
    pub uuid: String,
    
    /// 日本語タイトル
    #[schema(example = "Rustを始めよう")]
    pub title_ja: String,
    
    /// 英語タイトル
    #[schema(example = "Getting Started with Rust")]
    pub title_en: String,
    
    /// 日本語要約
    #[schema(example = "Rustの基本的な特徴とインストール方法を紹介します。")]
    pub excerpt_ja: Option<String>,
    
    /// 英語要約
    #[schema(example = "An introduction to Rust's basic features and installation.")]
    pub excerpt_en: Option<String>,
    
    /// カテゴリID
    #[schema(example = 1)]
    pub category_id: Option<i32>,
    
    /// 著者ID
    #[schema(example = 1)]
    pub author_id: Option<i32>,
    
    /// アイキャッチ画像ID
    #[schema(example = 1)]
    pub featured_image_id: Option<i32>,
    
    /// 公開状態
    #[schema(example = "published")]
    pub status: String,
    
    /// 公開フラグ
    #[schema(example = true)]
    pub published: bool,
    
    /// 公開日時
    #[schema(example = "2026-01-13T00:00:00Z")]
    pub published_at: Option<String>,
    
    /// 閲覧数
    #[schema(example = 1234)]
    pub view_count: i32,
    
    /// 読了時間（日本語・分）
    #[schema(example = 5)]
    pub reading_time_ja: Option<i32>,
    
    /// 読了時間（英語・分）
    #[schema(example = 5)]
    pub reading_time_en: Option<i32>,
    
    /// 作成日時
    #[schema(example = "2026-01-13T00:00:00Z")]
    pub created_at: String,
    
    /// 更新日時
    #[schema(example = "2026-01-13T00:00:00Z")]
    pub updated_at: String,
}

/// 記事一覧APIレスポンス
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct PostListResponse {
    /// 記事一覧
    pub posts: Vec<PostListItem>,
    
    /// 総件数
    #[schema(example = 10)]
    pub total: i64,
    
    /// ページ（将来のページネーション用）
    #[schema(example = 1)]
    pub page: i64,
    
    /// 1ページあたりの件数
    #[schema(example = 20)]
    pub per_page: i64,
}

// ============================================
// EntityからResponseへの変換（From trait実装）
// ============================================
// 
// 💡 From trait とは？
// - 型Aから型Bへの変換方法を定義する
// - .into() や From::from() で自動変換できる
// 
// 例: let response: PostListItem = entity.into();

impl From<PostEntity> for PostListItem {
    fn from(entity: PostEntity) -> Self {
        Self {
            id: entity.id,
            slug: entity.slug,
            uuid: entity.uuid.to_string(),
            title_ja: entity.title_ja,
            title_en: entity.title_en,
            excerpt_ja: entity.excerpt_ja,
            excerpt_en: entity.excerpt_en,
            category_id: entity.category_id,
            author_id: entity.author_id,
            featured_image_id: entity.featured_image_id,
            status: entity.status,
            published: entity.published,
            published_at: entity.published_at.map(|dt: chrono::DateTime<chrono::Utc>| dt.to_rfc3339()),
            view_count: entity.view_count,
            reading_time_ja: entity.reading_time_ja,
            reading_time_en: entity.reading_time_en,
            created_at: entity.created_at.to_rfc3339(),
            updated_at: entity.updated_at.to_rfc3339(),
        }
    }
}

// ============================================
// 💡 用語解説
// ============================================
// 
// Vec<T>
//   → 動的配列（要素数が可変）
//   → 例: Vec<PostListItem> = 記事の配列
// 
// i64
//   → 64bit符号付き整数（大きな数値に対応）
//   → 総件数など大きくなる可能性がある値に使用
// 
// impl From<A> for B
//   → 型Aから型Bへの変換方法を実装
//   → let b: B = a.into(); で変換可能
// 
// Self
//   → 実装している型自身を指す（ここではPostListItem）
// 
// entity.published_at.map(|dt| dt.to_rfc3339())
//   → Option型の値を変換
//   → Some(値)なら変換、Noneならそのまま
//   → to_rfc3339(): DateTime → 文字列（ISO 8601形式）
// 
// #[schema(example = "...")]
//   → OpenAPI/Swagger UIで表示される例

