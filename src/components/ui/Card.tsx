import React from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-line/70 bg-surface p-4 shadow-card",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "px-1 font-display text-[17px] font-semibold tracking-tight text-ink",
        className
      )}
    >
      {children}
    </h2>
  );
}

export default Card;
