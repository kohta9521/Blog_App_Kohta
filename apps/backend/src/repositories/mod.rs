// ============================================
// Repositories Module（リポジトリモジュール）
// ============================================
//
// 💡 リポジトリとは?
// - データベースアクセスのロジックを集約する層
// - データの取得、作成、更新、削除（CRUD）を担当
//
// 💡 なぜリポジトリパターンを使う?
// 1. 責任の分離: データベースアクセスロジックを1箇所に集める
// 2. テストしやすい: Repositoryをモックに差し替えてテスト可能
// 3. 変更に強い: データベースを変えてもRepository層だけ修正すればOK
// 4. 再利用性: 複数のHandlerから同じRepositoryを使える
//
// 💡 レイヤー構成:
// Handler（HTTPリクエスト処理）
//   ↓
// Repository（データベースアクセス）
//   ↓
// Database（PostgreSQL）

// locale_repositoryモジュールを公開
pub mod locale_repository;

// LocaleRepositoryを再エクスポート
pub use locale_repository::LocaleRepository;

// ============================================
// 💡 将来の拡張例
// ============================================
// 他のテーブル用のRepositoryも同様に追加していく:
//
// pub mod topic_repository;
// pub use topic_repository::TopicRepository;
//
// pub mod post_repository;
// pub use post_repository::PostRepository;
