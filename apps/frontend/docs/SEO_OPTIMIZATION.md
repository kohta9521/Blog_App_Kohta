# 🚀 SEO & LLM最適化ガイド

このドキュメントでは、検索エンジンとLLM（ChatGPT、Claude、Perplexityなど）に対するSEO最適化について説明します。

## 📋 実装済みの最適化

### 1. **セキュリティヘッダー**

`next.config.ts`で以下のヘッダーを設定:

```typescript
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security: HSTS有効化
- Content-Security-Policy: XSS対策
- Referrer-Policy: origin-when-cross-origin
- Permissions-Policy: 不要な機能を無効化
```

**効果:**
- セキュリティスコア向上
- Googleのランキングシグナルに好影響
- LLMクローラーからの信頼性向上

### 2. **robots.txt最適化**

LLMクローラーを明示的に許可:

```typescript
// 対応済みLLMクローラー
- GPTBot (ChatGPT)
- ChatGPT-User (ChatGPT Browse)
- Google-Extended (Bard/Gemini)
- anthropic-ai (Claude)
- Claude-Web (Claude Browse)
- PerplexityBot (Perplexity)
- Amazonbot (Amazon AI)
- FacebookBot (Meta AI)
```

**効果:**
- LLMがコンテンツを学習・引用できる
- AI検索結果に表示される可能性向上
- トラフィック増加

### 3. **構造化データ（JSON-LD）**

Schema.org形式の構造化データを実装:

#### Organization（サイト全体）
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "サイト名",
  "logo": "ロゴURL",
  "description": "説明"
}
```

#### WebSite（検索ボックス付き）
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "potentialAction": {
    "@type": "SearchAction"
  }
}
```

#### TechArticle（技術記事）
```json
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "記事タイトル",
  "author": { "@type": "Person" },
  "datePublished": "公開日",
  "keywords": "キーワード"
}
```

#### BreadcrumbList（パンくずリスト）
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [...]
}
```

**効果:**
- Googleリッチリザルト表示
- LLMがコンテンツ構造を理解しやすい
- クリック率（CTR）向上

### 4. **メタデータ最適化**

各ページで充実したメタデータを設定:

```typescript
{
  title: { default, template },
  description: "詳細な説明",
  keywords: "関連キーワード",
  authors: [{ name, url }],
  openGraph: { ... },
  twitter: { ... },
  alternates: { canonical, languages },
  robots: { index, follow, googleBot }
}
```

**効果:**
- SNSシェア時の見栄えが良い
- 検索結果での表示が改善
- 多言語対応の明示

### 5. **サイトマップ最適化**

動的にサイトマップを生成:

```typescript
- 静的ページ（Home, About, Contact）
- ブログ記事（全記事）
- Book記事（全記事 + 個別記事）
- 1時間ごとに再生成（ISR）
```

**効果:**
- クローラーが全ページを発見
- インデックス速度向上
- 更新頻度を検索エンジンに通知

### 6. **On-Demand Revalidation**

microCMS Webhookで即座にキャッシュクリア:

```typescript
POST /api/revalidate?secret=XXX
```

**効果:**
- 新規記事が即座にインデックス
- フレッシュコンテンツとして評価
- LLMの学習データに早期反映

---

## 🔍 LLM最適化のベストプラクティス

### 1. **明確な構造**

```markdown
✅ Good:
# タイトル
## セクション1
### サブセクション

❌ Bad:
タイトル
セクション1
サブセクション
```

### 2. **メタ情報の充実**

```typescript
✅ Good:
- title: 具体的で説明的
- description: 120-160文字、キーワード含む
- keywords: 関連性の高いキーワード5-10個

❌ Bad:
- title: "記事"
- description: ""
- keywords: ""
```

### 3. **セマンティックHTML**

```html
✅ Good:
<article>
  <header><h1>タイトル</h1></header>
  <section><h2>セクション</h2></section>
  <footer>著者情報</footer>
</article>

❌ Bad:
<div class="article">
  <div class="title">タイトル</div>
  <div class="section">セクション</div>
</div>
```

### 4. **内部リンク**

```markdown
✅ Good:
[関連記事: Next.jsのISR](https://example.com/nextjs-isr)

❌ Bad:
[こちら](https://example.com/abc123)
```

### 5. **画像の最適化**

```html
✅ Good:
<img 
  src="image.webp" 
  alt="具体的な説明文" 
  width="1200" 
  height="630"
  loading="lazy"
/>

❌ Bad:
<img src="img.png" />
```

---

## 📊 効果測定

### Google Search Console
1. インデックスカバレッジ
2. 検索パフォーマンス
3. Core Web Vitals
4. モバイルユーザビリティ

### LLM効果測定
1. ChatGPTでサイト検索: `site:kohta-tech-blog.com`
2. Perplexityでの引用回数
3. リファラーログの確認

### 主要指標
- **オーガニック検索流入**: +50%目標
- **ページ速度スコア**: 90+目標
- **インデックス率**: 95%+目標
- **LLM引用回数**: 測定開始

---

## 🛠️ 追加で実装すべき項目

### 優先度: 高
- [ ] Google Search Console認証
- [ ] Bing Webmaster Tools認証
- [ ] 構造化データテスト（Google Rich Results Test）
- [ ] XMLサイトマップのGSC登録
- [ ] 404ページの改善

### 優先度: 中
- [ ] FAQ構造化データ
- [ ] HowTo構造化データ（チュートリアル記事）
- [ ] 内部リンク戦略
- [ ] 画像のalt属性最適化
- [ ] OGP画像の自動生成

### 優先度: 低
- [ ] AMP対応（必要に応じて）
- [ ] RSS/Atom フィード
- [ ] コンテンツの定期更新
- [ ] 外部リンク戦略

---

## 🚀 デプロイ後のチェックリスト

### 1. 構造化データの検証
```bash
# Googleツール
https://search.google.com/test/rich-results

# Schema.orgバリデーター
https://validator.schema.org/
```

### 2. robots.txtの確認
```bash
https://kohta-tech-blog.com/robots.txt
```

### 3. サイトマップの確認
```bash
https://kohta-tech-blog.com/sitemap.xml
```

### 4. セキュリティヘッダーの確認
```bash
https://securityheaders.com/
```

### 5. ページ速度の確認
```bash
https://pagespeed.web.dev/
```

---

## 📚 参考リンク

### 公式ドキュメント
- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
- [Next.js SEO](https://nextjs.org/learn/seo/introduction-to-seo)

### LLMクローラー情報
- [OpenAI GPTBot](https://platform.openai.com/docs/gptbot)
- [Google Extended](https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers)
- [Anthropic Claude](https://www.anthropic.com/index/claude-web-crawler)

### SEOツール
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [Ahrefs](https://ahrefs.com/)
- [SEMrush](https://www.semrush.com/)

---

**最終更新**: 2026年2月9日
**次回レビュー**: 2026年3月9日
