// next
import type { Metadata } from "next";
import {
  IBM_Plex_Sans_JP,
  IBM_Plex_Mono,
  Literata,
  Doto,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// analytics
import { GoogleAnalytics } from "@next/third-parties/google";

// styles
import "@/styles/globals.css";

// i18n
import { i18n, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

// components
import GradationLine from "@/components/ui/Line/GradationLine";
import Header from "@/components/layout/Header/Header";
import { OrganizationStructuredData, WebSiteStructuredData } from "@/components/seo/StructuredData";

const ibmPlexSansJP = IBM_Plex_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-ibm-plex-sans-jp",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const literata = Literata({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-literata",
  display: "swap",
});

const doto = Doto({
  subsets: ["latin"],
  variable: "--font-doto",
  display: "swap",
});

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

// 修正ポイント1: params の lang を string 型にする
type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  // 型安全性向上: Localeの検証
  if (!i18n.locales.includes(lang as Locale)) {
    // デフォルトロケールにフォールバック
    const locale = i18n.defaultLocale;
    const dict = await getDictionary(locale);
    return {
      title: dict.meta.title,
      description: dict.meta.description,
      keywords: dict.meta.keywords,
      openGraph: {
        title: dict.meta.title,
        description: dict.meta.description,
        locale: locale === "ja" ? "ja_JP" : "en_US",
      },
    };
  }

  const locale: Locale = lang as Locale;
  const dict = await getDictionary(locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kohta-tech-blog.com";

  return {
    title: {
      default: dict.meta.title,
      template: `%s | ${dict.meta.title}`,
    },
    description: dict.meta.description,
    keywords: dict.meta.keywords,
    authors: [{ name: "Kohta Kochi", url: `${siteUrl}/${locale}/profile` }],
    creator: "Kohta Kochi",
    publisher: "Kohta Kochi",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        'ja': `${siteUrl}/ja`,
        'en': `${siteUrl}/en`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "ja" ? "ja_JP" : "en_US",
      url: `${siteUrl}/${locale}`,
      title: dict.meta.title,
      description: dict.meta.description,
      siteName: dict.meta.title,
      images: [
        {
          url: `${siteUrl}/logo_icon.png`,
          width: 1200,
          height: 630,
          alt: dict.meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: [`${siteUrl}/logo_icon.png`],
      creator: "@kohtakochi", // 実際のTwitterハンドルに変更
    },
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 5,
    },
    verification: {
      // Google Search Console認証（必要に応じて追加）
      // google: 'your-google-verification-code',
      // Bing Webmaster Tools認証
      // other: { 'msvalidate.01': 'your-bing-verification-code' },
    },
    category: "technology",
  };
}

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;

  // 型安全性向上: Localeの検証とフォールバック
  const locale: Locale = i18n.locales.includes(lang as Locale)
    ? (lang as Locale)
    : i18n.defaultLocale;

  const dict = await getDictionary(locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kohta-tech-blog.com";

  return (
    <html lang={locale} className="dark">
      <head>
        {/* 構造化データ */}
        <OrganizationStructuredData
          data={{
            name: dict.meta.title,
            url: siteUrl,
            logo: `${siteUrl}/logo_icon.png`,
            description: dict.meta.description,
            sameAs: [
              // SNSリンクがあれば追加
              // "https://twitter.com/kohtakochi",
              // "https://github.com/kohtakochi",
            ],
          }}
        />
        <WebSiteStructuredData
          data={{
            name: dict.meta.title,
            url: siteUrl,
            description: dict.meta.description,
            inLanguage: locale,
          }}
        />
      </head>
      <body
        className={`${ibmPlexSansJP.variable} ${ibmPlexMono.variable} ${literata.variable} ${doto.variable} antialiased bg-background text-foreground`}
      >
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
        )}
        <GradationLine />
        <Header id="header" lang={locale} dict={dict} />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
