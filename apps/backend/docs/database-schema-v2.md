# 🗄️ データベース設計 v2.0 - 完璧な多言語対応

このドキュメントは、将来実装する予定の完全なデータベーススキーマです。
**現在は学習のため、段階的に実装していきます。**

---

## 📋 実装ステータス

| Step | テーブル | ステータス | 学習内容 |
|------|---------|-----------|---------|
| 1 | Locales | ✅ 実装済み | CRUD基礎、型の対応 |
| 2 | Topics + Topic_Translations | 🔜 次 | 1対多、JOIN |
| 3 | Books + Book_Translations + Book_Chapters + Book_Chapter_Translations | 📅 予定 | 階層構造、複雑な関連 |
| 4 | Blog_Posts + Blog_Post_Translations + Blog_Post_Topics | 📅 予定 | 多対多、本格的な機能 |
| 5 | Media + Media_Translations | 📅 予定 | ファイルアップロード |
| 6 | Administrators + Sessions | 📅 予定 | 認証、セッション管理 |
| 7 | API_Keys | 📅 予定 | API認証 |
| 8 | Audit_Logs | 📅 予定 | 監査ログ |

---

## 🏗️ テーブル構成（将来の完成形）

### 1. **Locales** ✅ 実装済み

言語情報の管理（日本語、英語など）

```sql
CREATE TABLE locales (
    locale_id           SERIAL PRIMARY KEY,
    code                VARCHAR(10) UNIQUE NOT NULL,      -- ja, en, zh, ko
    name                VARCHAR(100) NOT NULL,            -- Japanese, English
    is_default          BOOLEAN DEFAULT FALSE NOT NULL,
    is_active           BOOLEAN DEFAULT TRUE NOT NULL,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

**学習ポイント**:
- 最もシンプルなテーブル
- 主キー、一意制約、デフォルト値の理解
- CRUD操作の基礎

---

### 2. **Topics + Topic_Translations** 🔜 次に実装

技術トピック（Rust、React、Docker など）の管理

#### Topics（親テーブル）

```sql
CREATE TABLE topics (
    topic_id            SERIAL PRIMARY KEY,
    slug                VARCHAR(100) UNIQUE NOT NULL,     -- rust, react, docker
    is_published        BOOLEAN DEFAULT TRUE NOT NULL,
    created_by          INTEGER,                          -- 将来: FK to Administrators
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

#### Topic_Translations（翻訳テーブル）

```sql
CREATE TABLE topic_translations (
    translation_id      SERIAL PRIMARY KEY,
    topic_id            INTEGER NOT NULL REFERENCES topics(topic_id) ON DELETE CASCADE,
    locale_id           INTEGER NOT NULL REFERENCES locales(locale_id) ON DELETE RESTRICT,
    name                VARCHAR(100) NOT NULL,            -- Rust, React（日本語/英語）
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    UNIQUE(topic_id, locale_id)  -- 1つのTopicに対して、1つの言語は1つの翻訳のみ
);
```

**学習ポイント**:
- 1対多の関係（1つのTopicに複数の翻訳）
- 外部キー制約（REFERENCES, ON DELETE）
- UNIQUE制約（複合キー）
- JOINによるテーブル結合

---

### 3. **Books + Book_Translations + Book_Chapters + Book_Chapter_Translations**

ブック形式のコンテンツ管理（例: Rustチュートリアル、Dockerガイド）

#### Books（本の基本情報）

```sql
CREATE TABLE books (
    book_id             SERIAL PRIMARY KEY,
    slug                VARCHAR(255) UNIQUE NOT NULL,     -- rust-tutorial
    emoji               VARCHAR(10),                      -- 📚
    top_image_url       VARCHAR(500),
    display_order       INTEGER,
    is_published        BOOLEAN DEFAULT FALSE NOT NULL,
    default_locale_id   INTEGER REFERENCES locales(locale_id),
    created_by          INTEGER,                          -- FK to Administrators
    last_updated_by     INTEGER,                          -- FK to Administrators
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    published_at        TIMESTAMP WITH TIME ZONE
);
```

#### Book_Translations（本の翻訳）

```sql
CREATE TABLE book_translations (
    translation_id      SERIAL PRIMARY KEY,
    book_id             INTEGER NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
    locale_id           INTEGER NOT NULL REFERENCES locales(locale_id) ON DELETE RESTRICT,
    title               VARCHAR(255) NOT NULL,
    introduction        TEXT,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    UNIQUE(book_id, locale_id)
);
```

#### Book_Chapters（章の階層構造）

```sql
CREATE TABLE book_chapters (
    chapter_id          SERIAL PRIMARY KEY,
    book_id             INTEGER NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
    chapter_number      INTEGER NOT NULL,
    slug                VARCHAR(255) NOT NULL,
    parent_chapter_id   INTEGER REFERENCES book_chapters(chapter_id) ON DELETE SET NULL,
    is_published        BOOLEAN DEFAULT FALSE NOT NULL,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    UNIQUE(book_id, chapter_number)
);
```

#### Book_Chapter_Translations（章の翻訳）

```sql
CREATE TABLE book_chapter_translations (
    translation_id      SERIAL PRIMARY KEY,
    chapter_id          INTEGER NOT NULL REFERENCES book_chapters(chapter_id) ON DELETE CASCADE,
    locale_id           INTEGER NOT NULL REFERENCES locales(locale_id) ON DELETE RESTRICT,
    title               VARCHAR(255) NOT NULL,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    UNIQUE(chapter_id, locale_id)
);
```

**学習ポイント**:
- 階層構造（parent_chapter_id による自己参照）
- 複数のテーブルにまたがる関連
- より複雑なJOIN

---

### 4. **Blog_Posts + Blog_Post_Translations + Blog_Post_Topics**

ブログ記事の管理

#### Blog_Posts（記事の基本情報）

```sql
CREATE TABLE blog_posts (
    post_id             SERIAL PRIMARY KEY,
    slug                VARCHAR(255) UNIQUE NOT NULL,
    meta_image_url      VARCHAR(500),
    estimated_reading_time INTEGER,
    book_id             INTEGER REFERENCES books(book_id) ON DELETE SET NULL,
    chapter_id          INTEGER REFERENCES book_chapters(chapter_id) ON DELETE SET NULL,
    is_published        BOOLEAN DEFAULT FALSE NOT NULL,
    views_count         INTEGER DEFAULT 0 NOT NULL,
    default_locale_id   INTEGER REFERENCES locales(locale_id),
    created_by          INTEGER,                          -- FK to Administrators
    last_updated_by     INTEGER,                          -- FK to Administrators
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    published_at        TIMESTAMP WITH TIME ZONE
);
```

#### Blog_Post_Translations（記事の翻訳）

```sql
CREATE TABLE blog_post_translations (
    translation_id      SERIAL PRIMARY KEY,
    post_id             INTEGER NOT NULL REFERENCES blog_posts(post_id) ON DELETE CASCADE,
    locale_id           INTEGER NOT NULL REFERENCES locales(locale_id) ON DELETE RESTRICT,
    title               VARCHAR(255) NOT NULL,
    summary             TEXT,
    meta_title          VARCHAR(255),
    meta_description    TEXT,
    content             TEXT NOT NULL,                    -- Markdown形式
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    UNIQUE(post_id, locale_id)
);
```

#### Blog_Post_Topics（記事とトピックの多対多）

```sql
CREATE TABLE blog_post_topics (
    post_topic_id       SERIAL PRIMARY KEY,
    post_id             INTEGER NOT NULL REFERENCES blog_posts(post_id) ON DELETE CASCADE,
    topic_id            INTEGER NOT NULL REFERENCES topics(topic_id) ON DELETE CASCADE,
    assigned_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    UNIQUE(post_id, topic_id)
);
```

**学習ポイント**:
- 多対多の関係（中間テーブル）
- Markdown形式のコンテンツ保存
- SEO対策（meta_title, meta_description）

---

### 5. **Media + Media_Translations**

画像・ファイル管理

```sql
CREATE TABLE media (
    media_id            SERIAL PRIMARY KEY,
    filename            VARCHAR(255) NOT NULL,
    original_filename   VARCHAR(255) NOT NULL,
    file_path           VARCHAR(500) NOT NULL,
    file_type           VARCHAR(100),                     -- image/png, image/jpeg
    file_size           BIGINT,
    width               INTEGER,
    height              INTEGER,
    uploaded_by         INTEGER,                          -- FK to Administrators
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE media_translations (
    translation_id      SERIAL PRIMARY KEY,
    media_id            INTEGER NOT NULL REFERENCES media(media_id) ON DELETE CASCADE,
    locale_id           INTEGER NOT NULL REFERENCES locales(locale_id) ON DELETE RESTRICT,
    alt_text            VARCHAR(255),
    caption             TEXT,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    UNIQUE(media_id, locale_id)
);
```

**学習ポイント**:
- ファイルアップロード
- 画像メタ情報の管理
- 多言語対応のalt_text

---

### 6. **Administrators + Sessions**

管理者とセッション管理

```sql
CREATE TABLE administrators (
    admin_id            SERIAL PRIMARY KEY,
    username            VARCHAR(100) UNIQUE NOT NULL,
    email               VARCHAR(255) UNIQUE NOT NULL,
    password_hash       VARCHAR(255) NOT NULL,
    full_name           VARCHAR(200),
    role                VARCHAR(50) DEFAULT 'author' NOT NULL,  -- admin, editor, author
    is_active           BOOLEAN DEFAULT TRUE NOT NULL,
    last_login_at       TIMESTAMP WITH TIME ZONE,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE sessions (
    session_id          SERIAL PRIMARY KEY,
    admin_id            INTEGER NOT NULL REFERENCES administrators(admin_id) ON DELETE CASCADE,
    session_token       VARCHAR(500) UNIQUE NOT NULL,
    ip_address          VARCHAR(45),
    user_agent          TEXT,
    expires_at          TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    last_activity_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

**学習ポイント**:
- パスワードのハッシュ化
- JWT/セッショントークン
- セキュリティベストプラクティス

---

### 7. **API_Keys**

API認証

```sql
CREATE TABLE api_keys (
    api_key_id          SERIAL PRIMARY KEY,
    key_name            VARCHAR(100) NOT NULL,
    api_key_hash        VARCHAR(255) UNIQUE NOT NULL,
    permissions         VARCHAR(500),                     -- read, write, delete
    is_active           BOOLEAN DEFAULT TRUE NOT NULL,
    expires_at          TIMESTAMP WITH TIME ZONE,
    created_by          INTEGER REFERENCES administrators(admin_id),
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    last_used_at        TIMESTAMP WITH TIME ZONE
);
```

---

### 8. **Audit_Logs**

変更履歴の監査ログ

```sql
CREATE TABLE audit_logs (
    log_id              SERIAL PRIMARY KEY,
    table_name          VARCHAR(100) NOT NULL,
    record_id           INTEGER NOT NULL,
    action              VARCHAR(50) NOT NULL,             -- INSERT, UPDATE, DELETE
    old_values          TEXT,                             -- JSON形式
    new_values          TEXT,                             -- JSON形式
    changed_by          INTEGER REFERENCES administrators(admin_id),
    changed_via         VARCHAR(50),                      -- web, api
    ip_address          VARCHAR(45),
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

---

## 🔄 多言語対応パターン

### パターン1: 親テーブル + 翻訳テーブル

```
Topics (親)           Topic_Translations (子)
  ↓                        ↓
topic_id: 1          topic_id: 1, locale_id: 1 (ja) → name: "Rust"
                     topic_id: 1, locale_id: 2 (en) → name: "Rust"
```

**メリット**:
- 新しい言語を簡単に追加
- 翻訳が存在しない場合の判定が可能
- 言語ごとに異なるコンテンツを提供

**デメリット**:
- JOINが必要（パフォーマンス考慮）
- クエリが複雑

---

## 📚 実装の順番

### Phase 1: 基礎（現在）
1. ✅ Locales
2. 🔜 Topics + Topic_Translations

### Phase 2: コンテンツ
3. Books + Book_Translations + Book_Chapters
4. Blog_Posts + Blog_Post_Translations
5. Blog_Post_Topics

### Phase 3: メディア
6. Media + Media_Translations

### Phase 4: 認証
7. Administrators
8. Sessions
9. API_Keys

### Phase 5: 監査
10. Audit_Logs

---

## 🎯 各フェーズの学習目標

### Phase 1
- SQLの基礎
- Rustの基礎
- Axumの基礎
- 1対多の関係

### Phase 2
- 階層構造
- 複雑なJOIN
- 多対多の関係
- Markdownコンテンツ

### Phase 3
- ファイルアップロード
- 画像処理
- S3連携（将来）

### Phase 4
- 認証・認可
- JWT/セッション
- パスワードハッシュ
- セキュリティ

### Phase 5
- 監査ログ
- JSON型の活用
- トリガー関数

---

このスキーマは段階的に実装していきます。
焦らず、1つずつ理解しながら進めていきましょう！ 📚✨
