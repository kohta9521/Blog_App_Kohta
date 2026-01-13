# 多言語対応 (i18n) セットアップガイド

## 概要

このプロジェクトは、Next.js App Routerを使用した日本語・英語の多言語対応ブログです。

## ディレクトリ構造

```
app/
  [lang]/              # 言語パラメータ
    layout.tsx         # 言語別レイアウト（メタデータ含む）
    page.tsx           # トップページ
    about/
    blog/
    contact/
middleware.ts          # 言語リダイレクト処理
lib/
  i18n/
    config.ts          # i18n設定
    dictionaries.ts    # 辞書読み込み
    dictionaries/
      ja.json          # 日本語辞書
      en.json          # 英語辞書
  api-client/
    base.ts            # APIクライアントベース
    blog.ts            # ブログAPI
```

## 主要機能

### 1. 言語切り替え

- デフォルト言語: 日本語 (ja)
- 対応言語: 日本語 (ja), 英語 (en)
- URL形式: `/ja/...`, `/en/...`
- ヘッダーに言語スイッチャーを配置

### 2. 自動リダイレクト

`middleware.ts`により、言語プレフィックスのないURLは自動的にデフォルト言語にリダイレクトされます。

例: `/` → `/ja/`

### 3. メタデータの多言語対応

各言語ごとにメタデータ（title, description, keywords, OpenGraph）を自動設定。

### 4. API連携の準備

- `Accept-Language`ヘッダーを自動付与
- Rust製バックエンドAPIとの連携を想定した設計
- 型安全なAPIクライアント

## 使い方

### ページコンポーネント

```tsx
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <div>{dict.common.home}</div>;
}
```

### 辞書の追加

`lib/i18n/dictionaries/ja.json` と `en.json` に翻訳を追加：

```json
{
  "common": {
    "newKey": "新しいテキスト"
  }
}
```

### APIクライアントの使用

```tsx
import { createBlogApiClient } from "@/lib/api-client";

const blogApi = createBlogApiClient(lang);
const posts = await blogApi.getPosts();
```

## バックエンドAPI仕様

### 推奨ヘッダー

```
Accept-Language: ja
```

### レスポンス例

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

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 今後の拡張

- [ ] 言語ごとのブログ記事一覧
- [ ] 検索の多言語対応
- [ ] カテゴリの多言語対応
- [ ] RustバックエンドAPIの実装

