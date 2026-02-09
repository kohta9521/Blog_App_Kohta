# ===========================================
# 🚀 Development Environment - Lambda API
# ===========================================
# 開発環境用のLambda APIインフラストラクチャ
# 無料枠を最大限活用し、コストを最小化

terraform {
  required_version = ">= 1.7.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Terraform Stateの保存先（S3バックエンド）
  # 初回は手動でS3バケットとDynamoDBテーブルを作成する必要があります
  # backend "s3" {
  #   bucket         = "blog-terraform-state-lambda"
  #   key            = "dev/terraform.tfstate"
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
      Environment = "dev"
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

  environment       = var.environment
  lambda_image_uri  = var.lambda_image_uri
  allowed_origin    = var.allowed_origin
  timeout           = var.lambda_timeout
  memory_size       = var.lambda_memory_size
  enable_function_url = false # API Gatewayを使用
}

# ===========================================
# 📊 CloudWatch Alarms（オプション）
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
  threshold           = 10
  alarm_description   = "Lambda関数のエラー数が10を超えた場合にアラート"
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = module.lambda_api.lambda_function_name
  }

  # SNS通知設定（オプション）
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
  threshold           = 5000 # 5秒
  alarm_description   = "Lambda関数の平均実行時間が5秒を超えた場合にアラート"
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = module.lambda_api.lambda_function_name
  }
}
