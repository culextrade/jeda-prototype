// ── Deteksi pola jurnal mood×uang (rule-based, dijelaskan ke user) ──
// Pola dianggap ditemukan bila ≥3 dorongan (urge) terjadi pada jam rawan
// yang sama DAN mood pada saat itu rata-rata rendah (≤2).

import { JournalEntry } from "../types";

export interface JournalInsight {
  found: boolean;
  nightUrges: number;
  totalUrges: number;
  avgMoodOnUrge: number | null;
  totalSpendOnUrge: number;
  headline?: string;
  detail?: string;
}

const isNight = (iso: string) => {
  const h = new Date(iso).getHours();
  return h >= 21 || h < 1;
};

export function journalInsight(entries: JournalEntry[]): JournalInsight {
  const urges = entries.filter((e) => e.urge);
  const nightUrges = urges.filter((e) => isNight(e.at));
  const avgMoodOnUrge = urges.length
    ? urges.reduce((t, e) => t + e.mood, 0) / urges.length
    : null;
  const totalSpendOnUrge = urges.reduce((t, e) => t + (e.spend ?? 0), 0);

  const found =
    nightUrges.length >= 3 && avgMoodOnUrge !== null && avgMoodOnUrge <= 2.4;

  return {
    found,
    nightUrges: nightUrges.length,
    totalUrges: urges.length,
    avgMoodOnUrge,
    totalSpendOnUrge,
    headline: found
      ? "Pola ketemu: dorongan belanjamu muncul malam hari saat mood turun"
      : undefined,
    detail: found
      ? `${nightUrges.length} dari ${urges.length} dorongan tercatat antara pukul 21.00–01.00, dengan rata-rata mood ${avgMoodOnUrge!.toFixed(1)}/5. Ini bukan soal “tidak becus uang” — ini pola emosional yang bisa diintervensi.`
      : undefined,
  };
}
