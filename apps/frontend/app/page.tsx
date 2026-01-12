export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Hello World!</h1>
      <p>This is a test</p>
      <p>
        Next.jsでJestを設定する方法 最終更新日：2025年5月7日
        JestとReactテストライブラリは、ユニットテストやスナップショットテストで頻繁に併用されます。このガイドでは、Next.jsでJestをセットアップし、最初のテストを作成する方法を説明します。
        知っておくと良いこと：asyncサーバーコンポーネントはReactエコシステムにとって新しいため、Jestは現在サポートしていません。同期サーバーコンポーネントとクライアントコンポーネントのユニットテストは引き続き実行できますが、コンポーネントにはE2Eテストを使用することをお勧めしますasync。
        クイックスタート
        create-next-appNext.jsのwith-jestで使用できますすぐに始めるための例:
        ターミナル
      </p>
      <button>Click</button>
    </div>
  );
}
