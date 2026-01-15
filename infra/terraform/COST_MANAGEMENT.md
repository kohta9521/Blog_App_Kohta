# 💰 コスト管理ガイド

## 📊 料金発生のタイミング

### ✅ 料金が発生しない操作
```bash
git clone                    # コードをクローン
cd infra/terraform/envs/dev
terraform init              # プロバイダーのダウンロード（無料）
terraform plan              # プラン確認（無料）
terraform validate          # コード検証（無料）
```

### ⚠️ 料金が発生する操作
```bash
terraform apply             # リソース作成開始（課金開始）
# ↑ ここで初めてAWSリソースが作られ、料金が発生
```

## 💸 コスト見積もり

### 開発環境（最小構成）

| サービス | スペック | 月額料金 | 無料枠 |
|---------|---------|---------|--------|
| RDS | db.t3.micro | $15 | 750時間/月 |
| ECS Fargate | 0.25vCPU, 512MB | $10 | 初回割引あり |
| ALB | | $20 | なし |
| Amplify | ビルド＋ホスティング | $5 | なし |
| Route53 | 1ホストゾーン | $0.50 | なし |
| CloudWatch | ログ＋メトリクス | $5 | 5GB/10個/10個 |
| **合計** | | **$55.50** | **無料枠活用で $20〜25** |

### 本番環境（推奨構成）

| サービス | スペック | 月額料金 |
|---------|---------|---------|
| RDS | db.t3.small, Multi-AZ | $60 |
| ECS Fargate | 0.5vCPU, 1GB × 2タスク | $40 |
| ALB | | $20 |
| Amplify | | $15 |
| Route53 | | $0.50 |
| WAF | | $5 |
| CloudWatch | 詳細監視 | $10 |
| **合計** | | **$150〜200** |

## 🎯 コスト削減テクニック

### 1. 開発環境での節約術

#### NAT Gatewayを無効化（月$30節約）
```hcl
# envs/dev/main.tf
module "network" {
  enable_nat_gateway = false  # ✅ dev環境では無効化
  # VPC Endpointsを使用して外部通信
}
```

#### 夜間・週末はリソースを停止
```bash
# ECSタスクを0にスケールダウン（平日18時〜翌9時）
aws ecs update-service \
  --cluster blog-dev-cluster \
  --service blog-backend-dev-service \
  --desired-count 0

# 朝、起動
aws ecs update-service \
  --cluster blog-dev-cluster \
  --service blog-backend-dev-service \
  --desired-count 1
```

#### RDSをシングルAZに
```hcl
# envs/dev/main.tf
module "database" {
  multi_az = false  # ✅ dev環境ではシングルAZ（$30節約）
}
```

### 2. 本番環境での最適化

#### Savings Plansの活用（-20〜40%）
```
AWS Console → Savings Plans
→ Compute Savings Plans (1年/3年契約)
→ ECS Fargate: -20%
→ RDS Reserved Instances: -40%
```

#### S3 Intelligent-Tiering
```hcl
resource "aws_s3_bucket" "uploads" {
  bucket = "blog-uploads"
  
  lifecycle_rule {
    enabled = true
    transition {
      days          = 30
      storage_class = "INTELLIGENT_TIERING"  # 自動でコスト最適化
    }
  }
}
```

#### CloudFront キャッシュで転送量削減
```
画像配信にCloudFrontを使用
→ オリジンへのリクエストを90%削減
→ データ転送料が50%削減
```

## 📈 コスト監視の設定

### 1. AWS Cost Explorerの有効化

```bash
# AWSコンソールで有効化（初回のみ）
# https://console.aws.amazon.com/cost-management/home
```

### 2. 予算アラートの設定

```bash
# AWS Budgetsで設定
# 例: 月$30を超えたらメール通知
```

### 3. Terraformでコスト管理

```hcl
# modules/monitoring/cost_alerts.tf
resource "aws_budgets_budget" "monthly" {
  name         = "blog-${var.environment}-monthly-budget"
  budget_type  = "COST"
  limit_amount = "30"  # dev環境: $30
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  notification {
    comparison_operator = "GREATER_THAN"
    threshold           = 80  # 80%で通知
    threshold_type      = "PERCENTAGE"
    notification_type   = "ACTUAL"
    subscriber_email_addresses = [var.alert_email]
  }
}
```

## 🚨 課金事故を防ぐチェックリスト

### デプロイ前
- [ ] `terraform plan` で作成されるリソースを確認
- [ ] 不要なリソース（NAT Gateway等）が無効化されている
- [ ] RDSのインスタンスサイズが適切（db.t3.micro等）
- [ ] ECSのタスク数が適切（dev環境では1）
- [ ] AWS予算アラートを設定済み

### デプロイ後
- [ ] Cost Explorerで毎日料金を確認
- [ ] CloudWatchで異常なメトリクスがないか確認
- [ ] 不要なリソースは即座に削除（terraform destroy）
- [ ] 夜間・週末はリソースを停止

### 定期確認（週1回）
- [ ] Cost Explorerで週次レポート確認
- [ ] 予想外の料金がないかチェック
- [ ] 使っていないリソースがないか確認

## 💡 料金が予想外に高くなるケース

### ⚠️ よくある課金トラブル

1. **NAT Gateway を有効にしたまま**
   - 料金: 約$0.045/時間 = **$32/月**
   - 対策: dev環境では無効化

2. **RDS Multi-AZ を有効にしたまま**
   - 料金: インスタンス料金が**2倍**
   - 対策: dev環境ではシングルAZ

3. **ALBのアイドルタイム課金**
   - 料金: 約$0.025/時間 = **$18/月**（使っていなくても）
   - 対策: 使わない時は削除

4. **CloudWatch Logsの保存**
   - 料金: $0.50/GB/月
   - 対策: ログ保持期間を7日に制限

5. **ECSタスクの起動しっぱなし**
   - 料金: 24時間稼働で約$10/月
   - 対策: 夜間・週末は停止

## 🛡️ 課金事故防止の最終手段

### AWS予算の厳格な制限

```bash
# ルートアカウントで設定（最重要）
AWS Console → Billing → Budgets
→ Create budget
→ Cost budget: $50/月
→ Alert at: $40 (80%)
→ Email: your-email@example.com
```

### CloudWatch Billing Alarm

```hcl
resource "aws_cloudwatch_metric_alarm" "billing_alarm" {
  alarm_name          = "billing-alarm-50usd"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "EstimatedCharges"
  namespace           = "AWS/Billing"
  period              = "21600"  # 6時間
  statistic           = "Maximum"
  threshold           = 50
  alarm_description   = "料金が$50を超えました！"
  alarm_actions       = [aws_sns_topic.billing_alerts.arn]
}
```

## 📞 サポート

### 料金について不明な点があれば

1. **AWS Cost Explorer** で詳細確認
2. **AWS Billing Dashboard** でサービス別料金確認
3. **AWS Support** に問い合わせ（Basic Planは無料）

### 予想外の高額請求が来たら

1. **すぐに `terraform destroy`** でリソース削除
2. **Cost Explorerで原因特定**
3. **AWS Supportに連絡**（ケースによっては返金対応あり）

---

**コスト管理はインフラ運用で最も重要なスキルの一つです。必ず毎日確認しましょう！**


