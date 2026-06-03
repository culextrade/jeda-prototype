import { LevelKey } from "./types";

export interface LevelDefinition {
  key: LevelKey;
  name: string;
  minXp: number;
  description: string;
}

export const LEVELS: LevelDefinition[] = [
  {
    key: "berani-melihat",
    name: "Berani Melihat",
    minXp: 0,
    description: "Mau melihat kondisi sendiri (check-in pertama)",
  },
  {
    key: "mulai-memetakan",
    name: "Mulai Memetakan",
    minXp: 80,
    description: "Memetakan utang secara jujur dan terbuka",
  },
  {
    key: "menata-langkah",
    name: "Menata Langkah",
    minXp: 200,
    description: "Punya rencana pemulihan & menjalankan langkah kecil",
  },
  {
    key: "menjaga-jeda",
    name: "Menjaga Jeda",
    minXp: 380,
    description: "Streak harian terjaga secara konsisten",
  },
  {
    key: "konsisten-pulih",
    name: "Konsisten Pulih",
    minXp: 650,
    description: "Anti-relapse 7+ hari dan mengendalikan keinginan meminjam",
  },
  {
    key: "pejuang-jeda",
    name: "Pejuang Jeda",
    minXp: 1000,
    description: "Anti-relapse 30 hari & siap mendampingi sesama",
  },
];

export function getLevelByXp(xp: number): LevelDefinition {
  // Sort descending and find the first level where xp is >= minXp
  const sorted = [...LEVELS].sort((a, b) => b.minXp - a.minXp);
  const found = sorted.find((lvl) => xp >= lvl.minXp);
  return found || LEVELS[0];
}

export function getNextLevel(currentKey: LevelKey): LevelDefinition | null {
  const currentIndex = LEVELS.findIndex((l) => l.key === currentKey);
  if (currentIndex !== -1 && currentIndex < LEVELS.length - 1) {
    return LEVELS[currentIndex + 1];
  }
  return null;
}
