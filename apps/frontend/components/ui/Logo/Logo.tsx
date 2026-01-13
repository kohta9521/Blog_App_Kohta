import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type LogoProps = {
  id?: string;
  type?: "default" | "icon" | "text" | "minimal";
  linkBool?: boolean;
  linkHref?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  animated?: boolean;
  theme?: "light" | "dark" | "gradient" | "auto";
};

const sizeVariants = {
  xs: {
    container: "h-6",
    icon: { width: 20, height: 20 },
    text: "text-sm font-semibold",
  },
  sm: {
    container: "h-8",
    icon: { width: 24, height: 24 },
    text: "text-base font-semibold",
  },
  md: {
    container: "h-10",
    icon: { width: 32, height: 32 },
    text: "text-lg font-semibold",
  },
  lg: {
    container: "h-12",
    icon: { width: 40, height: 40 },
    text: "text-xl font-semibold",
  },
  xl: {
    container: "h-16",
    icon: { width: 48, height: 48 },
    text: "text-2xl font-semibold",
  },
};

const themeVariants = {
  light: "text-foreground hover:text-foreground/80",
  dark: "text-foreground hover:text-foreground/80",
  gradient: "text-foreground hover:text-foreground/80",
  auto: "text-foreground hover:text-foreground/80", // 自動テーマ対応
};

export const Logo = ({
  id = "logo",
  type = "default",
  linkBool = true,
  linkHref = "/",
  size = "md",
  className = "",
  animated = true,
  theme = "auto",
}: LogoProps) => {
  const sizeConfig = sizeVariants[size];
  const themeClass = themeVariants[theme];

  const logoContent = () => {
    switch (type) {
      case "icon":
        return (
          <Image
            src="/logo_icon.png"
            alt="Kohta Tech Blog"
            width={sizeConfig.icon.width}
            height={sizeConfig.icon.height}
            className={cn(
              "object-contain",
              animated && "transition-transform duration-300 hover:scale-105"
            )}
            priority
          />
        );

      case "text":
        return (
          <div
            className={cn(
              "font-mono font-medium tracking-tight",
              sizeConfig.text,
              themeClass,
              animated && "transition-all duration-300 hover:tracking-wide"
            )}
          >
            <span className="relative">
              Kohta Tech Blog
              {animated && (
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full" />
              )}
            </span>
          </div>
        );

      case "minimal":
        return (
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full bg-linear-to-r from-blue-500 to-purple-500",
                animated && "animate-pulse"
              )}
            />
            <span className={cn("font-mono text-sm font-medium", themeClass)}>
              KTB
            </span>
          </div>
        );

      default: // "default"
        return (
          <div className="flex items-center gap-3 group">
            <Image
              src="/logo_icon.png"
              alt="Kohta Tech Blog"
              width={sizeConfig.icon.width}
              height={sizeConfig.icon.height}
              className={cn(
                "object-contain",
                animated &&
                  "transition-transform duration-300 group-hover:scale-105"
              )}
              priority
            />
            <span
              className={cn(
                "font-semibold leading-tight ",
                sizeConfig.text,
                themeClass,
                animated && "transition-all duration-300"
              )}
            >
              Kohta Tech Blog
            </span>
          </div>
        );
    }
  };

  const containerClasses = cn(
    "inline-flex items-center justify-center",
    animated && "transition-all duration-300 hover:scale-[1.02]",
    className
  );

  if (linkBool) {
    return (
      <Link
        href={linkHref}
        id={id}
        className={cn(
          containerClasses,
          "group focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-background rounded-lg"
        )}
      >
        {logoContent()}
      </Link>
    );
  }

  return (
    <div id={id} className={containerClasses}>
      {logoContent()}
    </div>
  );
};
