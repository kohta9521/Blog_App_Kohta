# ===========================================
# 🚀 Production Environment - Blog Infrastructure
# ===========================================
# 本番環境の設定（dev環境との違いに注目）

terraform {
  required_version = ">= 1.7.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # 本番環境では必ずStateをS3に保存
  backend "s3" {
    bucket         = "blog-terraform-state-prod"
    key            = "prod/terraform.tfstate"
    region         = "ap-northeast-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock-prod"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = "prod"
      Project     = "blog"
      ManagedBy   = "terraform"
      Owner       = "kohta"
    }
  }
}

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Environment = "prod"
      Project     = "blog"
      ManagedBy   = "terraform"
    }
  }
}

# 🌐 Network Module
module "network" {
  source = "../../modules/network"

  environment         = var.environment
  vpc_cidr            = var.vpc_cidr
  availability_zones  = var.availability_zones
  enable_nat_gateway  = true  # 本番環境ではNAT Gateway有効化
  single_nat_gateway  = false # 高可用性のため複数配置
}

# 🔐 Security Module
module "security" {
  source = "../../modules/security"

  environment     = var.environment
  vpc_id          = module.network.vpc_id
  allowed_ips     = var.allowed_ips
  enable_waf      = true # 本番環境ではWAF有効化
}

# 🗄️ Database Module
module "database" {
  source = "../../modules/database"

  environment                = var.environment
  vpc_id                     = module.network.vpc_id
  database_subnet_ids        = module.network.database_subnet_ids
  database_subnet_group_name = module.network.database_subnet_group_name
  database_security_group    = module.security.database_security_group_id
  
  db_name              = var.db_name
  db_username          = var.db_username
  db_password          = var.db_password
  db_instance_class    = "db.t3.small"   # 本番環境では少し大きく
  allocated_storage    = 50              # 50GB
  max_allocated_storage = 100            # 自動スケーリング有効
  backup_retention     = 30              # 30日バックアップ保持
  multi_az             = true            # マルチAZ構成
  deletion_protection  = true            # 削除保護有効化
  
  # 暗号化
  storage_encrypted    = true
  kms_key_id          = module.security.rds_kms_key_arn
  
  # モニタリング
  enable_enhanced_monitoring = true
  enable_performance_insights = true
}

# 🐳 Backend Module
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
  
  container_image          = var.backend_container_image
  container_port           = 8000
  cpu                      = 512    # 0.5 vCPU
  memory                   = 1024   # 1 GB
  desired_count            = 2      # 本番環境では最低2台
  
  database_url             = module.database.database_url
  database_secrets_arn     = module.database.secrets_manager_secret_arn
  jwt_secret               = var.jwt_secret
  cors_origins             = var.cors_origins
  
  # SSL/TLS
  acm_certificate_arn      = module.dns.certificate_arn
  
  # Auto Scaling
  enable_auto_scaling      = true
  min_capacity             = 2
  max_capacity             = 10
  cpu_threshold            = 70
  memory_threshold         = 80
  
  # モニタリング
  enable_container_insights = true
}

# 🎨 Frontend Module
module "frontend" {
  source = "../../modules/frontend"

  environment         = var.environment
  app_name            = "blog-frontend"
  repository_url      = var.github_repository_url
  branch_name         = "main" # 本番環境はmainブランチ
  github_token        = var.github_token
  
  backend_api_url     = "https://api.${var.domain_name}"
  
  build_spec = <<-EOT
    version: 1
    frontend:
      phases:
        preBuild:
          commands:
            - cd apps/frontend
            - npm ci --production
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

# 🌍 DNS Module
module "dns" {
  source = "../../modules/dns"

  environment     = var.environment
  domain_name     = var.domain_name
  subdomain       = "" # 本番環境はサブドメインなし（yourdomain.com）
  
  frontend_domain = module.frontend.default_domain
  backend_alb_dns = module.backend.alb_dns_name
  backend_alb_zone_id = module.backend.alb_zone_id
  
  create_certificate = true
  
  providers = {
    aws = aws.us_east_1
  }
}

# 📊 Monitoring Module
module "monitoring" {
  source = "../../modules/monitoring"

  environment            = var.environment
  backend_cluster_arn    = module.backend.ecs_cluster_arn
  backend_cluster_name   = module.backend.ecs_cluster_name
  backend_service_arn    = module.backend.ecs_service_arn
  backend_service_name   = module.backend.ecs_service_name
  alb_arn                = module.backend.alb_arn
  database_identifier    = module.database.db_instance_id
  
  alert_email            = var.alert_email
  log_retention_days     = 30
  
  cpu_threshold          = 70
  memory_threshold       = 75
  db_cpu_threshold       = 70
  
  # 本番環境では詳細なモニタリング
  enable_detailed_monitoring = true
  enable_xray_tracing       = true
}

# 🔄 Backup Module（本番環境のみ）
module "backup" {
  source = "../../modules/backup"

  environment         = var.environment
  database_arn        = module.database.db_instance_arn
  
  # バックアップスケジュール
  backup_schedule     = "cron(0 2 * * ? *)" # 毎日午前2時（JST 11時）
  backup_retention    = 30 # 30日間保持
}

