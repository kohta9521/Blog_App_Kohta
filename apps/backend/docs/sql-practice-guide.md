# 🎓 SQL 実践ガイド - Postico で学ぶ

## 🎯 目標

このガイドでは、**あなたのブログデータベースを使って**SQL を実践的に学びます。

---

## 📖 SQL 学習ロードマップ（1-2 週間）

### 🟢 Week 1: 基本の SELECT（読み取り）

#### Day 1-2: 基本の SELECT

#### Day 3-4: WHERE 条件とソート

#### Day 5-7: 集計とグループ化

### 🟡 Week 2: 中級（JOIN・サブクエリ）

#### Day 8-10: JOIN（テーブル結合）

#### Day 11-12: INSERT, UPDATE, DELETE

#### Day 13-14: サブクエリと応用

---

## 📝 Day 1-2: 基本の SELECT

### 🎯 学ぶこと

- テーブルからデータを取得する
- 特定のカラムだけ選ぶ
- 件数を制限する

### 💻 Postico で実行してみよう

#### 練習 1: 全ての記事を取得

```sql
-- すべての記事を見る
SELECT * FROM posts;
```

**説明:**

- `SELECT *`: 全てのカラム（列）を選択
- `FROM posts`: posts テーブルから
- `*`は「全部」という意味

#### 練習 2: 特定のカラムだけ取得

```sql
-- タイトルだけを見る
SELECT
    id,
    title_ja,
    title_en
FROM posts;
```

**説明:**

- 必要なカラムだけ指定できる
- カンマ`,`で区切る

#### 練習 3: 件数を制限

```sql
-- 最初の2件だけ
SELECT * FROM posts
LIMIT 2;
```

**説明:**

- `LIMIT 2`: 2 件だけ取得

#### 練習 4: カラムに別名をつける

```sql
-- 日本語でわかりやすく
SELECT
    id AS "記事ID",
    title_ja AS "タイトル",
    view_count AS "閲覧数"
FROM posts;
```

**説明:**

- `AS "別名"`: カラムに別名をつける
- Postico で見やすくなる

---

## 📝 Day 3-4: WHERE 条件とソート

### 🎯 学ぶこと

- 条件でデータを絞り込む
- データを並べ替える

### 💻 練習問題

#### 練習 5: 公開済みの記事だけ取得

```sql
-- published = true の記事だけ
SELECT * FROM posts
WHERE published = true;
```

**説明:**

- `WHERE`: 条件を指定
- `published = true`: 公開済み

#### 練習 6: 特定のカテゴリの記事

```sql
-- カテゴリID=1（技術カテゴリ）の記事
SELECT
    title_ja,
    category_id
FROM posts
WHERE category_id = 1;
```

#### 練習 7: 閲覧数が多い順に並べる

```sql
-- 人気記事順
SELECT
    title_ja,
    view_count
FROM posts
ORDER BY view_count DESC;
```

**説明:**

- `ORDER BY`: 並べ替え
- `DESC`: 降順（大きい順）
- `ASC`: 昇順（小さい順）※デフォルト

#### 練習 8: 複数条件を組み合わせ

```sql
-- 公開済みで、カテゴリID=2の記事
SELECT * FROM posts
WHERE published = true
  AND category_id = 2;
```

**説明:**

- `AND`: 両方の条件を満たす
- `OR`: どちらかを満たす

#### 練習 9: 部分一致検索

```sql
-- タイトルに「Rust」を含む記事
SELECT title_ja, title_en
FROM posts
WHERE title_en LIKE '%Rust%';
```

**説明:**

- `LIKE`: 部分一致
- `%`: 任意の文字列

#### 練習 10: 日付の範囲指定

```sql
-- 2026年1月10日以降に公開された記事
SELECT
    title_ja,
    published_at
FROM posts
WHERE published_at >= '2026-01-10';
```

---

## 📝 Day 5-7: 集計とグループ化

### 🎯 学ぶこと

- データを数える・合計する
- グループごとに集計

### 💻 練習問題

#### 練習 11: 記事の総数を数える

```sql
-- 全記事数
SELECT COUNT(*) AS "記事数"
FROM posts;
```

**説明:**

- `COUNT(*)`: 行数を数える

#### 練習 12: 公開済み記事を数える

```sql
SELECT COUNT(*) AS "公開記事数"
FROM posts
WHERE published = true;
```

#### 練習 13: カテゴリごとの記事数

```sql
-- カテゴリ別の記事数
SELECT
    category_id AS "カテゴリID",
    COUNT(*) AS "記事数"
FROM posts
GROUP BY category_id
ORDER BY category_id;
```

**説明:**

- `GROUP BY`: グループ化
- カテゴリごとに COUNT する

#### 練習 14: 合計・平均・最大・最小

```sql
-- 閲覧数の統計
SELECT
    COUNT(*) AS "記事数",
    SUM(view_count) AS "総閲覧数",
    AVG(view_count) AS "平均閲覧数",
    MAX(view_count) AS "最大閲覧数",
    MIN(view_count) AS "最小閲覧数"
FROM posts;
```

**説明:**

- `SUM()`: 合計
- `AVG()`: 平均
- `MAX()`: 最大
- `MIN()`: 最小

#### 練習 15: カテゴリ別の平均読了時間

```sql
SELECT
    category_id,
    AVG(reading_time_ja) AS "平均読了時間（分）"
FROM posts
WHERE reading_time_ja IS NOT NULL
GROUP BY category_id;
```

---

## 📝 Day 8-10: JOIN（テーブル結合）

### 🎯 学ぶこと

- 複数のテーブルを結合
- 関連するデータを一緒に取得

### 💻 練習問題

#### 練習 16: 記事とカテゴリを結合

```sql
-- 記事とカテゴリ名を一緒に表示
SELECT
    p.id,
    p.title_ja AS "記事タイトル",
    c.name_ja AS "カテゴリ名"
FROM posts p
INNER JOIN categories c ON p.category_id = c.id;
```

**説明:**

- `INNER JOIN`: 両方のテーブルにあるデータだけ
- `ON`: 結合条件
- `p.`, `c.`: テーブルの別名

#### 練習 17: 記事と著者を結合

```sql
-- 記事と著者名
SELECT
    p.title_ja AS "記事",
    u.name AS "著者"
FROM posts p
INNER JOIN users u ON p.author_id = u.id;
```

#### 練習 18: 記事とタグを結合（多対多）

```sql
-- 記事とそのタグ一覧
SELECT
    p.title_ja AS "記事",
    t.name_ja AS "タグ"
FROM posts p
INNER JOIN post_tags pt ON p.id = pt.post_id
INNER JOIN tags t ON pt.tag_id = t.id
ORDER BY p.id;
```

**説明:**

- 中間テーブル（post_tags）を経由
- 多対多の関係を表現

#### 練習 19: LEFT JOIN（該当がなくても表示）

```sql
-- 全記事とカテゴリ（カテゴリなしも表示）
SELECT
    p.title_ja,
    c.name_ja
FROM posts p
LEFT JOIN categories c ON p.category_id = c.id;
```

**説明:**

- `LEFT JOIN`: 左側（posts）は全て表示
- 右側（categories）がなければ NULL

#### 練習 20: 複雑なクエリ - 記事の完全情報

```sql
-- 記事の完全な情報を取得
SELECT
    p.title_ja AS "タイトル",
    p.excerpt_ja AS "要約",
    c.name_ja AS "カテゴリ",
    u.name AS "著者",
    p.view_count AS "閲覧数",
    p.published_at AS "公開日"
FROM posts p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN users u ON p.author_id = u.id
WHERE p.published = true
ORDER BY p.published_at DESC;
```

---

## 📝 Day 11-12: データの変更

### 🎯 学ぶこと

- データを追加・更新・削除
- **⚠️ 注意: 本番環境では慎重に！**

### 💻 練習問題

#### 練習 21: 閲覧数を増やす（UPDATE）

```sql
-- 記事ID=1の閲覧数を+1
UPDATE posts
SET view_count = view_count + 1
WHERE id = 1;

-- 確認
SELECT id, title_ja, view_count
FROM posts
WHERE id = 1;
```

**説明:**

- `UPDATE`: データを更新
- `SET`: 変更内容
- **必ず WHERE をつける！**（つけないと全データ更新）

#### 練習 22: カテゴリを変更

```sql
-- 記事のカテゴリを変更
UPDATE posts
SET category_id = 3
WHERE id = 1;
```

#### 練習 23: 複数カラムを一度に更新

```sql
-- タイトルと更新日時を変更
UPDATE posts
SET
    title_ja = '新しいタイトル',
    updated_at = NOW()
WHERE id = 1;
```

---

## 📝 Day 13-14: 応用

### 💻 練習問題

#### 練習 24: サブクエリ - 平均以上の閲覧数

```sql
-- 平均閲覧数以上の記事
SELECT title_ja, view_count
FROM posts
WHERE view_count >= (
    SELECT AVG(view_count) FROM posts
);
```

#### 練習 25: タグの使用回数ランキング

```sql
-- 人気タグTOP5
SELECT
    t.name_ja AS "タグ",
    COUNT(pt.post_id) AS "使用回数"
FROM tags t
LEFT JOIN post_tags pt ON t.id = pt.tag_id
GROUP BY t.id, t.name_ja
ORDER BY "使用回数" DESC
LIMIT 5;
```

#### 練習 26: カテゴリ別の最新記事

```sql
-- 各カテゴリの最新記事
SELECT
    c.name_ja AS "カテゴリ",
    p.title_ja AS "最新記事",
    p.published_at
FROM categories c
LEFT JOIN LATERAL (
    SELECT * FROM posts
    WHERE category_id = c.id
      AND published = true
    ORDER BY published_at DESC
    LIMIT 1
) p ON true
ORDER BY c.id;
```

---

## 🎓 SQL 学習リソース

### 📚 おすすめ教材

1. **SQL Zoo** (無料・日本語)

   - https://sqlzoo.net/wiki/SQL_Tutorial/ja
   - インタラクティブに学べる

2. **paiza SQL** (無料・日本語)

   - https://paiza.jp/works/sql/primer
   - ゲーム感覚で学習

3. **SQL Bolt** (無料・英語)

   - https://sqlbolt.com/
   - 超わかりやすい

4. **W3Schools SQL** (無料・英語/日本語)
   - https://www.w3schools.com/sql/
   - リファレンスとして便利

### 📖 おすすめ書籍

1. **「スッキリわかる SQL 入門」** (翔泳社)

   - 日本語で一番わかりやすい
   - 初心者向け

2. **「達人に学ぶ SQL 徹底指南書」** (翔泳社)
   - 中級者向け
   - 実践的なテクニック

---

## ✅ チェックリスト

### Week 1 完了基準

- [ ] 基本の SELECT ができる
- [ ] WHERE 条件でデータを絞れる
- [ ] ORDER BY で並べ替えられる
- [ ] COUNT, SUM, AVG で集計できる
- [ ] GROUP BY でグループ化できる

### Week 2 完了基準

- [ ] INNER JOIN で 2 つのテーブルを結合できる
- [ ] LEFT JOIN の違いがわかる
- [ ] 3 つ以上のテーブルを結合できる
- [ ] UPDATE でデータを更新できる
- [ ] 複雑なクエリが読める

---

## 🎯 次のステップ

SQL 基礎ができたら:

1. ✅ **Rust 基礎** → The Rust Book（日本語版）
2. ✅ **今回のコードを理解** → 各ファイルを読み直す
3. ✅ **機能追加** → 記事詳細 API、カテゴリ API など

---

## 💡 学習のコツ

1. **毎日少しずつ**

   - 1 日 30 分で OK
   - 継続が大事

2. **Postico で実際に実行**

   - 読むだけじゃなく手を動かす
   - エラーを恐れない

3. **わからないところはスキップ**

   - 完璧を求めない
   - 後で戻ってくれば OK

4. **実際のデータで練習**
   - あなたのブログ DB がある
   - リアルなデータで実践

---

頑張ってください！🎉
わからないことがあったらいつでも聞いてください！
