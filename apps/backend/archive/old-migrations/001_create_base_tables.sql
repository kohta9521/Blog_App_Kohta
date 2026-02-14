-- ================================================
-- Migration 001: 基本テーブルの作成
-- ================================================
-- 多言語対応ブログシステムの基本スキーマ
-- 作成日: 2026-01-14
-- ================================================

-- 拡張機能の有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. users（著者・管理者）
-- ================================================
CREATE TABLE users (
    id                  SERIAL PRIMARY KEY,
    email               VARCHAR(255) UNIQUE NOT NULL,
    password_hash       TEXT,
    
    -- プロフィール
    name                VARCHAR(100) NOT NULL,
    display_name        VARCHAR(100),
    bio_ja              TEXT,
    bio_en              TEXT,
    avatar_url          TEXT,
    website_url         TEXT,
    
    -- ソーシャルメディア
    twitter_handle      VARCHAR(50),
    github_handle       VARCHAR(50),
    linkedin_url        TEXT,
    
    -- 権限
    role                VARCHAR(20) DEFAULT 'author',
    is_active           BOOLEAN DEFAULT TRUE,
    
    -- タイムスタンプ
    last_login_at       TIMESTAMP WITH TIME ZONE,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

COMMENT ON TABLE users IS '著者・管理者テーブル';
COMMENT ON COLUMN users.role IS 'admin=管理者, editor=編集者, author=著者';

-- ================================================
-- 2. categories（カテゴリ）
-- ================================================
CREATE TABLE categories (
    id                  SERIAL PRIMARY KEY,
    slug                VARCHAR(100) UNIQUE NOT NULL,
    
    -- 多言語対応
    name_ja             VARCHAR(100) NOT NULL,
    name_en             VARCHAR(100) NOT NULL,
    description_ja      TEXT,
    description_en      TEXT,
    
    -- メタ情報
    color               VARCHAR(7),
    icon                VARCHAR(50),
    display_order       INTEGER DEFAULT 0,
    is_visible          BOOLEAN DEFAULT TRUE,
    
    -- タイムスタンプ
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_display_order ON categories(display_order);

COMMENT ON TABLE categories IS 'カテゴリテーブル';

-- ================================================
-- 3. tags（タグ）
-- ================================================
CREATE TABLE tags (
    id                  SERIAL PRIMARY KEY,
    slug                VARCHAR(100) UNIQUE NOT NULL,
    
    -- 多言語対応
    name_ja             VARCHAR(100) NOT NULL,
    name_en             VARCHAR(100) NOT NULL,
    
    -- メタ情報
    usage_count         INTEGER DEFAULT 0,
    color               VARCHAR(7),
    
    -- タイムスタンプ
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_usage_count ON tags(usage_count DESC);

COMMENT ON TABLE tags IS 'タグテーブル';

-- ================================================
-- 4. media（メディアファイル管理）
-- ================================================
CREATE TABLE media (
    id                  SERIAL PRIMARY KEY,
    uuid                UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    
    -- ファイル情報
    filename            VARCHAR(255) NOT NULL,
    original_filename   VARCHAR(255) NOT NULL,
    file_path           TEXT NOT NULL,
    file_url            TEXT NOT NULL,
    file_size           BIGINT,
    mime_type           VARCHAR(100),
    
    -- 画像メタ情報
    width               INTEGER,
    height              INTEGER,
    
    -- 多言語対応
    alt_text_ja         VARCHAR(255),
    alt_text_en         VARCHAR(255),
    caption_ja          TEXT,
    caption_en          TEXT,
    
    -- メタ情報
    uploaded_by         INTEGER REFERENCES users(id) ON DELETE SET NULL,
    media_type          VARCHAR(20) DEFAULT 'image',
    
    -- タイムスタンプ
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_media_uuid ON media(uuid);
CREATE INDEX idx_media_uploaded_by ON media(uploaded_by);
CREATE INDEX idx_media_media_type ON media(media_type);

COMMENT ON TABLE media IS 'メディアファイル管理テーブル';

-- ================================================
-- 5. posts（ブログ記事）
-- ================================================
CREATE TABLE posts (
    -- 基本情報
    id                  SERIAL PRIMARY KEY,
    slug                VARCHAR(255) UNIQUE NOT NULL,
    uuid                UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    
    -- 日本語コンテンツ
    title_ja            VARCHAR(500) NOT NULL,
    content_ja          TEXT NOT NULL,
    excerpt_ja          TEXT,
    seo_title_ja        VARCHAR(70),
    seo_description_ja  VARCHAR(160),
    
    -- 英語コンテンツ
    title_en            VARCHAR(500) NOT NULL,
    content_en          TEXT NOT NULL,
    excerpt_en          TEXT,
    seo_title_en        VARCHAR(70),
    seo_description_en  VARCHAR(160),
    
    -- メタ情報
    category_id         INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    author_id           INTEGER REFERENCES users(id) ON DELETE SET NULL,
    featured_image_id   INTEGER REFERENCES media(id) ON DELETE SET NULL,
    
    -- 公開設定
    status              VARCHAR(20) DEFAULT 'draft',
    published           BOOLEAN DEFAULT FALSE,
    published_at        TIMESTAMP WITH TIME ZONE,
    scheduled_at        TIMESTAMP WITH TIME ZONE,
    
    -- コンテンツメタ
    view_count          INTEGER DEFAULT 0,
    reading_time_ja     INTEGER,
    reading_time_en     INTEGER,
    content_format      VARCHAR(20) DEFAULT 'markdown',
    
    -- タイムスタンプ
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at          TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_uuid ON posts(uuid);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published ON posts(published);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_deleted_at ON posts(deleted_at);
CREATE INDEX idx_posts_view_count ON posts(view_count DESC);

COMMENT ON TABLE posts IS 'ブログ記事テーブル';
COMMENT ON COLUMN posts.content_ja IS 'Markdown形式の本文（日本語）';
COMMENT ON COLUMN posts.content_en IS 'Markdown形式の本文（英語）';
COMMENT ON COLUMN posts.status IS 'draft=下書き, published=公開, scheduled=予約投稿, archived=アーカイブ';

-- ================================================
-- 6. post_tags（記事とタグの中間テーブル）
-- ================================================
CREATE TABLE post_tags (
    post_id             INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    tag_id              INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    PRIMARY KEY (post_id, tag_id)
);

CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);

COMMENT ON TABLE post_tags IS '記事とタグの多対多関連テーブル';

-- ================================================
-- 7. post_relations（記事間の関連）
-- ================================================
CREATE TABLE post_relations (
    id                  SERIAL PRIMARY KEY,
    source_post_id      INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    target_post_id      INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    relation_type       VARCHAR(20) NOT NULL,
    display_order       INTEGER DEFAULT 0,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT chk_post_relations_type 
        CHECK (relation_type IN ('previous', 'next', 'recommended', 'related')),
    CONSTRAINT chk_post_relations_not_self 
        CHECK (source_post_id != target_post_id),
    UNIQUE(source_post_id, target_post_id, relation_type)
);

CREATE INDEX idx_post_relations_source ON post_relations(source_post_id, relation_type);
CREATE INDEX idx_post_relations_target ON post_relations(target_post_id);

COMMENT ON TABLE post_relations IS '記事間の関連（前後の記事・おすすめ記事）';
COMMENT ON COLUMN post_relations.relation_type IS 'previous=前の記事, next=次の記事, recommended=おすすめ, related=関連記事';

-- ================================================
-- 8. post_revisions（記事の変更履歴）
-- ================================================
CREATE TABLE post_revisions (
    id                  SERIAL PRIMARY KEY,
    post_id             INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    
    -- スナップショット
    title_ja            VARCHAR(500) NOT NULL,
    content_ja          TEXT NOT NULL,
    title_en            VARCHAR(500) NOT NULL,
    content_en          TEXT NOT NULL,
    
    -- リビジョン情報
    revision_number     INTEGER NOT NULL,
    change_summary      TEXT,
    changed_by          INTEGER REFERENCES users(id) ON DELETE SET NULL,
    
    -- タイムスタンプ
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(post_id, revision_number)
);

CREATE INDEX idx_post_revisions_post_id ON post_revisions(post_id, revision_number DESC);

COMMENT ON TABLE post_revisions IS '記事の変更履歴・リビジョン管理';

-- ================================================
-- トリガー: updated_at 自動更新
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

