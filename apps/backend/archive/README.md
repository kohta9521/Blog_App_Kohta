# 📦 アーカイブ - 退避したファイル

このディレクトリには、学習のために一時的に退避した古いファイルが保存されています。

---

## 📂 ディレクトリ構成

```
archive/
├── old-migrations/       # 旧スキーマ（8テーブルの複雑な設計）
│   ├── 001_create_base_tables.sql
│   └── 002_insert_initial_data.sql
└── old-code/             # 旧実装（Post関連）
    ├── domain/
    ├── posts.rs
    ├── post.rs
    └── repositories/
```

---

## 🗄️ old-migrations/

### 内容
- 多言語対応ブログシステムの完全なスキーマ
- 8つのテーブル（users, categories, tags, posts, media, post_tags, post_relations, post_revisions）
- 本格的な多言語対応設計

### 退避理由
- 学習のため、シンプルなLocalesテーブルから始める
- いきなり複雑なスキーマを学ぶと理解が追いつかない
- 段階的に機能を追加していく方針に変更

### 将来の使用予定
- Locales, Topics などの基礎テーブルを理解した後
- 必要な部分だけを取り出して使用
- または、新しい設計に基づいて再構築

---

## 🦀 old-code/

### 内容
- Post（ブログ記事）関連の実装
- domain/entities/post.rs
- handlers/posts.rs
- models/post.rs
- repositories/post_repository.rs

### 退避理由
- 新しいスキーマに合わせて段階的に実装し直すため
- 学習教材として、超詳細解説付きのコードを作成するため

### 参考資料として
- 実装のパターンを参考にできる
- 将来、Postテーブルを実装する際に参照

---

## 🎯 現在の学習ステップ

### Step 1: Locales（現在）✅
- 最もシンプルなテーブル
- CRUD操作の基礎
- Rust + SQLの基本を学ぶ

### Step 2: Topics + Topic_Translations（次）
- 1対多の関係
- JOIN（テーブル結合）
- 多言語パターン

### Step 3: 以降、徐々に複雑に
- Books + Book_Translations
- Blog_Posts + Blog_Post_Translations
- 画像アップロード（Media）
- 認証（Administrators, Sessions）

---

## 📝 注意事項

- このアーカイブのファイルは現在使用されていません
- 削除してもシステムに影響はありません
- 必要に応じて参照してください
- 学習が進んだら、適宜削除または再利用してください

---

## 🔄 復元方法（必要な場合）

### マイグレーションを復元

```bash
cd apps/backend

# 現在のマイグレーションを退避
mv migrations migrations-new

# 旧マイグレーションを復元
mv archive/old-migrations migrations
```

### コードを復元

```bash
# 旧コードを復元
mv archive/old-code/domain src/
mv archive/old-code/posts.rs src/handlers/
mv archive/old-code/post.rs src/models/
mv archive/old-code/repositories src/
```

---

このアーカイブは学習のための一時的な退避です。
焦らず、1つずつ理解しながら進めていきましょう！ 📚✨
