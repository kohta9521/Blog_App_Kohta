# 1. ビルドステージ
FROM rust:latest AS builder

WORKDIR /app

# システム依存関係をインストール（PostgreSQL クライアントライブラリ等）
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    pkg-config \
    libssl-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 依存関係だけ先に解決してキャッシュを効かせる
COPY Cargo.toml ./
# Cargo.lockがある場合のみコピー
COPY Cargo.loc[k] ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release || true
RUN rm -rf src

# 実際のソースをコピー
COPY src ./src

# 本ビルド
RUN cargo build --release && \
    strip /app/target/release/backend && \
    rm -rf /app/target/release/deps /app/target/release/build

# 2. ランタイムステージ（軽量イメージ）
FROM debian:bookworm-slim AS runtime

WORKDIR /app

# 必要なランタイムライブラリのみインストール
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    libssl3 \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 非rootユーザーを作成
RUN useradd --create-home --shell /bin/bash app

# ビルドしたバイナリをコピー
COPY --from=builder /app/target/release/backend /usr/local/bin/backend

# 実行権限を付与
RUN chmod +x /usr/local/bin/backend

# 非rootユーザーに切り替え
USER app

# 環境変数の設定
ENV RUST_LOG=backend=info,axum=info,tower_http=info,sqlx=warn
ENV RUST_BACKTRACE=1

# ポート8000を公開（Axumのデフォルト）
EXPOSE 8000

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# アプリケーションを起動
CMD ["/usr/local/bin/backend"]
