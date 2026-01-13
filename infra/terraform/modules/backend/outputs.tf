# ===========================================
# 📤 Backend Module Outputs
# ===========================================

output "ecr_repository_url" {
  description = "ECRリポジトリURL"
  value       = aws_ecr_repository.backend.repository_url
}

output "ecr_repository_arn" {
  description = "ECRリポジトリARN"
  value       = aws_ecr_repository.backend.arn
}

output "ecs_cluster_id" {
  description = "ECSクラスターID"
  value       = aws_ecs_cluster.main.id
}

output "ecs_cluster_name" {
  description = "ECSクラスター名"
  value       = aws_ecs_cluster.main.name
}

output "ecs_cluster_arn" {
  description = "ECSクラスターARN"
  value       = aws_ecs_cluster.main.arn
}

output "ecs_service_name" {
  description = "ECSサービス名"
  value       = aws_ecs_service.backend.name
}

output "ecs_service_arn" {
  description = "ECSサービスARN"
  value       = aws_ecs_service.backend.id
}

output "alb_id" {
  description = "ALB ID"
  value       = aws_lb.backend.id
}

output "alb_arn" {
  description = "ALB ARN"
  value       = aws_lb.backend.arn
}

output "alb_dns_name" {
  description = "ALBのDNS名"
  value       = aws_lb.backend.dns_name
}

output "alb_zone_id" {
  description = "ALBのHosted Zone ID"
  value       = aws_lb.backend.zone_id
}

output "target_group_arn" {
  description = "Target Group ARN"
  value       = aws_lb_target_group.backend.arn
}

output "cloudwatch_log_group_name" {
  description = "CloudWatch Log Group名"
  value       = aws_cloudwatch_log_group.backend.name
}

