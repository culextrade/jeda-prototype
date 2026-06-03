"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DominantCondition } from "@/lib/types";
import Button from "@/components/ui/Button";
import BreathingDot from "@/components/jeda/BreathingDot";
import { cn } from "@/lib/utils";

interface ConditionOption {
  key: DominantCondition;
  emoji: string;
  label: string;
  subtext: string;
}

const OPTIONS: ConditionOption[] = [
  {
    key: "panik",
    emoji: "😟",
    label: "Panik",
    subtext: "Rasanya mendesak sekali.",
  },
  {
    key: "malu",
    emoji: "😔",
    label: "Malu",
    subtext: "Aku malu pada kondisi ini.",
  },
  {
    key: "takut-ditagih",
    emoji: "📞",
    label: "Takut Ditagih",
    subtext: "Penagihan membuatku cemas.",
  },
  {
    key: "ingin-pinjam-lagi",
    emoji: "🔁",
    label: "Ingin Pinjam Lagi",
    subtext: "Aku tergoda menutup dengan pinjaman baru.",
  },
  {
    key: "bingung",
    emoji: "🌫️",
    label: "Bingung",
    subtext: "Aku tidak tahu harus mulai dari mana.",
  },
];

export default function SafeSpacePage() {
  const [selected, setSelected] = useState<DominantCondition | null>(null);
  const [isBreathing, setIsBreathing] = useState(false);

  const handleSelect = (key: DominantCondition) => {
    setSelected(key);
  };

  const handleStartBreathing = () => {
    setIsBreathing(true);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-canvas select-none">
      {/* Dynamic Content depending on Breathing stage */}
      {isBreathing ? (
        /* Breathing Step */
        <div className="flex-1 flex flex-col justify-between py-8 select-none text-center">
          <div className="flex flex-col gap-1.5 pt-4">
            <h2 className="text-H1 font-display font-bold text-ink">Tarik Napas Pelan...</h2>
            <p className="text-caption text-ink-soft">Lalu lepaskan perlahan.</p>
          </div>

          <div className="my-auto py-10 flex justify-center">
            <BreathingDot size="lg" />
          </div>

          <div className="flex flex-col gap-4 w-full max-w-xs mx-auto pb-4 items-center">
            <p className="text-caption text-ink-soft italic font-medium">
              Tidak ada yang perlu diputuskan dalam 60 detik ke depan.
            </p>
            <Link href="/check-in" className="w-full">
              <Button variant="primary" className="w-full">
                Aku Siap Lanjut
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Condition Picker Step */
        <div className="flex-1 flex flex-col justify-between select-none">
          {/* Header */}
          <div className="flex flex-col gap-1 text-left select-none pt-2">
            <h2 className="text-H2 font-display font-bold text-ink">
              Apa yang paling kamu rasakan sekarang?
            </h2>
            <p className="text-caption text-ink-soft select-none font-semibold">
              Pilih satu. Tidak ada jawaban yang salah.
            </p>
          </div>

          {/* Condition Options List */}
          <div className="flex flex-col gap-2.5 my-auto py-4">
            {OPTIONS.map((opt) => {
              const isSelected = selected === opt.key;
              return (
                <div
                  key={opt.key}
                  onClick={() => handleSelect(opt.key)}
                  className={cn(
                    "p-4 rounded-md border flex items-center gap-3.5 select-none transition-all cursor-pointer",
                    isSelected
                      ? "bg-clay-tint border-clay text-ink shadow-sm"
                      : "bg-surface border-line hover:bg-canvas text-ink"
                  )}
                >
                  <span className="text-2xl select-none">{opt.emoji}</span>
                  <div className="flex-1 flex flex-col text-left select-none leading-tight">
                    <span className={cn("text-caption font-bold", isSelected ? "text-clay font-extrabold" : "text-ink")}>
                      {opt.label}
                    </span>
                    <span className="text-[10.5px] text-ink-soft font-medium mt-1 leading-normal">
                      {opt.subtext}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="flex flex-col gap-3.5 w-full max-w-xs mx-auto pb-4 items-center select-none">
            {selected ? (
              <div className="flex flex-col gap-4 w-full select-none">
                <p className="text-[11px] leading-normal text-ink-soft/90 italic font-semibold text-center px-2">
                  &ldquo;Terima kasih sudah jujur. Sebelum memutuskan, ambil jeda sebentar bersama kami.&rdquo;
                </p>
                <Button variant="warm" onClick={handleStartBreathing} className="w-full font-bold">
                  Ambil jeda dulu
                </Button>
              </div>
            ) : (
              <Button variant="primary" disabled className="w-full">
                Pilih kondisi di atas
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
