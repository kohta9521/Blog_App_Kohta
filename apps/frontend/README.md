# 🌐 Frontend - Next.js 16 Tech Blog

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**モダンなNext.js 16 App Routerを使用したテックブログのフロントエンドアプリケーション**

</div>

---

## 🏗️ アーキテクチャ概要

### 📁 ディレクトリ構造

```
apps/frontend/
├── 📱 app/                    # Next.js 16 App Router
│   ├── 🎨 globals.css         # グローバルスタイル
│   ├── 🏗️ layout.tsx          # ルートレイアウト
│   ├── 📄 page.tsx            # ホームページ
│   └── 🖼️ favicon.ico         # ファビコン
├── 🖼️ public/                 # 静的アセット
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── 🎨 styles/                 # 追加スタイル（予定）
├── ⚙️ next.config.ts          # Next.js設定
├── 🎨 postcss.config.mjs      # PostCSS設定
├── 📋 package.json            # 依存関係
├── 📄 tsconfig.json           # TypeScript設定
└── 🧹 eslint.config.mjs       # ESLint設定
```

---

## 🛠️ 技術スタック

<table>
<tr>
<th>🏗️ Framework</th>
<th>🎨 Styling</th>
<th>🔧 Development</th>
</tr>
<tr>
<td>

**Next.js 16.1.1**
- App Router 構成
- Server Components
- Client Components
- Built-in Optimization

**React 19.2.3**
- 最新のReact機能
- Concurrent Features
- Automatic Batching

</td>
<td>

**Tailwind CSS 4.x**
- ユーティリティファースト
- JIT (Just-In-Time)
- カスタムデザインシステム

**PostCSS**
- CSS処理パイプライン
- 自動プレフィックス
- 最適化

</td>
<td>

**TypeScript 5.x**
- 型安全性
- 最新のTS機能
- 厳密な型チェック

**ESLint**
- コード品質管理
- Next.js推奨設定
- 自動修正

</td>
</tr>
</table>

---

## 🚀 開発環境セットアップ

### 1. 依存関係のインストール

```bash
# プロジェクトルートから
cd apps/frontend

# 依存関係インストール
npm install
```

### 2. 開発サーバーの起動

```bash
# 開発サーバー起動 (http://localhost:3000)
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm run start

# Lintチェック
npm run lint
```

### 3. 環境変数設定（予定）

```bash
# .env.local ファイルを作成
cp .env.example .env.local

# 必要な環境変数を設定
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🎨 デザインシステム

### Tailwind CSS 4.x の活用

```tsx
// 例: ボタンコンポーネント
export const Button = ({ children, variant = 'primary' }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors'
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300'
  }
  
  return (
    <button className={`${baseClasses} ${variants[variant]}`}>
      {children}
    </button>
  )
}
```

### カスタムCSS変数

```css
/* globals.css */
:root {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --spacing-unit: 0.25rem;
  --border-radius: 0.5rem;
}
```

---

## 📱 App Router 設計

### ルート構成（予定）

```
app/
├── layout.tsx              # ルートレイアウト
├── page.tsx                # ホームページ
├── (blog)/                 # ブログ機能グループ
│   ├── layout.tsx          # ブログレイアウト
│   ├── page.tsx            # 記事一覧
│   └── [slug]/
│       └── page.tsx        # 記事詳細
├── about/
│   └── page.tsx            # About ページ
└── api/                    # API Routes（必要に応じて）
    └── health/
        └── route.ts        # ヘルスチェック
```

### Server Components vs Client Components

```tsx
// Server Component (デフォルト)
export default async function BlogPage() {
  const posts = await fetchPosts() // サーバーサイドで実行
  
  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

// Client Component
'use client'
export function InteractiveButton() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  )
}
```

---

## 🔗 API連携

### Rust バックエンドとの通信

```tsx
// lib/api-client.ts (予定)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function fetchPosts() {
  const response = await fetch(`${API_BASE_URL}/api/posts`)
  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }
  return response.json()
}

export async function fetchPost(slug: string) {
  const response = await fetch(`${API_BASE_URL}/api/posts/${slug}`)
  if (!response.ok) {
    throw new Error('Failed to fetch post')
  }
  return response.json()
}
```

---

## 🧪 テスト戦略（予定）

### テストツール

- **Jest**: ユニットテスト
- **React Testing Library**: コンポーネントテスト
- **Playwright**: E2Eテスト

```bash
# テスト実行
npm run test

# E2Eテスト
npm run test:e2e

# テストカバレッジ
npm run test:coverage
```

---

## 📦 ビルド & デプロイ

### Docker対応

```dockerfile
# Dockerfile (予定)
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### AWS デプロイ

- **ECS Fargate**: コンテナベースデプロイ
- **CloudFront**: CDN配信
- **S3**: 静的アセット配信

---

## 🔧 設定ファイル詳細

### Next.js 設定

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 実験的機能
  experimental: {
    // 必要に応じて追加
  },
  
  // 画像最適化
  images: {
    domains: ['localhost'],
  },
  
  // 環境変数
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

export default nextConfig
```

### TypeScript 設定

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 🚀 今後の開発予定

- [ ] **ブログ機能**: 記事一覧・詳細ページ
- [ ] **Markdown対応**: MDX による記事作成
- [ ] **検索機能**: 記事検索・フィルタリング
- [ ] **SEO最適化**: メタタグ・構造化データ
- [ ] **パフォーマンス最適化**: 画像最適化・コード分割
- [ ] **アクセシビリティ**: WCAG準拠
- [ ] **PWA対応**: オフライン機能
- [ ] **国際化**: 多言語対応（i18n）

---

<div align="center">

**🌐 このフロントエンドアプリケーションは、モダンなNext.js 16の機能を活用し、**  
**高性能で保守性の高いテックブログを目指しています。**

[![Next.js](https://img.shields.io/badge/Powered%20by-Next.js-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Vercel](https://img.shields.io/badge/Deploy%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)

</div>