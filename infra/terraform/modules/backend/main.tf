# ===========================================
# 🐳 Backend Module - ECS Fargate
# ===========================================
# RustバックエンドをECS Fargateで実行

# ===========================================
# 📦 ECR Repository（Dockerイメージの保存先）
# ===========================================
resource "aws_ecr_repository" "backend" {
  name                 = "blog-${var.environment}-backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true # セキュリティスキャンを有効化
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = {
    Name        = "blog-${var.environment}-backend"
    Environment = var.environment
  }
}

# ECRライフサイクルポリシー（古いイメージを自動削除）
resource "aws_ecr_lifecycle_policy" "backend" {
  repository = aws_ecr_repository.backend.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 10 images"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["v"]
          countType     = "imageCountMoreThan"
          countNumber   = 10
        }
        action = {
          type = "expire"
        }
      },
      {
        rulePriority = 2
        description  = "Delete untagged images after 7 days"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 7
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

# ===========================================
# 🚀 ECS Cluster
# ===========================================
resource "aws_ecs_cluster" "main" {
  name = "blog-${var.environment}-cluster"

  setting {
    name  = "containerInsights"
    value = var.enable_container_insights ? "enabled" : "disabled"
  }

  tags = {
    Name        = "blog-${var.environment}-cluster"
    Environment = var.environment
  }
}

# ===========================================
# 📝 CloudWatch Logs
# ===========================================
resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/blog-${var.environment}-backend"
  retention_in_days = var.environment == "prod" ? 30 : 7

  tags = {
    Name        = "blog-${var.environment}-backend-logs"
    Environment = var.environment
  }
}

# ===========================================
# 📋 ECS Task Definition
# ===========================================
resource "aws_ecs_task_definition" "backend" {
  family                   = "blog-${var.environment}-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.cpu
  memory                   = var.memory
  execution_role_arn       = var.execution_role_arn
  task_role_arn           = var.task_role_arn

  container_definitions = jsonencode([
    {
      name      = "backend"
      image     = var.container_image
      essential = true

      portMappings = [
        {
          containerPort = var.container_port
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          name  = "RUST_LOG"
          value = var.environment == "prod" ? "info" : "debug"
        },
        {
          name  = "SERVER_HOST"
          value = "0.0.0.0"
        },
        {
          name  = "SERVER_PORT"
          value = tostring(var.container_port)
        },
        {
          name  = "CORS_ORIGINS"
          value = var.cors_origins
        }
      ]

      # Secrets Manager から機密情報を取得
      secrets = [
        {
          name      = "DATABASE_URL"
          valueFrom = "${var.database_secrets_arn}:url::"
        },
        {
          name      = "JWT_SECRET"
          valueFrom = var.jwt_secret_arn
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.backend.name
          "awslogs-region"        = data.aws_region.current.name
          "awslogs-stream-prefix" = "ecs"
        }
      }

      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:${var.container_port}/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
    }
  ])

  tags = {
    Name        = "blog-${var.environment}-backend-task"
    Environment = var.environment
  }
}

# ===========================================
# ⚖️ Application Load Balancer
# ===========================================
resource "aws_lb" "backend" {
  name               = "blog-${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_security_group]
  subnets            = var.public_subnet_ids

  enable_deletion_protection = var.environment == "prod" ? true : false
  enable_http2              = true
  enable_cross_zone_load_balancing = true

  tags = {
    Name        = "blog-${var.environment}-alb"
    Environment = var.environment
  }
}

# Target Group
resource "aws_lb_target_group" "backend" {
  name        = "blog-${var.environment}-backend-tg"
  port        = var.container_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    path                = "/health"
    matcher             = "200"
  }

  deregistration_delay = 30

  tags = {
    Name        = "blog-${var.environment}-backend-tg"
    Environment = var.environment
  }
}

# HTTP Listener（HTTPSへリダイレクト）
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.backend.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# HTTPS Listener（ACM証明書が必要）
resource "aws_lb_listener" "https" {
  count = var.acm_certificate_arn != null ? 1 : 0

  load_balancer_arn = aws_lb.backend.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = var.acm_certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }
}

# ===========================================
# 🚢 ECS Service
# ===========================================
resource "aws_ecs_service" "backend" {
  name            = "blog-${var.environment}-backend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [var.backend_security_group]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "backend"
    container_port   = var.container_port
  }

  health_check_grace_period_seconds = 60

  # デプロイメント設定
  deployment_configuration {
    maximum_percent         = 200
    minimum_healthy_percent = 100
  }

  # ローリングアップデート
  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  tags = {
    Name        = "blog-${var.environment}-backend-service"
    Environment = var.environment
  }

  depends_on = [aws_lb_listener.http]
}

# ===========================================
# 📈 Auto Scaling
# ===========================================
resource "aws_appautoscaling_target" "ecs" {
  count = var.enable_auto_scaling ? 1 : 0

  max_capacity       = var.max_capacity
  min_capacity       = var.min_capacity
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.backend.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

# CPU使用率ベースのスケーリング
resource "aws_appautoscaling_policy" "ecs_cpu" {
  count = var.enable_auto_scaling ? 1 : 0

  name               = "blog-${var.environment}-backend-cpu-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs[0].resource_id
  scalable_dimension = aws_appautoscaling_target.ecs[0].scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs[0].service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value       = var.cpu_threshold
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}

# メモリ使用率ベースのスケーリング
resource "aws_appautoscaling_policy" "ecs_memory" {
  count = var.enable_auto_scaling ? 1 : 0

  name               = "blog-${var.environment}-backend-memory-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs[0].resource_id
  scalable_dimension = aws_appautoscaling_target.ecs[0].scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs[0].service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }
    target_value       = var.memory_threshold
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}

# ===========================================
# 📊 Data Sources
# ===========================================
data "aws_region" "current" {}


