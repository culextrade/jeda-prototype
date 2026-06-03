"use client";

import React, { useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useStreak } from "@/lib/provider";
import StreakFlame from "./StreakFlame";

export const AntiRelapseCard: React.FC = () => {
  const { streak, confirmAntiRelapse } = useStreak();
  const [hasConfirmedToday, setHasConfirmedToday] = useState(false);

  const handleConfirm = (success: boolean) => {
    confirmAntiRelapse(success);
    setHasConfirmedToday(true);
    // Reset confirmation state after 3 seconds for demo purposes
    setTimeout(() => {
      setHasConfirmedToday(false);
    }, 4000);
  };

  return (
    <Card tone="default" className="flex flex-col gap-4 text-center select-none py-6 border border-line">
      {/* Title / Question */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-2xl animate-pulse">🛡️</span>
        <h3 className="text-body font-display font-bold text-ink px-2 leading-snug">
          Hari ini, apakah kamu berhasil <span className="text-clay">tidak mengambil pinjaman baru</span>?
        </h3>
        <p className="text-caption text-ink-soft max-w-[280px] mx-auto leading-relaxed">
          Pilihan jujurmu adalah langkah awal pemulihan. Tanpa penghakiman.
        </p>
      </div>

      {/* Streak indicators if present */}
      {streak.current > 0 && (
        <div className="flex justify-center py-1">
          <div className="bg-clay-tint/50 border border-clay/10 rounded-full px-3 py-1.5 flex items-center justify-center">
            <StreakFlame days={streak.current} size="md" />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {hasConfirmedToday ? (
        <div className="text-caption text-success font-semibold py-3 animate-fade-in">
          Terima kasih atas kejujuranmu. Pilihan dicatat! ✨
        </div>
      ) : (
        <div className="flex flex-col gap-2 pt-2 px-1">
          <Button
            variant="warm"
            size="lg"
            onClick={() => handleConfirm(true)}
            className="w-full font-bold"
          >
            Ya, aku menahan diri hari ini
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={() => handleConfirm(false)}
            className="w-full text-caption text-ink-soft hover:text-ink hover:bg-ink/5"
          >
            Belum, dan itu tidak apa-apa
          </Button>
        </div>
      )}
    </Card>
  );
};

export default AntiRelapseCard;
