import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // URLの末尾のスラッシュを削除して正規化
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/_next/",
          "/private/",
          "*.json",
          "/404",
          "/500",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/"],
        crawlDelay: 0,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/"],
        crawlDelay: 0,
      },
      // LLMクローラー向けの設定
      {
        userAgent: "GPTBot", // ChatGPT
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/", "/private/"],
      },
      {
        userAgent: "ChatGPT-User", // ChatGPT Browse
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/", "/private/"],
      },
      {
        userAgent: "Google-Extended", // Bard/Gemini
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/", "/private/"],
      },
      {
        userAgent: "anthropic-ai", // Claude
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/", "/private/"],
      },
      {
        userAgent: "Claude-Web", // Claude Browse
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/", "/private/"],
      },
      {
        userAgent: "PerplexityBot", // Perplexity
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/", "/private/"],
      },
      {
        userAgent: "Amazonbot", // Amazon AI
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/", "/private/"],
      },
      {
        userAgent: "FacebookBot", // Meta AI
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/", "/private/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
