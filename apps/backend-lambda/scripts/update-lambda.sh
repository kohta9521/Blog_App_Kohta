#!/bin/bash
# ===========================================
# Lambda関数を最新のDockerイメージで更新
# ===========================================

set -e

# 色付き出力用
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

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
echo -e "${GREEN}🔄 Lambda関数を更新中${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# AWS情報を取得
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION="ap-northeast-1"
FUNCTION_NAME="blog-${ENVIRONMENT}-api"
ECR_REPO_NAME="blog-${ENVIRONMENT}-lambda-api"
IMAGE_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}:${TAG}"

echo -e "関数名: ${YELLOW}${FUNCTION_NAME}${NC}"
echo -e "イメージURI: ${YELLOW}${IMAGE_URI}${NC}"
echo ""

# Lambda関数を更新
echo -e "${YELLOW}🚀 Lambda関数を更新中...${NC}"
aws lambda update-function-code \
  --function-name ${FUNCTION_NAME} \
  --image-uri ${IMAGE_URI} \
  --region ${AWS_REGION} \
  --output json > /dev/null

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Lambda更新に失敗しました${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Lambda更新リクエスト送信完了${NC}"
echo ""

# 更新完了を待つ
echo -e "${YELLOW}⏳ 更新完了を待っています...${NC}"
aws lambda wait function-updated \
  --function-name ${FUNCTION_NAME} \
  --region ${AWS_REGION}

echo -e "${GREEN}✅ Lambda関数の更新が完了しました！${NC}"
echo ""

# 関数の情報を表示
echo -e "${YELLOW}📊 関数の情報:${NC}"
aws lambda get-function --function-name ${FUNCTION_NAME} --region ${AWS_REGION} \
  --query 'Configuration.[FunctionName, LastModified, State]' \
  --output text

echo ""
echo -e "${GREEN}🎉 完了！${NC}"
echo ""
