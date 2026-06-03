"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useJeda } from "@/lib/provider";
import { DominantCondition } from "@/lib/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const CONDITION_INFO = {
  panik: { emoji: "😟", label: "Panik", text: "Rasanya mendesak sekali." },
  malu: { emoji: "😔", label: "Malu", text: "Aku malu pada kondisi ini." },
  "takut-ditagih": { emoji: "📞", label: "Takut Ditagih", text: "Penagihan membuatku cemas." },
  "ingin-pinjam-lagi": { emoji: "🔁", label: "Ingin Pinjam Lagi", text: "Tergoda menutup dengan pinjaman baru." },
  bingung: { emoji: "🌫️", label: "Bingung", text: "Tidak tahu harus mulai dari mana." },
};

function CheckInResult() {
  const router = useRouter();
  const { addCheckIn } = useJeda();
  const searchParams = useSearchParams();

  // Extract query parameters
  const condition = (searchParams.get("condition") || "panik") as DominantCondition;
  const pressureVal = parseInt(searchParams.get("pressure") || "3");
  const urgencyVal = parseInt(searchParams.get("urgency") || "3");
  const capacityVal = parseInt(searchParams.get("capacity") || "3");
  const intentVal = parseInt(searchParams.get("intent") || "3");

  const conditionDetails = CONDITION_INFO[condition] || CONDITION_INFO.panik;

  // Decision rule
  // Jalur menenangkan if capacity <= 2 OR urgency == 5 OR intent == 5
  const isMenenangkan = capacityVal <= 2 || urgencyVal === 5 || intentVal === 5;

  const handleAction = (readyToContinue: boolean, targetRoute: string) => {
    // Commit the check-in to localStorage store
    addCheckIn({
      dominantCondition: condition,
      pressure: pressureVal as 1 | 2 | 3 | 4 | 5,
      urgency: urgencyVal as 1 | 2 | 3 | 4 | 5,
      capacity: capacityVal as 1 | 2 | 3 | 4 | 5,
      intentToBorrow: intentVal as 1 | 2 | 3 | 4 | 5,
      readyToContinue,
    });

    // Navigate to target route
    router.push(targetRoute);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-canvas select-none">
      {/* Header */}
      <div className="text-center py-2 select-none border-b border-line/10 mb-4">
        <span className="text-[10px] font-bold text-ink-soft/60 uppercase tracking-widest">
          Hasil Evaluasi
        </span>
      </div>

      {/* Content Container */}
      <div className="flex-1 flex flex-col justify-center gap-6 my-auto max-w-sm mx-auto w-full">
        {/* Dynamic Condition Reflective Card */}
        <Card tone="default" className="p-4 border border-line bg-surface flex flex-col gap-3 items-center text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-clay-tint flex items-center justify-center text-2xl">
            {conditionDetails.emoji}
          </div>
          <div>
            <h4 className="text-caption font-bold text-ink leading-tight">
              Kondisi Dominan: {conditionDetails.label}
            </h4>
            <p className="text-[10.5px] text-ink-soft italic font-semibold mt-1">
              &ldquo;{conditionDetails.text}&rdquo;
            </p>
          </div>
          <div className="w-full h-px bg-line/50 my-1" />
          <p className="text-[11px] leading-relaxed text-ink-soft/90 font-medium">
            {isMenenangkan
              ? "Berdasarkan evaluasi, tingkat tekanan psikis atau urgensi keputusanmu sedang berada di titik tertinggi saat ini."
              : "Berdasarkan evaluasi, kamu sedang berupaya menimbang keadaan dengan kepala dingin."}
          </p>
        </Card>

        {/* Branching UI Block */}
        {isMenenangkan ? (
          /* Jalur Menenangkan */
          <div className="flex flex-col gap-5 text-center px-1">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-H2 font-display font-extrabold text-clay leading-tight">
                Sepertinya sekarang berat sekali.
              </h2>
              <p className="text-H3 font-display font-bold text-ink leading-snug">
                Tidak apa-apa.
              </p>
              <p className="text-caption text-ink-soft font-medium leading-relaxed mt-1">
                Kamu tidak harus menyelesaikan semuanya hari ini. Mari kita buat kepalamu sedikit lebih tenang terlebih dahulu.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5 pt-3 w-full max-w-xs mx-auto">
              <Button
                variant="warm"
                onClick={() => handleAction(false, "/resources")}
                className="w-full font-bold shadow-sm"
              >
                Tenangkan dulu
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleAction(true, "/debt-map")}
                className="w-full text-caption text-ink-soft font-bold hover:bg-ink/5"
              >
                Aku tetap mau lanjut
              </Button>
            </div>
          </div>
        ) : (
          /* Jalur Siap */
          <div className="flex flex-col gap-5 text-center px-1">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-H2 font-display font-extrabold text-pine leading-tight">
                Langkah pertama yang berani.
              </h2>
              <p className="text-caption text-ink-soft font-medium leading-relaxed mt-1">
                Kamu sudah meluangkan waktu untuk berproses. Mau kita lihat gambaran utangmu bersama sekarang?
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5 pt-3 w-full max-w-xs mx-auto">
              <Button
                variant="primary"
                onClick={() => handleAction(true, "/debt-map")}
                className="w-full font-bold shadow-sm"
              >
                Lihat peta utang
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleAction(false, "/home")}
                className="w-full text-caption text-ink-soft font-bold hover:bg-ink/5"
              >
                Nanti saja
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom disclaimer */}
      <div className="text-center pt-4 text-[10px] text-ink-soft/60 italic font-semibold">
        Jawabanmu hanya disimpan secara lokal di browser perangkat ini.
      </div>
    </div>
  );
}

export default function CheckInResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center text-caption text-ink-soft select-none font-medium">
          Sebentar ya…
        </div>
      }
    >
      <CheckInResult />
    </Suspense>
  );
}
