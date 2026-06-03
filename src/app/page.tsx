"use client";

import React from "react";
import Link from "next/link";
import { useJeda } from "@/lib/provider";
import Logo from "@/components/jeda/Logo";
import Button from "@/components/ui/Button";
import BreathingDot from "@/components/jeda/BreathingDot";
import DisclaimerNote from "@/components/jeda/DisclaimerNote";

export default function LandingPage() {
  const { state, isMounted } = useJeda();
  
  // A user is returning if they have at least one check-in or debt mapped.
  const isReturning = isMounted && (state.checkIns.length > 0 || state.debts.length > 0);

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-canvas select-none">
      {/* 1. Brand Header */}
      <div className="flex flex-col items-center pt-4 gap-1.5">
        <Logo size={32} variant="pine" />
        <span className="text-caption font-display font-bold tracking-widest text-pine">
          JEDA
        </span>
      </div>

      {/* 2. Hero & Value Proposition */}
      <div className="flex flex-col items-center text-center gap-3 my-auto py-6 px-1">
        {/* Breathing dot behind/above headline */}
        <BreathingDot size="md" className="mb-4" />
        
        {/* Headline */}
        <h2 className="text-H1 font-display font-extrabold text-ink leading-tight px-1">
          Berhenti sejenak sebelum memutuskan.
        </h2>
        
        {/* Subteks */}
        <p className="text-caption text-ink-soft leading-relaxed max-w-sm px-2">
          JEDA menemani kamu menata utang dengan tenang — tanpa login, tanpa dihakimi.
        </p>

        {/* 5. Tiga poin nilai mini */}
        <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-[10.5px] font-semibold text-ink-soft/90 mt-2 bg-surface/50 border border-line/40 px-3 py-1.5 rounded-full shadow-sm">
          <span>🛡️ Tanpa akun</span>
          <span className="text-line text-xs font-normal">|</span>
          <span>📱 Datamu di perangkatmu</span>
          <span className="text-line text-xs font-normal">|</span>
          <span>🕊️ Bukan pinjaman/penagih</span>
        </div>
      </div>

      {/* 6 & 7. Actions Footer */}
      <div className="flex flex-col gap-4 w-full max-w-xs mx-auto pb-2 items-center">
        <div className="flex flex-col gap-2.5 w-full">
          {/* Primary CTA */}
          <Link href="/safe-space" className="w-full">
            <Button variant="primary" className="w-full font-bold">
              Mulai dari sini
            </Button>
          </Link>

          {/* Secondary CTA (Visible only if returning) */}
          {isReturning && (
            <Link href="/home" className="w-full animate-fade-in">
              <Button variant="secondary" className="w-full font-semibold">
                Lanjutkan perjalananmu
              </Button>
            </Link>
          )}
        </div>

        {/* Small link to resources */}
        <Link href="/resources" className="text-[11px] font-bold text-pine hover:underline">
          Lihat kanal resmi
        </Link>

        {/* Disclaimer note at foot */}
        <DisclaimerNote variant="general" className="mt-2" />
      </div>
    </div>
  );
}

