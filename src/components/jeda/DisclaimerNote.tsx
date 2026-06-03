import React from "react";
import { cn } from "@/lib/utils";

export interface DisclaimerNoteProps {
  variant?: "general" | "jc";
  className?: string;
}

export const DisclaimerNote: React.FC<DisclaimerNoteProps> = ({
  variant = "general",
  className,
}) => {
  const texts = {
    general:
      "JEDA adalah pendamping awal, bukan pemberi pinjaman, penagih, aplikasi investasi, atau nasihat hukum/medis. Selalu konsultasikan keputusan krusial dengan pihak profesional resmi.",
    jc:
      "JEDA Credit adalah poin internal untuk mendukung pemulihanmu — bukan uang, kripto, alat pembayaran, atau produk investasi. Semua fitur bisa kamu dapatkan gratis lewat misi pemulihan. JEDA tidak memungut paksa pembelian.",
  };

  return (
    <div
      className={cn(
        "p-3.5 rounded-md bg-canvas border border-line text-caption text-ink-soft select-none leading-relaxed text-left",
        className
      )}
    >
      <div className="flex gap-2 items-start">
        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-ink-soft/10 text-ink-soft text-[10px] font-bold mt-0.5">
          ℹ
        </span>
        <p className="flex-1 m-0 text-ink-soft/90">{texts[variant]}</p>
      </div>
    </div>
  );
};

export default DisclaimerNote;
