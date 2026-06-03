import { JedaState, Mission, MissionKey } from "./types";

export const INITIAL_MISSIONS: Mission[] = [
  {
    key: "first-checkin",
    status: "available",
    progress: 0,
    target: 1,
    reward: 20,
  },
  {
    key: "daily-checkin",
    status: "available",
    progress: 0,
    target: 1,
    reward: 10,
  },
  {
    key: "complete-debt-map",
    status: "available",
    progress: 0,
    target: 1,
    reward: 50,
  },
  {
    key: "complete-recovery",
    status: "available",
    progress: 0,
    target: 1,
    reward: 50,
  },
  {
    key: "streak-3",
    status: "available",
    progress: 0,
    target: 3,
    reward: 30,
  },
  {
    key: "streak-7",
    status: "available",
    progress: 0,
    target: 7,
    reward: 75,
  },
  {
    key: "anti-relapse-7",
    status: "available",
    progress: 0,
    target: 7,
    reward: 100,
  },
  {
    key: "anti-relapse-30",
    status: "available",
    progress: 0,
    target: 30,
    reward: 500,
  },
  {
    key: "refer-someone",
    status: "available",
    progress: 0,
    target: 1,
    reward: 50,
  },
  {
    key: "share-jedadulu",
    status: "available",
    progress: 0,
    target: 1,
    reward: 20,
  },
];

export function getMissionLabel(key: MissionKey): string {
  switch (key) {
    case "first-checkin":
      return "Melakukan check-in pertama";
    case "daily-checkin":
      return "Check-in harian";
    case "complete-debt-map":
      return "Menyelesaikan peta utang (minimal 1 catatan)";
    case "complete-recovery":
      return "Menyelesaikan seluruh tugas pemulihan";
    case "streak-3":
      return "Menjaga streak jeda selama 3 hari berturut-turut";
    case "streak-7":
      return "Menjaga streak jeda selama 7 hari berturut-turut";
    case "anti-relapse-7":
      return "Menahan diri dari pinjaman baru selama 7 hari";
    case "anti-relapse-30":
      return "Menahan diri dari pinjaman baru selama 30 hari";
    case "refer-someone":
      return "Mengajak teman bergabung (Referral diterima)";
    case "share-jedadulu":
      return "Bagikan langkah kecilmu dengan tagar #JedaDulu";
    default:
      return "Misi Pemulihan";
  }
}

export function evaluateMissions(state: JedaState): JedaState {
  const missions = state.missions.length > 0 ? [...state.missions] : [...INITIAL_MISSIONS];

  const updatedMissions = missions.map((mission): Mission => {
    // If already claimed, don't change status or progress
    if (mission.status === "claimed") {
      return mission;
    }

    let progress = mission.progress;
    let status = mission.status;

    switch (mission.key) {
      case "first-checkin":
        progress = Math.min(1, state.checkIns.length);
        break;
      case "daily-checkin":
        // checked in today if checkIns has timestamp matching today's date
        const todayStr = new Date().toISOString().split("T")[0];
        const hasCheckedInToday = state.checkIns.some(
          (c) => c.timestamp.split("T")[0] === todayStr
        );
        progress = hasCheckedInToday ? 1 : 0;
        break;
      case "complete-debt-map":
        progress = Math.min(1, state.debts.length > 0 ? 1 : 0);
        break;
      case "complete-recovery":
        const hasPlan = state.recoveryPlans.length > 0;
        const tasks = hasPlan ? state.recoveryPlans[0].tasks : [];
        const tasks24h = tasks.filter(t => t.horizon === "24jam");
        progress = hasPlan && tasks24h.length > 0 && tasks24h.every((t) => t.done) ? 1 : 0;
        break;
      case "streak-3":
        progress = Math.min(3, state.streak.current);
        break;
      case "streak-7":
        progress = Math.min(7, state.streak.current);
        break;
      case "anti-relapse-7":
        progress = Math.min(7, state.streak.antiRelapseDays ?? 0);
        break;
      case "anti-relapse-30":
        progress = Math.min(30, state.streak.antiRelapseDays ?? 0);
        break;
      case "refer-someone":
        progress = Math.min(1, state.referrals.filter((r) => r.status === "accepted").length);
        break;
      case "share-jedadulu":
        // Keep current progress, updated via explicit share action
        break;
    }

    // Determine status
    if (progress >= mission.target) {
      status = "completed";
    } else if (progress > 0) {
      status = "in-progress";
    } else {
      status = "available";
    }

    return {
      ...mission,
      progress,
      status,
    };
  });

  return {
    ...state,
    missions: updatedMissions,
  };
}
