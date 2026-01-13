"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";
const THEME_KEY = "ql_theme";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");

  // クライアント側でマウント後にlocalStorageから読み込み
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme("dark");
    }
  }, []);

  // テーマ変更の副作用
  useEffect(() => {
    if (mounted) {
      applyTheme(theme);
      localStorage.setItem(THEME_KEY, theme);
    }
  }, [theme, mounted]);

  // テーマをDOMに適用する関数
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    // 既存のテーマクラスを削除
    root.classList.remove("light", "dark");
    
    // 新しいテーマクラスを追加
    root.classList.add(newTheme);
    
    // data-theme属性も設定（互換性のため）
    root.setAttribute("data-theme", newTheme);
  };

  const toggle = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // マウント前は何も表示しない（Hydrationエラー回避）
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="テーマ切り替え"
        className="inline-flex items-center justify-center h-auto border border-border/20 cursor-pointer px-3 py-2 text-xs bg-background/80 backdrop-blur-sm text-foreground hover:bg-accent/50 hover:border-border/60 transition-all shadow-sm hover:shadow-md"
        disabled
      >
        <div className="w-3 h-3" />
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={`${theme === "dark" ? "ライト" : "ダーク"}モードに切り替え`}
      onClick={toggle}
      className="inline-flex items-center justify-center h-auto border border-border/20 cursor-pointer px-3 py-2 text-xs bg-background/80 backdrop-blur-sm text-foreground hover:bg-accent/50 hover:border-border/60 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
    >
      <div className="transition-transform duration-300 hover:rotate-12">
        {theme === "dark" ? (
          <Sun className="w-3 h-3 transition-all duration-300" aria-hidden />
        ) : (
          <Moon className="w-3 h-3 transition-all duration-300" aria-hidden />
        )}
      </div>
    </button>
  );
}
