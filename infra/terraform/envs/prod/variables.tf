# ===========================================
# 🔧 Production Environment Variables
# ===========================================

variable "environment" {
  description = "環境名"
  type        = string
  default     = "prod"
}

variable "aws_region" {
  description = "AWSリージョン"
  type        = string
  default     = "ap-northeast-1"
}

# 🌐 Network Configuration
variable "vpc_cidr" {
  description = "VPCのCIDRブロック（dev環境と重複しないこと）"
  type        = string
  default     = "10.1.0.0/16" # dev: 10.0.0.0/16 と異なる
}

variable "availability_zones" {
  description = "使用するAvailability Zones（本番環境は複数AZ必須）"
  type        = list(string)
  default     = ["ap-northeast-1a", "ap-northeast-1c", "ap-northeast-1d"]
}

# 🔐 Security Configuration
variable "allowed_ips" {
  description = "管理画面へのアクセスを許可するIPアドレス（本番環境では必ず制限）"
  type        = list(string)
  # terraform.tfvarsで設定（GitHubにコミットしない）
}

# 🗄️ Database Configuration
variable "db_name" {
  description = "データベース名"
  type        = string
  default     = "blog_prod"
}

variable "db_username" {
  description = "データベースユーザー名"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "データベースパスワード（AWS Secrets Managerから取得推奨）"
  type        = string
  sensitive   = true
}

# 🐳 Backend Configuration
variable "backend_container_image" {
  description = "バックエンドのDockerイメージ（ECRのURI）"
  type        = string
}

variable "jwt_secret" {
  description = "JWT署名用のシークレットキー（最低64文字推奨）"
  type        = string
  sensitive   = true
}

variable "cors_origins" {
  description = "CORS許可オリジン（本番ドメインのみ）"
  type        = string
}

# 🎨 Frontend Configuration
variable "github_repository_url" {
  description = "GitHubリポジトリのURL"
  type        = string
}

variable "github_token" {
  description = "GitHub Personal Access Token"
  type        = string
  sensitive   = true
}

# 🌍 DNS Configuration
variable "domain_name" {
  description = "本番ドメイン名"
  type        = string
}

# 📊 Monitoring Configuration
variable "alert_email" {
  description = "アラート通知先メールアドレス"
  type        = string
}


