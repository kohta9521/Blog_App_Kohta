"use client";

import * as React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";

type ConsoleModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// 画像風のASCIIアート "Kohta Tech Blog"
const ASCII_ART = `
   _  __       _   _    _____       ____  _     
  | |/ / ___  | | | |  |_   _|__   | __ )| |    
  | ' < / _ \\ | |_| |    | |/ _ \\  |  _ \| |    
  | . \\ (_) ||  _  |    | | (_) | | |_) | |___ 
  |_|\\_\\\\___/ |_| |_|    |_|\\___/  |____/|_____|
  
  _____ _     _    ____            _     
 |_   _| |__ | |__| __ )  ___   __| | ___ 
   | | | '_ \\| '__|  _ \\ / _ \\ / _\` |/ _ \\
   | | | | | | |  | |_) | (_) | (_| |  __/
   |_| |_| |_|_|  |____/ \\___/ \\__,_|\\___|
`;

export const ConsoleModal = ({ open, onOpenChange }: ConsoleModalProps) => {
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStartRef = React.useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });

  React.useEffect(() => {
    if (open) setDragOffset({ x: 0, y: 0 });
  }, [open]);

  React.useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      setDragOffset({
        x: dragStartRef.current.offsetX + e.clientX - dragStartRef.current.x,
        y: dragStartRef.current.offsetY + e.clientY - dragStartRef.current.y,
      });
    };
    const onUp = () => {
      setIsDragging(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  const handleDragStart = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("[data-slot='dialog-close']"))
      return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      offsetX: dragOffset.x,
      offsetY: dragOffset.y,
    };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        transparentOverlay
        style={{
          left: `calc(50% + ${dragOffset.x}px)`,
          top: `calc(50% + ${dragOffset.y}px)`,
          transform: "translate(-50%, -50%)",
          margin: 0,
          maxWidth: "42rem",
        }}
        className={cn(
          "max-w-2xl overflow-hidden rounded-lg border border-gray-300 bg-[#0d0d0d] p-0 shadow-xl",
          "animate-none"
        )}
      >
        {/* ヘッダー - 2アイコン (solid square + dashed square) */}
        <div
          role="button"
          tabIndex={0}
          onMouseDown={handleDragStart}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") e.currentTarget.click();
          }}
          title="ドラッグしてウィンドウを移動"
          className={cn(
            "flex cursor-grab items-center justify-between border-b border-gray-200 bg-[#ececec] px-3 py-2.5 select-none",
            "hover:bg-[#e8e8e8] active:cursor-grabbing",
            isDragging && "cursor-grabbing"
          )}
        >
          <div className="flex items-center gap-2">
            {/* 2つのアイコン: solid square + dashed square */}
            <div className="flex items-center gap-1">
              {/* 塗りつぶしの四角（最小化風） */}
              <div className="h-3.5 w-3.5 rounded-sm border border-gray-500 bg-gray-500" />
              {/* 点線の四角（最大化風） */}
              <svg
                className="h-3.5 w-3.5 text-gray-600"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="1.5 1.5"
              >
                <rect x="1" y="1" width="12" height="12" rx="0.5" />
              </svg>
            </div>
            <DialogTitle className="text-sm font-medium tracking-wide text-gray-900">
              CONSOLE
            </DialogTitle>
          </div>
          {/* Close X button */}
          <DialogClose
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded",
              "text-gray-600 transition-colors hover:bg-gray-300 hover:text-gray-900"
            )}
          >
            <XIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>

        {/* コンテンツ - ASCIIアート + プロンプト */}
        <div className="max-h-[65vh] overflow-auto p-4 font-mono text-sm">
          <pre className="whitespace-pre-wrap text-white">{ASCII_ART}</pre>
          <p className="mb-3 text-white">
            Type &apos;help&apos; to see available commands.
          </p>
          <p className="mb-3 font-mono text-gray-500">
            -------------------------------------
          </p>
          <p className="mb-3 font-mono text-gray-500">
            -------------------------------------
          </p>
          <p className="pt-2">
            <span className="text-amber-300">$</span>
            <span
              className="ml-1 inline-block h-4 w-2 animate-pulse bg-emerald-400"
              style={{ animationDuration: "1s" }}
            />
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
