# 多言語対応 (i18n) 移行完了レポート

## 実施内容

### ✅ 完了したタスク

1. **i18n設定とディクショナリの作成**
   - `lib/i18n/config.ts` - i18n設定（デフォルト言語: ja）
   - `lib/i18n/dictionaries.ts` - 辞書読み込みロジック
   - `lib/i18n/dictionaries/ja.json` - 日本語辞書
   - `lib/i18n/dictionaries/en.json` - 英語辞書
   - `lib/i18n/types.ts` - TypeScript型定義

2. **[lang]パスベースのルーティング構造**
   - `middleware.ts` - 自動リダイレクト処理
   - `app/[lang]/layout.tsx` - 多言語対応レイアウト
   - `app/[lang]/page.tsx` - トップページ
   - `app/[lang]/about/page.tsx` - Aboutページ
   - `app/[lang]/blog/page.tsx` - ブログ一覧ページ
   - `app/[lang]/contact/page.tsx` - お問い合わせページ

3. **言語スイッチャーコンポーネント**
   - `components/ui/Switcher/LanguageSwitcher.tsx`
   - ヘッダーに統合済み

4. **メタデータの多言語対応**
   - 各言語ごとのtitle, description, keywords
   - OpenGraphタグの対応

5. **既存コンポーネントの多言語対応**
   - `components/layout/Header/Header.tsx` - ナビゲーション
   - `components/layout/Hero/Hero.tsx` - ヒーローセクション

6. **APIクライアントの多言語対応**
   - `lib/api-client/base.ts` - Accept-Languageヘッダー自動付与
   - `lib/api-client/blog.ts` - ブログAPI型定義
   - Rustバックエンド連携を想定した設計

### 🗑️ 削除したファイル

- `app/layout.tsx` → `app/[lang]/layout.tsx`に移行
- `app/page.tsx` → `app/[lang]/page.tsx`に移行
- `app/(blog)/` → `app/[lang]/blog/`に移行
- `app/(subpage)/` → `app/[lang]/about/`, `app/[lang]/contact/`に移行
- `app/api/placeholder/[...params]/route.ts` - 不要なプレースホルダーAPI

## URL構造の変更

### Before
```
/                  # トップページ
/about             # Aboutページ
/blog              # ブログ一覧
/contact           # お問い合わせ
```

### After
```
/                  # → /ja/ にリダイレクト
/ja/               # 日本語トップページ
/ja/about          # 日本語Aboutページ
/ja/blog           # 日本語ブログ一覧
/ja/contact        # 日本語お問い合わせ

/en/               # 英語トップページ
/en/about          # 英語Aboutページ
/en/blog           # 英語ブログ一覧
/en/contact        # 英語お問い合わせ
```

## 開発者向けガイド

### 新しいページの追加方法

```tsx
// app/[lang]/new-page/page.tsx
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function NewPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <div>{dict.common.home}</div>;
}
```

### 翻訳の追加方法

1. `lib/i18n/dictionaries/ja.json` に日本語を追加
2. `lib/i18n/dictionaries/en.json` に英語を追加
3. `lib/i18n/types.ts` の型定義を更新

### APIクライアントの使用方法

```tsx
import { createBlogApiClient } from "@/lib/api-client";

const blogApi = createBlogApiClient(lang);
const posts = await blogApi.getPosts();
```

## バックエンドAPI要件

### リクエストヘッダー
```
Accept-Language: ja
```

### 推奨レスポンス形式
```json
{
  "posts": [
    {
      "id": "1",
      "title": "タイトル",
      "content": "本文",
      "locale": "ja"
    }
  ]
}
```

## 環境変数

`.env.local` を作成：
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 次のステップ

開発サーバーを再起動してください：

```bash
npm run dev
```

アクセス:
- 日本語: http://localhost:3000/ja
- 英語: http://localhost:3000/en

## トラブルシューティング

### ビルドエラーが出る場合
```bash
rm -rf .next
npm run dev
```

### 型エラーが出る場合
```bash
npm run build
```

## 参考資料

- 詳細ドキュメント: `docs/i18n-setup.md`
- Next.js App Router i18n: https://nextjs.org/docs/app/building-your-application/routing/internationalization

