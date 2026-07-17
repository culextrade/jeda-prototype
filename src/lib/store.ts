"use client";

// ── Store local-first (localStorage) + hook React ────────────
// Tidak ada server: seluruh data tinggal di perangkat user.

import { useSyncExternalStore } from "react";
import {
  Assessment,
  JedaEvent,
  JedaState,
  JournalEntry,
  RootCause,
} from "./types";
import { runTriage } from "./engine/triage";
import { generatePlan } from "./engine/plan";
import { getDemoState, getDemoJournalWeek } from "./seed";

const KEY = "jeda.v2";

export const DEFAULT_STATE: JedaState = {
  consentAt: undefined,
  assessment: undefined,
  triage: undefined,
  plan: undefined,
  jedaEvents: [],
  journal: [],
  membership: { plan: "gratis" },
  upgradeOffered: false,
  settings: { demo: false, demoDayOffset: 0 },
};

const isBrowser = typeof window !== "undefined";

let state: JedaState = DEFAULT_STATE;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (!isBrowser || loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    state = DEFAULT_STATE;
  }
}
load();

function persist() {
  if (!isBrowser) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // penuh / private mode — biarkan berjalan in-memory
  }
}

export function getState(): JedaState {
  return state;
}

export function set(partial: Partial<JedaState>) {
  state = { ...state, ...partial };
  persist();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useJeda(): JedaState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => DEFAULT_STATE
  );
}

// ── Aksi ─────────────────────────────────────────────────────

export function giveConsent() {
  set({ consentAt: new Date().toISOString() });
}

/** Simpan asesmen final + jalankan triage sekali jalan. */
export function completeAssessment(a: Assessment) {
  const triage = runTriage(a);
  set({
    assessment: { ...a, completedAt: new Date().toISOString() },
    triage,
  });
}

export function chooseJeda() {
  set({
    membership: {
      plan: "jeruk",
      since: new Date().toISOString(),
      choseExternal: false,
    },
  });
}

export function chooseExternal() {
  set({ membership: { ...state.membership, choseExternal: true } });
}

export function createPlan() {
  if (!state.assessment || !state.triage) return;
  const plan = generatePlan(state.assessment, state.triage);
  set({ plan });
}

export function toggleTask(taskId: string) {
  if (!state.plan) return;
  set({
    plan: {
      ...state.plan,
      tasks: state.plan.tasks.map((t) =>
        t.id === taskId ? { ...t, done: !t.done } : t
      ),
    },
  });
}

export function addJedaEvent(e: JedaEvent) {
  set({ jedaEvents: [e, ...state.jedaEvents] });
}

export function addJournal(entry: JournalEntry) {
  set({ journal: [entry, ...state.journal] });
}

export function offerUpgrade() {
  set({ upgradeOffered: true });
}

/** Kuratif → rehabilitatif setelah akar ditemukan lewat jurnal. */
export function upgradeToRehabilitatif(root: RootCause) {
  if (!state.assessment) return;
  const assessment: Assessment = { ...state.assessment, rootCause: root };
  const triage = runTriage(assessment);
  const plan = generatePlan(assessment, triage);
  set({ assessment, triage, plan, upgradeOffered: false });
}

export function resetAll() {
  state = { ...DEFAULT_STATE };
  persist();
  listeners.forEach((l) => l());
}

// ── Demo ─────────────────────────────────────────────────────

export function seedDemo() {
  state = getDemoState();
  persist();
  listeners.forEach((l) => l());
}

/** Demo "maju 7 hari": jurnal terisi 1 minggu → pola siap ditemukan. */
export function advanceDemoWeek() {
  const journal = [...getDemoJournalWeek(), ...state.journal];
  set({
    journal,
    settings: { ...state.settings, demoDayOffset: 7 },
  });
}
