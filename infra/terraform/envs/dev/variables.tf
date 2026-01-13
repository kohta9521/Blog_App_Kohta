# ===========================================
# 🔧 Development Environment Variables
# ===========================================

# 📍 Basic Configuration
variable "environment" {
  description = "環境名（dev, staging, prod）"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWSリージョン（東京リージョン推奨）"
  type        = string
  default     = "ap-northeast-1"
}

# 🌐 Network Configuration
variable "vpc_cidr" {
  description = "VPCのCIDRブロック"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "使用するAvailability Zones"
  type        = list(string)
  default     = ["ap-northeast-1a", "ap-northeast-1c"]
}

# 🔐 Security Configuration
variable "allowed_ips" {
  description = "開発環境へのアクセスを許可するIPアドレスリスト"
  type        = list(string)
  default     = ["0.0.0.0/0"] # 本番では必ず制限すること！
}

# 🗄️ Database Configuration
variable "db_name" {
  description = "データベース名"
  type        = string
  default     = "blog_dev"
}

variable "db_username" {
  description = "データベースユーザー名"
  type        = string
  default     = "blog_user"
  sensitive   = true
}

variable "db_password" {
  description = "データベースパスワード（本番環境ではSecrets Managerを使用）"
  type        = string
  sensitive   = true
  # terraform.tfvarsで設定する
}

# 🐳 Backend Configuration
variable "backend_container_image" {
  description = "バックエンドのDockerイメージ（ECRのURI）"
  type        = string
  # 例: 123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/blog-backend:latest
}

variable "jwt_secret" {
  description = "JWT署名用のシークレットキー"
  type        = string
  sensitive   = true
}

variable "cors_origins" {
  description = "CORS許可オリジン"
  type        = string
  default     = "https://dev.yourdomain.com,http://localhost:3000"
}

# 🎨 Frontend Configuration
variable "github_repository_url" {
  description = "GitHubリポジトリのURL"
  type        = string
  # 例: https://github.com/yourusername/blog
}

variable "github_token" {
  description = "GitHub Personal Access Token（Amplifyデプロイ用）"
  type        = string
  sensitive   = true
}

# 🌍 DNS Configuration
variable "domain_name" {
  description = "Route53で管理するドメイン名"
  type        = string
  # 例: yourdomain.com
}

# 📊 Monitoring Configuration
variable "alert_email" {
  description = "アラート通知先メールアドレス"
  type        = string
  default     = "your-email@example.com"
}

