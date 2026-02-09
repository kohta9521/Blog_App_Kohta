# AWS Lambda用のRust関数をビルドするDockerfile
# AWS Lambda用の公式Rustベースイメージを使用

# ビルドステージ
FROM rust:1.83-slim as builder

WORKDIR /app

# 必要なビルドツールをインストール
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# 依存関係のキャッシュのため、先にCargo.tomlをコピー
COPY Cargo.toml ./
RUN mkdir src && \
    echo "fn main() {}" > src/main.rs && \
    cargo build --release && \
    rm -rf src

# 実際のソースコードをコピーしてビルド
COPY src ./src
RUN cargo build --release

# ランタイムステージ - AWS Lambda用の軽量イメージ
FROM public.ecr.aws/lambda/provided:al2023

# ビルドしたバイナリをLambdaが期待する場所にコピー
COPY --from=builder /app/target/release/backend-lambda ${LAMBDA_RUNTIME_DIR}/bootstrap

# Lambda関数のハンドラーを設定
CMD [ "function.handler" ]
