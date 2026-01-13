# 🗺️ あなた専用・学習ロードマップ

## 🎯 最終ゴール
**多言語対応ブログのバックエンドAPIを完全に理解し、機能追加できるようになる**

---

## 📍 現在地

```
✅ PostgreSQL起動中
✅ Posts一覧API動作中
✅ サンプルデータあり
✅ 完全なドキュメントあり
✅ 学習する意欲がある！ ← 一番大事！

❓ SQLがわからない
❓ Rustがわからない
❓ コードの意味がわからない
```

**これ、めちゃくちゃ良い状態です！** 🎉

なぜなら：
1. **動くもの**がある（ゴールが見える）
2. **お手本**がある（写経できる）
3. **実践環境**がある（試せる）

---

## 🚀 3ステップ学習プラン

### 📅 全体スケジュール（5-6週間）

```
Week 1-2: SQL基礎
  ↓
Week 3-5: Rust基礎
  ↓
Week 6: 実践・機能追加
```

---

## 📚 Phase 1: SQL基礎（1-2週間）

### なぜ最初にSQL？
- ✅ Rustより簡単（すぐ成果が出る）
- ✅ すでに動くDBがある
- ✅ Posticoで視覚的に確認できる
- ✅ 成功体験を積める

### 学習内容
```
Week 1:
- Day 1-2: 基本のSELECT
- Day 3-4: WHERE条件・ソート
- Day 5-7: 集計・GROUP BY

Week 2:
- Day 8-10: JOIN（テーブル結合）
- Day 11-12: UPDATE, INSERT, DELETE
- Day 13-14: サブクエリ・応用
```

### 使う教材
- 📖 [SQL実践ガイド](./sql-practice-guide.md) ← 今作った！
- 🌐 SQL Zoo (https://sqlzoo.net/wiki/SQL_Tutorial/ja)
- 🎮 paiza SQL (https://paiza.jp/works/sql/primer)

### 完了基準
- [ ] Posticoで基本的なSELECTが書ける
- [ ] WHERE, ORDER BYが使える
- [ ] COUNT, SUM, AVGで集計できる
- [ ] JOINで複数テーブルを結合できる

---

## 🦀 Phase 2: Rust基礎（2-3週間）

### 学習内容
```
Week 3:
- Day 15-16: 変数・型・関数
- Day 17-18: 制御フロー（if, match, for）
- Day 19-20: 構造体・メソッド
- Day 21: Option・Result

Week 4:
- Day 22-24: 所有権（Ownership）
- Day 25-26: 借用（Borrowing）
- Day 27-28: ライフタイム

Week 5:
- Day 29-30: 今回のコードを読む（Entity）
- Day 31-32: 今回のコードを読む（Repository）
- Day 33-34: 今回のコードを読む（Handler）
- Day 35: 復習・整理
```

### 使う教材
- 📖 [Rust学習パス](./rust-learning-path.md) ← 今作った！
- 📚 The Rust Book（日本語版）(https://doc.rust-jp.rs/book-ja/)
- 🔍 Rust by Example (https://doc.rust-jp.rs/rust-by-example-ja/)

### 完了基準
- [ ] 変数、関数、構造体が書ける
- [ ] 所有権のルールが説明できる
- [ ] &と&mutの違いが分かる
- [ ] Option/Resultが使える
- [ ] 今回のコードが読める

---

## 🛠️ Phase 3: 実践・機能追加（1週間）

### Week 6: 機能追加に挑戦

#### Day 36-37: 記事詳細取得API
```rust
GET /api/v1/posts/:slug
→ 特定の記事を取得
```

#### Day 38-39: カテゴリ一覧API
```rust
GET /api/v1/categories
→ カテゴリ一覧を取得
```

#### Day 40-41: タグ一覧API
```rust
GET /api/v1/tags
→ タグ一覧を取得
```

#### Day 42: 復習・整理

---

## 📊 学習時間の目安

### 平日（1時間/日）
```
20分: 教材を読む・動画を見る
20分: コードを書く・写経
20分: 復習・メモ
```

### 週末（2-3時間/日）
```
1時間: 集中学習
1時間: 実践・プロジェクト
30分: 復習・整理
```

### 合計時間
```
平日: 5日 × 1時間 = 5時間/週
週末: 2日 × 2.5時間 = 5時間/週
合計: 約10時間/週

6週間: 約60時間
```

---

## 🎓 各週の目標

### Week 1-2 (SQL)
**目標:** Posticoで自由にデータを取得できる

```sql
-- こんなクエリが書けるようになる
SELECT 
    p.title_ja,
    c.name_ja AS category,
    COUNT(t.id) AS tag_count
FROM posts p
JOIN categories c ON p.category_id = c.id
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
GROUP BY p.id, p.title_ja, c.name_ja;
```

### Week 3-5 (Rust)
**目標:** 今回のコードが理解できる

```rust
// このコードの意味が分かる
pub async fn list_posts(
    State(pool): State<PgPool>,
) -> Result<Json<PostListResponse>, impl IntoResponse> {
    let repo = PostRepository::new(pool);
    let posts = repo.find_all_published().await?;
    // ...
}
```

### Week 6 (実践)
**目標:** 新しいAPIを自分で実装できる

```rust
// 自分でこれが書けるようになる
pub async fn list_categories(
    State(pool): State<PgPool>,
) -> Result<Json<Vec<Category>>, impl IntoResponse> {
    // あなたの実装！
}
```

---

## 📚 ドキュメント一覧

### すでに用意されているもの

| ドキュメント | 内容 | いつ使う？ |
|------------|------|----------|
| [SQL実践ガイド](./sql-practice-guide.md) | SQL学習（26個の練習問題） | Week 1-2 |
| [Rust学習パス](./rust-learning-path.md) | Rust学習ロードマップ | Week 3-5 |
| [データベース設計書](./database-schema.md) | テーブル定義 | 常時参照 |
| [Postico接続ガイド](./postico-setup.md) | Postico設定方法 | 初回のみ |
| [Posts API実装](./posts-api-implementation.md) | 今回の実装解説 | Week 5-6 |
| [Getting Started](./getting-started.md) | 開発環境・コマンド | 常時参照 |

---

## ✅ マイルストーン

### 🏁 チェックポイント1 (2週間後)
- [ ] SQLの基本が分かる
- [ ] Posticoで自由にクエリが書ける
- [ ] データベースの構造が理解できる

### 🏁 チェックポイント2 (4週間後)
- [ ] Rustの基本文法が分かる
- [ ] 所有権システムが理解できる
- [ ] 今回のコードが読める

### 🏁 チェックポイント3 (6週間後)
- [ ] 新しいAPIが実装できる
- [ ] エラーを自分で解決できる
- [ ] 次の機能を企画できる

---

## 🎯 学習のコツ

### 1. 完璧主義にならない
```
❌ 100%理解してから次へ
✅ 70%理解で次へ進む → 後で戻る
```

### 2. 毎日少しずつ
```
❌ 週末に10時間まとめて
✅ 毎日1時間を継続
```

### 3. 手を動かす
```
❌ 教材を読むだけ
✅ コードを書く・実行する
```

### 4. エラーを恐れない
```
❌ エラーが出たら諦める
✅ エラーメッセージを読む → 学びのチャンス
```

### 5. アウトプット
```
✅ メモを取る
✅ 誰かに説明する（できれば）
✅ ブログに書く（できれば）
```

---

## 💡 モチベーション維持

### 短期目標（1週間ごと）
- Week 1: SQLのSELECTが書けた！
- Week 2: JOINで複雑なクエリが書けた！
- Week 3: Rustのコードがコンパイルできた！
- Week 4: 所有権システムが理解できた！
- Week 5: Posts APIのコードが読めた！
- Week 6: 自分でAPIを実装できた！

### 成功体験を積む
```
✅ 小さな成功を祝う
✅ できたことをメモする
✅ 「昨日の自分」と比較する
```

### 挫折しそうな時
```
1. 一旦休憩する（散歩・運動）
2. 簡単な部分に戻る
3. 誰かに相談する（私でもOK！）
4. 「わからない」は正常！
```

---

## 🆘 困った時のヘルプ

### エラーが解決できない
1. エラーメッセージを読む
2. Googleで検索（英語も）
3. 公式ドキュメントを見る
4. 私に聞く！

### わからない概念がある
1. 別の教材を試す（人によって合う・合わないがある）
2. 動画を見る
3. とりあえずスキップ（後で戻る）
4. 私に聞く！

### モチベーションが下がった
1. 休む（1-2日）
2. 別のことをする
3. できたことを振り返る
4. ゴールを再確認する

---

## 🎉 6週間後のあなた

```
✅ SQLが書ける
✅ Rustの基本が分かる
✅ Posts APIのコードが理解できる
✅ 簡単な機能追加ができる
✅ エラーを自分で解決できる
✅ 次に何を学べば良いか分かる
```

**そして...**

```
🚀 管理画面からブログ記事を投稿できるAPIを作れる
🚀 認証システムを追加できる
🚀 検索機能を実装できる
🚀 フロントエンドと連携できる
```

---

## 📅 今日から始めよう！

### 今すぐできること

#### Step 1: Posticoを開く
```
ホスト: localhost
ユーザー: blog_user
パスワード: blog_password
データベース: blog_dev
```

#### Step 2: 最初のSQLを実行
```sql
SELECT * FROM posts;
```

#### Step 3: データを見る
- 3件の記事が表示される
- 各カラムの意味を確認
- 「これがデータベースか！」を体感

#### Step 4: 明日からのスケジュールを立てる
- 毎日何時に学習するか決める
- カレンダーに予定を入れる
- 最初の1週間だけ決めればOK

---

## 🎊 最後に

**あなたは今、とても良いスタート地点にいます！**

- ✅ 動くプロジェクトがある
- ✅ 完全なドキュメントがある
- ✅ 学習する意欲がある

あとは、**小さな一歩を毎日積み重ねるだけ**です。

6週間後、このドキュメントを見返した時、
「あの時の不安は何だったんだろう」と思えるはずです。

**一緒に頑張りましょう！** 🚀

わからないことがあったら、**いつでも聞いてください！**

---

**今日の小さな一歩:** Posticoを開いて、`SELECT * FROM posts;` を実行してみましょう！

