# 1. 依存関係インストールステージ
FROM node:20-alpine AS deps

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci

# 2. ビルドステージ
FROM node:20-alpine AS builder

WORKDIR /app

# 依存関係をコピー
COPY --from=deps /app/node_modules ./node_modules

# ソースコードをコピー
COPY . .

# Next.jsアプリをビルド
RUN npm run build

# 3. ランタイムステージ
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# 非rootユーザーを作成
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 必要なファイルのみをコピー
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# ポート3000を公開
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# アプリケーションを起動
CMD ["node", "server.js"]
