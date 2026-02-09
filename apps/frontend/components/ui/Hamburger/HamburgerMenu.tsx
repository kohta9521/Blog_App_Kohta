"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export type HamburgerMenuProps = {
  /** ハンバーガーメニューの開閉状態 */
  isOpen: boolean;
  /** クリック時のコールバック */
  onClick: () => void;
  /** カスタムクラス名 */
  className?: string;
  /** テスト用のID */
  id?: string;
  /** アクセシビリティラベル */
  ariaLabel?: string;
};

/**
 * GSAPアニメーション付きハンバーガーメニュー
 * 
 * 機能:
 * - 3本線 → X字への滑らかな変形アニメーション
 * - ホバー時のインタラクティブな動き
 * - アクセシビリティ対応（ARIA属性、キーボード操作）
 * 
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * <HamburgerMenu 
 *   isOpen={isOpen} 
 *   onClick={() => setIsOpen(!isOpen)}
 * />
 * ```
 */
export const HamburgerMenu = ({
  isOpen,
  onClick,
  className = "",
  id = "hamburger-menu",
  ariaLabel = "メニュー",
}: HamburgerMenuProps) => {
  const topLineRef = useRef<HTMLSpanElement>(null);
  const middleLineRef = useRef<HTMLSpanElement>(null);
  const bottomLineRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLButtonElement>(null);

  // 開閉アニメーション
  useEffect(() => {
    const topLine = topLineRef.current;
    const middleLine = middleLineRef.current;
    const bottomLine = bottomLineRef.current;

    if (!topLine || !middleLine || !bottomLine) return;

    const timeline = gsap.timeline({
      defaults: {
        duration: 0.4,
        ease: "power2.inOut",
      },
    });

    if (isOpen) {
      // 開く: 3本線 → X字
      timeline
        .to(
          topLine,
          {
            y: 8,
            rotation: 45,
            transformOrigin: "center center",
          },
          0
        )
        .to(
          middleLine,
          {
            opacity: 0,
            scaleX: 0,
          },
          0
        )
        .to(
          bottomLine,
          {
            y: -8,
            rotation: -45,
            transformOrigin: "center center",
          },
          0
        );
    } else {
      // 閉じる: X字 → 3本線
      timeline
        .to(
          topLine,
          {
            y: 0,
            rotation: 0,
          },
          0
        )
        .to(
          middleLine,
          {
            opacity: 1,
            scaleX: 1,
          },
          0
        )
        .to(
          bottomLine,
          {
            y: 0,
            rotation: 0,
          },
          0
        );
    }

    return () => {
      timeline.kill();
    };
  }, [isOpen]);

  // ホバーアニメーション
  const handleMouseEnter = () => {
    if (isOpen) return;

    gsap.to([topLineRef.current, bottomLineRef.current], {
      scaleX: 0.85,
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(middleLineRef.current, {
      scaleX: 1.1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (isOpen) return;

    gsap.to([topLineRef.current, middleLineRef.current, bottomLineRef.current], {
      scaleX: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  // クリック時の弾むアニメーション
  const handleClick = () => {
    gsap.to(containerRef.current, {
      scale: 0.9,
      duration: 0.1,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
    });
    onClick();
  };

  return (
    <button
      ref={containerRef}
      id={id}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative w-10 h-10 flex flex-col items-center justify-center gap-[6px] bg-background border border-border rounded-sm hover:bg-secondary/30 transition-colors duration-300 cursor-pointer group z-50 ${className}`}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
      type="button"
    >
      {/* Top Line */}
      <span
        ref={topLineRef}
        className="block w-6 h-0.5 bg-foreground rounded-full transition-colors duration-300 group-hover:bg-primary"
        aria-hidden="true"
      />
      
      {/* Middle Line */}
      <span
        ref={middleLineRef}
        className="block w-6 h-0.5 bg-foreground rounded-full transition-colors duration-300 group-hover:bg-primary"
        aria-hidden="true"
      />
      
      {/* Bottom Line */}
      <span
        ref={bottomLineRef}
        className="block w-6 h-0.5 bg-foreground rounded-full transition-colors duration-300 group-hover:bg-primary"
        aria-hidden="true"
      />
      
      {/* Screen reader text */}
      <span className="sr-only">
        {isOpen ? "メニューを閉じる" : "メニューを開く"}
      </span>
    </button>
  );
};
