"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "warm" | "soft" | "deep";
  size?: "sm" | "md" | "lg";
  full?: boolean;
}

/**
 * Tombol dengan feedback tekan (scale 0.97) — antarmuka yang terasa
 * mendengarkan. Transisi hanya pada transform, ease-out kuat.
 */
export default function Button({
  children,
  className,
  variant = "primary",
  size = "lg",
  full,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex select-none items-center justify-center gap-2 font-sans font-semibold transition-transform duration-150 ease-out active:scale-97 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine/50 focus-visible:ring-offset-2 disabled:opacity-45 disabled:pointer-events-none";

  const variants = {
    primary: "bg-pine text-white",
    secondary: "border border-pine/70 bg-transparent text-pine",
    ghost: "text-pine",
    warm: "bg-clay text-white",
    soft: "bg-pine-tint text-pine-dark",
    deep: "bg-deep text-white",
  } as const;

  const sizes = {
    sm: "min-h-[36px] rounded-full px-4 text-[13px]",
    md: "min-h-[44px] rounded-full px-5 text-[14px]",
    lg: "min-h-[52px] rounded-full px-7 text-[15px]",
  } as const;

  return (
    <button
      className={cn(base, variants[variant], sizes[size], full && "w-full", className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
