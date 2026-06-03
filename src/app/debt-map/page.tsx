"use client";

import React from "react";
import { useDebts } from "@/lib/provider";
import { priorityOrder, totalOutstanding } from "@/lib/selectors";
import { formatRupiah } from "@/lib/format";
import EmptyState from "@/components/shell/EmptyState";
import DebtCard from "@/components/jeda/DebtCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function DebtMapPage() {
  const { debts, addDebt, deleteDebt } = useDebts();

  const sortedDebts = priorityOrder(debts);
  const total = totalOutstanding(debts);

  const handleAddRandomDebt = () => {
    // Generate a beautiful mock debt to demonstrate adding
    const mockLenders = ["Pinjol Kilat", "Kredit Pintar", "EasyCash", "Paylater Cepat", "Koperasi Sejahtera"];
    const mockTypes = ["pinjol", "paylater", "kartu-kredit", "koperasi", "personal"] as const;
    const randomLender = mockLenders[Math.floor(Math.random() * mockLenders.length)];
    const randomType = mockTypes[Math.floor(Math.random() * mockTypes.length)];
    const randomOutstanding = Math.floor((Math.random() * 30 + 5) * 100000); // 500k to 3.5m
    const randomPressure = Math.floor(Math.random() * 3 + 1) as 1 | 2 | 3;
    
    // Set due date offset (e.g. +random days)
    const randomDaysOffset = Math.floor(Math.random() * 15 + 2);
    const d = new Date();
    d.setDate(d.getDate() + randomDaysOffset);
    const dueDateStr = d.toISOString().split("T")[0];

    addDebt({
      lenderName: randomLender,
      type: randomType,
      outstanding: randomOutstanding,
      principal: randomOutstanding * 0.9,
      collectorPressure: randomPressure,
      dueDate: dueDateStr,
      isLicensedKnown: Math.random() > 0.4,
    });
  };

  return (
    <div className="flex-1 flex flex-col gap-4 p-5 bg-canvas overflow-y-auto select-none">
      {/* Top Description */}
      <div className="flex flex-col gap-1 text-left select-none pt-2">
        <h2 className="text-H2 font-display font-bold text-ink">Susun Peta Utangmu</h2>
        <p className="text-caption text-ink-soft leading-relaxed">
          Semua data ini tersimpan aman di perangkatmu, tidak pernah dikirim ke internet.
        </p>
      </div>

      {debts.length === 0 ? (
        <EmptyState
          title="Belum ada utang yang dicatat"
          description="Tambahkan satu dulu — cukup yang kamu ingat untuk memulai pemetaan."
          ctaText="Catat Utang Pertama"
          onCtaClick={handleAddRandomDebt}
        />
      ) : (
        <>
          {/* Summary Banner */}
          <Card tone="pine" className="py-4 px-4 flex flex-col gap-1 select-none">
            <span className="text-caption text-ink font-semibold">Total Terpetakan:</span>
            <div className="flex justify-between items-baseline">
              <span className="text-H1 font-display font-extrabold text-pine-dark">
                {formatRupiah(total)}
              </span>
              <span className="text-caption font-bold text-pine-dark bg-pine-tint px-2.5 py-1 rounded-full border border-pine/10">
                {debts.length} Pinjaman
              </span>
            </div>
            <p className="text-[11px] leading-normal text-ink-soft/90 mt-1">
              Melihatnya secara utuh adalah langkah besar menuju kendali finansial.
            </p>
          </Card>

          {/* Quick Add Trigger */}
          <Button
            variant="secondary"
            size="md"
            onClick={handleAddRandomDebt}
            className="w-full text-caption font-bold border-dashed border-2 hover:bg-pine-tint bg-surface"
          >
            + Tambah Catatan Utang (Mock)
          </Button>

          {/* Sorted Debt List */}
          <div className="flex flex-col gap-3.5 select-none pt-2">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-caption font-bold text-ink-soft">
                Urutan Fokus Rekomendasi JEDA:
              </h3>
              <span className="text-[10px] text-ink-soft font-medium">
                (Tekanan → Tempo)
              </span>
            </div>

            {sortedDebts.map((debt) => (
              <DebtCard
                key={debt.id}
                debt={debt}
                onDelete={deleteDebt}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
