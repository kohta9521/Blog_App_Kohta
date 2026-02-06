/**
 * API エラーハンドリング
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * microCMS APIエラーを人間が読める形式に変換
 */
export function handleApiError(error: unknown, endpoint?: string): never {
  if (error instanceof ApiError) {
    throw error;
  }

  if (error instanceof Error) {
    console.error(`API Error (${endpoint}):`, error.message);
    throw new ApiError(
      `データの取得に失敗しました: ${error.message}`,
      undefined,
      endpoint
    );
  }

  console.error(`Unknown API Error (${endpoint}):`, error);
  throw new ApiError("不明なエラーが発生しました", undefined, endpoint);
}
