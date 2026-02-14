import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kohta-tech-blog.com";
  
  const title = lang === "ja" 
    ? "このブログについて | 河内光太のテックブログ"
    : "About This Blog | Kohta Kochi's Tech Blog";
  
  const description = lang === "ja"
    ? "Rust、Next.js、フルスタック開発の技術ブログ。学習院大学法学部の学生エンジニア・河内光太によるWeb開発、イベント企画、技術コミュニティ運営の記録。"
    : "Tech blog about Rust, Next.js, and full-stack development by Kohta Kochi, a student engineer at Gakushuin University studying law and computer science.";

  return {
    title,
    description,
    keywords: lang === "ja"
      ? "河内光太, テックブログ, Rust, Next.js, フルスタック, Web開発, 学習院大学, エンジニア, 法学部"
      : "Kohta Kochi, Tech Blog, Rust, Next.js, Full-Stack, Web Development, Gakushuin University, Engineer",
    authors: [{ name: "Kohta Kochi", url: `${siteUrl}/${lang}/profile` }],
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${lang}/about`,
      type: "profile",
      locale: lang === "ja" ? "ja_JP" : "en_US",
      images: [{
        url: `${siteUrl}/logo_icon.png`,
        width: 1200,
        height: 630,
        alt: title,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/logo_icon.png`],
    },
    alternates: {
      canonical: `${siteUrl}/${lang}/about`,
      languages: {
        'ja': `${siteUrl}/ja/about`,
        'en': `${siteUrl}/en/about`,
      },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="w-full px-4 max-w-screen-3xl mx-auto py-4 sm:py-6 lg:w-11/12 lg:px-0 lg:py-6">
        {/* Title */}
        <div className="mb-8 lg:mb-12">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-doto font-normal tracking-tight mb-4">
            {dict.about.title}
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground font-mono mb-2">
            {dict.about.subtitle}
          </p>
          <span className="block w-full h-1 border-b"></span>
        </div>

        {/* Main Contents */}
        <div id="main-contents" className="w-full h-auto py-6 space-y-12">
          {/* Intro Section */}
          <section className="space-y-3">
            <h2 className="text-xl font-mono font-normal tracking-tight border-b pb-2">
              {dict.about.intro.title}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {dict.about.intro.content}
            </p>
          </section>

          {/* Author Section */}
          <section className="space-y-3">
            <h2 className="text-xl font-mono font-normal tracking-tight border-b pb-2">
              {dict.about.author.title}
            </h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <span className="px-2 py-1 border rounded-sm">
                  {dict.about.author.role}
                </span>
                <span className="px-2 py-1 border rounded-sm">
                  {dict.about.author.location}
                </span>
                <span className="px-2 py-1 border rounded-sm">
                  {dict.about.author.education}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {dict.about.author.description}
              </p>
              <div className="pt-2">
                <Link
                  href={`/${lang}/profile`}
                  className="inline-flex items-center text-xs font-mono border-b border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors duration-200"
                >
                  {dict.about.author.viewProfile}
                  <span className="ml-1">→</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Tech Stack Section */}
          <section className="space-y-3">
            <h2 className="text-xl font-mono font-normal tracking-tight border-b pb-2">
              {dict.about.tech.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Frontend */}
              <div className="border rounded-sm p-4 space-y-2">
                <h3 className="text-sm font-mono font-medium">
                  {dict.about.tech.frontend.title}
                </h3>
                <ul className="space-y-1">
                  {dict.about.tech.frontend.stack.map((tech: string) => (
                    <li key={tech} className="text-xs text-muted-foreground font-mono">
                      · {tech}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Backend */}
              <div className="border rounded-sm p-4 space-y-2">
                <h3 className="text-sm font-mono font-medium">
                  {dict.about.tech.backend.title}
                </h3>
                <ul className="space-y-1">
                  {dict.about.tech.backend.stack.map((tech: string) => (
                    <li key={tech} className="text-xs text-muted-foreground font-mono">
                      · {tech}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Infrastructure */}
              <div className="border rounded-sm p-4 space-y-2">
                <h3 className="text-sm font-mono font-medium">
                  {dict.about.tech.infrastructure.title}
                </h3>
                <ul className="space-y-1">
                  {dict.about.tech.infrastructure.stack.map((tech: string) => (
                    <li key={tech} className="text-xs text-muted-foreground font-mono">
                      · {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground mt-4">
              {dict.about.tech.description}
            </p>
          </section>

          {/* Goals Section */}
          <section className="space-y-3">
            <h2 className="text-xl font-mono font-normal tracking-tight border-b pb-2">
              {dict.about.goals.title}
            </h2>
            <ul className="space-y-2">
              {dict.about.goals.items.map((item: string) => (
                <li key={item} className="text-sm text-muted-foreground flex items-start">
                  <span className="mr-2">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* CTA Section */}
          <section className="pt-8 pb-4">
            <div className="border-t pt-8 flex flex-col items-center space-y-4">
              <p className="text-sm font-mono text-center">
                {dict.about.cta.title}
              </p>
              <Link
                href={`/${lang}/blog`}
                className="group relative inline-flex items-center justify-center px-8 py-3 font-mono text-sm border rounded-sm transition-all duration-300 hover:bg-foreground hover:text-background"
              >
                <span className="relative z-10">{dict.about.cta.button}</span>
                <span className="absolute right-4 opacity-0 group-hover:opacity-100 group-hover:right-3 transition-all duration-300">
                  →
                </span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
