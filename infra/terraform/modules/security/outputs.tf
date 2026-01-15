# ===========================================
# 📤 Security Module Outputs
# ===========================================

# Security Group IDs
output "alb_security_group_id" {
  description = "ALB Security Group ID"
  value       = aws_security_group.alb.id
}

output "backend_security_group_id" {
  description = "Backend ECS Security Group ID"
  value       = aws_security_group.backend.id
}

output "database_security_group_id" {
  description = "Database Security Group ID"
  value       = aws_security_group.database.id
}

# IAM Role ARNs
output "ecs_task_execution_role_arn" {
  description = "ECS Task Execution Role ARN"
  value       = aws_iam_role.ecs_task_execution.arn
}

output "ecs_task_role_arn" {
  description = "ECS Task Role ARN"
  value       = aws_iam_role.ecs_task.arn
}

# KMS Key ARNs
output "rds_kms_key_arn" {
  description = "RDS KMS Key ARN"
  value       = aws_kms_key.rds.arn
}

output "secrets_kms_key_arn" {
  description = "Secrets Manager KMS Key ARN"
  value       = aws_kms_key.secrets.arn
}

# WAF
output "waf_web_acl_arn" {
  description = "WAF Web ACL ARN"
  value       = var.enable_waf ? aws_wafv2_web_acl.main[0].arn : null
}


