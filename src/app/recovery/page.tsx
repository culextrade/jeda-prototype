"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useJeda } from "@/lib/provider";
import { Horizon } from "@/lib/types";
import { completionRate } from "@/lib/selectors";
import EmptyState from "@/components/shell/EmptyState";
import RecoveryTaskItem from "@/components/jeda/RecoveryTaskItem";
import ProgressBar from "@/components/ui/ProgressBar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Compass, Sparkles, HeartHandshake, Lock, Unlock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RecoveryPage() {
  const { state, updateTaskStatus, createRecoveryPlan, confirmAntiRelapse, setState } = useJeda();
  const [activeHorizon, setActiveHorizon] = useState<Horizon>("24jam");
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);

  const plans = state.recoveryPlans;
  const hasPlan = plans.length > 0;
  const currentPlan = hasPlan ? plans[0] : null;
  const tasks = currentPlan ? currentPlan.tasks : [];

  // Auto-generate plan on mount if empty
  useEffect(() => {
    if (state.recoveryPlans.length === 0) {
      createRecoveryPlan();
    }
  }, [state.recoveryPlans, createRecoveryPlan]);

  // Load premium status from localStorage if present
  useEffect(() => {
    const saved = localStorage.getItem("jeda_premium_unlocked");
    if (saved === "true") {
      const timer = setTimeout(() => {
        setIsPremiumUnlocked(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  // Filter tasks based on active horizon
  const filteredTasks = tasks.filter((t) => t.horizon === activeHorizon);
  
  // Calculate completion rates
  const activeHorizonTasks = tasks.filter((t) => t.horizon === activeHorizon);
  const activeHorizonCompleted = activeHorizonTasks.filter((t) => t.done).length;
  const activeHorizonRate = activeHorizonTasks.length > 0 
    ? Math.round((activeHorizonCompleted / activeHorizonTasks.length) * 100)
    : 0;

  const overallRate = completionRate(currentPlan);

  const horizons: { key: Horizon; label: string }[] = [
    { key: "24jam", label: "24 Jam" },
    { key: "7hari", label: "7 Hari" },
    { key: "30hari", label: "30 Hari" },
  ];

  // Anti-relapse date check
  const todayStr = new Date().toISOString().split("T")[0];
  const hasConfirmedAntiRelapseToday = state.streak.lastAntiRelapseDate === todayStr;

  const handleUnlockPremium = (method: "coins" | "free") => {
    if (method === "coins") {
      if (state.credit.balance < 200) {
        alert("Saldo JEDA Credit tidak cukup. Terus kumpulkan dari check-in dan menyelesaikan langkah pemulihan!");
        return;
      }
      
      // Deduct balance and write ledger entry
      const ledgerEntry = {
        id: "ledger-" + Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        type: "spend" as const,
        amount: 200,
        source: "spend-premium" as const,
        label: "Membuka Rencana Pemulihan Premium Adaptif",
      };

      const nextLedger = [...state.credit.ledger, ledgerEntry];
      setState({
        credit: {
          balance: state.credit.balance - 200,
          ledger: nextLedger,
        }
      });
    }

    localStorage.setItem("jeda_premium_unlocked", "true");
    setIsPremiumUnlocked(true);
  };

  return (
    <div className="flex-1 flex flex-col gap-5 p-5 bg-canvas overflow-y-auto select-none">
      {/* Top Description */}
      <div className="flex flex-col gap-1 text-left select-none pt-2">
        <h2 className="text-H2 font-display font-bold text-ink">Rencana Pemulihan</h2>
        <p className="text-caption text-ink-soft leading-relaxed font-semibold">
          Ambil langkah kecil secara perlahan. Centang jika sudah kamu selesaikan.
        </p>
      </div>

      {!hasPlan ? (
        <EmptyState
          icon={<Compass className="w-8 h-8" />}
          title="Menyusun Rencanamu..."
          description="Harap tunggu sejenak sementara kami menyiapkan langkah pemulihan adaptif berdasarkan data terbarumu."
          ctaText="Buat Rencana Sekarang"
          onCtaClick={() => createRecoveryPlan()}
        />
      ) : (
        <>
          {/* Progress Header Card */}
          <Card tone="pine" className="py-5 px-5 flex flex-col gap-4 border border-pine/15 select-none shadow-sm text-left">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-ink-soft">PROGRES TAB INI ({activeHorizon === "24jam" ? "24 JAM" : activeHorizon === "7hari" ? "7 HARI" : "30 HARI"})</span>
                <span className="text-pine-dark">{activeHorizonRate}% Selesai</span>
              </div>
              <ProgressBar value={activeHorizonRate} max={100} variant="pine" />
            </div>

            <div className="flex flex-col gap-1 border-t border-pine/10 pt-3">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-ink-soft">PROGRES KESELURUHAN RENCANA</span>
                <span className="text-pine-dark">{overallRate}% Selesai</span>
              </div>
              <ProgressBar value={overallRate} max={100} variant="pine" />
            </div>
            
            <p className="text-[10px] leading-normal text-ink-soft font-semibold italic">
              * Setiap langkah kecil yang diselesaikan memberikan reward **+5 JC**.
            </p>
          </Card>

          {/* Anti-Relapse Card (Bebas Pinjaman) */}
          {hasConfirmedAntiRelapseToday ? (
            <Card tone="pine" className="py-4 px-4 flex flex-col gap-2.5 border border-pine/15 shadow-sm text-left relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 opacity-5">
                <CheckCircle2 className="w-20 h-20 text-pine" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-pine font-bold uppercase tracking-wider">Komitmen Hari Ini</span>
                <span className="text-[9px] bg-pine text-surface px-2 py-0.5 rounded font-extrabold uppercase">Selesai</span>
              </div>
              <p className="text-[10.5px] leading-relaxed text-ink-soft font-semibold">
                Terima kasih sudah jujur dan mengisi komitmen hari ini. Setiap hari yang kamu lalui tanpa mengambil pinjaman baru adalah langkah maju yang luar biasa.
              </p>
              <div className="mt-1 flex justify-between items-center border-t border-pine/10 pt-2.5 text-[10.5px] font-bold text-pine-dark">
                <span>Streak Bebas Pinjaman:</span>
                <span>{state.streak.antiRelapseDays ?? 0} Hari</span>
              </div>
            </Card>
          ) : (
            <Card className="py-4.5 px-4 flex flex-col gap-3.5 border border-line bg-surface shadow-sm text-left">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-ink-soft font-bold uppercase tracking-wider">Refleksi Harian</span>
                <h4 className="text-body font-display font-extrabold text-ink">Bebas Pinjaman Baru</h4>
              </div>
              <p className="text-[10.5px] leading-relaxed text-ink-soft font-semibold">
                Apakah kamu berhasil melewati hari ini tanpa mengambil pinjaman baru (pinjol/paylater/pribadi)?
              </p>
              <div className="flex gap-3 select-none pt-1">
                <Button
                  variant="primary"
                  className="flex-1 font-bold py-2 text-[11px] min-h-[38px]"
                  size="sm"
                  onClick={() => confirmAntiRelapse(true)}
                >
                  Ya, saya menahan diri
                </Button>
                <Button
                  variant="warm"
                  className="flex-1 font-bold py-2 text-[11px] min-h-[38px]"
                  size="sm"
                  onClick={() => confirmAntiRelapse(false)}
                >
                  Belum berhasil
                </Button>
              </div>
              <div className="flex justify-between items-center text-[10px] text-ink-soft font-semibold border-t border-line/60 pt-2.5 mt-0.5">
                <span>Streak Bebas Pinjaman:</span>
                <span>{state.streak.antiRelapseDays ?? 0} Hari</span>
              </div>
            </Card>
          )}

          {/* Segmented Horizon Tabs */}
          <div className="flex rounded-full bg-line/45 p-1 border border-line/80 select-none">
            {horizons.map((h) => (
              <button
                key={h.key}
                onClick={() => setActiveHorizon(h.key)}
                className={cn(
                  "flex-1 text-center py-2 rounded-full text-caption font-extrabold transition-all duration-150 select-none",
                  activeHorizon === h.key
                    ? "bg-pine text-surface shadow-sm"
                    : "text-ink-soft hover:text-ink"
                )}
              >
                {h.label}
              </button>
            ))}
          </div>

          {/* Tasks List */}
          <div className="flex flex-col gap-3.5 select-none">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-caption text-ink-soft select-none font-medium bg-surface border border-line/40 rounded-md">
                Tidak ada tugas untuk horizon ini.
              </div>
            ) : (
              filteredTasks.map((task) => (
                <RecoveryTaskItem
                  key={task.id}
                  task={task}
                  onToggle={updateTaskStatus}
                />
              ))
            )}
          </div>

          {/* Counseling/Referral Suggestion Card */}
          <Card tone="default" className="py-4 px-4 border border-line/80 bg-surface text-left flex flex-col gap-2 shadow-sm">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-pine" />
              <span className="text-[11px] font-bold text-ink uppercase tracking-wide">Butuh Bantuan Profesional?</span>
            </div>
            <p className="text-[10.5px] leading-relaxed text-ink-soft font-semibold">
              Menghadapi masalah ini sendirian bisa terasa melelahkan. JEDA menyediakan akses langsung ke konselor psikologis, penasihat hukum, dan mentor keuangan terpercaya secara gratis/terjangkau.
            </p>
            <Link href="/resources" className="w-fit mt-1">
              <span className="text-[11px] font-extrabold text-pine hover:underline flex items-center gap-1">
                Lihat Kanal Resmi & Bantuan →
              </span>
            </Link>
          </Card>

          {/* Premium Adaptive Details (Unlockable Card) */}
          {isPremiumUnlocked ? (
            <Card tone="pine" className="py-5 px-5 border border-pine/20 bg-pine-tint text-left flex flex-col gap-3.5 relative overflow-hidden shadow-sm">
              <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 opacity-10">
                <Sparkles className="w-24 h-24 text-pine" />
              </div>
              <div className="flex items-center gap-2">
                <Unlock className="w-5 h-5 text-pine" />
                <h4 className="text-body font-display font-extrabold text-pine-dark">Analisis Rencana Adaptif Premium</h4>
              </div>
              <div className="flex flex-col gap-2.5 text-[11px] font-semibold text-ink-soft">
                <div className="bg-surface/60 p-2.5 rounded border border-pine/10">
                  <span className="text-[10px] font-bold text-pine block mb-0.5">PENGGERAK EMOSI UTAMA:</span>
                  Cenderung terpicu mengambil pinjaman baru saat tingkat kecemasan meningkat di atas rata-rata.
                </div>
                <div className="bg-surface/60 p-2.5 rounded border border-pine/10">
                  <span className="text-[10px] font-bold text-pine block mb-0.5">STRATEGI EMOSIONAL:</span>
                  Reduksi rasa bersalah (guilt reduction) adalah kunci. Jangan menghakimi kesalahan masa lalu; fokus pada stabilitas hari ini.
                </div>
                <div className="bg-surface/60 p-2.5 rounded border border-pine/10">
                  <span className="text-[10px] font-bold text-pine block mb-0.5">JEDA REKOMENDASI:</span>
                  Terapkan pause napas 90 detik setiap kali membuka aplikasi e-commerce atau dompet digital untuk memutus respons impulsif.
                </div>
              </div>
              <p className="text-[9.5px] text-ink-soft/70 font-semibold italic text-center border-t border-pine/10 pt-2.5 mt-0.5">
                Fitur Premium Terbuka — Gunakan analisis ini untuk mendukung pemulihanmu.
              </p>
            </Card>
          ) : (
            <Card className="py-5 px-5 border border-line bg-surface text-left flex flex-col gap-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Lock className="w-4.5 h-4.5 text-ink-soft/80" />
                <h4 className="text-body font-display font-extrabold text-ink">Rencana Pemulihan Premium Adaptif</h4>
              </div>
              <p className="text-[10.5px] leading-relaxed text-ink-soft font-semibold">
                Dapatkan visualisasi visual pola cicilan bulanan, analisis pemicu emosi personal berdasarkan data check-in harianmu, serta rekomendasi aksi khusus dari pakar.
              </p>
              <div className="flex flex-col gap-2 mt-2 select-none">
                <Button
                  variant="credit"
                  size="sm"
                  className="font-bold py-2 min-h-[38px] text-[11px]"
                  onClick={() => handleUnlockPremium("coins")}
                >
                  Buka dengan 200 JC
                </Button>
                <div className="text-center text-[10px] text-ink-soft font-bold py-1">
                  — ATAU —
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="font-bold py-2 min-h-[38px] text-[11px]"
                  disabled={state.streak.current < 7}
                  onClick={() => handleUnlockPremium("free")}
                >
                  Gratis dengan Streak Check-In 7 Hari (Sekarang: {state.streak.current} Hari)
                </Button>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
