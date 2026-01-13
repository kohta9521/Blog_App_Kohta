# ===========================================
# 🔄 Backup Module - AWS Backup
# ===========================================
# 自動バックアップとリストア設定（本番環境推奨）

# ===========================================
# 🗄️ Backup Vault
# ===========================================
resource "aws_backup_vault" "main" {
  name = "blog-${var.environment}-backup-vault"

  tags = {
    Name        = "blog-${var.environment}-backup-vault"
    Environment = var.environment
  }
}

# ===========================================
# 📋 Backup Plan
# ===========================================
resource "aws_backup_plan" "main" {
  name = "blog-${var.environment}-backup-plan"

  rule {
    rule_name         = "daily_backup"
    target_vault_name = aws_backup_vault.main.name
    schedule          = var.backup_schedule

    lifecycle {
      delete_after = var.backup_retention
    }

    # バックアップ完了時間のウィンドウ
    start_window      = 60  # 1時間以内に開始
    completion_window = 120 # 2時間以内に完了
  }

  tags = {
    Name        = "blog-${var.environment}-backup-plan"
    Environment = var.environment
  }
}

# ===========================================
# 🎯 Backup Selection（バックアップ対象）
# ===========================================
resource "aws_backup_selection" "database" {
  name         = "blog-${var.environment}-database-selection"
  plan_id      = aws_backup_plan.main.id
  iam_role_arn = aws_iam_role.backup.arn

  resources = [
    var.database_arn
  ]
}

# ===========================================
# 🔑 IAM Role for AWS Backup
# ===========================================
resource "aws_iam_role" "backup" {
  name = "blog-${var.environment}-backup-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "backup.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "blog-${var.environment}-backup-role"
    Environment = var.environment
  }
}

resource "aws_iam_role_policy_attachment" "backup" {
  role       = aws_iam_role.backup.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForBackup"
}

resource "aws_iam_role_policy_attachment" "restore" {
  role       = aws_iam_role.backup.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForRestores"
}

