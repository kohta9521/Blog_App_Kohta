# ===========================================
# 📤 Database Module Outputs
# ===========================================

output "db_instance_id" {
  description = "RDS インスタンス ID"
  value       = aws_db_instance.main.id
}

output "db_instance_arn" {
  description = "RDS インスタンス ARN"
  value       = aws_db_instance.main.arn
}

output "database_endpoint" {
  description = "データベースエンドポイント（ホスト:ポート）"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

output "database_address" {
  description = "データベースホスト名"
  value       = aws_db_instance.main.address
  sensitive   = true
}

output "database_port" {
  description = "データベースポート番号"
  value       = aws_db_instance.main.port
}

output "database_name" {
  description = "データベース名"
  value       = aws_db_instance.main.db_name
}

output "database_url" {
  description = "データベース接続URL（Rust/sqlx用）"
  value       = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.main.address}:${aws_db_instance.main.port}/${var.db_name}"
  sensitive   = true
}

output "secrets_manager_secret_arn" {
  description = "Secrets Manager シークレット ARN"
  value       = aws_secretsmanager_secret.db_credentials.arn
}

output "secrets_manager_secret_name" {
  description = "Secrets Manager シークレット名"
  value       = aws_secretsmanager_secret.db_credentials.name
}

