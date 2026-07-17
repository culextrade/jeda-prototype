// ── Persona demo: Raka, 26, staf ritel, Solo ─────────────────
// Pinjol konsumtif, gali lubang tutup lubang, cemas, sulit tidur.
// Seluruh angka konsisten dengan engine (triage & plan dihitung ulang).

import { Assessment, JedaState, JournalEntry } from "./types";
import { runTriage } from "./engine/triage";
import { generatePlan } from "./engine/plan";
import { interestAvoided } from "./engine/simulasi";
import { uid } from "./utils";

const DEMO_ASSESSMENT: Assessment = {
  story: ["Cicilan mulai kejar-kejaran", "Sulit tidur kepikiran tagihan", "Pernah pinjam untuk nutup pinjaman lain"],
  screening: {
    // PHQ-4: cemas 4/6 (positif) · depresi 3/6 (positif) → keduanya diperdalam
    phq4: [2, 2, 2, 1],
    // PHQ-9 total 13 → sedang · item 3 tinggi (insomnia) · item 9 = 0
    phq9: [2, 2, 3, 2, 1, 2, 1, 0, 0],
    // GAD-7 total 11 → sedang
    gad7: [2, 2, 2, 1, 1, 1, 2],
  },
  finance: {
    income: 4_200_000,
    essentials: 1_800_000,
    debts: [
      {
        id: "d1",
        name: "KilatDana",
        licensed: "ya",
        outstanding: 3_100_000,
        installment: 850_000,
        overdue: false,
        harshCollection: false,
      },
      {
        id: "d2",
        name: "SaldoPlus",
        licensed: "ya",
        outstanding: 2_400_000,
        installment: 620_000,
        overdue: true,
        harshCollection: false,
      },
      {
        id: "d3",
        name: "TunaiGo",
        licensed: "tidak",
        outstanding: 1_800_000,
        installment: 430_000,
        overdue: true,
        harshCollection: true,
      },
    ],
    borrowToRepay: true,
  },
  rootCause: "belum-tahu",
  dangerSignal: false,
  completedAt: new Date().toISOString(),
};

function daysAgo(days: number, hour: number, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

/** Jurnal 1 minggu (untuk demo "maju 7 hari") — pola: dorongan malam saat mood turun. */
export function getDemoJournalWeek(): JournalEntry[] {
  return [
    { id: uid(), at: daysAgo(1, 9, 0), mood: 4, urge: false, note: "Tidur lebih awal, bangun enak" },
    { id: uid(), at: daysAgo(2, 22, 50), mood: 2, urge: true, spend: 65_000, note: "Jajan online biar nggak kepikiran" },
    { id: uid(), at: daysAgo(3, 12, 0), mood: 3, urge: false },
    { id: uid(), at: daysAgo(4, 21, 40), mood: 1, urge: true, spend: 0, note: "Hampir pinjam lagi — buka Tombol Jeda dulu" },
    { id: uid(), at: daysAgo(5, 23, 15), mood: 2, urge: true, spend: 120_000, note: "Checkout flash sale" },
    { id: uid(), at: daysAgo(5, 8, 10), mood: 3, urge: false },
    { id: uid(), at: daysAgo(6, 22, 30), mood: 2, urge: true, spend: 89_000, note: "Scroll marketplace sampai larut" },
  ];
}

export function getDemoState(): JedaState {
  const triage = runTriage(DEMO_ASSESSMENT);
  const plan = generatePlan(DEMO_ASSESSMENT, triage);

  return {
    consentAt: daysAgo(7, 20, 12),
    assessment: DEMO_ASSESSMENT,
    triage,
    plan,
    jedaEvents: [
      {
        id: uid(),
        at: daysAgo(4, 21, 47),
        amount: 500_000,
        tenorDays: 30,
        decision: "tunda",
        interestAvoided: interestAvoided(500_000),
      },
      {
        id: uid(),
        at: daysAgo(2, 23, 5),
        amount: 300_000,
        tenorDays: 30,
        decision: "tunda",
        interestAvoided: interestAvoided(300_000),
      },
    ],
    journal: [],
    membership: { plan: "jeruk", since: daysAgo(7, 20, 30), choseExternal: false },
    upgradeOffered: false,
    settings: { demo: true, demoDayOffset: 0 },
  };
}
