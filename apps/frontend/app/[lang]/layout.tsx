// next
import type { Metadata } from "next";
import {
  IBM_Plex_Sans_JP,
  IBM_Plex_Mono,
  Literata,
  Doto,
} from "next/font/google";

// styles
import "@/styles/globals.css";

// i18n
import { i18n, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

// components
import GradationLine from "@/components/ui/Line/GradationLine";
import Header from "@/components/layout/Header/Header";

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

  return (
    <html lang={locale} className="dark">
      <body
        className={`${ibmPlexSansJP.variable} ${ibmPlexMono.variable} ${literata.variable} ${doto.variable} antialiased bg-background text-foreground`}
      >
        <GradationLine />
        <Header id="header" lang={locale} dict={dict} />
        {children}
      </body>
    </html>
  );
}
