/**
 * API エラーハンドリング
 */

import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string,
    public details?: unknown
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

  // Zodバリデーションエラーの詳細処理
  if (error instanceof ZodError) {
    console.error(`Validation Error (${endpoint}):`, error.format());
    const firstError = error.errors[0];
    const fieldPath = firstError.path.join(".");
    throw new ApiError(
      `データ形式が不正です: ${fieldPath} - ${firstError.message}`,
      422,
      endpoint,
      error.format()
    );
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
