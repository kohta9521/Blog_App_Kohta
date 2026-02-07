import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BookDetailPage } from "@/components/layout/Book/BookDetailPage";
import type { Locale } from "@/lib/i18n/config";
import { getBooks } from "@/lib/api-client/book";
import { getBlogById } from "@/lib/api-client/blog";
import { getTopics } from "@/lib/api-client/topic";
import type { Blog } from "@/schema/blog";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kohta-tech-blog.com";

type Props = {
  params: Promise<{ lang: Locale; id: string }>;
};

/**
 * Book詳細ページ（Chapter一覧）
 */
export default async function BookDetailRoute({ params }: Props) {
  const { lang, id } = await params;

  // Book情報を取得
  let book;
  try {
    const booksData = await getBooks({ limit: 100 });
    book = booksData.contents.find((b) => b.id === id);
    if (!book) {
      notFound();
    }
  } catch (error) {
    console.error(`Book not found (ID: ${id}):`, error);
    notFound();
  }

  // book_blogsから記事を取得し、完全なBlog情報を取得
  const [topicsData] = await Promise.all([getTopics({ limit: 100 })]);

  const bookArticles: Blog[] = [];

  if (book.book_blogs && book.book_blogs.length > 0) {
    // 言語に応じて記事をフィルタリング
    // 日本語: -enで終わらないIDのみ
    // 英語: -enで終わるIDのみ
    const filteredBlogs = book.book_blogs.filter((bookBlog) => {
      const isEnglish = bookBlog.id.endsWith("-en");
      return lang === "en" ? isEnglish : !isEnglish;
    });

    // フィルタリングされた記事を取得
    for (const bookBlog of filteredBlogs) {
      try {
        const fullBlog = await getBlogById(bookBlog.id);

        // Topicsを完全な情報で補完
        const enrichedBlog: Blog = {
          ...fullBlog,
          topics: fullBlog.topics.map((t) => {
            const fullTopic = topicsData.contents.find(
              (topic) => topic.id === t.id
            );
            return fullTopic || t;
          }),
        };

        bookArticles.push(enrichedBlog);
      } catch (error) {
        console.error(`記事の取得に失敗 (ID: ${bookBlog.id}):`, error);
        // エラーが発生しても続行
      }
    }
  }

  return <BookDetailPage lang={lang} book={book} articles={bookArticles} />;
}

/**
 * 動的メタデータ生成
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;

  try {
    const booksData = await getBooks({ limit: 100 });
    const book = booksData.contents.find((b) => b.id === id);

    if (!book) {
      return {
        title: lang === "en" ? "Book Not Found" : "書籍が見つかりません",
      };
    }

    return {
      title: `${book.book_title} | Books`,
      description: `${book.book_title}の全チャプター一覧`,
      openGraph: {
        title: book.book_title,
        description: `${book.book_title}の全チャプター一覧`,
        type: "website",
        url: `${SITE_URL}/${lang}/book/${id}`,
        locale: lang,
      },
    };
  } catch {
    return {
      title: lang === "en" ? "Book Not Found" : "書籍が見つかりません",
    };
  }
}

/**
 * 静的生成パス
 */
export async function generateStaticParams() {
  try {
    const { contents } = await getBooks({ limit: 100 });
    const locales: Locale[] = ["ja", "en"];

    return locales.flatMap((lang) =>
      contents.map((book) => ({
        lang,
        id: book.id,
      }))
    );
  } catch (error) {
    console.error("generateStaticParams error:", error);
    return [];
  }
}

export const revalidate = 3600;
