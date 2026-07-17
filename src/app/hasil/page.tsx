"use client";

// ── Hasil: 3 langkah — Insight → Peta Kondisi → Jalur ────────
// "Ini bukan karena kamu bodoh mengatur uang — ini siklus, dan siklus bisa diputus."

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { StepDots } from "@/components/ui/Progress";
import CycleDiagram, { CycleNode } from "@/components/hasil/CycleDiagram";
import MatrixMap from "@/components/hasil/MatrixMap";
import { useJeda } from "@/lib/store";
import { summarizeFinance } from "@/lib/engine/finance";
import { summarizeScreening, phq9Label, gad7Label } from "@/lib/engine/screening";
import { JALUR_META } from "@/lib/engine/triage";
import { rupiahShort, persen } from "@/lib/format";
import { cn } from "@/lib/utils";

const SEV_LABEL = ["minimal", "ringan", "sedang", "berat"];

export default function HasilPage() {
  const router = useRouter();
  const state = useJeda();
  const [step, setStep] = useState(0);
  const [showWhy, setShowWhy] = useState(false);

  useEffect(() => {
    if (!state.assessment || !state.triage) router.replace("/asesmen");
  }, [state.assessment, state.triage, router]);

  if (!state.assessment || !state.triage) return null;

  const a = state.assessment;
  const t = state.triage;
  const fin = summarizeFinance(a.finance);
  const scr = summarizeScreening(a.screening);
  const meta = JALUR_META[t.jalur];

  const mentalLine = [
    scr.phq9Total !== null ? `suasana hati ${phq9Label(scr.phq9Total)}` : null,
    scr.gad7Total !== null ? `kecemasan ${gad7Label(scr.gad7Total)}` : null,
    scr.insomniaFlag ? "sulit tidur" : null,
  ]
    .filter(Boolean)
    .join(", ");

  const cycleNodes: CycleNode[] = [
    {
      label: "Beban utang menumpuk",
      data: a.finance.debts.length
        ? `${a.finance.debts.length} pinjaman · sisa ${rupiahShort(fin.totalOutstanding)} · cicilan ${persen(fin.dsr)} dari penghasilanmu`
        : "Tekanan keuangan sehari-hari",
      tone: "amber",
    },
    {
      label: "Pikiran ikut terbebani",
      data: mentalLine || "Cemas dan lelah menghadapi tagihan",
      tone: "clay",
    },
    {
      label: "Saat lelah, keputusan memburuk",
      data: a.finance.borrowToRepay
        ? "Termasuk pinjam untuk menutup pinjaman lama"
        : "Impuls makin sulit direm",
      tone: "deep",
    },
    {
      label: "Utang baru terasa seperti satu-satunya jalan",
      data: "…dan siklus berputar lagi",
      tone: "pine",
    },
  ];

  const steps = [
    // ── Step 0: Insight ──
    <div key="insight" className="flex flex-1 flex-col">
      <h1 className="rise-in font-display text-[26px] font-semibold leading-tight tracking-tight">
        Ini bukan karena kamu{" "}
        <em className="font-display italic text-clay">bodoh mengatur uang</em>
      </h1>
      <p
        className="rise-in mt-2 text-[13.5px] leading-relaxed text-ink-soft"
        style={{ ["--d" as string]: "90ms" }}
      >
        Dari jawabanmu, beginilah siklus yang sedang bekerja — dua arah, saling
        mengunci:
      </p>
      <div className="mt-5">
        <CycleDiagram nodes={cycleNodes} />
      </div>
      <p
        className="fade-in mt-5 rounded-md bg-pine-tint px-4 py-3 text-[12.5px] leading-relaxed text-pine-dark"
        style={{ ["--d" as string]: "600ms" }}
      >
        Kabar baiknya: <strong>siklus bisa diputus</strong> — dan tidak harus
        di semua titik sekaligus. Cukup satu titik dulu, yang paling tepat
        untukmu.
      </p>
    </div>,

    // ── Step 1: Peta Kondisi ──
    <div key="peta" className="flex flex-1 flex-col">
      <h1 className="rise-in font-display text-[26px] font-semibold leading-tight tracking-tight">
        Peta kondisimu
      </h1>
      <p
        className="rise-in mt-2 text-[13.5px] leading-relaxed text-ink-soft"
        style={{ ["--d" as string]: "90ms" }}
      >
        Dua sumbu: beban finansial dan distres psikologis. Titik ini dihitung
        dari jawabanmu — bukan tebakan.
      </p>
      <Card className="rise-in mt-5 p-3" style={{ ["--d" as string]: "180ms" } as React.CSSProperties}>
        <MatrixMap burden={t.burden} distress={t.distress} />
      </Card>

      <button
        onClick={() => setShowWhy((v) => !v)}
        className="rise-in mt-4 flex items-center justify-between rounded-md border border-line bg-surface px-4 py-3 text-[13.5px] font-semibold text-ink transition-transform duration-150 ease-out active:scale-98"
        style={{ ["--d" as string]: "260ms" } as React.CSSProperties}
      >
        Kenapa aku ada di titik ini?
        <ChevronDown
          size={16}
          className={cn("transition-transform duration-200 ease-out", showWhy && "rotate-180")}
        />
      </button>
      {showWhy && (
        <ul className="fade-in mt-2 flex flex-col gap-1.5 rounded-md bg-surface px-4 py-3">
          {t.reasons.map((r, i) => (
            <li key={i} className="flex gap-2 text-[12.5px] leading-relaxed text-ink-soft">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-pine" />
              {r}
            </li>
          ))}
          <li className="mt-1 text-[11.5px] italic text-ink-faint">
            Semua aturan penilaian terbuka — tidak ada kotak hitam.
          </li>
        </ul>
      )}
    </div>,

    // ── Step 2: Jalur ──
    <div key="jalur" className="flex flex-1 flex-col">
      <p className="rise-in text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
        Jalurmu saat ini
      </p>
      <h1
        className="rise-in mt-1 font-display text-[34px] font-semibold leading-tight tracking-tight"
        style={{ ["--d" as string]: "80ms" }}
      >
        {meta.title}
        <span className="text-amber">.</span>
      </h1>
      <p
        className="rise-in mt-3 text-[14px] leading-relaxed text-ink-soft"
        style={{ ["--d" as string]: "160ms" }}
      >
        {meta.desc}
      </p>

      <div className="mt-5 flex flex-col gap-2.5">
        {(
          [
            {
              key: "preventif",
              title: "Preventif",
              desc: "Kondisi baik → jaga: Tombol Jeda, arus kas, bantalan mikro.",
            },
            {
              key: "kuratif",
              title: "Kuratif",
              desc: "Akar belum jelas → telusuri: jurnal mood×uang + eksplorasi pola.",
            },
            {
              key: "rehabilitatif",
              title: "Rehabilitatif",
              desc: "Akar diketahui → pulihkan: rencana utang + modul mental yang menyasar akar.",
            },
          ] as const
        ).map((j, i) => (
          <div
            key={j.key}
            className={cn(
              "rise-in rounded-lg border px-4 py-3",
              j.key === t.jalur
                ? "border-pine bg-pine text-white shadow-card"
                : "border-line/80 bg-surface/60 opacity-70"
            )}
            style={{ ["--d" as string]: `${240 + i * 90}ms` } as React.CSSProperties}
          >
            <p className="text-[14px] font-semibold">
              {j.title}
              {j.key === t.jalur && (
                <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-[10.5px] font-semibold">
                  kamu di sini
                </span>
              )}
            </p>
            <p
              className={cn(
                "mt-1 text-[12px] leading-relaxed",
                j.key === t.jalur ? "text-white/85" : "text-ink-soft"
              )}
            >
              {j.desc}
            </p>
          </div>
        ))}
      </div>

      <p
        className="fade-in mt-4 text-[11.5px] leading-relaxed text-ink-faint"
        style={{ ["--d" as string]: "560ms" }}
      >
        Jalur bukan label permanen. Kuratif bisa naik ke rehabilitatif begitu
        akarnya ketemu — dan itu sering terjadi dalam 1–2 minggu pertama.
      </p>
    </div>,
  ];

  return (
    <div className="flex h-full flex-col bg-canvas">
      <header className="flex items-center justify-between px-5 pb-2 pt-5">
        <StepDots total={3} current={step} />
        <span className="text-[11px] font-medium text-ink-faint">
          {step + 1} / 3
        </span>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-4 pt-2">{steps[step]}</main>

      <footer className="flex gap-2.5 px-6 pb-7 pt-2">
        {step > 0 && (
          <Button variant="secondary" className="w-[92px]" onClick={() => setStep((s) => s - 1)}>
            Balik
          </Button>
        )}
        <Button
          full
          onClick={() => {
            if (step < 2) {
              setStep((s) => s + 1);
              setShowWhy(false);
            } else {
              router.push("/pilihan");
            }
          }}
        >
          {step === 0 && "Lalu aku mulai dari mana?"}
          {step === 1 && "Lihat jalurku"}
          {step === 2 && "Pilih langkah berikutnya"}
        </Button>
      </footer>
    </div>
  );
}
