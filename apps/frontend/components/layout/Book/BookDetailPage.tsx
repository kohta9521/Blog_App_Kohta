"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRightIcon, ClockIcon, CalendarIcon } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Book } from "@/schema/book";
import type { Blog } from "@/schema/blog";

type BookDetailPageProps = {
  lang: Locale;
  book: Book;
  articles: Blog[];
};

export const BookDetailPage = ({
  lang,
  book,
  articles,
}: BookDetailPageProps) => {
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  // book_blogsの配列順序がそのままChapter順
  // ソート不要：配列の順番がそのまま表示順序
  const sortedArticles = articles;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="w-full px-4 max-w-screen-2xl mx-auto py-4 sm:py-6 lg:px-8 lg:py-8">
        {/* Breadcrumb */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Link
              href={`/${lang}/book`}
              className="hover:text-foreground transition-colors"
            >
              BOOKS
            </Link>
            <ChevronRightIcon className="h-3 w-3" />
            <span className="text-foreground">{book.book_title}</span>
          </div>
        </div>

        {/* Book Header */}
        <div className="mb-8 lg:mb-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-16 w-16 lg:h-20 lg:w-20 border border-border bg-muted/30 flex items-center justify-center shrink-0">
              <span className="text-3xl lg:text-4xl">
                {book.book_emoji || "📖"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-doto font-normal tracking-tight mb-3">
                {book.book_title}
              </h1>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-3 w-3" />
                  <span>
                    {new Date(book.publishedAt)
                      .toISOString()
                      .split("T")[0]
                      .replace(/-/g, "/")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>•</span>
                  <span>
                    {sortedArticles.length}{" "}
                    {sortedArticles.length === 1 ? "CHAPTER" : "CHAPTERS"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapters List */}
        <div className="space-y-0 border-t border-border">
          <div className="sticky top-0 bg-background z-10 border-b border-border py-3">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              / CHAPTERS
            </p>
          </div>

          {sortedArticles.map((article, index) => {
            const chapterNumber = index + 1;
            const isExpanded = expandedChapter === article.id;

            return (
              <div
                key={article.id}
                className="border-b border-border last:border-b-0"
              >
                {/* Chapter Row */}
                <div
                  className="group flex items-start gap-4 py-4 lg:py-6 cursor-pointer hover:bg-pink-600 transition-colors duration-200"
                  onClick={() =>
                    setExpandedChapter(isExpanded ? null : article.id)
                  }
                >
                  {/* Chapter Number */}
                  <div className="shrink-0 w-16 lg:w-20">
                    <div className="h-10 w-10 lg:h-12 lg:w-12 border border-border bg-muted/30 flex items-center justify-center group-hover:border-white group-hover:bg-white/10 transition-colors">
                      <span className="text-sm lg:text-base font-mono font-bold text-foreground group-hover:text-white">
                        {String(chapterNumber).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  {/* Chapter Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground group-hover:text-white/80 shrink-0">
                            CHAPTER {String(chapterNumber).padStart(2, "0")}:
                          </span>
                          <h2 className="text-xl lg:text-2xl font-mono font-semibold text-foreground group-hover:text-white transition-colors">
                            {lang === "en" ? article.title_en : article.title}
                          </h2>
                        </div>
                      </div>
                      <ChevronRightIcon
                        className={`h-5 w-5 shrink-0 text-muted-foreground group-hover:text-white transition-all ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                      />
                    </div>

                    {/* Summary (collapsed) */}
                    {!isExpanded && (
                      <p className="text-sm text-muted-foreground group-hover:text-white/80 transition-colors line-clamp-2">
                        {lang === "en" ? article.sammary_en : article.summary}
                      </p>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-6 lg:px-20 lg:pb-8 bg-muted/20">
                    <div className="space-y-4">
                      {/* Summary */}
                      <div>
                        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
                          SUMMARY:
                        </span>
                        <p className="text-sm text-foreground">
                          {lang === "en" ? article.sammary_en : article.summary}
                        </p>
                      </div>

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-6 text-xs font-mono text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-3 w-3" />
                          <span>
                            {new Date(article.publishedAt)
                              .toISOString()
                              .split("T")[0]
                              .replace(/-/g, "/")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ClockIcon className="h-3 w-3" />
                          <span>{article.read_time || 5} min read</span>
                        </div>
                      </div>

                      {/* Topics */}
                      {article.topics.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                            TOPICS:
                          </span>
                          {article.topics.map((topic, idx) => (
                            <span
                              key={`${article.id}-topic-${idx}`}
                              className="rounded-none border border-border bg-muted/30 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-foreground"
                            >
                              {topic.topic}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Read Button */}
                      <div className="pt-2">
                        <Link
                          href={`/${lang}/book/${book.id}/${article.id.replace(
                            /-en$/,
                            ""
                          )}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-block border border-border bg-background hover:bg-pink-600 hover:border-pink-600 px-6 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors"
                        >
                          Read Chapter →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {sortedArticles.length === 0 && (
          <div className="text-center py-16 lg:py-24">
            <div className="mb-4 text-4xl">📄</div>
            <p className="text-muted-foreground font-mono text-sm">
              この書籍にはまだ章が登録されていません
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
