# ===========================================
# 📤 Outputs for Lambda API Module
# ===========================================

output "ecr_repository_url" {
  description = "ECRリポジトリのURL"
  value       = aws_ecr_repository.lambda.repository_url
}

output "ecr_repository_arn" {
  description = "ECRリポジトリのARN"
  value       = aws_ecr_repository.lambda.arn
}

output "lambda_function_arn" {
  description = "Lambda関数のARN"
  value       = aws_lambda_function.api.arn
}

output "lambda_function_name" {
  description = "Lambda関数の名前"
  value       = aws_lambda_function.api.function_name
}

output "lambda_function_url" {
  description = "Lambda Function URL（有効化している場合）"
  value       = var.enable_function_url ? aws_lambda_function_url.api[0].function_url : null
}

output "api_gateway_endpoint" {
  description = "API GatewayのエンドポイントURL"
  value       = aws_apigatewayv2_api.lambda.api_endpoint
}

output "api_gateway_id" {
  description = "API GatewayのID"
  value       = aws_apigatewayv2_api.lambda.id
}

output "cloudwatch_log_group_name" {
  description = "CloudWatch Logsのロググループ名"
  value       = aws_cloudwatch_log_group.lambda.name
}
