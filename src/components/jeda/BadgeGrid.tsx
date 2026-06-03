"use client";

import React from "react";
import { BadgeKey } from "@/lib/types";
import { useJeda } from "@/lib/provider";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeItemDef {
  key: BadgeKey;
  name: string;
  emoji: string;
  description: string;
}

const ALL_BADGES: BadgeItemDef[] = [
  {
    key: "berani-melihat",
    name: "Berani Melihat",
    emoji: "👁️",
    description: "Melakukan check-in pertama",
  },
  {
    key: "peta-pertama",
    name: "Peta Pertama",
    emoji: "🗺️",
    description: "Memetakan utang pertama kali",
  },
  {
    key: "rencana-pertama",
    name: "Rencana Pertama",
    emoji: "📝",
    description: "Membuat rencana pemulihan pertama",
  },
  {
    key: "streak-3",
    name: "Konsistensi Awal",
    emoji: "🔥",
    description: "Streak harian selama 3 hari",
  },
  {
    key: "streak-7",
    name: "Jeda Seminggu",
    emoji: "🛡️",
    description: "Streak harian selama 7 hari",
  },
  {
    key: "anti-relapse-7",
    name: "Bebas Seminggu",
    emoji: "🌱",
    description: "Menahan diri pinjaman baru 7 hari",
  },
  {
    key: "anti-relapse-30",
    name: "Bebas Sebulan",
    emoji: "🌳",
    description: "Menahan diri pinjaman baru 30 hari",
  },
  {
    key: "jeda-buddy",
    name: "JEDA Buddy",
    emoji: "🤝",
    description: "Mendampingi sesama pejuang JEDA",
  },
  {
    key: "jedadulu",
    name: "#JedaDulu",
    emoji: "📢",
    description: "Membagikan pesan jeda di sosial media",
  },
];

export const BadgeGrid: React.FC = () => {
  const { state } = useJeda();
  const earnedKeys = new Set(state.badges.map((b) => b.key));

  return (
    <div className="grid grid-cols-3 gap-3.5 select-none">
      {ALL_BADGES.map((badge) => {
        const isEarned = earnedKeys.has(badge.key);

        return (
          <div
            key={badge.key}
            className={cn(
              "flex flex-col items-center text-center p-3 rounded-md border transition-all duration-200",
              isEarned
                ? "bg-amber-tint/40 border-amber/20 text-ink"
                : "bg-canvas border-line/50 text-ink-soft/40"
            )}
          >
            {/* Badge Icon */}
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 relative",
                isEarned 
                  ? "bg-amber/10 border border-amber/20 text-amber shadow-sm" 
                  : "bg-line/20 border border-line text-ink-soft/30"
              )}
            >
              <span>{badge.emoji}</span>
              {!isEarned && (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-ink-soft/10 border border-line flex items-center justify-center text-[8px] text-ink-soft/50">
                  <Lock className="w-2.5 h-2.5" />
                </span>
              )}
            </div>

            {/* Badge Info */}
            <h4
              className={cn(
                "text-caption font-bold truncate w-full leading-none",
                isEarned ? "text-ink" : "text-ink-soft/40"
              )}
            >
              {badge.name}
            </h4>
            <p className="text-[10px] leading-tight text-ink-soft/80 mt-1 select-none font-medium scale-90 origin-top">
              {badge.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default BadgeGrid;
