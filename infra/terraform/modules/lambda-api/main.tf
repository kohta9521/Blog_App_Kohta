# ===========================================
# 🦀 Lambda API Module - Rust Hello World
# ===========================================
# AWS Lambda + API Gateway でシンプルなRust APIを実行
# 無料枠: Lambda 100万リクエスト/月、API Gateway 100万コール/月

# ===========================================
# 📦 ECR Repository（Dockerイメージの保存先）
# ===========================================
resource "aws_ecr_repository" "lambda" {
  name                 = "blog-${var.environment}-lambda-api"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true # セキュリティスキャンを有効化
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = {
    Name        = "blog-${var.environment}-lambda-api"
    Environment = var.environment
  }
}

# ECRライフサイクルポリシー（古いイメージを自動削除してコスト削減）
resource "aws_ecr_lifecycle_policy" "lambda" {
  repository = aws_ecr_repository.lambda.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 5 images"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["v"]
          countType     = "imageCountMoreThan"
          countNumber   = 5
        }
        action = {
          type = "expire"
        }
      },
      {
        rulePriority = 2
        description  = "Delete untagged images after 3 days"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 3
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

# ===========================================
# 🔐 IAM Role for Lambda
# ===========================================
resource "aws_iam_role" "lambda_execution" {
  name = "blog-${var.environment}-lambda-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "blog-${var.environment}-lambda-execution-role"
    Environment = var.environment
  }
}

# Lambda基本実行権限（CloudWatch Logsへの書き込み）
resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# ECRからイメージをプルする権限
resource "aws_iam_role_policy" "lambda_ecr" {
  name = "blog-${var.environment}-lambda-ecr-policy"
  role = aws_iam_role.lambda_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability"
        ]
        Resource = aws_ecr_repository.lambda.arn
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken"
        ]
        Resource = "*"
      }
    ]
  })
}

# ===========================================
# 📝 CloudWatch Logs
# ===========================================
resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/blog-${var.environment}-api"
  retention_in_days = var.environment == "prod" ? 30 : 7

  tags = {
    Name        = "blog-${var.environment}-lambda-logs"
    Environment = var.environment
  }
}

# ===========================================
# 🚀 Lambda Function
# ===========================================
resource "aws_lambda_function" "api" {
  function_name = "blog-${var.environment}-api"
  role          = aws_iam_role.lambda_execution.arn
  package_type  = "Image"
  image_uri     = var.lambda_image_uri
  timeout       = var.timeout
  memory_size   = var.memory_size

  environment {
    variables = {
      ENVIRONMENT    = var.environment
      ALLOWED_ORIGIN = var.allowed_origin
      RUST_LOG       = var.environment == "prod" ? "info" : "debug"
    }
  }

  tags = {
    Name        = "blog-${var.environment}-api"
    Environment = var.environment
  }

  depends_on = [
    aws_cloudwatch_log_group.lambda,
    aws_iam_role_policy_attachment.lambda_basic
  ]
}

# Lambda関数のURLを有効化（API Gateway不要の簡易版）
# ただし、今回はAPI Gatewayを使ってCORS設定やカスタムドメインを設定
resource "aws_lambda_function_url" "api" {
  count = var.enable_function_url ? 1 : 0

  function_name      = aws_lambda_function.api.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = false
    allow_origins     = [var.allowed_origin]
    allow_methods     = ["GET", "POST", "OPTIONS"]
    allow_headers     = ["content-type", "x-api-key"]
    max_age           = 86400
  }
}

# ===========================================
# 🌐 API Gateway (HTTP API)
# ===========================================
# HTTP APIはREST APIより安価（無料枠: 100万コール/月）
resource "aws_apigatewayv2_api" "lambda" {
  name          = "blog-${var.environment}-api"
  protocol_type = "HTTP"
  description   = "Rust Lambda API for ${var.environment} environment"

  cors_configuration {
    allow_origins = [var.allowed_origin]
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["content-type", "x-api-key", "authorization"]
    max_age       = 86400
  }

  tags = {
    Name        = "blog-${var.environment}-api-gateway"
    Environment = var.environment
  }
}

# Lambda統合
resource "aws_apigatewayv2_integration" "lambda" {
  api_id           = aws_apigatewayv2_api.lambda.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.api.invoke_arn

  payload_format_version = "2.0"
}

# デフォルトルート（すべてのリクエストをLambdaに転送）
resource "aws_apigatewayv2_route" "default" {
  api_id    = aws_apigatewayv2_api.lambda.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

# ステージ（環境ごとの設定）
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.lambda.id
  name        = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      routeKey       = "$context.routeKey"
      status         = "$context.status"
      protocol       = "$context.protocol"
      responseLength = "$context.responseLength"
      errorMessage   = "$context.error.message"
    })
  }

  tags = {
    Name        = "blog-${var.environment}-api-stage"
    Environment = var.environment
  }
}

# API Gateway用のCloudWatch Logs
resource "aws_cloudwatch_log_group" "api_gateway" {
  name              = "/aws/apigateway/blog-${var.environment}-api"
  retention_in_days = var.environment == "prod" ? 30 : 7

  tags = {
    Name        = "blog-${var.environment}-api-gateway-logs"
    Environment = var.environment
  }
}

# Lambda実行権限をAPI Gatewayに付与
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.lambda.execution_arn}/*/*"
}

# ===========================================
# 📊 Data Sources
# ===========================================
data "aws_region" "current" {}
data "aws_caller_identity" "current" {}
