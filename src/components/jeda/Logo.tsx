import React from "react";
import { cn } from "@/lib/utils";

export interface LogoProps {
  className?: string;
  size?: number;
  variant?: "pine" | "amber" | "clay" | "white";
}

export const Logo: React.FC<LogoProps> = ({
  className,
  size = 24,
  variant = "pine",
}) => {
  const colors = {
    pine: "text-pine",
    amber: "text-amber",
    clay: "text-clay",
    white: "text-surface",
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block", colors[variant], className)}
    >
      <rect x="5" y="3" width="5" height="18" rx="2.5" fill="currentColor" />
      <rect x="14" y="3" width="5" height="18" rx="2.5" fill="currentColor" />
    </svg>
  );
};

export default Logo;
