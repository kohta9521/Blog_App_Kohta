#!/bin/bash
# ===========================================
# Dockerイメージのビルドとプッシュスクリプト
# ===========================================

set -e  # エラーが発生したら即座に終了

# 色付き出力用
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 使い方表示
usage() {
    echo "使い方: $0 [環境] [タグ]"
    echo ""
    echo "引数:"
    echo "  環境    dev または prod（必須）"
    echo "  タグ    Dockerイメージのタグ（オプション、デフォルト: latest）"
    echo ""
    echo "例:"
    echo "  $0 dev"
    echo "  $0 dev latest"
    echo "  $0 prod v1.0.0"
    exit 1
}

# 引数チェック
if [ $# -lt 1 ]; then
    usage
fi

ENVIRONMENT=$1
TAG=${2:-latest}

# 環境チェック
if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "prod" ]]; then
    echo -e "${RED}エラー: 環境は 'dev' または 'prod' である必要があります${NC}"
    usage
fi

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}🦀 Rust Lambda ビルド＆プッシュ${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "環境: ${YELLOW}${ENVIRONMENT}${NC}"
echo -e "タグ: ${YELLOW}${TAG}${NC}"
echo ""

# スクリプトのディレクトリを取得
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/.."

# プロジェクトルートに移動
cd "$PROJECT_ROOT"

# AWSアカウントIDとリージョンを取得
echo -e "${YELLOW}📍 AWS情報を取得中...${NC}"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION="ap-northeast-1"
ECR_REPO_NAME="blog-${ENVIRONMENT}-lambda-api"
ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}"

echo -e "${GREEN}✅ AWSアカウントID: ${AWS_ACCOUNT_ID}${NC}"
echo -e "${GREEN}✅ ECRリポジトリ: ${ECR_REPO_NAME}${NC}"
echo ""

# ECRにログイン
echo -e "${YELLOW}🔐 ECRにログイン中...${NC}"
aws ecr get-login-password --region ${AWS_REGION} | \
  docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ ECRログインに失敗しました${NC}"
    exit 1
fi
echo -e "${GREEN}✅ ECRログイン成功${NC}"
echo ""

# Dockerイメージをビルド
echo -e "${YELLOW}🏗️  Dockerイメージをビルド中...${NC}"

# Docker manifest v2形式でビルド（OCI形式を無効化）
# Apple Silicon対応: プラットフォーム指定なしでネイティブビルド
DOCKER_BUILDKIT=0 docker build -t ${ECR_REPO_NAME}:${TAG} .

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Dockerビルドに失敗しました${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dockerビルド成功${NC}"
echo ""

# ECR用にタグ付け
echo -e "${YELLOW}🏷️  イメージにタグ付け中...${NC}"
docker tag ${ECR_REPO_NAME}:${TAG} ${ECR_URI}:${TAG}
echo -e "${GREEN}✅ タグ付け完了${NC}"
echo ""

# ECRにプッシュ（manifest v2形式を強制）
echo -e "${YELLOW}📤 ECRにプッシュ中...${NC}"
DOCKER_BUILDKIT=0 docker push ${ECR_URI}:${TAG}

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ ECRプッシュに失敗しました${NC}"
    exit 1
fi
echo -e "${GREEN}✅ ECRプッシュ成功${NC}"
echo ""

# 完了メッセージ
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}🎉 完了！${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "イメージURI: ${YELLOW}${ECR_URI}:${TAG}${NC}"
echo ""
echo -e "次のステップ:"
echo -e "1. terraform.tfvarsにイメージURIを設定"
echo -e "2. ${YELLOW}terraform apply${NC} を実行してデプロイ"
echo ""
