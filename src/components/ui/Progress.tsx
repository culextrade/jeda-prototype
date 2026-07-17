import React from "react";
import { cn } from "@/lib/utils";

/** Bar progres tipis untuk asesmen. */
export function ProgressBar({
  value, // 0..1
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className={cn("h-1 w-full overflow-hidden rounded-full bg-line/70", className)}>
      <div
        className="h-full rounded-full bg-pine transition-[width] duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }}
      />
    </div>
  );
}

/** Titik langkah untuk /hasil. */
export function StepDots({
  total,
  current,
  className,
}: {
  total: number;
  current: number; // 0-index
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300 ease-out",
            i === current ? "w-5 bg-pine" : "w-1.5 bg-line"
          )}
        />
      ))}
    </div>
  );
}
