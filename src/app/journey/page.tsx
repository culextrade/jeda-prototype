"use client";

import React from "react";
import { useJeda } from "@/lib/provider";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LevelRing from "@/components/jeda/LevelRing";
import BadgeGrid from "@/components/jeda/BadgeGrid";
import StreakFlame from "@/components/jeda/StreakFlame";
import { Share2, UserPlus, Copy, HeartHandshake } from "lucide-react";

export default function JourneyPage() {
  const { state, showToast } = useJeda();
  const streakDays = state.streak.current;

  const handleCopyReferral = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText("JEDA-SAHABAT-42");
      showToast("Kode referral berhasil disalin!", 0);
    } else {
      alert("Kode referral Anda: JEDA-SAHABAT-42");
    }
  };

  const handleShareMilestone = () => {
    showToast("Berhasil membagikan milestone pemulihan!", 20);
    
    // Simulate updating share milestone mission to completed/claimed if possible
    // We can trigger credit earn via direct state manipulation or call showToast
  };

  return (
    <div className="flex-1 flex flex-col gap-5 p-5 bg-canvas overflow-y-auto select-none">
      {/* 1. Level Ring & Main Stats */}
      <Card tone="default" className="py-6 flex flex-col items-center border border-line">
        <LevelRing size={140} strokeWidth={8} />

        <div className="h-[1px] w-full bg-line/60 my-4" />

        {/* Horizontal Stats */}
        <div className="w-full flex justify-around select-none">
          <div className="flex flex-col items-center">
            <span className="text-caption text-ink-soft font-semibold">Streak Aktif</span>
            <div className="mt-1 flex items-center justify-center bg-clay-tint/40 px-3 py-1 rounded-full border border-clay/10">
              <StreakFlame days={streakDays} size="md" />
            </div>
          </div>
          <div className="w-[1px] bg-line" />
          <div className="flex flex-col items-center">
            <span className="text-caption text-ink-soft font-semibold">Lencana</span>
            <span className="text-H3 font-display font-extrabold text-amber mt-1 select-none flex items-center gap-1">
              🏆 {state.badges.length}
            </span>
          </div>
        </div>
      </Card>

      {/* 2. Badge Collection Grid */}
      <div className="flex flex-col gap-2.5">
        <h3 className="text-caption font-bold text-ink-soft select-none text-left px-1">
          Koleksi Lencana Pemulihan
        </h3>
        <BadgeGrid />
      </div>

      {/* 3. Viral Loop & Community (Referral & #JedaDulu) */}
      <div className="flex flex-col gap-3">
        <h3 className="text-caption font-bold text-ink-soft select-none text-left px-1">
          Dukung Sekitar (Kemitraan JEDA)
        </h3>

        {/* Copy Referral Code */}
        <Card tone="default" className="p-4 border border-line text-left flex flex-col gap-3 select-none">
          <div className="flex gap-2.5 items-start">
            <div className="w-8 h-8 rounded-full bg-pine-tint flex items-center justify-center text-pine flex-shrink-0 mt-0.5">
              <UserPlus className="w-4 h-4" />
            </div>
            <div className="flex-1 flex flex-col select-none">
              <span className="text-caption font-bold text-ink leading-none">Bagikan Ruang Jeda</span>
              <span className="text-[10px] text-ink-soft font-medium leading-relaxed mt-1">
                Ajak teman yang butuh jeda. Kalian berdua dapat **+50 JC** saat teman melakukan check-in pertama.
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 px-3 py-2 rounded-md bg-canvas border border-line flex items-center justify-between select-all font-mono font-bold text-caption text-pine-dark">
              <span>JEDA-SAHABAT-42</span>
              <button onClick={handleCopyReferral} className="text-ink-soft hover:text-pine">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <Button variant="primary" size="md" onClick={handleCopyReferral} className="px-4 min-h-0 text-caption font-bold">
              Salin Kode
            </Button>
          </div>
        </Card>

        {/* Share Milestone #JedaDulu */}
        <Card tone="default" className="p-4 border border-line text-left flex justify-between items-center select-none">
          <div className="flex gap-2.5 items-start">
            <div className="w-8 h-8 rounded-full bg-clay-tint flex items-center justify-center text-clay flex-shrink-0 mt-0.5">
              <Share2 className="w-4 h-4" />
            </div>
            <div className="flex-1 flex flex-col pr-1 select-none">
              <span className="text-caption font-bold text-ink leading-none">Kampanyekan #JedaDulu</span>
              <span className="text-[10px] text-ink-soft font-medium leading-relaxed mt-1">
                Bagikan langkah kecilmu ke media sosial (tanpa identitas/nominal). Klaim **+20 JC**.
              </span>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={handleShareMilestone} className="px-3 min-h-0 text-caption font-bold flex-shrink-0">
            Share
          </Button>
        </Card>

        {/* Become JEDA Buddy */}
        <Card tone="default" className="p-4 border border-line bg-canvas opacity-70 text-left flex justify-between items-center select-none relative overflow-hidden">
          <div className="flex gap-2.5 items-start">
            <div className="w-8 h-8 rounded-full bg-line/60 flex items-center justify-center text-ink-soft flex-shrink-0 mt-0.5">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div className="flex-1 flex flex-col select-none">
              <span className="text-caption font-bold text-ink-soft/80 flex items-center gap-1.5 leading-none">
                Jadilah JEDA Buddy
                <span className="text-[9px] uppercase font-bold text-pine bg-pine-tint px-1.5 py-0.5 rounded">Segera</span>
              </span>
              <span className="text-[10px] text-ink-soft/50 font-medium leading-relaxed mt-1">
                Dampingi sesama Sahabat Jeda setelah kamu berhasil pulih.
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
