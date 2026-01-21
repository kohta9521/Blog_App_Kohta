# ===========================================
# 🔐 Security Module - Security Groups & IAM
# ===========================================
# セキュリティグループ、IAMロール、WAFなどのセキュリティ設定

# ===========================================
# 🚪 Security Groups
# ===========================================

# 1️⃣ ALB Security Group（インターネットからのHTTPS）
resource "aws_security_group" "alb" {
  name_prefix = "blog-${var.environment}-alb-"
  description = "Security group for Application Load Balancer"
  vpc_id      = var.vpc_id

  # HTTP（443へのリダイレクト用）
  ingress {
    description = "HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS
  ingress {
    description = "HTTPS from anywhere"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # 全ての送信トラフィックを許可
  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "blog-${var.environment}-alb-sg"
    Environment = var.environment
  }

  lifecycle {
    create_before_destroy = true
  }
}

# 2️⃣ Backend (ECS) Security Group
resource "aws_security_group" "backend" {
  name_prefix = "blog-${var.environment}-backend-"
  description = "Security group for Backend ECS tasks"
  vpc_id      = var.vpc_id

  # ALBからのトラフィックのみ許可
  ingress {
    description     = "Allow traffic from ALB"
    from_port       = 8000
    to_port         = 8000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  # 全ての送信トラフィックを許可
  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "blog-${var.environment}-backend-sg"
    Environment = var.environment
  }

  lifecycle {
    create_before_destroy = true
  }
}

# 3️⃣ Database Security Group
resource "aws_security_group" "database" {
  name_prefix = "blog-${var.environment}-database-"
  description = "Security group for RDS PostgreSQL"
  vpc_id      = var.vpc_id

  # バックエンド（ECS）からのアクセスのみ許可
  ingress {
    description     = "PostgreSQL from Backend"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.backend.id]
  }

  # 開発環境では特定IPからの直接アクセスも許可（Postico等）
  dynamic "ingress" {
    for_each = var.environment == "dev" ? [1] : []
    content {
      description = "PostgreSQL from allowed IPs (dev only)"
      from_port   = 5432
      to_port     = 5432
      protocol    = "tcp"
      cidr_blocks = var.allowed_ips
    }
  }

  # 送信トラフィックは不要だが、念のため許可
  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "blog-${var.environment}-database-sg"
    Environment = var.environment
  }

  lifecycle {
    create_before_destroy = true
  }
}

# ===========================================
# 🔑 IAM Roles for ECS
# ===========================================

# ECS Task Execution Role（ECRからイメージをPull、CloudWatch Logsに書き込み）
resource "aws_iam_role" "ecs_task_execution" {
  name = "blog-${var.environment}-ecs-task-execution"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "blog-${var.environment}-ecs-task-execution"
    Environment = var.environment
  }
}

# ECS Task Execution Roleに必要なポリシーをアタッチ
resource "aws_iam_role_policy_attachment" "ecs_task_execution" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Secrets Managerへのアクセス権限（環境変数でシークレットを使う場合）
resource "aws_iam_role_policy" "ecs_secrets_access" {
  name = "secrets-access"
  role = aws_iam_role.ecs_task_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "kms:Decrypt"
        ]
        Resource = [
          "arn:aws:secretsmanager:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:secret:blog/${var.environment}/*",
          aws_kms_key.secrets.arn
        ]
      }
    ]
  })
}

# ECS Task Role（アプリケーション実行時の権限）
resource "aws_iam_role" "ecs_task" {
  name = "blog-${var.environment}-ecs-task"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "blog-${var.environment}-ecs-task"
    Environment = var.environment
  }
}

# S3アクセス権限（画像アップロード用）
resource "aws_iam_role_policy" "ecs_task_s3_access" {
  name = "s3-access"
  role = aws_iam_role.ecs_task.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject"
        ]
        Resource = [
          "arn:aws:s3:::blog-${var.environment}-uploads/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::blog-${var.environment}-uploads"
        ]
      }
    ]
  })
}

# ===========================================
# 🔒 KMS Keys（暗号化用）
# ===========================================

# RDS暗号化用のKMSキー
resource "aws_kms_key" "rds" {
  description             = "KMS key for RDS encryption (${var.environment})"
  deletion_window_in_days = var.environment == "prod" ? 30 : 7
  enable_key_rotation     = true

  tags = {
    Name        = "blog-${var.environment}-rds-kms"
    Environment = var.environment
  }
}

resource "aws_kms_alias" "rds" {
  name          = "alias/blog-${var.environment}-rds"
  target_key_id = aws_kms_key.rds.key_id
}

# Secrets Manager暗号化用のKMSキー
resource "aws_kms_key" "secrets" {
  description             = "KMS key for Secrets Manager (${var.environment})"
  deletion_window_in_days = var.environment == "prod" ? 30 : 7
  enable_key_rotation     = true

  tags = {
    Name        = "blog-${var.environment}-secrets-kms"
    Environment = var.environment
  }
}

resource "aws_kms_alias" "secrets" {
  name          = "alias/blog-${var.environment}-secrets"
  target_key_id = aws_kms_key.secrets.key_id
}

# ===========================================
# 🛡️ WAF (Web Application Firewall) - 本番環境のみ
# ===========================================
resource "aws_wafv2_web_acl" "main" {
  count = var.enable_waf ? 1 : 0

  name  = "blog-${var.environment}-waf"
  scope = "REGIONAL"

  default_action {
    allow {}
  }

  # ルール1: AWSマネージドルール - 一般的な脅威対策
  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 1

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        vendor_name = "AWS"
        name        = "AWSManagedRulesCommonRuleSet"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AWSManagedRulesCommonRuleSetMetric"
      sampled_requests_enabled   = true
    }
  }

  # ルール2: SQLインジェクション対策
  rule {
    name     = "AWSManagedRulesSQLiRuleSet"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        vendor_name = "AWS"
        name        = "AWSManagedRulesSQLiRuleSet"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AWSManagedRulesSQLiRuleSetMetric"
      sampled_requests_enabled   = true
    }
  }

  # ルール3: レート制限（DDoS対策）
  rule {
    name     = "RateLimitRule"
    priority = 3

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = 2000 # 5分間で2000リクエスト
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RateLimitRuleMetric"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "blog-${var.environment}-waf"
    sampled_requests_enabled   = true
  }

  tags = {
    Name        = "blog-${var.environment}-waf"
    Environment = var.environment
  }
}

# ===========================================
# 📊 Data Sources
# ===========================================
data "aws_region" "current" {}
data "aws_caller_identity" "current" {}


