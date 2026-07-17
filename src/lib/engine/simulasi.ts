// ── Simulasi biaya pinjaman (Tombol Jeda) ────────────────────
// Batas bunga pindar KONSUMTIF 2026: maks 0,1%/hari (SEOJK 19/2025,
// turunan POJK 40/2024). Total seluruh biaya maks 100% dari pokok.
// Pinjaman ilegal tidak tunduk aturan — ilustrasi umum ≥1%/hari.

export const LEGAL_DAILY_RATE = 0.001; // 0,1%/hari
export const ILLEGAL_DAILY_RATE = 0.01; // ilustrasi 1%/hari
export const WORKDAYS_PER_MONTH = 22;

export interface CostSim {
  amount: number;
  days: number;
  legalInterest: number;
  legalTotal: number;
  illegalInterest: number;
  illegalTotal: number;
  workDaysLegal: number | null; // berapa hari kerja utk melunasi total (legal)
  dailyIncome: number | null;
}

export function simulateCost(
  amount: number,
  days: number,
  monthlyIncome?: number
): CostSim {
  const legalInterest = Math.round(amount * LEGAL_DAILY_RATE * days);
  const illegalInterestRaw = Math.round(amount * ILLEGAL_DAILY_RATE * days);
  // Ilegal kerap melipatgandakan lewat "perpanjangan"; tanpa cap 100% pun kami
  // tampilkan apa adanya agar kontras terlihat.
  const legalTotal = amount + legalInterest;
  const illegalTotal = amount + illegalInterestRaw;

  const dailyIncome = monthlyIncome
    ? monthlyIncome / WORKDAYS_PER_MONTH
    : null;
  const workDaysLegal = dailyIncome ? legalTotal / dailyIncome : null;

  return {
    amount,
    days,
    legalInterest,
    legalTotal,
    illegalInterest: illegalInterestRaw,
    illegalTotal,
    workDaysLegal,
    dailyIncome,
  };
}

/** Estimasi bunga 90 hari yang tidak jadi berjalan saat user menunda. */
export function interestAvoided(amount: number, days = 90): number {
  return Math.round(amount * LEGAL_DAILY_RATE * days);
}
