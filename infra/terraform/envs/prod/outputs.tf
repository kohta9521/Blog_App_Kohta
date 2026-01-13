# ===========================================
# 📤 Production Environment Outputs
# ===========================================

output "vpc_id" {
  description = "VPC ID"
  value       = module.network.vpc_id
}

output "database_endpoint" {
  description = "RDSエンドポイント"
  value       = module.database.database_endpoint
  sensitive   = true
}

output "backend_alb_dns" {
  description = "バックエンドALBのDNS名"
  value       = module.backend.alb_dns_name
}

output "backend_api_url" {
  description = "バックエンドAPIのURL"
  value       = "https://api.${var.domain_name}"
}

output "frontend_url" {
  description = "フロントエンドのURL"
  value       = "https://${var.domain_name}"
}

output "nameservers" {
  description = "Route53のネームサーバー"
  value       = module.dns.nameservers
}

output "cloudwatch_log_group" {
  description = "CloudWatch Logs グループ名"
  value       = module.monitoring.log_group_name
}

output "deployment_instructions" {
  description = "本番デプロイ手順"
  value = <<-EOT
    ✅ 本番環境のデプロイが完了しました！
    
    ⚠️ 本番環境チェックリスト：
    
    □ Route53のネームサーバーが正しく設定されている
    □ SSL証明書が正常に発行されている
    □ データベースのバックアップが有効
    □ CloudWatchアラートが設定されている
    □ WAFルールが有効化されている
    □ IAMロールの権限が最小限に制限されている
    □ Secrets Managerでシークレット管理している
    
    アクセス確認：
    - フロントエンド: https://${var.domain_name}
    - バックエンドAPI: https://api.${var.domain_name}/health
    - Swagger UI: https://api.${var.domain_name}/swagger-ui
  EOT
}

