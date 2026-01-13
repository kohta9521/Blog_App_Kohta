# ===========================================
# 🌐 Network Module - VPC and Subnets
# ===========================================
# VPC、サブネット、ルーティング、NAT Gatewayなどを管理

# 🏗️ VPC
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name        = "blog-${var.environment}-vpc"
    Environment = var.environment
  }
}

# 🌍 Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "blog-${var.environment}-igw"
    Environment = var.environment
  }
}

# 📍 Availability Zonesの数を取得
locals {
  az_count = length(var.availability_zones)
}

# ===========================================
# 🌐 Public Subnets（ALB、NAT Gateway用）
# ===========================================
resource "aws_subnet" "public" {
  count = local.az_count

  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name        = "blog-${var.environment}-public-${var.availability_zones[count.index]}"
    Environment = var.environment
    Type        = "public"
  }
}

# 🛣️ Public Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name        = "blog-${var.environment}-public-rt"
    Environment = var.environment
  }
}

# 🔗 Public Subnet Association
resource "aws_route_table_association" "public" {
  count = local.az_count

  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# ===========================================
# 🔒 Private Subnets（ECS、RDS用）
# ===========================================
resource "aws_subnet" "private" {
  count = local.az_count

  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 10)
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name        = "blog-${var.environment}-private-${var.availability_zones[count.index]}"
    Environment = var.environment
    Type        = "private"
  }
}

# 🗄️ Database Subnets（RDS専用）
resource "aws_subnet" "database" {
  count = local.az_count

  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 20)
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name        = "blog-${var.environment}-database-${var.availability_zones[count.index]}"
    Environment = var.environment
    Type        = "database"
  }
}

# 📦 Database Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "blog-${var.environment}-db-subnet-group"
  subnet_ids = aws_subnet.database[*].id

  tags = {
    Name        = "blog-${var.environment}-db-subnet-group"
    Environment = var.environment
  }
}

# ===========================================
# 🚪 NAT Gateway（Private Subnetからインターネットアクセス用）
# ===========================================
# Elastic IP for NAT Gateway
resource "aws_eip" "nat" {
  count = var.enable_nat_gateway ? (var.single_nat_gateway ? 1 : local.az_count) : 0

  domain = "vpc"

  tags = {
    Name        = "blog-${var.environment}-nat-eip-${count.index + 1}"
    Environment = var.environment
  }

  depends_on = [aws_internet_gateway.main]
}

# NAT Gateway
resource "aws_nat_gateway" "main" {
  count = var.enable_nat_gateway ? (var.single_nat_gateway ? 1 : local.az_count) : 0

  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = {
    Name        = "blog-${var.environment}-nat-${count.index + 1}"
    Environment = var.environment
  }

  depends_on = [aws_internet_gateway.main]
}

# 🛣️ Private Route Table
resource "aws_route_table" "private" {
  count = var.enable_nat_gateway ? (var.single_nat_gateway ? 1 : local.az_count) : 1

  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "blog-${var.environment}-private-rt-${count.index + 1}"
    Environment = var.environment
  }
}

# NAT Gateway経由のルート（NAT Gateway有効時）
resource "aws_route" "private_nat_gateway" {
  count = var.enable_nat_gateway ? (var.single_nat_gateway ? 1 : local.az_count) : 0

  route_table_id         = aws_route_table.private[count.index].id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.main[count.index].id
}

# 🔗 Private Subnet Association
resource "aws_route_table_association" "private" {
  count = local.az_count

  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = var.enable_nat_gateway ? (var.single_nat_gateway ? aws_route_table.private[0].id : aws_route_table.private[count.index].id) : aws_route_table.private[0].id
}

# ===========================================
# 📡 VPC Endpoints（コスト削減＆セキュリティ向上）
# ===========================================
# S3 Endpoint（無料）
resource "aws_vpc_endpoint" "s3" {
  vpc_id       = aws_vpc.main.id
  service_name = "com.amazonaws.${data.aws_region.current.name}.s3"

  tags = {
    Name        = "blog-${var.environment}-s3-endpoint"
    Environment = var.environment
  }
}

# S3 Endpointをルートテーブルに関連付け
resource "aws_vpc_endpoint_route_table_association" "s3_private" {
  count = var.enable_nat_gateway ? (var.single_nat_gateway ? 1 : local.az_count) : 1

  route_table_id  = aws_route_table.private[count.index].id
  vpc_endpoint_id = aws_vpc_endpoint.s3.id
}

# ECR Endpoint（Private SubnetからECRにアクセス）
resource "aws_vpc_endpoint" "ecr_api" {
  count = var.enable_nat_gateway ? 0 : 1 # NAT Gatewayがない場合のみ作成

  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.${data.aws_region.current.name}.ecr.api"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = aws_subnet.private[*].id
  security_group_ids  = [aws_security_group.vpc_endpoints[0].id]
  private_dns_enabled = true

  tags = {
    Name        = "blog-${var.environment}-ecr-api-endpoint"
    Environment = var.environment
  }
}

resource "aws_vpc_endpoint" "ecr_dkr" {
  count = var.enable_nat_gateway ? 0 : 1

  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.${data.aws_region.current.name}.ecr.dkr"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = aws_subnet.private[*].id
  security_group_ids  = [aws_security_group.vpc_endpoints[0].id]
  private_dns_enabled = true

  tags = {
    Name        = "blog-${var.environment}-ecr-dkr-endpoint"
    Environment = var.environment
  }
}

# VPC Endpoints用Security Group
resource "aws_security_group" "vpc_endpoints" {
  count = var.enable_nat_gateway ? 0 : 1

  name_prefix = "blog-${var.environment}-vpc-endpoints-"
  description = "Security group for VPC endpoints"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "HTTPS from VPC"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "blog-${var.environment}-vpc-endpoints-sg"
    Environment = var.environment
  }
}

# ===========================================
# 📊 Data Sources
# ===========================================
data "aws_region" "current" {}
