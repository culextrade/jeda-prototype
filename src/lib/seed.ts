import { JedaState, Debt, CheckIn, RecoveryPlan, LedgerEntry, Mission, Badge } from "./types";
import { INITIAL_MISSIONS } from "./missions";

export function getDemoState(): JedaState {
  const now = new Date();
  
  // Calculate relative dates
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const dateOffsetStr = (offsetDays: number) => {
    const d = new Date();
    d.setDate(now.getDate() + offsetDays);
    return d.toISOString().split("T")[0];
  };

  const checkInDate = (offsetDaysAgo: number) => {
    const d = new Date();
    d.setDate(now.getDate() - offsetDaysAgo);
    return d.toISOString();
  };

  // 1. Profile
  const profile = {
    anonId: "demo-user-1234",
    createdAt: checkInDate(10),
    levelKey: "menjaga-jeda" as const,
    consentTier: 1 as const,
    displayName: "Sahabat Jeda",
  };

  // 2. Debts (3 debts)
  const debts: Debt[] = [
    {
      id: "debt-1",
      lenderName: "Pinjol Terang (Illegal/Unlicensed)",
      type: "pinjol",
      isLicensedKnown: false,
      outstanding: 2400000,
      principal: 2000000,
      interestRate: 0.4,
      interestType: "flat",
      dueDate: dateOffsetStr(3),
      collectorPressure: 3, // High pressure
      note: "Penagihan lewat WA sangat agresif",
    },
    {
      id: "debt-2",
      lenderName: "PayLater Belanja (Berizin OJK)",
      type: "paylater",
      isLicensedKnown: true,
      outstanding: 850000,
      principal: 800000,
      interestRate: 2,
      interestType: "per-bulan",
      dueDate: dateOffsetStr(12),
      collectorPressure: 1, // Low pressure
    },
    {
      id: "debt-3",
      lenderName: "Pinjaman Teman (Personal)",
      type: "personal",
      isLicensedKnown: true,
      outstanding: 1000000,
      collectorPressure: 1,
      note: "Teman baik, ingin dibayar cepat kalau ada rezeki",
    },
  ];

  // 3. CheckIns (4 check-ins)
  const checkIns: CheckIn[] = [
    {
      id: "checkin-1",
      timestamp: checkInDate(4),
      dominantCondition: "panik",
      pressure: 5,
      urgency: 5,
      capacity: 1,
      intentToBorrow: 5,
      readyToContinue: false,
    },
    {
      id: "checkin-2",
      timestamp: checkInDate(3),
      dominantCondition: "ingin-pinjam-lagi",
      pressure: 4,
      urgency: 4,
      capacity: 2,
      intentToBorrow: 4,
      readyToContinue: true,
    },
    {
      id: "checkin-3",
      timestamp: checkInDate(2),
      dominantCondition: "bingung",
      pressure: 3,
      urgency: 3,
      capacity: 4,
      intentToBorrow: 3,
      readyToContinue: true,
    },
    {
      id: "checkin-4",
      timestamp: checkInDate(1),
      dominantCondition: "malu",
      pressure: 2,
      urgency: 2,
      capacity: 4,
      intentToBorrow: 2,
      readyToContinue: true,
    },
  ];

  // 4. Ledger (consistent: Earns = 425, Spends = 260, Balance = 165)
  const ledger: LedgerEntry[] = [
    {
      id: "ledger-1",
      timestamp: checkInDate(10),
      type: "earn",
      amount: 20,
      source: "checkin",
      label: "Check-in pertama JEDA",
    },
    {
      id: "ledger-2",
      timestamp: checkInDate(9),
      type: "earn",
      amount: 50,
      source: "debt-map-complete",
      label: "Menyelesaikan peta utang pertama",
    },
    {
      id: "ledger-3",
      timestamp: checkInDate(8),
      type: "earn",
      amount: 30,
      source: "streak-3",
      label: "Misi streak 3 hari harian",
    },
    {
      id: "ledger-4",
      timestamp: checkInDate(7),
      type: "earn",
      amount: 75,
      source: "streak-7",
      label: "Misi streak 7 hari harian",
    },
    {
      id: "ledger-5",
      timestamp: checkInDate(6),
      type: "earn",
      amount: 50,
      source: "recovery-complete",
      label: "Menyelesaikan rencana pemulihan dasar",
    },
    {
      id: "ledger-6",
      timestamp: checkInDate(5),
      type: "earn",
      amount: 50,
      source: "referral-accepted",
      label: "Referral diterima: Sahabat Budi",
    },
    {
      id: "ledger-7",
      timestamp: checkInDate(4),
      type: "earn",
      amount: 50,
      source: "referral-accepted",
      label: "Referral diterima: Sahabat Citra",
    },
    {
      id: "ledger-8",
      timestamp: checkInDate(3),
      type: "earn",
      amount: 100, // 10 days cumulative harian checkins
      source: "checkin",
      label: "Check-in harian (10x akumulasi)",
    },
    // Spends
    {
      id: "ledger-9",
      timestamp: checkInDate(3),
      type: "spend",
      amount: 100,
      source: "spend-premium",
      label: "Pembelian tema jurnal premium",
    },
    {
      id: "ledger-10",
      timestamp: checkInDate(2),
      type: "spend",
      amount: 160,
      source: "spend-premium",
      label: "Aktivasi Recovery Plan adaptif",
    },
  ];

  const credit = {
    balance: 165, // 425 - 260
    ledger,
  };

  // 5. Missions (Claimed: first-checkin & complete-debt-map; in-progress: streak-7 (5/7), anti-relapse-7 (5/7))
  const missions: Mission[] = INITIAL_MISSIONS.map((m) => {
    if (m.key === "first-checkin") {
      return { ...m, status: "claimed", progress: 1 };
    }
    if (m.key === "complete-debt-map") {
      return { ...m, status: "claimed", progress: 1 };
    }
    if (m.key === "streak-3") {
      return { ...m, status: "claimed", progress: 3 };
    }
    if (m.key === "streak-7") {
      return { ...m, status: "in-progress", progress: 5 };
    }
    if (m.key === "anti-relapse-7") {
      return { ...m, status: "in-progress", progress: 5 };
    }
    return m;
  });

  // 6. Streak
  const streak = {
    current: 5,
    longest: 6,
    lastCheckinDate: yesterdayStr,
    antiRelapseDays: 5,
    lastAntiRelapseDate: yesterdayStr,
  };

  // 7. Badges
  const badges: Badge[] = [
    { key: "berani-melihat", earnedAt: checkInDate(10) },
    { key: "peta-pertama", earnedAt: checkInDate(9) },
    { key: "streak-3", earnedAt: checkInDate(8) },
  ];

  // 8. Recovery Plan
  const recoveryPlans: RecoveryPlan[] = [
    {
      id: "plan-demo",
      createdAt: checkInDate(3),
      basedOnCheckInId: "checkin-2",
      tasks: [
        // 24 jam
        {
          id: "task-1",
          horizon: "24jam",
          text: "Tunda dulu keputusan meminjam baru hari ini.",
          category: "emosional",
          done: true,
        },
        {
          id: "task-2",
          horizon: "24jam",
          text: "Catat 1 utang yang paling menekan.",
          category: "operasional",
          done: true,
        },
        {
          id: "task-3",
          horizon: "24jam",
          text: "Tarik napas: kondisi ini bisa ditangani bertahap.",
          category: "emosional",
          done: false,
        },
        // 7 hari
        {
          id: "task-4",
          horizon: "7hari",
          text: "Urutkan kewajiban dari yang paling mendesak.",
          category: "operasional",
          done: false,
        },
        {
          id: "task-5",
          horizon: "7hari",
          text: "Siapkan kalimat untuk bicara dengan penagih dengan tenang.",
          category: "sosial",
          done: false,
        },
        {
          id: "task-6",
          horizon: "7hari",
          text: "Cek legalitas pemberi pinjaman di daftar OJK.",
          category: "regulatif",
          done: false,
        },
        // 30 hari
        {
          id: "task-7",
          horizon: "30hari",
          text: "Pertimbangkan bicara dengan mentor keuangan/konselor.",
          category: "sosial",
          done: false,
        },
        {
          id: "task-8",
          horizon: "30hari",
          text: "Susun anggaran sederhana minggu depan.",
          category: "operasional",
          done: false,
        },
      ],
    },
  ];

  const referrals = [
    {
      id: "ref-1",
      channel: "mentor-keuangan" as const,
      status: "accepted" as const,
      consentGivenAt: checkInDate(5),
      contactPref: "wa" as const,
    },
    {
      id: "ref-2",
      channel: "konselor-psikolog" as const,
      status: "accepted" as const,
      consentGivenAt: checkInDate(4),
      contactPref: "email" as const,
    },
  ];

  const settings = {
    remindersOptIn: false,
    reduceMotion: false,
    demoMode: true,
  };

  return {
    profile,
    checkIns,
    debts,
    recoveryPlans,
    credit,
    missions,
    streak,
    badges,
    referrals,
    settings,
  };
}
