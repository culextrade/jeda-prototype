"use client";

import React from "react";
import { useCredit } from "@/lib/provider";
import { getLevelByXp, LEVELS } from "@/lib/levels";
import { totalEarnedXp } from "@/lib/selectors";
import { cn } from "@/lib/utils";

export interface LevelRingProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export const LevelRing: React.FC<LevelRingProps> = ({
  className,
  size = 120,
  strokeWidth = 8,
}) => {
  const { ledger } = useCredit();
  const xp = totalEarnedXp(ledger);
  const currentLvl = getLevelByXp(xp);
  
  // Find index of current level
  const currentIndex = LEVELS.findIndex((l) => l.key === currentLvl.key);
  const nextLvl = currentIndex < LEVELS.length - 1 ? LEVELS[currentIndex + 1] : null;

  // Calculate progress inside current level
  let percentage = 100;
  let levelProgress = 0;
  let levelTarget = 0;

  if (nextLvl) {
    levelProgress = xp - currentLvl.minXp;
    levelTarget = nextLvl.minXp - currentLvl.minXp;
    percentage = Math.min(100, Math.max(0, (levelProgress / levelTarget) * 100));
  }

  // SVG Geometry
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative flex flex-col items-center justify-center select-none", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="var(--amber-tint)"
          strokeWidth={strokeWidth}
        />
        {/* Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="var(--amber)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>

      {/* Center Label */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-[28px] select-none">👑</span>
        <span className="text-caption font-bold text-ink mt-0.5 max-w-[80px] truncate leading-none">
          Level {currentIndex + 1}
        </span>
      </div>

      <div className="mt-3 text-center">
        <h4 className="text-body font-display font-semibold text-ink leading-tight">
          {currentLvl.name}
        </h4>
        {nextLvl ? (
          <p className="text-caption text-ink-soft mt-0.5">
            {nextLvl.minXp - xp} XP lagi menuju level {currentIndex + 2}
          </p>
        ) : (
          <p className="text-caption text-success font-semibold mt-0.5">
            Level Maksimum Tercapai
          </p>
        )}
      </div>
    </div>
  );
};

export default LevelRing;
