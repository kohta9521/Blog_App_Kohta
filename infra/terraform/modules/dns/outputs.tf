# ===========================================
# 📤 DNS Module Outputs
# ===========================================

output "hosted_zone_id" {
  description = "Route53 Hosted Zone ID"
  value       = aws_route53_zone.main.zone_id
}

output "hosted_zone_name" {
  description = "Route53 Hosted Zone Name"
  value       = aws_route53_zone.main.name
}

output "nameservers" {
  description = "Route53ネームサーバー（ドメイン登録業者で設定が必要）"
  value       = aws_route53_zone.main.name_servers
}

output "certificate_arn" {
  description = "ACM証明書ARN"
  value       = var.create_certificate ? aws_acm_certificate.main[0].arn : null
}

output "frontend_url" {
  description = "フロントエンドのURL"
  value       = var.subdomain != "" ? "https://${var.subdomain}.${var.domain_name}" : "https://${var.domain_name}"
}

output "backend_api_url" {
  description = "バックエンドAPIのURL"
  value       = var.subdomain != "" ? "https://api-${var.subdomain}.${var.domain_name}" : "https://api.${var.domain_name}"
}

