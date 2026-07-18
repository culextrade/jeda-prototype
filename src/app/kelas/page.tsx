"use client";

// ── Kelas Jeda: Bedah Kasus + kurikulum Uang×Otak + Tanya Dokter ──
// Ilmu yang hanya bisa ditulis klinisi — bukan konten budgeting generik.

import React, { useState } from "react";
import { ChevronDown, Clock3, Stethoscope, Video } from "lucide-react";
import Card, { SectionTitle } from "@/components/ui/Card";
import { BEDAH_KASUS, KURIKULUM, TANYA_DOKTER } from "@/lib/content-retensi";
import { cn } from "@/lib/utils";

export default function KelasPage() {
  const [openLesson, setOpenLesson] = useState<string | null>(null);
  const kasus = BEDAH_KASUS[0];

  return (
    <div className="px-5 pt-1">
      {/* Bedah Kasus */}
      <Card className="overflow-hidden p-0">
        <div className="bg-deep px-5 pb-4 pt-4 text-white">
          <div className="flex items-center gap-2">
            <Stethoscope size={15} className="text-amber" />
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/70">
              Bedah Kasus · {kasus.edition}
            </span>
          </div>
          <p className="mt-2 font-display text-[22px] font-semibold leading-snug">
            {kasus.title}
          </p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-white/75">
            {kasus.profile}
          </p>
        </div>
        <div className="flex flex-col gap-4 px-5 py-4">
          {kasus.sections.map((s) => (
            <div key={s.heading}>
              <p className="text-[13px] font-bold text-pine-dark">{s.heading}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-ink">{s.body}</p>
            </div>
          ))}
          <div className="rounded-md bg-amber-tint px-4 py-3">
            <p className="text-[12.5px] leading-relaxed text-ink">
              <strong className="text-warn">Pelajaran kasus ini:</strong>{" "}
              {kasus.lesson}
            </p>
          </div>
          <p className="text-[10.5px] leading-relaxed text-ink-faint">
            Kasus dianonimkan & detail diubah demi privasi. Ditulis tim klinis
            JEDA dengan persetujuan; format mengikuti laporan kasus layanan
            primer.
          </p>
        </div>
      </Card>

      {/* Kurikulum */}
      <SectionTitle className="mt-6">Uang × Otak — kelas 3 menit</SectionTitle>
      <p className="mt-1 px-1 text-[12px] leading-relaxed text-ink-soft">
        Satu pelajaran baru tiap minggu. Bukan tips budgeting — cara kerja
        otakmu saat uang menipis.
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {KURIKULUM.map((k) => {
          const open = openLesson === k.id;
          return (
            <div
              key={k.id}
              className="overflow-hidden rounded-lg border border-line bg-surface shadow-card"
            >
              <button
                onClick={() => setOpenLesson(open ? null : k.id)}
                className="flex w-full items-start gap-3 p-4 text-left transition-transform duration-150 ease-out active:scale-[0.99]"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pine-tint text-[11px] font-bold text-pine-dark">
                  {k.minutes}′
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13.5px] font-semibold leading-snug">
                    {k.title}
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-snug text-ink-soft">
                    {k.hook}
                  </span>
                </span>
                <ChevronDown
                  size={16}
                  className={cn(
                    "mt-1 shrink-0 text-ink-faint transition-transform duration-200 ease-out",
                    open && "rotate-180"
                  )}
                />
              </button>
              {open && (
                <div className="fade-in flex flex-col gap-2.5 border-t border-line/70 px-4 pb-4 pt-3">
                  {k.body.map((p, i) => (
                    <p key={i} className="text-[13px] leading-relaxed text-ink">
                      {p}
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tanya Dokter */}
      <SectionTitle className="mt-6">{TANYA_DOKTER.title}</SectionTitle>
      <Card className="mt-2.5 border-clay/30 bg-clay-tint/70">
        <div className="flex items-start gap-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-clay text-white">
            <Video size={17} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-[13px] font-bold text-clay">
              <Clock3 size={13} /> {TANYA_DOKTER.schedule}
            </p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink">
              {TANYA_DOKTER.desc}
            </p>
            <p className="mt-1.5 text-[11px] text-ink-soft">{TANYA_DOKTER.note}</p>
          </div>
        </div>
      </Card>

      <p className="mt-5 text-center text-[10.5px] leading-relaxed text-ink-faint">
        Prototype: satu edisi ditampilkan sebagai contoh; jadwal rilis mingguan
        berjalan pada versi produksi.
      </p>
    </div>
  );
}
