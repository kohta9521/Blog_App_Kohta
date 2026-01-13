# 📊 データベーススキーマ設計

## テーブル一覧

```
blog_dev (データベース)
├── posts              - ブログ記事（メイン）
├── categories         - カテゴリ
├── tags               - タグ
├── post_tags          - 記事とタグの中間テーブル
├── post_relations     - 記事間の関連（前後・おすすめ）
├── users              - 著者・管理者
├── media              - メディアファイル管理
└── post_revisions     - 記事の変更履歴（リビジョン管理）
```

---

## 1. posts（ブログ記事）

```sql
CREATE TABLE posts (
    -- 基本情報
    id                  SERIAL PRIMARY KEY,
    slug                VARCHAR(255) UNIQUE NOT NULL,
    uuid                UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),

    -- 日本語コンテンツ
    title_ja            VARCHAR(500) NOT NULL,
    content_ja          TEXT NOT NULL,              -- Markdown形式
    excerpt_ja          TEXT,                       -- 要約（自動生成 or 手動）
    seo_title_ja        VARCHAR(70),                -- SEO用タイトル
    seo_description_ja  VARCHAR(160),               -- SEO用説明文

    -- 英語コンテンツ
    title_en            VARCHAR(500) NOT NULL,
    content_en          TEXT NOT NULL,              -- Markdown形式
    excerpt_en          TEXT,
    seo_title_en        VARCHAR(70),
    seo_description_en  VARCHAR(160),

    -- メタ情報
    category_id         INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    author_id           INTEGER REFERENCES users(id) ON DELETE SET NULL,
    featured_image_id   INTEGER REFERENCES media(id) ON DELETE SET NULL,

    -- 公開設定
    status              VARCHAR(20) DEFAULT 'draft', -- draft / published / scheduled / archived
    published           BOOLEAN DEFAULT FALSE,
    published_at        TIMESTAMP WITH TIME ZONE,
    scheduled_at        TIMESTAMP WITH TIME ZONE,   -- 予約投稿

    -- コンテンツメタ
    view_count          INTEGER DEFAULT 0,
    reading_time_ja     INTEGER,                    -- 読了時間（分）
    reading_time_en     INTEGER,
    content_format      VARCHAR(20) DEFAULT 'markdown', -- markdown / html / mdx

    -- タイムスタンプ
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at          TIMESTAMP WITH TIME ZONE    -- ソフトデリート用
);

-- インデックス
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
```

---

## 2. categories（カテゴリ）

```sql
CREATE TABLE categories (
    id                  SERIAL PRIMARY KEY,
    slug                VARCHAR(100) UNIQUE NOT NULL,

    -- 多言語対応
    name_ja             VARCHAR(100) NOT NULL,
    name_en             VARCHAR(100) NOT NULL,
    description_ja      TEXT,
    description_en      TEXT,

    -- メタ情報
    color               VARCHAR(7),                 -- HEXカラー #FF5733
    icon                VARCHAR(50),                -- アイコン名 or emoji
    display_order       INTEGER DEFAULT 0,
    is_visible          BOOLEAN DEFAULT TRUE,

    -- タイムスタンプ
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_display_order ON categories(display_order);

COMMENT ON TABLE categories IS 'カテゴリテーブル';
```

---

## 3. tags（タグ）

```sql
CREATE TABLE tags (
    id                  SERIAL PRIMARY KEY,
    slug                VARCHAR(100) UNIQUE NOT NULL,

    -- 多言語対応
    name_ja             VARCHAR(100) NOT NULL,
    name_en             VARCHAR(100) NOT NULL,

    -- メタ情報
    usage_count         INTEGER DEFAULT 0,          -- 使用回数
    color               VARCHAR(7),                 -- タグの色

    -- タイムスタンプ
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_usage_count ON tags(usage_count DESC);

COMMENT ON TABLE tags IS 'タグテーブル';
```

---

## 4. post_tags（記事とタグの中間テーブル）

```sql
CREATE TABLE post_tags (
    post_id             INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    tag_id              INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    PRIMARY KEY (post_id, tag_id)
);

-- インデックス
CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);

COMMENT ON TABLE post_tags IS '記事とタグの多対多関連テーブル';
```

---

## 5. post_relations（記事間の関連）

```sql
CREATE TABLE post_relations (
    id                  SERIAL PRIMARY KEY,
    source_post_id      INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    target_post_id      INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    relation_type       VARCHAR(20) NOT NULL,       -- previous / next / recommended / related
    display_order       INTEGER DEFAULT 0,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT chk_post_relations_type
        CHECK (relation_type IN ('previous', 'next', 'recommended', 'related')),
    CONSTRAINT chk_post_relations_not_self
        CHECK (source_post_id != target_post_id),
    UNIQUE(source_post_id, target_post_id, relation_type)
);

-- インデックス
CREATE INDEX idx_post_relations_source ON post_relations(source_post_id, relation_type);
CREATE INDEX idx_post_relations_target ON post_relations(target_post_id);

COMMENT ON TABLE post_relations IS '記事間の関連（前後の記事・おすすめ記事）';
COMMENT ON COLUMN post_relations.relation_type IS 'previous=前の記事, next=次の記事, recommended=おすすめ, related=関連記事';
```

---

## 6. users（著者・管理者）

```sql
CREATE TABLE users (
    id                  SERIAL PRIMARY KEY,
    email               VARCHAR(255) UNIQUE NOT NULL,
    password_hash       TEXT,                       -- 認証実装時に使用

    -- プロフィール
    name                VARCHAR(100) NOT NULL,
    display_name        VARCHAR(100),               -- 表示名
    bio_ja              TEXT,                       -- 自己紹介（日本語）
    bio_en              TEXT,                       -- 自己紹介（英語）
    avatar_url          TEXT,
    website_url         TEXT,

    -- ソーシャルメディア
    twitter_handle      VARCHAR(50),
    github_handle       VARCHAR(50),
    linkedin_url        TEXT,

    -- 権限
    role                VARCHAR(20) DEFAULT 'author', -- admin / editor / author
    is_active           BOOLEAN DEFAULT TRUE,

    -- タイムスタンプ
    last_login_at       TIMESTAMP WITH TIME ZONE,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

COMMENT ON TABLE users IS '著者・管理者テーブル';
COMMENT ON COLUMN users.role IS 'admin=管理者, editor=編集者, author=著者';
```

---

## 7. media（メディアファイル管理）

```sql
CREATE TABLE media (
    id                  SERIAL PRIMARY KEY,
    uuid                UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),

    -- ファイル情報
    filename            VARCHAR(255) NOT NULL,
    original_filename   VARCHAR(255) NOT NULL,
    file_path           TEXT NOT NULL,              -- S3 or ローカルパス
    file_url            TEXT NOT NULL,              -- 公開URL
    file_size           BIGINT,                     -- バイト
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
    media_type          VARCHAR(20) DEFAULT 'image', -- image / video / document

    -- タイムスタンプ
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_media_uuid ON media(uuid);
CREATE INDEX idx_media_uploaded_by ON media(uploaded_by);
CREATE INDEX idx_media_media_type ON media(media_type);

COMMENT ON TABLE media IS 'メディアファイル管理テーブル';
```

---

## 8. post_revisions（記事の変更履歴）

```sql
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
    change_summary      TEXT,                       -- 変更概要
    changed_by          INTEGER REFERENCES users(id) ON DELETE SET NULL,

    -- タイムスタンプ
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(post_id, revision_number)
);

-- インデックス
CREATE INDEX idx_post_revisions_post_id ON post_revisions(post_id, revision_number DESC);

COMMENT ON TABLE post_revisions IS '記事の変更履歴・リビジョン管理';
```

---

## 🎨 初期データ例

### Categories（カテゴリ）

```sql
INSERT INTO categories (slug, name_ja, name_en, color, icon, display_order) VALUES
('technology', '技術', 'Technology', '#3B82F6', '💻', 1),
('tutorial', 'チュートリアル', 'Tutorial', '#10B981', '📚', 2),
('opinion', '考察・意見', 'Opinion', '#F59E0B', '💭', 3),
('news', 'ニュース', 'News', '#EF4444', '📰', 4),
('career', 'キャリア', 'Career', '#8B5CF6', '🚀', 5);
```

### Tags（タグ）

```sql
INSERT INTO tags (slug, name_ja, name_en, color) VALUES
('rust', 'Rust', 'Rust', '#CE422B'),
('react', 'React', 'React', '#61DAFB'),
('nextjs', 'Next.js', 'Next.js', '#000000'),
('typescript', 'TypeScript', 'TypeScript', '#3178C6'),
('docker', 'Docker', 'Docker', '#2496ED'),
('postgresql', 'PostgreSQL', 'PostgreSQL', '#336791'),
('aws', 'AWS', 'AWS', '#FF9900'),
('webdev', 'Web開発', 'Web Development', '#047857');
```

### Users（初期管理者）

```sql
INSERT INTO users (email, name, display_name, role, bio_ja, bio_en) VALUES
('admin@example.com', 'Admin User', 'Kohta', 'admin',
 'テックブログの管理者です。',
 'Administrator of this tech blog.');
```

---

## 📊 ER 図（関連図）

```
users ──┐
        │
        ├─── posts ────┬─── post_tags ─── tags
        │              │
        │              ├─── post_relations (self-reference)
        │              │
        │              └─── post_revisions
        │
        └─── media

categories ─── posts
```

---

## 🚀 主な機能

### 1. 記事管理

- ✅ Markdown 形式で執筆
- ✅ 下書き・公開・予約投稿・アーカイブ
- ✅ リビジョン管理（変更履歴）
- ✅ 多言語対応（日本語・英語）
- ✅ SEO 最適化（メタタグ）

### 2. 記事関連

- ✅ 前の記事・次の記事
- ✅ おすすめ記事（複数設定可能）
- ✅ 関連記事
- ✅ カテゴリ・タグによる分類

### 3. メディア管理

- ✅ 画像アップロード
- ✅ alt/caption（多言語対応）
- ✅ メタデータ管理

### 4. ユーザー管理

- ✅ 管理者・編集者・著者の権限管理
- ✅ プロフィール情報
- ✅ ソーシャルメディア連携

### 5. 統計・分析

- ✅ 閲覧数カウント
- ✅ 読了時間計算
- ✅ タグ使用回数

---

## 🔥 リッチコンテンツのための拡張性

このスキーマなら以下も追加可能：

- 📝 コードブロックのシンタックスハイライト（Markdown 内）
- 🎨 カスタムコンポーネント（MDX 対応）
- 💬 コメント機能（comments テーブル追加）
- ⭐ いいね・リアクション（reactions テーブル追加）
- 📧 ニュースレター購読（subscribers テーブル追加）
- 🔖 ブックマーク機能（bookmarks テーブル追加）
- 📈 アナリティクス（page_views テーブル追加）

---

## 次のステップ

1. このスキーマでマイグレーションファイル作成
2. Docker Compose で PostgreSQL 起動
3. マイグレーション実行
4. Rust で各テーブルの CRUD 実装
