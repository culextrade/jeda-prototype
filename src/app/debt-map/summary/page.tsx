"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useJeda } from "@/lib/provider";
import { priorityOrder, totalOutstanding } from "@/lib/selectors";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import RupiahText from "@/components/ui/RupiahText";
import { ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { Debt } from "@/lib/types";

export default function DebtSummaryPage() {
  const { state, claimMissionReward } = useJeda();
  const { debts } = state;

  const total = totalOutstanding(debts);
  const sortedDebts = priorityOrder(debts);

  useEffect(() => {
    if (debts.length > 0) {
      const mission = state.missions.find((m) => m.key === "complete-debt-map");
      if (mission && mission.status === "completed") {
        claimMissionReward("complete-debt-map");
      }
    }
  }, [debts, state.missions, claimMissionReward]);

  const typeLabels: Record<string, string> = {
    pinjol: "Pinjol",
    paylater: "PayLater",
    "kartu-kredit": "Kartu Kredit",
    koperasi: "Koperasi",
    personal: "Pribadi",
    lainnya: "Lainnya",
  };

  const getPriorityReason = (debt: Debt) => {
    if (debt.collectorPressure === 3) {
      return {
        text: "Prioritas Utama karena penagihan dengan tekanan tinggi. Kita amankan kondisi psikismu dulu.",
        tone: "clay" as const,
      };
    }
    if (debt.collectorPressure === 2) {
      return {
        text: "Prioritas Menengah karena penagihan dengan tekanan sedang. Perlu ditangani segera setelah tekanan tinggi.",
        tone: "amber" as const,
      };
    }
    
    // Check due date proximity (<= 7 days)
    if (debt.dueDate) {
      const today = new Date();
      const due = new Date(debt.dueDate);
      const diffTime = due.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays <= 7) {
        return {
          text: `Prioritas karena jatuh tempo terdekat (${diffDays} hari lagi).`,
          tone: "amber" as const,
        };
      }
    }

    if (debt.interestRate !== undefined && debt.interestRate > 0) {
      return {
        text: `Prioritas didasarkan pada beban bunga (${debt.interestRate}% ${
          debt.interestType === "per-bulan"
            ? "per bulan"
            : debt.interestType === "per-tahun"
            ? "per tahun"
            : "flat"
        }).`,
        tone: "default" as const,
      };
    }

    return {
      text: "Prioritas didasarkan pada sisa saldo outstanding yang besar.",
      tone: "default" as const,
    };
  };

  // Helper to determine if a debt is near its due date (<= 7 days)
  const isNearDueDate = (dueDate?: string) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  return (
    <div className="flex-1 flex flex-col gap-5 p-5 bg-canvas overflow-y-auto select-none">
      {/* Total Outstanding Card with Emotional Reframing */}
      <Card tone="pine" className="py-6 px-5 flex flex-col gap-2 select-none border border-pine/10 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 opacity-10">
          <Sparkles className="w-24 h-24 text-pine" />
        </div>
        <span className="text-[10px] text-pine font-bold uppercase tracking-wider">Total outstanding terpetakan:</span>
        <h2 className="text-3xl font-display font-extrabold text-pine-dark">
          <RupiahText amount={total} className="text-pine-dark" />
        </h2>
        <p className="text-[11px] leading-relaxed text-ink-soft/90 mt-2 font-medium">
          Melihat angka ini utuh adalah langkah besar — bukan untuk membuatmu cemas, tapi agar kamu punya kendali penuh untuk mulai melangkah secara terarah.
        </p>
      </Card>

      {/* Recommended Priority Section Title */}
      <div className="flex flex-col gap-1.5 text-left">
        <h3 className="text-caption font-bold text-ink">Urutan Prioritas Penyelesaian</h3>
        <p className="text-[10px] text-ink-soft font-medium leading-relaxed">
          Urutan ini direkomendasikan JEDA untuk melindungimu dari tekanan emosional dan konsekuensi finansial terbesar terlebih dahulu.
        </p>
      </div>

      {/* Priority Cards List */}
      <div className="flex flex-col gap-3.5 text-left">
        {sortedDebts.length === 0 ? (
          <div className="p-6 text-center bg-surface border border-line rounded-md text-[11px] font-semibold text-ink-soft">
            Belum ada utang terpetakan. Tambahkan utang terlebih dahulu.
          </div>
        ) : (
          sortedDebts.map((debt, index) => {
            const { text: reasonText, tone: cardTone } = getPriorityReason(debt);
            const isNear = isNearDueDate(debt.dueDate);

            return (
              <div key={debt.id} className="relative">
                {/* Priority Ribbon */}
                <div className="absolute -left-1.5 top-3 bg-pine text-surface text-[9px] font-bold py-0.5 px-2 rounded-r shadow-sm z-10">
                  #{index + 1}
                </div>

                <Card className="pl-7 py-4 pr-4 border border-line bg-surface flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-pine bg-pine-tint px-2 py-0.5 rounded-full inline-block">
                          {typeLabels[debt.type] || "Lainnya"}
                        </span>
                        {debt.type === "pinjol" && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                            debt.isLicensedKnown === true 
                              ? "bg-success/10 text-success border-success/10" 
                              : debt.isLicensedKnown === false 
                              ? "bg-clay-tint text-clay border-clay/10"
                              : "bg-amber-tint text-warn border-warn/10"
                          }`}>
                            {debt.isLicensedKnown === true 
                              ? "OJK Resmi" 
                              : debt.isLicensedKnown === false 
                              ? "Tidak Resmi/Ragu" 
                              : "Legalitas Belum Dicek"}
                          </span>
                        )}
                      </div>
                      <h4 className="text-body font-display font-extrabold text-ink mt-1">
                        {debt.lenderName}
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-ink-soft block font-medium">Outstanding</span>
                      <RupiahText amount={debt.outstanding} className="text-sm font-extrabold text-ink" />
                    </div>
                  </div>

                  {/* Due Date & Interest Indicators */}
                  <div className="flex flex-wrap gap-2 text-[10px] select-none font-semibold">
                    {debt.dueDate && (
                      <span className={`px-2 py-0.5 rounded-full inline-flex items-center gap-1 border ${
                        isNear 
                          ? "bg-amber-tint text-warn border-warn/15 font-bold" 
                          : "bg-canvas text-ink-soft border-line"
                      }`}>
                        {isNear && <AlertCircle className="w-3 h-3 text-warn" />}
                        Tempo: {debt.dueDate} {isNear && "(Segera)"}
                      </span>
                    )}

                    {debt.interestRate !== undefined && debt.interestRate > 0 && (
                      <span className="px-2 py-0.5 bg-canvas text-ink-soft border border-line rounded-full font-semibold">
                        Bunga: {debt.interestRate}% ({
                          debt.interestType === "per-bulan"
                            ? "Bulanan"
                            : debt.interestType === "per-tahun"
                            ? "Tahunan"
                            : debt.interestType === "flat"
                            ? "Flat"
                            : "Tidak tahu"
                        })
                      </span>
                    )}
                  </div>

                  {/* Logical Reason Box */}
                  <div className={`p-2.5 rounded border text-[10px] leading-relaxed font-semibold ${
                    cardTone === "clay" 
                      ? "bg-clay-tint/60 border-clay/15 text-clay" 
                      : cardTone === "amber" 
                      ? "bg-amber-tint/60 border-warn/15 text-warn" 
                      : "bg-pine-tint/40 border-pine/10 text-ink-soft"
                  }`}>
                    {reasonText}
                  </div>
                </Card>
              </div>
            );
          })
        )}
      </div>

      {/* Primary CTA Button */}
      <div className="flex flex-col gap-2.5 pt-2">
        <Link href="/recovery" className="w-full">
          <Button variant="primary" className="w-full font-bold flex items-center justify-center gap-2 py-3">
            Ambil Langkah: Buat Rencana Pemulihan
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        
        <Link href="/debt-map" className="w-full">
          <Button variant="secondary" className="w-full font-bold py-2.5">
            Kembali ke Peta Utang
          </Button>
        </Link>
      </div>
    </div>
  );
}
