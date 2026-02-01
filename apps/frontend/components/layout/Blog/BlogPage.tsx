"use client";

import React, { useState, useCallback, memo } from "react";
import {
  ChevronDownIcon,
  PlusIcon,
  MinusIcon,
  FolderIcon,
  CheckIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n/config";

type BlogPageProps = {
  lang: Locale;
  dict: Dictionary;
};

const FILTER_TOPICS = [
  { id: "agentic", label: "Agentic", count: 5 },
  { id: "ai", label: "AI", count: 7 },
  { id: "aws", label: "AWS", count: 16 },
  { id: "best-practices", label: "Best Practices", count: 8 },
  { id: "billings", label: "Billings", count: 5 },
  { id: "connect", label: "Connect", count: 6 },
  { id: "crypto", label: "Crypto", count: 1 },
  { id: "dev-digest", label: "Dev Digest", count: 2 },
  { id: "enterprise", label: "Enterprise", count: 2 },
  { id: "event-destinations", label: "Event Destinations", count: 7 },
  { id: "getting-started", label: "Getting Started", count: 4 },
  { id: "invoicing", label: "Invoicing", count: 2 },
  { id: "partners", label: "Partners", count: 7 },
  { id: "payment-methods", label: "Payment Methods", count: 7 },
  { id: "sandboxes", label: "Sandboxes", count: 10 },
  { id: "sessions", label: "Sessions", count: 2 },
  { id: "terminal", label: "Terminal", count: 2 },
  { id: "workbench", label: "Workbench", count: 17 },
  { id: "workflows", label: "Workflows", count: 5 },
];

const FILTER_ARCHIVE = [
  { id: "2025-12", label: "2025/12", count: 24 },
  { id: "2026-01", label: "2026/1", count: 28 },
  { id: "2026-02", label: "2026/2", count: 24 },
];

const AUTHOR = "Kohta Kochi";

/** dict.blog.articles から記事を取得。バックエンド連携時に差し替え */
function getArticlesFromDict(dict: Dictionary) {
  const raw = dict.blog?.articles ?? [];
  return raw.map((a) => ({ ...a, author: AUTHOR }));
}

type Article = ReturnType<typeof getArticlesFromDict>[number];

const ArticleRow = memo(function ArticleRow({
  article,
  index,
  isExpanded,
  onToggle,
}: {
  article: Article;
  index: number;
  isExpanded: boolean;
  onToggle: (index: number) => void;
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
        <p className="min-w-0 flex-1 truncate font-mono text-xl leading-tight text-foreground transition-colors group-hover:text-white sm:text-2xl">
          {article.title}
        </p>
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
              {article.topics.map((topic) => (
                <span
                  key={topic}
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
              <button
                onClick={(e) => e.stopPropagation()}
                className="rounded-none cursor-pointer border border-border w-full py-2 text-sm bg-muted/45 hover:bg-pink-600 hover:font-semibold duration-400 transition-colors"
              >
                Read
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const BlogPage = ({ dict }: BlogPageProps) => {
  const articles = React.useMemo(() => getArticlesFromDict(dict), [dict]);
  const [topicOpen, setTopicOpen] = useState(true);
  const [archiveOpen, setArchiveOpen] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string | null>("ai");
  const [selectedArchive, setSelectedArchive] = useState<string | null>(null);
  const [expandedArticle, setExpandedArticle] = useState<number | null>(0);
  const articleCount = articles.length;
  const filters = dict.filters ?? { title: "FILTERS", topic: "Topic" };

  const handleToggleArticle = useCallback(
    (index: number) =>
      setExpandedArticle((prev) => (prev === index ? null : index)),
    []
  );

  // アーカイブでフィルタリング（YYYY.M形式で比較）
  const filteredArticles = React.useMemo(() => {
    if (!selectedArchive) return articles;
    const [year, month] = selectedArchive.split("-").map(Number);
    const prefix = `${year}.${month}`;
    return articles.filter((a) => a.date.startsWith(prefix));
  }, [selectedArchive, articles]);

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
      <div className="w-full px-4 max-w-7xl mx-auto py-4 sm:py-6 lg:w-11/12 lg:px-0 lg:py-8">
        {/* Blog Title */}
        <div className="mb-6 lg:mb-8 flex flex-wrap items-top gap-x-2">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-doto font-normal tracking-tight">
            KOHTA TECH BLOG
          </h1>
          <p className="text-base lg:text-lg text-muted-foreground">
            ({articleCount})
          </p>
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
              {filteredArticles.map((article) => {
                const originalIndex = articles.indexOf(article);
                return (
                  <ArticleRow
                    key={originalIndex}
                    article={article}
                    index={originalIndex}
                    isExpanded={expandedArticle === originalIndex}
                    onToggle={handleToggleArticle}
                  />
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
