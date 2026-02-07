# Book 機能の実装ガイド

## 概要

書籍風ブログを表示するための専用ルーティングと UI を実装しました。通常のブログとは異なり、Chapter 形式で記事を管理し、書籍のように読み進められる体験を提供します。

## ルート構造

```
/[lang]/book
├── page.tsx                    # 書籍一覧ページ
├── [id]/
│   ├── page.tsx                # 書籍詳細（Chapter一覧）
│   └── [article]/
│       └── page.tsx            # 記事詳細（Chapter）
```

### 1. `/[lang]/book` - 書籍一覧

- 全ての Book をグリッドレイアウトで表示
- 各 Book カードには以下の情報を表示：
  - Book タイトル
  - Chapter 数
  - 公開日・更新日

### 2. `/[lang]/book/[id]` - Book 詳細（Chapter 一覧）

- 選択した Book の全 Chapter を一覧表示
- 記事は公開日の古い順（Chapter 順）に自動ソート
- 各 Chapter をクリックすると詳細が展開：
  - サマリー
  - メタデータ（公開日、読了時間）
  - トピック
  - 読むボタン

### 3. `/[lang]/book/[id]/[article]` - 記事詳細

- Chapter 形式で記事を表示
- パンくずリストでナビゲーション
- 記事の前後の Chapter へのナビゲーション
- 「目次に戻る」ボタン

## コンポーネント構造

### 1. `BooksListPage.tsx`

書籍一覧を表示するコンポーネント。グリッドレイアウトで各 Book をカード形式で表示。

**Props:**

- `lang`: 現在の言語
- `books`: Book 配列
- `bookArticleCounts`: 各 Book の記事数

### 2. `BookDetailPage.tsx`

Book 詳細（Chapter 一覧）を表示するコンポーネント。

**Props:**

- `lang`: 現在の言語
- `book`: Book 情報
- `articles`: この Book に属する記事配列

**機能:**

- 記事を公開日順にソート（古い順 = Chapter 順）
- Chapter の展開/折りたたみ
- Chapter 番号の自動付与（01, 02, ...）

### 3. `BookArticleDetailPage.tsx`

Book 記事詳細を表示するコンポーネント。

**Props:**

- `lang`: 現在の言語
- `dict`: 辞書データ
- `book`: Book 情報
- `article`: 記事データ
- `prevArticle`: 前の Chapter 情報
- `nextArticle`: 次の Chapter 情報
- `currentChapterNumber`: 現在の Chapter 番号

**機能:**

- 前後の Chapter へのナビゲーション
- パンくずリスト
- 目次への戻るボタン
- CSS モジュールを使用した記事コンテンツのスタイリング

## データ構造

### Book Schema

```typescript
{
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  book_title: string;
  book_blogs: BookBlog[]; // 書籍に含まれるブログ記事の配列（順番がChapter順）
}
```

### BookBlog Schema（簡易版 Blog）

```typescript
{
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  title_en: string;
  summary: string;
  sammary_en: string;
  topics: Array<{ id: string }>; // Topic参照のみ
  meta_title: string;
  meta_title_en: string;
  meta_desc: string;
  meta_desc_en: string;
  read_time?: number;
  main_contents?: string;
}
```

### 🎯 重要な変更点（2026-02-07 更新）

- ✅ **Book API に`book_blogs`配列が追加**されました
- ✅ ブログ記事は Book の`book_blogs`配列に**順番通り**に格納されます
- ✅ **配列の順序 = Chapter 順序**（publishedAt でのソートは不要）
- ⚠️ Blog API の`book`フィールドは廃止（現在は使用していません）

## スタイリング

- ダークモード基調のデザイン
- アクセントカラー: ピンク（`bg-pink-600`）
- `rounded-none`（角丸なし）の統一されたデザイン
- フォント: モノスペース（`font-mono`）を多用
- ホバーエフェクト: `hover:bg-pink-600`

## API

### Book API Client (`lib/api-client/book.ts`)

```typescript
getBooks(options?: GetBooksOptions): Promise<BooksResponse>
```

microCMS の Book API から全書籍を取得します。

## ナビゲーション

### ヘッダー

ヘッダーに「BOOKS」リンクを追加し、Book 一覧ページへアクセス可能にしました。

### サイドバー（Blog 一覧ページ）

既存の Blog 一覧ページのサイドバーに「Book」フィルターセクションを追加。

- Book を選択すると、その Book に属する記事のみを表示
- 他のフィルター（Topic、Archive）と併用可能

## SEO 対応

### Sitemap

以下の URL を sitemap.xml に追加：

- `/[lang]/book` - Books 一覧
- `/[lang]/book/[id]` - 各 Book 詳細
- `/[lang]/book/[id]/[article]` - 各 Book 記事

### メタデータ

各ページで動的にメタデータを生成：

- タイトル
- 説明文
- Open Graph
- Twitter Card

### ISR（Incremental Static Regeneration）

全てのページで 1 時間ごとに再生成（`revalidate: 3600`）

## 使用方法

### 1. microCMS で Book を作成

microCMS の管理画面で「book」API を使用して新しい Book を作成します。

### 2. ブログ記事を Book の`book_blogs`配列に追加

1. Book 編集画面で`book_blogs`フィールドに既存のブログ記事を追加
2. **配列の順番がそのまま Chapter 順になります**
3. ドラッグ&ドロップで順序を変更可能

例：

```json
{
  "book_blogs": [
    { "id": "article-001" }, // → Chapter 01
    { "id": "article-002" }, // → Chapter 02
    { "id": "article-003" } // → Chapter 03
  ]
}
```

### 3. Chapter 番号は配列順で自動付与

- 配列の 1 番目 = Chapter 01
- 配列の 2 番目 = Chapter 02
- 配列の 3 番目 = Chapter 03
- **公開日でのソートは行いません**（配列順序を尊重）

### 4. ユーザーは書籍として閲覧

ユーザーは以下の流れで閲覧：

1. Books 一覧 → Book 選択
2. Chapter 一覧（配列順で表示） → Chapter 選択
3. 記事を読む → 前後の Chapter へナビゲーション

## 今後の拡張案

- [ ] Book 毎のカバー画像
- [ ] 読書進捗の記録
- [ ] Book の説明文（description）フィールド
- [ ] Book のカテゴリ分類
- [ ] PDF エクスポート機能
- [ ] お気に入り Book 機能
- [ ] Book の評価・レビュー機能
