import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import Link from "next/link";

export default async function ContactCompletePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const complete = dict.contact?.complete;

  if (!complete) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="w-full px-4 max-w-screen-3xl mx-auto py-4 sm:py-6 lg:w-11/12 lg:px-0 lg:py-6">
        {/* Title */}
        <div className="mb-8 lg:mb-12">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-doto font-normal tracking-tight mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {complete.title}
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground font-mono mb-2 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100">
            {complete.subtitle}
          </p>
          <span className="block w-full h-1 border-b animate-in fade-in slide-in-from-left duration-700 delay-200"></span>
        </div>

        {/* Main Contents */}
        <div
          id="main-contents"
          className="w-full h-auto py-6 space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300"
        >
          {/* Success Icon */}
          <div className="flex justify-center py-8">
            <div className="relative">
              <div className="w-24 h-24 border-2 border-foreground rounded-full flex items-center justify-center animate-in zoom-in duration-500 delay-400">
                <svg
                  className="w-12 h-12 text-foreground animate-in zoom-in duration-500 delay-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 border-2 border-foreground rounded-full animate-ping opacity-20"></div>
            </div>
          </div>

          {/* Message Section */}
          <section className="space-y-4 text-center">
            <h2 className="text-2xl font-mono font-medium tracking-tight">
              {complete.message.title}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              {complete.message.description}
            </p>
          </section>

          {/* Note Section */}
          <section className="space-y-4">
            <div className="border rounded-sm p-6 bg-muted/30 backdrop-blur-sm">
              <h3 className="text-sm font-mono font-medium mb-4 pb-2 border-b">
                {complete.note.title}
              </h3>
              <ul className="space-y-3">
                {complete.note.items.map((item, index) => (
                  <li
                    key={index}
                    className="text-sm text-muted-foreground flex items-start animate-in fade-in slide-in-from-left duration-500"
                    style={{ animationDelay: `${600 + index * 100}ms` }}
                  >
                    <span className="mr-3 mt-0.5 flex-shrink-0">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Decorative Elements */}
          <div className="relative py-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-background text-xs font-mono text-muted-foreground">
                ···
              </span>
            </div>
          </div>

          {/* Back to Home Button */}
          <section className="flex justify-center pt-4 pb-8">
            <Link
              href={`/${lang}`}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-mono text-sm border rounded-sm transition-all duration-300 hover:bg-foreground hover:text-background"
            >
              <span className="absolute left-4 opacity-0 group-hover:opacity-100 group-hover:left-3 transition-all duration-300">
                ←
              </span>
              <span className="relative z-10">{complete.backToHome}</span>
            </Link>
          </section>

          {/* Animated Background Pattern */}
          <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none opacity-5">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-foreground rounded-full animate-pulse"></div>
            <div
              className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-foreground rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-1/2 right-1/3 w-32 h-32 border border-foreground rounded-full animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
