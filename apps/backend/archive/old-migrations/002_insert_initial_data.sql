-- ================================================
-- Migration 002: 初期データの投入
-- ================================================
-- 開発・テスト用の初期データ
-- 作成日: 2026-01-14
-- ================================================

-- ================================================
-- 1. 初期ユーザー（管理者）
-- ================================================
INSERT INTO users (email, name, display_name, role, bio_ja, bio_en) VALUES
('admin@example.com', 'Admin User', 'Kohta', 'admin', 
 'テックブログの管理者です。Rust, React, Next.jsなどの技術に興味があります。', 
 'Administrator of this tech blog. Interested in Rust, React, Next.js and more.'),
('author@example.com', 'Tech Writer', 'Tech Writer', 'author',
 '技術記事を執筆しています。', 
 'Writing technical articles.');

-- ================================================
-- 2. カテゴリ
-- ================================================
INSERT INTO categories (slug, name_ja, name_en, description_ja, description_en, color, icon, display_order) VALUES
('technology', '技術', 'Technology', 
 '技術的な話題や解説', 'Technical topics and explanations',
 '#3B82F6', '💻', 1),
('tutorial', 'チュートリアル', 'Tutorial',
 '実践的なチュートリアル', 'Practical tutorials',
 '#10B981', '📚', 2),
('opinion', '考察・意見', 'Opinion',
 '技術についての考察や意見', 'Thoughts and opinions on technology',
 '#F59E0B', '💭', 3),
('news', 'ニュース', 'News',
 '技術ニュースやトレンド', 'Tech news and trends',
 '#EF4444', '📰', 4),
('career', 'キャリア', 'Career',
 'キャリア開発やスキルアップ', 'Career development and skill building',
 '#8B5CF6', '🚀', 5);

-- ================================================
-- 3. タグ
-- ================================================
INSERT INTO tags (slug, name_ja, name_en, color) VALUES
('rust', 'Rust', 'Rust', '#CE422B'),
('react', 'React', 'React', '#61DAFB'),
('nextjs', 'Next.js', 'Next.js', '#000000'),
('typescript', 'TypeScript', 'TypeScript', '#3178C6'),
('javascript', 'JavaScript', 'JavaScript', '#F7DF1E'),
('docker', 'Docker', 'Docker', '#2496ED'),
('postgresql', 'PostgreSQL', 'PostgreSQL', '#336791'),
('aws', 'AWS', 'AWS', '#FF9900'),
('webdev', 'Web開発', 'Web Development', '#047857'),
('backend', 'バックエンド', 'Backend', '#059669'),
('frontend', 'フロントエンド', 'Frontend', '#06B6D4'),
('devops', 'DevOps', 'DevOps', '#0891B2'),
('api', 'API', 'API', '#7C3AED'),
('database', 'データベース', 'Database', '#6366F1'),
('performance', 'パフォーマンス', 'Performance', '#EC4899');

-- ================================================
-- 4. サンプル記事
-- ================================================
INSERT INTO posts (
    slug, 
    title_ja, title_en,
    content_ja, content_en,
    excerpt_ja, excerpt_en,
    seo_title_ja, seo_title_en,
    seo_description_ja, seo_description_en,
    category_id, author_id,
    status, published, published_at,
    reading_time_ja, reading_time_en
) VALUES
(
    'getting-started-with-rust',
    'Rustを始めよう - モダンなシステムプログラミング言語', 
    'Getting Started with Rust - Modern Systems Programming Language',
    
    '# Rustを始めよう

## Rustとは

Rustは、パフォーマンス、信頼性、生産性を重視したシステムプログラミング言語です。

## 主な特徴

- **メモリ安全性**: ガベージコレクションなしでメモリ安全を保証
- **並行処理**: データ競合を防ぐ所有権システム
- **ゼロコスト抽象化**: 高レベルの抽象化でも低レベルと同じ性能

## インストール

```bash
curl --proto ''=https'' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

## Hello World

```rust
fn main() {
    println!("Hello, world!");
}
```

Rustでの開発を楽しんでください！',
    
    '# Getting Started with Rust

## What is Rust

Rust is a systems programming language focused on performance, reliability, and productivity.

## Key Features

- **Memory Safety**: Guarantees memory safety without garbage collection
- **Concurrency**: Ownership system prevents data races
- **Zero-Cost Abstractions**: High-level abstractions with low-level performance

## Installation

```bash
curl --proto ''=https'' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

## Hello World

```rust
fn main() {
    println!("Hello, world!");
}
```

Enjoy developing with Rust!',
    
    'Rustの基本的な特徴とインストール方法を紹介します。メモリ安全性と高パフォーマンスを両立するモダンな言語です。',
    'An introduction to Rust''s basic features and installation. A modern language that combines memory safety with high performance.',
    
    'Rustを始めよう - 入門ガイド',
    'Getting Started with Rust - Beginner''s Guide',
    
    'Rustの基本的な特徴、インストール方法、Hello Worldプログラムの書き方を解説します。',
    'Learn Rust''s basic features, installation process, and how to write your first Hello World program.',
    
    1, -- Technology category
    1, -- Admin user
    'published',
    true,
    NOW() - INTERVAL '7 days',
    5, -- 5分
    5
),
(
    'next-js-app-router-tutorial',
    'Next.js App Routerの完全ガイド',
    'Complete Guide to Next.js App Router',
    
    '# Next.js App Routerの完全ガイド

## App Routerとは

Next.js 13で導入された新しいルーティングシステムです。

## 主な特徴

- **サーバーコンポーネント**: デフォルトでサーバーサイドレンダリング
- **レイアウト**: 再利用可能なレイアウトコンポーネント
- **ストリーミング**: 段階的なページレンダリング

## 基本的な使い方

```tsx
// app/page.tsx
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

Next.jsで最高のWebアプリを作りましょう！',
    
    '# Complete Guide to Next.js App Router

## What is App Router

A new routing system introduced in Next.js 13.

## Key Features

- **Server Components**: Server-side rendering by default
- **Layouts**: Reusable layout components
- **Streaming**: Progressive page rendering

## Basic Usage

```tsx
// app/page.tsx
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

Build amazing web apps with Next.js!',
    
    'Next.js 13で導入されたApp Routerの使い方を詳しく解説します。',
    'A detailed explanation of the App Router introduced in Next.js 13.',
    
    'Next.js App Router完全ガイド',
    'Next.js App Router Complete Guide',
    
    'Next.js 13の新しいApp Routerの特徴と使い方を分かりやすく解説します。',
    'Easy-to-understand explanation of Next.js 13''s new App Router features and usage.',
    
    2, -- Tutorial category
    1, -- Admin user
    'published',
    true,
    NOW() - INTERVAL '3 days',
    8,
    8
),
(
    'docker-compose-development-setup',
    'Docker Composeで開発環境を構築する',
    'Setting up Development Environment with Docker Compose',
    
    '# Docker Composeで開発環境を構築する

## はじめに

Docker Composeを使うと、複数のコンテナを簡単に管理できます。

## docker-compose.yml

```yaml
version: ''3.8''
services:
  app:
    build: .
    ports:
      - "3000:3000"
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: password
```

## 起動方法

```bash
docker-compose up -d
```

開発環境の構築が簡単になります！',
    
    '# Setting up Development Environment with Docker Compose

## Introduction

Docker Compose makes it easy to manage multiple containers.

## docker-compose.yml

```yaml
version: ''3.8''
services:
  app:
    build: .
    ports:
      - "3000:3000"
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: password
```

## Starting

```bash
docker-compose up -d
```

Simplify your development environment setup!',
    
    'Docker Composeを使った開発環境の構築方法を解説します。',
    'Learn how to set up a development environment using Docker Compose.',
    
    'Docker Composeで開発環境構築',
    'Development Setup with Docker Compose',
    
    'Docker Composeを使って簡単に開発環境を構築する方法を紹介します。',
    'Learn how to easily set up a development environment using Docker Compose.',
    
    2, -- Tutorial category
    2, -- Author user
    'published',
    true,
    NOW() - INTERVAL '1 day',
    6,
    6
);

-- ================================================
-- 5. 記事とタグの関連付け
-- ================================================
-- Rust記事にタグを付ける
INSERT INTO post_tags (post_id, tag_id) VALUES
(1, 1), -- Rust
(1, 10); -- Backend

-- Next.js記事にタグを付ける
INSERT INTO post_tags (post_id, tag_id) VALUES
(2, 3), -- Next.js
(2, 2), -- React
(2, 4), -- TypeScript
(2, 11); -- Frontend

-- Docker記事にタグを付ける
INSERT INTO post_tags (post_id, tag_id) VALUES
(3, 6), -- Docker
(3, 12), -- DevOps
(3, 9); -- WebDev

-- ================================================
-- 6. 記事間の関連を設定
-- ================================================
-- Rust記事の次の記事をNext.js記事に設定
INSERT INTO post_relations (source_post_id, target_post_id, relation_type, display_order) VALUES
(1, 2, 'next', 1);

-- Next.js記事の前の記事をRust記事に設定
INSERT INTO post_relations (source_post_id, target_post_id, relation_type, display_order) VALUES
(2, 1, 'previous', 1);

-- Next.js記事の次の記事をDocker記事に設定
INSERT INTO post_relations (source_post_id, target_post_id, relation_type, display_order) VALUES
(2, 3, 'next', 1);

-- Docker記事の前の記事をNext.js記事に設定
INSERT INTO post_relations (source_post_id, target_post_id, relation_type, display_order) VALUES
(3, 2, 'previous', 1);

-- おすすめ記事の設定
INSERT INTO post_relations (source_post_id, target_post_id, relation_type, display_order) VALUES
(1, 2, 'recommended', 1),
(1, 3, 'recommended', 2),
(2, 1, 'recommended', 1),
(2, 3, 'recommended', 2);

-- ================================================
-- 7. タグの使用回数を更新
-- ================================================
UPDATE tags SET usage_count = (
    SELECT COUNT(*) FROM post_tags WHERE tag_id = tags.id
);

