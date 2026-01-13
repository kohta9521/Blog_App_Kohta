# ===========================================
# 🔧 DNS Module Variables
# ===========================================

variable "environment" {
  description = "環境名（dev, prod）"
  type        = string
}

variable "domain_name" {
  description = "ルートドメイン名（例: yourdomain.com）"
  type        = string
}

variable "subdomain" {
  description = "サブドメイン（dev環境用、例: dev）。空文字列の場合はルートドメイン"
  type        = string
  default     = ""
}

# Certificate
variable "create_certificate" {
  description = "ACM証明書を作成するか"
  type        = bool
  default     = true
}

# Frontend
variable "frontend_domain" {
  description = "フロントエンドのドメイン（Amplifyのデフォルトドメインなど）"
  type        = string
  default     = null
}

variable "frontend_hosted_zone_id" {
  description = "フロントエンドのHosted Zone ID（ALIASレコード用）"
  type        = string
  default     = "Z2FDTNDATAQYW2" # CloudFront/Amplifyの固定値
}

# Backend
variable "backend_alb_dns" {
  description = "バックエンドALBのDNS名"
  type        = string
}

variable "backend_alb_zone_id" {
  description = "バックエンドALBのHosted Zone ID"
  type        = string
}

# Email (SES)
variable "enable_email_records" {
  description = "メール関連のDNSレコードを作成するか（SES用）"
  type        = bool
  default     = false
}

# DNSSEC
variable "enable_dnssec" {
  description = "DNSSECを有効化するか（セキュリティ強化）"
  type        = bool
  default     = false
}

