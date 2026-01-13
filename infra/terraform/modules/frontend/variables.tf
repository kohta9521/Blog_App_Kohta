# ===========================================
# 🔧 Frontend Module Variables
# ===========================================

variable "environment" {
  description = "環境名（dev, prod）"
  type        = string
}

variable "app_name" {
  description = "Amplify アプリ名"
  type        = string
}

variable "repository_url" {
  description = "GitHubリポジトリURL"
  type        = string
}

variable "branch_name" {
  description = "デプロイするブランチ名"
  type        = string
}

variable "github_token" {
  description = "GitHub Personal Access Token"
  type        = string
  sensitive   = true
}

variable "backend_api_url" {
  description = "バックエンドAPIのURL"
  type        = string
}

variable "build_spec" {
  description = "Amplify ビルド仕様（YAML形式）"
  type        = string
}

variable "additional_env_vars" {
  description = "追加の環境変数"
  type        = map(string)
  default     = {}
}

variable "branch_env_vars" {
  description = "ブランチ固有の環境変数"
  type        = map(string)
  default     = {}
}

# Custom Domain
variable "custom_domain" {
  description = "カスタムドメイン名（Route53で管理）"
  type        = string
  default     = null
}

variable "subdomain_prefix" {
  description = "サブドメインプレフィックス（例: dev, www）"
  type        = string
  default     = ""
}

variable "enable_www_redirect" {
  description = "www からのリダイレクトを有効化"
  type        = bool
  default     = false
}

# Basic Authentication
variable "enable_basic_auth" {
  description = "Basic認証を有効化（dev環境推奨）"
  type        = bool
  default     = false
}

variable "basic_auth_username" {
  description = "Basic認証ユーザー名"
  type        = string
  default     = "admin"
  sensitive   = true
}

variable "basic_auth_password" {
  description = "Basic認証パスワード"
  type        = string
  default     = ""
  sensitive   = true
}

# Webhook
variable "enable_webhook" {
  description = "Webhookを有効化（CI/CDトリガー用）"
  type        = bool
  default     = true
}

