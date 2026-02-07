import { client } from "./client";
import { BooksResponseSchema, type BooksResponse } from "@/schema/book";
import { handleApiError } from "./error";

/**
 * Book APIサービス
 */

type GetBooksOptions = {
  limit?: number;
  offset?: number;
  orders?: string;
};

/**
 * Book一覧を取得
 * @example
 * ```ts
 * const books = await getBooks({ limit: 50 });
 * ```
 */
export async function getBooks(
  options: GetBooksOptions = {}
): Promise<BooksResponse> {
  const { limit = 100, offset = 0, orders = "book_title" } = options;

  try {
    const response = await client.get({
      endpoint: "book",
      queries: {
        limit,
        offset,
        orders,
      },
    });

    const validated = BooksResponseSchema.parse(response);
    return validated;
  } catch (error) {
    handleApiError(error, "book");
  }
}
