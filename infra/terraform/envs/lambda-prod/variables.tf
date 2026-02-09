# ===========================================
# 📝 Variables for Production Environment
# ===========================================

variable "aws_region" {
  description = "AWSリージョン"
  type        = string
  default     = "ap-northeast-1" # 東京リージョン
}

variable "environment" {
  description = "環境名"
  type        = string
  default     = "prod"
}

variable "lambda_image_uri" {
  description = "Lambda関数のDockerイメージURI（ECRから取得）"
  type        = string
  # 例: 123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/blog-prod-lambda-api:v1.0.0
}

variable "allowed_origin" {
  description = "CORS許可するオリジン（本番環境のVercel URL）"
  type        = string
  # 本番環境のVercel URL: https://www.kohta-tech-blog.com
}

variable "lambda_timeout" {
  description = "Lambda関数のタイムアウト（秒）"
  type        = number
  default     = 30
}

variable "lambda_memory_size" {
  description = "Lambda関数のメモリサイズ（MB）"
  type        = number
  default     = 256 # 本番環境は少し余裕を持たせる
}
