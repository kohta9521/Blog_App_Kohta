# 🚀 Lambda API デプロイ手順（超初心者向け）

このドキュメントでは、Rust製のLambda APIをAWSにデプロイする手順を、ステップバイステップで解説します。

## 📋 前提条件

以下のツールがインストールされている必要があります：

1. **AWS CLI v2** - AWSとやり取りするためのコマンドラインツール
2. **Terraform** - インフラをコードで管理するツール
3. **Docker** - コンテナイメージをビルドするツール
4. **Rust** - Rustのコンパイラ（オプション、ローカル開発時のみ）

### インストール確認

```bash
# AWS CLIのバージョン確認
aws --version
# 出力例: aws-cli/2.15.0

# Terraformのバージョン確認
terraform --version
# 出力例: Terraform v1.7.0

# Dockerのバージョン確認
docker --version
# 出力例: Docker version 24.0.0
```

## 🔐 ステップ1: AWS認証情報の設定

### 1-1. IAMユーザーのアクセスキーを取得

すでにIAMアカウントを持っているとのことなので、アクセスキーを取得します。

1. [AWS Console](https://console.aws.amazon.com/)にログイン
2. IAM → ユーザー → あなたのユーザー名をクリック
3. 「セキュリティ認証情報」タブをクリック
4. 「アクセスキーを作成」をクリック
5. 「Command Line Interface (CLI)」を選択
6. アクセスキーIDとシークレットアクセスキーをメモ（後で使います）

### 1-2. AWS CLIの設定

ターミナルで以下を実行：

```bash
aws configure
```

以下の情報を入力：

```
AWS Access Key ID [None]: <あなたのアクセスキーID>
AWS Secret Access Key [None]: <あなたのシークレットアクセスキー>
Default region name [None]: ap-northeast-1
Default output format [None]: json
```

### 1-3. 認証確認

```bash
aws sts get-caller-identity
```

以下のような出力が表示されればOK：

```json
{
    "UserId": "AIDAI...",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/your-username"
}
```

## 🏗️ ステップ2: Dockerイメージのビルドとプッシュ

### 2-1. プロジェクトディレクトリに移動

```bash
cd /Users/kohtakochi/kohta/blog
```

### 2-2. ECRリポジトリの作成（初回のみ）

まず、Dockerイメージを保存するECRリポジトリをTerraformで作成します。

```bash
cd infra/terraform/envs/lambda-dev

# Terraformの初期化
terraform init

# ECRリポジトリのみ先に作成
terraform apply -target=module.lambda_api.aws_ecr_repository.lambda
```

確認を求められたら`yes`と入力します。

出力からECRリポジトリのURLをメモします：

```
ecr_repository_url = "123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/blog-dev-lambda-api"
```

### 2-3. ECRにログイン

```bash
# AWSアカウントIDを取得
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# ECRにログイン
aws ecr get-login-password --region ap-northeast-1 | \
  docker login --username AWS --password-stdin \
  ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com
```

`Login Succeeded`と表示されればOKです。

### 2-4. Dockerイメージのビルド

```bash
# backend-lambdaディレクトリに移動
cd /Users/kohtakochi/kohta/blog/apps/backend-lambda

# Dockerイメージをビルド（環境変数を使用）
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
docker build -t blog-dev-lambda-api:latest .
```

ビルドには5〜10分かかります。☕ コーヒーでも飲んで待ちましょう。

### 2-5. Dockerイメージにタグ付け

```bash
# ECRリポジトリ用にタグ付け
docker tag blog-dev-lambda-api:latest \
  ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/blog-dev-lambda-api:latest
```

### 2-6. ECRにプッシュ

```bash
# ECRにプッシュ
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/blog-dev-lambda-api:latest
```

プッシュには2〜5分かかります。

## ⚙️ ステップ3: Terraform変数の設定

### 3-1. terraform.tfvarsファイルの作成

```bash
# lambda-dev環境に戻る
cd /Users/kohtakochi/kohta/blog/infra/terraform/envs/lambda-dev

# サンプルファイルをコピー
cp terraform.tfvars.example terraform.tfvars
```

### 3-2. terraform.tfvarsを編集

エディタで`terraform.tfvars`を開き、以下を設定：

```hcl
# AWSアカウントIDを取得して設定
aws_region = "ap-northeast-1"
environment = "dev"

# 先ほどプッシュしたイメージのURIを設定
lambda_image_uri = "123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/blog-dev-lambda-api:latest"

# ローカル開発時はlocalhost、VercelにデプロイしたらそのURLに変更
allowed_origin = "http://localhost:3000"

lambda_timeout     = 30
lambda_memory_size = 128
```

**重要**: `123456789012`の部分をあなたのAWSアカウントIDに置き換えてください。

アカウントIDの確認：
```bash
aws sts get-caller-identity --query Account --output text
```

## 🚀 ステップ4: Terraformでデプロイ

### 4-1. Terraform実行プランの確認

```bash
terraform plan
```

このコマンドで、Terraformが作成するリソースを事前確認できます。

### 4-2. デプロイ実行

```bash
terraform apply
```

確認を求められたら`yes`と入力します。

デプロイには3〜5分かかります。完了すると、以下のような出力が表示されます：

```
Outputs:

api_endpoint = "https://abc123xyz.execute-api.ap-northeast-1.amazonaws.com"
ecr_repository_url = "123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/blog-dev-lambda-api"
lambda_function_name = "blog-dev-api"
lambda_log_group = "/aws/lambda/blog-dev-api"
```

### 4-3. API エンドポイントをメモ

`api_endpoint`の値をメモしておきます。これがあなたのAPIのURLです！

## ✅ ステップ5: 動作確認

### 5-1. Hello Worldエンドポイントをテスト

```bash
# api_endpointの値を環境変数に設定
API_ENDPOINT="https://abc123xyz.execute-api.ap-northeast-1.amazonaws.com"

# Hello Worldをテスト
curl ${API_ENDPOINT}/hello
```

以下のようなレスポンスが返ってくればOK：

```json
{
  "message": "Hello World from Rust Lambda! 🦀",
  "environment": "dev",
  "timestamp": "2024-02-10T12:00:00+00:00"
}
```

### 5-2. ヘルスチェックをテスト

```bash
curl ${API_ENDPOINT}/health
```

レスポンス：

```json
{
  "status": "healthy",
  "environment": "dev",
  "timestamp": "2024-02-10T12:00:00+00:00"
}
```

## 📊 ステップ6: ログの確認

### 6-1. CloudWatch Logsで確認

```bash
# ログを表示
aws logs tail /aws/lambda/blog-dev-api --follow
```

リアルタイムでログが表示されます。Ctrl+Cで終了。

### 6-2. AWS Consoleで確認

1. [CloudWatch Console](https://console.aws.amazon.com/cloudwatch/)にアクセス
2. 左メニュー → ロググループ → `/aws/lambda/blog-dev-api`
3. 最新のログストリームをクリック

## 🎨 ステップ7: フロントエンドとの連携

### 7-1. Vercelの環境変数を設定

Vercelのプロジェクト設定で、以下の環境変数を追加：

**開発環境用:**
- 変数名: `NEXT_PUBLIC_API_URL_DEV`
- 値: `https://abc123xyz.execute-api.ap-northeast-1.amazonaws.com`

### 7-2. フロントエンドのコードで使用

```typescript
// apps/frontend/lib/api-client/lambda.ts
const API_URL = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_API_URL_PROD
  : process.env.NEXT_PUBLIC_API_URL_DEV;

export async function fetchHello() {
  const response = await fetch(`${API_URL}/hello`);
  return response.json();
}
```

### 7-3. CORS設定の更新

VercelにデプロイしたフロントエンドのURLが決まったら、terraform.tfvarsを更新：

```hcl
# Vercelのプレビュー環境URL
allowed_origin = "https://your-app-git-develop-your-team.vercel.app"
```

そして、Terraformで再デプロイ：

```bash
terraform apply
```

## 🔄 ステップ8: コード変更時の更新手順

### 8-1. コードを修正

```bash
cd /Users/kohtakochi/kohta/blog/apps/backend-lambda
# src/main.rsを編集
```

### 8-2. 新しいイメージをビルド＆プッシュ

```bash
# 環境変数を設定
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# ビルド
docker build -t blog-dev-lambda-api:latest .

# タグ付け
docker tag blog-dev-lambda-api:latest \
  ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/blog-dev-lambda-api:latest

# プッシュ
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/blog-dev-lambda-api:latest
```

### 8-3. Lambda関数を更新

```bash
# Lambda関数を最新のイメージで更新
aws lambda update-function-code \
  --function-name blog-dev-api \
  --image-uri ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/blog-dev-lambda-api:latest \
  --region ap-northeast-1
```

約30秒〜1分で更新が完了します。

## 🌟 本番環境へのデプロイ

### 本番環境の手順

1. `infra/terraform/envs/lambda-prod`ディレクトリに移動
2. 同じ手順で`terraform.tfvars`を作成
3. `allowed_origin`に本番環境のURL（`https://www.kohta-tech-blog.com`）を設定
4. `terraform apply`で本番環境をデプロイ

**重要**: 本番環境では`:latest`タグではなく、バージョンタグを使用してください：

```bash
# 本番環境用にバージョンタグでビルド
docker tag blog-dev-lambda-api:latest \
  ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/blog-prod-lambda-api:v1.0.0

docker push ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/blog-prod-lambda-api:v1.0.0
```

## 💰 コスト管理

### 無料枠の範囲内で運用するために

1. **Lambda実行時間を最小化**: メモリは128MBで十分
2. **不要なログを削除**: 古いCloudWatch Logsは自動削除される設定済み
3. **dev環境は使わない時は削除**: `terraform destroy`で簡単に削除可能

### コストアラートの設定

AWS Billing Consoleでアラートを設定すると安心：

1. [Billing Console](https://console.aws.amazon.com/billing/)にアクセス
2. 「予算」→「予算の作成」
3. 月額$5でアラートを設定

## 🗑️ リソースの削除

開発環境が不要になったら、以下で削除できます：

```bash
cd /Users/kohtakochi/kohta/blog/infra/terraform/envs/lambda-dev
terraform destroy
```

確認を求められたら`yes`と入力すると、すべてのリソースが削除されます。

## 🆘 トラブルシューティング

### エラー: "Error: AccessDenied"

→ IAMユーザーに適切な権限がない可能性があります。管理者に以下のポリシーを付与してもらってください：

- `AWSLambda_FullAccess`
- `AmazonAPIGatewayAdministrator`
- `AmazonEC2ContainerRegistryFullAccess`
- `CloudWatchLogsFullAccess`

### エラー: "Image not found"

→ Dockerイメージが正しくプッシュされていません。ステップ2を再度確認してください。

### Lambda関数が動作しない

→ CloudWatch Logsを確認：

```bash
aws logs tail /aws/lambda/blog-dev-api --follow
```

エラーメッセージから原因を特定できます。

## 📞 サポート

質問や問題があれば、プロジェクトのIssueで質問してください！

---

おめでとうございます！🎉 これであなたのRust APIがAWS Lambdaで動いています！
