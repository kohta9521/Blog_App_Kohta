"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Globe, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/types";

type ArticleMeta = {
  id: string;
  date: string;
  title: string;
  summary: string;
  author: string;
  topics: string[];
};

/** モック本文。バックエンドAPI連携時に削除 */
type BodyBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: { label: string; text: string }[] };

const MOCK_BODIES: Record<string, BodyBlock[]> = {
  "rust-ownership": [
    {
      type: "p",
      text: "Rustの`ownership`と`borrowing`は、メモリ安全を保証しながらパフォーマンスを最大限に引き出す革新的な仕組みです。従来のC/C++ではガベージコレクタなしでメモリ管理を行うと、ダングリングポインタや二重解放などの危険なバグが発生しやすくなります。Rustはコンパイル時にこれらの問題を検出するため、実行時のオーバーヘッドを一切伴いません。",
    },
    {
      type: "p",
      text: "`let`で変数を宣言すると、その変数は値を「所有」します。別の変数に代入すると、所有権は移動（`move`）し、元の変数は使用できなくなります。関数に値を渡すときも同様です。参照を使う場合は`&`（イミュータブル借用）や`&mut`（ミュータブル借用）を用い、`borrow checker`がコンパイル時にルール違反を検出します。",
    },
    {
      type: "h2",
      text: "Rustの所有権システムが抱える課題",
    },
    {
      type: "list",
      items: [
        {
          label: "Transparency:",
          text: "所有権の移動や借用の追跡が複雑になり、特に大規模なコードベースでは、どの変数がいつ使えなくなるかを追うのが難しくなります。エラーメッセージは詳細ですが、初心者には解読が大変です。",
        },
        {
          label: "Consistency:",
          text: "ライフタイム注釈（`'a`など）を正確に書くには経験が必要です。複数の参照が絡むと、コンパイラの指摘に従ってもなかなか通らないことがあり、試行錯誤が続くことがあります。",
        },
        {
          label: "Auditability:",
          text: "大きなプロジェクトでは、誰がどのデータを所有しているか、どのスコープで有効かの追跡が難しくなります。設計段階での所有権の明確化が重要になってきます。",
        },
      ],
    },
    {
      type: "h2",
      text: "借用ルールを理解する：より良いRustコードへ",
    },
    {
      type: "p",
      text: "借用の基本ルールは3つです。⑴ 同一スコープで、イミュータブル参照は複数持てるが、ミュータブル参照は1つだけ。⑵ 参照のライフタイムは、参照先の値のライフタイムを超えてはならない。⑶ 参照は、その参照先が有効な間だけ有効である。",
    },
    {
      type: "p",
      text: "`move`と`Copy`トレイトの違い、`Clone`の明示的な呼び出し、`Rc`や`Arc`による共有所有権、`RefCell`による内部可変性など、状況に応じた適切な選択ができるようになると、保守しやすくバグの少ないRustコードを書けるようになります。",
    },
    {
      type: "p",
      text: "実践では、大きな構造体を渡す際は参照を渡す、イテレータを活用して借用チェッカーの恩恵を最大限に受ける、必要な場合だけ`clone`を使うといった慣習が推奨されます。段階的に学び、小さなプロジェクトから始めることで、所有権モデルは必ず身につきます。",
    },
    {
      type: "p",
      text: "Rustの公式ドキュメント「The Rust Book」では、所有権に関する章が最初の方に配置されており、言語の根幹をなす概念として重視されています。実際のプロジェクトでは、`Clippy`や`rust-analyzer`が借用のミスを指摘してくれるため、それらを活用しながら学ぶと効率的です。",
    },
  ],
  "nextjs-app-router": [
    {
      type: "p",
      text: "Next.js 14で導入された`App Router`は、従来の`Pages Router`とは根本的に異なるアーキテクチャを採用しています。`app/`ディレクトリに`page.tsx`、`layout.tsx`、`loading.tsx`を配置することで、ネストされたルーティング、共有レイアウト、ストリーミングを自然な形で実現できます。",
    },
    {
      type: "p",
      text: "最も大きな変化は`Server Components`のデフォルト採用です。コンポーネントはサーバーでのみレンダリングされ、`useState`や`useEffect`を使わない限りクライアントに送信されません。データ取得は`async`コンポーネント内で直接行え、`useEffect`でのフェッチや`getServerSideProps`は不要になります。",
    },
    {
      type: "h2",
      text: "Server Componentsの利点",
    },
    {
      type: "list",
      items: [
        {
          label: "Performance:",
          text: "サーバーでのみレンダリングされるため、JavaScriptバンドルが軽量化し、初期表示が高速化します。大きなライブラリもクライアントに送らなければ、ページ読み込み時間を大幅に改善できます。",
        },
        {
          label: "Data Fetching:",
          text: "コンポーネント内で直接`async`関数としてデータ取得ができ、Waterfallを避けるために並列フェッチも容易です。データベースやAPIへのアクセスがシンプルになります。",
        },
        {
          label: "Streaming:",
          text: "`Suspense`と組み合わせることで、コンテンツを段階的にストリーミングでき、ユーザーは早期にインタラクティブな部分を見ることができます。",
        },
      ],
    },
    {
      type: "h2",
      text: "レイアウトとネストルーティング",
    },
    {
      type: "p",
      text: "`layout.tsx`はその配下のすべてのページで共有され、ページ遷移時に再レンダリングされません。ダッシュボードのサイドバーやヘッダーなど、共通UIをここに置くのが適切です。`loading.tsx`を置くと、そのセグメントの読み込み中に自動的に表示されます。",
    },
    {
      type: "p",
      text: "`Route Groups`（`(groupName)`フォルダ）を使うと、URLを変えずにルートを整理できます。また、`parallel routes`や`intercepting routes`で、モーダルやタブなどの複雑なUIパターンも実現可能です。",
    },
    {
      type: "p",
      text: '`Client Components`が必要な場合は、ファイルの先頭に`"use client"`を追加するだけです。フォームの状態管理やブラウザAPIの利用、イベントハンドラなど、インタラクティブな部分のみをクライアントに送ることで、パフォーマンスとUXの両立が可能になります。',
    },
  ],
  "rust-axum-api": [
    {
      type: "p",
      text: "`Axum`は、Rustの非同期ランタイム`Tokio`上で動作するWebフレームワークです。`tower`のトレイトを活用しており、ミドルウェアの組み合わせが柔軟です。`cargo add axum tokio -F full`でプロジェクトを開始し、`Router`でエンドポイントを定義、`Json`エクストラクタでリクエスト・レスポンスを型安全に扱えます。",
    },
    {
      type: "p",
      text: "ハンドラは`async fn`で定義し、必要なエクストラクタ（`Json`、`Path`、`Query`など）を引数に取ります。エラー処理は`IntoResponse`を実装した型を返すか、`Result`でラップすることで行います。バリデーションには`validator`や`serde`の機能を組み合わせるのが一般的です。",
    },
    {
      type: "h2",
      text: "本番運用を意識した構成",
    },
    {
      type: "p",
      text: "`tower-http`の`TraceLayer`でリクエストログを取得し、`CorsLayer`でCORSを設定、`TimeoutLayer`でタイムアウトを設定します。レート制限には`governor`、認証には`tower`のミドルウェアスタックを組み合わせます。",
    },
    {
      type: "p",
      text: "データベース接続には`sqlx`の接続プールを用い、`diesel`や`sea-orm`との統合も可能です。ヘルスチェックエンドポイント（`/health`）とメトリクス（`/metrics`）を必ず用意し、KubernetesやDockerでのオーケストレーションに備えましょう。",
    },
    {
      type: "p",
      text: "テストでは`axum::test`や`tower::ServiceExt`を使い、ハンドラを直接呼び出す統合テストを書けます。モックは`mockall`や手動のトレイト実装で行い、CIで自動化することで、本番デプロイ前の品質を担保できます。",
    },
    {
      type: "p",
      text: "デプロイはDockerでコンテナ化するのが一般的です。マルチステージビルドでバイナリのみを最終イメージに含めることで、イメージサイズを数十MB程度に抑えられます。AWS ECSやKubernetes上で運用するケースが多く、ヘルスチェックとメトリクスを適切に設定することが重要です。",
    },
  ],
  "nextjs-typescript": [
    {
      type: "p",
      text: "Next.jsとTypeScriptの組み合わせでは、型定義を適切に配置することで、エディタの補完とコンパイル時の安全性を最大化できます。`next.config.ts`の型、APIルートのリクエスト/レスポンス型、`getStaticProps`や`getServerSideProps`の戻り値型を明確にすることが重要です。",
    },
    {
      type: "p",
      text: "App Routerでは、`Metadata`型を用いてメタデータを型安全に定義できます。`generateMetadata`は非同期で、動的にメタデータを生成する際に便利です。パラメータの型も`Promise<{ params: { id: string } }>`のように指定し、型のついたparamsを扱いましょう。",
    },
    {
      type: "h2",
      text: "プロジェクト構造のベストプラクティス",
    },
    {
      type: "p",
      text: "`/types`で共通型を定義、`/lib`でユーティリティやAPIクライアント、`/components`でUIコンポーネントを配置します。`barrel export`（index.ts）を活用するとインポートが簡潔になり、`path alias`（`@/components`など）の設定で相対パス地獄を避けられます。",
    },
    {
      type: "p",
      text: "大規模になると、ドメインごとに`/features`ディレクトリを切る方法も有効です。各機能が`components`、`hooks`、`utils`、`types`を持ち、疎結合を保ちながら開発を進められます。",
    },
    {
      type: "p",
      text: "ZodやValibotなどのスキーマバリデーションライブラリを組み合わせると、APIの入出力を型安全に検証できます。フォームのバリデーションとサーバー側の検証で同じスキーマを共有することで、二重実装を避けられ、保守性が高まります。",
    },
  ],
  "async-rust-tokio": [
    {
      type: "p",
      text: "TokioはRustの非同期ランタイムであり、`async`/`.await`構文を実行する基盤です。`tokio::main`でランタイムを起動し、`async fn`内で`.await`を使って非同期処理を順次実行します。`tokio::spawn`でタスクを生成し、複数の非同期処理を並列で走らせることができます。",
    },
    {
      type: "p",
      text: "`Future`トレイトは、非同期計算を表すコアとなる型です。`poll`メソッドで進捗を確認し、`Ready`または`Pending`を返します。`Pin`と`Waker`の仕組みにより、将来の再ポールが保証され、効率的なイベント駆動の実行が可能になります。",
    },
    {
      type: "h2",
      text: "チャレンジ：非同期Rustの複雑さ",
    },
    {
      type: "list",
      items: [
        {
          label: "Transparency:",
          text: "どのタスクがいつ実行されるか、ランタイムの内部動作を追うのは難しいです。デバッグには`tracing`や`println`が有効で、デッドロックやスタベーションの原因を特定するには経験が必要です。",
        },
        {
          label: "Consistency:",
          text: "`Send`と`Sync`の制約により、非同期コードでは型エラーが頻発します。`Arc`、`Mutex`、`RwLock`の使い分け、`spawn`に渡すFutureの`Send`要件を理解することが重要です。",
        },
        {
          label: "Cancellation:",
          text: "RustのFutureはキャンセル可能です。`select!`や`tokio::select!`で複数のFutureを競争させ、最初に完了したものを使うパターンがよく使われます。",
        },
      ],
    },
    {
      type: "h2",
      text: "実践的なパターン",
    },
    {
      type: "p",
      text: "チャネル（`mpsc`、`broadcast`）によるタスク間通信、`join!`や`try_join!`による並列実行、`time::timeout`によるタイムアウト処理など、Tokioが提供する豊富なプリミティブを組み合わせることで、堅牢な非同期アプリケーションを構築できます。",
    },
    {
      type: "p",
      text: "デバッグには`tracing`や`tracing-subscriber`が有効です。スパンを使って非同期タスクの開始・終了を記録し、ログを構造化することで、複雑な非同期フローの追跡が容易になります。本番環境ではサンプリングやフィルタリングを設定し、パフォーマンスへの影響を抑えましょう。",
    },
  ],
};

const DEFAULT_BODY: BodyBlock[] = [
  {
    type: "p",
    text: "This article is not found or the content is being loaded. Please check the URL or try again later.",
  },
];

const READING_MINUTES = 4;

type BlogDetailPageProps = {
  article: ArticleMeta;
  dict: Dictionary;
  lang: string;
};

export function BlogDetailPage({ article, dict, lang }: BlogDetailPageProps) {
  const labels = dict.blogDetail ?? {
    metadata: "METADATA",
    date: "DATE",
    author: "AUTHOR",
    readingTime: "READING TIME",
    categories: "CATEGORIES",
    share: "SHARE",
    article: "ARTICLE",
    minRead: "MIN READ",
  };

  const body = MOCK_BODIES[article.id] ?? DEFAULT_BODY;
  const titleRef = useRef<HTMLDivElement>(null);
  const [showSidebarTitle, setShowSidebarTitle] = useState(false);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowSidebarTitle(!entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "-50px 0px 0px 0px",
        threshold: 0,
      }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
  const shareUrl = `${baseUrl}/${lang}/blog/${article.id}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const text = encodeURIComponent(article.title);
  const twitterHref = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`;
  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  return (
    <article className="min-h-screen bg-black text-neutral-100">
      <div className="w-full px-4 max-w-6xl mx-auto py-6 sm:py-10 lg:px-6 lg:py-16 xl:px-8 xl:py-20">
        {/* Title + Decorative + */}
        <div ref={titleRef} className="relative mb-10 sm:mb-14 lg:mb-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6 pr-14 sm:pr-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white max-w-3xl leading-tight">
              {article.title}
            </h1>
            <div className="flex shrink-0 items-center gap-2 mt-2 sm:mt-0">
              <span
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-neutral-600 text-neutral-400 bg-neutral-900"
                title="Language"
              >
                <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </span>
              <span className="flex h-8 sm:h-9 items-center rounded-full border border-neutral-600 px-2.5 sm:px-3 text-[10px] sm:text-[11px] font-mono text-neutral-400 bg-neutral-900">
                <Code2 className="mr-1.5 h-3 w-3" />
                DEV
              </span>
            </div>
          </div>
        </div>

        {/* モバイル: メタデータ→記事の縦並び / PC: メタデータ左・記事右 */}
        <div className="flex flex-col gap-8 sm:gap-10 lg:flex-row lg:gap-16 xl:gap-20">
          {/* Metadata - モバイルで上、PCで左・sticky */}
          <aside className="w-full shrink-0 lg:w-52 order-1 lg:order-1 lg:self-start lg:sticky lg:top-20">
            {/* PC時のみ: スクロールでメタデータ上にタイトルがニュルっと表示。スマホでは非表示 */}
            <div
              className={cn(
                "hidden lg:grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out",
                showSidebarTitle
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="min-h-0">
                <h2
                  className={cn(
                    "text-base sm:text-lg lg:text-xl font-semibold tracking-tight text-white mb-5 lg:mb-6 leading-tight transition-transform duration-300 ease-out",
                    showSidebarTitle ? "translate-y-0" : "-translate-y-2"
                  )}
                >
                  {article.title}
                </h2>
              </div>
            </div>
            <div className="border-b border-neutral-600 pb-2 mb-4 lg:mb-6">
              <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-neutral-400">
                / {labels.metadata}
              </p>
            </div>
            <div className="space-y-0">
              <div className="flex items-center justify-between gap-4 border-b border-dotted border-neutral-600 py-3">
                <p className="shrink-0 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  {labels.date}:
                </p>
                <p className="text-right text-xs sm:text-sm font-mono text-neutral-200">
                  {article.date}
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-dotted border-neutral-600 py-4">
                <p className="shrink-0 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  {labels.author}:
                </p>
                <span className="rounded-full px-2.5 py-0.5 text-xs font-medium text-neutral-200">
                  {article.author}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-dotted border-neutral-600 py-4">
                <p className="shrink-0 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  {labels.readingTime}:
                </p>
                <p className="text-right text-xs sm:text-xs text-neutral-200">
                  {READING_MINUTES} {labels.minRead}
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-dotted border-neutral-600 py-4">
                <p className="shrink-0 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  {labels.categories}:
                </p>
                <div className="flex flex-wrap justify-end gap-1">
                  {article.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-none border border-neutral-600 bg-neutral-800/50 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-neutral-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              <div className="block justify-between gap-4 py-4">
                <p className="w-full mb-3 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  {labels.share}:
                </p>
                <div className="flex flex-wrap justify-between">
                  <Link
                    href={twitterHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-none border border-neutral-600 bg-neutral-900 w-[47%] text-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-medium text-neutral-200 transition-colors hover:bg-pink-600"
                  >
                    Twitter/X
                  </Link>
                  <Link
                    href={linkedInHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-none border border-neutral-600 bg-neutral-900 w-[47%] text-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-medium text-neutral-200 transition-colors hover:bg-pink-600"
                  >
                    LinkedIn
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Article Content - モバイルで下、PCで右 */}
          <main className="min-w-0 flex-1 order-2 lg:order-2 w-full">
            <div className="border-b border-neutral-600 pb-2 mb-6 sm:mb-8 lg:mb-10">
              <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-neutral-400">
                / {labels.article}
              </p>
            </div>
            <div className="space-y-0">
              {body.map((block, i) => {
                if (block.type === "p") {
                  return <ParagraphWithCode key={i} text={block.text} />;
                }
                if (block.type === "h2") {
                  return (
                    <h2
                      key={i}
                      className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mt-8 sm:mt-10 lg:mt-12 mb-3 sm:mb-4 first:mt-0 leading-snug"
                    >
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === "list") {
                  return (
                    <ul
                      key={i}
                      className="space-y-4 sm:space-y-5 mt-2 mb-6 sm:mb-8"
                    >
                      {block.items.map((item, j) => (
                        <li
                          key={j}
                          className="text-sm sm:text-[15px] leading-[1.7] text-neutral-300"
                        >
                          <span className="font-semibold text-white">
                            {item.label}
                          </span>{" "}
                          {item.text}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return null;
              })}
            </div>
          </main>
        </div>
      </div>
    </article>
  );
}

function ParagraphWithCode({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <p className="text-sm sm:text-[15px] leading-[1.8] text-neutral-300 mb-5 sm:mb-6">
      {parts.map((part, i) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <code
            key={i}
            className="rounded border border-neutral-600 bg-neutral-800/60 px-1.5 py-0.5 font-mono text-[13px] underline underline-offset-2 decoration-neutral-500"
          >
            {part.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}
