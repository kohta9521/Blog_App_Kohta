"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { Globe, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n/config";
import styles from "@/styles/blogDetail.module.css";
import hljs from "highlight.js/lib/core";

// 必要な言語を個別にインポート（バンドルサイズ削減）
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import rust from "highlight.js/lib/languages/rust";
import go from "highlight.js/lib/languages/go";
import java from "highlight.js/lib/languages/java";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import sql from "highlight.js/lib/languages/sql";
import yaml from "highlight.js/lib/languages/yaml";

// 言語を登録
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("go", go);
hljs.registerLanguage("java", java);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("json", json);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("yaml", yaml);

type ArticleMeta = {
  id: string;
  date: string;
  title: string;
  summary: string;
  author: string;
  topics: string[];
  read_time?: number;
  main_contents?: string;
};

type BlogDetailPageProps = {
  article: ArticleMeta;
  dict: Dictionary;
  lang: Locale;
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
    tableOfContents: "TABLE OF CONTENTS",
  };
  const titleRef = useRef<HTMLDivElement>(null);
  const [showSidebarTitle, setShowSidebarTitle] = useState(false);

  // HTMLから見出しを抽出（useMemoで最適化）
  const headings = useMemo(() => {
    if (!article.main_contents) return [];

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(article.main_contents, "text/html");
      const headingElements = doc.querySelectorAll("h2, h3");

      return Array.from(headingElements).map((heading, index) => {
        const text = heading.textContent?.trim() || "";
        const level = parseInt(heading.tagName.substring(1));
        const id = `heading-${index}`;
        return { id, text, level };
      });
    } catch {
      return [];
    }
  }, [article.main_contents]);

  // Sticky titleの表示制御
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

  // レンダリング後にHTMLの見出しにIDを追加（目次リンク用）
  useEffect(() => {
    if (headings.length === 0) return;

    const articleElement = document.querySelector(`.${styles.articleContent}`);
    if (!articleElement) return;

    const headingElements = articleElement.querySelectorAll("h2, h3");
    headingElements.forEach((heading, index) => {
      heading.id = `heading-${index}`;
    });
  }, [headings]);

  // コードブロックにシンタックスハイライトとファイル名を適用
  useEffect(() => {
    const articleElement = document.querySelector(`.${styles.articleContent}`);
    if (!articleElement) return;

    const codeBlocks = articleElement.querySelectorAll("pre code");
    codeBlocks.forEach((block) => {
      const codeElement = block as HTMLElement;
      const preElement = codeElement.parentElement as HTMLElement;

      // 既にハイライト済みの場合はスキップ
      if (codeElement.dataset.highlighted) return;

      // class名から言語とファイル名を取得
      // 例: "language-javascript:main.js" や "language-rust"
      const className = codeElement.className || "";
      const match = className.match(/language-([a-zA-Z]+)(?::(.+))?/);

      if (match) {
        const language = match[1];
        const filename = match[2];

        // ファイル名がある場合、ヘッダーを追加
        if (filename && !preElement.previousElementSibling?.classList.contains("code-header")) {
          const header = document.createElement("div");
          header.className = "code-header";
          header.textContent = filename;
          preElement.parentNode?.insertBefore(header, preElement);
        }

        // シンタックスハイライトを適用
        try {
          if (hljs.getLanguage(language)) {
            const result = hljs.highlight(codeElement.textContent || "", {
              language,
            });
            codeElement.innerHTML = result.value;
            codeElement.dataset.highlighted = "true";
            codeElement.classList.add(`language-${language}`);
          } else {
            // 未対応の言語の場合は自動検出
            const result = hljs.highlightAuto(codeElement.textContent || "");
            codeElement.innerHTML = result.value;
            codeElement.dataset.highlighted = "true";
          }
        } catch (error) {
          console.error("Syntax highlighting error:", error);
        }
      }
    });
  }, [article.main_contents]);

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://kohta-tech-blog.com";
  const shareUrl = `${baseUrl}/${lang}/blog/${article.id}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const text = encodeURIComponent(article.title);
  const twitterHref = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`;
  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  return (
    <article className="min-h-screen bg-black text-neutral-100">
      <div className="w-full px-4 max-w-screen-2xl mx-auto py-6 sm:py-10 lg:px-6 lg:py-16 xl:px-8 xl:py-20">
        {/* Title + Decorative + */}
        <div ref={titleRef} className="relative mb-10 sm:mb-14 lg:mb-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6 pr-14 sm:pr-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white tracking-tight">
              {article.title}
            </h1>
            <div className="shrink-0 hidden sm:flex items-center gap-2 text-neutral-400 text-lg sm:text-xl md:text-2xl">
              <Globe className="w-6 h-6 sm:w-7 sm:h-7" />
              <Code2 className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
          </div>
          <div className="absolute -right-2 top-0 sm:hidden text-neutral-600 text-4xl font-extralight">
            +
          </div>
        </div>

        {/* Three Column Layout: Metadata + Article + TOC */}
        <div className="flex flex-col gap-10 sm:gap-12 lg:flex-row lg:gap-8 xl:gap-12">
          {/* Left: Metadata - モバイルで上、PCで左 */}
          <aside className="w-full shrink-0 order-1 lg:order-1 lg:w-48 xl:w-56 lg:sticky lg:top-20 lg:self-start">
            <div className="border-b border-neutral-600 pb-2 mb-6 sm:mb-8">
              <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-neutral-400">
                / {labels.metadata}
              </p>
            </div>

            {/* Sticky Title (PCのみ) - スクロール時のみ表示 */}
            {showSidebarTitle && (
              <div className="hidden lg:grid gap-4 mb-8 transition-all duration-300">
                <h2 className="text-base font-semibold text-white leading-tight">
                  {article.title}
                </h2>
              </div>
            )}

            {/* Metadata Items */}
            <div className="space-y-0">
              <div className="flex items-center justify-between gap-4 border-b border-dotted border-neutral-600 py-4">
                <p className="shrink-0 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  {labels.date}:
                </p>
                <p className="text-right text-xs sm:text-xs text-neutral-200">
                  {article.date}
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-dotted border-neutral-600 py-4">
                <p className="shrink-0 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  {labels.author}:
                </p>
                <span className="text-right text-xs sm:text-xs text-neutral-200">
                  {article.author}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-dotted border-neutral-600 py-4">
                <p className="shrink-0 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  {labels.readingTime}:
                </p>
                <p className="text-right text-xs sm:text-xs text-neutral-200">
                  {article.read_time || 5} {labels.minRead}
                </p>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-dotted border-neutral-600 py-4">
                <p className="shrink-0 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  {labels.categories}:
                </p>
                <div className="flex flex-wrap justify-end gap-2">
                  {article.topics.map((topic, i) => (
                    <span
                      key={i}
                      className="rounded-none border border-neutral-600 bg-neutral-800/50 px-2 py-0.5 text-[10px] sm:text-[11px] text-neutral-300 hover:bg-pink-500 hover:text-white duration-400 transition-all cursor-pointer"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <p className="shrink-0 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  {labels.share}:
                </p>
                <div className="flex items-center gap-3">
                  <Link
                    href={twitterHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-7 w-7 items-center justify-center rounded-none border border-neutral-600 bg-neutral-800/50 text-neutral-300 hover:bg-pink-500 hover:text-white duration-400 transition-all cursor-pointer"
                  >
                    <span className="text-xs font-semibold">X</span>
                  </Link>
                  <Link
                    href={linkedInHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-7 w-7 items-center justify-center rounded-none border border-neutral-600 bg-neutral-800/50 text-neutral-300 hover:bg-pink-500 hover:text-white duration-400 transition-all cursor-pointer"
                  >
                    <span className="text-xs font-semibold">in</span>
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
            {/* microCMSから取得したHTMLコンテンツ */}
            <div
              className={styles.articleContent}
              dangerouslySetInnerHTML={{
                __html:
                  article.main_contents || "<p>記事の内容がありません。</p>",
              }}
            />
          </main>

          {/* Right: Table of Contents - PCのみ表示 */}
          {headings.length > 0 && (
            <aside className="hidden xl:block w-64 shrink-0 order-3 lg:sticky lg:top-20 lg:self-start">
              <div className="border-b border-neutral-600 pb-2 mb-6">
                <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-neutral-400">
                  / {labels.tableOfContents}
                </p>
              </div>
              <nav className="space-y-2">
                {headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const target = document.getElementById(heading.id);
                      if (target) {
                        target.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }}
                    className={cn(
                      "block text-xs text-neutral-400 hover:text-white transition-colors leading-relaxed cursor-pointer",
                      heading.level === 3 && "pl-4"
                    )}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            </aside>
          )}
        </div>
      </div>
    </article>
  );
}
