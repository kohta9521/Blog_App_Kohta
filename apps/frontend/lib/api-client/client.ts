import { createClient } from "microcms-js-sdk";

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

// ビルド時の環境変数チェックを遅延させる
function getClient() {
  if (!serviceDomain || !apiKey) {
    throw new Error(
      `microCMS環境変数が設定されていません:\n` +
        `MICROCMS_SERVICE_DOMAIN: ${serviceDomain ? "設定済み" : "未設定"}\n` +
        `MICROCMS_API_KEY: ${apiKey ? "設定済み" : "未設定"}`
    );
  }

  return createClient({
    serviceDomain,
    apiKey,
  });
}

export const client = getClient();
