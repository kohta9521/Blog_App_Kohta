import { createClient } from "microcms-js-sdk";

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

if (!serviceDomain || !apiKey) {
  throw new Error(
    "microCMS環境変数が設定されていません: MICROCMS_SERVICE_DOMAIN, MICROCMS_API_KEY"
  );
}

export const client = createClient({
  serviceDomain,
  apiKey,
});
