"use client";

import React from "react";
import { Debt } from "@/lib/types";
import Card from "../ui/Card";
import RupiahText from "../ui/RupiahText";
import { AlertCircle, Calendar, Trash2, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DebtCardProps {
  debt: Debt;
  onDelete?: (id: string) => void;
  onEdit?: (debt: Debt) => void;
}

export const DebtCard: React.FC<DebtCardProps> = ({ debt, onDelete, onEdit }) => {
  const { lenderName, type, outstanding, dueDate, collectorPressure } = debt;

  // Render pressure dots (1-3 dots)
  const renderPressureDots = () => {
    const dotsCount = collectorPressure ?? 1;
    const dotColors = {
      1: "bg-success",
      2: "bg-warn",
      3: "bg-clay animate-pulse",
    };
    const labels = {
      1: "Tekanan Rendah",
      2: "Tekanan Sedang",
      3: "Tekanan Tinggi",
    };

    return (
      <div className="flex items-center gap-1.5" title={labels[dotsCount as 1|2|3]}>
        <span className="text-[10px] text-ink-soft select-none font-medium">Penagihan:</span>
        <div className="flex gap-1">
          {[1, 2, 3].map((dot) => (
            <div
              key={dot}
              className={cn(
                "w-2 h-2 rounded-full",
                dot <= dotsCount 
                  ? dotColors[dotsCount as 1|2|3] 
                  : "bg-line"
              )}
            />
          ))}
        </div>
      </div>
    );
  };

  // Render due date badge
  const renderDueDate = () => {
    if (!dueDate) return null;

    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isNear = diffDays <= 5;

    return (
      <div
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold select-none",
          isNear 
            ? "bg-amber-tint text-warn border border-warn/10" 
            : "bg-canvas border border-line text-ink-soft"
        )}
      >
        {isNear ? (
          <AlertCircle className="w-3.5 h-3.5 text-warn" />
        ) : (
          <Calendar className="w-3.5 h-3.5 text-ink-soft/60" />
        )}
        <span>
          {isNear 
            ? `${diffDays} hari lagi (${dueDate})` 
            : `Tempo: ${dueDate}`}
        </span>
      </div>
    );
  };

  const typeLabels: Record<string, string> = {
    pinjol: "Pinjol",
    paylater: "PayLater",
    "kartu-kredit": "Kartu Kredit",
    koperasi: "Koperasi",
    personal: "Pribadi",
    lainnya: "Lainnya",
  };

  return (
    <Card tone="default" className="flex flex-col gap-3 py-4 border border-line select-none relative overflow-hidden">
      {/* Top row */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex flex-col gap-1 text-left">
          <span className="text-[11px] font-bold text-pine bg-pine-tint px-2 py-0.5 rounded-full inline-block w-fit select-none">
            {typeLabels[type] || "Lainnya"}
          </span>
          <h4 className="text-body font-display font-bold text-ink truncate max-w-[200px]">
            {lenderName}
          </h4>
        </div>

        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(debt)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-ink-soft hover:text-pine hover:bg-pine-tint/50 transition-all"
              title="Ubah"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(debt.id)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-ink-soft hover:text-clay hover:bg-clay-tint/50 transition-all"
              title="Hapus"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Middle row: Amount */}
      <div className="flex flex-col text-left">
        <span className="text-[10px] text-ink-soft font-semibold">Outstanding Kewajiban</span>
        <RupiahText amount={outstanding} className="text-lg text-ink font-bold mt-0.5" />
      </div>

      {/* Bottom row: Indicators */}
      <div className="flex flex-col gap-2 pt-1 border-t border-line/40">
        <div className="flex justify-between items-center flex-wrap gap-2">
          {renderDueDate()}
          {renderPressureDots()}
        </div>
      </div>
    </Card>
  );
};

export default DebtCard;
