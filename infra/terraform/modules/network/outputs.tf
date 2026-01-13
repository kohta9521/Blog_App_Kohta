# ===========================================
# 📤 Network Module Outputs
# ===========================================

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "vpc_cidr" {
  description = "VPC CIDR Block"
  value       = aws_vpc.main.cidr_block
}

output "public_subnet_ids" {
  description = "パブリックサブネットIDリスト"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "プライベートサブネットIDリスト"
  value       = aws_subnet.private[*].id
}

output "database_subnet_ids" {
  description = "データベースサブネットIDリスト"
  value       = aws_subnet.database[*].id
}

output "database_subnet_group_name" {
  description = "データベースサブネットグループ名"
  value       = aws_db_subnet_group.main.name
}

output "nat_gateway_ids" {
  description = "NAT Gateway IDリスト"
  value       = aws_nat_gateway.main[*].id
}

output "internet_gateway_id" {
  description = "Internet Gateway ID"
  value       = aws_internet_gateway.main.id
}
