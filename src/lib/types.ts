export type ConsentTier = 0 | 1 | 2 | 3;
// 0 anonim (default, nihil simpan server) · 1 simpan progres · 2 reminder · 3 referral

export type LevelKey =
  | "berani-melihat"
  | "mulai-memetakan"
  | "menata-langkah"
  | "menjaga-jeda"
  | "konsisten-pulih"
  | "pejuang-jeda";

export interface Profile {
  anonId: string;            // uuid lokal
  createdAt: string;         // ISO
  levelKey: LevelKey;        // level pemulihan saat ini
  consentTier: ConsentTier;  // default 0
  displayName?: string;      // opsional, default "Sahabat Jeda"
}

export type DominantCondition =
  | "panik"
  | "malu"
  | "takut-ditagih"
  | "ingin-pinjam-lagi"
  | "bingung";

export interface CheckIn {
  id: string;
  timestamp: string;
  dominantCondition: DominantCondition;
  pressure: 1 | 2 | 3 | 4 | 5;        // intensitas tekanan
  urgency: 1 | 2 | 3 | 4 | 5;         // urgensi keputusan
  capacity: 1 | 2 | 3 | 4 | 5;        // kapasitas mengambil keputusan (5 = mampu)
  intentToBorrow: 1 | 2 | 3 | 4 | 5;  // dorongan meminjam baru
  readyToContinue: boolean;   // hasil gerbang "Siap lanjut?"
}

export type DebtType =
  | "pinjol"
  | "paylater"
  | "kartu-kredit"
  | "koperasi"
  | "personal"
  | "lainnya";

export type InterestType = "per-bulan" | "per-tahun" | "flat" | "tidak-tahu";

export interface Debt {
  id: string;
  lenderName: string;
  type: DebtType;
  isLicensedKnown?: boolean;  // user tahu legal/berizin? (untuk nudge cek LPBBTI)
  principal?: number;         // pokok (opsional)
  outstanding: number;        // sisa kewajiban (wajib)
  interestRate?: number;      // %
  interestType?: InterestType;
  installment?: number;       // cicilan per periode
  dueDate?: string;           // ISO date jatuh tempo terdekat
  collectorPressure?: 1 | 2 | 3;  // tekanan penagihan (1 = tidak menekan, 2 = cukup, 3 = sangat)
  note?: string;
}

export type Horizon = "24jam" | "7hari" | "30hari";

export interface RecoveryTask {
  id: string;
  horizon: Horizon;
  text: string;
  category: "regulatif" | "operasional" | "sosial" | "emosional";
  done: boolean;
  rewardClaimed?: boolean;   // mencegah double-claim +5 JC
}

export interface RecoveryPlan {
  id: string;
  createdAt: string;
  basedOnCheckInId?: string;
  tasks: RecoveryTask[];
}

// ── JEDA Credit ──────────────────────────────────────────
export type LedgerSource =
  | "checkin"
  | "debt-map-complete"
  | "recovery-task"
  | "recovery-complete"
  | "streak-3"
  | "streak-7"
  | "anti-relapse-7"
  | "anti-relapse-30"
  | "referral-accepted"
  | "share-milestone"
  | "buddy"
  | "purchase"
  | "spend-premium"
  | "spend-mentor"
  | "demo-seed";

export interface LedgerEntry {
  id: string;
  timestamp: string;
  type: "earn" | "spend";
  amount: number;            // positif
  source: LedgerSource;
  label: string;             // teks tampil, mis. "Check-in harian"
}

export interface Credit {
  balance: number;
  ledger: LedgerEntry[];
}

// ── Misi ─────────────────────────────────────────────────
export type MissionKey =
  | "first-checkin"
  | "daily-checkin"
  | "complete-debt-map"
  | "complete-recovery"
  | "streak-3"
  | "streak-7"
  | "anti-relapse-7"
  | "anti-relapse-30"
  | "refer-someone"
  | "share-jedadulu";

export interface Mission {
  key: MissionKey;
  status: "locked" | "available" | "in-progress" | "completed" | "claimed";
  progress: number;          // 0..target
  target: number;
  reward: number;            // JC
}

// ── Streak & Badge ───────────────────────────────────────
export interface Streak {
  current: number;
  longest: number;
  lastCheckinDate?: string;  // YYYY-MM-DD
  antiRelapseDays: number;   // menahan diri berturut-turut
  lastAntiRelapseDate?: string; // YYYY-MM-DD (mencegah farming)
}

export type BadgeKey =
  | "berani-melihat"
  | "peta-pertama"
  | "rencana-pertama"
  | "streak-3"
  | "streak-7"
  | "anti-relapse-7"
  | "anti-relapse-30"
  | "jeda-buddy"
  | "jedadulu";

export interface Badge {
  key: BadgeKey;
  earnedAt: string;
}

// ── Referral ─────────────────────────────────────────────
export type ReferralChannel =
  | "mentor-keuangan"
  | "konselor-psikolog"
  | "legal-aid"
  | "kanal-resmi";

export interface Referral {
  id: string;
  channel: ReferralChannel;
  status: "draft" | "consent-given" | "sent" | "accepted";
  consentGivenAt?: string;
  contactPref?: "email" | "wa" | "in-app";
}

export interface Settings {
  remindersOptIn: boolean;   // tier 2
  reduceMotion: boolean;
  demoMode: boolean;
}

export interface JedaState {
  profile?: Profile;
  checkIns: CheckIn[];
  debts: Debt[];
  recoveryPlans: RecoveryPlan[];
  credit: Credit;
  missions: Mission[];
  streak: Streak;
  badges: Badge[];
  referrals: Referral[];
  settings: Settings;
}
