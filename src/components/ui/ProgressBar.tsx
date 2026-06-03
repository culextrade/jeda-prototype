import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: "pine" | "amber";
  className?: string;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = "pine",
  className,
  showLabel = false,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const barColors = {
    pine: "bg-pine",
    amber: "bg-amber",
  };

  const trackColors = {
    pine: "bg-pine-tint",
    amber: "bg-amber-tint",
  };

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("h-3 w-full rounded-full overflow-hidden", trackColors[variant])}>
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out", barColors[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1.5 text-caption text-ink-soft">
          <span>{Math.round(percentage)}% selesai</span>
          <span>{value}/{max}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
