// ── Beban finansial: DSR + flag risiko ──────────────────────
// Ambang 30% selaras batas cicilan-terhadap-penghasilan OJK 2026.

import { Finance, Sev } from "../types";

export interface FinanceSummary {
  totalOutstanding: number;
  totalInstallment: number;
  dsr: number; // 0..n (0.45 = 45%)
  dsrBandLabel: "terkendali" | "melewati batas OJK" | "kritis";
  flags: string[];
  burden: Sev;
  reasons: string[];
}

export function dsrOf(f: Finance): number {
  if (!f.income) return 0;
  const totalInstallment = f.debts.reduce((t, d) => t + d.installment, 0);
  return totalInstallment / f.income;
}

export function summarizeFinance(f: Finance): FinanceSummary {
  const totalOutstanding = f.debts.reduce((t, d) => t + d.outstanding, 0);
  const totalInstallment = f.debts.reduce((t, d) => t + d.installment, 0);
  const dsr = f.income ? totalInstallment / f.income : 0;

  // Skor DSR: <30% = 0 · 30–50% = 1 · >50% = 2
  const dsrScore = dsr < 0.3 ? 0 : dsr <= 0.5 ? 1 : 2;
  const dsrBandLabel =
    dsrScore === 0 ? "terkendali" : dsrScore === 1 ? "melewati batas OJK" : "kritis";

  const flags: string[] = [];
  if (f.debts.some((d) => d.licensed === "tidak"))
    flags.push("Ada pinjaman tidak berizin");
  if (f.debts.some((d) => d.licensed === "tidak-tahu"))
    flags.push("Ada pinjaman yang belum dicek izinnya");
  if (f.debts.some((d) => d.overdue)) flags.push("Ada tunggakan berjalan");
  if (f.debts.some((d) => d.harshCollection))
    flags.push("Mengalami penagihan kasar");
  if (f.borrowToRepay) flags.push("Pinjam untuk menutup utang lama");

  const seriousFlags = flags.filter(
    (fl) => fl !== "Ada pinjaman yang belum dicek izinnya"
  ).length;

  // Aturan indeks beban (transparan, lihat /hasil):
  // beban = skor DSR (0–2) + 1 bila ada flag serius; ≥3 flag serius = langsung 3
  let burden = Math.min(3, dsrScore + (seriousFlags > 0 ? 1 : 0)) as Sev;
  if (seriousFlags >= 3) burden = 3;

  const reasons: string[] = [];
  reasons.push(
    `Cicilan Rp${Math.round(totalInstallment / 1000)} rb/bln dari penghasilan Rp${Math.round(
      f.income / 1000
    )} rb → DSR ${(dsr * 100).toFixed(0)}% (${dsrBandLabel}; batas OJK 2026: 30%)`
  );
  flags.forEach((fl) => reasons.push(fl));

  return {
    totalOutstanding,
    totalInstallment,
    dsr,
    dsrBandLabel,
    flags,
    burden,
    reasons,
  };
}
