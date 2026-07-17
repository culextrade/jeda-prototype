"use client";

// ── Mode Tenang — saat penagih menekan ───────────────────────
// Grounding singkat → kenali hak → skrip siap salin → jalur lapor.

import React, { useState } from "react";
import { Check, Copy, ExternalLink, Phone } from "lucide-react";
import Card, { SectionTitle } from "@/components/ui/Card";
import { PauseMark } from "@/components/shell/Logo";
import {
  GROUNDING_STEPS,
  HAK_KONSUMEN,
  LAPOR,
  SKRIP_DC,
} from "@/lib/content";

export default function DcPage() {
  const [copied, setCopied] = useState<number | null>(null);
  const [step, setStep] = useState(0);

  return (
    <div className="px-5 pt-1">
      {/* Grounding */}
      <Card className="bg-deep p-5 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-[19px] font-semibold leading-snug tracking-tight">
              Sedang ditelepon terus? Tarik napas dulu.
            </p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/70">
              Suara di telepon itu tidak ada di ruanganmu. Satu menit ini
              milikmu.
            </p>
          </div>
          <span className="animate-breathe mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pine">
            <PauseMark className="h-4 w-3.5" bar="bg-white" />
          </span>
        </div>
        <div className="mt-4 rounded-md bg-white/[0.08] p-3.5">
          <p className="text-[13px] font-medium leading-relaxed">
            {GROUNDING_STEPS[step]}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-1">
              {GROUNDING_STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
                    i === step ? "w-4 bg-amber" : "w-1.5 bg-white/25"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setStep((s) => (s + 1) % GROUNDING_STEPS.length)}
              className="rounded-full bg-white px-4 py-1.5 text-[12px] font-semibold text-deep transition-transform duration-150 ease-out active:scale-97"
            >
              {step < GROUNDING_STEPS.length - 1 ? "Lanjut" : "Ulangi"}
            </button>
          </div>
        </div>
      </Card>

      {/* Hak */}
      <SectionTitle className="mt-6">Kenali hakmu</SectionTitle>
      <p className="mt-1 px-1 text-[12px] leading-relaxed text-ink-soft">
        Aturan OJK & AFPI melindungimu — bahkan saat kamu menunggak.
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {HAK_KONSUMEN.map((h, i) => (
          <div
            key={h.title}
            className="rise-in rounded-lg border border-line bg-surface p-3.5 shadow-card"
            style={{ ["--d" as string]: `${i * 60}ms` } as React.CSSProperties}
          >
            <p className="text-[13.5px] font-semibold">{h.title}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-ink-soft">{h.desc}</p>
          </div>
        ))}
      </div>

      {/* Skrip */}
      <SectionTitle className="mt-6">Balas dengan skrip</SectionTitle>
      <p className="mt-1 px-1 text-[12px] text-ink-soft">
        Ketuk untuk menyalin — kirim via chat atau bacakan saat ditelepon.
      </p>
      <div className="mt-3 flex flex-col gap-2.5">
        {SKRIP_DC.map((s, i) => (
          <div key={s.title} className="rounded-lg border border-line bg-surface p-4 shadow-card">
            <p className="text-[13px] font-semibold text-pine-dark">{s.title}</p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink">“{s.text}”</p>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(s.text);
                setCopied(i);
                setTimeout(() => setCopied(null), 1500);
              }}
              className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-pine px-4 py-1.5 text-[11.5px] font-semibold text-white transition-transform duration-150 ease-out active:scale-97"
            >
              {copied === i ? <Check size={12} /> : <Copy size={12} />}
              {copied === i ? "Tersalin!" : "Salin skrip"}
            </button>
          </div>
        ))}
      </div>

      {/* Lapor */}
      <SectionTitle className="mt-6">Bila pelanggaran berlanjut</SectionTitle>
      <div className="mt-3 flex flex-col gap-2">
        {LAPOR.map((l) => (
          <a
            key={l.name}
            href={l.href}
            target={l.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="flex items-center gap-3.5 rounded-lg border border-line bg-surface p-4 shadow-card transition-transform duration-150 ease-out active:scale-98"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger-tint text-danger">
              {l.href.startsWith("tel") ? <Phone size={17} /> : <ExternalLink size={17} />}
            </span>
            <span className="flex-1">
              <span className="block text-[13.5px] font-semibold">{l.name}</span>
              <span className="text-[11.5px] text-ink-soft">{l.detail}</span>
            </span>
          </a>
        ))}
      </div>

      <p className="mt-5 rounded-md bg-clay-tint px-4 py-3 text-[11.5px] leading-relaxed text-clay">
        Penagihan yang menekan bisa terasa seperti serangan — jantung berdebar,
        tangan dingin. Itu respons tubuh yang normal, bukan tanda kamu lemah.
        Kalau tekanan terasa tak tertahankan,{" "}
        <a href="/krisis" className="font-bold underline underline-offset-2">
          bantuan 24 jam ada di sini
        </a>
        .
      </p>
    </div>
  );
}
