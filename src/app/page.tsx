"use client";

// ── Landing: hook "Jeda dulu." ───────────────────────────────

import React from "react";
import { useRouter } from "next/navigation";
import { useJeda } from "@/lib/store";
import { PauseMark } from "@/components/shell/Logo";

export default function LandingPage() {
  const router = useRouter();
  const state = useJeda();
  const returning = !!state.consentAt;

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-deep text-white">
      {/* Glow lembut */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[26%] h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(31,111,101,0.55) 0%, rgba(15,43,38,0) 65%)",
        }}
      />

      <header className="fade-in z-10 flex items-center justify-between px-6 pt-6">
        <span className="inline-flex items-center gap-2">
          <PauseMark className="h-[17px] w-[14px]" bar="bg-white/90" />
          <span className="font-display text-[19px] font-semibold tracking-tight">
            jeda
          </span>
        </span>
        <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-medium text-white/60">
          prototype
        </span>
      </header>

      <main className="z-10 flex flex-1 flex-col items-center justify-center px-7 text-center">
        {/* Tanda jeda bernapas */}
        <div className="relative mb-10 flex h-28 w-28 items-center justify-center">
          <span className="animate-breathe-halo absolute inset-0 rounded-full bg-pine/50" />
          <span className="animate-breathe flex h-20 w-20 items-center justify-center rounded-full bg-pine shadow-float">
            <PauseMark className="h-7 w-6" bar="bg-white" />
          </span>
        </div>

        <h1
          className="rise-in font-display text-[44px] font-medium leading-[1.05] tracking-tight"
          style={{ ["--d" as string]: "120ms" }}
        >
          Jeda dulu<span className="text-amber">.</span>
        </h1>
        <p
          className="rise-in mt-5 max-w-[300px] text-[15px] leading-relaxed text-white/75"
          style={{ ["--d" as string]: "240ms" }}
        >
          Sebelum pinjaman berikutnya, sebelum notifikasi tagihan berikutnya —
          beri dirimu beberapa menit untuk melihat semuanya dengan jernih.
        </p>
        <p
          className="rise-in mt-6 max-w-[320px] text-[12.5px] leading-relaxed text-white/45"
          style={{ ["--d" as string]: "360ms" }}
        >
          Lebih dari Rp4,6 triliun pinjaman daring macet hari ini. Di baliknya:
          orang-orang yang diteror penagih, gali lubang tutup lubang, dan
          bingung harus mulai dari mana.
        </p>
      </main>

      <footer className="z-10 flex flex-col gap-2.5 px-6 pb-8">
        <button
          onClick={() => router.push(returning && state.triage ? "/home" : "/mulai")}
          className="rise-in min-h-[54px] w-full rounded-full bg-white text-[15px] font-semibold text-deep transition-transform duration-150 ease-out active:scale-97"
          style={{ ["--d" as string]: "440ms" }}
        >
          {returning && state.triage ? "Lanjutkan perjalananku" : "Mulai — gratis & tanpa akun"}
        </button>
        <button
          onClick={() => router.push("/dc")}
          className="rise-in min-h-[46px] w-full rounded-full border border-white/20 text-[13.5px] font-medium text-white/80 transition-transform duration-150 ease-out active:scale-97"
          style={{ ["--d" as string]: "520ms" }}
        >
          Aku sedang ditagih & panik →
        </button>
        <p
          className="fade-in mt-2 text-center text-[11px] text-white/40"
          style={{ ["--d" as string]: "640ms" }}
        >
          Bukan alat diagnosis · Data tinggal di perangkatmu, bukan di server kami
        </p>
      </footer>
    </div>
  );
}
