# 🚀 Blog Infrastructure - Terraform

このディレクトリには、ブログアプリケーションのAWSインフラをTerraformで管理するコードが含まれています。

## 📚 学習用ガイド

### このTerraformコードで学べること

1. **AWS基礎概念**
   - VPC、サブネット、ルーティング（ネットワーク基礎）
   - Security Groups（ファイアウォール）
   - IAMロール（権限管理）

2. **コンテナとオーケストレーション**
   - ECS Fargate（サーバーレスコンテナ）
   - ECR（Dockerイメージレジストリ）
   - ALB（ロードバランサー）

3. **データベース**
   - RDS PostgreSQL（マネージドDB）
   - バックアップとリストア
   - マルチAZ構成

4. **フロントエンド**
   - AWS Amplify（Next.js SSR対応）
   - CloudFront（CDN）
   - カスタムドメイン

5. **DNS とセキュリティ**
   - Route53（ドメイン管理）
   - ACM（SSL証明書）
   - WAF（Webアプリケーションファイアウォール）

6. **監視とアラート**
   - CloudWatch（ログとメトリクス）
   - SNS（通知）
   - ダッシュボード

## 🏗️ ディレクトリ構成

```
infra/terraform/
├── envs/                    # 環境ごとの設定
│   ├── dev/                # 開発環境
│   │   ├── main.tf         # メインエントリーポイント
│   │   ├── variables.tf    # 変数定義
│   │   ├── outputs.tf      # 出力値
│   │   └── terraform.tfvars.example
│   └── prod/               # 本番環境
│       ├── main.tf
│       ├── variables.tf
│       ├── outputs.tf
│       └── terraform.tfvars.example
│
└── modules/                # 再利用可能なモジュール
    ├── network/            # VPC、サブネット、NAT Gateway
    ├── security/           # Security Groups、IAM、WAF
    ├── database/           # RDS PostgreSQL
    ├── backend/            # ECS Fargate、ALB
    ├── frontend/           # AWS Amplify
    ├── dns/                # Route53、ACM
    ├── monitoring/         # CloudWatch、アラート
    └── backup/             # AWS Backup
```

## 📖 各モジュールの役割

### 1. Network Module（ネットワーク基盤）

**何をするモジュール？**
- VPC（仮想ネットワーク）を作成
- パブリックサブネット（インターネットからアクセス可能）
- プライベートサブネット（内部のみアクセス可能）
- NAT Gateway（プライベートサブネットからインターネットへ）

**実世界の例え：**
マンション全体（VPC）の中に、玄関ロビー（パブリック）と住居エリア（プライベート）を作るイメージ。

**コスト：**
- VPC: 無料
- NAT Gateway: 約$30〜50/月（dev環境では無効化推奨）

---

### 2. Security Module（セキュリティ）

**何をするモジュール？**
- Security Groups（どこから何のポートへのアクセスを許可するか）
- IAMロール（AWSサービス間の権限）
- WAF（悪意のあるリクエストをブロック）
- KMS（データ暗号化キー）

**実世界の例え：**
マンションの防犯システム。誰が（IAM）、どのドア（Security Group）を通れるか、監視カメラ（WAF）で不審者をチェック。

**コスト：**
- Security Groups: 無料
- WAF: 約$5/月 + リクエスト数
- KMS: 約$1/月/キー

---

### 3. Database Module（データベース）

**何をするモジュール？**
- RDS PostgreSQL（マネージドデータベース）
- 自動バックアップ
- マルチAZ（高可用性構成）
- Performance Insights（パフォーマンス分析）

**実世界の例え：**
銀行の金庫室。データを安全に保管し、毎日自動でバックアップコピーを作成。

**コスト：**
- db.t3.micro（無料枠）: 月750時間まで無料
- db.t3.small: 約$30/月
- ストレージ: 20GB まで無料枠、以降 $0.115/GB/月

---

### 4. Backend Module（バックエンドAPI）

**何をするモジュール？**
- ECR（Dockerイメージ保存）
- ECS Fargate（コンテナ実行環境）
- ALB（ロードバランサー）
- Auto Scaling（自動スケーリング）

**実世界の例え：**
レストランのキッチン。注文（リクエスト）が増えたら自動でシェフ（コンテナ）を増やす。

**コスト：**
- Fargate: CPU 0.25vCPU = $0.01232/時間、メモリ 512MB = $0.00135/時間
- 月間稼働コスト（1タスク常時）: 約$10/月
- ALB: 約$20/月 + トラフィック費用

---

### 5. Frontend Module（フロントエンド）

**何をするモジュール？**
- AWS Amplify（Next.js ホスティング）
- 自動ビルド・デプロイ
- CDN配信（高速化）
- カスタムドメイン対応

**実世界の例え：**
世界中にある本屋さんのチェーン店（CDN）。一番近い店舗からコンテンツを配信。

**コスト：**
- Amplify: ビルド時間 $0.01/分、ホスティング $0.15/GB/月
- 小規模サイト: 約$5〜15/月

---

### 6. DNS Module（ドメイン管理）

**何をするモジュール？**
- Route53（DNS管理）
- ACM（SSL証明書、無料）
- ドメインとIPアドレスの紐付け

**実世界の例え：**
電話帳。ドメイン名（example.com）を実際のサーバー住所（IPアドレス）に変換。

**コスト：**
- Route53 Hosted Zone: $0.50/月
- ACM証明書: 無料
- DNSクエリ: 100万クエリまで $0.40

---

### 7. Monitoring Module（監視）

**何をするモジュール？**
- CloudWatch Logs（ログ収集）
- CloudWatch Metrics（メトリクス）
- CloudWatch Alarms（アラート）
- SNS（メール通知）

**実世界の例え：**
ビルの監視室。異常があったら管理人（あなた）にメール通知。

**コスト：**
- CloudWatch Logs: 5GBまで無料、以降 $0.50/GB
- メトリクス: 10個まで無料
- アラーム: 10個まで無料
- 小規模運用: ほぼ無料〜$5/月

---

### 8. Backup Module（バックアップ）

**何をするモジュール？**
- AWS Backup（自動バックアップ）
- スケジュール実行（毎日深夜など）
- リストア機能

**実世界の例え：**
毎晩自動でデータの写真を撮って金庫に保管。

**コスト：**
- バックアップストレージ: $0.05/GB/月
- リストア: $0.02/GB

---

## 💰 コスト見積もり

### 開発環境（最小構成）
- RDS（db.t3.micro）: 無料枠内
- ECS Fargate（0.25vCPU, 512MB, 1タスク）: 約$10/月
- Amplify: 約$5/月
- Route53: $0.50/月
- その他（CloudWatch等）: 約$5/月
- **合計: 約$20〜25/月**（無料枠活用時）

### 本番環境（推奨構成）
- RDS（db.t3.small, マルチAZ）: 約$60/月
- ECS Fargate（0.5vCPU, 1GB, 2タスク）: 約$40/月
- ALB: 約$20/月
- Amplify: 約$15/月
- Route53 + ACM: $0.50/月
- WAF: 約$5/月
- CloudWatch: 約$10/月
- **合計: 約$150〜200/月**

## 🚀 デプロイ手順

### 前提条件

1. **AWSアカウント作成**
   - https://aws.amazon.com/ でアカウント作成
   - クレジットカード登録が必要

2. **AWS CLIインストール**
   ```bash
   # macOS
   brew install awscli
   
   # 設定
   aws configure
   # AWS Access Key ID: （IAMで作成）
   # AWS Secret Access Key: （IAMで作成）
   # Default region: ap-northeast-1
   ```

3. **Terraformインストール**
   ```bash
   # macOS
   brew install terraform
   
   # バージョン確認
   terraform --version
   ```

4. **ドメイン取得**
   - お名前.com、ムームードメイン等でドメイン取得
   - または Route53 で直接購入

### ステップ1: 開発環境のデプロイ

```bash
# 1. dev環境ディレクトリに移動
cd infra/terraform/envs/dev

# 2. terraform.tfvars を作成
cp terraform.tfvars.example terraform.tfvars

# 3. terraform.tfvars を編集（必須項目を設定）
vim terraform.tfvars

# 4. Terraform初期化
terraform init

# 5. プラン確認（どんなリソースが作成されるか確認）
terraform plan

# 6. デプロイ実行
terraform apply

# 確認プロンプトで "yes" を入力
```

### ステップ2: バックエンドのDockerイメージをビルド

```bash
# 1. ECRにログイン
aws ecr get-login-password --region ap-northeast-1 | \
  docker login --username AWS --password-stdin <ECR_URI>

# 2. Dockerイメージをビルド
cd apps/backend
docker build -t blog-backend .

# 3. タグ付け
docker tag blog-backend:latest <ECR_URI>/blog-backend-dev:latest

# 4. プッシュ
docker push <ECR_URI>/blog-backend-dev:latest
```

### ステップ3: データベースマイグレーション

```bash
# 1. DATABASE_URLを取得（Terraform outputから）
terraform output -raw database_url

# 2. マイグレーション実行
cd apps/backend
DATABASE_URL="<上記で取得したURL>" sqlx migrate run
```

### ステップ4: ECSサービスを更新

```bash
# 新しいイメージでタスクを再起動
aws ecs update-service \
  --cluster blog-dev-cluster \
  --service blog-backend-dev-service \
  --force-new-deployment \
  --region ap-northeast-1
```

### ステップ5: Route53のネームサーバーを設定

1. Terraform output からネームサーバーを確認
   ```bash
   terraform output nameservers
   ```

2. ドメイン登録業者の管理画面で、上記ネームサーバーを設定

3. 反映待ち（最大48時間、通常は数時間）

### ステップ6: アクセス確認

```bash
# フロントエンド
open https://dev.yourdomain.com

# バックエンドAPI
curl https://api-dev.yourdomain.com/health

# Swagger UI
open https://api-dev.yourdomain.com/swagger-ui
```

## 🧹 リソース削除（開発環境）

**⚠️ 注意: 削除すると全データが失われます！**

```bash
cd infra/terraform/envs/dev

# 削除実行
terraform destroy

# 確認プロンプトで "yes" を入力
```

## 📚 学習リソース

### AWS公式ドキュメント
- [AWS入門ガイド](https://aws.amazon.com/jp/getting-started/)
- [VPCとは](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/what-is-amazon-vpc.html)
- [ECS Fargateとは](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/AWS_Fargate.html)
- [RDSとは](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/Welcome.html)

### Terraform公式ドキュメント
- [Terraform入門](https://developer.hashicorp.com/terraform/tutorials/aws-get-started)
- [AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)

### 推奨学習順序

1. **Week 1-2: AWS基礎**
   - VPC、サブネット、Security Groupsの概念理解
   - AWSコンソールで手動リソース作成を試す

2. **Week 3-4: Terraform基礎**
   - Terraformの文法（HCL）を学ぶ
   - 簡単なリソース（S3バケット等）を作成・削除

3. **Week 5-6: コンテナ基礎**
   - Dockerの基礎
   - ECRへのイメージpush/pull
   - ECS Fargateでコンテナ実行

4. **Week 7-8: 実践デプロイ**
   - このTerraformコードを実際にデプロイ
   - 各リソースの動作確認
   - 料金を確認しながら運用

## 🐛 トラブルシューティング

### よくあるエラー

**1. `terraform init` が失敗する**
```
AWS認証情報が設定されていない可能性があります。
→ aws configure を実行
```

**2. `terraform apply` で権限エラー**
```
IAMユーザーに適切な権限がない可能性があります。
→ AdministratorAccess ポリシーをアタッチ（学習用）
```

**3. ALBのヘルスチェックが失敗**
```
バックエンドコンテナが起動していない、またはヘルスチェックパスが間違っている。
→ ECSタスクのログをCloudWatchで確認
```

**4. ドメインにアクセスできない**
```
ネームサーバーの設定が反映されていない、またはACM証明書が未検証。
→ Route53のホストゾーンとドメイン登録業者の設定を確認
```

## 💡 Tips

1. **コスト管理**
   - AWS Cost Explorerで毎日コストを確認
   - 不要なリソースは `terraform destroy` で削除
   - dev環境では夜間にECSタスクを0にスケールダウン

2. **セキュリティ**
   - `terraform.tfvars` は `.gitignore` に追加（絶対にコミットしない）
   - 本番環境では必ず Secrets Manager を使用
   - Security Groupsは最小権限の原則

3. **学習のコツ**
   - まずは dev環境で試す
   - 各リソースをAWSコンソールで確認して理解を深める
   - わからない用語は公式ドキュメントで調べる
   - エラーメッセージをGoogle検索（英語で）

## 📞 サポート

質問や問題があれば、以下を確認してください：

1. このREADME
2. 各モジュールの `main.tf` のコメント
3. [Terraform AWS Providerドキュメント](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
4. [AWS公式ドキュメント](https://docs.aws.amazon.com/)

---

**Happy Learning! 🚀**


