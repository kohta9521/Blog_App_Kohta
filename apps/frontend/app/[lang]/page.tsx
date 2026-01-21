// components
import GradationLine from "@/components/ui/Line/GradationLine";
import Header from "@/components/layout/Header/Header";
import Hero from "@/components/layout/Hero/Hero";

// i18n
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import Category from "@/components/layout/Category/Category";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <GradationLine />
      <Header id="header" lang={lang} dict={dict} />
      <Hero lang={lang} dict={dict} />
      <Category />
    </>
  );
}
