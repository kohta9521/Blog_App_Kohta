# ===========================================
# 📤 Backup Module Outputs
# ===========================================

output "backup_vault_arn" {
  description = "Backup Vault ARN"
  value       = aws_backup_vault.main.arn
}

output "backup_plan_id" {
  description = "Backup Plan ID"
  value       = aws_backup_plan.main.id
}

