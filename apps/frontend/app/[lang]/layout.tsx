import type { Metadata } from "next";
import { IBM_Plex_Sans_JP, IBM_Plex_Mono, Literata } from "next/font/google";

// styles
import "@/styles/globals.css";

// i18n
import { i18n, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

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

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

// 修正ポイント1: params の lang を string 型にする
type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  // ここで安全に Locale 型として扱う（generateStaticParamsがあるため安全）
  const locale = lang as Locale;
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
  params: Promise<{ lang: string }>; // 修正ポイント2: ここも string にする
}>) {
  const { lang } = await params;
  const locale = lang as Locale; // 内部で使用するためにキャスト

  return (
    <html lang={locale} className="dark">
      <body
        className={`${ibmPlexSansJP.variable} ${ibmPlexMono.variable} ${literata.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}