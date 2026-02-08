"use client";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Book } from "@/schema/book";

type BooksListPageProps = {
  lang: Locale;
  books: Book[];
  bookArticleCounts: Record<string, number>;
};

export const BooksListPage = ({
  lang,
  books,
  bookArticleCounts,
}: BooksListPageProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="w-full px-4 max-w-screen-3xl mx-auto py-4 sm:py-6 lg:w-11/12 lg:px-0 lg:py-6">
        {/* Title */}
        <div className="mb-8 lg:mb-12">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-doto font-normal tracking-tight mb-4">
            BOOKS
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground font-mono mb-2">
            / Books Collection
          </p>
          <span className="block w-full h-1 border-b"></span>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {books.map((book) => {
            const articleCount = bookArticleCounts[book.id] || 0;
            return (
              <Link
                key={book.id}
                href={`/${lang}/book/${book.id}`}
                className="group block border border-border bg-card hover:bg-pink-600 transition-colors duration-300"
              >
                <div className="p-6 lg:p-6">
                  {/* Book Image/Placeholder */}
                  <div className="w-full h-52 relative mb-4">
                    {book.book_image ? (
                      // 画像がある場合
                      <>
                        <Image
                          src={book.book_image.url}
                          alt={book.book_title}
                          width={book.book_image.width}
                          height={book.book_image.height}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-0 right-0 w-11/12 mx-auto flex items-center justify-between">
                          <div className="h-12 w-12 border border-border bg-muted/30 flex items-center justify-center group-hover:border-white group-hover:bg-white/10 transition-colors">
                            <span className="text-lg font-mono font-bold text-foreground group-hover:text-white">
                              {book.book_emoji || "📖"}
                            </span>
                          </div>
                          <span className="text-xs font-mono text-muted-foreground group-hover:text-white/80 transition-colors">
                            {articleCount}{" "}
                            {articleCount === 1 ? "CHAPTER" : "CHAPTERS"}
                          </span>
                        </div>
                      </>
                    ) : (
                      // 画像がない場合：黒いボックス
                      <div className="w-full h-full bg-black flex items-center justify-center">
                        <div className="absolute top-3 left-0 right-0 w-11/12 mx-auto flex items-center justify-between">
                          <div className="h-12 w-12 border border-white/20 bg-white/5 flex items-center justify-center group-hover:border-white group-hover:bg-white/10 transition-colors">
                            <span className="text-lg font-mono font-bold text-white">
                              {book.book_emoji || "📖"}
                            </span>
                          </div>
                          <span className="text-xs font-mono text-white/60 group-hover:text-white/80 transition-colors">
                            {articleCount}{" "}
                            {articleCount === 1 ? "CHAPTER" : "CHAPTERS"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Book Title */}
                  <h2 className="text-xl lg:text-2xl font-mono font-semibold text-foreground group-hover:text-white transition-colors mb-3 line-clamp-2">
                    {book.book_title}
                  </h2>

                  {/* Book Description */}
                  <p className="text-foreground-muted text-sm mb-6">
                    {book.book_description_en}
                  </p>

                  {/* Metadata */}
                  <div className="text-xs font-mono flex gap-5 items-center text-muted-foreground group-hover:text-white/70 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="shrink-0">PUBLISHED:</span>
                      <span>
                        {new Date(book.publishedAt)
                          .toISOString()
                          .split("T")[0]
                          .replace(/-/g, "/")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="shrink-0">UPDATED:</span>
                      <span>
                        {new Date(book.updatedAt)
                          .toISOString()
                          .split("T")[0]
                          .replace(/-/g, "/")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Read More Footer */}
                <div className="border-t border-border px-6 py-3 lg:px-8 lg:py-4 bg-muted/20 group-hover:bg-white/10 transition-colors">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground group-hover:text-white transition-colors">
                    Read Book →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {books.length === 0 && (
          <div className="text-center py-16 lg:py-24">
            <div className="mb-4 text-4xl">📚</div>
            <p className="text-muted-foreground font-mono text-sm">
              書籍はまだ登録されていません
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
