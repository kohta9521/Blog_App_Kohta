import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getBlogs, detectLocaleFromBlogId } from "@/lib/api-client/blog";
import { getTopics } from "@/lib/api-client/topic";
import { BlogPage as BlogPageComponent } from "@/components/layout/Blog/BlogPage";

/**
 * ブログ一覧ページ (Server Component)
 * - IDサフィックス(-en)で言語判定・フィルタリング
 */
export default async function BlogPage({
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

  // 言語に応じてフィルタリング
  const filteredBlogs = blogsData.contents.filter(
    (blog) => detectLocaleFromBlogId(blog.id) === lang
  );

  return (
    <BlogPageComponent
      lang={lang}
      dict={dict}
      blogs={filteredBlogs}
      topics={topicsData.contents}
    />
  );
}

/**
 * Next.js 15のキャッシュ設定
 * - revalidate: ISR（Incremental Static Regeneration）の間隔（秒）
 * - 3600 = 1時間ごとに再生成
 */
export const revalidate = 3600;
