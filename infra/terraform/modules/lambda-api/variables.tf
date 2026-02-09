# ===========================================
# 📝 Variables for Lambda API Module
# ===========================================

variable "environment" {
  description = "環境名（dev/prod）"
  type        = string
  validation {
    condition     = contains(["dev", "prod"], var.environment)
    error_message = "environmentは'dev'または'prod'である必要があります"
  }
}

variable "lambda_image_uri" {
  description = "Lambda関数のDockerイメージURI（ECR）"
  type        = string
}

variable "allowed_origin" {
  description = "CORS許可するオリジン（VercelのフロントエンドURL）"
  type        = string
  default     = "*"
}

variable "timeout" {
  description = "Lambda関数のタイムアウト（秒）"
  type        = number
  default     = 30
  validation {
    condition     = var.timeout >= 1 && var.timeout <= 900
    error_message = "タイムアウトは1〜900秒の範囲である必要があります"
  }
}

variable "memory_size" {
  description = "Lambda関数のメモリサイズ（MB）"
  type        = number
  default     = 128
  validation {
    condition     = var.memory_size >= 128 && var.memory_size <= 10240
    error_message = "メモリサイズは128〜10240MBの範囲である必要があります"
  }
}

variable "enable_function_url" {
  description = "Lambda Function URLを有効化するか（API Gateway不要の簡易版）"
  type        = bool
  default     = false
}
