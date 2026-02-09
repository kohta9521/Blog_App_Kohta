# 🦀 Rust Lambda API - Hello World

AWS Lambda上で動作する超シンプルなRust製Hello World APIです。

## 📋 概要

このプロジェクトは、Rustで書かれたシンプルなAPIをAWS Lambdaにデプロイするためのものです。

### 主な特徴

- ✅ **超軽量**: 最小限の依存関係で高速起動
- ✅ **低コスト**: AWS無料枠内で運用可能
- ✅ **セキュア**: CORS設定でVercelフロントエンドからのみアクセス許可
- ✅ **環境分離**: dev/prod環境を完全分離
- ✅ **監視**: CloudWatch Logsで簡単にログ確認

## 🏗️ アーキテクチャ

```
Vercel (Frontend)
    ↓
API Gateway (HTTPS)
    ↓
AWS Lambda (Rust)
    ↓
CloudWatch Logs
```

### AWS無料枠の範囲

- **Lambda**: 月100万リクエスト、40万GB秒の実行時間
- **API Gateway**: 月100万コール（12ヶ月間）
- **CloudWatch Logs**: 5GB/月
- **ECR**: 500MB/月のストレージ

## 🚀 エンドポイント

### 1. Hello World
```bash
GET /
GET /hello
```

**レスポンス例:**
```json
{
  "message": "Hello World from Rust Lambda! 🦀",
  "environment": "dev",
  "timestamp": "2024-02-10T12:00:00+00:00"
}
```

### 2. ヘルスチェック
```bash
GET /health
```

**レスポンス例:**
```json
{
  "status": "healthy",
  "environment": "dev",
  "timestamp": "2024-02-10T12:00:00+00:00"
}
```

## 🛠️ ローカル開発

### 前提条件

- Rust 1.70以上
- Docker
- AWS CLI v2

### 依存関係のインストール

```bash
cd apps/backend-lambda
cargo build
```

### ローカルでのテスト

Lambdaランタイムをローカルでエミュレートするには、`cargo-lambda`を使用します：

```bash
# cargo-lambdaのインストール
cargo install cargo-lambda

# ローカルで実行
cargo lambda watch

# 別のターミナルでテスト
curl http://localhost:9000/hello
```

## 🐳 Dockerビルド

```bash
# Dockerイメージをビルド
docker build -t backend-lambda:latest .

# ローカルでテスト（Lambda Runtime Interface Emulator使用）
docker run -p 9000:8080 backend-lambda:latest

# 別のターミナルでテスト
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" \
  -d '{
    "rawPath": "/hello",
    "requestContext": {
      "http": {
        "method": "GET"
      }
    }
  }'
```

## 📝 コードの説明

### main.rs の主要部分

```rust
// Lambda関数のハンドラー
async fn function_handler(event: Request) -> Result<Response<Body>, Error> {
    // リクエストのパスを取得
    let path = event.uri().path();
    
    // 環境変数から設定を取得
    let environment = std::env::var("ENVIRONMENT").unwrap_or_else(|_| "unknown".to_string());
    let allowed_origin = std::env::var("ALLOWED_ORIGIN").unwrap_or_else(|_| "*".to_string());
    
    // パスに応じてレスポンスを返す
    match path {
        "/health" => { /* ヘルスチェック */ },
        "/" | "/hello" => { /* Hello World */ },
        _ => { /* 404 */ }
    }
}
```

### 環境変数

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `ENVIRONMENT` | 実行環境 | `dev`, `prod` |
| `ALLOWED_ORIGIN` | CORS許可するオリジン | `https://your-app.vercel.app` |
| `RUST_LOG` | ログレベル | `info`, `debug` |

## 📦 依存関係

主要なクレート：

- `lambda_http`: AWS Lambda HTTP APIとの統合
- `lambda_runtime`: Lambda実行環境
- `serde`/`serde_json`: JSON処理
- `chrono`: 日時処理
- `tracing`: ログ出力

## 🔍 トラブルシューティング

### ビルドエラー

```bash
# Cargoのキャッシュをクリア
cargo clean
cargo build --release
```

### Dockerビルドが遅い

```bash
# BuildKitを使用して高速化
DOCKER_BUILDKIT=1 docker build -t backend-lambda:latest .
```

### Lambda実行時のタイムアウト

- Terraform設定で`timeout`を増やす（デフォルト30秒）
- メモリサイズを増やすとCPUも増えて高速化

## 📚 参考資料

- [AWS Lambda Rust Runtime](https://github.com/awslabs/aws-lambda-rust-runtime)
- [Cargo Lambda](https://www.cargo-lambda.info/)
- [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/)
- [Rust Book (日本語版)](https://doc.rust-jp.rs/book-ja/)

## 🤝 コントリビューション

改善提案やバグ報告は大歓迎です！

## 📄 ライセンス

MIT License
