"use client";

// ── Layar pilihan — autonomy-supportive ──────────────────────
// Skrining, protokol krisis, dan rujukan SELALU gratis.
// Yang berbayar: rencana + pendampingan ("harga jeruk", commitment device).

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, ExternalLink } from "lucide-react";
import Button from "@/components/ui/Button";
import Sheet from "@/components/ui/Sheet";
import { chooseExternal, chooseJeda, useJeda } from "@/lib/store";
import { DIREKTORI_RUJUKAN } from "@/lib/content";
import { JALUR_META } from "@/lib/engine/triage";

export default function PilihanPage() {
  const router = useRouter();
  const state = useJeda();
  const [dirOpen, setDirOpen] = useState(false);

  useEffect(() => {
    if (!state.triage) router.replace("/asesmen");
  }, [state.triage, router]);

  if (!state.triage) return null;
  const jalur = state.triage.jalur;
  const preventif = jalur === "preventif";

  const benefits = preventif
    ? [
        "Tombol Jeda + counter dampak pribadimu",
        "Rutinitas jaga arus kas & bantalan mikro",
        "Jurnal mood×uang + deteksi pola dini",
        "Check-in bulanan — kami pantau sebelum jadi masalah",
      ]
    : [
        "Rencana pemulihan personal — urutan utang + 4 minggu pertama",
        "Skrip negosiasi & perisai hak konsumen saat ditagih",
        jalur === "kuratif"
          ? "Jurnal terpandu untuk menemukan akar masalahmu"
          : "Modul yang menyasar akar masalahmu (CBT mikro, tidur)",
        "Check-in mingguan + rujukan terarah bila perlu",
      ];

  return (
    <div className="flex h-full flex-col bg-canvas">
      <main className="flex-1 overflow-y-auto px-6 pb-4 pt-8">
        <p className="rise-in text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
          Jalur {JALUR_META[jalur].title}
        </p>
        <h1
          className="rise-in mt-1 font-display text-[27px] font-semibold leading-tight tracking-tight"
          style={{ ["--d" as string]: "70ms" }}
        >
          Langkah berikutnya —{" "}
          <em className="italic">kamu yang pegang kemudinya</em>
        </h1>

        {/* Opsi A: lanjut bareng JEDA */}
        <div
          className="rise-in mt-6 overflow-hidden rounded-xl border border-pine/25 bg-surface shadow-card"
          style={{ ["--d" as string]: "160ms" }}
        >
          <div className="bg-pine px-5 pb-4 pt-4 text-white">
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-semibold">
                {preventif ? "Jaga kondisi bareng JEDA" : "Pulih bareng JEDA"}
              </p>
              <span className="text-xl">🍊</span>
            </div>
            <p className="mt-1.5 text-[13px] text-white/85">
              <span className="font-display text-[20px] font-semibold">Rp9.900</span>
              <span className="text-white/70"> /bulan — seharga sebiji jeruk</span>
            </p>
          </div>
          <ul className="flex flex-col gap-2.5 px-5 py-4">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink">
                <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-pine-tint text-pine">
                  <Check size={11} strokeWidth={3.5} />
                </span>
                {b}
              </li>
            ))}
          </ul>
          <div className="px-5 pb-5">
            <Button
              full
              onClick={() => {
                chooseJeda();
                router.push(preventif ? "/home" : "/rencana");
              }}
            >
              {preventif ? "Mulai jaga kondisiku" : "Susun rencanaku"}{" "}
              <ArrowRight size={17} />
            </Button>
            <p className="mt-2 text-center text-[10.5px] text-ink-faint">
              Prototype: pembayaran disimulasikan — tidak ada transaksi nyata.
            </p>
          </div>
        </div>

        {/* Opsi B: jalan lain */}
        <button
          onClick={() => setDirOpen(true)}
          className="rise-in mt-3 w-full rounded-xl border border-line bg-surface/70 px-5 py-4 text-left transition-transform duration-150 ease-out active:scale-98"
          style={{ ["--d" as string]: "260ms" }}
        >
          <p className="text-[14px] font-semibold text-ink">
            Punya rencana lain? Sama baiknya.
          </p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">
            Kami siapkan direktori bantuan resmi & gratis — psikolog Puskesmas,
            Healing119, kanal OJK. Tanpa syarat apa pun.
          </p>
        </button>

        <p
          className="fade-in mt-5 rounded-md bg-pine-tint/70 px-4 py-3 text-center text-[11.5px] leading-relaxed text-pine-dark"
          style={{ ["--d" as string]: "380ms" }}
        >
          Apa pun pilihanmu: <strong>skrining, protokol krisis, dan rujukan
          selalu gratis</strong> — tidak pernah ada di balik pembayaran.
        </p>
      </main>

      {/* Direktori rujukan */}
      <Sheet open={dirOpen} onClose={() => setDirOpen(false)} title="Direktori bantuan gratis">
        <div className="flex flex-col gap-2 pb-2">
          {DIREKTORI_RUJUKAN.map((d) => (
            <a
              key={d.name}
              href={d.href}
              target={d.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="flex items-center gap-3 rounded-md border border-line bg-canvas/60 px-4 py-3 transition-transform duration-150 ease-out active:scale-98"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold text-ink">{d.name}</p>
                <p className="text-[11.5px] text-ink-soft">{d.detail}</p>
              </div>
              <ExternalLink size={15} className="shrink-0 text-ink-faint" />
            </a>
          ))}
          <Button
            variant="soft"
            full
            className="mt-2"
            onClick={() => {
              chooseExternal();
              router.push("/home");
            }}
          >
            Mengerti — aku tetap bisa pakai alat gratis JEDA
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
