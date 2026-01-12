# 🚀 モノレポセットアップ手順

## 完成した構成

packages/ui に shadcn/ui コンポーネントとCSS変数を実装し、frontend で使用できるモノレポ構成が完成しました！

## 📁 実装された構造

```
blog/
├── package.json                    # ワークスペース設定
├── packages/
│   └── ui/
│       ├── package.json           # @blog/ui パッケージ
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts           # エクスポート設定
│           ├── lib/
│           │   └── utils.ts       # cn() ユーティリティ
│           ├── styles/
│           │   └── globals.css    # CSS変数 + Tailwind
│           └── components/
│               ├── ui/            # shadcn/ui コンポーネント
│               │   ├── button.tsx
│               │   ├── card.tsx
│               │   └── badge.tsx
│               └── custom/        # カスタムコンポーネント
│                   ├── hero-section.tsx
│                   └── content-card.tsx
└── apps/
    └── frontend/
        ├── package.json           # @blog/ui を依存関係に追加
        ├── next.config.ts         # transpilePackages 設定
        ├── tailwind.config.ts     # packages/ui を含むよう設定
        ├── tsconfig.json          # パス解決設定
        └── app/
            ├── globals.css        # @blog/ui/styles をインポート
            └── page.tsx           # 実装されたサンプルページ

```

## 🛠️ セットアップ手順

### 1. 依存関係のインストール

```bash
# ルートディレクトリで実行
npm install

# または個別にインストール
cd packages/ui && npm install
cd ../../apps/frontend && npm install
```

### 2. 開発サーバーの起動

```bash
# ルートから（推奨）
npm run dev

# または個別に
cd apps/frontend && npm run dev
```

## 🎨 実装されたコンポーネント

### shadcn/ui コンポーネント
- `Button` - 複数バリアント対応のボタン
- `Card` - カード系コンポーネント一式
- `Badge` - バッジコンポーネント

### カスタムコンポーネント
- `HeroSection` - ヒーローセクション
- `ContentCard` - コンテンツカード

### CSS変数
- カラーシステム（ライト/ダークモード対応）
- スペーシングシステム
- タイポグラフィ
- シャドウシステム

## 📝 使用例

```tsx
import { Button, Card, Badge, HeroSection, ContentCard } from "@blog/ui"

export default function Page() {
  return (
    <div>
      <HeroSection 
        title="My Title"
        description="My Description"
        badges={["React", "TypeScript"]}
      />
      
      <ContentCard 
        title="Card Title"
        content="Card content..."
      />
      
      <Button variant="primary">Click me</Button>
      <Badge variant="secondary">New</Badge>
    </div>
  )
}
```

## 🔧 カスタマイズ

### CSS変数の変更
`packages/ui/src/styles/globals.css` でデザイントークンを変更できます。

### 新しいコンポーネントの追加
1. `packages/ui/src/components/` に追加
2. `packages/ui/src/index.ts` でエクスポート
3. frontend で使用

## 🚀 本番ビルド

```bash
npm run build:all
```

## ✅ 動作確認

1. `npm run dev` でサーバー起動
2. http://localhost:3000 にアクセス
3. 美しいデザインシステムが適用されたページが表示される

## 🎯 完成したページの特徴

- **ヒーローセクション**: グラデーションタイトル、バッジ、CTAボタン
- **コンテンツセクション**: 3カラムのカードレイアウト
- **CTAセクション**: 複数ボタンとバッジ表示
- **レスポンシブ対応**: モバイル〜デスクトップ
- **ダークモード対応**: CSS変数による自動切り替え

これで完璧なモノレポ + デザインシステムが完成しました！🎉
