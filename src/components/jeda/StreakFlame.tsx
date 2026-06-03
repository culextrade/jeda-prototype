import React from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StreakFlameProps {
  days: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const StreakFlame: React.FC<StreakFlameProps> = ({
  days,
  className,
  size = "md",
}) => {
  const sizes = {
    sm: {
      icon: "w-4 h-4",
      text: "text-caption",
      gap: "gap-1",
    },
    md: {
      icon: "w-6 h-6",
      text: "text-Label/UI font-bold",
      gap: "gap-1.5",
    },
    lg: {
      icon: "w-10 h-10",
      text: "text-H1 font-extrabold",
      gap: "gap-2",
    },
  };

  const hasStreak = days > 0;

  return (
    <div className={cn("inline-flex items-center select-none", sizes[size].gap, className)}>
      <Flame
        className={cn(
          sizes[size].icon,
          hasStreak 
            ? "text-clay fill-clay animate-pulse" 
            : "text-ink-soft/40"
        )}
      />
      <div className="flex flex-col text-left leading-none">
        <span className={cn("text-ink", sizes[size].text)}>
          {days} {days === 1 ? "Hari" : "Hari"}
        </span>
        {size === "lg" && (
          <span className="text-[11px] font-sans font-medium text-ink-soft mt-1">
            Streak Jeda Beruntun
          </span>
        )}
      </div>
    </div>
  );
};

export default StreakFlame;
