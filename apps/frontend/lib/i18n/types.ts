export type Dictionary = {
  common: {
    home: string;
    about: string;
    blog: string;
    contact: string;
    search: string;
    console?: string;
    language: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  blog: {
    category: string;
    author: string;
    date: string;
    readMore: string;
    /** モック記事一覧。バックエンド連携時に削除 */
    articles?: Array<{
      id: string;
      date: string;
      title: string;
      summary: string;
      topics: string[];
    }>;
  };
  filters?: {
    title: string;
    topic: string;
  };
  footer?: {
    docs: string;
    docsDesc: string;
    learnMore: string;
    social: string;
    resources: string;
    copyright: string;
    privacy: string;
    legal: string;
  };
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
};

