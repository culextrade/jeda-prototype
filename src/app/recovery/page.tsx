"use client";

import React, { useState } from "react";
import { useJeda } from "@/lib/provider";
import { Horizon } from "@/lib/types";
import { completionRate } from "@/lib/selectors";
import EmptyState from "@/components/shell/EmptyState";
import RecoveryTaskItem from "@/components/jeda/RecoveryTaskItem";
import ProgressBar from "@/components/ui/ProgressBar";
import Card from "@/components/ui/Card";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RecoveryPage() {
  const { state, updateTaskStatus, createRecoveryPlan } = useJeda();
  const [activeHorizon, setActiveHorizon] = useState<Horizon>("24jam");

  const plans = state.recoveryPlans;
  const hasPlan = plans.length > 0;
  const currentPlan = hasPlan ? plans[0] : null;
  const tasks = currentPlan ? currentPlan.tasks : [];

  // Filter tasks based on active horizon
  const filteredTasks = tasks.filter((t) => t.horizon === activeHorizon);
  const rate = completionRate(currentPlan);

  const horizons: { key: Horizon; label: string }[] = [
    { key: "24jam", label: "24 Jam" },
    { key: "7hari", label: "7 Hari" },
    { key: "30hari", label: "30 Hari" },
  ];

  return (
    <div className="flex-1 flex flex-col gap-4 p-5 bg-canvas overflow-y-auto select-none">
      {/* Top Description */}
      <div className="flex flex-col gap-1 text-left select-none pt-2">
        <h2 className="text-H2 font-display font-bold text-ink">Rencana Pemulihan</h2>
        <p className="text-caption text-ink-soft leading-relaxed">
          Ambil langkah kecil secara perlahan. Centang jika sudah kamu selesaikan.
        </p>
      </div>

      {!hasPlan ? (
        <EmptyState
          icon={<Compass className="w-8 h-8" />}
          title="Rencana pemulihan belum aktif"
          description="Selesaikan check-in emosional untuk menyusun rencana pemulihan pertamamu."
          ctaText="Buat Rencana Pemulihan (Mock)"
          onCtaClick={() => createRecoveryPlan()}
        />
      ) : (
        <>
          {/* Progress Header */}
          <Card tone="pine" className="py-4 px-4 flex flex-col gap-3 border border-pine/25 select-none">
            <div className="flex justify-between items-center">
              <span className="text-caption text-ink font-bold">Progres Rencana Aktif</span>
              <span className="text-caption font-extrabold text-pine-dark">
                {rate}% Selesai
              </span>
            </div>
            
            <ProgressBar value={rate} max={100} variant="pine" />
            
            <p className="text-[11px] leading-normal text-ink-soft/90">
              Setiap langkah yang dicentang memberikan reward **+5 JC**.
            </p>
          </Card>

          {/* Segmented Horizon Tabs */}
          <div className="flex rounded-full bg-line/40 p-1 border border-line select-none">
            {horizons.map((h) => (
              <button
                key={h.key}
                onClick={() => setActiveHorizon(h.key)}
                className={cn(
                  "flex-1 text-center py-2.5 rounded-full text-caption font-bold transition-all duration-150 select-none",
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
          <div className="flex flex-col gap-3 select-none pt-1">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-caption text-ink-soft select-none font-medium">
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
        </>
      )}
    </div>
  );
}
