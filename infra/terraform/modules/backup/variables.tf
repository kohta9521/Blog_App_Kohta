# ===========================================
# 🔧 Backup Module Variables
# ===========================================

variable "environment" {
  description = "環境名（dev, prod）"
  type        = string
}

variable "database_arn" {
  description = "バックアップ対象のRDS ARN"
  type        = string
}

variable "backup_schedule" {
  description = "バックアップスケジュール（cron形式）"
  type        = string
  default     = "cron(0 2 * * ? *)" # 毎日午前2時（UTC）= JST 11時
}

variable "backup_retention" {
  description = "バックアップ保持日数"
  type        = number
  default     = 30
}

