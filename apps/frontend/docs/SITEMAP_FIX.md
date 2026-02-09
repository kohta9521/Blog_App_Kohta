# 🔧 サイトマップエラーの修正

## 🐛 発見された問題

Google Search Consoleで「サイトマップは読み込み可能ですが、エラーがあります」というエラーが表示されました。

### 原因

1. **二重スラッシュ `//` が含まれていた**
   ```xml
   ❌ https://kohta-tech-blog//ja
   ✅ https://kohta-tech-blog.com/ja
   ```

2. **`.com` が抜けていた**
   ```xml
   ❌ https://kohta-tech-blog/ja
   ✅ https://kohta-tech-blog.com/ja
   ```

3. **www サブドメインの不一致**
   - 実際のサイト: `https://www.kohta-tech-blog.com`
   - 環境変数: `https://kohta-tech-blog.com`（wwwなし）

### エラーの影響

- Googleがページをクロールできない
- インデックス登録が失敗する
- SEOランキングに悪影響
- 56個のURLが「許可されていないURL」として報告

## ✅ 修正内容

### 1. `sitemap.ts`
```typescript
// URLの末尾のスラッシュを削除して正規化
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://kohta-tech-blog.com"
).replace(/\/$/, "");
```

### 2. `robots.ts`
```typescript
// URLの末尾のスラッシュを削除して正規化
const baseUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");
```

### 3. 環境変数の修正
```bash
# Before
NEXT_PUBLIC_SITE_URL=https://kohta-tech-blog.com

# After
NEXT_PUBLIC_SITE_URL=https://www.kohta-tech-blog.com
```

## 🚀 デプロイ後の対応

### 1. Vercelで環境変数を更新
```bash
1. Vercel Dashboard → Settings → Environment Variables
2. NEXT_PUBLIC_SITE_URL を更新:
   https://www.kohta-tech-blog.com
3. Redeploy
```

### 2. サイトマップを再送信
```bash
1. Google Search Console にアクセス
2. サイトマップセクションを開く
3. 既存のサイトマップを削除
4. 新しいサイトマップを追加:
   https://www.kohta-tech-blog.com/sitemap.xml
```

### 3. 確認
```bash
# サイトマップの内容を確認
curl https://www.kohta-tech-blog.com/sitemap.xml | head -50

# 期待される出力（修正後）:
<loc>https://www.kohta-tech-blog.com/ja</loc>
<loc>https://www.kohta-tech-blog.com/ja/blog</loc>
```

## 📊 期待される結果

- ✅ 56個の「許可されていないURL」エラーが解消
- ✅ 全ページが正常にインデックス登録される
- ✅ Google Search Consoleで緑色の成功表示

## 🔍 今後の注意点

### URL正規化のベストプラクティス

```typescript
// ✅ Good: 常に末尾のスラッシュを削除
const url = process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

// ❌ Bad: そのまま使用
const url = process.env.NEXT_PUBLIC_SITE_URL;
```

### wwwサブドメインの統一

どちらかに統一する:
- **www あり**: `https://www.example.com` （推奨：より正式）
- **www なし**: `https://example.com` （シンプル）

**重要**: 選んだ方をすべての場所で統一する
- 環境変数
- Google Search Console
- DNS設定
- リダイレクト設定

### リダイレクトの確認

```bash
# wwwなし → wwwありへのリダイレクトを確認
curl -I https://kohta-tech-blog.com

# 期待される出力:
HTTP/2 301
Location: https://www.kohta-tech-blog.com
```

## 📚 参考リンク

- [Google サイトマップのトラブルシューティング](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Next.js サイトマップ生成](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [URL正規化のベストプラクティス](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

---

**修正日**: 2026年2月10日
**担当者**: AI Assistant
**ステータス**: ✅ 修正完了（デプロイ待ち）
