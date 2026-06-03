"use client";

import React from "react";
import Link from "next/link";
import { useJeda, useDebts, useStreak } from "@/lib/provider";
import { totalOutstanding } from "@/lib/selectors";
import { formatRupiah } from "@/lib/format";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import AntiRelapseCard from "@/components/jeda/AntiRelapseCard";
import StreakFlame from "@/components/jeda/StreakFlame";
import { Settings } from "lucide-react";

export default function HomePage() {
  const { state } = useJeda();
  const { debts } = useDebts();
  const { streak } = useStreak();

  const totalDebt = totalOutstanding(debts);
  const displayName = state.profile?.displayName || "Sahabat Jeda";

  return (
    <div className="flex-1 flex flex-col gap-5 p-5 bg-canvas overflow-y-auto select-none">
      {/* Welcome Header */}
      <div className="flex justify-between items-center select-none pt-2">
        <div>
          <span className="text-caption text-ink-soft font-semibold">Selamat datang</span>
          <h2 className="text-H2 font-display font-bold text-ink leading-tight">
            {displayName}
          </h2>
        </div>
        
        {/* Settings Shortcut */}
        <Link
          href="/settings"
          className="w-9 h-9 rounded-full bg-surface border border-line/60 flex items-center justify-center text-ink-soft hover:text-ink active:scale-90 transition-all shadow-sm"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>

      {/* Streak Indicator Row (if any) */}
      {streak.current > 0 && (
        <Card tone="pine" className="py-3 px-4 flex justify-between items-center">
          <span className="text-caption font-semibold">Streak Jeda harian kamu aktif:</span>
          <StreakFlame days={streak.current} size="md" />
        </Card>
      )}

      {/* Main Focus: Anti-Relapse Card */}
      <AntiRelapseCard />

      {/* Debts Overview Card */}
      <Card tone="default" className="flex flex-col gap-3 select-none">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-caption text-ink-soft font-semibold">Total Kewajiban Terpetakan</span>
            <h3 className="text-H1 font-display font-bold text-ink mt-1">
              {formatRupiah(totalDebt)}
            </h3>
          </div>
          <span className="text-2xl">📊</span>
        </div>
        
        <div className="h-[1px] bg-line/60 my-1" />

        <div className="flex justify-between items-center text-caption font-medium select-none">
          <span className="text-ink-soft">
            {debts.length} Pemberi pinjaman tercatat
          </span>
          <Link href="/debt-map" className="text-pine font-bold hover:underline">
            Lihat Peta Utang →
          </Link>
        </div>
      </Card>

      {/* Call to action for Safe Space */}
      <Card tone="clay" className="flex items-center justify-between p-4">
        <div className="flex-1 flex flex-col gap-0.5 pr-2">
          <span className="text-caption font-bold text-clay">Sedang tertekan/cemas?</span>
          <span className="text-[11px] leading-tight text-ink-soft">
            Pintu Safe Space selalu terbuka untuk membantumu mengambil jeda.
          </span>
        </div>
        <Link href="/safe-space">
          <Button variant="warm" size="sm" className="px-3 min-h-0 font-bold">
            Masuk
          </Button>
        </Link>
      </Card>
    </div>
  );
}
