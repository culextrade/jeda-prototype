import { Debt, CheckIn, RecoveryPlan, LedgerEntry } from "./types";
import { getLevelByXp, LEVELS, LevelDefinition } from "./levels";

export function totalEarnedXp(ledger: LedgerEntry[]): number {
  return ledger
    .filter((entry) => entry.type === "earn" && entry.source !== "demo-seed")
    .reduce((sum, entry) => sum + entry.amount, 0);
}

export function totalOutstanding(debts: Debt[]): number {
  return debts.reduce((sum, d) => sum + d.outstanding, 0);
}

export function nearestDueDebt(debts: Debt[]): Debt | null {
  const withDueDate = debts.filter((d) => d.dueDate);
  if (withDueDate.length === 0) return null;

  return withDueDate.reduce((nearest, current) => {
    if (!nearest.dueDate) return current;
    if (!current.dueDate) return nearest;
    return new Date(current.dueDate) < new Date(nearest.dueDate) ? current : nearest;
  });
}

/**
 * Priority order sorting:
 * 1. Collector pressure (highest 3 to lowest 1, undefined last)
 * 2. Due date (earliest first, undefined last)
 * 3. Interest rate (highest first, undefined last)
 * 4. Outstanding amount (highest first)
 */
export function priorityOrder(debts: Debt[]): Debt[] {
  return [...debts].sort((a, b) => {
    // 1. Collector Pressure
    const pressureA = a.collectorPressure ?? 0;
    const pressureB = b.collectorPressure ?? 0;
    if (pressureA !== pressureB) {
      return pressureB - pressureA; // High pressure first
    }

    // 2. Due Date
    if (a.dueDate || b.dueDate) {
      if (!a.dueDate) return 1;  // a goes last
      if (!b.dueDate) return -1; // b goes last
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      if (dateA !== dateB) {
        return dateA - dateB; // Earliest first
      }
    }

    // 3. Interest Rate
    if (a.interestRate !== undefined || b.interestRate !== undefined) {
      const rateA = a.interestRate ?? 0;
      const rateB = b.interestRate ?? 0;
      if (rateA !== rateB) {
        return rateB - rateA; // Higher first
      }
    }

    // 4. Outstanding
    return b.outstanding - a.outstanding; // Larger outstanding first
  });
}

export function currentLevel(xp: number): LevelDefinition {
  return getLevelByXp(xp);
}

export function xpToNextLevel(xp: number): number {
  const currentLvl = getLevelByXp(xp);
  const currentIndex = LEVELS.findIndex((l) => l.key === currentLvl.key);
  if (currentIndex !== -1 && currentIndex < LEVELS.length - 1) {
    const nextLvl = LEVELS[currentIndex + 1];
    return Math.max(0, nextLvl.minXp - xp);
  }
  return 0; // Max level reached
}

export function completionRate(plan: RecoveryPlan | null): number {
  if (!plan || plan.tasks.length === 0) return 0;
  const doneCount = plan.tasks.filter((t) => t.done).length;
  return Math.round((doneCount / plan.tasks.length) * 100);
}

export function lastIntentToBorrow(checkins: CheckIn[]): number {
  if (checkins.length === 0) return 0;
  // Get latest by timestamp
  const sorted = [...checkins].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  return sorted[0].intentToBorrow;
}

export function checkinCount(checkins: CheckIn[]): number {
  return checkins.length;
}
