# ===========================================
# 📤 Outputs for Production Environment
# ===========================================

output "ecr_repository_url" {
  description = "ECRリポジトリのURL（Dockerイメージのプッシュ先）"
  value       = module.lambda_api.ecr_repository_url
}

output "api_endpoint" {
  description = "API GatewayのエンドポイントURL"
  value       = module.lambda_api.api_gateway_endpoint
}

output "lambda_function_name" {
  description = "Lambda関数の名前"
  value       = module.lambda_api.lambda_function_name
}

output "lambda_log_group" {
  description = "Lambda関数のCloudWatch Logsグループ名"
  value       = module.lambda_api.cloudwatch_log_group_name
}

# フロントエンドで使用する環境変数
output "frontend_env_variables" {
  description = "フロントエンドで設定する環境変数"
  value = {
    NEXT_PUBLIC_API_URL_PROD = module.lambda_api.api_gateway_endpoint
  }
}
