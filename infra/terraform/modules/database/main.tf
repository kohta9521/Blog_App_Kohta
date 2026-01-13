# ===========================================
# 🗄️ Database Module - RDS PostgreSQL
# ===========================================
# ブログ用のPostgreSQLデータベース

# ===========================================
# 🗄️ RDS PostgreSQL Instance
# ===========================================
resource "aws_db_instance" "main" {
  identifier = "blog-${var.environment}-postgres"

  # Engine Configuration
  engine               = "postgres"
  engine_version       = "15.6" # 最新の安定版
  instance_class       = var.db_instance_class
  allocated_storage    = var.allocated_storage
  max_allocated_storage = var.max_allocated_storage # ストレージ自動スケーリング
  storage_type         = "gp3" # 最新世代のSSD（gp2より安くて速い）
  storage_encrypted    = var.storage_encrypted
  kms_key_id          = var.storage_encrypted ? var.kms_key_id : null

  # Database Configuration
  db_name  = var.db_name
  username = var.db_username
  password = var.db_password # 本番環境では Secrets Manager を使用推奨
  port     = 5432

  # Network Configuration
  db_subnet_group_name   = var.database_subnet_group_name
  vpc_security_group_ids = [var.database_security_group]
  publicly_accessible    = false # 必ずprivateに配置

  # High Availability
  multi_az               = var.multi_az
  availability_zone      = var.multi_az ? null : var.availability_zones[0]

  # Backup Configuration
  backup_retention_period   = var.backup_retention
  backup_window            = "02:00-03:00" # JST 11:00-12:00（アクセスが少ない時間）
  maintenance_window       = "Mon:03:00-Mon:04:00" # JST 月曜12:00-13:00
  copy_tags_to_snapshot    = true
  skip_final_snapshot      = var.environment == "dev" ? true : false
  final_snapshot_identifier = var.environment == "dev" ? null : "blog-${var.environment}-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"
  delete_automated_backups = var.environment == "dev" ? true : false

  # Monitoring
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  monitoring_interval             = var.enable_enhanced_monitoring ? 60 : 0
  monitoring_role_arn            = var.enable_enhanced_monitoring ? aws_iam_role.rds_monitoring[0].arn : null
  performance_insights_enabled   = var.enable_performance_insights
  performance_insights_retention_period = var.enable_performance_insights ? 7 : null

  # Security
  deletion_protection      = var.deletion_protection
  iam_database_authentication_enabled = true # IAM認証を有効化

  # Parameter Group
  parameter_group_name = aws_db_parameter_group.main.name

  # Auto Minor Version Upgrade
  auto_minor_version_upgrade = true

  tags = {
    Name        = "blog-${var.environment}-postgres"
    Environment = var.environment
  }

  lifecycle {
    # パスワード変更時に再作成を防ぐ
    ignore_changes = [password]
  }
}

# ===========================================
# 🔧 Parameter Group（PostgreSQL設定のカスタマイズ）
# ===========================================
resource "aws_db_parameter_group" "main" {
  name   = "blog-${var.environment}-postgres15"
  family = "postgres15"

  # 日本語対応
  parameter {
    name  = "client_encoding"
    value = "UTF8"
  }

  parameter {
    name  = "timezone"
    value = "Asia/Tokyo"
  }

  # ログ設定（開発時のデバッグ用）
  parameter {
    name  = "log_statement"
    value = var.environment == "dev" ? "all" : "ddl" # dev環境では全てのSQLをログ
  }

  parameter {
    name  = "log_min_duration_statement"
    value = "1000" # 1秒以上かかるクエリをログ
  }

  # パフォーマンスチューニング
  parameter {
    name  = "shared_preload_libraries"
    value = "pg_stat_statements" # クエリ統計を有効化
  }

  parameter {
    name         = "pg_stat_statements.track"
    value        = "all"
    apply_method = "pending-reboot"
  }

  tags = {
    Name        = "blog-${var.environment}-postgres15"
    Environment = var.environment
  }
}

# ===========================================
# 📊 Enhanced Monitoring用のIAMロール
# ===========================================
resource "aws_iam_role" "rds_monitoring" {
  count = var.enable_enhanced_monitoring ? 1 : 0

  name = "blog-${var.environment}-rds-monitoring"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "monitoring.rds.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "blog-${var.environment}-rds-monitoring"
    Environment = var.environment
  }
}

resource "aws_iam_role_policy_attachment" "rds_monitoring" {
  count = var.enable_enhanced_monitoring ? 1 : 0

  role       = aws_iam_role.rds_monitoring[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

# ===========================================
# 🔐 Secrets Manager（本番環境推奨）
# ===========================================
resource "aws_secretsmanager_secret" "db_credentials" {
  name = "blog/${var.environment}/database"
  description = "Database credentials for ${var.environment} environment"
  kms_key_id = var.kms_key_id

  tags = {
    Name        = "blog-${var.environment}-db-credentials"
    Environment = var.environment
  }
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id

  secret_string = jsonencode({
    username = var.db_username
    password = var.db_password
    host     = aws_db_instance.main.address
    port     = aws_db_instance.main.port
    dbname   = var.db_name
    url      = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.main.address}:${aws_db_instance.main.port}/${var.db_name}"
  })

  lifecycle {
    ignore_changes = [secret_string] # パスワードローテーション時の再作成を防ぐ
  }
}

# ===========================================
# 📊 CloudWatch Alarms（データベース監視）
# ===========================================

# CPU使用率アラート
resource "aws_cloudwatch_metric_alarm" "database_cpu" {
  alarm_name          = "blog-${var.environment}-db-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = var.cpu_alarm_threshold
  alarm_description   = "This metric monitors RDS CPU utilization"
  alarm_actions       = var.alarm_sns_topic_arn != null ? [var.alarm_sns_topic_arn] : []

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.main.id
  }

  tags = {
    Name        = "blog-${var.environment}-db-cpu-alarm"
    Environment = var.environment
  }
}

# ストレージ容量アラート
resource "aws_cloudwatch_metric_alarm" "database_storage" {
  alarm_name          = "blog-${var.environment}-db-storage-low"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "FreeStorageSpace"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = 5368709120 # 5GB
  alarm_description   = "This metric monitors RDS free storage space"
  alarm_actions       = var.alarm_sns_topic_arn != null ? [var.alarm_sns_topic_arn] : []

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.main.id
  }

  tags = {
    Name        = "blog-${var.environment}-db-storage-alarm"
    Environment = var.environment
  }
}

# 接続数アラート
resource "aws_cloudwatch_metric_alarm" "database_connections" {
  alarm_name          = "blog-${var.environment}-db-connections-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "DatabaseConnections"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = 80 # 接続数が80を超えたらアラート
  alarm_description   = "This metric monitors RDS database connections"
  alarm_actions       = var.alarm_sns_topic_arn != null ? [var.alarm_sns_topic_arn] : []

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.main.id
  }

  tags = {
    Name        = "blog-${var.environment}-db-connections-alarm"
    Environment = var.environment
  }
}

