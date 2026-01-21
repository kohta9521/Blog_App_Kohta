# ===========================================
# 🔧 Security Module Variables
# ===========================================

variable "environment" {
  description = "環境名（dev, prod）"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "allowed_ips" {
  description = "開発環境でデータベースへの直接アクセスを許可するIPアドレス"
  type        = list(string)
  default     = []
}

variable "enable_waf" {
  description = "WAFを有効化するか（本番環境推奨）"
  type        = bool
  default     = false
}


