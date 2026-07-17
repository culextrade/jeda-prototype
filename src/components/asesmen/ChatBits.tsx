"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { PauseMark } from "@/components/shell/Logo";

export interface Msg {
  id: string;
  who: "bot" | "user";
  text: string;
  small?: boolean; // catatan kecil (mis. label simulasi)
}

export function BotAvatar() {
  return (
    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pine-tint">
      <PauseMark className="h-3 w-2.5" />
    </span>
  );
}

export function ChatBubble({ msg }: { msg: Msg }) {
  if (msg.who === "bot") {
    return (
      <div className="bubble-in flex items-start gap-2.5 pr-8">
        <BotAvatar />
        <div
          className={cn(
            "rounded-[18px] rounded-tl-md bg-surface px-4 py-3 shadow-card",
            msg.small
              ? "text-[11.5px] text-ink-faint"
              : "text-[14px] leading-relaxed text-ink"
          )}
        >
          {msg.text}
        </div>
      </div>
    );
  }
  return (
    <div className="bubble-in flex justify-end pl-10">
      <div className="rounded-[18px] rounded-tr-md bg-pine px-4 py-3 text-[14px] leading-relaxed text-white">
        {msg.text}
      </div>
    </div>
  );
}

export function TypingBubble() {
  return (
    <div className="bubble-in flex items-start gap-2.5">
      <BotAvatar />
      <div className="flex items-center gap-1 rounded-[18px] rounded-tl-md bg-surface px-4 py-[15px] shadow-card">
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-faint" />
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-faint" />
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-faint" />
      </div>
    </div>
  );
}
