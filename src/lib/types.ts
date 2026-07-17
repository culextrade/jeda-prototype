// ── JEDA v2 — tipe data inti ─────────────────────────────────
// Local-first: seluruh state hidup di perangkat user (localStorage),
// tanpa akun, tanpa server. Lihat /tentang untuk status pengembangan.

export type Sev = 0 | 1 | 2 | 3; // 0 minimal · 1 ringan · 2 sedang · 3 berat

export type AnswerValue = 0 | 1 | 2 | 3; // frekuensi 2 minggu terakhir

export interface Screening {
  phq4: AnswerValue[] | null; // 4 item (GAD-2 + PHQ-2)
  phq9: AnswerValue[] | null; // 9 item — item ke-9 = sinyal krisis
  gad7: AnswerValue[] | null; // 7 item
}

export type Licensed = "ya" | "tidak" | "tidak-tahu";

export interface Debt {
  id: string;
  name: string;
  licensed: Licensed;
  outstanding: number; // sisa kewajiban (Rp)
  installment: number; // cicilan per bulan (Rp)
  overdue: boolean; // ada tunggakan
  harshCollection: boolean; // penagihan kasar / intimidasi
}

export interface Finance {
  income: number; // penghasilan per bulan
  essentials: number; // pengeluaran pokok per bulan
  debts: Debt[];
  borrowToRepay: boolean; // gali lubang tutup lubang
}

export type RootCause =
  | "impulsif"
  | "gaya-hidup"
  | "kebutuhan-pokok"
  | "darurat"
  | "judi"
  | "usaha"
  | "belum-tahu";

export type Jalur = "krisis" | "preventif" | "kuratif" | "rehabilitatif";

export interface Assessment {
  story: string[]; // kondisi yang dipilih user di awal percakapan
  screening: Screening;
  finance: Finance;
  rootCause: RootCause;
  dangerSignal: boolean; // PHQ-9 item 9 > 0
  completedAt?: string;
}

export interface TriageResult {
  jalur: Exclude<Jalur, "krisis">;
  crisis: boolean; // pernah memicu protokol krisis
  distress: Sev; // indeks distres psikologis
  burden: Sev; // indeks beban finansial
  dsr: number; // debt service ratio 0..n
  flags: string[]; // label flag finansial
  reasons: string[]; // penjelasan "kenapa aku di sini"
}

export type TaskKind = "keuangan" | "mental" | "perlindungan" | "kebiasaan";

export interface PlanTask {
  id: string;
  week: 1 | 2 | 3 | 4;
  title: string;
  detail?: string;
  kind: TaskKind;
  href?: string; // tautan ke modul terkait
  done: boolean;
}

export interface DebtPriority {
  debtId: string;
  reason: string;
}

export interface RecoveryPlan {
  id: string;
  createdAt: string;
  jalur: Exclude<Jalur, "krisis" | "preventif">;
  debtOrder: DebtPriority[];
  tasks: PlanTask[];
}

export interface JedaEvent {
  id: string;
  at: string;
  amount: number;
  tenorDays: number;
  decision: "tunda" | "lanjut";
  interestAvoided: number; // estimasi bunga yang tidak jadi berjalan
}

export interface JournalEntry {
  id: string;
  at: string; // ISO — jam penting untuk deteksi pola
  mood: 1 | 2 | 3 | 4 | 5;
  urge: boolean; // ada dorongan belanja / pinjam
  spend?: number;
  note?: string;
}

export interface Membership {
  plan: "gratis" | "jeruk"; // jeruk = Rp9.900/bln (mock, tanpa transaksi nyata)
  since?: string;
  choseExternal?: boolean; // memilih mencari bantuan di tempat lain
}

export interface Settings {
  demo: boolean;
  demoDayOffset: number; // "maju 7 hari" untuk demo jurnal
}

export interface JedaState {
  consentAt?: string; // selesai consent di /mulai
  assessment?: Assessment;
  triage?: TriageResult;
  plan?: RecoveryPlan;
  jedaEvents: JedaEvent[];
  journal: JournalEntry[];
  membership: Membership;
  upgradeOffered: boolean; // kuratif → rehabilitatif (pola ditemukan)
  settings: Settings;
}
