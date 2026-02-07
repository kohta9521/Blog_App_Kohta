import { z } from "zod";

/**
 * Book内のブログ記事スキーマ（簡易版）
 * 循環参照を避けるため、Topicは参照のみ
 */
export const BookBlogSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string(),
  revisedAt: z.string(),
  title: z.string(),
  title_en: z.string(),
  summary: z.string(),
  sammary_en: z.string(),
  topics: z.array(z.object({ id: z.string() })), // Topic参照のみ
  meta_title: z.string(),
  meta_title_en: z.string(),
  meta_desc: z.string(),
  meta_desc_en: z.string(),
  read_time: z.number().optional().default(5),
  main_contents: z.string().optional().default(""),
});

/**
 * Bookスキーマ
 */
export const BookSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string(),
  revisedAt: z.string(),
  book_title: z.string(),
  book_blogs: z.array(BookBlogSchema).optional().default([]),
});

export const BooksResponseSchema = z.object({
  contents: z.array(BookSchema),
  totalCount: z.number(),
  offset: z.number(),
  limit: z.number(),
});

export type BookBlog = z.infer<typeof BookBlogSchema>;
export type Book = z.infer<typeof BookSchema>;
export type BooksResponse = z.infer<typeof BooksResponseSchema>;
