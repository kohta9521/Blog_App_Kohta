# ===========================================
# 📝 Variables for Development Environment
# ===========================================

variable "aws_region" {
  description = "AWSリージョン"
  type        = string
  default     = "ap-northeast-1" # 東京リージョン
}

variable "environment" {
  description = "環境名"
  type        = string
  default     = "dev"
}

variable "lambda_image_uri" {
  description = "Lambda関数のDockerイメージURI（ECRから取得）"
  type        = string
  # 例: 123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/blog-dev-lambda-api:latest
}

variable "allowed_origin" {
  description = "CORS許可するオリジン（開発環境のVercel URL）"
  type        = string
  default     = "http://localhost:3000" # ローカル開発用
  # 実際のVercel URLに変更: https://your-app-dev.vercel.app
}

variable "lambda_timeout" {
  description = "Lambda関数のタイムアウト（秒）"
  type        = number
  default     = 30
}

variable "lambda_memory_size" {
  description = "Lambda関数のメモリサイズ（MB）"
  type        = number
  default     = 128 # 最小サイズでコスト削減
}
