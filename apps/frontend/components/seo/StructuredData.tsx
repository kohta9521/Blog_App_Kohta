/**
 * 構造化データ（JSON-LD）コンポーネント
 * 
 * 検索エンジンやLLMがコンテンツを理解しやすくするための
 * Schema.org形式の構造化データを生成します。
 */

export type OrganizationData = {
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[]; // SNSリンクなど
};

export type WebSiteData = {
  name: string;
  url: string;
  description: string;
  inLanguage: string;
};

export type BlogPostData = {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified: string;
  author: {
    name: string;
    url?: string;
  };
  publisher: {
    name: string;
    logo: string;
  };
  url: string;
  keywords?: string[];
  articleSection?: string;
  inLanguage: string;
};

export type BreadcrumbItem = {
  name: string;
  item: string;
};

export type PersonData = {
  name: string;
  url: string;
  image?: string;
  jobTitle: string;
  description: string;
  email?: string;
  sameAs?: string[]; // SNS links
  worksFor?: {
    name: string;
    url?: string;
  }[];
  alumniOf?: {
    name: string;
    url?: string;
  }[];
  knowsAbout?: string[];
};

/**
 * Organization構造化データ
 */
export function OrganizationStructuredData({ data }: { data: OrganizationData }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data.name,
    url: data.url,
    logo: {
      "@type": "ImageObject",
      url: data.logo,
    },
    description: data.description,
    ...(data.sameAs && { sameAs: data.sameAs }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * WebSite構造化データ（検索ボックス付き）
 */
export function WebSiteStructuredData({ data }: { data: WebSiteData }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: data.name,
    url: data.url,
    description: data.description,
    inLanguage: data.inLanguage,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${data.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * BlogPosting構造化データ
 */
export function BlogPostStructuredData({ data }: { data: BlogPostData }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.headline,
    description: data.description,
    ...(data.image && {
      image: {
        "@type": "ImageObject",
        url: data.image,
      },
    }),
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    author: {
      "@type": "Person",
      name: data.author.name,
      ...(data.author.url && { url: data.author.url }),
    },
    publisher: {
      "@type": "Organization",
      name: data.publisher.name,
      logo: {
        "@type": "ImageObject",
        url: data.publisher.logo,
      },
    },
    url: data.url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": data.url,
    },
    ...(data.keywords && { keywords: data.keywords.join(", ") }),
    ...(data.articleSection && { articleSection: data.articleSection }),
    inLanguage: data.inLanguage,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * BreadcrumbList構造化データ
 */
export function BreadcrumbStructuredData({ items }: { items: BreadcrumbItem[] }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * TechArticle構造化データ（技術記事用）
 */
export function TechArticleStructuredData({ data }: { data: BlogPostData & { proficiencyLevel?: string } }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: data.headline,
    description: data.description,
    ...(data.image && {
      image: {
        "@type": "ImageObject",
        url: data.image,
      },
    }),
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    author: {
      "@type": "Person",
      name: data.author.name,
      ...(data.author.url && { url: data.author.url }),
    },
    publisher: {
      "@type": "Organization",
      name: data.publisher.name,
      logo: {
        "@type": "ImageObject",
        url: data.publisher.logo,
      },
    },
    url: data.url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": data.url,
    },
    ...(data.keywords && { keywords: data.keywords.join(", ") }),
    ...(data.proficiencyLevel && { proficiencyLevel: data.proficiencyLevel }),
    inLanguage: data.inLanguage,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * Person構造化データ
 * プロフィールページやAboutページで使用
 */
export function PersonStructuredData({ data }: { data: PersonData }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.name,
    url: data.url,
    ...(data.image && { image: data.image }),
    jobTitle: data.jobTitle,
    description: data.description,
    ...(data.email && { email: data.email }),
    ...(data.sameAs && { sameAs: data.sameAs }),
    ...(data.worksFor && {
      worksFor: data.worksFor.map((org) => ({
        "@type": "Organization",
        name: org.name,
        ...(org.url && { url: org.url }),
      })),
    }),
    ...(data.alumniOf && {
      alumniOf: data.alumniOf.map((school) => ({
        "@type": "EducationalOrganization",
        name: school.name,
        ...(school.url && { url: school.url }),
      })),
    }),
    ...(data.knowsAbout && { knowsAbout: data.knowsAbout }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
