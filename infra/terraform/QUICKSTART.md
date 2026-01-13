# 🚀 クイックスタートガイド

AWS初心者でTerraform初心者の方向けの、実践的なデプロイ手順です。

## 📋 前提条件チェックリスト

- [ ] AWSアカウントを作成済み
- [ ] クレジットカードを登録済み
- [ ] AWS CLI をインストール済み
- [ ] Terraform をインストール済み
- [ ] Docker をインストール済み
- [ ] GitHubアカウントあり
- [ ] ドメインを取得済み（オプション）

## ステップ1: AWS認証情報の設定

### 1-1. IAMユーザーを作成

```bash
# ブラウザでAWSコンソールにログイン
# https://console.aws.amazon.com/

# IAM → ユーザー → ユーザーを追加
# ユーザー名: terraform-user
# アクセスキー: ✅ チェック
# 許可: AdministratorAccess（学習用）
```

### 1-2. AWS CLIを設定

```bash
# 認証情報を設定
aws configure

# 入力内容:
AWS Access Key ID: AKIA... （上記で作成）
AWS Secret Access Key: ******
Default region name: ap-northeast-1
Default output format: json

# 確認
aws sts get-caller-identity
```

## ステップ2: GitHubの準備

### 2-1. Personal Access Token作成

```bash
# GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
# Generate new token (classic)

# 権限:
☑ repo (全て)
☑ admin:repo_hook (全て)

# トークンをコピー（後で使用）
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2-2. リポジトリをpush

```bash
# まだpushしていない場合
git remote add origin https://github.com/yourusername/blog.git
git branch -M main
git push -u origin main
```

## ステップ3: 開発環境のデプロイ

### 3-1. Terraform設定ファイルを作成

```bash
cd infra/terraform/envs/dev

# サンプルファイルをコピー
cp terraform.tfvars.example terraform.tfvars

# エディタで編集
vim terraform.tfvars
```

**terraform.tfvars の設定例:**

```hcl
# 基本設定
environment = "dev"
aws_region  = "ap-northeast-1"

# ネットワーク
vpc_cidr           = "10.0.0.0/16"
availability_zones = ["ap-northeast-1a", "ap-northeast-1c"]
allowed_ips        = ["0.0.0.0/0"] # 本番では自分のIPに変更

# データベース
db_name     = "blog_dev"
db_username = "blog_user"
db_password = "ChangeThisPassword123!" # 強力なパスワードに変更

# バックエンド（後で設定）
backend_container_image = "123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/blog-backend-dev:latest"

# JWT Secret（ランダムな文字列32文字以上）
jwt_secret = "your-super-secret-jwt-key-minimum-32-characters-dev"

# CORS
cors_origins = "http://localhost:3000,https://dev.yourdomain.com"

# GitHub
github_repository_url = "https://github.com/yourusername/blog"
github_token = "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# ドメイン（持っている場合）
domain_name = "yourdomain.com" # 持っていない場合は後回し

# アラート
alert_email = "your-email@example.com"
```

### 3-2. Terraform実行（ネットワーク＋データベースのみ）

```bash
# 初期化
terraform init

# プラン確認（どんなリソースが作られるか確認）
terraform plan

# 実行（20〜30分かかります）
terraform apply

# "yes" を入力してEnter
```

**⏳ 待ち時間にできること:**
- AWSコンソールで作成中のリソースを確認
- CloudFormationスタックの進行状況を見る
- コーヒーを淹れる ☕

### 3-3. 出力を確認

```bash
# デプロイ完了後、重要な情報を確認
terraform output

# 特定の値だけ確認
terraform output database_url
terraform output ecr_repository_url
```

## ステップ4: バックエンドのデプロイ

### 4-1. ECRリポジトリURLを取得

```bash
# Terraform outputから取得
ECR_URI=$(terraform output -raw ecr_repository_url)
echo $ECR_URI
# 出力例: 123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/blog-backend-dev
```

### 4-2. Dockerイメージをビルド＆プッシュ

```bash
# ECRにログイン
aws ecr get-login-password --region ap-northeast-1 | \
  docker login --username AWS --password-stdin $ECR_URI

# backend ディレクトリに移動
cd ../../../../apps/backend

# Dockerイメージをビルド
docker build -t blog-backend .

# タグ付け
docker tag blog-backend:latest $ECR_URI:latest

# プッシュ
docker push $ECR_URI:latest

# 確認
aws ecr describe-images --repository-name blog-backend-dev --region ap-northeast-1
```

### 4-3. terraform.tfvars を更新

```bash
cd ../../infra/terraform/envs/dev

# terraform.tfvars の backend_container_image を実際のECR URIに変更
vim terraform.tfvars

# 変更例:
backend_container_image = "123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/blog-backend-dev:latest"

# 再度apply（ECSサービスが起動します）
terraform apply
```

### 4-4. データベースマイグレーション

```bash
# DATABASE_URLを取得
DATABASE_URL=$(terraform output -raw database_url)

# マイグレーション実行
cd ../../../../apps/backend
DATABASE_URL="$DATABASE_URL" sqlx migrate run

# 成功メッセージを確認
# Applied migration: 001_create_base_tables
# Applied migration: 002_insert_initial_data
```

## ステップ5: 動作確認

### 5-1. バックエンドAPIの確認

```bash
# ALBのDNS名を取得
ALB_DNS=$(cd ../../infra/terraform/envs/dev && terraform output -raw backend_alb_dns)

# ヘルスチェック
curl http://$ALB_DNS/health
# 期待される出力: {"status":"healthy"}

# ブログ記事一覧
curl http://$ALB_DNS/api/v1/posts
```

### 5-2. フロントエンドの確認

```bash
# Amplifyのデフォルトドメインでアクセス
FRONTEND_URL=$(cd ../../infra/terraform/envs/dev && terraform output -raw frontend_url)
echo "フロントエンド: $FRONTEND_URL"

# ブラウザで開く
open $FRONTEND_URL
```

## ステップ6: カスタムドメインの設定（オプション）

### 6-1. ネームサーバーを確認

```bash
cd infra/terraform/envs/dev
terraform output nameservers

# 出力例:
# [
#   "ns-123.awsdns-12.com",
#   "ns-456.awsdns-34.net",
#   "ns-789.awsdns-56.org",
#   "ns-012.awsdns-78.co.uk"
# ]
```

### 6-2. ドメイン登録業者で設定

1. お名前.com、ムームードメイン等の管理画面にログイン
2. ネームサーバー設定を変更
3. 上記の4つのネームサーバーを設定
4. 保存

### 6-3. DNS反映を待つ

```bash
# DNS反映確認（数時間〜48時間かかる場合あり）
dig dev.yourdomain.com

# SSL証明書の検証完了を確認（AWSコンソール）
# Certificate Manager → 証明書のステータスが "発行済み" になるまで待つ
```

### 6-4. アクセス確認

```bash
# フロントエンド
open https://dev.yourdomain.com

# バックエンドAPI
curl https://api-dev.yourdomain.com/health

# Swagger UI
open https://api-dev.yourdomain.com/swagger-ui
```

## 🎉 完了！

これで開発環境のデプロイが完了しました！

## 📊 コストを確認

```bash
# AWS Cost Explorer で料金を確認
# https://console.aws.amazon.com/cost-management/home

# 予想コスト（dev環境）:
# - RDS: 無料枠内
# - ECS Fargate: 約$10/月
# - Amplify: 約$5/月
# - その他: 約$5/月
# 合計: 約$20/月（無料枠活用時）
```

## 🧹 リソースの削除（不要になったら）

```bash
cd infra/terraform/envs/dev

# ⚠️ 警告: 全データが削除されます！
terraform destroy

# "yes" を入力
```

## 🐛 トラブルシューティング

### ECSタスクが起動しない

```bash
# CloudWatch Logs で確認
aws logs tail /ecs/blog-dev-backend --follow

# ECSサービスのイベント確認
aws ecs describe-services \
  --cluster blog-dev-cluster \
  --services blog-backend-dev-service \
  --region ap-northeast-1
```

### ALBのヘルスチェックが失敗

```bash
# ターゲットグループの状態確認
aws elbv2 describe-target-health \
  --target-group-arn <TARGET_GROUP_ARN>

# Security Groupの確認
# バックエンドSGが ALB SGからのポート8000を許可しているか確認
```

### データベースに接続できない

```bash
# Security Groupの確認
# データベースSGが バックエンドSGからのポート5432を許可しているか確認

# エンドポイントの確認
terraform output database_endpoint

# 接続テスト（Posticoなどから）
```

## 次のステップ

1. **本番環境のデプロイ**
   - `infra/terraform/envs/prod/` で同様の手順
   - より強固なセキュリティ設定

2. **CI/CDパイプライン構築**
   - GitHub Actions でデプロイ自動化
   - テスト自動実行

3. **監視とアラート設定**
   - CloudWatch Dashboard で可視化
   - Slack通知の設定

4. **パフォーマンス最適化**
   - CloudFront CDNの追加
   - RDSのスケールアップ

---

**質問や問題があれば README.md も参照してください！**

