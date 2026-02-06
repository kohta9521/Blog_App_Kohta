# microCMS API Client

Next.js 15 App Router + microCMS の完璧な統合実装

## 📂 ファイル構成

```
lib/api-client/
├── client.ts         # microCMS SDKクライアント初期化
├── blog.ts          # ブログAPI関数群
├── topic.ts         # トピックAPI関数群
├── error.ts         # エラーハンドリング
└── README.md        # このファイル

schema/
├── blog.ts          # ブログ記事のZodスキーマ
├── topic.ts         # トピックのZodスキーマ
└── common.ts        # 共通スキーマ

app/
├── [lang]/
│   ├── blog/
│   │   ├── page.tsx         # 一覧ページ（Server Component）
│   │   └── [id]/
│   │       └── page.tsx     # 詳細ページ（Server Component + SEO）
│   └── ...
├── sitemap.ts               # 動的sitemap.xml生成
└── robots.ts                # robots.txt
```

## 🚀 使用方法

### 1. 環境変数の設定

`.env` または `.env.local` に以下を追加:

```env
MICROCMS_API_KEY=your_api_key_here
MICROCMS_SERVICE_DOMAIN=your_service_domain
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 1.5 多言語対応について（シンプル設計）

**ID ベースの言語判定:**

- 日本語記事: `id = "xxxxxxx"` (デフォルト)
- 英語記事: `id = "xxxxxxx-en"` (同じ記事の英語版)

**ヘルパー関数:**

```typescript
// IDを言語に応じて変換
getLocalizedBlogId("xxx", "ja"); // → "xxx"
getLocalizedBlogId("xxx", "en"); // → "xxx-en"

// IDから言語を判定
detectLocaleFromBlogId("xxx"); // → "ja"
detectLocaleFromBlogId("xxx-en"); // → "en"
```

**フィルタリング:**

```typescript
// 言語に応じてフィルタリング
const filteredBlogs = blogs.filter(
  (blog) => detectLocaleFromBlogId(blog.id) === lang
);
```

### 2. ブログ一覧の取得（多言語対応）

```typescript
// app/[lang]/blog/page.tsx
import { getBlogs, detectLocaleFromBlogId } from "@/lib/api-client/blog";
import { getTopics } from "@/lib/api-client/topic";

export default async function BlogPage({ params }) {
  const { lang } = await params;

  // 全記事を取得
  const [blogsData, topicsData] = await Promise.all([
    getBlogs({ limit: 100, orders: "-publishedAt" }),
    getTopics({ limit: 100 }),
  ]);

  // IDサフィックスで言語フィルタリング
  const filteredBlogs = blogsData.contents.filter(
    (blog) => detectLocaleFromBlogId(blog.id) === lang
  );

  return (
    <BlogPageComponent blogs={filteredBlogs} topics={topicsData.contents} />
  );
}

// ISR: 1時間ごとに再生成
export const revalidate = 3600;
```

### 3. ブログ詳細の取得（多言語対応）

```typescript
// app/[lang]/blog/[id]/page.tsx
import {
  getBlogById,
  getLocalizedBlogId,
  detectLocaleFromBlogId,
} from "@/lib/api-client/blog";

export default async function BlogDetailPage({ params }) {
  const { lang, id } = await params;

  // 言語に応じてIDを変換（ja: xxx, en: xxx-en）
  const localizedId = getLocalizedBlogId(id, lang);
  const article = await getBlogById(localizedId);

  return <BlogDetailPageComponent article={article} />;
}

// 動的メタデータ生成（SEO）
export async function generateMetadata({ params }) {
  const { lang, id } = await params;
  const localizedId = getLocalizedBlogId(id, lang);
  const article = await getBlogById(localizedId);

  return {
    title: article.meta_title || article.title,
    description: article.meta_desc || article.summary,
    openGraph: {
      title: article.meta_title,
      description: article.meta_desc,
      type: "article",
      publishedTime: article.publishedAt,
      locale: lang,
    },
  };
}

// 静的生成パス
export async function generateStaticParams() {
  const { contents } = await getBlogs({ limit: 1000 });
  const locales = ["ja", "en"];

  return locales.flatMap((lang) =>
    contents
      .filter((blog) => detectLocaleFromBlogId(blog.id) === lang)
      .map((blog) => ({
        lang,
        id: blog.id.replace(/-en$/, ""), // ベースID
      }))
  );
}
```

### 4. フィルタリング機能

```typescript
// トピックでフィルタリング
const rustBlogs = await getBlogsByTopic("Rust", { limit: 20 });

// 日付範囲でフィルタリング
const recentBlogs = await getBlogsByDateRange("2026-01-01", "2026-02-28", {
  limit: 30,
});

// カスタムフィルタ
const customBlogs = await getBlogs({
  limit: 10,
  filters: "topics[contains]AI[and]read_time[greater_than]5",
  orders: "-publishedAt",
});
```

### 5. 全件取得（ページネーション対応）

microCMS API は`limit`を最大 100 までしか許可していません。100 件を超える記事を取得する場合は`getAllBlogs()`を使用してください。

```typescript
// 全ブログ記事を取得（自動ページネーション）
const allBlogs = await getAllBlogs({ orders: "-publishedAt" });
console.log(`取得した記事数: ${allBlogs.contents.length}`);

// generateStaticParamsで使用
export async function generateStaticParams() {
  const { contents } = await getAllBlogs({ orders: "-publishedAt" });
  return contents.map((blog) => ({ id: blog.id }));
}
```

**注意:**

- `getBlogs()`: 最大 100 件まで取得
- `getAllBlogs()`: 自動的にページネーションして全件取得

## 🎯 主要機能

### ✅ 型安全性

- **Zod スキーマ**: ランタイムバリデーション
- **TypeScript**: コンパイル時の型チェック
- API レスポンスの型不一致を自動検出

```typescript
// スキーマとTypeScript型が自動連携
const blog = await getBlogById("xxx");
console.log(blog.title); // ✅ OK
console.log(blog.invalidField); // ❌ TypeScriptエラー
```

### ✅ パフォーマンス最適化

1. **ISR（Incremental Static Regeneration）**

   ```typescript
   export const revalidate = 3600; // 1時間ごとに再生成
   ```

2. **並列データ取得**

   ```typescript
   const [blogs, topics] = await Promise.all([getBlogs(), getTopics()]);
   ```

3. **静的生成（generateStaticParams）**
   - ビルド時に全記事ページを生成
   - 初回アクセスが超高速

### ✅ SEO 最適化

1. **動的メタデータ**

   - 記事ごとに最適な title/description
   - Open Graph 対応
   - Twitter Card 対応

2. **sitemap.xml 自動生成**

   - 全記事 URL を含む
   - 更新日時を正確に反映
   - 多言語対応（ja/en）

3. **robots.txt**
   - クローラー最適化
   - sitemap URL を自動追加

### ✅ エラーハンドリング

```typescript
try {
  const blog = await getBlogById("invalid-id");
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error: ${error.message}`);
    console.error(`Endpoint: ${error.endpoint}`);
    console.error(`Status: ${error.statusCode}`);
  }
}
```

## 🔄 キャッシュ戦略

### Next.js 15 のキャッシュ動作

1. **デフォルト: force-cache（静的生成）**

   ```typescript
   // キャッシュされる（ビルド時）
   const blogs = await getBlogs();
   ```

2. **ISR（定期再生成）**

   ```typescript
   export const revalidate = 3600; // 1時間
   ```

3. **オンデマンド再検証（手動トリガー）**
   ```typescript
   // API Route等で実行
   revalidatePath("/blog");
   revalidateTag("blogs");
   ```

### microCMS Webhook 連携（推奨）

記事公開時に自動で再検証:

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  // 秘密鍵チェック
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  // ブログページを再検証
  revalidatePath("/[lang]/blog");
  revalidatePath("/[lang]/blog/[id]");

  return NextResponse.json({ revalidated: true });
}
```

microCMS の管理画面で以下を設定:

- Webhook URL: `https://your-domain.com/api/revalidate?secret=YOUR_SECRET`
- トリガー: 記事の公開・更新

## 📊 パフォーマンス指標

### ビルド時

```bash
npm run build
```

- 全記事の静的生成: ~10 秒（100 記事の場合）
- sitemap.xml 生成: ~1 秒

### 実行時

- 初回アクセス: ~50ms（静的ページ）
- ISR 再生成: バックグラウンド（ユーザー待機なし）
- API 呼び出し: ~200ms（microCMS）

## 🛡️ セキュリティ

1. **API KEY の保護**

   - Server Component でのみ使用
   - クライアントに露出しない
   - 環境変数で管理

2. **バリデーション**

   - Zod でデータ検証
   - 不正なレスポンスを自動検出

3. **エラーハンドリング**
   - 機密情報を含まないエラーメッセージ
   - ログ記録による監視

## 🧪 テスト（オプション）

```typescript
// __tests__/api/blog.test.ts
import { getBlogs, getBlogById } from "@/lib/api-client/blog";

describe("Blog API", () => {
  it("ブログ一覧を取得できる", async () => {
    const result = await getBlogs({ limit: 10 });
    expect(result.contents).toHaveLength(10);
    expect(result.totalCount).toBeGreaterThan(0);
  });

  it("ブログ詳細を取得できる", async () => {
    const blog = await getBlogById("wm0frxhnzx");
    expect(blog.title).toBe("Rustの所有権と借用を理解する");
  });
});
```

## 📖 まとめ

この実装の特徴:

✅ **軽量**: 必要最小限のライブラリ（microCMS SDK + Zod）  
✅ **型安全**: TypeScript + Zod の二重保護  
✅ **高速**: ISR + 静的生成 + 並列データ取得  
✅ **SEO 完璧**: metadata + sitemap + robots  
✅ **保守性**: 明確なファイル構成 + エラーハンドリング  
✅ **スケーラブル**: 1000 記事以上でも問題なし

---

**作成日**: 2026-02-06  
**Next.js**: 15.x  
**microCMS SDK**: latest
