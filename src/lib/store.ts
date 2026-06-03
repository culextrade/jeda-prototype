import { JedaState } from "./types";
import { INITIAL_MISSIONS } from "./missions";
import { getDemoState } from "./seed";

const STORAGE_KEY = "jeda.state";

export const DEFAULT_STATE: JedaState = {
  profile: undefined,
  checkIns: [],
  debts: [],
  recoveryPlans: [],
  credit: {
    balance: 0,
    ledger: [],
  },
  missions: INITIAL_MISSIONS,
  streak: {
    current: 0,
    longest: 0,
  },
  badges: [],
  referrals: [],
  settings: {
    remindersOptIn: false,
    reduceMotion: false,
    demoMode: false,
  },
};

let currentState: JedaState = { ...DEFAULT_STATE };
const listeners = new Set<() => void>();

// Helper to check if window is available (SSR guard)
const isBrowser = typeof window !== "undefined";

// Load state from localStorage on first import in browser
if (isBrowser) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      currentState = { ...DEFAULT_STATE, ...JSON.parse(raw) };
    } else {
      currentState = { ...DEFAULT_STATE };
      // Generate anonymous profile ID
      currentState.profile = {
        anonId: "jeda-anon-" + Math.random().toString(36).substring(2, 11),
        createdAt: new Date().toISOString(),
        levelKey: "berani-melihat",
        consentTier: 0,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
    }
  } catch (e) {
    console.error("Failed to load JEDA state from localStorage:", e);
  }
}

export function getState(): JedaState {
  return currentState;
}

export function setState(partial: Partial<JedaState> | ((state: JedaState) => Partial<JedaState>)): void {
  const nextPartial = typeof partial === "function" ? partial(currentState) : partial;
  currentState = { ...currentState, ...nextPartial };

  if (isBrowser) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
    } catch (e) {
      console.error("Failed to write JEDA state to localStorage:", e);
    }
  }

  // Notify listeners
  listeners.forEach((listener) => listener());
}

export function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function resetAll(): void {
  currentState = {
    ...DEFAULT_STATE,
    profile: {
      anonId: "jeda-anon-" + Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      levelKey: "berani-melihat",
      consentTier: 0,
    },
  };

  if (isBrowser) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
    } catch (e) {
      console.error("Failed to reset localStorage JEDA state:", e);
    }
  }

  listeners.forEach((listener) => listener());
}

export function seedDemo(): void {
  currentState = getDemoState();

  if (isBrowser) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
    } catch (e) {
      console.error("Failed to seed localStorage JEDA state:", e);
    }
  }

  listeners.forEach((listener) => listener());
}
