// ── Laporan Jeda: laporan bulanan dari data user sendiri ─────
// Inilah konten yang tidak ada di tempat lain — bahannya hidup user.
// Deterministik & transparan, seperti engine lain di JEDA.

import { JedaState } from "../types";
import { summarizeFinance } from "./finance";
import { summarizeScreening } from "./screening";
import { journalInsight, JournalInsight } from "./journal";

export type Musim = "pulih" | "tegak" | "tumbuh";

export const MUSIM_META: Record<
  Musim,
  { title: string; range: string; focus: string }
> = {
  pulih: {
    title: "Musim Pulih",
    range: "bulan 1–3",
    focus: "Keluar dari mode krisis: hentikan utang baru, redakan tekanan penagihan, tidur mulai membaik.",
  },
  tegak: {
    title: "Musim Tegak",
    range: "bulan 4–6",
    focus: "Berdiri stabil: DSR turun ke bawah 30%, tunggakan terurai, pola impulsif terkendali.",
  },
  tumbuh: {
    title: "Musim Tumbuh",
    range: "bulan 7+",
    focus: "Membangun ke depan: bantalan darurat, kesehatan skor, dan kebiasaan yang bertahan tanpa JEDA.",
  },
};

export interface Struk {
  monthsSubscribed: number; // min 1
  paidTotal: number;
  interestAvoided: number;
  ratio: number | null; // hemat ÷ bayar
}

export interface LaporanJeda {
  monthLabel: string; // "Juli 2026"
  musim: Musim;
  monthsIn: number; // bulan ke-n bersama JEDA (min 1)
  struk: Struk;
  jeda: {
    tunda: number;
    lanjut: number;
    nominalDitunda: number;
  };
  jurnal: JournalInsight & { entries: number };
  keuangan: {
    dsr: number;
    dsrLabel: string;
    totalOutstanding: number;
    totalInstallment: number;
    debtCount: number;
  } | null;
  skrining: string[]; // baris ringkasan instrumen dari asesmen
  nextFocus: string;
}

const HARGA_JERUK = 9_900;

function monthsBetween(fromIso: string | undefined, now: Date): number {
  if (!fromIso) return 1;
  const from = new Date(fromIso);
  const m =
    (now.getFullYear() - from.getFullYear()) * 12 +
    (now.getMonth() - from.getMonth());
  return Math.max(1, m + 1); // bulan berjalan dihitung
}

export function buildLaporan(state: JedaState, now = new Date()): LaporanJeda {
  const monthsIn = monthsBetween(state.consentAt, now);
  const musim: Musim = monthsIn <= 3 ? "pulih" : monthsIn <= 6 ? "tegak" : "tumbuh";

  const tundaEvents = state.jedaEvents.filter((e) => e.decision === "tunda");
  const interestAvoided = tundaEvents.reduce((s, e) => s + e.interestAvoided, 0);
  const monthsSubscribed =
    state.membership.plan === "jeruk"
      ? monthsBetween(state.membership.since, now)
      : 0;
  const paidTotal = monthsSubscribed * HARGA_JERUK;

  const ji = journalInsight(state.journal);

  const fin = state.assessment ? summarizeFinance(state.assessment.finance) : null;
  const scr = state.assessment
    ? summarizeScreening(state.assessment.screening)
    : null;

  const nextFocus =
    musim === "pulih"
      ? "Bulan depan kita jaga: nol pinjaman baru, satu negosiasi selesai, jurnal tetap jalan."
      : musim === "tegak"
        ? "Bulan depan kita kejar: DSR turun di bawah 30% dan tunggakan pertama lunas."
        : "Bulan depan kita bangun: bantalan darurat naik dan satu kebiasaan berdiri tanpa pengingat.";

  return {
    monthLabel: now.toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
    musim,
    monthsIn,
    struk: {
      monthsSubscribed,
      paidTotal,
      interestAvoided,
      ratio: paidTotal > 0 ? interestAvoided / paidTotal : null,
    },
    jeda: {
      tunda: tundaEvents.length,
      lanjut: state.jedaEvents.length - tundaEvents.length,
      nominalDitunda: tundaEvents.reduce((s, e) => s + e.amount, 0),
    },
    jurnal: { ...ji, entries: state.journal.length },
    keuangan: fin
      ? {
          dsr: fin.dsr,
          dsrLabel: fin.dsrBandLabel,
          totalOutstanding: fin.totalOutstanding,
          totalInstallment: fin.totalInstallment,
          debtCount: state.assessment!.finance.debts.length,
        }
      : null,
    skrining: scr?.lines ?? [],
    nextFocus,
  };
}
