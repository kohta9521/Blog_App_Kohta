// components
import { BlogPage } from "@/components/layout/Blog/BlogPage";

// i18n
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <BlogPage lang={lang} dict={dict} />;
}
