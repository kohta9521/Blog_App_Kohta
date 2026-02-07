"use client";

import React, { useState, useCallback, memo, useMemo } from "react";
import Link from "next/link";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  MinusIcon,
  FolderIcon,
  CheckIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n/config";
import type { Blog } from "@/schema/blog";
import type { Topic } from "@/schema/topic";
import type { Book } from "@/schema/book";

type BlogPageProps = {
  lang: Locale;
  dict: Dictionary;
  /** microCMS APIから取得したブログ記事 */
  blogs: Blog[];
  /** microCMS APIから取得したトピック */
  topics: Topic[];
  /** microCMS APIから取得したBook */
  books: Book[];
};

type Article = {
  id: string;
  date: string;
  title: string;
  summary: string;
  topics: string[];
  bookId?: string;
  bookTitle?: string;
  author: string;
  readTime: number;
};

const ArticleRow = memo(function ArticleRow({
  article,
  index,
  isExpanded,
  onToggle,
  lang,
}: {
  article: Article;
  index: number;
  isExpanded: boolean;
  onToggle: (index: number) => void;
  lang: string;
}) {
  return (
    <div>
      {/* 常に表示される行 - 黒空白なし、hoverで行全体ピンク */}
      <div
        className="group flex min-h-14 cursor-pointer items-center gap-4 pb-0 transition-colors duration-200 hover:bg-pink-600"
        onClick={() => onToggle(index)}
      >
        <div className="flex w-20 shrink-0 items-center gap-2 text-sm text-muted-foreground transition-colors group-hover:text-white lg:w-24">
          <div className="h-1.5 w-1.5 shrink-0 rounded-none bg-foreground transition-colors group-hover:bg-white" />
          {article.date}
        </div>
        <div className="min-w-0 flex-1 flex items-center gap-2">
          <p className="truncate font-mono text-xl leading-tight text-foreground transition-colors group-hover:text-white sm:text-2xl">
            {article.title}
          </p>
          {article.bookTitle && (
            <span className="shrink-0 inline-flex items-center gap-1 rounded-none border border-border bg-muted/30 px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider text-muted-foreground transition-colors group-hover:border-white group-hover:bg-white/10 group-hover:text-white">
              <span>📖</span>
              <span className="hidden sm:inline">{article.bookTitle}</span>
            </span>
          )}
        </div>
        <div className="shrink-0 text-muted-foreground transition-colors group-hover:text-white">
          {isExpanded ? (
            <MinusIcon className="h-4 w-4" strokeWidth={2} />
          ) : (
            <PlusIcon className="h-4 w-4" strokeWidth={2} />
          )}
        </div>
      </div>

      {/* 展開時に表示 - スムーズなアニメーションで追加 */}
      <div
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out mb-0",
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="min-h-0 pb-1">
          <div className="w-full h-auto pt-5 flex flex-col gap-4 lg:flex-row lg:justify-between mb-6 lg:mb-8">
            <div className="w-full lg:w-3/6 h-auto">
              <div className="flex flex-col sm:flex-row sm:items-start">
                <span className="text-muted-foreground text-xs font-mono shrink-0 sm:mr-12">
                  SUMMARY:{" "}
                </span>
                <span className="text-foreground text-sm font-mono">
                  {article.summary}
                </span>
              </div>
            </div>
            <div className="w-full lg:w-2/6 h-auto shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-start">
                <span className="text-muted-foreground text-xs font-mono shrink-0 sm:mr-12">
                  AUTHOR:{" "}
                </span>
                <span className="text-foreground text-sm font-mono">
                  {article.author}
                </span>
              </div>
            </div>
          </div>
          <div className="w-full h-auto">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground text-xs font-mono mr-4 shrink-0 sm:mr-12">
                TOPIC:{" "}
              </span>
              {article.topics.map((topic, idx) => (
                <span
                  key={`${article.id}-topic-${idx}`}
                  className="rounded-none border border-border bg-muted/30 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-foreground"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-3 pt-0 pb-3 opacity-100 transition-opacity duration-200">
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm"></div>

            <div className="flex justify-center pt-4">
              <Link
                href={`/${lang}/blog/${article.id}`}
                onClick={(e) => e.stopPropagation()}
                className="block rounded-none cursor-pointer border border-border w-full py-2 text-sm bg-muted/45 hover:bg-pink-600 hover:font-semibold duration-400 transition-colors text-center"
              >
                Read
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const BlogPage = ({
  lang,
  dict,
  blogs,
  topics,
  books,
}: BlogPageProps) => {
  // microCMS APIデータをアプリケーション形式に変換
  const articles = useMemo(
    () =>
      blogs.map((blog) => {
        // このブログがどのBookに含まれているかを確認
        // 言語サフィックス（-en）を除いたベースIDで比較
        const blogBaseId = blog.id.replace(/-en$/, "");
        const belongsToBook = books.find((book) =>
          book.book_blogs?.some((bb) => {
            const bbBaseId = bb.id.replace(/-en$/, "");
            return bbBaseId === blogBaseId || bb.id === blog.id;
          })
        );

        return {
          id: blog.id,
          date: new Date(blog.publishedAt).toISOString().split("T")[0],
          title: blog.title,
          summary: blog.summary,
          // 重複を除外: Array.from(new Set(...))
          topics: Array.from(new Set(blog.topics.map((t) => t.topic))),
          bookId: belongsToBook?.id, // BookのIDを保存
          bookTitle: belongsToBook?.book_title, // Book名も保持
          author: "Kohta Kochi",
          readTime: blog.read_time,
        };
      }),
    [blogs, books]
  );

  // トピックフィルター情報を生成（各トピックの記事数をカウント）
  const FILTER_TOPICS = useMemo(() => {
    const topicCounts = new Map<string, number>();
    blogs.forEach((blog) => {
      blog.topics.forEach((topic) => {
        topicCounts.set(topic.topic, (topicCounts.get(topic.topic) || 0) + 1);
      });
    });
    return topics.map((topic) => ({
      id: topic.topic,
      label: topic.topic,
      count: topicCounts.get(topic.topic) || 0,
    }));
  }, [blogs, topics]);

  // アーカイブフィルター情報を生成（月別の記事数をカウント）
  const FILTER_ARCHIVE = useMemo(() => {
    const archiveCounts = new Map<string, number>();
    blogs.forEach((blog) => {
      const date = new Date(blog.publishedAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      archiveCounts.set(key, (archiveCounts.get(key) || 0) + 1);
    });
    return Array.from(archiveCounts.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, count]) => ({
        id: key,
        label: key.replace("-", "/"),
        count,
      }));
  }, [blogs]);

  // Bookフィルター情報を生成（Book別の記事数をカウント）
  const FILTER_BOOKS = useMemo(() => {
    // Bookの配列から直接記事数を取得（book_blogsの長さ）
    // ただし、現在の言語に対応する記事のみカウント
    return books
      .map((book) => {
        // book_blogsから現在の言語の記事のみをカウント
        const matchingBlogs = blogs.filter((blog) => {
          // このブログがこのBookに含まれているか確認
          // 言語サフィックス（-en）を除いたベースIDで比較
          const blogBaseId = blog.id.replace(/-en$/, "");
          const isInBook = book.book_blogs?.some((bb) => {
            const bbBaseId = bb.id.replace(/-en$/, "");
            return bbBaseId === blogBaseId || bb.id === blog.id;
          });
          return isInBook;
        });
        return {
          id: book.id,
          label: book.book_title,
          count: matchingBlogs.length,
        };
      })
      .filter((book) => book.count > 0); // 記事が1件以上あるBookのみ表示
  }, [blogs, books]);

  const [topicOpen, setTopicOpen] = useState(true);
  const [archiveOpen, setArchiveOpen] = useState(true);
  const [bookOpen, setBookOpen] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedArchive, setSelectedArchive] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);
  const filters = dict.filters ?? { title: "FILTERS", topic: "Topic" };

  const handleToggleArticle = useCallback(
    (index: number) =>
      setExpandedArticle((prev) => (prev === index ? null : index)),
    []
  );

  // トピック、アーカイブ、Bookでフィルタリング
  const filteredArticles = useMemo(() => {
    let filtered = articles;

    // トピックフィルタ
    if (selectedTopic) {
      filtered = filtered.filter((a) => a.topics.includes(selectedTopic));
    }

    // アーカイブフィルタ（YYYY-MM形式）
    if (selectedArchive) {
      const [year, month] = selectedArchive.split("-");
      const targetDate = `${year}-${month.padStart(2, "0")}`;
      filtered = filtered.filter((a) => a.date.startsWith(targetDate));
    }

    // Bookフィルタ
    if (selectedBook) {
      filtered = filtered.filter((a) => a.bookId === selectedBook);
    }

    return filtered;
  }, [articles, selectedTopic, selectedArchive, selectedBook]);

  // フィルター変更時、展開中の記事がリストに無ければ閉じる
  React.useEffect(() => {
    if (
      expandedArticle !== null &&
      expandedArticle >= 0 &&
      expandedArticle < articles.length &&
      !filteredArticles.includes(articles[expandedArticle])
    ) {
      setExpandedArticle(null);
    }
  }, [selectedArchive, filteredArticles, expandedArticle, articles]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Main Content */}
      <div className="w-full px-4 max-w-screen-3xl mx-auto py-4 sm:py-6 lg:w-11/12 lg:px-0 lg:py-8">
        {/* Blog Title */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-wrap items-top gap-x-2 mb-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-doto font-normal tracking-tight">
              KOHTA TECH BLOG
            </h1>
            <p className="text-base lg:text-lg text-muted-foreground">
              ({filteredArticles.length})
            </p>
          </div>

          {/* Active Filters */}
          {(selectedTopic || selectedArchive || selectedBook) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                FILTERED BY:
              </span>
              {selectedTopic && (
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="inline-flex items-center gap-1.5 rounded-none border border-pink-600 bg-pink-600/20 px-2.5 py-1 text-xs font-mono uppercase tracking-wider text-pink-600 hover:bg-pink-600 hover:text-white transition-colors"
                >
                  <span>Topic: {selectedTopic}</span>
                  <span className="text-[10px]">✕</span>
                </button>
              )}
              {selectedArchive && (
                <button
                  onClick={() => setSelectedArchive(null)}
                  className="inline-flex items-center gap-1.5 rounded-none border border-pink-600 bg-pink-600/20 px-2.5 py-1 text-xs font-mono uppercase tracking-wider text-pink-600 hover:bg-pink-600 hover:text-white transition-colors"
                >
                  <span>Archive: {selectedArchive.replace("-", "/")}</span>
                  <span className="text-[10px]">✕</span>
                </button>
              )}
              {selectedBook && (
                <button
                  onClick={() => setSelectedBook(null)}
                  className="inline-flex items-center gap-1.5 rounded-none border border-pink-600 bg-pink-600/20 px-2.5 py-1 text-xs font-mono uppercase tracking-wider text-pink-600 hover:bg-pink-600 hover:text-white transition-colors"
                >
                  <span>
                    Book: {books.find((b) => b.id === selectedBook)?.book_title}
                  </span>
                  <span className="text-[10px]">✕</span>
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedTopic(null);
                  setSelectedArchive(null);
                  setSelectedBook(null);
                }}
                className="text-xs font-mono text-muted-foreground hover:text-foreground underline transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Two Column Layout - モバイルは縦積み、PC(lg〜)は横並びで現行レイアウト維持 */}
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Left: Filters */}
          <aside className="w-full shrink-0 lg:w-52">
            <div className="border-b border-border pb-2">
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                / {filters.title}
              </p>
            </div>

            {/* レスポンシブ: Topicのみ横スライドUI */}
            <div className="mt-4 flex items-center gap-3 lg:hidden">
              <div className="flex shrink-0 items-center gap-2 border-r border-dashed border-border pr-3">
                <FolderIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {filters.topic}
                </span>
              </div>
              <div className="min-w-0 flex-1 overflow-x-auto overflow-y-hidden py-1 [-webkit-overflow-scrolling:touch]">
                <div className="flex gap-2">
                  {FILTER_TOPICS.map(({ id, label, count }) => {
                    const isChecked = selectedTopic === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setSelectedTopic(isChecked ? null : id)}
                        className={`shrink-0 rounded px-2.5 py-1 text-xs transition-colors ${
                          isChecked
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {label} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* PC: Topic + Archive 縦並びチェックボックス */}
            <div className="hidden lg:block">
              <button
                onClick={() => setTopicOpen(!topicOpen)}
                className="mt-4 flex w-full items-center gap-2 py-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ChevronDownIcon
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                    topicOpen ? "" : "-rotate-90"
                  }`}
                />
                <FolderIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{filters.topic}</span>
              </button>
              {topicOpen && (
                <ul className="relative mt-1 space-y-0">
                  <div className="absolute left-2 top-0 bottom-0 w-px border-l border-dashed border-border/60" />
                  {FILTER_TOPICS.map(({ id, label, count }) => {
                    const isChecked = selectedTopic === id;
                    return (
                      <li key={id}>
                        <label
                          className={`flex cursor-pointer items-center gap-2 py-1 pl-6 pr-2 text-xs transition-colors ${
                            isChecked
                              ? "bg-primary/15 text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() =>
                              setSelectedTopic(isChecked ? null : id)
                            }
                            className="sr-only"
                          />
                          <div
                            className={`flex h-3 w-3 rounded-none shrink-0 items-center justify-center border ${
                              isChecked
                                ? "border-primary bg-pink-600"
                                : "border-border bg-background"
                            }`}
                          >
                            {isChecked ? (
                              <CheckIcon className="h-2.5 w-2.5 text-primary-foreground" />
                            ) : null}
                          </div>
                          <span className="text-xs">
                            {label} ({count})
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Archive - 月別絞り込み */}
              <button
                onClick={() => setArchiveOpen(!archiveOpen)}
                className="mt-6 flex w-full items-center gap-2 py-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ChevronDownIcon
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                    archiveOpen ? "" : "-rotate-90"
                  }`}
                />
                <FolderIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>Archive</span>
              </button>
              {archiveOpen && (
                <ul className="relative mt-1 space-y-0">
                  <div className="absolute left-2 top-0 bottom-0 w-px border-l border-dashed border-border/60" />
                  {FILTER_ARCHIVE.map(({ id, label, count }) => {
                    const isChecked = selectedArchive === id;
                    return (
                      <li key={id}>
                        <label
                          className={`flex cursor-pointer items-center gap-2 py-1 pl-6 pr-2 text-xs transition-colors ${
                            isChecked
                              ? "bg-primary/15 text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() =>
                              setSelectedArchive(isChecked ? null : id)
                            }
                            className="sr-only"
                          />
                          <div
                            className={`flex h-3 w-3 shrink-0 items-center justify-center rounded-none border ${
                              isChecked
                                ? "border-primary bg-primary"
                                : "border-border bg-background"
                            }`}
                          >
                            {isChecked ? (
                              <CheckIcon className="h-2.5 w-2.5 text-primary-foreground" />
                            ) : null}
                          </div>
                          <span className="text-xs">
                            {label} ({count})
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Book - 書籍へのリンク */}
              <button
                onClick={() => setBookOpen(!bookOpen)}
                className="mt-6 flex w-full items-center gap-2 py-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ChevronDownIcon
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                    bookOpen ? "" : "-rotate-90"
                  }`}
                />
                <FolderIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>Book</span>
              </button>
              {bookOpen && (
                <ul className="relative mt-1 space-y-0">
                  {FILTER_BOOKS.length > 0 ? (
                    <>
                      <div className="absolute left-2 top-0 bottom-0 w-px border-l border-dashed border-border/60" />
                      {FILTER_BOOKS.map(({ id, label, count }) => (
                        <li key={id}>
                          <Link
                            href={`/${lang}/book/${id}`}
                            className="flex items-center gap-2 py-1 pl-6 pr-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors group"
                          >
                            <span className="text-[10px] group-hover:text-pink-600">
                              📖
                            </span>
                            <span className="flex-1">
                              {label} ({count})
                            </span>
                            <ChevronRightIcon className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        </li>
                      ))}
                    </>
                  ) : (
                    <li className="pl-6 py-2 text-xs text-muted-foreground italic">
                      書籍はまだ登録されていません
                    </li>
                  )}
                </ul>
              )}
            </div>
          </aside>

          {/* Right: Article List */}
          <main className="flex-1 min-w-0 w-full">
            {/* Column Headers */}
            <div className="flex border-b border-border pb-2">
              <p className="w-20 shrink-0 text-xs font-mono uppercase tracking-wider text-muted-foreground lg:w-24">
                / DATE
              </p>
              <p className="flex-1 min-w-0 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                / NAME
              </p>
              <div className="w-6 shrink-0 lg:w-8" />
            </div>

            {/* Article Rows - 行は常に同じ、詳細のみアニメーションで追加 */}
            <div className="mt-2 divide-y divide-border">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => {
                  const originalIndex = articles.indexOf(article);
                  return (
                    <ArticleRow
                      key={originalIndex}
                      article={article}
                      index={originalIndex}
                      isExpanded={expandedArticle === originalIndex}
                      onToggle={handleToggleArticle}
                      lang={lang}
                    />
                  );
                })
              ) : (
                <div className="text-center py-16 lg:py-24">
                  <div className="mb-4 text-4xl">🔍</div>
                  <p className="text-muted-foreground font-mono text-sm mb-2">
                    フィルター条件に一致する記事が見つかりませんでした
                  </p>
                  <button
                    onClick={() => {
                      setSelectedTopic(null);
                      setSelectedArchive(null);
                      setSelectedBook(null);
                    }}
                    className="mt-4 inline-block border border-border bg-background hover:bg-pink-600 hover:border-pink-600 px-6 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors"
                  >
                    フィルターをクリア
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
