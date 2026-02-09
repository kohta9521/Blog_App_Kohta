# AWS Lambda用のRust関数をビルドするDockerfile
# マルチステージビルドで最適化

# ビルドステージ: 通常のRustイメージを使用
FROM rust:1.83-slim AS builder

WORKDIR /app

# 必要なビルドツールをインストール
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# 依存関係をコピー
COPY Cargo.toml ./

# ダミーのmain.rsでビルド（依存関係のキャッシュ用）
RUN mkdir src && \
    echo "fn main() {}" > src/main.rs && \
    cargo build --release && \
    rm -rf src target/release/deps/backend_lambda*

# 実際のソースをコピーしてビルド
COPY src ./src
RUN cargo build --release

# ランタイムステージ: Lambda公式イメージ
FROM public.ecr.aws/lambda/provided:al2023

# ビルドしたバイナリをコピー
COPY --from=builder /app/target/release/backend-lambda ${LAMBDA_RUNTIME_DIR}/bootstrap

# 実行権限を付与
RUN chmod +x ${LAMBDA_RUNTIME_DIR}/bootstrap

CMD [ "bootstrap" ]
