import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogDetailPage } from "@/components/layout/Blog/BlogDetailPage";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getBooks } from "@/lib/api-client/book";
import {
  getBlogById,
  getLocalizedBlogId,
  detectLocaleFromBlogId,
} from "@/lib/api-client/blog";

const AUTHOR = "Kohta Kochi";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kohta-tech-blog.com";

type Props = {
  params: Promise<{ lang: Locale; id: string; article: string }>;
};

/**
 * Book記事詳細ページ
 */
export default async function BookArticleRoute({ params }: Props) {
  const { lang, id: bookId, article: articleId } = await params;

  // Book情報を取得
  let book;
  try {
    const booksData = await getBooks({ limit: 100 });
    book = booksData.contents.find((b) => b.id === bookId);
    if (!book) {
      notFound();
    }
  } catch (error) {
    console.error(`Book not found (ID: ${bookId}):`, error);
    notFound();
  }

  // 記事を取得
  const localizedArticleId = getLocalizedBlogId(articleId, lang);
  let article;
  try {
    article = await getBlogById(localizedArticleId);
  } catch (error) {
    console.error(`Article not found (ID: ${localizedArticleId}):`, error);
    notFound();
  }

  // book_blogsから記事が含まれているか確認
  const isInBook = book.book_blogs?.some(
    (bb) => bb.id === article.id || bb.id === article.id.replace(/-en$/, "")
  );

  if (!isInBook) {
    console.error(`Article (ID: ${article.id}) is not in Book (ID: ${bookId})`);
    notFound();
  }

  const dict = await getDictionary(lang);

  // book_blogsの配列から、言語に応じた記事リストを取得
  const bookArticles = [];

  if (book.book_blogs) {
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
        bookArticles.push(fullBlog);
      } catch (error) {
        console.error(`記事の取得に失敗 (ID: ${bookBlog.id}):`, error);
      }
    }
  }

  // book_blogsの順序 = Chapter順序なので、現在の記事のインデックスを取得
  const currentIndex = bookArticles.findIndex((a) => a.id === article.id);
  const currentChapterNumber = currentIndex + 1;

  const prevArticle =
    currentIndex > 0
      ? {
          id: bookArticles[currentIndex - 1].id.replace(/-en$/, ""),
          title:
            lang === "en"
              ? bookArticles[currentIndex - 1].title_en
              : bookArticles[currentIndex - 1].title,
          chapterNumber: currentIndex,
        }
      : null;

  const nextArticle =
    currentIndex < bookArticles.length - 1
      ? {
          id: bookArticles[currentIndex + 1].id.replace(/-en$/, ""),
          title:
            lang === "en"
              ? bookArticles[currentIndex + 1].title_en
              : bookArticles[currentIndex + 1].title,
          chapterNumber: currentIndex + 2,
        }
      : null;

  // 記事メタデータを作成（BlogDetailPageの形式に合わせる）
  const articleWithMetadata = {
    id: article.id,
    date: new Date(article.publishedAt).toISOString().split("T")[0],
    title: lang === "en" ? article.title_en : article.title,
    summary: lang === "en" ? article.sammary_en : article.summary,
    author: AUTHOR,
    topics: article.topics.map((t) => t.topic),
    read_time: article.read_time,
    main_contents: article.main_contents,
  };

  // Bookナビゲーション情報を追加
  const bookNavigation = {
    bookId: book.id,
    bookTitle: book.book_title,
    currentChapter: currentChapterNumber,
    totalChapters: bookArticles.length,
    prevChapter: prevArticle
      ? {
          id: prevArticle.id,
          title: prevArticle.title,
          number: prevArticle.chapterNumber,
        }
      : undefined,
    nextChapter: nextArticle
      ? {
          id: nextArticle.id,
          title: nextArticle.title,
          number: nextArticle.chapterNumber,
        }
      : undefined,
  };

  return (
    <BlogDetailPage
      article={articleWithMetadata}
      dict={dict}
      lang={lang}
      bookNavigation={bookNavigation}
    />
  );
}

/**
 * 動的メタデータ生成
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id: bookId, article: articleId } = await params;
  const localizedArticleId = getLocalizedBlogId(articleId, lang);

  try {
    const [booksData, article] = await Promise.all([
      getBooks({ limit: 100 }),
      getBlogById(localizedArticleId),
    ]);

    const book = booksData.contents.find((b) => b.id === bookId);

    if (!book) {
      return {
        title: lang === "en" ? "Book Not Found" : "書籍が見つかりません",
      };
    }

    // book_blogsに記事が含まれているか確認
    const isInBook = book.book_blogs?.some(
      (bb) => bb.id === article.id || bb.id === article.id.replace(/-en$/, "")
    );

    if (!isInBook) {
      return {
        title: lang === "en" ? "Article Not Found" : "記事が見つかりません",
      };
    }

    const title = lang === "en" ? article.title_en : article.title;
    const description = lang === "en" ? article.sammary_en : article.summary;

    return {
      title: `${title} | ${book.book_title}`,
      description: article.meta_desc || description,
      openGraph: {
        title: article.meta_title || title,
        description: article.meta_desc || description,
        type: "article",
        publishedTime: article.publishedAt,
        modifiedTime: article.updatedAt,
        authors: [AUTHOR],
        tags: article.topics.map((t) => t.topic),
        url: `${SITE_URL}/${lang}/book/${bookId}/${articleId}`,
        locale: lang,
      },
      twitter: {
        card: "summary_large_image",
        title: article.meta_title || title,
        description: article.meta_desc || description,
      },
    };
  } catch {
    return {
      title: lang === "en" ? "Article Not Found" : "記事が見つかりません",
    };
  }
}

/**
 * 静的生成パス
 */
export async function generateStaticParams() {
  try {
    const booksData = await getBooks({ limit: 100 });
    const locales: Locale[] = ["ja", "en"];

    const paths: Array<{ lang: Locale; id: string; article: string }> = [];

    for (const book of booksData.contents) {
      if (book.book_blogs && book.book_blogs.length > 0) {
        // 日本語記事（-enで終わらない）
        const jaBlogs = book.book_blogs.filter((bb) => !bb.id.endsWith("-en"));
        jaBlogs.forEach((bookBlog) => {
          paths.push({
            lang: "ja",
            id: book.id,
            article: bookBlog.id,
          });
        });

        // 英語記事（-enで終わる）
        const enBlogs = book.book_blogs.filter((bb) => bb.id.endsWith("-en"));
        enBlogs.forEach((bookBlog) => {
          paths.push({
            lang: "en",
            id: book.id,
            article: bookBlog.id.replace(/-en$/, ""),
          });
        });
      }
    }

    return paths;
  } catch (error) {
    console.error("generateStaticParams error:", error);
    return [];
  }
}

export const revalidate = 3600;
