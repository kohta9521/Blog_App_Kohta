import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import Link from "next/link";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const terms = dict.legal?.terms;

  if (!terms) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="w-full px-4 max-w-screen-3xl mx-auto py-4 sm:py-6 lg:w-11/12 lg:px-0 lg:py-6">
        {/* Title */}
        <div className="mb-8 lg:mb-12">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-doto font-normal tracking-tight mb-4">
            {terms.title}
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground font-mono mb-2">
            {terms.subtitle}
          </p>
          <span className="block w-full h-1 border-b"></span>
        </div>

        {/* Main Contents */}
        <div id="main-contents" className="w-full h-auto py-6 space-y-8">
          {/* Last Updated */}
          <div className="text-xs text-muted-foreground font-mono">
            {terms.lastUpdated}
          </div>

          {/* Sections */}
          {terms.sections.map((section, index) => (
            <section key={index} className="space-y-3">
              <h2 className="text-lg font-mono font-medium tracking-tight border-b pb-2">
                {section.title}
              </h2>
              <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {section.content}
              </div>
            </section>
          ))}

          {/* Back Link */}
          <div className="pt-8 border-t">
            <Link
              href={`/${lang}/contact`}
              className="inline-flex items-center text-xs font-mono border-b border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors duration-200"
            >
              ← {lang === "ja" ? "お問い合わせに戻る" : "Back to Contact"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
