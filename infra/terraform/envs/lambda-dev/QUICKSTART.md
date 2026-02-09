# ⚡ クイックスタート - 最短でデプロイする手順

このガイドでは、最短時間でRust Lambda APIをデプロイする手順を示します。

## 🚀 5ステップでデプロイ

### ステップ1: AWS認証情報の設定（1分）

```bash
aws configure
# AWS Access Key ID: <あなたのキー>
# AWS Secret Access Key: <あなたのシークレット>
# Default region: ap-northeast-1
# Default output format: json
```

### ステップ2: ECRリポジトリを作成（2分）

```bash
cd infra/terraform/envs/lambda-dev
terraform init
terraform apply -target=module.lambda_api.aws_ecr_repository.lambda
# → 'yes'と入力
```

出力されるECR URLをメモします：
```
ecr_repository_url = "123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/blog-dev-lambda-api"
```

### ステップ3: Dockerイメージをビルド＆プッシュ（5-10分）

```bash
cd ../../../apps/backend-lambda
./scripts/build-and-push.sh dev
```

このスクリプトが自動的に：
- ECRにログイン
- Dockerイメージをビルド
- ECRにプッシュ

してくれます。

### ステップ4: Terraform変数を設定（1分）

```bash
cd ../../infra/terraform/envs/lambda-dev
cp terraform.tfvars.example terraform.tfvars
```

`terraform.tfvars`を編集：

```hcl
aws_region = "ap-northeast-1"
environment = "dev"

# ステップ2でメモしたECR URLを設定
lambda_image_uri = "123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/blog-dev-lambda-api:latest"

# ローカル開発時
allowed_origin = "http://localhost:3000"

lambda_timeout     = 30
lambda_memory_size = 128
```

### ステップ5: デプロイ（3-5分）

```bash
terraform apply
# → 'yes'と入力
```

完了！🎉

出力されるAPI URLをメモします：
```
api_endpoint = "https://abc123xyz.execute-api.ap-northeast-1.amazonaws.com"
```

## ✅ 動作確認（30秒）

```bash
# 自動テストスクリプトを実行
cd ../../../apps/backend-lambda
./scripts/test-api.sh dev
```

または手動でテスト：

```bash
curl https://abc123xyz.execute-api.ap-northeast-1.amazonaws.com/hello
```

## 🔄 コード変更時の更新手順（5分）

1. **コードを修正**
```bash
cd apps/backend-lambda
# src/main.rsを編集
```

2. **ビルド＆プッシュ**
```bash
./scripts/build-and-push.sh dev
```

3. **Lambda更新**
```bash
./scripts/update-lambda.sh dev
```

完了！新しいコードがデプロイされました。

## 🌟 本番環境へのデプロイ

```bash
# 本番用イメージをビルド＆プッシュ（バージョンタグ付き）
cd apps/backend-lambda
./scripts/build-and-push.sh prod v1.0.0

# 本番環境の設定
cd ../../infra/terraform/envs/lambda-prod
cp terraform.tfvars.example terraform.tfvars
# terraform.tfvarsを編集
# - lambda_image_uri: v1.0.0 タグを指定
# - allowed_origin: 本番VercelのURL

# デプロイ
terraform apply
```

## 📊 ログの確認

```bash
# リアルタイムでログを表示
aws logs tail /aws/lambda/blog-dev-api --follow
```

## 💰 コスト確認

現在のコストを確認：

```bash
# 今月のLambda実行回数
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=blog-dev-api \
  --start-time $(date -u -d '1 month ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 2592000 \
  --statistics Sum
```

無料枠: 月100万リクエスト

## 🗑️ リソースの削除

使わなくなったら削除：

```bash
cd infra/terraform/envs/lambda-dev
terraform destroy
# → 'yes'と入力
```

すべてのリソースが削除され、課金が停止します。

## 🆘 よくある質問

**Q: ビルドに時間がかかりすぎる**
A: 2回目以降はDockerのキャッシュが効いて高速化します。

**Q: ECRにプッシュできない**
A: IAMユーザーに`AmazonEC2ContainerRegistryFullAccess`権限を付与してください。

**Q: API GatewayのURLが長くて覚えられない**
A: Route53でカスタムドメインを設定できます（別途ドメイン必要）。

**Q: 無料枠を超えたらどうなる？**
A: AWS Billing Consoleで予算アラートを設定しておくと安心です。

---

これで完了です！困ったことがあれば、DEPLOYMENT.mdの詳細な手順を確認してください。
