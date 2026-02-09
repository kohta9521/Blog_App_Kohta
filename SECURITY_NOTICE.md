# 🔒 セキュリティに関する重要な通知

## ⚠️ 機密情報の取り扱い

このリポジトリはパブリックです。以下のファイルには**絶対に機密情報を含めないでください**。

### 🚫 コミット禁止ファイル

- `*.env` (すべての環境変数ファイル)
- `*.tfvars` (Terraform変数ファイル)
- `*.pem`, `*.key` (秘密鍵)
- `credentials`, `config` (AWS認証情報)
- `*.backup`, `*.bak` (バックアップファイル)

### ✅ コミット可能ファイル

- `*.env.example` (サンプルファイルのみ)
- `*.tfvars.example` (サンプルファイルのみ)
- ドキュメント、README

## 🔐 機密情報の管理方法

### 1. 環境変数

```bash
# ローカル開発環境
cp .env.example .env
# .envファイルに実際の値を設定（Gitにコミットしない）
```

### 2. Terraform変数

```bash
# Terraform設定
cp terraform.tfvars.example terraform.tfvars
# terraform.tfvarsに実際の値を設定（Gitにコミットしない）
```

### 3. AWS認証情報

```bash
# AWS CLIの設定
aws configure
# 認証情報は~/.aws/credentialsに保存される（Gitにコミットしない）
```

## 🚨 もしコミットしてしまったら

### ステップ1: すぐにキーを無効化

1. **APIキーを即座にローテーション**
   - microCMS: 管理画面でAPIキーを再発行
   - AWS: IAMでアクセスキーを無効化＆削除

2. **新しいキーを発行**
   - 安全な場所（1Password, AWS Secrets Manager等）に保存

### ステップ2: Git履歴から削除

```bash
# git-filter-repoを使用（推奨）
pip install git-filter-repo
git filter-repo --path apps/frontend/.env --invert-paths

# または
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch apps/frontend/.env' \
  --prune-empty --tag-name-filter cat -- --all
```

### ステップ3: 強制プッシュ

```bash
git push origin --force --all
git push origin --force --tags
```

## 📋 セキュリティチェックリスト

デプロイ前に以下を確認：

- [ ] `.env`ファイルがコミットされていない
- [ ] `.tfvars`ファイルがコミットされていない
- [ ] APIキーがハードコードされていない
- [ ] AWSアカウントIDが不要に公開されていない
- [ ] パスワードがプレーンテキストで書かれていない
- [ ] `.gitignore`が適切に設定されている

## 🔍 機密情報のスキャン

```bash
# git-secretsのインストール（推奨）
brew install git-secrets

# リポジトリに設定
git secrets --install
git secrets --register-aws

# スキャン実行
git secrets --scan
```

## 📞 セキュリティインシデント報告

もし機密情報の漏洩を発見した場合：

1. **直ちに報告**: [セキュリティ担当者のメールアドレス]
2. **キーの無効化**: 該当するAPIキー/アクセスキーを即座に無効化
3. **影響範囲の調査**: どの程度の情報が漏洩したか確認

## 🛡️ ベストプラクティス

### 環境変数の管理

- ローカル開発: `.env`ファイル（Gitignore）
- 本番環境: AWS Secrets Manager、Parameter Store
- CI/CD: GitHub Secrets、環境変数

### Terraform

- 機密情報は`terraform.tfvars`に（Gitignore）
- サンプルは`terraform.tfvars.example`に
- Stateファイルは暗号化されたS3に保存

### AWS認証

- IAMユーザーではなくIAM Roleを使用（可能な限り）
- アクセスキーは定期的にローテーション
- MFAを有効化

---

**Remember: コミット前に必ず確認！GitHubにプッシュした情報は削除しても履歴に残ります。**
