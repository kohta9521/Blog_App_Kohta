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

const MOCK_ARTICLES = [
  {
    date: "2026.1.27",
    title: "Configuring Stripe using Terraform and AI agents",
    summary:
      "Learn why using AI agents to author Terraform code is safer than direct API calls for Stripe configuration. Get transparent, consistent, and auditable infrastructure with code review workflows.",
    author: "Michael Selander",
    topics: ["AI", "AGENTIC"],
  },
  {
    date: "2025.12.10",
    title:
      "Versioning in Stripe Workflows: Ship workflow changes with confidence",
    summary: "Learn how to version Stripe workflows for reliable deployments.",
    author: "Kalyani Koppisetti",
    topics: ["AWS", "PARTNERS"],
  },
  {
    date: "2025.12.04",
    title: "Building production-ready Stripe subscriptions using Kiro powers",
    summary: "Learn how to build production-ready Stripe subscriptions faster.",
    author: "Kalyani Koppisetti, Dan Kiuna",
    topics: ["AWS", "PARTNERS"],
  },
  {
    date: "2025.11.25",
    title:
      "Stablecoin payments for Stripe developers: zero crypto knowledge required",
    summary: "Accept stablecoin payments without crypto expertise.",
    author: "Dan Kiuna",
    topics: ["Crypto", "Payment Methods"],
  },
  {
    date: "2025.10.23",
    title: "Using a web-based POS with a mobile Terminal reader",
    summary: "Integrate web POS with mobile Terminal.",
    author: "Michael Selander",
    topics: ["Terminal", "Getting Started"],
  },
];

type Article = (typeof MOCK_ARTICLES)[number];

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
    <div className="py-4 first:pt-0 ">
      {/* 常に表示される行 - レンダリング変更なし */}
      <div
        className="flex cursor-pointer items-center gap-4"
        onClick={() => onToggle(index)}
      >
        <div className="flex w-24 shrink-0 items-center gap-2 text-sm text-muted-foreground">
          <div className="h-1.5 w-1.5 shrink-0 rounded-none bg-foreground" />
          {article.date}
        </div>
        <p className="min-w-0 flex-1 truncate text-2xl leading-tight text-foreground group-hover:text-primary transition-colors">
          {article.title}
        </p>
        <div className="shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
          {isExpanded ? (
            <MinusIcon className="h-4 w-4" />
          ) : (
            <PlusIcon className="h-4 w-4" />
          )}
        </div>
      </div>

      {/* 展開時に表示 - スムーズなアニメーションで追加 */}
      <div
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out",
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="min-h-0">
          <div className="space-y-3 pt-7 opacity-100 transition-opacity duration-200">
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
              <div className="min-w-0 flex-1">
                <span className="text-muted-foreground">SUMMARY: </span>
                <span className="text-foreground">{article.summary}</span>
              </div>
              <div className="shrink-0">
                <span className="text-muted-foreground">AUTHOR: </span>
                <span className="text-foreground">{article.author}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground">TOPIC: </span>
              {article.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-md border border-border bg-muted/30 px-2.5 py-0.5 text-xs text-foreground"
                >
                  {topic}
                </span>
              ))}
            </div>
            <div className="flex justify-center pt-4">
              <button
                onClick={(e) => e.stopPropagation()}
                className="rounded-md border border-border bg-background px-8 py-2 text-sm hover:bg-muted/50 transition-colors"
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
  const [topicOpen, setTopicOpen] = useState(true);
  const [archiveOpen, setArchiveOpen] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string | null>("ai");
  const [selectedArchive, setSelectedArchive] = useState<string | null>(null);
  const [expandedArticle, setExpandedArticle] = useState<number | null>(0);
  const articleCount = 76;
  const filters = dict.filters ?? { title: "FILTERS", topic: "Topic" };

  const handleToggleArticle = useCallback(
    (index: number) =>
      setExpandedArticle((prev) => (prev === index ? null : index)),
    []
  );

  // アーカイブでフィルタリング（YYYY.M形式で比較）
  const filteredArticles = React.useMemo(() => {
    if (!selectedArchive) return MOCK_ARTICLES;
    const [year, month] = selectedArchive.split("-").map(Number);
    const prefix = `${year}.${month}`;
    return MOCK_ARTICLES.filter((a) => a.date.startsWith(prefix));
  }, [selectedArchive]);

  // フィルター変更時、展開中の記事がリストに無ければ閉じる
  React.useEffect(() => {
    if (
      expandedArticle !== null &&
      !filteredArticles.includes(MOCK_ARTICLES[expandedArticle])
    ) {
      setExpandedArticle(null);
    }
  }, [selectedArchive, filteredArticles, expandedArticle]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Main Content */}
      <div className="w-11/12 mx-auto max-w-7xl py-8">
        {/* Blog Title */}
        <div className="mb-8 flex">
          <h1 className="text-[80px] font-doto font-normal tracking-tight">
            KOHTA TECH BLOG
          </h1>
          <p className="text-lg text-muted-foreground">({articleCount})</p>
        </div>

        {/* Two Column Layout */}
        <div className="flex gap-12">
          {/* Left: Filters */}
          <aside className="w-52 shrink-0">
            <div className="border-b border-border pb-2">
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                / {filters.title}
              </p>
            </div>
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
                {/* 左側の点線 */}
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
          </aside>

          {/* Right: Article List */}
          <main className="flex-1 min-w-0">
            {/* Column Headers */}
            <div className="flex border-b border-border pb-2">
              <p className="w-24 shrink-0 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                / DATE
              </p>
              <p className="flex-1 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                / NAME
              </p>
              <div className="w-8" />
            </div>

            {/* Article Rows - 行は常に同じ、詳細のみアニメーションで追加 */}
            <div className="mt-4 divide-y divide-border">
              {filteredArticles.map((article) => {
                const originalIndex = MOCK_ARTICLES.indexOf(article);
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
