// ============================================
// Domain Entity: Post (ブログ記事)
// ============================================
// データベースのpostsテーブルと1対1で対応する構造体
// 
// 💡 ポイント:
// - データベースのカラム名と完全一致させる
// - sqlx::FromRowでDBから自動的に変換される
// - Serialize/Deserializeで JSON <-> Rust構造体 の変換が可能

use serde::{Deserialize, Serialize};
use sqlx::FromRow;

/// ブログ記事エンティティ（データベースの完全な表現）
/// 
/// # フィールド説明
/// - `id`: 記事ID（主キー）
/// - `slug`: URL用スラッグ（例: "getting-started-with-rust"）
/// - `uuid`: UUID（外部API用）
/// - `title_ja`: 日本語タイトル
/// - `title_en`: 英語タイトル
/// - `content_ja`: 日本語本文（Markdown）
/// - `content_en`: 英語本文（Markdown）
/// - `excerpt_ja`: 日本語要約
/// - `excerpt_en`: 英語要約
/// - `category_id`: カテゴリID（外部キー）
/// - `author_id`: 著者ID（外部キー）
/// - `featured_image_id`: アイキャッチ画像ID（外部キー）
/// - `status`: 公開状態（draft/published/scheduled/archived）
/// - `published`: 公開フラグ
/// - `published_at`: 公開日時
/// - `view_count`: 閲覧数
/// - `reading_time_ja`: 読了時間（日本語・分）
/// - `reading_time_en`: 読了時間（英語・分）
/// - `created_at`: 作成日時
/// - `updated_at`: 更新日時
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Post {
    // 基本情報
    pub id: i32,
    pub slug: String,
    pub uuid: sqlx::types::Uuid,
    
    // 日本語コンテンツ
    pub title_ja: String,
    pub content_ja: String,
    pub excerpt_ja: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub seo_title_ja: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub seo_description_ja: Option<String>,
    
    // 英語コンテンツ
    pub title_en: String,
    pub content_en: String,
    pub excerpt_en: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub seo_title_en: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub seo_description_en: Option<String>,
    
    // メタ情報
    pub category_id: Option<i32>,
    pub author_id: Option<i32>,
    pub featured_image_id: Option<i32>,
    
    // 公開設定
    pub status: String,
    pub published: bool,
    pub published_at: Option<chrono::DateTime<chrono::Utc>>,
    pub scheduled_at: Option<chrono::DateTime<chrono::Utc>>,
    
    // コンテンツメタ
    pub view_count: i32,
    pub reading_time_ja: Option<i32>,
    pub reading_time_en: Option<i32>,
    pub content_format: String,
    
    // タイムスタンプ
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
    pub deleted_at: Option<chrono::DateTime<chrono::Utc>>,
}

// ============================================
// 💡 用語解説
// ============================================
// 
// #[derive(...)]
//   → 自動的に機能を実装してくれるマクロ
//   - Debug: println!("{:?}", post) でデバッグ表示できる
//   - Clone: post.clone() でコピーできる
//   - Serialize: Rust構造体 → JSON に変換
//   - Deserialize: JSON → Rust構造体 に変換
//   - FromRow: データベースの行 → Rust構造体 に自動変換
// 
// pub
//   → 外部のモジュールから使えるようにする（publicの略）
// 
// struct Post { ... }
//   → 構造体の定義（複数のデータをまとめたもの）
// 
// String vs &str
//   → String: 所有権を持つ文字列（変更可能、ヒープに保存）
//   → &str: 文字列の参照（変更不可、スタックに保存）
// 
// Option<T>
//   → 値があるかないか（Some(値) or None）
//   → データベースのNULL許可カラムに対応
// 
// i32
//   → 32bit符号付き整数（-2,147,483,648 〜 2,147,483,647）
// 
// chrono::DateTime<chrono::Utc>
//   → UTC（協定世界時）のタイムスタンプ

