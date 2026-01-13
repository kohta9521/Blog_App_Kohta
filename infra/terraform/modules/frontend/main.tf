# ===========================================
# 🎨 Frontend Module - AWS Amplify Hosting
# ===========================================
# Next.js 16 App Router を AWS Amplify でホスティング

# ===========================================
# 🚀 Amplify App
# ===========================================
resource "aws_amplify_app" "frontend" {
  name       = var.app_name
  repository = var.repository_url

  # ビルド設定
  build_spec = var.build_spec

  # 環境変数
  environment_variables = merge(
    {
      NEXT_PUBLIC_API_URL = var.backend_api_url
      NODE_ENV            = var.environment == "prod" ? "production" : "development"
      _LIVE_UPDATES       = jsonencode([
        {
          pkg     = "next"
          type    = "internal"
          version = "latest"
        }
      ])
    },
    var.additional_env_vars
  )

  # アクセストークン（GitHub連携）
  access_token = var.github_token

  # カスタムルール
  custom_rule {
    source = "/<*>"
    status = "404-200"
    target = "/index.html"
  }

  # SPA向けのリライトルール
  custom_rule {
    source = "</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|map|json)$)([^.]+$)/>"
    status = "200"
    target = "/index.html"
  }

  # HTTPSのみ許可
  enable_auto_branch_creation = false
  enable_branch_auto_build    = true
  enable_branch_auto_deletion = false

  # Basic認証（dev環境のみ）
  dynamic "auto_branch_creation_config" {
    for_each = var.enable_basic_auth ? [1] : []
    content {
      enable_basic_auth      = true
      basic_auth_credentials = base64encode("${var.basic_auth_username}:${var.basic_auth_password}")
    }
  }

  tags = {
    Name        = var.app_name
    Environment = var.environment
  }
}

# ===========================================
# 🌿 Amplify Branch（環境ごとのブランチ）
# ===========================================
resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.frontend.id
  branch_name = var.branch_name

  # 環境変数のオーバーライド
  environment_variables = var.branch_env_vars

  # Basic認証（dev環境のみ）
  enable_basic_auth = var.enable_basic_auth

  dynamic "basic_auth_config" {
    for_each = var.enable_basic_auth ? [1] : []
    content {
      enable_basic_auth      = true
      basic_auth_credentials = base64encode("${var.basic_auth_username}:${var.basic_auth_password}")
    }
  }

  # 自動ビルド有効化
  enable_auto_build = true

  # パフォーマンス最適化
  enable_performance_mode = var.environment == "prod"

  # プルリクエストプレビュー
  enable_pull_request_preview = var.environment != "prod"

  stage = var.environment == "prod" ? "PRODUCTION" : "DEVELOPMENT"

  tags = {
    Name        = "${var.app_name}-${var.branch_name}"
    Environment = var.environment
  }
}

# ===========================================
# 🌐 Custom Domain（オプション）
# ===========================================
resource "aws_amplify_domain_association" "main" {
  count = var.custom_domain != null ? 1 : 0

  app_id      = aws_amplify_app.frontend.id
  domain_name = var.custom_domain

  # サブドメイン設定
  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = var.subdomain_prefix
  }

  # www リダイレクト（本番環境のみ）
  dynamic "sub_domain" {
    for_each = var.environment == "prod" && var.enable_www_redirect ? [1] : []
    content {
      branch_name = aws_amplify_branch.main.branch_name
      prefix      = "www"
    }
  }

  # SSL証明書の自動管理
  wait_for_verification = true
}

# ===========================================
# 🔔 Webhook（自動デプロイトリガー）
# ===========================================
resource "aws_amplify_webhook" "main" {
  count = var.enable_webhook ? 1 : 0

  app_id      = aws_amplify_app.frontend.id
  branch_name = aws_amplify_branch.main.branch_name
  description = "Trigger deployment from ${var.branch_name}"
}

# ===========================================
# 📊 CloudWatch Logs（ビルドログ）
# ===========================================
resource "aws_cloudwatch_log_group" "amplify" {
  name              = "/aws/amplify/${aws_amplify_app.frontend.name}"
  retention_in_days = var.environment == "prod" ? 30 : 7

  tags = {
    Name        = "${var.app_name}-logs"
    Environment = var.environment
  }
}

