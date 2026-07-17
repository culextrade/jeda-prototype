"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Chip({
  children,
  selected,
  onClick,
  className,
}: {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-[40px] items-center gap-1.5 rounded-full border px-4 py-2 text-left text-[13px] font-medium leading-snug transition-[transform,background-color,border-color] duration-150 ease-out active:scale-97",
        selected
          ? "border-pine bg-pine text-white"
          : "border-line bg-surface text-ink hover:border-pine/40",
        className
      )}
    >
      {selected && <Check size={14} strokeWidth={3} className="shrink-0" />}
      {children}
    </button>
  );
}
