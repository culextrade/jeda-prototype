"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface BreathingDotProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const BreathingDot: React.FC<BreathingDotProps> = ({
  className,
  size = "md",
}) => {
  const sizes = {
    sm: "w-16 h-16",
    md: "w-32 h-32",
    lg: "w-48 h-48",
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Outer Halo */}
      <div
        className={cn(
          "absolute rounded-full bg-clay/10 border border-clay/5 blur-sm animate-breathe motion-reduce:animate-none",
          sizes[size]
        )}
        style={{ animationDelay: "0.5s" }}
      />
      {/* Middle Halo */}
      <div
        className={cn(
          "absolute rounded-full bg-pine/10 border border-pine/5 animate-breathe motion-reduce:animate-none",
          size === "sm" ? "w-12 h-12" : size === "md" ? "w-24 h-24" : "w-36 h-36"
        )}
      />
      {/* Inner Solid Dot */}
      <div
        className={cn(
          "absolute rounded-full bg-gradient-to-br from-pine to-pine-dark shadow-md flex items-center justify-center text-surface text-caption font-semibold select-none",
          size === "sm" ? "w-8 h-8" : size === "md" ? "w-16 h-16" : "w-24 h-24"
        )}
      >
        <span>Jeda</span>
      </div>
    </div>
  );
};

export default BreathingDot;
