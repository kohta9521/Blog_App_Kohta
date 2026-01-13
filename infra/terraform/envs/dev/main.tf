# ===========================================
# 🚀 Development Environment - Blog Infrastructure
# ===========================================
# このファイルは開発環境のメインエントリーポイントです
# AWSリソースの全体的な構成を定義します

terraform {
  required_version = ">= 1.7.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Terraform Stateの保存先（後で設定）
  # backend "s3" {
  #   bucket         = "blog-terraform-state-dev"
  #   key            = "dev/terraform.tfstate"
  #   region         = "ap-northeast-1"
  #   encrypt        = true
  #   dynamodb_table = "terraform-state-lock"
  # }
}

# ===========================================
# 📍 Provider Configuration
# ===========================================
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = "dev"
      Project     = "blog"
      ManagedBy   = "terraform"
      Owner       = "kohta"
    }
  }
}

# Route53とACMは us-east-1 で管理（CloudFront/Amplify用）
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Environment = "dev"
      Project     = "blog"
      ManagedBy   = "terraform"
    }
  }
}

# ===========================================
# 🌐 Network Module
# ===========================================
# VPC、サブネット、ルーティングなどのネットワーク基盤
module "network" {
  source = "../../modules/network"

  environment         = var.environment
  vpc_cidr            = var.vpc_cidr
  availability_zones  = var.availability_zones
  enable_nat_gateway  = false # dev環境ではコスト削減のためNAT Gatewayを無効化
  single_nat_gateway  = true  # 有効化する場合は1つだけ
}

# ===========================================
# 🔐 Security Module
# ===========================================
# Security Groups、IAMロール、WAFなどのセキュリティ設定
module "security" {
  source = "../../modules/security"

  environment     = var.environment
  vpc_id          = module.network.vpc_id
  allowed_ips     = var.allowed_ips # 開発環境では特定IPのみアクセス許可
}

# ===========================================
# 🗄️ Database Module (RDS PostgreSQL)
# ===========================================
# ブログ用のデータベース（無料枠: db.t3.micro）
module "database" {
  source = "../../modules/database"

  environment             = var.environment
  vpc_id                  = module.network.vpc_id
  database_subnet_ids        = module.network.database_subnet_ids
  database_subnet_group_name = module.network.database_subnet_group_name
  database_security_group    = module.security.database_security_group_id
  
  # Database Configuration
  db_name              = var.db_name
  db_username          = var.db_username
  db_password          = var.db_password # 本番では AWS Secrets Manager を使用
  db_instance_class    = "db.t3.micro"   # 無料枠対象
  allocated_storage    = 20              # 無料枠: 20GB
  backup_retention     = 7               # dev環境でも7日保持
  multi_az             = false           # dev環境ではシングルAZ
  deletion_protection  = false           # dev環境では削除保護オフ
  storage_encrypted    = false           # dev環境では暗号化なし（コスト削減）
}

# ===========================================
# 🐳 Backend Module (ECS Fargate)
# ===========================================
# Rustバックエンドをコンテナで実行
module "backend" {
  source = "../../modules/backend"

  environment              = var.environment
  vpc_id                   = module.network.vpc_id
  private_subnet_ids       = module.network.private_subnet_ids
  public_subnet_ids        = module.network.public_subnet_ids
  backend_security_group   = module.security.backend_security_group_id
  alb_security_group       = module.security.alb_security_group_id
  execution_role_arn       = module.security.ecs_task_execution_role_arn
  task_role_arn           = module.security.ecs_task_role_arn
  
  # ECS Configuration
  container_image          = var.backend_container_image
  container_port           = 8000
  cpu                      = 256    # 0.25 vCPU（最小）
  memory                   = 512    # 512 MB（最小）
  desired_count            = 1      # dev環境では1台
  
  # Environment Variables
  database_url             = module.database.database_url
  database_secrets_arn     = module.database.secrets_manager_secret_arn
  jwt_secret               = var.jwt_secret
  cors_origins             = var.cors_origins
  
  # Auto Scaling
  enable_auto_scaling      = false  # dev環境では無効化
}

# ===========================================
# 🎨 Frontend Module (AWS Amplify)
# ===========================================
# Next.js 16 App Router をデプロイ
module "frontend" {
  source = "../../modules/frontend"

  environment         = var.environment
  app_name            = "blog-frontend"
  repository_url      = var.github_repository_url
  branch_name         = "develop"
  github_token        = var.github_token
  
  # Backend API Endpoint
  backend_api_url     = module.backend.alb_dns_name
  
  # Build Settings
  build_spec = <<-EOT
    version: 1
    frontend:
      phases:
        preBuild:
          commands:
            - cd apps/frontend
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: apps/frontend/.next
        files:
          - '**/*'
      cache:
        paths:
          - apps/frontend/node_modules/**/*
  EOT
}

# ===========================================
# 🌍 DNS Module (Route53)
# ===========================================
# ドメイン設定とDNSレコード管理
module "dns" {
  source = "../../modules/dns"

  environment     = var.environment
  domain_name     = var.domain_name
  subdomain       = "dev" # dev.yourdomain.com
  
  # Frontend
  frontend_domain = module.frontend.default_domain
  
  # Backend API
  backend_alb_dns = module.backend.alb_dns_name
  backend_alb_zone_id = module.backend.alb_zone_id
  
  # SSL証明書（ACM）
  create_certificate = true
  
  providers = {
    aws = aws.us_east_1 # Route53とACMは us-east-1
  }
}

# ===========================================
# 📊 Monitoring Module (CloudWatch)
# ===========================================
# ログ、メトリクス、アラート設定
module "monitoring" {
  source = "../../modules/monitoring"

  environment         = var.environment
  backend_cluster_arn = module.backend.ecs_cluster_arn
  backend_service_arn = module.backend.ecs_service_arn
  database_identifier = module.database.db_instance_id
  
  # アラート通知先（SNS）
  alert_email         = var.alert_email
  
  # 閾値設定
  cpu_threshold       = 80    # CPU使用率80%でアラート
  memory_threshold    = 80    # メモリ使用率80%でアラート
  db_cpu_threshold    = 75    # DB CPU 75%でアラート
}

