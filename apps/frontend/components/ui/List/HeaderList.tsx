import React from "react";

// next
import Link from "next/link";

// lib
import { cn } from "@/lib/utils";

// props
export type HeaderListProps = {
  id: string;
  href: string;
  text: string;
  isActive?: boolean;
};

export const HeaderList = ({
  id,
  href,
  text,
  isActive = false,
}: HeaderListProps) => {
  const firstLetter = text?.[0]?.toUpperCase() || "";
  return (
    <Link
      id={id}
      key={id}
      href={href}
      className={cn(
        "block group border border-border px-2 py-0.5 transition-all duration-300",
        isActive ? "bg-white" : "bg-white/10 hover:bg-pink-500"
      )}
    >
      <p
        className={cn(
          "text-[10px] font-mono font-normal uppercase tracking-wider transition-colors duration-300",
          isActive
            ? "text-black font-semibold"
            : "text-white group-hover:text-foreground"
        )}
      >
        <span className="mr-1 text-[9px]">[{firstLetter}]</span>
        {text}
      </p>
    </Link>
  );
};
