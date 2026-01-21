# ===========================================
# 📤 Development Environment Outputs
# ===========================================
# デプロイ後に必要な情報を出力します

# 🌐 Network Outputs
output "vpc_id" {
  description = "VPC ID"
  value       = module.network.vpc_id
}

output "public_subnet_ids" {
  description = "パブリックサブネットIDリスト"
  value       = module.network.public_subnet_ids
}

output "private_subnet_ids" {
  description = "プライベートサブネットIDリスト"
  value       = module.network.private_subnet_ids
}

# 🗄️ Database Outputs
output "database_endpoint" {
  description = "RDSエンドポイント"
  value       = module.database.database_endpoint
  sensitive   = true
}

output "database_url" {
  description = "データベース接続URL（Rust用）"
  value       = module.database.database_url
  sensitive   = true
}

# 🐳 Backend Outputs
output "backend_alb_dns" {
  description = "バックエンドALBのDNS名"
  value       = module.backend.alb_dns_name
}

output "backend_api_url" {
  description = "バックエンドAPIのURL"
  value       = "https://api-dev.${var.domain_name}"
}

output "ecs_cluster_name" {
  description = "ECSクラスター名"
  value       = module.backend.ecs_cluster_name
}

# 🎨 Frontend Outputs
output "frontend_url" {
  description = "フロントエンドのURL"
  value       = "https://dev.${var.domain_name}"
}

output "amplify_app_id" {
  description = "Amplify App ID"
  value       = module.frontend.app_id
}

output "amplify_default_domain" {
  description = "Amplifyのデフォルトドメイン"
  value       = module.frontend.default_domain
}

# 🌍 DNS Outputs
output "nameservers" {
  description = "Route53のネームサーバー（ドメイン登録業者で設定）"
  value       = module.dns.nameservers
}

# 📊 Monitoring Outputs
output "cloudwatch_log_group" {
  description = "CloudWatch Logs グループ名"
  value       = module.monitoring.log_group_name
}

output "sns_topic_arn" {
  description = "アラート通知用SNS Topic ARN"
  value       = module.monitoring.sns_topic_arn
}

# 🔐 Security Outputs
output "backend_security_group_id" {
  description = "バックエンドSecurity Group ID"
  value       = module.security.backend_security_group_id
}

output "database_security_group_id" {
  description = "データベースSecurity Group ID"
  value       = module.security.database_security_group_id
}

# 📝 Deployment Instructions
output "deployment_instructions" {
  description = "デプロイ後の手順"
  value = <<-EOT
    ✅ インフラのデプロイが完了しました！
    
    次のステップ：
    
    1. Route53のネームサーバーをドメイン登録業者で設定
       ネームサーバー: ${join(", ", module.dns.nameservers)}
    
    2. データベースマイグレーション実行
       cd apps/backend
       DATABASE_URL="${module.database.database_url}" sqlx migrate run
    
    3. バックエンドのDockerイメージをビルド＆プッシュ
       aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin <ECR_URI>
       docker build -t blog-backend apps/backend
       docker tag blog-backend:latest <ECR_URI>/blog-backend:latest
       docker push <ECR_URI>/blog-backend:latest
    
    4. ECSサービスを更新してコンテナをデプロイ
       aws ecs update-service --cluster ${module.backend.ecs_cluster_name} --service blog-backend-dev --force-new-deployment
    
    5. アクセス確認
       フロントエンド: https://dev.${var.domain_name}
       バックエンドAPI: https://api-dev.${var.domain_name}/health
       Swagger UI: https://api-dev.${var.domain_name}/swagger-ui
  EOT
}


