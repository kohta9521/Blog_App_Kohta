# ===========================================
# 🚀 Production Environment - Lambda API
# ===========================================
# 本番環境用のLambda APIインフラストラクチャ
# セキュリティとパフォーマンスを重視

terraform {
  required_version = ">= 1.7.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Terraform Stateの保存先（S3バックエンド）
  # backend "s3" {
  #   bucket         = "blog-terraform-state-lambda"
  #   key            = "prod/terraform.tfstate"
  #   region         = "ap-northeast-1"
  #   encrypt        = true
  #   dynamodb_table = "terraform-state-lock"
  # }
}

# ===========================================
# 📍 Provider Configuration
# ===========================================
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = "prod"
      Project     = "blog-lambda-api"
      ManagedBy   = "terraform"
      Owner       = "kohta"
    }
  }
}

# ===========================================
# 🦀 Lambda API Module
# ===========================================
module "lambda_api" {
  source = "../../modules/lambda-api"

  environment         = var.environment
  lambda_image_uri    = var.lambda_image_uri
  allowed_origin      = var.allowed_origin
  timeout             = var.lambda_timeout
  memory_size         = var.lambda_memory_size
  enable_function_url = false # API Gatewayを使用
}

# ===========================================
# 📊 CloudWatch Alarms
# ===========================================
# Lambda関数のエラー率が高い場合にアラート
resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  alarm_name          = "blog-${var.environment}-lambda-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Sum"
  threshold           = 5 # 本番環境は閾値を厳しく
  alarm_description   = "Lambda関数のエラー数が5を超えた場合にアラート"
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = module.lambda_api.lambda_function_name
  }

  # SNS通知設定（本番環境では必須）
  # alarm_actions = [aws_sns_topic.alerts.arn]
}

# Lambda関数の実行時間が長い場合にアラート
resource "aws_cloudwatch_metric_alarm" "lambda_duration" {
  alarm_name          = "blog-${var.environment}-lambda-duration"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "Duration"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Average"
  threshold           = 3000 # 3秒（本番環境は厳しく）
  alarm_description   = "Lambda関数の平均実行時間が3秒を超えた場合にアラート"
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = module.lambda_api.lambda_function_name
  }
}

# API Gatewayの4XXエラー率
resource "aws_cloudwatch_metric_alarm" "api_gateway_4xx" {
  alarm_name          = "blog-${var.environment}-api-4xx-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "4XXError"
  namespace           = "AWS/ApiGateway"
  period              = 300
  statistic           = "Sum"
  threshold           = 50
  alarm_description   = "API Gatewayの4XXエラーが50を超えた場合にアラート"
  treat_missing_data  = "notBreaching"

  dimensions = {
    ApiId = module.lambda_api.api_gateway_id
  }
}

# API Gatewayの5XXエラー率
resource "aws_cloudwatch_metric_alarm" "api_gateway_5xx" {
  alarm_name          = "blog-${var.environment}-api-5xx-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "5XXError"
  namespace           = "AWS/ApiGateway"
  period              = 300
  statistic           = "Sum"
  threshold           = 5
  alarm_description   = "API Gatewayの5XXエラーが5を超えた場合にアラート"
  treat_missing_data  = "notBreaching"

  dimensions = {
    ApiId = module.lambda_api.api_gateway_id
  }
}
