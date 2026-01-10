# 🦀 Rust × Next.js Tech Blog Monorepo

<div align="center">

![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Rust をバックエンド、Next.js 16（TypeScript）をフロントエンドに使って構築するテックブログ用モノレポです。**

</div>

---

## 🎯 プロジェクトの目的

このプロジェクトの目的は、**Rust 公式ドキュメントを「超初心者向けに自分の言葉で解説するテックブログ」** を作りながら、フルスタックな構成・設計も学ぶことです。

Supabase をデータベースとして利用し、Tailwind CSS / Jest / 基本的なセキュリティプラクティスを取り入れます。

## 🏗️ 全体構成

```
blog/
├── apps/
│   ├── frontend/      # Next.js 16 + TypeScript + Tailwind CSS + Jest
│   └── backend/       # Rust API（Axum or Actix など）+ Supabase 連携
└── packages/
    ├── ui/            # フロントエンド共通UIコンポーネント
    ├── utils/         # フロント用ユーティリティ（TS）
    └── schema/        # APIレスポンスなどの型・スキーマ（TS）
```

### 📱 apps

実際に動くアプリケーションを配置します。

- **frontend**: 読者と直接触れる Next.js アプリ
- **backend**: ブログ記事やユーザーデータを扱う Rust 製 API サーバ

### 📦 packages

複数アプリから利用する共通モジュールを配置します。

UI コンポーネント、ユーティリティ関数、Zod スキーマなどを想定しています。

この構成により、フロントエンド・バックエンド・共通ライブラリの責務をはっきり分けつつ、1 リポジトリで一括管理できるモノレポ構成を目指します。

---

## 🌐 apps/frontend（Next.js 16 + TypeScript + Tailwind CSS + Jest）

```
apps/frontend/
├── app/
│   └── (blog)/
│       ├── layout.tsx        # ブログ用レイアウト
│       ├── page.tsx          # 記事一覧
│       └── [slug]/
│           └── page.tsx      # 記事詳細
├── components/
│   ├── layout/
│   └── blog/
├── lib/
│   ├── supabase/             # Supabase クライアント初期化
│   ├── api-client/           # Rust バックエンド向け API クライアント
│   └── auth/                 # 認証・セッション系（必要になったら）
├── tests/
│   ├── unit/
│   └── e2e/
├── public/
├── styles/
│   └── globals.css           # Tailwind のエントリ
├── tailwind.config.ts
├── postcss.config.mjs
├── jest.config.ts
├── next.config.mjs
├── package.json
└── tsconfig.json
```

### 🎨 役割

- **App Router 構成**: `app/(blog)/` 以下にブログ機能をまとめることで、URL はシンプルに保ちつつ、機能単位でコードを整理
- **Tailwind CSS**: `styles/globals.css` に Tailwind のエントリを置き、ユーティリティクラスベースでデザインを構築
- **Supabase 連携**: `lib/supabase` にブラウザ用・サーバー用クライアント初期化をまとめ、認証情報や環境変数の扱いを一箇所に集約
- **API クライアント**: `lib/api-client` に Rust バックエンド向けの fetch ラッパを用意し、「フロントは HTTP API を通してのみドメインにアクセスする」という境界を作成
- **テスト（Jest）**: UI コンポーネントやユーティリティ関数用のユニットテストを `tests/unit` や `*.test.tsx` に配置

---

## ⚡ apps/backend（Rust API + Supabase + Security）

```
apps/backend/
├── src/
│   ├── main.rs
│   ├── api/
│   │   ├── mod.rs
│   │   ├── posts.rs          # /posts, /posts/{id} など
│   │   └── health.rs         # /health
│   ├── domain/
│   │   ├── mod.rs
│   │   └── post.rs           # Post エンティティ & ドメインロジック
│   ├── infrastructure/
│   │   ├── mod.rs
│   │   └── supabase.rs       # Supabase(Postgres) とのやりとり
│   └── security/
│       ├── mod.rs
│       ├── headers.rs        # セキュリティヘッダ付与など
│       └── auth.rs           # 認証/トークン検証（必要に応じて）
└── Cargo.toml
```

### 🔧 役割

- **api レイヤ**: HTTP リクエスト/レスポンス、ルーティング、エラーハンドリングを担当。`/posts` や `/health` などのエンドポイントをここに定義
- **domain レイヤ**: ブログ記事（Post）などのエンティティとビジネスロジックを定義。HTTP や DB には依存せず、「アプリケーションが解きたい問題」を表現する層
- **infrastructure レイヤ**: Supabase（Postgres）や外部サービスとの実際の通信を担当。パラメータバインドされたクエリやエラー処理をまとめて実装し、SQL Injection 対策などもここで実行
- **security レイヤ**: セキュリティ関連の共通処理を集約
  - `headers.rs`: CSP, HSTS, X-Frame-Options などのセキュリティヘッダを付与
  - `auth.rs`: 認証トークン検証、セッション cookie 処理など（必要に応じて追加）

この分割により、HTTP・ドメイン・インフラ・セキュリティがそれぞれの責務に集中した構成を目指します。

---

## 📚 packages（共通ライブラリ）

```
packages/
├── ui/
│   ├── src/
│   │   └── components/
│   │       ├── Button.tsx
│   │       ├── Badge.tsx
│   │       ├── CodeBlock.tsx
│   │       └── Layout.tsx
│   ├── package.json
│   └── tsconfig.json
├── utils/
│   ├── src/
│   │   ├── date.ts           # 日付整形（API からの文字列 → 表示用）
│   │   ├── slug.ts           # slug 生成
│   │   └── markdown.ts       # MD/MDX 関連処理
│   ├── package.json
│   └── tsconfig.json
└── schema/
    ├── src/
    │   ├── post.ts           # Post 用の型/Zodスキーマ
    │   └── index.ts
    ├── package.json
    └── tsconfig.json
```

### 🛠️ 役割

- **ui**: ブログ全体で使う共通 UI を React コンポーネントとしてまとめます。Next.js 側から `@blog/ui` のようにインポートして利用する想定
- **utils**: 日付フォーマット、slug 生成、Markdown/MDX ヘルパーなど、フロントエンドで使う純粋なユーティリティをまとめます
- **schema**: API レスポンスなどの「データの形」を TypeScript 型や Zod スキーマとして定義します。Rust 側とは言語が違うためソースコードの共有はしませんが、共通の仕様（契約）としてここにまとめる方針

---

## 🚀 今後やりたいこと（メモ）

- [ ] Next.js 16 + Tailwind CSS のセットアップ
- [ ] Rust バックエンドの最小構成（/health だけ返す API）
- [ ] /posts API と、それを叩くフロントの一覧ページ
- [ ] Supabase スキーマ設計（posts テーブルなど）
- [ ] 認証が必要になったら Supabase Auth or 独自トークン方式を検討
- [ ] 各レイヤ構成（api / domain / infrastructure / security / packages/ui / packages/schema）について、「なぜこう分けたか」をブログ記事として残す

---

<div align="center">

**この README はプロジェクトの全体像とディレクトリ構成の意図を整理するためのものです。**  
**実装を進めながら、必要に応じて随時アップデートしていきます。**

</div>
