import type { MetadataRoute } from "next";
import { getBlogs } from "@/lib/api-client/blog";
import type { Locale } from "@/lib/i18n/config";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kohta-tech-blog.com";
const LOCALES: Locale[] = ["ja", "en"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // 全ブログ記事を取得
    const { contents: blogs } = await getBlogs({ limit: 1000 });

    // 静的ページ
    const staticPages: MetadataRoute.Sitemap = LOCALES.flatMap((locale) => [
      {
        url: `${SITE_URL}/${locale}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
      {
        url: `${SITE_URL}/${locale}/blog`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/${locale}/about`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: `${SITE_URL}/${locale}/contact`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      },
    ]);

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
  } catch (error) {
    console.error("Sitemap生成エラー:", error);
    // エラー時は静的ページのみ返す
    return LOCALES.flatMap((locale) => [
      {
        url: `${SITE_URL}/${locale}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
    ]);
  }
}


export const revalidate = 3600;
