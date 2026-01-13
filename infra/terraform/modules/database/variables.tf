# ===========================================
# 🔧 Database Module Variables
# ===========================================

variable "environment" {
  description = "環境名（dev, prod）"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "database_subnet_ids" {
  description = "データベースサブネットIDリスト"
  type        = list(string)
}

variable "database_subnet_group_name" {
  description = "データベースサブネットグループ名"
  type        = string
  default     = null
}

variable "database_security_group" {
  description = "データベースのSecurity Group ID"
  type        = string
}

variable "availability_zones" {
  description = "使用するAvailability Zones"
  type        = list(string)
  default     = ["ap-northeast-1a", "ap-northeast-1c"]
}

# Database Configuration
variable "db_name" {
  description = "データベース名"
  type        = string
}

variable "db_username" {
  description = "データベースユーザー名"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "データベースパスワード"
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "RDSインスタンスクラス（無料枠: db.t3.micro）"
  type        = string
  default     = "db.t3.micro"
}

variable "allocated_storage" {
  description = "初期ストレージ容量（GB）"
  type        = number
  default     = 20
}

variable "max_allocated_storage" {
  description = "最大ストレージ容量（GB、自動スケーリング）"
  type        = number
  default     = 100
}

variable "storage_encrypted" {
  description = "ストレージ暗号化を有効化"
  type        = bool
  default     = true
}

variable "kms_key_id" {
  description = "暗号化に使用するKMS Key ID"
  type        = string
  default     = null
}

# High Availability
variable "multi_az" {
  description = "マルチAZ構成を有効化（本番環境推奨）"
  type        = bool
  default     = false
}

# Backup
variable "backup_retention" {
  description = "バックアップ保持日数"
  type        = number
  default     = 7
}

variable "deletion_protection" {
  description = "削除保護を有効化（本番環境推奨）"
  type        = bool
  default     = false
}

# Monitoring
variable "enable_enhanced_monitoring" {
  description = "拡張モニタリングを有効化"
  type        = bool
  default     = false
}

variable "enable_performance_insights" {
  description = "Performance Insightsを有効化"
  type        = bool
  default     = false
}

variable "cpu_alarm_threshold" {
  description = "CPU使用率アラートの閾値（%）"
  type        = number
  default     = 80
}

variable "alarm_sns_topic_arn" {
  description = "アラート通知先SNS Topic ARN"
  type        = string
  default     = null
}

