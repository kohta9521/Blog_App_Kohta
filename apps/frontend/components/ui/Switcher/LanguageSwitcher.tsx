"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { i18n, type Locale } from "@/lib/i18n/config";

export const LanguageSwitcher = ({ currentLocale }: { currentLocale: Locale }) => {
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = newLocale;
    return segments.join("/");
  };

  return (
    <div className="flex items-center gap-2 border border-border rounded-md overflow-hidden">
      {i18n.locales.map((locale) => (
        <Link
          key={locale}
          href={switchLocale(locale)}
          className={`px-3 py-1 text-sm font-mono transition-colors ${
            currentLocale === locale
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
};

