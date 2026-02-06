import { client } from "./client";
import {
  BlogsResponseSchema,
  BlogDetailResponseSchema,
  type BlogsResponse,
  type BlogDetailResponse,
} from "@/schema/blog";
import { handleApiError } from "./error";
import type { Locale } from "@/lib/i18n/config";

/**
 * ブログAPIサービス
 * - microCMS SDKを使用してデータ取得
 * - Zodでランタイムバリデーション
 * - 多言語対応: IDベースで言語を判定
 */

/**
 * 言語に応じてブログIDを変換
 * - ja: "xxxxxxx" (そのまま)
 * - en: "xxxxxxx-en"
 */
export function getLocalizedBlogId(baseId: string, locale: Locale): string {
  // 既に "-en" が付いている場合は削除してベースIDを取得
  const cleanId = baseId.replace(/-en$/, "");
  return locale === "en" ? `${cleanId}-en` : cleanId;
}

/**
 * ブログIDから言語を判定
 */
export function detectLocaleFromBlogId(id: string): Locale {
  return id.endsWith("-en") ? "en" : "ja";
}

type GetBlogsOptions = {
  /** 取得件数（デフォルト: 10） */
  limit?: number;
  /** オフセット（ページネーション用） */
  offset?: number;
  /** フィルタ条件（例: topics[contains]rust） */
  filters?: string;
  /** 並び順（例: -publishedAt で新しい順） */
  orders?: string;
};

/**
 * ブログ記事一覧を取得
 * @example
 * ```ts
 * const blogs = await getBlogs({ limit: 20, orders: '-publishedAt' });
 * ```
 */
export async function getBlogs(
  options: GetBlogsOptions = {}
): Promise<BlogsResponse> {
  const { limit = 10, offset = 0, filters, orders = "-publishedAt" } = options;

  try {
    const response = await client.get({
      endpoint: "blogs",
      queries: {
        limit,
        offset,
        ...(filters && { filters }),
        orders,
      },
    });

    // Zodでバリデーション（型安全性を保証）
    const validated = BlogsResponseSchema.parse(response);
    return validated;
  } catch (error) {
    handleApiError(error, "blogs");
  }
}

/**
 * ブログ記事詳細を取得
 *
 * microCMS API:
 * - contentId指定: GET /api/v1/blogs/{id} → 単一オブジェクト返却
 * - ids指定: GET /api/v1/blogs?ids=xxx → contents配列で返却
 *
 * @param id - ブログID（例: "wm0frxhnzx" または "wm0frxhnzx-en"）
 * @example
 * ```ts
 * const blog = await getBlogById('wm0frxhnzx');
 * const blogEn = await getBlogById('wm0frxhnzx-en');
 * ```
 */
export async function getBlogById(id: string): Promise<BlogDetailResponse> {
  try {
    const response = await client.get({
      endpoint: "blogs",
      contentId: id,
    });

    // Zodでバリデーション
    const validated = BlogDetailResponseSchema.parse(response);
    return validated;
  } catch (error) {
    console.error(`ブログ記事取得エラー (ID: ${id}):`, error);
    handleApiError(error, `blogs/${id}`);
  }
}

/**
 * トピックでフィルタリングしたブログ一覧を取得
 * @param topicId - トピックID
 */
export async function getBlogsByTopic(
  topicId: string,
  options: Omit<GetBlogsOptions, "filters"> = {}
): Promise<BlogsResponse> {
  return getBlogs({
    ...options,
    filters: `topics[contains]${topicId}`,
  });
}

/**
 * 日付範囲でフィルタリングしたブログ一覧を取得
 * @param startDate - 開始日（YYYY-MM-DD）
 * @param endDate - 終了日（YYYY-MM-DD）
 */
export async function getBlogsByDateRange(
  startDate: string,
  endDate: string,
  options: Omit<GetBlogsOptions, "filters"> = {}
): Promise<BlogsResponse> {
  return getBlogs({
    ...options,
    filters: `publishedAt[greater_than]${startDate}[and]publishedAt[less_than]${endDate}`,
  });
}

/**
 * 全ブログ記事を取得（ページネーション対応）
 * microCMS APIのlimit制限（最大100）を考慮して全件取得
 *
 * @param options - 取得オプション（limitは無視される）
 * @returns 全ブログ記事
 * @example
 * ```ts
 * const allBlogs = await getAllBlogs({ orders: '-publishedAt' });
 * ```
 */
export async function getAllBlogs(
  options: Omit<GetBlogsOptions, "limit" | "offset"> = {}
): Promise<BlogsResponse> {
  const limit = 100; // microCMS APIの最大値
  let offset = 0;
  let allContents: BlogsResponse["contents"] = [];
  let totalCount = 0;

  try {
    // 最初のリクエストでtotalCountを取得
    const firstResponse = await getBlogs({ ...options, limit, offset });
    totalCount = firstResponse.totalCount;
    allContents = firstResponse.contents;

    // 100件を超える場合はページネーションで取得
    while (allContents.length < totalCount) {
      offset += limit;
      const response = await getBlogs({ ...options, limit, offset });
      allContents = [...allContents, ...response.contents];
    }

    return {
      contents: allContents,
      totalCount,
      offset: 0,
      limit: allContents.length,
    };
  } catch (error) {
    handleApiError(error, "blogs (pagination)");
  }
}
