# ===========================================
# 🔧 Monitoring Module Variables
# ===========================================

variable "environment" {
  description = "環境名（dev, prod）"
  type        = string
}

variable "alert_email" {
  description = "アラート通知先メールアドレス"
  type        = string
  default     = null
}

variable "log_retention_days" {
  description = "CloudWatch Logsの保持日数"
  type        = number
  default     = 7
}

# Backend ECS
variable "backend_cluster_arn" {
  description = "ECSクラスターARN"
  type        = string
  default     = null
}

variable "backend_cluster_name" {
  description = "ECSクラスター名"
  type        = string
  default     = null
}

variable "backend_service_arn" {
  description = "ECSサービスARN"
  type        = string
  default     = null
}

variable "backend_service_name" {
  description = "ECSサービス名"
  type        = string
  default     = null
}

# ALB
variable "alb_arn" {
  description = "ALB ARN"
  type        = string
  default     = null
}

# Database
variable "database_identifier" {
  description = "RDSインスタンス識別子"
  type        = string
}

# Threshold Configuration
variable "cpu_threshold" {
  description = "CPU使用率アラート閾値（%）"
  type        = number
  default     = 80
}

variable "memory_threshold" {
  description = "メモリ使用率アラート閾値（%）"
  type        = number
  default     = 80
}

variable "db_cpu_threshold" {
  description = "DB CPU使用率アラート閾値（%）"
  type        = number
  default     = 75
}

# Advanced Monitoring
variable "enable_detailed_monitoring" {
  description = "詳細モニタリングを有効化"
  type        = bool
  default     = false
}

variable "enable_xray_tracing" {
  description = "AWS X-Rayトレーシングを有効化"
  type        = bool
  default     = false
}


