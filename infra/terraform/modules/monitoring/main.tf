# ===========================================
# 📊 Monitoring Module - CloudWatch
# ===========================================
# ログ、メトリクス、アラートの監視設定

# ===========================================
# 📝 CloudWatch Log Groups
# ===========================================
resource "aws_cloudwatch_log_group" "application" {
  name              = "/aws/blog/${var.environment}"
  retention_in_days = var.log_retention_days

  tags = {
    Name        = "blog-${var.environment}-app-logs"
    Environment = var.environment
  }
}

# ===========================================
# 🔔 SNS Topic（アラート通知用）
# ===========================================
resource "aws_sns_topic" "alerts" {
  name = "blog-${var.environment}-alerts"

  tags = {
    Name        = "blog-${var.environment}-alerts"
    Environment = var.environment
  }
}

# メール通知の購読
resource "aws_sns_topic_subscription" "email" {
  count = var.alert_email != null ? 1 : 0

  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

# ===========================================
# 🚨 CloudWatch Alarms - Backend ECS
# ===========================================

# ECS CPU使用率
resource "aws_cloudwatch_metric_alarm" "ecs_cpu" {
  alarm_name          = "blog-${var.environment}-ecs-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = var.cpu_threshold
  alarm_description   = "ECS CPU使用率が${var.cpu_threshold}%を超えました"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    ClusterName = var.backend_cluster_name
    ServiceName = var.backend_service_name
  }

  tags = {
    Name        = "blog-${var.environment}-ecs-cpu-alarm"
    Environment = var.environment
  }
}

# ECS メモリ使用率
resource "aws_cloudwatch_metric_alarm" "ecs_memory" {
  alarm_name          = "blog-${var.environment}-ecs-memory-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = var.memory_threshold
  alarm_description   = "ECSメモリ使用率が${var.memory_threshold}%を超えました"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    ClusterName = var.backend_cluster_name
    ServiceName = var.backend_service_name
  }

  tags = {
    Name        = "blog-${var.environment}-ecs-memory-alarm"
    Environment = var.environment
  }
}

# ECS タスク数（ゼロになったら緊急）
resource "aws_cloudwatch_metric_alarm" "ecs_running_tasks" {
  alarm_name          = "blog-${var.environment}-ecs-no-running-tasks"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "RunningTaskCount"
  namespace           = "ECS/ContainerInsights"
  period              = "60"
  statistic           = "Average"
  threshold           = 1
  alarm_description   = "ECSタスクが実行されていません（サービス停止）"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  treat_missing_data  = "breaching"

  dimensions = {
    ClusterName = var.backend_cluster_name
    ServiceName = var.backend_service_name
  }

  tags = {
    Name        = "blog-${var.environment}-ecs-tasks-alarm"
    Environment = var.environment
  }
}

# ===========================================
# 🚨 CloudWatch Alarms - ALB
# ===========================================

# ALB 5xxエラー率
resource "aws_cloudwatch_metric_alarm" "alb_5xx_errors" {
  count = var.alb_arn != null ? 1 : 0

  alarm_name          = "blog-${var.environment}-alb-5xx-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "HTTPCode_Target_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = "300"
  statistic           = "Sum"
  threshold           = 10
  alarm_description   = "ALBで5xxエラーが多発しています"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    LoadBalancer = split(":", var.alb_arn)[1]
  }

  tags = {
    Name        = "blog-${var.environment}-alb-5xx-alarm"
    Environment = var.environment
  }
}

# ALB レスポンスタイム
resource "aws_cloudwatch_metric_alarm" "alb_response_time" {
  count = var.alb_arn != null ? 1 : 0

  alarm_name          = "blog-${var.environment}-alb-slow-response"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "TargetResponseTime"
  namespace           = "AWS/ApplicationELB"
  period              = "300"
  statistic           = "Average"
  threshold           = 2.0 # 2秒
  alarm_description   = "ALBのレスポンスタイムが遅くなっています"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    LoadBalancer = split(":", var.alb_arn)[1]
  }

  tags = {
    Name        = "blog-${var.environment}-alb-response-alarm"
    Environment = var.environment
  }
}

# ===========================================
# 🚨 CloudWatch Alarms - RDS
# ===========================================

# RDS CPU使用率
resource "aws_cloudwatch_metric_alarm" "rds_cpu" {
  alarm_name          = "blog-${var.environment}-rds-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = var.db_cpu_threshold
  alarm_description   = "RDS CPU使用率が${var.db_cpu_threshold}%を超えました"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    DBInstanceIdentifier = var.database_identifier
  }

  tags = {
    Name        = "blog-${var.environment}-rds-cpu-alarm"
    Environment = var.environment
  }
}

# RDS ストレージ残量
resource "aws_cloudwatch_metric_alarm" "rds_storage" {
  alarm_name          = "blog-${var.environment}-rds-storage-low"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "FreeStorageSpace"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = 5368709120 # 5GB
  alarm_description   = "RDSストレージ残量が5GB以下です"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    DBInstanceIdentifier = var.database_identifier
  }

  tags = {
    Name        = "blog-${var.environment}-rds-storage-alarm"
    Environment = var.environment
  }
}

# RDS 接続数
resource "aws_cloudwatch_metric_alarm" "rds_connections" {
  alarm_name          = "blog-${var.environment}-rds-connections-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "DatabaseConnections"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "RDS接続数が多くなっています"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    DBInstanceIdentifier = var.database_identifier
  }

  tags = {
    Name        = "blog-${var.environment}-rds-connections-alarm"
    Environment = var.environment
  }
}

# ===========================================
# 📊 CloudWatch Dashboard
# ===========================================
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "blog-${var.environment}-overview"

  dashboard_body = jsonencode({
    widgets = [
      # ECS CPU/Memory
      {
        type = "metric"
        properties = {
          metrics = [
            ["AWS/ECS", "CPUUtilization", { stat = "Average" }],
            [".", "MemoryUtilization", { stat = "Average" }]
          ]
          period = 300
          stat   = "Average"
          region = data.aws_region.current.name
          title  = "ECS CPU & Memory"
        }
      },
      # RDS Metrics
      {
        type = "metric"
        properties = {
          metrics = [
            ["AWS/RDS", "CPUUtilization", { stat = "Average" }],
            [".", "DatabaseConnections", { stat = "Average" }],
            [".", "FreeStorageSpace", { stat = "Average" }]
          ]
          period = 300
          stat   = "Average"
          region = data.aws_region.current.name
          title  = "RDS Metrics"
        }
      },
      # ALB Metrics
      {
        type = "metric"
        properties = {
          metrics = [
            ["AWS/ApplicationELB", "RequestCount", { stat = "Sum" }],
            [".", "TargetResponseTime", { stat = "Average" }],
            [".", "HTTPCode_Target_5XX_Count", { stat = "Sum" }]
          ]
          period = 300
          region = data.aws_region.current.name
          title  = "ALB Metrics"
        }
      }
    ]
  })
}

# ===========================================
# 📊 Data Sources
# ===========================================
data "aws_region" "current" {}


