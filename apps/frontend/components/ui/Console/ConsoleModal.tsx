"use client";

import * as React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
} from "@/components/ui/shadcn/dialog";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";

type ConsoleModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message?: string;
};

const ASCII_ART = [
  " _   _______ _   _ _____ ___   ______ _     _____ _____ ",
  "| | / /  _  | | | |_   _/ _ \\  | ___ \\ |   |  _  |  __ \\",
  "| |/ /| | | | |_| | | |/ /_\\ \\ | |_/ / |   | | | | |  \\/",
  "|    \\| | | |  _  | | ||  _  | | ___ \\ |   | | | | | __ ",
  "| |\\  \\ \\_/ / | | | | || | | | | |_/ / |___\\ \\_/ / |_\\ \\",
  "\\_| \\_/\\___/\\_| |_/ \\_/\\_| |_/ \\____/\\_____/\\___/ \\____/",
].join("\n");

const DEFAULT_MESSAGE = "New console features are currently under development.";

const HELP_ENTRIES = [
  { cmd: "help", desc: "Lists available commands" },
  { cmd: "close", desc: "Closes the terminal" },
  { cmd: "clear", desc: "Clears the terminal" },
];

export const ConsoleModal = ({
  open,
  onOpenChange,
  message = DEFAULT_MESSAGE,
}: ConsoleModalProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [terminalLines, setTerminalLines] = React.useState<string[]>([]);
  const [buffer, setBuffer] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setTerminalLines([]);
    setBuffer("");
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.focus({ preventScroll: true });
      }
    });
  }, [open]);

  const appendLines = React.useCallback((lines: string[]) => {
    setTerminalLines((prev) => [...prev, ...lines]);
  }, []);

  const handleEnter = React.useCallback(
    (rawInput: string) => {
      const trimmed = rawInput.trim();
      if (!trimmed) return;

      const collected: string[] = [`$ ${trimmed}`];
      const lowered = trimmed.toLowerCase();

      if (lowered === "help") {
        HELP_ENTRIES.forEach(({ cmd, desc }) => {
          const padded = cmd.padEnd(7, " ");
          collected.push(`${padded} : ${desc}`);
        });
      } else if (lowered === "clear") {
        setTerminalLines([]);
        setBuffer("");
        return;
      } else if (lowered === "close") {
        onOpenChange(false);
        return;
      } else if (lowered === "history") {
        if (terminalLines.length === 0) {
          collected.push("history : no commands run yet");
        } else {
          collected.push(...terminalLines);
        }
      } else {
        collected.push("このサービスは開発中です");
      }

      appendLines(collected);
    },
    [appendLines, onOpenChange, terminalLines]
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    handleEnter(event.currentTarget.value);
    event.currentTarget.value = "";
    setBuffer("");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBuffer(event.target.value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        transparentOverlay
        style={{
          left: "calc(100% - 22rem)",
          right: "auto",
          bottom: "auto",
          top: "calc(100% - 15rem)",
          transform: "none",
          margin: 0,
          maxWidth: "42rem",
        }}
        className={cn(
          "max-w-2xl grid gap-0 overflow-hidden rounded-none border border-[#8f8f8f] bg-black p-0 shadow-xl",
          "animate-none"
        )}
      >
        {/* ヘッダー */}
        <div
          className={cn(
            "flex h-8 cursor-default items-center justify-end border-b border-gray-200 bg-[#1c1c1c] px-3 select-none"
          )}
        >
          <DialogClose
            onClick={(e) => {
              e.stopPropagation();
              onOpenChange(false);
            }}
            className={cn(
              "flex h-3 w-3 items-center justify-center rounded cursor-pointer",
              "text-white transition-colors hover:text-gray-300"
            )}
          >
            <XIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>

        {/* コンテンツ */}
        <div
          className="relative min-h-[40vh] shrink-0 overflow-auto pb-10 pt-3 px-4 font-mono text-sm leading-none text-[#00FF00]"
          onClick={() => inputRef.current?.focus({ preventScroll: true })}
        >
          <input
            ref={inputRef}
            type="text"
            aria-hidden
            className="absolute h-0 w-0 opacity-0 pointer-events-none"
            value={buffer}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={() => inputRef.current?.focus({ preventScroll: true })}
          />
          <pre
            className="mt-0 mb-3 w-max whitespace-pre font-mono text-[10px] sm:text-xs tracking-[0.02em] leading-[1.15]"
            style={{
              background:
                "linear-gradient(90deg, #00FF88 0%, #00FFCC 25%, #FF00E5 65%, #FF1493 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
            }}
          >
            {ASCII_ART}
          </pre>
          <p className="font-mono text-[#00FF00]">
            -------------------------------------------------------------------------
          </p>
          <p className="mt-2">{message}</p>
          <p className="mb-2">
            Type &apos;help&apos; to see available commands.
          </p>
          <p className="font-mono text-[#00FF00]">
            --------------------------------------------------------------------------
          </p>
          {terminalLines.length > 0 && (
            <div className="mt-2 space-y-1">
              {terminalLines.map((line, index) => (
                <p key={`${line}-${index}`}>{line}</p>
              ))}
            </div>
          )}
          <p className="flex items-center gap-2 pt-2">
            <span>$</span>
            <span className="min-h-4 whitespace-pre">{buffer}</span>
            <span
              className="inline-block h-4 w-2 bg-[#00FF00] animate-[cursor-blink_1s_step-end_infinite]"
              aria-hidden
            />
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
