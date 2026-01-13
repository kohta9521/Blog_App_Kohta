import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] bg-background text-foreground">
      <main className="flex min-h-[60vh] items-center justify-center px-6 py-12">
        <section className="w-full max-w-3xl border border-foreground/20 bg-background/80 px-10 py-12 shadow-[0_18px_70px_-50px_rgba(15,23,42,0.9)]">
          <div className="flex flex-col gap-6">
            <span className="font-mono text-xs uppercase tracking-[0.4em] text-foreground/60">
              system / not-found
            </span>
            <h1 className="font-mono text-3xl font-semibold leading-snug lg:text-[42px]">
              ❓ 404 — ページが見つかりません
            </h1>
            <p className="font-mono text-sm leading-relaxed text-foreground/70 lg:text-base">
              お探しのページは存在しないか、移動または削除された可能性があります。
              <br />
              URLをご確認いただくか、ホームページからお探しください。
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center border border-foreground/40 px-6 font-mono text-xs uppercase tracking-[0.35em] text-foreground transition-colors hover:border-blue-500 hover:bg-blue-500 hover:text-white"
              >
                ホームに戻る
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center border border-foreground/20 px-6 font-mono text-xs uppercase tracking-[0.35em] text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
              >
                お問い合わせ
              </Link>
            </div>
          </div>
          <footer className="mt-12 border-t border-dashed border-foreground/15 pt-6">
            <div className="flex flex-wrap items-center gap-6 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/50">
              <span>ステータス: 404</span>
              <span className="hidden min-w-[12px] border border-foreground/15 sm:block" />
              <span>タイムスタンプ: {new Date().toLocaleString("ja-JP")}</span>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
