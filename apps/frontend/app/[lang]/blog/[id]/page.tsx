import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogDetailPage } from "@/components/layout/Blog/BlogDetailPage";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  getBlogById,
  getAllBlogs,
  getLocalizedBlogId,
  detectLocaleFromBlogId,
} from "@/lib/api-client/blog";
import { TechArticleStructuredData, BreadcrumbStructuredData } from "@/components/seo/StructuredData";

const AUTHOR = "Kohta Kochi";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kohta-tech-blog.com";

type Props = {
  params: Promise<{ lang: Locale; id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BlogDetailRoute({ params }: Props) {
  const { lang, id } = await params;

  // 言語に応じてIDを変換
  const localizedId = getLocalizedBlogId(id, lang);

  // microCMS APIから記事取得
  let article;
  try {
    article = await getBlogById(localizedId);
  } catch (error) {
    console.error(`記事が見つかりません (ID: ${localizedId}):`, error);
    notFound();
  }

  const dict = await getDictionary(lang);

  const articleWithAuthor = {
    ...article,
    author: AUTHOR,
    date: new Date(article.publishedAt).toISOString().split("T")[0],
    topics: article.topics.map((t) => t.topic),
  };

  const articleUrl = `${SITE_URL}/${lang}/blog/${id}`;

  return (
    <>
      {/* 構造化データ */}
      <TechArticleStructuredData
        data={{
          headline: article.title,
          description: article.summary,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
          author: {
            name: AUTHOR,
            url: `${SITE_URL}/${lang}/profile`,
          },
          publisher: {
            name: dict.meta.title,
            logo: `${SITE_URL}/logo_icon.png`,
          },
          url: articleUrl,
          keywords: article.topics.map((t) => t.topic),
          inLanguage: lang,
          proficiencyLevel: "Beginner/Intermediate/Advanced", // 記事の難易度に応じて変更
        }}
      />
      <BreadcrumbStructuredData
        items={[
          { name: dict.common.home, item: `${SITE_URL}/${lang}` },
          { name: "Blog", item: `${SITE_URL}/${lang}/blog` },
          { name: article.title, item: articleUrl },
        ]}
      />
      <BlogDetailPage article={articleWithAuthor} dict={dict} lang={lang} />
    </>
  );
}

/**
 * 動的メタデータ生成（SEO最適化）
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  const localizedId = getLocalizedBlogId(id, lang);

  try {
    const article = await getBlogById(localizedId);

    return {
      title: article.meta_title || article.title,
      description: article.meta_desc || article.summary,
      openGraph: {
        title: article.meta_title || article.title,
        description: article.meta_desc || article.summary,
        type: "article",
        publishedTime: article.publishedAt,
        modifiedTime: article.updatedAt,
        authors: [AUTHOR],
        tags: article.topics.map((t) => t.topic),
        url: `${SITE_URL}/${lang}/blog/${id}`,
        locale: lang,
      },
      twitter: {
        card: "summary_large_image",
        title: article.meta_title || article.title,
        description: article.meta_desc || article.summary,
      },
    };
  } catch {
    return {
      title: lang === "en" ? "Article Not Found" : "記事が見つかりません",
      description:
        lang === "en"
          ? "The article you are looking for does not exist or may have been deleted."
          : "お探しの記事は存在しないか、削除された可能性があります。",
    };
  }
}

/**
 * 静的生成パス
 * - 全記事を取得し、言語に応じてパスを生成
 * - ja: { lang: "ja", id: "xxx" }
 * - en: { lang: "en", id: "xxx" } (xxx-enを取得してxxxに変換)
 */
export async function generateStaticParams() {
  try {
    // 全ブログ記事を取得（ページネーション対応）
    const { contents } = await getAllBlogs({ orders: "-publishedAt" });
    const locales: Locale[] = ["ja", "en"];

    const paths = locales.flatMap((lang) =>
      contents
        .filter((blog) => detectLocaleFromBlogId(blog.id) === lang)
        .map((blog) => ({
          lang,
          // "-en"を削除してベースIDを返す
          id: blog.id.replace(/-en$/, ""),
        }))
    );

    return paths;
  } catch (error) {
    console.error("generateStaticParams エラー:", error);
    return [];
  }
}

export const revalidate = 3600;
