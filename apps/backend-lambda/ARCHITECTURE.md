# 🏗️ アーキテクチャ設計書

## システム全体図

```
┌─────────────────────────────────────────────────────────────┐
│                         ユーザー                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Vercel (Frontend)    │
          │  Next.js 16          │
          └──────────┬───────────┘
                     │ HTTPS
                     ▼
          ┌──────────────────────┐
          │  Amazon API Gateway  │◄─── CORS設定
          │  (HTTP API)          │     Vercelからのみ許可
          └──────────┬───────────┘
                     │ Lambda Proxy
                     ▼
          ┌──────────────────────┐
          │  AWS Lambda          │
          │  (Container Image)   │
          │  Rust Runtime        │◄─── ECRからイメージ取得
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  CloudWatch Logs     │
          └──────────────────────┘
```

## コンポーネント詳細

### 1. フロントエンド（Vercel）

- **プラットフォーム**: Vercel
- **フレームワーク**: Next.js 16 (App Router)
- **デプロイ**: Git連携による自動デプロイ
- **環境**:
  - dev: プレビュー環境
  - prod: 本番環境（www.kohta-tech-blog.com）

### 2. API Gateway（HTTP API）

- **タイプ**: HTTP API（REST APIより安価）
- **エンドポイント**: リージョナル
- **CORS設定**:
  - 許可オリジン: Vercel URLのみ
  - 許可メソッド: GET, POST, OPTIONS
  - 許可ヘッダー: content-type, x-api-key, authorization

**無料枠**:
- 12ヶ月間: 月100万APIコール無料

### 3. Lambda関数

- **ランタイム**: カスタムランタイム（Container Image）
- **イメージ**: Rust バイナリ + AWS Lambda Runtime
- **メモリ**: 
  - dev: 128MB（最小）
  - prod: 256MB
- **タイムアウト**: 30秒
- **環境変数**:
  - `ENVIRONMENT`: dev/prod
  - `ALLOWED_ORIGIN`: CORS許可するURL
  - `RUST_LOG`: ログレベル

**無料枠**:
- 常時無料: 月100万リクエスト + 40万GB秒の実行時間

### 4. ECR（Container Registry）

- **用途**: Dockerイメージの保存
- **ライフサイクル**:
  - 最新5イメージを保持
  - タグなしイメージは3日後に削除
- **セキュリティ**: 
  - プッシュ時の脆弱性スキャン有効
  - AES256暗号化

**無料枠**:
- 常時無料: 月500MBのストレージ

### 5. CloudWatch Logs

- **ログ保持期間**:
  - dev: 7日間
  - prod: 30日間
- **ログ形式**: JSON構造化ログ

**無料枠**:
- 常時無料: 月5GBのログ取り込み

## データフロー

### リクエストフロー

```
1. ユーザーがフロントエンドでアクション
   ↓
2. フロントエンドがAPI Gateway URLにHTTPSリクエスト
   ↓
3. API GatewayがCORS検証
   ↓
4. Lambda関数を呼び出し（Lambda Proxy統合）
   ↓
5. Lambda関数がリクエストを処理
   ↓
6. JSONレスポンスを返す
   ↓
7. API Gatewayが適切なCORSヘッダーを付与してレスポンス
   ↓
8. フロントエンドがレスポンスを表示
```

### ログフロー

```
Lambda関数
   ↓ stdout/stderr
CloudWatch Logs
   ↓ (オプション)
CloudWatch Alarms
   ↓
SNS通知
```

## セキュリティ

### 1. CORS（Cross-Origin Resource Sharing）

- **目的**: フロントエンド以外からのアクセスを制限
- **設定箇所**: 
  - API Gateway: プリフライトリクエスト対応
  - Lambda関数: レスポンスヘッダー

```typescript
// API Gatewayの設定
cors_configuration {
  allow_origins = ["https://www.kohta-tech-blog.com"]  // 本番環境
  allow_methods = ["GET", "POST", "OPTIONS"]
  allow_headers = ["content-type", "x-api-key"]
  max_age       = 86400
}
```

### 2. IAM権限

**Lambda実行ロール**:
- CloudWatch Logsへの書き込み（AWSLambdaBasicExecutionRole）
- ECRからのイメージプル

**最小権限の原則**:
- 必要な権限のみを付与
- リソースレベルの権限設定

### 3. 環境分離

| 項目 | dev環境 | prod環境 |
|------|---------|----------|
| API URL | 独立したAPI Gateway | 独立したAPI Gateway |
| Lambda関数 | 別関数 | 別関数 |
| ECRリポジトリ | 別リポジトリ | 別リポジトリ |
| CORS設定 | dev用URL | 本番URL |
| イメージタグ | `latest` | バージョンタグ（例: `v1.0.0`） |

### 4. ログとモニタリング

**CloudWatch Alarms**:
- Lambda Errors: エラー数が閾値超過でアラート
- Lambda Duration: 実行時間が長い場合にアラート
- API Gateway 4XX/5XX: エラーレートが高い場合にアラート

## コスト最適化

### 無料枠の活用

1. **Lambda**
   - メモリ最小化（128MB）で実行時間を無料枠内に
   - コールドスタート対策不要（無料枠範囲内）

2. **API Gateway**
   - HTTP API使用（REST APIの約70%安い）
   - キャッシュ不要（コスト削減）

3. **CloudWatch Logs**
   - dev環境は7日保持（コスト削減）
   - 不要なログ出力を最小化

### 月間コスト試算（無料枠超過後）

**想定トラフィック**: 月10万リクエスト

| サービス | 使用量 | 無料枠 | 超過分 | 料金 |
|---------|--------|--------|--------|------|
| Lambda | 100,000リクエスト | 1,000,000 | 0 | $0 |
| Lambda実行時間 | 10,000GB秒 | 400,000GB秒 | 0 | $0 |
| API Gateway | 100,000コール | 1,000,000 | 0 | $0 |
| CloudWatch Logs | 100MB | 5GB | 0 | $0 |
| ECR | 100MB | 500MB | 0 | $0 |
| **合計** | | | | **$0** |

**結論**: 月10万リクエスト程度なら完全無料！

## スケーラビリティ

### 自動スケーリング

- **Lambda同時実行数**: デフォルト1000（リージョンごと）
- **API Gateway**: 自動スケール、上限なし
- **コールドスタート**: 
  - 初回: 1-3秒（Rustコンパイル済みバイナリは高速）
  - 2回目以降: 100ms以下

### パフォーマンス最適化

1. **Dockerイメージサイズ削減**
   - マルチステージビルド
   - 最小限のベースイメージ
   - バイナリのstrip

2. **Rustコードの最適化**
   - リリースビルド（`--release`）
   - LTO（Link Time Optimization）有効化
   - 不要な依存関係の削除

## デプロイ戦略

### 開発環境（dev）

```
コード変更
  ↓
Docker build & push (latest)
  ↓
Lambda関数更新（即座に反映）
  ↓
テスト
```

### 本番環境（prod）

```
コード変更
  ↓
dev環境でテスト
  ↓
Docker build & push (バージョンタグ: v1.0.0)
  ↓
terraform.tfvarsのイメージURIを更新
  ↓
terraform apply
  ↓
本番デプロイ
```

**ブルーグリーンデプロイ**（将来的な拡張）:
- Lambda Alias使用
- 段階的トラフィック移行
- 即座にロールバック可能

## 監視とアラート

### メトリクス

1. **Lambda**
   - Invocations: 実行回数
   - Duration: 実行時間
   - Errors: エラー回数
   - Throttles: スロットリング回数

2. **API Gateway**
   - Count: リクエスト数
   - 4XXError: クライアントエラー
   - 5XXError: サーバーエラー
   - Latency: レイテンシー

### ダッシュボード（推奨）

CloudWatch Dashboardで以下を可視化：
- 日次リクエスト数
- エラー率
- 平均レイテンシー
- Lambda実行時間

## 今後の拡張案

### 短期（1-3ヶ月）

- [ ] カスタムドメイン設定（Route53 + ACM）
- [ ] APIキー認証の追加
- [ ] レート制限の実装（API Gateway Usage Plans）

### 中期（3-6ヶ月）

- [ ] データベース接続（RDS PostgreSQL）
- [ ] 認証機能（JWT）
- [ ] WebSocket対応（API Gateway WebSocket API）

### 長期（6-12ヶ月）

- [ ] マルチリージョン対応
- [ ] CDN統合（CloudFront）
- [ ] CI/CD自動化（GitHub Actions）

## 参考資料

- [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/latest/dg/)
- [API Gateway HTTP API](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html)
- [AWS Lambda Rust Runtime](https://github.com/awslabs/aws-lambda-rust-runtime)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
