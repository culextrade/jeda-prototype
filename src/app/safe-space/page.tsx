"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
  const router = useRouter();
  const [selected, setSelected] = useState<DominantCondition | null>(null);
  const [isBreathing, setIsBreathing] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);

  // Countdown timer logic for the breathing interstitial
  useEffect(() => {
    if (!isBreathing) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isBreathing]);

  const handleSelect = (key: DominantCondition) => {
    setSelected(key);
  };

  const handleAction = () => {
    if (!selected) return;

    if (selected === "panik" || selected === "ingin-pinjam-lagi") {
      // Trigger the 60-second breathing interstitial
      setIsBreathing(true);
    } else {
      // Other conditions proceed directly to check-in
      router.push(`/check-in?condition=${selected}`);
    }
  };

  const handleBackFromBreathing = () => {
    setIsBreathing(false);
    setSecondsLeft(60);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-canvas select-none">
      {/* 1. Header (Back to landing/home) */}
      <div className="flex items-center justify-between py-2 mb-2 select-none border-b border-line/10">
        <button
          onClick={() => {
            if (isBreathing) {
              handleBackFromBreathing();
            } else {
              router.push("/");
            }
          }}
          className="p-1 rounded-full text-ink hover:bg-surface active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-ink-soft" />
        </button>
        <span className="text-[10px] font-bold text-ink-soft/60 uppercase tracking-widest">
          {isBreathing ? "Ambil Jeda" : "Safe Space"}
        </span>
        <div className="w-7 h-7" /> {/* Spacer */}
      </div>

      {isBreathing ? (
        /* Breathing Step (for panic / intent to borrow) */
        <div className="flex-1 flex flex-col justify-between py-6 select-none text-center">
          <div className="flex flex-col gap-1.5 pt-2">
            <h2 className="text-H1 font-display font-extrabold text-ink">
              Tarik napas pelan…
            </h2>
            <p className="text-caption text-ink-soft font-medium">
              lalu lepaskan perlahan.
            </p>
          </div>

          <div className="my-auto py-8 flex flex-col items-center justify-center gap-4">
            <BreathingDot size="lg" />
            <span className="text-H3 font-mono font-bold text-clay mt-4">
              00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
            </span>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-xs mx-auto pb-4 items-center">
            <p className="text-[10.5px] leading-relaxed text-ink-soft italic font-semibold max-w-xs px-2">
              Tidak ada yang perlu diputuskan dalam 60 detik ke depan.
            </p>
            
            <Link href={`/check-in?condition=${selected}`} className="w-full">
              <Button variant="warm" className="w-full font-bold">
                Aku siap lanjut
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Condition Picker Step */
        <div className="flex-1 flex flex-col justify-between select-none">
          {/* Header */}
          <div className="flex flex-col gap-1 text-left select-none">
            <h2 className="text-H2 font-display font-bold text-ink leading-tight">
              Apa yang paling kamu rasakan sekarang?
            </h2>
            <p className="text-caption text-ink-soft select-none font-semibold">
              Pilih satu. Tidak ada jawaban yang salah.
            </p>
          </div>

          {/* Condition Options List */}
          <div className="flex flex-col gap-2.5 my-auto py-3">
            {OPTIONS.map((opt) => {
              const isSelected = selected === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => handleSelect(opt.key)}
                  className={cn(
                    "p-3.5 rounded-md border flex items-center gap-3.5 select-none transition-all cursor-pointer text-left w-full",
                    isSelected
                      ? "bg-clay-tint border-clay text-ink shadow-sm scale-[1.01]"
                      : "bg-surface border-line hover:bg-canvas text-ink"
                  )}
                >
                  <span className="text-xl select-none">{opt.emoji}</span>
                  <div className="flex-1 flex flex-col leading-tight">
                    <span className={cn("text-caption font-bold", isSelected ? "text-clay font-extrabold" : "text-ink")}>
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-ink-soft font-semibold mt-0.5 leading-normal">
                      {opt.subtext}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="flex flex-col gap-3 w-full max-w-xs mx-auto pb-2 items-center select-none">
            {selected ? (
              <div className="flex flex-col gap-3.5 w-full select-none">
                <p className="text-[10.5px] leading-relaxed text-ink-soft/90 italic font-semibold text-center px-3">
                  &ldquo;Terima kasih sudah jujur. Sebelum memutuskan, ambil jeda sebentar bersama kami.&rdquo;
                </p>
                <Button variant="warm" onClick={handleAction} className="w-full font-bold">
                  {selected === "panik" || selected === "ingin-pinjam-lagi"
                    ? "Ambil jeda dulu"
                    : "Lanjutkan"}
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

