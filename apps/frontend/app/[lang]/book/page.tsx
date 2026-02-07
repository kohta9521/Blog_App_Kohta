import { BooksListPage } from "@/components/layout/Book/BooksListPage";
import type { Locale } from "@/lib/i18n/config";
import { getBooks } from "@/lib/api-client/book";

/**
 * Books一覧ページ (Server Component)
 * - microCMS APIから全Bookを取得
 * - 各Bookの記事数は book_blogs 配列から取得
 */
export default async function BooksPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  // Bookデータを取得
  const booksData = await getBooks({ limit: 100, orders: "publishedAt" });

  // 各Bookの記事数を book_blogs 配列からカウント
  const bookArticleCounts: Record<string, number> = {};
  booksData.contents.forEach((book) => {
    // book_blogs配列の長さが記事数
    bookArticleCounts[book.id] = book.book_blogs?.length || 0;
  });

  return (
    <BooksListPage
      lang={lang}
      books={booksData.contents}
      bookArticleCounts={bookArticleCounts}
    />
  );
}

export const revalidate = 3600;
