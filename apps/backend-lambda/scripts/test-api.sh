#!/bin/bash
# ===========================================
# デプロイされたAPIをテストするスクリプト
# ===========================================

set -e

# 色付き出力用
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 使い方表示
usage() {
    echo "使い方: $0 [環境]"
    echo ""
    echo "引数:"
    echo "  環境    dev または prod（必須）"
    echo ""
    echo "例:"
    echo "  $0 dev"
    echo "  $0 prod"
    exit 1
}

# 引数チェック
if [ $# -lt 1 ]; then
    usage
fi

ENVIRONMENT=$1

# 環境チェック
if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "prod" ]]; then
    echo -e "${RED}エラー: 環境は 'dev' または 'prod' である必要があります${NC}"
    usage
fi

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}🧪 API テスト (${ENVIRONMENT})${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# TerraformのOutputからAPI URLを取得
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
TERRAFORM_DIR="${SCRIPT_DIR}/../../../infra/terraform/envs/lambda-${ENVIRONMENT}"

cd "$TERRAFORM_DIR"

echo -e "${YELLOW}📍 API URLを取得中...${NC}"
API_URL=$(terraform output -raw api_endpoint 2>/dev/null)

if [ -z "$API_URL" ]; then
    echo -e "${RED}❌ API URLが取得できませんでした${NC}"
    echo -e "${YELLOW}Terraformが正しくapplyされているか確認してください${NC}"
    exit 1
fi

echo -e "${GREEN}✅ API URL: ${API_URL}${NC}"
echo ""

# テスト1: Hello World
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}テスト1: Hello World${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}GET ${API_URL}/hello${NC}"
echo ""
curl -s "${API_URL}/hello" | jq '.'
echo ""
echo ""

# テスト2: ヘルスチェック
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}テスト2: ヘルスチェック${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}GET ${API_URL}/health${NC}"
echo ""
curl -s "${API_URL}/health" | jq '.'
echo ""
echo ""

# テスト3: ルートパス
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}テスト3: ルートパス${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}GET ${API_URL}/${NC}"
echo ""
curl -s "${API_URL}/" | jq '.'
echo ""
echo ""

# テスト4: 存在しないパス (404)
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}テスト4: 存在しないパス (404)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}GET ${API_URL}/notfound${NC}"
echo ""
curl -s "${API_URL}/notfound" | jq '.'
echo ""
echo ""

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✅ テスト完了${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
