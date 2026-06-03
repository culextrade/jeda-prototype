"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { JedaState, Debt, CheckIn, RecoveryPlan, RecoveryTask, LedgerEntry, MissionKey, LevelKey, Badge, BadgeKey } from "./types";
import { getState, setState, subscribe, resetAll, seedDemo, DEFAULT_STATE } from "./store";
import { evaluateMissions } from "./missions";
import { totalEarnedXp } from "./selectors";
import { getLevelByXp } from "./levels";

const awardBadge = (currentState: JedaState, badgeKey: BadgeKey): JedaState => {
  const hasBadge = currentState.badges.some((b) => b.key === badgeKey);
  if (hasBadge) return currentState;

  const newBadge: Badge = {
    key: badgeKey,
    earnedAt: new Date().toISOString(),
  };

  return {
    ...currentState,
    badges: [...currentState.badges, newBadge],
  };
};

interface JedaContextType {
  state: JedaState;
  setState: (partial: Partial<JedaState> | ((state: JedaState) => Partial<JedaState>)) => void;
  isMounted: boolean;
  resetState: () => void;
  seedDemoState: () => void;
  // Debt Actions
  addDebt: (debt: Omit<Debt, "id">) => void;
  updateDebt: (debt: Debt) => void;
  deleteDebt: (id: string) => void;
  // Check-In Actions
  addCheckIn: (checkIn: Omit<CheckIn, "id" | "timestamp">) => void;
  // Recovery Plan Actions
  updateTaskStatus: (taskId: string, done: boolean) => void;
  createRecoveryPlan: (basedOnCheckInId?: string) => void;
  // Credit & Mission Actions
  claimMissionReward: (key: MissionKey) => void;
  confirmAntiRelapse: (isSuccessful: boolean) => void;
  // UI states for overlays
  celebratingLevel: LevelKey | null;
  clearLevelCelebration: () => void;
  // Toast notifications for rewards
  toast: { message: string; coins: number } | null;
  showToast: (message: string, coins: number) => void;
}

const JedaContext = createContext<JedaContextType | undefined>(undefined);

export const JedaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setLocalState] = useState<JedaState>(DEFAULT_STATE);
  const [isMounted, setIsMounted] = useState(false);
  const [celebratingLevel, setCelebratingLevel] = useState<LevelKey | null>(null);
  const [toast, setToast] = useState<{ message: string; coins: number } | null>(null);

  useEffect(() => {
    // Synchronize local state with store on mount asynchronously
    // to avoid cascading renders warning in Next.js/React 19
    const timer = setTimeout(() => {
      setLocalState(getState());
      setIsMounted(true);
    }, 0);

    // Subscribe to store updates
    const unsubscribe = subscribe(() => {
      setLocalState(getState());
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  const showToast = (message: string, coins: number) => {
    setToast({ message, coins });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const checkLevelUp = (oldXp: number, newXp: number, currentState: JedaState) => {
    const oldLevel = getLevelByXp(oldXp);
    const newLevel = getLevelByXp(newXp);
    
    if (oldLevel.key !== newLevel.key) {
      setCelebratingLevel(newLevel.key);
      if (currentState.profile) {
        setState({
          profile: {
            ...currentState.profile,
            levelKey: newLevel.key,
          },
        });
      }
    }
  };

  // Add Debt
  const addDebt = (newDebt: Omit<Debt, "id">) => {
    const debt: Debt = {
      ...newDebt,
      id: "debt-" + Math.random().toString(36).substring(2, 9),
    };
    
    const nextState = {
      ...state,
      debts: [...state.debts, debt],
    };
    
    const evaluated = evaluateMissions(nextState);
    setState(evaluated);
    showToast("Utang berhasil dicatat di peta utang.", 0);
  };

  // Update Debt
  const updateDebt = (updatedDebt: Debt) => {
    const nextDebts = state.debts.map((d) => (d.id === updatedDebt.id ? updatedDebt : d));
    const nextState = {
      ...state,
      debts: nextDebts,
    };
    const evaluated = evaluateMissions(nextState);
    setState(evaluated);
  };

  // Delete Debt
  const deleteDebt = (id: string) => {
    const nextDebts = state.debts.filter((d) => d.id !== id);
    const nextState = {
      ...state,
      debts: nextDebts,
    };
    const evaluated = evaluateMissions(nextState);
    setState(evaluated);
  };

  // Add Check-In
  const addCheckIn = (checkInData: Omit<CheckIn, "id" | "timestamp">) => {
    const checkIn: CheckIn = {
      ...checkInData,
      id: "checkin-" + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
    };

    // Calculate streak
    let nextStreak = { ...state.streak };
    const todayStr = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (!state.streak.lastCheckinDate) {
      // First checkin ever
      nextStreak = {
        ...state.streak,
        current: 1,
        longest: 1,
        lastCheckinDate: todayStr,
      };
    } else if (state.streak.lastCheckinDate === yesterdayStr) {
      // Checked in yesterday, increment streak
      const nextCurrent = state.streak.current + 1;
      nextStreak = {
        ...state.streak,
        current: nextCurrent,
        longest: Math.max(state.streak.longest, nextCurrent),
        lastCheckinDate: todayStr,
      };
    } else if (state.streak.lastCheckinDate !== todayStr) {
      // Streak broken, reset to 1
      nextStreak = {
        ...state.streak,
        current: 1,
        longest: Math.max(state.streak.longest, 1),
        lastCheckinDate: todayStr,
      };
    }

    const nextState = {
      ...state,
      checkIns: [...state.checkIns, checkIn],
      streak: nextStreak,
    };

    // Check if daily checkin mission completed
    const evaluated = evaluateMissions(nextState);
    
    // Auto-earn for checkin?
    // According to data model §3: Check-in harian: +10 JC, Check-in pertama: +20 JC.
    // Let's check check-in count
    const isFirst = state.checkIns.length === 0;
    const alreadyToday = state.checkIns.some(c => c.timestamp.split("T")[0] === todayStr);
    const rewardCoins = isFirst ? 20 : (alreadyToday ? 0 : 10);
    const label = isFirst ? "Check-in pertama JEDA" : "Check-in harian";
    const ledgerSource = "checkin" as const;

    let finalState = evaluated;
    const oldXp = totalEarnedXp(state.credit.ledger);

    if (rewardCoins > 0) {
      const ledgerId = "ledger-" + Math.random().toString(36).substring(2, 9);
      const newEntry: LedgerEntry = {
        id: ledgerId,
        timestamp: new Date().toISOString(),
        type: "earn",
        amount: rewardCoins,
        source: ledgerSource,
        label,
      };

      const newLedger = [...evaluated.credit.ledger, newEntry];
      const newXp = totalEarnedXp(newLedger);

      // Auto-update mission status to claimed
      evaluated.missions = evaluated.missions.map((m) => {
        if (isFirst && m.key === "first-checkin") {
          return { ...m, status: "claimed", progress: 1 };
        }
        if (m.key === "daily-checkin") {
          return { ...m, status: "claimed", progress: 1 };
        }
        return m;
      });

      evaluated.credit = {
        balance: evaluated.credit.balance + rewardCoins,
        ledger: newLedger,
      };
      
      finalState = evaluated;

      // 🟡 Nudge: Suppress toast if in distress (capacity <= 2 || urgency == 5 || intentToBorrow == 5)
      const isDistress = checkInData.capacity <= 2 || checkInData.urgency === 5 || checkInData.intentToBorrow === 5;
      if (isDistress) {
        showToast("Check-in berhasil disimpan. Tarik napas sejenak.", 0);
      } else {
        showToast(`Misi Selesai: ${label}`, rewardCoins);
      }
      
      checkLevelUp(oldXp, newXp, finalState);
    } else {
      // already today
      showToast("Check-in tersimpan.", 0);
    }

    setState(finalState);
  };

  // Update Task Status
  const updateTaskStatus = (taskId: string, done: boolean) => {
    let isNewlyClaimed = false;
    const nextPlans = state.recoveryPlans.map((plan) => {
      const nextTasks = plan.tasks.map((task) => {
        if (task.id === taskId) {
          const shouldClaimReward = done && !task.rewardClaimed;
          if (shouldClaimReward) {
            isNewlyClaimed = true;
          }
          return {
            ...task,
            done,
            rewardClaimed: task.rewardClaimed || shouldClaimReward,
          };
        }
        return task;
      });
      return { ...plan, tasks: nextTasks };
    });

    const nextState = {
      ...state,
      recoveryPlans: nextPlans,
    };

    if (isNewlyClaimed) {
      const rewardCoins = 5;
      const ledgerEntry: LedgerEntry = {
        id: "ledger-" + Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        type: "earn",
        amount: rewardCoins,
        source: "recovery-task" as const,
        label: "Menyelesaikan langkah pemulihan",
      };

      const newLedger = [...nextState.credit.ledger, ledgerEntry];
      const oldXp = totalEarnedXp(state.credit.ledger);
      const newXp = totalEarnedXp(newLedger);

      nextState.credit = {
        balance: nextState.credit.balance + rewardCoins,
        ledger: newLedger,
      };

      const evaluated = evaluateMissions(nextState);

      // Check if complete-recovery mission is newly completed
      const hasPlan = evaluated.recoveryPlans.length > 0;
      const tasks = hasPlan ? evaluated.recoveryPlans[0].tasks : [];
      const tasks24h = tasks.filter(t => t.horizon === "24jam");
      const planFinished = hasPlan && tasks24h.length > 0 && tasks24h.every((t) => t.done);
      
      const mission = evaluated.missions.find(m => m.key === "complete-recovery");
      const completeRecoveryMissionUnclaimed = mission && mission.status === "completed";

      if (planFinished && completeRecoveryMissionUnclaimed) {
        // Auto-claim complete-recovery
        const completeReward = 50;
        const completeLedgerEntry: LedgerEntry = {
          id: "ledger-" + Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toISOString(),
          type: "earn",
          amount: completeReward,
          source: "recovery-complete" as const,
          label: "Menyelesaikan semua rencana pemulihan",
        };
        
        evaluated.credit.ledger.push(completeLedgerEntry);
        evaluated.credit.balance += completeReward;
        
        evaluated.missions = evaluated.missions.map((m) => {
          if (m.key === "complete-recovery") {
            return { ...m, status: "claimed", progress: 1 };
          }
          return m;
        });
        
        // Award badge
        let finalState = awardBadge(evaluated, "rencana-pertama");
        setState(finalState);
        showToast("Rencana Pemulihan Selesai!", completeReward);
        checkLevelUp(oldXp, totalEarnedXp(finalState.credit.ledger), finalState);
      } else {
        setState(evaluated);
        showToast("Langkah kecil selesai!", rewardCoins);
        checkLevelUp(oldXp, newXp, evaluated);
      }
    } else {
      const evaluated = evaluateMissions(nextState);
      setState(evaluated);
    }
  };

  // Create Recovery Plan
  const createRecoveryPlan = (basedOnCheckInId?: string) => {
    // Guard: Do not create plan if one already exists
    if (state.recoveryPlans.length > 0) return;

    // Read state conditions
    const lastCheckIn = state.checkIns.length > 0 ? state.checkIns[state.checkIns.length - 1] : null;
    const intentToBorrowVal = lastCheckIn ? lastCheckIn.intentToBorrow : 3;
    const hasHighPressure = state.debts.some((d) => d.collectorPressure === 3);
    const hasUnlicensed = state.debts.some((d) => d.type === "pinjol" && d.isLicensedKnown === false);
    const totalDebt = state.debts.reduce((sum, d) => sum + d.outstanding, 0);

    // Build plan tasks
    const tasks: RecoveryTask[] = [
      // Universal base tasks
      {
        id: "task-" + Math.random().toString(36).substring(2, 9),
        horizon: "24jam",
        text: "Tarik napas: kondisi ini bisa ditangani bertahap.",
        category: "emosional",
        done: false,
        rewardClaimed: false,
      },
      {
        id: "task-" + Math.random().toString(36).substring(2, 9),
        horizon: "7hari",
        text: "Urutkan kewajiban dari yang paling mendesak.",
        category: "operasional",
        done: false,
        rewardClaimed: false,
      },
      {
        id: "task-" + Math.random().toString(36).substring(2, 9),
        horizon: "30hari",
        text: "Susun anggaran sederhana untuk bulan depan.",
        category: "operasional",
        done: false,
        rewardClaimed: false,
      },
    ];

    // Adaptive triggers
    if (intentToBorrowVal >= 4) {
      tasks.push({
        id: "task-" + Math.random().toString(36).substring(2, 9),
        horizon: "24jam",
        text: "Tunda dulu keputusan meminjam baru hari ini.",
        category: "emosional",
        done: false,
        rewardClaimed: false,
      });
    }
    if (totalDebt > 0) {
      tasks.push({
        id: "task-" + Math.random().toString(36).substring(2, 9),
        horizon: "24jam",
        text: "Catat 1 utang yang paling menekan.",
        category: "operasional",
        done: false,
        rewardClaimed: false,
      });
    }
    if (hasHighPressure) {
      tasks.push({
        id: "task-" + Math.random().toString(36).substring(2, 9),
        horizon: "7hari",
        text: "Siapkan kalimat untuk bicara dengan penagih dengan tenang.",
        category: "sosial",
        done: false,
        rewardClaimed: false,
      });
    }
    if (hasUnlicensed) {
      tasks.push({
        id: "task-" + Math.random().toString(36).substring(2, 9),
        horizon: "7hari",
        text: "Cek legalitas pemberi pinjaman di daftar OJK.",
        category: "regulatif",
        done: false,
        rewardClaimed: false,
      });
    }
    if (totalDebt > 5000000) {
      tasks.push({
        id: "task-" + Math.random().toString(36).substring(2, 9),
        horizon: "30hari",
        text: "Pertimbangkan bicara dengan mentor keuangan/konselor.",
        category: "sosial",
        done: false,
        rewardClaimed: false,
      });
    }

    const newPlan: RecoveryPlan = {
      id: "plan-" + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      basedOnCheckInId,
      tasks,
    };

    const nextState = {
      ...state,
      recoveryPlans: [newPlan, ...state.recoveryPlans],
    };

    const evaluated = evaluateMissions(nextState);
    setState(evaluated);
  };

  // Claim Mission Reward
  const claimMissionReward = (key: MissionKey) => {
    const missionIndex = state.missions.findIndex((m) => m.key === key);
    if (missionIndex === -1) return;

    const mission = state.missions[missionIndex];
    if (mission.status !== "completed") return;

    // Build ledger source map
    let ledgerSource: LedgerEntry["source"] = "checkin";
    let label = `Misi Selesai: ${key}`;
    if (key === "complete-debt-map") {
      ledgerSource = "debt-map-complete";
      label = "Peta utang diselesaikan";
    } else if (key === "complete-recovery") {
      ledgerSource = "recovery-complete";
      label = "Rencana pemulihan diselesaikan";
    } else if (key === "streak-3") {
      ledgerSource = "streak-3";
      label = "Streak jeda 3 hari";
    } else if (key === "streak-7") {
      ledgerSource = "streak-7";
      label = "Streak jeda 7 hari";
    } else if (key === "anti-relapse-7") {
      ledgerSource = "anti-relapse-7";
      label = "Anti-relapse 7 hari";
    } else if (key === "anti-relapse-30") {
      ledgerSource = "anti-relapse-30";
      label = "Anti-relapse 30 hari";
    } else if (key === "refer-someone") {
      ledgerSource = "referral-accepted";
      label = "Mengajak teman";
    } else if (key === "share-jedadulu") {
      ledgerSource = "share-milestone";
      label = "Berbagi tagar #JedaDulu";
    }

    const ledgerEntry: LedgerEntry = {
      id: "ledger-" + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      type: "earn",
      amount: mission.reward,
      source: ledgerSource,
      label,
    };

    const nextLedger = [...state.credit.ledger, ledgerEntry];
    const oldXp = totalEarnedXp(state.credit.ledger);
    const newXp = totalEarnedXp(nextLedger);

    const nextMissions = state.missions.map((m) =>
      m.key === key ? { ...m, status: "claimed" as const } : m
    );

    let nextState = {
      ...state,
      missions: nextMissions,
      credit: {
        balance: state.credit.balance + mission.reward,
        ledger: nextLedger,
      },
    };

    // Auto-award badges based on claimed mission
    if (key === "first-checkin") {
      nextState = awardBadge(nextState, "berani-melihat");
    } else if (key === "complete-debt-map") {
      nextState = awardBadge(nextState, "peta-pertama");
    } else if (key === "complete-recovery") {
      nextState = awardBadge(nextState, "rencana-pertama");
    } else if (key === "streak-3") {
      nextState = awardBadge(nextState, "streak-3");
    } else if (key === "streak-7") {
      nextState = awardBadge(nextState, "streak-7");
    } else if (key === "anti-relapse-7") {
      nextState = awardBadge(nextState, "anti-relapse-7");
    } else if (key === "anti-relapse-30") {
      nextState = awardBadge(nextState, "anti-relapse-30");
    }

    setState(nextState);
    showToast(`Berhasil klaim reward!`, mission.reward);
    checkLevelUp(oldXp, newXp, nextState);
  };

  // Confirm Anti-Relapse (daily question)
  const confirmAntiRelapse = (isSuccessful: boolean) => {
    const todayStr = new Date().toISOString().split("T")[0];

    if (isSuccessful) {
      // Guard: once per day
      if (state.streak.lastAntiRelapseDate === todayStr) {
        showToast("Kamu sudah mengisi anti-relapse hari ini.", 0);
        return;
      }

      const nextStreak = {
        ...state.streak,
        antiRelapseDays: (state.streak.antiRelapseDays ?? 0) + 1,
        lastAntiRelapseDate: todayStr,
      };

      const nextState = {
        ...state,
        streak: nextStreak,
      };

      const evaluated = evaluateMissions(nextState);
      
      // Auto reward if streak milestones hit
      let finalState = { ...evaluated };
      const oldXp = totalEarnedXp(state.credit.ledger);
      let earnAmount = 0;
      let label = "";

      if (nextStreak.antiRelapseDays === 7) {
        // Auto reward 100 JC
        earnAmount = 100;
        label = "Tujuh hari menahan diri (Anti-relapse)";
        
        const entry: LedgerEntry = {
          id: "ledger-" + Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toISOString(),
          type: "earn",
          amount: earnAmount,
          source: "anti-relapse-7" as const,
          label,
        };
        finalState.credit.ledger.push(entry);
        finalState.credit.balance += earnAmount;
        finalState.missions = finalState.missions.map(m => m.key === 'anti-relapse-7' ? { ...m, status: 'claimed', progress: 7 } : m);
        finalState = awardBadge(finalState, "anti-relapse-7");
      } else if (nextStreak.antiRelapseDays === 30) {
        // Auto reward 500 JC
        earnAmount = 500;
        label = "Tiga puluh hari menahan diri (Anti-relapse)";

        const entry: LedgerEntry = {
          id: "ledger-" + Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toISOString(),
          type: "earn",
          amount: earnAmount,
          source: "anti-relapse-30" as const,
          label,
        };
        finalState.credit.ledger.push(entry);
        finalState.credit.balance += earnAmount;
        finalState.missions = finalState.missions.map(m => m.key === 'anti-relapse-30' ? { ...m, status: 'claimed', progress: 30 } : m);
        finalState = awardBadge(finalState, "anti-relapse-30");
      }

      setState(finalState);
      if (earnAmount > 0) {
        showToast(label, earnAmount);
        checkLevelUp(oldXp, totalEarnedXp(finalState.credit.ledger), finalState);
      } else {
        showToast("Streak bebas pinjaman bertambah! Tetap kuat.", 0);
      }
    } else {
      // Streak reset, but still guard date so they don't toggle back and check "Ya"
      const nextState = {
        ...state,
        streak: {
          ...state.streak,
          antiRelapseDays: 0,
          lastAntiRelapseDate: todayStr,
        },
      };
      const evaluated = evaluateMissions(nextState);
      setState(evaluated);
      showToast("Terima kasih sudah jujur. Besok kita mulai lagi.", 0);
    }
  };

  const resetState = () => {
    resetAll();
    setCelebratingLevel(null);
    showToast("Data prototype berhasil di-reset.", 0);
  };

  const seedDemoState = () => {
    seedDemo();
    setCelebratingLevel(null);
    showToast("Data demo juri berhasil di-seed.", 0);
  };

  const clearLevelCelebration = () => {
    setCelebratingLevel(null);
  };

  return (
    <JedaContext.Provider
      value={{
        state,
        setState,
        isMounted,
        resetState,
        seedDemoState,
        addDebt,
        updateDebt,
        deleteDebt,
        addCheckIn,
        updateTaskStatus,
        createRecoveryPlan,
        claimMissionReward,
        confirmAntiRelapse,
        celebratingLevel,
        clearLevelCelebration,
        toast,
        showToast,
      }}
    >
      {children}
    </JedaContext.Provider>
  );
};

export const useJeda = () => {
  const context = useContext(JedaContext);
  if (context === undefined) {
    throw new Error("useJeda must be used within a JedaProvider");
  }
  return context;
};

export const useCredit = () => {
  const { state, claimMissionReward } = useJeda();
  return {
    credit: state.credit,
    balance: state.credit.balance,
    ledger: state.credit.ledger,
    claimMissionReward,
  };
};

export const useMissions = () => {
  const { state, claimMissionReward } = useJeda();
  return {
    missions: state.missions,
    claimMissionReward,
  };
};

export const useDebts = () => {
  const { state, addDebt, updateDebt, deleteDebt } = useJeda();
  return {
    debts: state.debts,
    addDebt,
    updateDebt,
    deleteDebt,
  };
};

export const useStreak = () => {
  const { state, confirmAntiRelapse } = useJeda();
  return {
    streak: state.streak,
    confirmAntiRelapse,
  };
};
