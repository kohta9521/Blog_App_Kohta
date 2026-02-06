import { client } from "./client";
import { TopicsResponseSchema, type TopicsResponse } from "@/schema/topic";
import { handleApiError } from "./error";

/**
 * トピックAPIサービス
 */

type GetTopicsOptions = {
  limit?: number;
  offset?: number;
  orders?: string;
};

/**
 * トピック一覧を取得
 * @example
 * ```ts
 * const topics = await getTopics({ limit: 50 });
 * ```
 */
export async function getTopics(
  options: GetTopicsOptions = {}
): Promise<TopicsResponse> {
  const { limit = 100, offset = 0, orders = "topic" } = options;

  try {
    const response = await client.get({
      endpoint: "topics",
      queries: {
        limit,
        offset,
        orders,
      },
    });

    const validated = TopicsResponseSchema.parse(response);
    return validated;
  } catch (error) {
    handleApiError(error, "topics");
  }
}
