"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { LanguageSwitcher } from "@/components/ui/Switcher/LanguageSwitcher";

export type MobileMenuProps = {
  /** メニューの開閉状態 */
  isOpen: boolean;
  /** 現在のロケール */
  lang: Locale;
  /** 現在のパス */
  pathname: string;
  /** 辞書データ */
  dict: Dictionary;
  /** メニューを閉じるコールバック */
  onClose: () => void;
  /** コンソールを開くコールバック */
  onOpenConsole: () => void;
};

/**
 * モバイル用スライドメニュー
 *
 * 機能:
 * - 右からスライドインするアニメーション
 * - 背景オーバーレイ
 * - リンククリック時に自動で閉じる
 * - スムーズなフェードイン/アウト
 */
export const MobileMenu = ({
  isOpen,
  lang,
  pathname,
  dict,
  onClose,
  onOpenConsole,
}: MobileMenuProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const menu = menuRef.current;
    const items = itemsRef.current;

    if (!overlay || !menu || !items) return;

    const menuItems = items.querySelectorAll(".menu-item");

    if (isOpen) {
      // 開くアニメーション
      gsap.set(overlay, { display: "block" });
      gsap.set(menu, { x: "100%" });

      const timeline = gsap.timeline();

      timeline
        .to(overlay, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        })
        .to(
          menu,
          {
            x: "0%",
            duration: 0.4,
            ease: "power3.out",
          },
          "-=0.2"
        )
        .fromTo(
          menuItems,
          {
            opacity: 0,
            x: 30,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.out",
          },
          "-=0.2"
        );

      // bodyのスクロールを無効化
      document.body.style.overflow = "hidden";
    } else {
      // 閉じるアニメーション
      const timeline = gsap.timeline({
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
        },
      });

      timeline
        .to(menuItems, {
          opacity: 0,
          x: 30,
          duration: 0.2,
          stagger: 0.03,
          ease: "power2.in",
        })
        .to(
          menu,
          {
            x: "100%",
            duration: 0.3,
            ease: "power3.in",
          },
          "-=0.1"
        )
        .to(
          overlay,
          {
            opacity: 0,
            duration: 0.2,
            ease: "power2.in",
          },
          "-=0.2"
        );

      // bodyのスクロールを有効化
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    onClose();
  };

  const handleConsoleClick = () => {
    onClose();
    // メニューが閉じた後にコンソールを開く
    setTimeout(() => {
      onOpenConsole();
    }, 400);
  };

  const menuItems = [
    {
      href: `/${lang}`,
      text: dict.common.home,
      active: pathname === `/${lang}`,
    },
    {
      href: `/${lang}/book`,
      text: "BOOKS",
      active: pathname.startsWith(`/${lang}/book`),
    },
    {
      href: `/${lang}/about`,
      text: dict.common.about,
      active: pathname === `/${lang}/about`,
    },
    {
      href: `/${lang}/profile`,
      text: dict.common.profile,
      active: pathname === `/${lang}/profile`,
    },
    {
      href: `/${lang}/contact`,
      text: dict.common.contact,
      active: pathname === `/${lang}/contact`,
    },
  ];

  const consoleText = dict.common.console ?? "CONSOLE";
  const consoleFirstLetter = consoleText[0]?.toUpperCase() ?? "C";

  return (
    <>
      {/* オーバーレイ */}
      <div
        ref={overlayRef}
        id="mobile-menu"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] opacity-0 hidden"
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* メニュー本体 */}
      <nav
        ref={menuRef}
        className="fixed top-0 right-0 h-full w-[280px] bg-black backdrop-blur-md border-l border-border z-9999 shadow-2xl"
        style={{ transform: "translateX(100%)" }}
        aria-label="モバイルナビゲーション"
      >
        <div ref={itemsRef} className="flex flex-col h-full p-6">
          {/* ヘッダー */}
          <div className="menu-item flex items-center justify-between mb-8">
            <h2 className="text-lg font-semibold text-foreground">Menu</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-secondary/50 transition-colors"
              aria-label="メニューを閉じる"
            >
              <span className="text-2xl text-muted-foreground">×</span>
            </button>
          </div>

          {/* メニューアイテム */}
          <div className="flex-1 space-y-1 bg-black">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={`menu-item block px-4 py-3 rounded-sm text-sm font-medium transition-all duration-200 ${
                  item.active
                    ? "bg-primary/10 text-primary border-l-2 border-primary"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                {item.text}
              </Link>
            ))}

            {/* コンソールボタン */}
            <button
              onClick={handleConsoleClick}
              className="menu-item w-full px-4 py-3 text-left rounded-sm text-sm font-doto text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all duration-200"
            >
              <span className="mr-2">[{consoleFirstLetter}]</span>
              {consoleText}
            </button>
          </div>

          {/* フッター */}
          <div className="menu-item space-y-4 pt-6 border-t border-border">
            {/* 言語切り替え */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground font-medium">
                Language
              </span>
              <div className="flex items-center justify-start">
                <LanguageSwitcher currentLocale={lang} />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
