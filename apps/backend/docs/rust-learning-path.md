# 🦀 Rust 学習ロードマップ - あなた専用

## 🎯 目標

**今回実装した Posts API のコードを完全に理解できるようになる**

---

## 📅 学習プラン（2-3 週間）

```
Week 1: Rust基礎文法（所有権以外）
Week 2: 所有権・借用・ライフタイム
Week 3: 今回のコードを理解
```

---

## 📚 学習リソース

### 🌟 メイン教材（これだけで OK）

**1. The Rust Programming Language（日本語版）**

- https://doc.rust-jp.rs/book-ja/
- **完全無料・公式・日本語**
- これが最強の教材

**2. Rust by Example（日本語版）**

- https://doc.rust-jp.rs/rust-by-example-ja/
- サンプルコードで学ぶ

### 🎥 動画教材（好みで）

**1. とほほの Rust 入門**

- https://www.youtube.com/playlist?list=PLU1yvJPt_8EvfwMsJXb2Y9k5sIDx1UZ6H
- 日本語・わかりやすい

**2. Let's Get Rusty**

- https://www.youtube.com/c/LetsGetRusty
- 英語・質が高い

---

## 📖 Week 1: Rust 基礎文法

### Day 1-2: 基本構文

#### 学ぶこと

- 変数と可変性
- データ型
- 関数

#### 実践コード

```rust
// 変数の宣言
let x = 5;          // 不変（変更不可）
let mut y = 10;     // 可変（変更可能）
y = 20;             // OK

// 型指定
let num: i32 = 42;           // 32bit整数
let text: String = String::from("hello");  // 文字列
let flag: bool = true;       // 真偽値

// 関数
fn add(a: i32, b: i32) -> i32 {
    a + b  // returnは不要（最後の式が戻り値）
}

fn main() {
    let result = add(5, 3);
    println!("結果: {}", result);  // 結果: 8
}
```

---

### Day 3-4: 制御フロー

#### 学ぶこと

- if 式
- loop, while, for
- match（パターンマッチング）

#### 実践コード

```rust
// if式（値を返せる）
let number = 6;
let description = if number % 2 == 0 {
    "偶数"
} else {
    "奇数"
};

// for ループ
for i in 0..5 {
    println!("{}", i);  // 0, 1, 2, 3, 4
}

// match（重要！）
let status = "published";
match status {
    "draft" => println!("下書き"),
    "published" => println!("公開済み"),
    _ => println!("その他"),  // デフォルト
}

// Option型とmatch
let maybe_number: Option<i32> = Some(5);
match maybe_number {
    Some(n) => println!("値: {}", n),
    None => println!("値なし"),
}
```

---

### Day 5-6: 構造体とメソッド

#### 学ぶこと

- struct（構造体）
- impl（メソッド実装）
- derive（自動実装）

#### 実践コード

```rust
// 構造体の定義
#[derive(Debug, Clone)]  // 自動実装
struct Post {
    id: i32,
    title: String,
    published: bool,
}

// メソッドの実装
impl Post {
    // 関連関数（new）
    fn new(id: i32, title: String) -> Self {
        Self {
            id,
            title,
            published: false,
        }
    }

    // メソッド（&selfが第一引数）
    fn publish(&mut self) {
        self.published = true;
    }

    // 参照を返すメソッド
    fn title(&self) -> &str {
        &self.title
    }
}

fn main() {
    let mut post = Post::new(1, "Hello".to_string());
    println!("{:?}", post);  // Debug出力

    post.publish();
    println!("公開済み: {}", post.published);
}
```

---

### Day 7: Option と Result

#### 学ぶこと

- Option<T>（値の有無）
- Result<T, E>（成功/失敗）
- ?演算子

#### 実践コード

```rust
// Option: 値があるかないか
fn find_post(id: i32) -> Option<String> {
    if id == 1 {
        Some("記事が見つかりました".to_string())
    } else {
        None
    }
}

// 使い方
match find_post(1) {
    Some(post) => println!("{}", post),
    None => println!("見つかりません"),
}

// Result: 成功か失敗か
fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err("0で割れません".to_string())
    } else {
        Ok(a / b)
    }
}

// 使い方
match divide(10, 2) {
    Ok(result) => println!("結果: {}", result),
    Err(e) => println!("エラー: {}", e),
}

// ?演算子（エラーを上に伝播）
fn calculate() -> Result<i32, String> {
    let result = divide(10, 2)?;  // エラーなら即リターン
    Ok(result + 5)
}
```

---

## 📖 Week 2: 所有権システム

### Day 8-10: 所有権（Ownership）

#### 学ぶこと

- 所有権のルール
- ムーブとコピー
- Clone

#### 実践コード

```rust
// 所有権のルール
// 1. 各値には「所有者」が1つだけ
// 2. 所有者がスコープを抜けると値は破棄

fn main() {
    // ムーブ（所有権の移動）
    let s1 = String::from("hello");
    let s2 = s1;  // s1の所有権がs2に移動
    // println!("{}", s1);  // エラー！s1は使えない
    println!("{}", s2);  // OK

    // Clone（明示的なコピー）
    let s3 = String::from("world");
    let s4 = s3.clone();  // s3をコピー
    println!("{}, {}", s3, s4);  // 両方OK

    // コピートレイト（自動コピー）
    let x = 5;
    let y = x;  // i32はCopyトレイト実装済み
    println!("{}, {}", x, y);  // 両方OK
}

// 関数に渡すと所有権が移動
fn take_ownership(s: String) {
    println!("{}", s);
}  // sがここでドロップ（破棄）

fn main2() {
    let text = String::from("hello");
    take_ownership(text);
    // println!("{}", text);  // エラー！textは使えない
}
```

---

### Day 11-12: 借用（Borrowing）

#### 学ぶこと

- 参照（&T）
- 可変参照（&mut T）
- 借用のルール

#### 実践コード

```rust
// 不変参照（読み取り専用）
fn calculate_length(s: &String) -> usize {
    s.len()  // 所有権は移動しない
}

fn main() {
    let text = String::from("hello");
    let len = calculate_length(&text);  // 借用
    println!("{} の長さ: {}", text, len);  // textは使える
}

// 可変参照（書き換え可能）
fn append_text(s: &mut String) {
    s.push_str(" world");
}

fn main2() {
    let mut text = String::from("hello");
    append_text(&mut text);
    println!("{}", text);  // hello world
}

// 借用のルール
fn main3() {
    let mut s = String::from("hello");

    // ルール1: 不変参照は複数OK
    let r1 = &s;
    let r2 = &s;
    println!("{} {}", r1, r2);

    // ルール2: 可変参照は1つだけ
    let r3 = &mut s;
    // let r4 = &mut s;  // エラー！
    r3.push_str(" world");

    // ルール3: 不変参照と可変参照は同時に存在できない
    let r5 = &s;
    // let r6 = &mut s;  // エラー！
    println!("{}", r5);
}
```

---

### Day 13-14: ライフタイム

#### 学ぶこと

- ライフタイムとは
- ライフタイム注釈
- 'static

#### 実践コード

```rust
// 基本的なライフタイム注釈
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

// 構造体のライフタイム
struct Post<'a> {
    title: &'a str,  // 参照を持つ
}

impl<'a> Post<'a> {
    fn new(title: &'a str) -> Self {
        Self { title }
    }
}

// 多くの場合、ライフタイムは自動推論される
fn first_word(s: &str) -> &str {
    // ライフタイム注釈不要！
    &s[..5]
}
```

---

## 📖 Week 3: 今回のコードを理解

### Day 15-17: Posts API コードを読む

#### ステップ 1: データ構造から理解

```rust
// src/domain/entities/post.rs
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Post {
    pub id: i32,
    pub title_ja: String,
    // ...
}
```

**理解すること:**

- `#[derive(...)]`の意味
- `pub`の意味
- `String` vs `&str`
- `Option<T>`の使い方

#### ステップ 2: Repository を理解

```rust
// src/repositories/post_repository.rs
pub async fn find_all_published(&self) -> Result<Vec<Post>> {
    let posts = sqlx::query_as::<_, Post>(...)
        .fetch_all(&self.pool)
        .await?;
    Ok(posts)
}
```

**理解すること:**

- `async fn`と`.await`
- `Result<T>`型
- `?`演算子
- `&self`の意味

#### ステップ 3: Handler を理解

```rust
// src/handlers/posts.rs
pub async fn list_posts(
    State(pool): State<PgPool>,
) -> Result<Json<PostListResponse>, impl IntoResponse> {
    // ...
}
```

**理解すること:**

- `State`エクストラクター
- `impl IntoResponse`
- `match`でのエラーハンドリング
- イテレータ（`.map()`, `.collect()`）

---

### Day 18-21: 小さな機能を追加

#### 練習 1: 記事詳細取得 API

```rust
// handlers/posts.rs に追加
pub async fn get_post_by_slug(
    State(pool): State<PgPool>,
    Path(slug): Path<String>,
) -> Result<Json<PostDetailResponse>, impl IntoResponse> {
    // あなたが実装！
}
```

#### 練習 2: カテゴリ一覧 API

```rust
pub async fn list_categories(
    State(pool): State<PgPool>,
) -> Result<Json<Vec<Category>>, impl IntoResponse> {
    // あなたが実装！
}
```

---

## 🎓 重要な概念マップ

### 今回のコードで使われている概念

```
基礎文法
├── 変数・型 ✅
├── 構造体 ✅
├── impl ✅
├── Option/Result ✅
└── match ✅

所有権システム
├── 所有権 ✅
├── 借用（&self） ✅
└── ライフタイム（一部）

非同期
├── async/await ✅
└── Future（深く理解不要）

トレイト
├── From ✅
├── Serialize/Deserialize ✅
└── IntoResponse ✅

マクロ
├── #[derive(...)] ✅
├── println! ✅
└── #[utoipa::path] ✅
```

---

## 📚 追加リソース

### 📖 おすすめ書籍

1. **「プログラミング Rust 第 2 版」** (オライリー)

   - 網羅的・詳しい
   - 中級者向け

2. **「実践 Rust 入門」** (技術評論社)
   - 日本語・実践的
   - 初心者〜中級者

### 🔗 便利なサイト

1. **Rust Playground**

   - https://play.rust-lang.org/
   - ブラウザで Rust を試せる

2. **Rust API Guidelines**
   - https://rust-lang.github.io/api-guidelines/
   - コードの書き方のベストプラクティス

---

## ✅ チェックリスト

### Week 1 完了基準

- [ ] 変数、関数が書ける
- [ ] if, match, for が使える
- [ ] 構造体とメソッドが定義できる
- [ ] Option/Result の基本が分かる

### Week 2 完了基準

- [ ] 所有権のルールが説明できる
- [ ] &T と&mut T の違いが分かる
- [ ] なぜ Clone が必要か分かる
- [ ] 基本的なライフタイムが理解できる

### Week 3 完了基準

- [ ] Posts API のコードが読める
- [ ] 各ファイルの役割が説明できる
- [ ] 簡単な機能追加ができる

---

## 💡 学習のコツ

1. **完璧を目指さない**

   - 70%理解で OK
   - 使いながら理解が深まる

2. **エラーメッセージを読む**

   - Rust のエラーは親切
   - 解決方法を教えてくれる

3. **小さいコードから**

   - main.rs で試す
   - Playground を使う

4. **コンパイラと仲良く**
   - エラーが出たら学びのチャンス
   - 段々慣れる

---

## 🎯 あなたの現状とゴール

### 現状

```
✅ 動くコードがある
✅ PostgreSQLが動いている
✅ APIが動いている
❓ コードの意味がわからない ← ここ！
```

### 2-3 週間後のゴール

```
✅ SQLが書ける
✅ Rustの基本文法が分かる
✅ Posts APIのコードが理解できる
✅ 簡単な機能追加ができる
```

---

## 📅 おすすめスケジュール

### 平日（1 時間/日）

- 20 分: 教材を読む
- 20 分: コードを書く
- 20 分: 復習・メモ

### 週末（2-3 時間/日）

- 実際のプロジェクトで実践
- 機能追加に挑戦
- わからないところを調べる

---

頑張ってください！🦀

**重要:** 焦らず、楽しみながら学びましょう！
わからないことがあったらいつでも聞いてください！
