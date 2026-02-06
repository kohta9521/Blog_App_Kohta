// components
import { BlogPage } from "@/components/layout/Blog/BlogPage";

// i18n
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

// API
import { getBlogs, detectLocaleFromBlogId } from "@/lib/api-client/blog";
import { getTopics } from "@/lib/api-client/topic";

/**
 * ホームページ (Server Component)
 * - microCMS APIからブログ一覧とトピックを取得
 * - IDサフィックス(-en)で言語フィルタリング
 */
export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  // 並列でデータ取得（limitは最大100）
  const [blogsData, topicsData] = await Promise.all([
    getBlogs({ limit: 100, orders: "-publishedAt" }),
    getTopics({ limit: 100 }),
  ]);

  // 言語に応じてフィルタリング（IDサフィックスで判定）
  const filteredBlogs = blogsData.contents.filter(
    (blog) => detectLocaleFromBlogId(blog.id) === lang
  );

  return (
    <BlogPage
      lang={lang}
      dict={dict}
      blogs={filteredBlogs}
      topics={topicsData.contents}
    />
  );
}

/**
 * ISR設定: 1時間ごとに再生成
 */
export const revalidate = 3600;
