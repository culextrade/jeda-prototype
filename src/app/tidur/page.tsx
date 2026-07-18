"use client";

// ── Modul tidur — insomnia = kompetensi 4A layanan primer ────
// Kurang tidur ↔ kendali impuls ↔ keputusan finansial: dua arah.

import React, { useState } from "react";
import Link from "next/link";
import { Check, Moon, Play, Radio } from "lucide-react";
import Card, { SectionTitle } from "@/components/ui/Card";
import { SLEEP_STEPS } from "@/lib/content";
import { MALAM_JEDA } from "@/lib/content-retensi";
import { cn } from "@/lib/utils";

export default function TidurPage() {
  const [done, setDone] = useState<boolean[]>(SLEEP_STEPS.map(() => false));

  return (
    <div className="px-5 pt-1">
      <Card className="bg-deep p-5 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-[20px] font-semibold leading-snug tracking-tight">
              Tidur bukan kemewahan.
              <br />
              Tidur itu rem impulsmu.
            </p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-white/70">
              Kurang tidur melemahkan bagian otak yang menahan keputusan
              impulsif — dan tagihan yang menumpuk merampas tidurmu. Dua arah,
              saling mengunci. Kita putus dari sisi yang paling bisa kamu
              kendalikan malam ini.
            </p>
          </div>
          <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/12">
            <Moon size={19} className="text-amber" />
          </span>
        </div>
      </Card>

      <SectionTitle className="mt-6">4 langkah minggu ini</SectionTitle>
      <p className="mt-1 px-1 text-[12px] leading-relaxed text-ink-soft">
        Higiene tidur — protokol standar layanan primer, bukan tips acak.
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {SLEEP_STEPS.map((s, i) => (
          <button
            key={s.title}
            onClick={() =>
              setDone((prev) => prev.map((v, j) => (i === j ? !v : v)))
            }
            className="flex items-start gap-3 rounded-lg border border-line bg-surface p-4 text-left shadow-card transition-transform duration-150 ease-out active:scale-98"
          >
            <span
              className={cn(
                "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[9px] border-2 transition-colors duration-150",
                done[i] ? "border-pine bg-pine text-white" : "border-line bg-canvas"
              )}
            >
              {done[i] && <Check size={13} strokeWidth={3.5} />}
            </span>
            <span>
              <span
                className={cn(
                  "block text-[13.5px] font-semibold",
                  done[i] && "text-ink-faint line-through"
                )}
              >
                {s.title}
              </span>
              <span className="mt-0.5 block text-[12px] leading-relaxed text-ink-soft">
                {s.desc}
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* Malam Jeda 21.30 */}
      <SectionTitle className="mt-6">Malam Jeda</SectionTitle>
      <Card className="mt-2.5 overflow-hidden bg-deep p-0 text-white">
        <div className="flex items-center gap-2.5 px-5 pt-4">
          <Radio size={14} className="animate-pulse-soft text-amber" />
          <span className="text-[11.5px] font-bold uppercase tracking-[0.1em] text-amber">
            {MALAM_JEDA.time}
          </span>
        </div>
        <p className="px-5 pt-2 text-[12.5px] leading-relaxed text-white/75">
          {MALAM_JEDA.why}
        </p>
        <div className="mt-3.5 flex flex-col">
          {MALAM_JEDA.tracks.map((t, i) => (
            <div
              key={t.title}
              className={cn(
                "flex items-center gap-3.5 px-5 py-3",
                i > 0 && "border-t border-white/10"
              )}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/12">
                <Play size={13} className="ml-0.5" />
              </span>
              <span className="flex-1 text-[13px] font-medium">{t.title}</span>
              <span className="text-[11.5px] tabular-nums text-white/55">
                {t.minutes} mnt
              </span>
            </div>
          ))}
        </div>
        <p className="border-t border-white/10 px-5 py-3 text-[10.5px] text-white/45">
          Pemutar audio disimulasikan pada prototype — naskah & rekaman versi
          produksi disusun tim klinis.
        </p>
      </Card>

      <Link
        href="/jeda"
        className="mt-4 flex items-center justify-between rounded-lg bg-pine p-4 text-white shadow-card transition-transform duration-150 ease-out active:scale-98"
      >
        <div>
          <p className="text-[13.5px] font-semibold">Sulit lepas dari HP jam segini?</p>
          <p className="mt-0.5 text-[11.5px] text-white/75">
            Latihan napas 90 detik — pintu menuju kasur
          </p>
        </div>
        <span className="text-[18px]">→</span>
      </Link>

      <p className="mt-5 rounded-md border border-line/70 bg-surface/60 px-4 py-3 text-[11.5px] leading-relaxed text-ink-soft">
        <strong>Kenapa modul ini ada di aplikasi keuangan?</strong> Insomnia
        adalah satu dari sedikit kondisi yang menurut standar kompetensi dokter
        Indonesia (SKDI) dapat dituntaskan mandiri di layanan primer — dan tim
        JEDA berlatar belakang klinis. Kalau 2 minggu belum membaik, kami
        arahkan ke fasilitas kesehatan.
      </p>
    </div>
  );
}
