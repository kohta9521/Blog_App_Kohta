# ===========================================
# 🔧 Network Module Variables
# ===========================================

variable "environment" {
  description = "環境名（dev, prod）"
  type        = string
}

variable "vpc_cidr" {
  description = "VPCのCIDRブロック"
  type        = string
}

variable "availability_zones" {
  description = "使用するAvailability Zones"
  type        = list(string)
}

variable "enable_nat_gateway" {
  description = "NAT Gatewayを有効化するか（dev環境ではコスト削減のため無効化推奨）"
  type        = bool
  default     = false
}

variable "single_nat_gateway" {
  description = "NAT Gatewayを1つだけ作成するか（複数AZで共有してコスト削減）"
  type        = bool
  default     = true
}
