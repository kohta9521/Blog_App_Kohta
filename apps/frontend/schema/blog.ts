import { z } from "zod";
import { TopicSchema } from "./topic";
import { BookSchema } from "./book";

/**
 * ブログ記事スキーマ
 *
 * 多言語対応の仕組み:
 * - 日本語記事: id = "xxxxxxx" (デフォルト)
 * - 英語記事: id = "xxxxxxx-en"
 * - 各記事は全言語のフィールドを持つ（title, title_en等）
 */
export const BlogSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string(),
  revisedAt: z.string(),
  title: z.string(),
  title_en: z.string(),
  summary: z.string(),
  sammary_en: z.string(), // 注: APIのtypo
  topics: z.array(TopicSchema),
  book: BookSchema.optional(), // 書籍への所属（オプショナル）
  meta_title: z.string(),
  meta_title_en: z.string(),
  meta_desc: z.string(),
  meta_desc_en: z.string(),
  read_time: z.number().optional().default(5), // オプショナル + デフォルト値
  main_contents: z.string().optional().default(""), // オプショナル + デフォルト値
});

/**
 * ブログ一覧APIレスポンススキーマ
 * GET /api/v1/blogs
 */
export const BlogsResponseSchema = z.object({
  contents: z.array(BlogSchema),
  totalCount: z.number(),
  offset: z.number(),
  limit: z.number(),
});

/**
 * ブログ詳細APIレスポンススキーマ（単体取得時）
 * GET /api/v1/blogs/{id}
 */
export const BlogDetailResponseSchema = BlogSchema;

// 型エクスポート
export type Blog = z.infer<typeof BlogSchema>;
export type BlogsResponse = z.infer<typeof BlogsResponseSchema>;
export type BlogDetailResponse = z.infer<typeof BlogDetailResponseSchema>;
