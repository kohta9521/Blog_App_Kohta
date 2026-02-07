import type { MetadataRoute } from "next";
import type { Locale } from "@/lib/i18n/config";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kohta-tech-blog.com";
const LOCALES: Locale[] = ["ja", "en"];

/**
 * サイトマップ生成
 *
 * 注意: ビルド時に環境変数が利用できない場合があるため、
 * 動的なブログ記事の取得はランタイムで行う
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 静的ページのみを含むサイトマップ
  const staticPages: MetadataRoute.Sitemap = LOCALES.flatMap((locale) => [
    {
      url: `${SITE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/${locale}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/${locale}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ]);

  // ランタイムでブログ記事を取得する場合は、ここで動的にインポート
  try {
    // 環境変数が設定されている場合のみAPIを呼び出す
    if (process.env.MICROCMS_SERVICE_DOMAIN && process.env.MICROCMS_API_KEY) {
      const { getBlogs } = await import("@/lib/api-client/blog");
      const { contents: blogs } = await getBlogs({ limit: 1000 });

      // ブログ記事の動的ページ
      const blogPages: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
        blogs.map((blog) => ({
          url: `${SITE_URL}/${locale}/blog/${blog.id}`,
          lastModified: new Date(blog.updatedAt),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }))
      );

      return [...staticPages, ...blogPages];
    }
  } catch (error) {
    console.warn(
      "Sitemap: ブログ記事の取得をスキップ（環境変数未設定）",
      error
    );
  }

  // デフォルトは静的ページのみ
  return staticPages;
}

export const revalidate = 3600;
