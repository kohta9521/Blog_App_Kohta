/**
 * グローバルローディング画面
 * - 黒背景 + 中央配置
 * - WebMアニメーション動画を表示
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-6">
        {/* アニメーション動画 */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56"
        >
          <source src="/videos/loading-animation.webm" type="video/webm" />
        </video>

        {/* ローディングテキスト */}
        <div className="flex items-center gap-2">
          <p className="text-sm font-mono text-neutral-400 tracking-wider">
            LOADING
          </p>
          <div className="flex gap-1">
            <span className="animate-bounce delay-0 text-neutral-400">.</span>
            <span className="animate-bounce delay-100 text-neutral-400">.</span>
            <span className="animate-bounce delay-200 text-neutral-400">.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
