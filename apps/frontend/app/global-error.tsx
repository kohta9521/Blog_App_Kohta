"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);
  return (
    <html lang="ja">
      <body className="min-h-screen bg-(--main-dark) text-white">
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-slate-900 via-(--main-dark) to-slate-950 px-6 py-16">
          <div
            aria-hidden="true"
            className="absolute -top-24 -left-20 h-[320px] w-[320px] rounded-full bg-(--querylift-color-brand-bold)/30 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-32 -right-16 h-[360px] w-[360px] rounded-full bg-sky-500/30 blur-3xl"
          />
          <div className="relative z-10 w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-[0_35px_120px_-40px_rgba(56,189,248,0.35)] backdrop-blur-md">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
              <span aria-hidden>⚠️</span>
              Error
            </span>
            <h1 className="mt-6 text-3xl font-semibold leading-tight text-white lg:text-4xl">
              あっ、うまくいきませんでした
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/70 lg:text-base">
              予期せぬエラーが発生しました。ページを再読み込みするか、トップページに戻って再度お試しください。
            </p>
            <div className="mt-10 flex flex-col gap-3 md:flex-row md:justify-center">
              <button
                onClick={() => reset()}
                className="inline-flex items-center justify-center rounded-full bg-(--querylift-color-brand-bold) px-6 py-3 text-sm font-semibold tracking-wider text-white transition-all duration-200 hover:bg-(--querylift-color-brand-hover) hover:shadow-lg hover:shadow-(--querylift-color-brand-bold)/40"
              >
                もう一度試す
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold tracking-wider text-white/80 transition-all duration-200 hover:border-white/40 hover:bg-white/10 hover:text-white"
              >
                トップに戻る
              </Link>
            </div>
            <div className="mt-10 flex items-center justify-center gap-3 text-xs text-white/40">
              <span className="h-px w-8 bg-white/10" aria-hidden />
              <span>エラーコード: {error.digest ?? "不明"}</span>
              <span className="h-px w-8 bg-white/10" aria-hidden />
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
