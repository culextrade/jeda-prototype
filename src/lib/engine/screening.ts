// ── Instrumen skrining (domain publik: Kroenke, Spitzer, Williams) ──
// Adaptasi Bahasa Indonesia. JEDA melakukan SKRINING, bukan diagnosis.
// Skoring mengikuti cut-off baku sehingga hasil dapat ditelusuri.

import { AnswerValue, Screening, Sev } from "../types";

export const FREQ_OPTIONS: { value: AnswerValue; label: string; hint: string }[] = [
  { value: 0, label: "Tidak pernah", hint: "0 hari" },
  { value: 1, label: "Beberapa hari", hint: "1–6 hari" },
  { value: 2, label: "Lebih dari separuh hari", hint: "7–11 hari" },
  { value: 3, label: "Hampir setiap hari", hint: "12–14 hari" },
];

export const PHQ9_ITEMS = [
  "Kurang berminat atau kurang bisa menikmati apa pun",
  "Merasa murung, sedih, atau putus asa",
  "Sulit tidur, mudah terbangun, atau justru tidur berlebihan",
  "Merasa lelah atau kurang bertenaga",
  "Kurang nafsu makan, atau makan berlebihan",
  "Merasa buruk tentang diri sendiri — merasa gagal atau mengecewakan keluarga",
  "Sulit berkonsentrasi pada sesuatu, misalnya membaca atau menonton",
  "Bergerak atau berbicara sangat lambat sampai orang lain menyadarinya — atau sebaliknya, sangat gelisah",
  "Berpikir bahwa lebih baik mati, atau ingin menyakiti diri sendiri",
] as const;

export const GAD7_ITEMS = [
  "Merasa gugup, cemas, atau tegang",
  "Tidak mampu menghentikan atau mengendalikan rasa khawatir",
  "Terlalu mengkhawatirkan berbagai hal",
  "Sulit merasa santai",
  "Sangat gelisah sampai sulit duduk diam",
  "Mudah tersinggung atau mudah marah",
  "Merasa takut, seolah sesuatu yang buruk akan terjadi",
] as const;

// PHQ-4 = GAD-2 (2 item pertama GAD-7) + PHQ-2 (2 item pertama PHQ-9)
export const PHQ4_ITEMS = [
  GAD7_ITEMS[0],
  GAD7_ITEMS[1],
  PHQ9_ITEMS[0],
  PHQ9_ITEMS[1],
] as const;

const sum = (a: AnswerValue[] | null): number =>
  a ? a.reduce<number>((t, v) => t + v, 0) : 0;

// ── PHQ-4 ──
export function phq4Anxiety(phq4: AnswerValue[]): number {
  return phq4[0] + phq4[1];
}
export function phq4Depression(phq4: AnswerValue[]): number {
  return phq4[2] + phq4[3];
}
/** Subskala ≥3 = positif → lanjut instrumen penuh (aturan baku PHQ-4). */
export function needsGad7(phq4: AnswerValue[]): boolean {
  return phq4Anxiety(phq4) >= 3;
}
export function needsPhq9(phq4: AnswerValue[]): boolean {
  return phq4Depression(phq4) >= 3;
}

// ── Band keparahan (0 minimal · 1 ringan · 2 sedang · 3 berat) ──
export function phq9Band(total: number): Sev {
  if (total <= 4) return 0;
  if (total <= 9) return 1;
  if (total <= 14) return 2;
  return 3; // 15–19 cukup berat & 20–27 berat digabung utk indeks
}
export function gad7Band(total: number): Sev {
  if (total <= 4) return 0;
  if (total <= 9) return 1;
  if (total <= 14) return 2;
  return 3;
}
export function phq4Band(total: number): Sev {
  if (total <= 2) return 0;
  if (total <= 5) return 1;
  if (total <= 8) return 2;
  return 3;
}

export function phq9Label(total: number): string {
  if (total <= 4) return "minimal";
  if (total <= 9) return "ringan";
  if (total <= 14) return "sedang";
  if (total <= 19) return "cukup berat";
  return "berat";
}
export function gad7Label(total: number): string {
  if (total <= 4) return "minimal";
  if (total <= 9) return "ringan";
  if (total <= 14) return "sedang";
  return "berat";
}

export interface ScreeningSummary {
  phq4Total: number;
  phq9Total: number | null;
  gad7Total: number | null;
  distress: Sev;
  dangerSignal: boolean; // PHQ-9 item 9 > 0
  insomniaFlag: boolean; // PHQ-9 item 3 ≥ 2
  lines: string[]; // ringkasan yang bisa ditelusuri user
}

export function summarizeScreening(s: Screening): ScreeningSummary {
  const phq4Total = sum(s.phq4);
  const phq9Total = s.phq9 ? sum(s.phq9) : null;
  const gad7Total = s.gad7 ? sum(s.gad7) : null;

  const bands: Sev[] = [];
  if (phq9Total !== null) bands.push(phq9Band(phq9Total));
  if (gad7Total !== null) bands.push(gad7Band(gad7Total));
  if (bands.length === 0 && s.phq4) bands.push(phq4Band(phq4Total));
  const distress = (bands.length ? Math.max(...bands) : 0) as Sev;

  const dangerSignal = !!s.phq9 && s.phq9[8] > 0;
  const insomniaFlag = !!s.phq9 && s.phq9[2] >= 2;

  const lines: string[] = [];
  if (s.phq4) lines.push(`PHQ-4 total ${phq4Total}/12`);
  if (phq9Total !== null)
    lines.push(`PHQ-9 total ${phq9Total}/27 → ${phq9Label(phq9Total)}`);
  if (gad7Total !== null)
    lines.push(`GAD-7 total ${gad7Total}/21 → ${gad7Label(gad7Total)}`);

  return { phq4Total, phq9Total, gad7Total, distress, dangerSignal, insomniaFlag, lines };
}
