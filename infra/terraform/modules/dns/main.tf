# ===========================================
# 🌍 DNS Module - Route53
# ===========================================
# ドメイン管理、DNSレコード、SSL証明書

# ===========================================
# 📍 Route53 Hosted Zone
# ===========================================
resource "aws_route53_zone" "main" {
  name = var.domain_name

  tags = {
    Name        = var.domain_name
    Environment = var.environment
  }
}

# ===========================================
# 🔒 ACM Certificate（SSL/TLS証明書）
# ===========================================
# CloudFront/Amplify用の証明書は us-east-1 に作成する必要がある
resource "aws_acm_certificate" "main" {
  count = var.create_certificate ? 1 : 0

  domain_name               = var.domain_name
  subject_alternative_names = [
    "*.${var.domain_name}", # ワイルドカード証明書
  ]
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name        = var.domain_name
    Environment = var.environment
  }
}

# DNS検証用のレコード
resource "aws_route53_record" "cert_validation" {
  for_each = var.create_certificate ? {
    for dvo in aws_acm_certificate.main[0].domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  } : {}

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.main.zone_id
}

# 証明書の検証完了を待つ
resource "aws_acm_certificate_validation" "main" {
  count = var.create_certificate ? 1 : 0

  certificate_arn         = aws_acm_certificate.main[0].arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

# ===========================================
# 🎨 Frontend DNS Records（Amplify）
# ===========================================
# Amplifyのカスタムドメイン用のAレコード
resource "aws_route53_record" "frontend" {
  count = var.subdomain != "" ? 1 : 0

  zone_id = aws_route53_zone.main.zone_id
  name    = var.subdomain != "" ? "${var.subdomain}.${var.domain_name}" : var.domain_name
  type    = "CNAME"
  ttl     = 300
  records = [var.frontend_domain]
}

# Apex domain（ルートドメイン）の場合はALIASレコード
resource "aws_route53_record" "frontend_apex" {
  count = var.subdomain == "" && var.frontend_domain != null ? 1 : 0

  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = var.frontend_domain
    zone_id                = var.frontend_hosted_zone_id
    evaluate_target_health = false
  }
}

# ===========================================
# 🐳 Backend API DNS Records（ALB）
# ===========================================
# api.yourdomain.com または api-dev.yourdomain.com
resource "aws_route53_record" "backend" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.subdomain != "" ? "api-${var.subdomain}.${var.domain_name}" : "api.${var.domain_name}"
  type    = "A"

  alias {
    name                   = var.backend_alb_dns
    zone_id                = var.backend_alb_zone_id
    evaluate_target_health = true
  }
}

# ===========================================
# 📧 Email Records（オプション：SES用）
# ===========================================
# MXレコード（メール受信用）
resource "aws_route53_record" "mx" {
  count = var.enable_email_records ? 1 : 0

  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "MX"
  ttl     = 300
  records = [
    "10 inbound-smtp.${data.aws_region.current.name}.amazonaws.com"
  ]
}

# SPFレコード（送信元認証）
resource "aws_route53_record" "spf" {
  count = var.enable_email_records ? 1 : 0

  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "TXT"
  ttl     = 300
  records = [
    "v=spf1 include:amazonses.com ~all"
  ]
}

# ===========================================
# 🔐 DNSSEC（セキュリティ強化）
# ===========================================
resource "aws_route53_key_signing_key" "main" {
  count = var.enable_dnssec ? 1 : 0

  hosted_zone_id             = aws_route53_zone.main.id
  key_management_service_arn = aws_kms_key.dnssec[0].arn
  name                       = "${var.domain_name}-ksk"
}

resource "aws_route53_hosted_zone_dnssec" "main" {
  count = var.enable_dnssec ? 1 : 0

  hosted_zone_id = aws_route53_key_signing_key.main[0].hosted_zone_id
}

resource "aws_kms_key" "dnssec" {
  count = var.enable_dnssec ? 1 : 0

  customer_master_key_spec = "ECC_NIST_P256"
  deletion_window_in_days  = 7
  key_usage                = "SIGN_VERIFY"
  policy = jsonencode({
    Statement = [
      {
        Action = [
          "kms:DescribeKey",
          "kms:GetPublicKey",
          "kms:Sign",
        ],
        Effect = "Allow"
        Principal = {
          Service = "dnssec-route53.amazonaws.com"
        }
        Resource = "*"
      },
      {
        Action = "kms:*"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Resource = "*"
      },
    ]
    Version = "2012-10-17"
  })

  tags = {
    Name        = "${var.domain_name}-dnssec"
    Environment = var.environment
  }
}

# ===========================================
# 📊 Data Sources
# ===========================================
data "aws_region" "current" {}
data "aws_caller_identity" "current" {}


