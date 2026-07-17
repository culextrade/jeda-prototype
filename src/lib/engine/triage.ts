// ── Mesin triage 3 jalur (kerangka klinis promotif–preventif–kuratif–rehabilitatif) ──
// Promotif berjalan di luar aplikasi (media sosial). Di dalam aplikasi:
// PREVENTIF (kondisi baik) · KURATIF (masalah ada, akar belum jelas) ·
// REHABILITATIF (akar diketahui). Krisis selalu memotong jalur mana pun.

import { Assessment, TriageResult } from "../types";
import { summarizeScreening } from "./screening";
import { summarizeFinance } from "./finance";

export const ROOT_CAUSE_LABEL: Record<string, string> = {
  impulsif: "Belanja atau pinjam impulsif",
  "gaya-hidup": "Gaya hidup melebihi penghasilan",
  "kebutuhan-pokok": "Penghasilan belum menutup kebutuhan pokok",
  darurat: "Kejadian darurat (sakit, PHK, musibah)",
  judi: "Judi atau trading berisiko",
  usaha: "Usaha yang belum kembali modal",
  "belum-tahu": "Belum tahu pasti",
};

export function runTriage(a: Assessment): TriageResult {
  const scr = summarizeScreening(a.screening);
  const fin = summarizeFinance(a.finance);

  const crisis = scr.dangerSignal || a.dangerSignal;

  const reasons: string[] = [...scr.lines, ...fin.reasons];

  // Aturan jalur — sederhana, deterministik, bisa dijelaskan ke user:
  let jalur: TriageResult["jalur"];
  if (scr.distress <= 1 && fin.burden <= 1 && fin.flags.length === 0) {
    jalur = "preventif";
    reasons.push(
      "Distres rendah dan beban finansial terkendali → fokus mencegah, bukan mengobati."
    );
  } else if (a.rootCause !== "belum-tahu") {
    jalur = "rehabilitatif";
    reasons.push(
      `Akar masalah sudah kamu kenali (${ROOT_CAUSE_LABEL[a.rootCause].toLowerCase()}) → langsung susun pemulihan yang menyasar akar itu.`
    );
  } else {
    jalur = "kuratif";
    reasons.push(
      "Ada beban yang nyata, tetapi akarnya belum jelas → kita cari polanya dulu lewat jurnal & eksplorasi, supaya yang diobati bukan cuma gejala."
    );
  }

  return {
    jalur,
    crisis,
    distress: scr.distress,
    burden: fin.burden,
    dsr: fin.dsr,
    flags: fin.flags,
    reasons,
  };
}

export const JALUR_META: Record<
  TriageResult["jalur"],
  { title: string; desc: string; color: "pine" | "amber" | "clay" }
> = {
  preventif: {
    title: "Preventif",
    desc: "Kondisimu masih baik. Tugas kita menjaganya tetap begitu — jeda sebelum utang baru, rapikan arus kas, bangun bantalan kecil.",
    color: "pine",
  },
  kuratif: {
    title: "Kuratif",
    desc: "Bebanmu nyata, tapi akarnya belum kelihatan. Kita telusuri polanya pelan-pelan — jurnal singkat tiap hari, sampai akarnya ketemu.",
    color: "amber",
  },
  rehabilitatif: {
    title: "Rehabilitatif",
    desc: "Akarnya sudah kamu kenali. Sekarang kita susun rencana pemulihan yang menyasar akar itu — bukan sekadar menambal gejala.",
    color: "clay",
  },
};
