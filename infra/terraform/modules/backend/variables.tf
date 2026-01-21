# ===========================================
# 🔧 Backend Module Variables
# ===========================================

variable "environment" {
  description = "環境名（dev, prod）"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "public_subnet_ids" {
  description = "パブリックサブネットIDリスト（ALB用）"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "プライベートサブネットIDリスト（ECS用）"
  type        = list(string)
}

variable "backend_security_group" {
  description = "バックエンドECSのSecurity Group ID"
  type        = string
}

variable "alb_security_group" {
  description = "ALBのSecurity Group ID"
  type        = string
}

variable "execution_role_arn" {
  description = "ECS Task Execution Role ARN"
  type        = string
}

variable "task_role_arn" {
  description = "ECS Task Role ARN"
  type        = string
}

# Container Configuration
variable "container_image" {
  description = "Dockerイメージ（ECR URI）"
  type        = string
}

variable "container_port" {
  description = "コンテナのポート番号"
  type        = number
  default     = 8000
}

variable "cpu" {
  description = "ECSタスクのCPUユニット（256 = 0.25 vCPU）"
  type        = number
  default     = 256
}

variable "memory" {
  description = "ECSタスクのメモリ（MB）"
  type        = number
  default     = 512
}

variable "desired_count" {
  description = "ECSサービスの希望タスク数"
  type        = number
  default     = 1
}

# Environment Variables
variable "database_url" {
  description = "データベース接続URL"
  type        = string
  sensitive   = true
  default     = ""
}

variable "database_secrets_arn" {
  description = "データベース認証情報のSecrets Manager ARN"
  type        = string
  default     = null
}

variable "jwt_secret" {
  description = "JWT Secret（直接指定する場合）"
  type        = string
  sensitive   = true
  default     = ""
}

variable "jwt_secret_arn" {
  description = "JWT SecretのSecrets Manager ARN"
  type        = string
  default     = null
}

variable "cors_origins" {
  description = "CORS許可オリジン"
  type        = string
  default     = "*"
}

# Auto Scaling
variable "enable_auto_scaling" {
  description = "Auto Scalingを有効化"
  type        = bool
  default     = false
}

variable "min_capacity" {
  description = "Auto Scaling最小タスク数"
  type        = number
  default     = 1
}

variable "max_capacity" {
  description = "Auto Scaling最大タスク数"
  type        = number
  default     = 10
}

variable "cpu_threshold" {
  description = "CPU使用率のスケーリング閾値（%）"
  type        = number
  default     = 70
}

variable "memory_threshold" {
  description = "メモリ使用率のスケーリング閾値（%）"
  type        = number
  default     = 80
}

# SSL/TLS
variable "acm_certificate_arn" {
  description = "ACM証明書ARN（HTTPS用）"
  type        = string
  default     = null
}

# Monitoring
variable "enable_container_insights" {
  description = "ECS Container Insightsを有効化"
  type        = bool
  default     = false
}


