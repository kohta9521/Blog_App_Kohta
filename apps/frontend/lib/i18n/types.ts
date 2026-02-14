export type Dictionary = {
  common: {
    home: string;
    about: string;
    blog: string;
    profile: string;
    contact: string;
    search: string;
    console?: string;
    consoleUnderDevelopment?: string;
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
  blogDetail?: {
    metadata: string;
    date: string;
    author: string;
    readingTime: string;
    categories: string;
    share: string;
    article: string;
    minRead: string;
    tableOfContents: string;
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
  about: {
    title: string;
    subtitle: string;
    intro: {
      title: string;
      content: string;
    };
    author: {
      title: string;
      role: string;
      location: string;
      education: string;
      description: string;
      viewProfile: string;
    };
    tech: {
      title: string;
      frontend: {
        title: string;
        stack: string[];
      };
      backend: {
        title: string;
        stack: string[];
      };
      infrastructure: {
        title: string;
        stack: string[];
      };
      description: string;
    };
    goals: {
      title: string;
      items: string[];
    };
    cta: {
      title: string;
      button: string;
    };
  };
  profile?: {
    title: string;
    subtitle: string;
    name: string;
    nameEn: string;
    currentRole: string;
    bio: {
      title: string;
      content: string;
    };
    experience: {
      title: string;
      items: Array<{
        company: string;
        role: string;
        period: string;
        description: string;
      }>;
    };
    education: {
      title: string;
      items: Array<{
        institution: string;
        degree: string;
        period: string;
        focus: string;
      }>;
    };
    skills: {
      title: string;
      frontend: {
        title: string;
        items: string[];
      };
      backend: {
        title: string;
        items: string[];
      };
      infrastructure: {
        title: string;
        items: string[];
      };
      other: {
        title: string;
        items: string[];
      };
    };
    achievements: {
      title: string;
      items: string[];
    };
    interests: {
      title: string;
      items: string[];
    };
    projects: {
      title: string;
      items: Array<{
        name: string;
        description: string;
        date: string;
        tags: string[];
      }>;
    };
    community: {
      title: string;
      description: string;
      items: string[];
    };
    links: {
      title: string;
      github: string;
      linkedin: string;
      twitter: string;
      wantedly: string;
    };
    vision: {
      title: string;
      content: string;
    };
  };
  contact?: {
    title: string;
    subtitle: string;
    intro: {
      title: string;
      description: string;
    };
    form: {
      name: {
        label: string;
        placeholder: string;
        required: string;
      };
      email: {
        label: string;
        placeholder: string;
        required: string;
        invalid: string;
      };
      category: {
        label: string;
        placeholder: string;
        required: string;
        options: {
          web_development: string;
          technical_consulting: string;
          event_planning: string;
          business_collaboration: string;
          speaking: string;
          interview: string;
          student_inquiry: string;
          other: string;
        };
      };
      message: {
        label: string;
        placeholder: string;
        required: string;
      };
      submit: string;
      submitting: string;
      success: string;
      error: string;
      agreement: {
        label: string;
        required: string;
        terms: string;
        privacy: string;
        and: string;
      };
    };
    info: {
      title: string;
      items: string[];
    };
    response: {
      title: string;
      description: string;
    };
    complete: {
      title: string;
      subtitle: string;
      message: {
        title: string;
        description: string;
      };
      note: {
        title: string;
        items: string[];
      };
      backToHome: string;
    };
  };
  legal?: {
    terms: {
      title: string;
      subtitle: string;
      lastUpdated: string;
      sections: Array<{
        title: string;
        content: string;
      }>;
    };
    privacy: {
      title: string;
      subtitle: string;
      lastUpdated: string;
      intro: string;
      sections: Array<{
        title: string;
        content: string;
      }>;
    };
  };
};
