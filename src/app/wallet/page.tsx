"use client";

import React, { useState } from "react";
import { useCredit, useJeda } from "@/lib/provider";
import { LedgerEntry, LedgerSource } from "@/lib/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import JCAmount from "@/components/ui/JCAmount";
import DisclaimerNote from "@/components/jeda/DisclaimerNote";
import MissionItem from "@/components/jeda/MissionItem";
import { totalEarnedXp } from "@/lib/selectors";
import { getLevelByXp } from "@/lib/levels";
import { Coins, ShoppingBag, History, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { JedaState } from "@/lib/types";

type WalletTab = "misi" | "toko" | "riwayat";

const generateLedgerId = () => "ledger-" + Math.random().toString(36).substring(2, 9);

export default function WalletPage() {
  const { balance, ledger, claimMissionReward } = useCredit();
  const { state, setState, showToast } = useJeda();
  const [activeTab, setActiveTab] = useState<WalletTab>("misi");

  const xp = totalEarnedXp(ledger);
  const currentLvl = getLevelByXp(xp);

  const checkLevelUp = (oldXp: number, newXp: number, currentState: JedaState) => {
    const oldLevel = getLevelByXp(oldXp);
    const newLevel = getLevelByXp(newXp);
    if (oldLevel.key !== newLevel.key) {
      if (currentState.profile) {
        setState({
          profile: {
            ...currentState.profile,
            levelKey: newLevel.key,
          },
        });
      }
    }
  };

  // Mock Purchase (Buy JC)
  const handleBuyJc = (amount: number, priceStr: string) => {
    if (window.confirm(`Konfirmasi pembelian mock paket ${amount} JC seharga ${priceStr}? (Pembayaran disimulasikan)`)) {
      const entry: LedgerEntry = {
        id: generateLedgerId(),
        timestamp: new Date().toISOString(),
        type: "earn",
        amount,
        source: "purchase" as const,
        label: `Beli Paket JEDA Credit (${amount} JC)`,
      };

      const newLedger = [...ledger, entry];
      const oldXp = totalEarnedXp(ledger);
      const nextState = {
        ...state,
        credit: {
          balance: balance + amount,
          ledger: newLedger,
        },
      };

      setState(nextState);
      showToast(`+${amount} JC ditambahkan ke dompet!`, amount);
      checkLevelUp(oldXp, totalEarnedXp(newLedger), nextState);
    }
  };

  // Mock Spend (Redeem JC)
  const handleSpendJc = (itemLabel: string, cost: number) => {
    if (balance < cost) {
      alert(`Saldo JEDA Credit tidak mencukupi. Selesaikan misi pemulihan untuk mendapatkan ${cost - balance} JC lagi.`);
      return;
    }

    if (window.confirm(`Gunakan ${cost} JC untuk menukarkan item: ${itemLabel}?`)) {
      const entry: LedgerEntry = {
        id: generateLedgerId(),
        timestamp: new Date().toISOString(),
        type: "spend",
        amount: cost,
        source: "spend-premium" as const,
        label: `Tukar: ${itemLabel}`,
      };

      const nextState = {
        ...state,
        credit: {
          balance: balance - cost,
          ledger: [...ledger, entry],
        },
      };

      setState(nextState);
      showToast(`Item berhasil ditukarkan!`, 0);
    }
  };

  const tabs: { key: WalletTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "misi", label: "Misi", icon: Coins },
    { key: "toko", label: "Tukar & Beli", icon: ShoppingBag },
    { key: "riwayat", label: "Riwayat", icon: History },
  ];

  // Helper for source translation
  const getSourceLabel = (src: LedgerSource) => {
    switch (src) {
      case "checkin": return "Check-In";
      case "debt-map-complete": return "Peta Utang";
      case "recovery-task": return "Langkah Tugas";
      case "recovery-complete": return "Rencana Selesai";
      case "purchase": return "Pembelian Mock";
      case "spend-premium": return "Penukaran";
      case "referral-accepted": return "Referral";
      case "streak-3": return "Misi Streak";
      case "streak-7": return "Misi Streak";
      default: return "Sistem Jeda";
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-4 p-5 bg-canvas overflow-y-auto select-none">
      {/* Wallet Balance Card */}
      <Card tone="amber" className="py-5 px-5 flex justify-between items-center border border-amber/25 select-none bg-gradient-to-br from-amber-tint to-amber-tint/30">
        <div className="flex flex-col text-left">
          <span className="text-caption text-ink-soft font-semibold">
            Saldo JEDA Credit kamu
          </span>
          <JCAmount amount={balance} size="lg" className="mt-1" />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-caption text-ink-soft font-semibold">Level Pemulihan</span>
          <span className="text-caption font-bold text-amber-dark bg-amber/10 px-2 py-0.5 rounded border border-amber/20 mt-1 uppercase select-none">
            {currentLvl.name}
          </span>
        </div>
      </Card>

      {/* Segmented Sub Tabs */}
      <div className="flex rounded-full bg-line/40 p-1 border border-line select-none flex-shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex-grow flex items-center justify-center gap-1.5 py-2 rounded-full text-caption font-bold transition-all duration-150 select-none",
                activeTab === tab.key
                  ? "bg-amber text-surface shadow-sm"
                  : "text-ink-soft hover:text-ink"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Content */}
      <div className="flex-1 flex flex-col gap-3 select-none">
        
        {/* TAB 1: Missions */}
        {activeTab === "misi" && (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-caption font-bold text-ink-soft">
                Misi Pemulihan Harian & Khusus
              </h3>
            </div>
            
            {state.missions.map((mission) => (
              <MissionItem
                key={mission.key}
                mission={mission}
                onClaim={claimMissionReward}
              />
            ))}
          </div>
        )}

        {/* TAB 2: Toko & Redeem */}
        {activeTab === "toko" && (
          <div className="flex flex-col gap-4">
            
            {/* Purchase Options */}
            <div className="flex flex-col gap-2.5">
              <h3 className="text-caption font-bold text-ink-soft select-none text-left px-1">
                Dukung Pemulihanmu (Mock Beli)
              </h3>
              
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { amount: 100, price: "Rp19.000", label: "Starter" },
                  { amount: 280, price: "Rp49.000", label: "Plus" },
                  { amount: 600, price: "Rp99.000", label: "Pro" }
                ].map((pkg) => (
                  <button
                    key={pkg.amount}
                    onClick={() => handleBuyJc(pkg.amount, pkg.price)}
                    className="p-3.5 rounded-md border border-line bg-surface hover:bg-canvas hover:border-amber/30 flex flex-col items-center gap-1 select-none active:scale-95 transition-all text-center"
                  >
                    <span className="text-[10px] uppercase font-bold text-ink-soft">{pkg.label}</span>
                    <JCAmount amount={pkg.amount} size="sm" showIcon={false} className="text-amber-dark font-extrabold text-body-lg" />
                    <span className="text-[10px] text-ink-soft font-semibold bg-line/40 px-1.5 py-0.5 rounded">{pkg.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Spend Options */}
            <div className="flex flex-col gap-2.5">
              <h3 className="text-caption font-bold text-ink-soft select-none text-left px-1">
                Gunakan JEDA Credit (Spend Premium)
              </h3>
              
              <div className="flex flex-col gap-2.5">
                {[
                  { label: "Aktivasi Tema Jurnal Premium", cost: 100, desc: "Akses visual tenang tambahan" },
                  { label: "Aktivasi Rencana Pemulihan Adaptif", cost: 200, desc: "Akses detail horizon lebih spesifik" },
                  { label: "Sesi Mentor Keuangan 1:1 (Mock Booking)", cost: 500, desc: "Konsultasi tatap muka CSR" }
                ].map((item) => (
                  <div key={item.label} className="p-3.5 rounded-md border border-line bg-surface flex justify-between items-center gap-2 select-none text-left">
                    <div className="flex-1 flex flex-col gap-0.5 select-none">
                      <span className="text-caption font-bold text-ink leading-tight">{item.label}</span>
                      <span className="text-[10px] text-ink-soft font-medium leading-relaxed">{item.desc}</span>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSpendJc(item.label, item.cost)}
                      className="px-3.5 py-1.5 h-auto min-h-0 text-[11px] rounded-full font-bold shadow-sm flex-shrink-0"
                    >
                      Tukar {item.cost} JC
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Micro Conversion - Coming Soon */}
            <div className="p-3.5 rounded-md border border-line bg-canvas opacity-70 flex justify-between items-center select-none text-left relative overflow-hidden">
              <div className="flex-1 flex flex-col gap-0.5">
                <span className="text-caption font-bold text-ink-soft/70 flex items-center gap-1">
                  Konversi Investasi Mikro
                  <span className="text-[9px] uppercase font-bold text-amber bg-amber/10 border border-amber/20 px-1.5 py-0.5 rounded">Fase 2</span>
                </span>
                <span className="text-[10px] text-ink-soft/50 font-medium">
                  Tukarkan 100 JC menjadi Rp10.000 Reksadana APERD mitra
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-line/40 flex items-center justify-center text-ink-soft/40">
                <Lock className="w-4 h-4" />
              </div>
            </div>

            <DisclaimerNote variant="jc" />
          </div>
        )}

        {/* TAB 3: History */}
        {activeTab === "riwayat" && (
          <div className="flex flex-col gap-3">
            <h3 className="text-caption font-bold text-ink-soft select-none text-left px-1">
              Riwayat Mutasi Saldo
            </h3>
            
            {ledger.length === 0 ? (
              <div className="text-center py-10 text-caption text-ink-soft select-none font-medium">
                Belum ada transaksi di dompet ini.
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {[...ledger]
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3 rounded-md border border-line/60 bg-surface flex justify-between items-center gap-2 select-none text-left"
                    >
                      <div className="flex flex-col gap-0.5 select-none">
                        <span className="text-caption font-bold text-ink">{entry.label}</span>
                        <div className="flex items-center gap-2 select-none">
                          <span className="text-[9px] font-sans font-bold px-1.5 py-0.2 rounded bg-line/50 text-ink-soft uppercase">
                            {getSourceLabel(entry.source)}
                          </span>
                          <span className="text-[10px] text-ink-soft select-none">
                            {entry.timestamp.split("T")[0]}
                          </span>
                        </div>
                      </div>
                      
                      <span
                        className={cn(
                          "text-caption font-bold tabular-nums flex-shrink-0 select-none",
                          entry.type === "earn" ? "text-success" : "text-clay"
                        )}
                      >
                        {entry.type === "earn" ? "+" : "-"}
                        {entry.amount} JC
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
