# 📊 Postico接続設定ガイド

## Posticoとは

PosticoはmacOS用の最高のPostgreSQLクライアントです。美しいUIで簡単にデータベースを閲覧・編集できます。

🔗 https://eggerapps.at/postico/

---

## 🔌 接続設定

### 1. Posticoを開く

### 2. 新しい接続を作成

**「New Favorite」をクリック**

### 3. 接続情報を入力

```
名前（Name）:          Blog Dev
ホスト（Host）:        localhost
ポート（Port）:        5432
ユーザー（User）:      blog_user
パスワード（Password）: blog_password
データベース（Database）: blog_dev
```

### 4. 接続テスト

「Test Connection」をクリックして接続を確認

### 5. 保存して接続

「Save & Connect」をクリック

---

## 📊 データベース構造の確認

Posticoで以下のテーブルが表示されます：

### テーブル一覧

```
✅ users           - 著者・管理者（2件）
✅ categories      - カテゴリ（5件）
✅ tags            - タグ（15件）
✅ posts           - ブログ記事（3件サンプル）
✅ post_tags       - 記事とタグの関連
✅ post_relations  - 記事間の関連
✅ media           - メディアファイル管理
✅ post_revisions  - 記事の変更履歴
```

---

## 🔍 サンプルデータの確認

### 記事を見る

1. 左サイドバーで「posts」テーブルをクリック
2. 3件のサンプル記事が表示されます：
   - Rustを始めよう
   - Next.js App Routerの完全ガイド
   - Docker Composeで開発環境を構築する

### カテゴリを見る

1. 「categories」テーブルをクリック
2. 5つのカテゴリが表示されます（技術、チュートリアル、考察・意見、ニュース、キャリア）

### タグを見る

1. 「tags」テーブルをクリック
2. 15個のタグが表示されます（Rust, React, Next.js, TypeScript, Docker など）

---

## 🎨 便利な機能

### SQLクエリの実行

上部メニューの「SQL Query」ボタンをクリックして、カスタムクエリを実行できます：

```sql
-- 公開済み記事の一覧を取得
SELECT 
    p.id,
    p.slug,
    p.title_ja,
    p.title_en,
    c.name_ja as category_name,
    p.view_count,
    p.published_at
FROM posts p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.published = true
ORDER BY p.published_at DESC;
```

```sql
-- 記事とそのタグを取得
SELECT 
    p.title_ja,
    t.name_ja as tag_name,
    t.color
FROM posts p
JOIN post_tags pt ON p.id = pt.post_id
JOIN tags t ON pt.tag_id = t.id
ORDER BY p.id, t.name_ja;
```

```sql
-- 記事の関連を確認
SELECT 
    p1.title_ja as source_post,
    pr.relation_type,
    p2.title_ja as target_post
FROM post_relations pr
JOIN posts p1 ON pr.source_post_id = p1.id
JOIN posts p2 ON pr.target_post_id = p2.id
ORDER BY p1.id, pr.relation_type;
```

### データの編集

- テーブルビューで直接セルをダブルクリックして編集
- `⌘+S` で保存

### エクスポート

- テーブルを選択 → メニューの「File」→「Export」
- CSV, JSON, SQL形式でエクスポート可能

---

## 🔒 本番環境への接続（将来）

本番環境に接続する場合は、SSHトンネルを使用することをおすすめします：

### SSH経由での接続

```
SSH Host:     your-server.com
SSH Port:     22
SSH User:     your-username
SSH Key:      ~/.ssh/id_rsa

Database Host: localhost（SSHトンネル経由なのでlocalhost）
Database Port: 5432
```

---

## 🚀 次のステップ

Posticoでデータベースが確認できたら、次はRustでデータベースに接続してAPIを実装しましょう！

1. ✅ PostgreSQL起動
2. ✅ マイグレーション実行
3. ✅ Posticoで確認
4. ⏭️ RustでDB接続
5. ⏭️ CRUD API実装

