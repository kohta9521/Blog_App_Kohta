# 🔒 Security Policy

## 🛡️ Public Repository Security

このリポジトリは**public**です。以下のセキュリティガイドラインに従ってください。

### ✅ 含まれているもの（安全）

- アプリケーションのソースコード
- 設定ファイルのテンプレート
- ドキュメント
- サンプル・デモ用のダミーデータ

### ❌ 含まれていないもの（機密情報）

- 実際のパスワード・API キー
- データベース認証情報
- AWS 認証情報
- JWT 秘密鍵
- 本番環境の設定値

## 🔧 環境変数の管理

### 開発環境

```bash
# 1. テンプレートファイルをコピー
cp env.example .env
cp apps/frontend/env.example apps/frontend/.env.local
cp apps/backend/env.example apps/backend/.env

# 2. 実際の値を設定（これらのファイルはGitに含まれません）
vim .env
```

### 本番環境

- **AWS Secrets Manager** または **Parameter Store** を使用
- 環境変数は CI/CD パイプラインで注入
- コンテナ実行時に動的に設定

## 🚨 セキュリティ問題の報告

セキュリティ上の問題を発見した場合：

1. **公開の Issue は作成しないでください**
2. 直接メール: [your-email@example.com]
3. 24 時間以内に対応します

## 🔍 セキュリティチェックリスト

開発者向けのチェックリスト：

- [ ] `.env*` ファイルが `.gitignore` に含まれている
- [ ] `terraform.tfvars` が除外されている
- [ ] パスワードがハードコードされていない
- [ ] API キーが環境変数から読み込まれている
- [ ] CORS 設定が適切に制限されている
- [ ] SQL injection 対策が実装されている
- [ ] 入力値のバリデーションが実装されている

## 📚 セキュリティリソース

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Rust Security Guidelines](https://anssi-fr.github.io/rust-guide/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [AWS Security Best Practices](https://aws.amazon.com/security/security-resources/)

---

**最終更新**: 2024 年 1 月
