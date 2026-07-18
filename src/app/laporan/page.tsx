"use client";

// ── Laporan Jeda — laporan bulanan dari data user sendiri ────
// + Struk Jeda: bukti nilai langganan vs bunga yang tidak jadi berjalan.

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Moon, Sparkles, Lock } from "lucide-react";
import Card, { SectionTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CountUp from "@/components/ui/CountUp";
import { buildLaporan, MUSIM_META } from "@/lib/engine/laporan";
import { useJeda } from "@/lib/store";
import { persen, rupiah, rupiahShort } from "@/lib/format";

export default function LaporanPage() {
  const router = useRouter();
  const state = useJeda();

  if (!state.triage) {
    return (
      <div className="px-5 pt-2">
        <Card className="flex flex-col items-center px-6 py-10 text-center">
          <p className="font-display text-[19px] font-semibold tracking-tight">
            Laporan butuh bahan
          </p>
          <p className="mt-2 max-w-[280px] text-[13px] leading-relaxed text-ink-soft">
            Laporan Jeda disusun dari datamu sendiri. Mulai dari pemetaan dulu ya.
          </p>
          <Button className="mt-5" onClick={() => router.push(state.consentAt ? "/asesmen" : "/mulai")}>
            Mulai pemetaan <ArrowRight size={16} />
          </Button>
        </Card>
      </div>
    );
  }

  if (state.membership.plan !== "jeruk") {
    return (
      <div className="px-5 pt-2">
        <Card className="flex flex-col items-center px-6 py-8 text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-tint text-warn">
            <Lock size={20} />
          </span>
          <p className="font-display text-[19px] font-semibold tracking-tight">
            Laporan bulanan dari datamu sendiri
          </p>
          <p className="mt-2 max-w-[290px] text-[13px] leading-relaxed text-ink-soft">
            Pola jam rawanmu, DSR yang bergerak, bunga yang kamu hindari — konten
            yang tidak ada di tempat lain, karena bahannya hidupmu. Bagian dari
            paket jeruk 🍊
          </p>
          <Button className="mt-5" onClick={() => router.push("/pilihan")}>
            Lihat pilihanku <ArrowRight size={16} />
          </Button>
        </Card>
      </div>
    );
  }

  const lap = buildLaporan(state);
  const musim = MUSIM_META[lap.musim];

  return (
    <div className="px-5 pt-1">
      {/* Header musim */}
      <Card className="bg-deep p-5 text-white">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide">
            {musim.title} · {musim.range}
          </span>
          <span className="text-[11.5px] text-white/60">bulan ke-{lap.monthsIn}</span>
        </div>
        <p className="mt-3 font-display text-[22px] font-semibold leading-snug">
          Laporan Jeda — {lap.monthLabel}
        </p>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/75">{musim.focus}</p>
      </Card>

      {/* Struk Jeda */}
      <SectionTitle className="mt-6">Struk Jeda 🧾</SectionTitle>
      <Card className="mt-2.5 overflow-hidden p-0">
        <div className="flex items-baseline justify-between border-b border-dashed border-line px-5 py-3.5">
          <span className="text-[13px] text-ink-soft">
            Langganan {lap.struk.monthsSubscribed} bln × Rp9.900
          </span>
          <span className="text-[14px] font-semibold tabular-nums">
            {rupiah(lap.struk.paidTotal)}
          </span>
        </div>
        <div className="flex items-baseline justify-between border-b border-dashed border-line px-5 py-3.5">
          <span className="text-[13px] text-ink-soft">Bunga yang tidak jadi berjalan*</span>
          <span className="font-display text-[19px] font-semibold text-pine tabular-nums">
            <CountUp value={lap.struk.interestAvoided} format={(v) => rupiah(v)} />
          </span>
        </div>
        <div className="bg-pine-tint px-5 py-3.5">
          {lap.struk.ratio !== null && lap.struk.ratio >= 1 ? (
            <p className="text-[13px] font-semibold text-pine-dark">
              Jedamu menghemat {lap.struk.ratio.toFixed(1)}× harga langganannya. Jeruk
              ini balik modal. 🍊
            </p>
          ) : (
            <p className="text-[13px] font-medium text-pine-dark">
              Setiap keputusan yang dijeda menambah baris penghematan di struk ini.
            </p>
          )}
        </div>
      </Card>
      <p className="mt-1.5 px-2 text-[10.5px] text-ink-faint">
        *estimasi 90 hari pada batas bunga legal 0,1%/hari — dari {lap.jeda.tunda}{" "}
        keputusan yang kamu jeda.
      </p>

      {/* Bulan ini dalam angka */}
      <SectionTitle className="mt-6">Bulan ini, dari datamu</SectionTitle>
      <div className="mt-2.5 grid grid-cols-2 gap-2.5">
        <Card>
          <p className="font-display text-[24px] font-semibold leading-none text-pine">
            {lap.jeda.tunda}
          </p>
          <p className="mt-1.5 text-[11.5px] leading-snug text-ink-soft">
            keputusan dijeda · {rupiahShort(lap.jeda.nominalDitunda)} tetap jadi milikmu
          </p>
        </Card>
        <Card>
          <p className="font-display text-[24px] font-semibold leading-none text-pine">
            {lap.jurnal.entries}
          </p>
          <p className="mt-1.5 text-[11.5px] leading-snug text-ink-soft">
            catatan jurnal · {lap.jurnal.totalUrges} dorongan tercatat
          </p>
        </Card>
      </div>

      {lap.jurnal.found && (
        <Card className="mt-2.5 border-amber/50 bg-amber-tint">
          <div className="flex items-start gap-3">
            <Sparkles size={16} className="mt-0.5 shrink-0 text-warn" />
            <p className="text-[12.5px] leading-relaxed text-ink">
              <strong className="text-warn">Pola bulan ini:</strong>{" "}
              {lap.jurnal.nightUrges} dari {lap.jurnal.totalUrges} dorongan terjadi
              pukul 21.00–01.00 dengan mood rata-rata{" "}
              {lap.jurnal.avgMoodOnUrge?.toFixed(1)}/5 — jam rawanmu jelas. Malam
              Jeda 21.30 dipasang tepat di gerbangnya.
            </p>
          </div>
        </Card>
      )}

      {/* Keuangan */}
      {lap.keuangan && (
        <>
          <SectionTitle className="mt-6">Peta keuanganmu</SectionTitle>
          <Card className="mt-2.5">
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] text-ink-soft">Rasio cicilan (DSR)</span>
              <span className="text-[15px] font-bold tabular-nums">
                {persen(lap.keuangan.dsr)}{" "}
                <span className="text-[11px] font-medium text-ink-faint">
                  · {lap.keuangan.dsrLabel}
                </span>
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line/60">
              <div
                className="h-full rounded-full bg-warn transition-[width] duration-500 ease-out"
                style={{ width: `${Math.min(100, lap.keuangan.dsr * 100)}%` }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-ink-faint">
              Batas OJK 2026: 30% · target Musim Tegak
            </p>
            <div className="mt-3 flex items-baseline justify-between border-t border-line/70 pt-3">
              <span className="text-[13px] text-ink-soft">
                Sisa utang ({lap.keuangan.debtCount} pinjaman)
              </span>
              <span className="text-[14px] font-semibold tabular-nums">
                {rupiahShort(lap.keuangan.totalOutstanding)}
              </span>
            </div>
            <p className="mt-2 text-[10.5px] leading-relaxed text-ink-faint">
              Angka dari peta utangmu — perbarui lewat asesmen ulang agar laporan
              bergerak mengikuti kenyataan.
            </p>
          </Card>
        </>
      )}

      {/* Skrining */}
      {lap.skrining.length > 0 && (
        <Card className="mt-2.5">
          <p className="text-[13px] font-semibold">Skor skriningmu</p>
          <ul className="mt-1.5 flex flex-col gap-1">
            {lap.skrining.map((s) => (
              <li key={s} className="text-[12px] text-ink-soft">
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[10.5px] text-ink-faint">
            Cek ulang singkat dijadwalkan tiap akhir musim — bila skor tidak
            membaik, kami arahkan ke profesional.
          </p>
        </Card>
      )}

      {/* Fokus bulan depan */}
      <Card className="mt-2.5 border-pine/25 bg-pine-tint/60">
        <p className="text-[12px] font-bold uppercase tracking-wide text-pine-dark">
          Fokus bulan depan
        </p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink">{lap.nextFocus}</p>
      </Card>

      {/* Silang ke konten */}
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <Link
          href="/kelas"
          className="flex items-center gap-3 rounded-lg border border-line bg-surface p-3.5 shadow-card transition-transform duration-150 ease-out active:scale-98"
        >
          <BookOpen size={17} className="shrink-0 text-pine" />
          <span className="text-[12.5px] font-semibold leading-tight">
            Bedah Kasus minggu ini
          </span>
        </Link>
        <Link
          href="/tidur"
          className="flex items-center gap-3 rounded-lg border border-line bg-surface p-3.5 shadow-card transition-transform duration-150 ease-out active:scale-98"
        >
          <Moon size={17} className="shrink-0 text-warn" />
          <span className="text-[12.5px] font-semibold leading-tight">
            Malam Jeda · 21.30
          </span>
        </Link>
      </div>
    </div>
  );
}
