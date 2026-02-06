import { notFound } from "next/navigation";
import { BlogDetailPage } from "@/components/layout/Blog/BlogDetailPage";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const AUTHOR = "Kohta Kochi";

type Props = {
  params: Promise<{ lang: Locale; id: string }>;
  /** API連携時に使用。fetch(`/api/blog/${id}?${new URLSearchParams(await searchParams)}`) */
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * ブログ詳細ページ
 * - params.id: ルートのブログID（/blog/[id]）
 * - searchParams: クエリパラメータ。API連携時に使用
 */
export default async function BlogDetailRoute({ params }: Props) {
  const { lang, id } = await params;

  const dict = await getDictionary(lang);
  const raw = dict.blog?.articles ?? [];
  const article = raw.find((a) => a.id === id);

  if (!article) {
    notFound();
  }

  // バックエンドAPI連携時はここで fetch。例:
  // const res = await fetch(`${API_BASE}/blog/${id}?${new URLSearchParams(query)}`);
  // const article = await res.json();
  const articleWithAuthor = { ...article, author: AUTHOR };

  return <BlogDetailPage article={articleWithAuthor} dict={dict} lang={lang} />;
}
