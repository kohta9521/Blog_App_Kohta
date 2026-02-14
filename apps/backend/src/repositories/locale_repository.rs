use sqlx::PgPool;
use crate::entities::Locale;

pub struct LocaleRepository {
    pool: PgPool,
}

impl LocaleRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
    
    // --------------------------------------------------------
    // find_all: 全ての言語を取得
    // --------------------------------------------------------
    //
    // 💡 async:
    // - 非同期関数であることを示す
    // - データベースアクセスは時間がかかるので非同期にする
    // - 他のリクエストをブロックしない
    //
    // 💡 &self:
    // - 自分自身（LocaleRepository）への参照
    // - 所有権は移動しない（借用）
    //
    // 💡 戻り値:
    // - Result<Vec<Locale>, sqlx::Error>
    // - 成功時: Ok(Vec<Locale>) - Localeの配列
    // - 失敗時: Err(sqlx::Error) - SQLxのエラー
    //
    // 💡 使用例:
    //   let locales = repo.find_all().await?;
    //   for locale in locales {
    //       println!("{}", locale.name);
    //   }
    pub async fn find_all(&self) -> Result<Vec<Locale>, sqlx::Error> {
        // ------------------------------------------------
        // sqlx::query_as! マクロ
        // ------------------------------------------------
        //
        // 💡 query_as!の特徴:
        // 1. コンパイル時にSQLをチェック（タイポを防ぐ）
        // 2. 型安全（Locale構造体に自動変換）
        // 3. マクロなので、コンパイル時に展開される
        //
        // 💡 構文:
        // sqlx::query_as!(
        //     変換先の型,
        //     "SQL文"
        // )
        //
        // 💡 このクエリの意味:
        // - SELECT * FROM locales : localesテーブルの全カラムを取得
        // - ORDER BY locale_id ASC : locale_idの昇順でソート（1, 2, 3, ...）
        
        let locales = sqlx::query_as::<_, Locale>(
            "SELECT * FROM locales ORDER BY locale_id ASC"
        )
        .fetch_all(&self.pool)  // 全行取得
        .await?;  // 非同期処理の完了を待つ、エラーなら即return
        
        // ------------------------------------------------
        // .fetch_all(&self.pool)
        // ------------------------------------------------
        //
        // 💡 fetch_all:
        // - クエリを実行して全ての行を取得
        // - Vec<Locale>を返す
        //
        // 💡 &self.pool:
        // - LocaleRepositoryが持つデータベース接続プールへの参照
        //
        // ------------------------------------------------
        // .await?
        // ------------------------------------------------
        //
        // 💡 await:
        // - 非同期処理の完了を待つ
        // - 待っている間、他の処理を実行できる
        //
        // 💡 ?演算子:
        // - Result型のエラーハンドリングを簡潔に書ける
        // - Err(e)の場合、即座にreturn Err(e)
        // - Ok(value)の場合、valueを取り出す
        //
        // 💡 ?なしだと:
        // let result = sqlx::query_as!(...).fetch_all(&self.pool).await;
        // let locales = match result {
        //     Ok(data) => data,
        //     Err(e) => return Err(e),
        // };
        
        Ok(locales)
        // Ok()で包んで返す（Result型の成功値）
    }
    
    // --------------------------------------------------------
    // find_by_code: 言語コードで1つ取得
    // --------------------------------------------------------
    //
    // 💡 引数:
    //   code: &str - 言語コード（"ja", "en" など）
    //   &str = 文字列スライス（借用、所有権なし）
    //
    // 💡 戻り値:
    //   Result<Option<Locale>, sqlx::Error>
    //   - 成功時: Ok(Some(locale)) - 見つかった
    //           Ok(None) - 見つからなかった
    //   - 失敗時: Err(sqlx::Error) - データベースエラー
    //
    // 💡 使用例:
    //   match repo.find_by_code("ja").await? {
    //       Some(locale) => println!("Found: {}", locale.name),
    //       None => println!("Not found"),
    //   }
    pub async fn find_by_code(&self, code: &str) -> Result<Option<Locale>, sqlx::Error> {
        // ------------------------------------------------
        // SQLのプレースホルダー: $1, $2, ...
        // ------------------------------------------------
        //
        // 💡 $1の意味:
        // - 1番目のパラメータ（引数）を埋め込む場所
        // - SQLインジェクション対策（安全）
        // - 値は自動的にエスケープされる
        //
        // 💡 なぜ安全?
        // ❌ 危険な方法（文字列結合）:
        //    let sql = format!("SELECT * FROM locales WHERE code = '{}'", code);
        //    → code = "ja'; DROP TABLE locales; --" のような攻撃に弱い
        //
        // ✅ 安全な方法（プレースホルダー）:
        //    "SELECT * FROM locales WHERE code = $1", code
        //    → 値は適切にエスケープされる
        
        let locale = sqlx::query_as::<_, Locale>(
            "SELECT * FROM locales WHERE code = $1"
        )
        .bind(code)  // $1に代入される
        .fetch_optional(&self.pool)  // 0または1行取得
        .await?;
        
        // ------------------------------------------------
        // .fetch_optional()
        // ------------------------------------------------
        //
        // 💡 fetch_optionalの特徴:
        // - 0または1行を取得する
        // - 見つからない場合: Ok(None)
        // - 見つかった場合: Ok(Some(locale))
        // - エラーの場合: Err(sqlx::Error)
        //
        // 💡 他のfetchメソッド:
        // - fetch_one() : 必ず1行取得（0行ならエラー）
        // - fetch_all() : 全行取得
        // - fetch() : ストリームで1行ずつ取得
        
        Ok(locale)
    }
    
    // --------------------------------------------------------
    // find_active: 有効な言語のみ取得
    // --------------------------------------------------------
    //
    // 💡 用途:
    // - ユーザーが選択できる言語の一覧を表示
    // - 無効化された言語を除外
    pub async fn find_active(&self) -> Result<Vec<Locale>, sqlx::Error> {
        let locales = sqlx::query_as::<_, Locale>(
            "SELECT * FROM locales WHERE is_active = TRUE ORDER BY locale_id ASC"
        )
        .fetch_all(&self.pool)
        .await?;
        
        Ok(locales)
    }
    
    // --------------------------------------------------------
    // find_default: デフォルト言語を取得
    // --------------------------------------------------------
    //
    // 💡 用途:
    // - ユーザーが言語を指定しない場合に使用
    // - 通常1つだけis_default=trueのレコードが存在
    pub async fn find_default(&self) -> Result<Option<Locale>, sqlx::Error> {
        let locale = sqlx::query_as::<_, Locale>(
            "SELECT * FROM locales WHERE is_default = TRUE"
        )
        .fetch_optional(&self.pool)
        .await?;
        
        Ok(locale)
    }
    
    // --------------------------------------------------------
    // count: 言語の総数を取得
    // --------------------------------------------------------
    //
    // 💡 COUNT(*)とは?
    // - SQLの集計関数
    // - テーブルの行数を数える
    //
    // 💡 戻り値:
    //   Result<i64, sqlx::Error>
    //   - i64 = 64ビット整数（COUNT()の結果はBIGINT）
    //
    // 💡 使用例:
    //   let total = repo.count().await?;
    //   println!("Total locales: {}", total);
    pub async fn count(&self) -> Result<i64, sqlx::Error> {
        // ------------------------------------------------
        // COUNT(*)の結果を取得
        // ------------------------------------------------
        //
        // 💡 query!とquery_as!の違い:
        // - query! : 匿名の構造体を返す（カラム名でアクセス）
        // - query_as! : 指定した型に変換
        //
        // 💡 Option<i64>の理由:
        // - COUNT(*)は必ず値を返すが、SQLxはNULL可能性を考慮
        // - unwrap_or(0)でNoneの場合は0にする
        
        let result: (i64,) = sqlx::query_as(
            "SELECT COUNT(*) FROM locales"
        )
        .fetch_one(&self.pool)  // 1行だけ取得（COUNT()は必ず1行）
        .await?;
        
        Ok(result.0)
        // result.0 は i64 のカウント値
    }
}

// ============================================
// 💡 Rust用語解説
// ============================================
//
// async fn
//   → 非同期関数
//   → Future<Output = T> を返す
//   → .await で完了を待つ
//
// Result<T, E>
//   → 成功（Ok(T)）またはエラー（Err(E)）を表す列挙型
//   → エラーハンドリングの標準的な方法
//
// Option<T>
//   → 値がある（Some(T)）またはない（None）を表す列挙型
//   → NULLの代わりに使う
//
// Vec<T>
//   → 可変長配列（動的配列）
//   → 要素の追加・削除が可能
//
// &self
//   → 自分自身への不変参照（借用）
//   → selfの内容は変更できない
//
// &str
//   → 文字列スライス（借用）
//   → 所有権を持たない
//
// .await
//   → 非同期処理の完了を待つ
//   → その間、他の処理を実行できる
//
// ?演算子
//   → Result型のエラーを即座に伝播
//   → Err(e) なら return Err(e)
//   → Ok(v) なら v を取り出す
//
// ============================================
// 💡 SQLx用語解説
// ============================================
//
// sqlx::query_as!
//   → 型安全なクエリマクロ
//   → コンパイル時にSQLをチェック
//   → 結果を指定した型に変換
//
// .fetch_all()
//   → 全行を取得（Vec<T>）
//
// .fetch_one()
//   → 1行だけ取得（0行ならエラー）
//
// .fetch_optional()
//   → 0または1行を取得（Option<T>）
//
// $1, $2, ...
//   → プレースホルダー（パラメータ）
//   → SQLインジェクション対策
//
// ============================================
// 💡 次のステップ
// ============================================
// 1. このRepositoryを使ってHandlerを作る
// 2. APIエンドポイントを実装
// 3. 動作確認
