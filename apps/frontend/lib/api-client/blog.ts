import { createApiClient } from "./base";
import type { Locale } from "@/lib/i18n/config";

export type BlogPost = {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  author: string;
  date: string;
  imageUrl?: string;
  tags: string[];
  locale: Locale;
};

export type BlogListResponse = {
  posts: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
};

export class BlogApiClient {
  private client: ReturnType<typeof createApiClient>;

  constructor(locale: Locale) {
    this.client = createApiClient(locale);
  }

  async getPosts(page: number = 1, pageSize: number = 10): Promise<BlogListResponse> {
    return this.client.get<BlogListResponse>(
      `/api/posts?page=${page}&pageSize=${pageSize}`
    );
  }

  async getPost(id: string): Promise<BlogPost> {
    return this.client.get<BlogPost>(`/api/posts/${id}`);
  }

  async searchPosts(query: string): Promise<BlogPost[]> {
    return this.client.get<BlogPost[]>(`/api/posts/search?q=${query}`);
  }

  async getPostsByCategory(category: string): Promise<BlogPost[]> {
    return this.client.get<BlogPost[]>(`/api/posts/category/${category}`);
  }
}

// Factory function
export const createBlogApiClient = (locale: Locale) => {
  return new BlogApiClient(locale);
};

