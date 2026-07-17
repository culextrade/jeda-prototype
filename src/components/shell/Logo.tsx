import React from "react";
import { cn } from "@/lib/utils";

/** Logo JEDA — dua bar jeda (pause). */
export function PauseMark({
  className,
  bar = "bg-pine",
}: {
  className?: string;
  bar?: string;
}) {
  return (
    <span className={cn("inline-flex items-end gap-[22%]", className)}>
      <span className={cn("h-full w-[39%] rounded-full", bar)} />
      <span className={cn("h-[78%] w-[39%] rounded-full self-start", bar)} />
    </span>
  );
}

export function Wordmark({
  className,
  markClass,
}: {
  className?: string;
  markClass?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <PauseMark className={cn("h-[1.05em] w-[0.9em]", markClass)} />
      <span className="font-display text-[1.35em] font-semibold tracking-tight leading-none">
        jeda
      </span>
    </span>
  );
}
