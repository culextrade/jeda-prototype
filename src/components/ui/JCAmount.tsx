import React from "react";
import { formatJc } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface JCAmountProps {
  amount: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export const JCAmount: React.FC<JCAmountProps> = ({
  amount,
  className,
  size = "md",
  showIcon = true,
}) => {
  const sizes = {
    sm: {
      text: "text-caption font-semibold",
      coin: "w-4 h-4 text-[9px]",
      gap: "gap-1",
    },
    md: {
      text: "text-Label/UI font-bold",
      coin: "w-5 h-5 text-[11px]",
      gap: "gap-1.5",
    },
    lg: {
      text: "text-H2 font-extrabold",
      coin: "w-7 h-7 text-[13px]",
      gap: "gap-2",
    },
  };

  return (
    <span className={cn("inline-flex items-center text-amber font-display tabular-nums", sizes[size].gap, className)}>
      {showIcon && (
        <span
          className={cn(
            "flex items-center justify-center font-bold rounded-full bg-amber text-surface shadow-sm select-none border border-amber/10 animate-pulse-slow",
            sizes[size].coin
          )}
        >
          JC
        </span>
      )}
      <span>{formatJc(amount)}</span>
    </span>
  );
};

export default JCAmount;
