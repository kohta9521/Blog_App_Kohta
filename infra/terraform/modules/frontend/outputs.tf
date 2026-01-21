# ===========================================
# 📤 Frontend Module Outputs
# ===========================================

output "app_id" {
  description = "Amplify App ID"
  value       = aws_amplify_app.frontend.id
}

output "app_arn" {
  description = "Amplify App ARN"
  value       = aws_amplify_app.frontend.arn
}

output "default_domain" {
  description = "Amplifyのデフォルトドメイン"
  value       = aws_amplify_app.frontend.default_domain
}

output "branch_url" {
  description = "ブランチのURL"
  value       = "https://${var.branch_name}.${aws_amplify_app.frontend.default_domain}"
}

output "custom_domain_url" {
  description = "カスタムドメインのURL"
  value       = var.custom_domain != null ? "https://${var.subdomain_prefix != "" ? "${var.subdomain_prefix}." : ""}${var.custom_domain}" : null
}

output "webhook_url" {
  description = "Webhook URL（デプロイトリガー用）"
  value       = var.enable_webhook ? aws_amplify_webhook.main[0].url : null
  sensitive   = true
}

output "branch_name" {
  description = "デプロイされたブランチ名"
  value       = aws_amplify_branch.main.branch_name
}


