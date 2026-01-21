# 📑 Terraform コード索引

このドキュメントは、Terraformコード全体の索引です。学習の際に参考にしてください。

## 📚 ドキュメント一覧

| ドキュメント | 内容 | 対象読者 |
|------------|------|---------|
| [README.md](./README.md) | 全体概要・学習ガイド | 初心者〜中級者 |
| [QUICKSTART.md](./QUICKSTART.md) | 実践デプロイ手順 | 初心者 |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | アーキテクチャ図解 | 全員 |
| このファイル (INDEX.md) | コード索引 | 全員 |

## 🗂️ ディレクトリ構成

```
infra/terraform/
├── 📄 ドキュメント
│   ├── README.md ...................... 学習ガイド・コスト見積もり
│   ├── QUICKSTART.md .................. デプロイ手順書
│   ├── ARCHITECTURE.md ................ アーキテクチャ図解
│   └── INDEX.md ....................... このファイル
│
├── 📁 envs/ ........................... 環境ごとの設定
│   ├── dev/ ........................... 開発環境
│   │   ├── main.tf .................... メインエントリーポイント
│   │   ├── variables.tf ............... 変数定義
│   │   ├── outputs.tf ................. 出力値定義
│   │   └── terraform.tfvars.example ... 設定サンプル
│   │
│   └── prod/ .......................... 本番環境
│       ├── main.tf .................... メインエントリーポイント
│       ├── variables.tf ............... 変数定義
│       ├── outputs.tf ................. 出力値定義
│       └── terraform.tfvars.example ... 設定サンプル
│
└── 📁 modules/ ........................ 再利用可能なモジュール
    ├── network/ ....................... VPC・サブネット
    ├── security/ ...................... Security Groups・IAM
    ├── database/ ...................... RDS PostgreSQL
    ├── backend/ ....................... ECS Fargate・ALB
    ├── frontend/ ...................... AWS Amplify
    ├── dns/ ........................... Route53・ACM
    ├── monitoring/ .................... CloudWatch
    └── backup/ ........................ AWS Backup
```

## 📖 モジュール詳細

### 1. Network Module (`modules/network/`)

**責任:** ネットワーク基盤の構築

| ファイル | 行数 | 主なリソース |
|---------|-----|------------|
| main.tf | ~300 | VPC, Subnet, IGW, NAT Gateway, VPC Endpoints |
| variables.tf | ~40 | 設定変数 |
| outputs.tf | ~60 | VPC ID, Subnet IDs |

**学習ポイント:**
- VPCとは何か
- パブリック/プライベートサブネットの違い
- NAT Gatewayの役割
- VPC Endpointsによるコスト削減

**主要リソース:**
```hcl
- aws_vpc                          # 仮想ネットワーク
- aws_subnet (public/private/db)   # サブネット分割
- aws_internet_gateway             # インターネット接続
- aws_nat_gateway                  # プライベートからの外部接続
- aws_route_table                  # ルーティング設定
- aws_vpc_endpoint                 # AWSサービスへの直接接続
```

---

### 2. Security Module (`modules/security/`)

**責任:** セキュリティ設定全般

| ファイル | 行数 | 主なリソース |
|---------|-----|------------|
| main.tf | ~350 | Security Groups, IAM Roles, WAF, KMS |
| variables.tf | ~30 | 設定変数 |
| outputs.tf | ~50 | SG IDs, Role ARNs |

**学習ポイント:**
- Security Groupsの設定方法
- IAMロールとポリシー
- WAFによるWeb攻撃対策
- データ暗号化（KMS）

**主要リソース:**
```hcl
- aws_security_group              # ファイアウォールルール
- aws_iam_role                    # サービス間の権限
- aws_iam_role_policy             # ポリシー定義
- aws_wafv2_web_acl              # Webファイアウォール
- aws_kms_key                     # 暗号化キー
```

**セキュリティレイヤー:**
1. ALB SG: インターネット → ALB (443)
2. Backend SG: ALB → ECS (8000)
3. Database SG: ECS → RDS (5432)

---

### 3. Database Module (`modules/database/`)

**責任:** PostgreSQLデータベース管理

| ファイル | 行数 | 主なリソース |
|---------|-----|------------|
| main.tf | ~250 | RDS Instance, Parameter Group, Secrets |
| variables.tf | ~120 | DB設定変数 |
| outputs.tf | ~50 | エンドポイント, 接続URL |

**学習ポイント:**
- RDSとは何か
- マルチAZ構成（高可用性）
- 自動バックアップ設定
- Performance Insights

**主要リソース:**
```hcl
- aws_db_instance                  # RDSインスタンス
- aws_db_parameter_group           # PostgreSQL設定
- aws_secretsmanager_secret        # 認証情報の安全な保管
- aws_cloudwatch_metric_alarm      # DB監視アラート
```

**RDSの設定:**
- Engine: PostgreSQL 15.6
- Instance Class: db.t3.micro (無料枠) / db.t3.small (本番)
- Storage: 20GB (dev) / 50GB (prod)
- Backup: 7日 (dev) / 30日 (prod)

---

### 4. Backend Module (`modules/backend/`)

**責任:** Rustバックエンドの実行環境

| ファイル | 行数 | 主なリソース |
|---------|-----|------------|
| main.tf | ~400 | ECS Cluster, Task, Service, ALB |
| variables.tf | ~150 | コンテナ設定変数 |
| outputs.tf | ~80 | ALB DNS, ECS ARNs |

**学習ポイント:**
- Dockerコンテナとは
- ECS Fargateの仕組み
- ロードバランサー（ALB）
- Auto Scaling

**主要リソース:**
```hcl
- aws_ecr_repository               # Dockerイメージ保存
- aws_ecs_cluster                  # ECSクラスター
- aws_ecs_task_definition          # コンテナ定義
- aws_ecs_service                  # サービス実行
- aws_lb                           # ロードバランサー
- aws_lb_target_group              # ターゲット設定
- aws_appautoscaling_target        # Auto Scaling
```

**ECS構成:**
- Fargate: サーバーレスコンテナ
- CPU: 256 (0.25 vCPU) / 512 (0.5 vCPU)
- Memory: 512MB / 1GB
- Desired Count: 1 (dev) / 2 (prod)

---

### 5. Frontend Module (`modules/frontend/`)

**責任:** Next.jsフロントエンドのホスティング

| ファイル | 行数 | 主なリソース |
|---------|-----|------------|
| main.tf | ~150 | Amplify App, Branch, Domain |
| variables.tf | ~90 | Amplify設定変数 |
| outputs.tf | ~40 | App ID, URL |

**学習ポイント:**
- AWS Amplifyとは
- CI/CD（継続的デプロイ）
- SSR（サーバーサイドレンダリング）
- カスタムドメイン設定

**主要リソース:**
```hcl
- aws_amplify_app                  # Amplifyアプリ
- aws_amplify_branch               # ブランチ設定
- aws_amplify_domain_association   # カスタムドメイン
- aws_amplify_webhook              # デプロイトリガー
```

**Amplifyの特徴:**
- GitHubと自動連携
- プッシュ時に自動ビルド＆デプロイ
- グローバルCDN配信
- SSL証明書自動管理

---

### 6. DNS Module (`modules/dns/`)

**責任:** ドメイン名とSSL証明書管理

| ファイル | 行数 | 主なリソース |
|---------|-----|------------|
| main.tf | ~200 | Route53, ACM Certificate |
| variables.tf | ~60 | DNS設定変数 |
| outputs.tf | ~40 | ネームサーバー, 証明書ARN |

**学習ポイント:**
- DNSの仕組み
- Route53の使い方
- SSL/TLS証明書（ACM）
- DNS検証

**主要リソース:**
```hcl
- aws_route53_zone                 # ホストゾーン作成
- aws_route53_record               # DNSレコード
- aws_acm_certificate              # SSL証明書
- aws_acm_certificate_validation   # 証明書検証
```

**DNSレコード構成:**
- dev.yourdomain.com → Amplify
- api-dev.yourdomain.com → ALB
- yourdomain.com → Amplify (本番)
- api.yourdomain.com → ALB (本番)

---

### 7. Monitoring Module (`modules/monitoring/`)

**責任:** ログ収集・メトリクス監視・アラート

| ファイル | 行数 | 主なリソース |
|---------|-----|------------|
| main.tf | ~250 | CloudWatch Logs, Alarms, SNS |
| variables.tf | ~80 | 監視設定変数 |
| outputs.tf | ~30 | Log Group, SNS Topic |

**学習ポイント:**
- CloudWatch Logsとは
- メトリクスとアラート
- SNS通知設定
- ダッシュボード作成

**主要リソース:**
```hcl
- aws_cloudwatch_log_group         # ログ保存
- aws_cloudwatch_metric_alarm      # アラート設定
- aws_sns_topic                    # 通知トピック
- aws_cloudwatch_dashboard         # ダッシュボード
```

**監視項目:**
- ECS: CPU, メモリ, タスク数
- ALB: 5xxエラー, レスポンスタイム
- RDS: CPU, ストレージ, 接続数

---

### 8. Backup Module (`modules/backup/`)

**責任:** 自動バックアップ設定

| ファイル | 行数 | 主なリソース |
|---------|-----|------------|
| main.tf | ~100 | AWS Backup Plan, Vault |
| variables.tf | ~30 | バックアップ設定 |
| outputs.tf | ~15 | Backup Vault ARN |

**学習ポイント:**
- AWS Backupの使い方
- バックアップスケジュール
- リストア手順
- クロスリージョンバックアップ

**主要リソース:**
```hcl
- aws_backup_vault                 # バックアップ保存先
- aws_backup_plan                  # バックアッププラン
- aws_backup_selection             # バックアップ対象
```

**バックアップ設定:**
- スケジュール: 毎日午前2時（JST 11時）
- 保持期間: 30日
- 対象: RDS PostgreSQL

---

## 🔍 コード検索ガイド

### 特定のリソースを探す場合

```bash
# VPCの設定を探す
grep -r "aws_vpc" modules/network/

# Security Groupの設定を探す
grep -r "aws_security_group" modules/security/

# RDSの設定を探す
grep -r "aws_db_instance" modules/database/

# ECSの設定を探す
grep -r "aws_ecs" modules/backend/
```

### 環境変数を探す場合

```bash
# dev環境の変数
cat envs/dev/variables.tf

# prod環境の変数
cat envs/prod/variables.tf

# モジュールの変数
cat modules/*/variables.tf
```

### 出力値を確認する場合

```bash
# dev環境の出力
cat envs/dev/outputs.tf

# 特定のモジュールの出力
cat modules/database/outputs.tf
```

## 📊 コード統計

```
総ファイル数:     38ファイル
総行数:          約5,000行
モジュール数:     8モジュール
環境数:          2環境 (dev/prod)
ドキュメント:     4ファイル

言語:
  - HCL (Terraform): 90%
  - Markdown:        10%
```

## 🎯 学習パス

### Level 1: 初心者（Week 1-2）
1. `README.md` を読む
2. `ARCHITECTURE.md` で全体像を理解
3. `modules/network/` から始める
4. AWSコンソールでリソースを確認

### Level 2: 実践（Week 3-4）
1. `QUICKSTART.md` に従ってdev環境をデプロイ
2. 各モジュールのコードを読む
3. 変数を変更して動作を確認
4. リソースを削除・再作成

### Level 3: カスタマイズ（Week 5-6）
1. 新しいモジュールを追加
2. 既存モジュールを改良
3. prod環境をデプロイ
4. 監視・アラート設定

### Level 4: 最適化（Week 7-8）
1. コスト最適化
2. セキュリティ強化
3. パフォーマンスチューニング
4. CI/CD構築

## 🔗 関連リソース

- [Terraform公式ドキュメント](https://www.terraform.io/docs)
- [AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS公式ドキュメント](https://docs.aws.amazon.com/)
- [Terraform Best Practices](https://www.terraform-best-practices.com/)

---

**このコードベースで学べば、実務で通用するTerraform/AWSスキルが身につきます！**


