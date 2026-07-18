"use client";

// ── Asesmen percakapan: cerita → PHQ-4 → (PHQ-9 / GAD-7) → utang → akar ──
// Skoring deterministik & dapat ditelusuri (lihat lib/engine/screening.ts).
// PHQ-9 item 9 > 0 → protokol krisis, selalu tanpa paywall.

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ChatBubble, Msg, TypingBubble } from "@/components/asesmen/ChatBits";
import {
  DebtPanel,
  MoneyPanel,
  RootPanel,
  ScalePanel,
  StoryPanel,
} from "@/components/asesmen/panels";
import { ProgressBar } from "@/components/ui/Progress";
import {
  GAD7_ITEMS,
  PHQ4_ITEMS,
  PHQ9_ITEMS,
  needsGad7,
  needsPhq9,
  summarizeScreening,
} from "@/lib/engine/screening";
import { FREQ_OPTIONS } from "@/lib/engine/screening";
import { ROOT_CAUSE_LABEL } from "@/lib/engine/triage";
import { completeAssessment, useJeda } from "@/lib/store";
import { AnswerValue, Assessment, Debt, RootCause } from "@/lib/types";
import { rupiahShort } from "@/lib/format";
import { uid } from "@/lib/utils";

type Stage =
  | "intro"
  | "phq4"
  | "phq9"
  | "krisis-hold"
  | "gad7"
  | "debts"
  | "income"
  | "akar"
  | "selesai";

interface Draft {
  stage: Stage;
  itemIndex: number;
  messages: Msg[];
  story: string[];
  phq4: AnswerValue[];
  phq9: AnswerValue[];
  gad7: AnswerValue[];
  debts: Debt[];
  income?: number;
  essentials?: number;
  borrowToRepay?: boolean;
  danger: boolean;
}

const DRAFT_KEY = "jeda.asesmen.draft";

const EMPTY: Draft = {
  stage: "intro",
  itemIndex: 0,
  messages: [],
  story: [],
  phq4: [],
  phq9: [],
  gad7: [],
  debts: [],
  danger: false,
};

const STAGE_PROGRESS: Record<Stage, number> = {
  intro: 0.06,
  phq4: 0.2,
  phq9: 0.42,
  "krisis-hold": 0.42,
  gad7: 0.58,
  debts: 0.74,
  income: 0.84,
  akar: 0.93,
  selesai: 1,
};

export default function AsesmenPage() {
  const router = useRouter();
  const state = useJeda();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [typing, setTyping] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  // draftRef = sumber kebenaran SINKRON. Semua perubahan lewat commit() agar
  // draftRef.current selalu terbaru dalam tick yang sama — tidak menunggu
  // render. Ini akar perbaikan seluruh kelas bug "baca setelah patch"
  // (mis. doneDebts membaca 0 pinjaman padahal baru saja ditambah).
  const draftRef = useRef(draft);
  const bootedRef = useRef(false);
  // Kunci re-entrancy: satu interaksi diproses pada satu waktu. Tanpa ini,
  // ketukan cepat / double-tap memicu handler dua kali dengan draft yang
  // sama-stale → gelembung ganda & jawaban tidak sinkron dengan input.
  const lockRef = useRef(false);

  // Satu-satunya jalan mengubah draft: perbarui ref (sinkron) lalu state.
  function commit(next: Draft) {
    draftRef.current = next;
    setDraft(next);
  }

  // ── util pesan ──
  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  async function say(texts: (string | { text: string; small?: boolean })[]) {
    setPanelVisible(false);
    for (const t of texts) {
      setTyping(true);
      await delay(Math.min(1100, 350 + String(typeof t === "string" ? t : t.text).length * 6));
      setTyping(false);
      const m: Msg =
        typeof t === "string"
          ? { id: uid(), who: "bot", text: t }
          : { id: uid(), who: "bot", text: t.text, small: t.small };
      commit({ ...draftRef.current, messages: [...draftRef.current.messages, m] });
      await delay(180);
    }
    setPanelVisible(true);
  }

  function userSay(text: string) {
    commit({
      ...draftRef.current,
      messages: [
        ...draftRef.current.messages,
        { id: uid(), who: "user", text },
      ],
    });
  }

  function patch(p: Partial<Draft>) {
    commit({ ...draftRef.current, ...p });
  }

  // ── persist draft ──
  useEffect(() => {
    if (!bootedRef.current) return;
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {}
  }, [draft]);

  // ── boot / resume ──
  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;
    let restored: Draft | null = null;
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) restored = JSON.parse(raw);
    } catch {}

    const resume = new URLSearchParams(window.location.search).get("resume");
    if (restored && restored.messages.length > 0) {
      commit(restored);
      if (restored.stage === "krisis-hold" && resume === "1") {
        // kembali dari layar krisis — lanjutkan dengan lembut
        void (async () => {
          await say([
            "Senang kamu kembali. Kita lanjutkan pelan-pelan ya — sisa beberapa langkah lagi.",
          ]);
          await afterPhq9(restored!);
        })();
      } else {
        setPanelVisible(true);
      }
      return;
    }
    void say([
      "Hai, aku JEDA. Di sini nggak ada penilaian — cuma peta.",
      "Sebelum angka-angka: apa yang paling terasa soal keuanganmu akhir-akhir ini?",
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── auto scroll ──
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [draft.messages.length, typing, panelVisible]);

  // ── transisi antar tahap ──
  async function startPhq4() {
    patch({ stage: "phq4", itemIndex: 0 });
    await say([
      "Terima kasih sudah jujur. Uang dan perasaan itu saling mengunci: tekanan finansial memicu cemas dan susah tidur — dan saat lelah, keputusan uang jadi makin impulsif.",
      "Makanya kita petakan dua-duanya. Aku mulai dari 4 pertanyaan singkat — skrining standar yang dipakai dokter di layanan primer. Ini bukan diagnosis, tapi peta awal yang jujur.",
      "Dalam 2 minggu terakhir, seberapa sering kamu terganggu oleh:",
      PHQ4_ITEMS[0],
    ]);
  }

  async function answerScale(v: AnswerValue) {
    if (lockRef.current) return; // abaikan ketukan kedua selagi diproses
    lockRef.current = true;
    try {
      const d = draftRef.current;
      userSay(FREQ_OPTIONS.find((o) => o.value === v)!.label);

      if (d.stage === "phq4") {
        const phq4 = [...d.phq4, v];
        if (phq4.length < 4) {
          patch({ phq4, itemIndex: phq4.length });
          await say([PHQ4_ITEMS[phq4.length]]);
          return;
        }
        patch({ phq4 });
        const toPhq9 = needsPhq9(phq4);
        const toGad7 = needsGad7(phq4);
        if (toPhq9) {
          patch({ stage: "phq9", itemIndex: 0, phq4 });
          await say([
            toGad7
              ? "Jawabanmu menunjukkan beban cemas dan suasana hati yang layak dilihat lebih dekat. Aku perdalam sebentar ya — supaya petamu akurat, bukan tebakan."
              : "Ada sinyal suasana hati yang layak dilihat lebih dekat. Aku perdalam sebentar ya.",
            PHQ9_ITEMS[0],
          ]);
        } else if (toGad7) {
          patch({ stage: "gad7", itemIndex: 0, phq4 });
          await say([
            "Ada sinyal kecemasan yang layak dilihat lebih dekat. Beberapa pertanyaan lagi ya.",
            GAD7_ITEMS[0],
          ]);
        } else {
          patch({ stage: "debts", itemIndex: 0, phq4 });
          await say([
            "Skor awalmu cukup baik — itu modal besar. 💚",
            "Sekarang sisi uangnya. Masukkan pinjaman yang sedang berjalan satu per satu. Kalau tidak ada, langsung ketuk “Cukup, lanjut”.",
          ]);
        }
        return;
      }

      if (d.stage === "phq9") {
        const phq9 = [...d.phq9, v];
        if (phq9.length < 9) {
          patch({ phq9, itemIndex: phq9.length });
          await say([PHQ9_ITEMS[phq9.length]]);
          return;
        }
        // item 9 terjawab
        if (v > 0) {
          patch({ phq9, danger: true, stage: "krisis-hold" });
          await say([
            "Terima kasih sudah berani jujur di pertanyaan terakhir tadi. Itu tidak mudah.",
            "Sebelum apa pun soal uang — ada yang lebih penting dulu. Aku tunjukkan ke mana kamu bisa bicara sekarang, gratis dan 24 jam.",
          ]);
          await delay(600);
          router.push("/krisis?from=asesmen");
          return;
        }
        patch({ phq9 });
        await afterPhq9({ ...d, phq9 });
        return;
      }

      if (d.stage === "gad7") {
        const gad7 = [...d.gad7, v];
        if (gad7.length < 7) {
          patch({ gad7, itemIndex: gad7.length });
          await say([GAD7_ITEMS[gad7.length]]);
          return;
        }
        patch({ gad7, stage: "debts", itemIndex: 0 });
        await say([
          "Selesai bagian perasaan. Kamu sudah melewati bagian yang paling berat. 🙏",
          "Sekarang sisi uangnya — tanpa menghakimi, kita cuma butuh peta. Masukkan pinjaman yang sedang berjalan satu per satu. Kalau tidak ada, ketuk “Cukup, lanjut”.",
        ]);
      }
    } finally {
      lockRef.current = false;
    }
  }

  async function afterPhq9(d: Draft) {
    if (needsGad7(d.phq4)) {
      patch({ stage: "gad7", itemIndex: 0, danger: d.danger });
      await say(["Sekarang sisi kecemasannya — 7 pertanyaan terakhir soal perasaan.", GAD7_ITEMS[0]]);
    } else {
      patch({ stage: "debts", itemIndex: 0, danger: d.danger });
      await say([
        "Selesai bagian perasaan. Kamu sudah melewati bagian yang paling berat. 🙏",
        "Sekarang sisi uangnya. Masukkan pinjaman yang sedang berjalan satu per satu. Kalau tidak ada, ketuk “Cukup, lanjut”.",
      ]);
    }
  }

  async function submitStory(selected: string[]) {
    if (lockRef.current) return;
    lockRef.current = true;
    try {
      userSay(selected.join(" · "));
      patch({ story: selected });
      await startPhq4();
    } finally {
      lockRef.current = false;
    }
  }

  // Tambah pinjaman: sinkron & idempoten per ketukan. Guard mencegah
  // double-tap "Tambah" menggandakan satu pinjaman.
  function addDebt(debt: Debt) {
    if (lockRef.current) return;
    lockRef.current = true;
    try {
      const d = draftRef.current;
      patch({ debts: [...d.debts, debt] });
      userSay(
        `${debt.name} — sisa ${rupiahShort(debt.outstanding)}, cicilan ${rupiahShort(debt.installment)}/bln`
      );
    } finally {
      lockRef.current = false;
    }
  }

  async function doneDebts() {
    if (lockRef.current) return;
    lockRef.current = true;
    try {
      const d = draftRef.current;
      patch({ stage: "income" });
      if (d.debts.length > 0) {
        const total = d.debts.reduce((t, x) => t + x.outstanding, 0);
        const cicilan = d.debts.reduce((t, x) => t + x.installment, 0);
        await say([
          `Tercatat: ${d.debts.length} pinjaman · total sisa ${rupiahShort(total)} · cicilan ${rupiahShort(cicilan)}/bulan.`,
          "Terakhir soal angka: penghasilan dan pengeluaran pokokmu — untuk menghitung rasio cicilan terhadap batas aman OJK (30% penghasilan).",
        ]);
      } else {
        await say([
          "Baik, tidak ada pinjaman berjalan. 👍",
          "Terakhir soal angka: penghasilan dan pengeluaran pokokmu per bulan.",
        ]);
      }
    } finally {
      lockRef.current = false;
    }
  }

  async function submitMoney(income: number, essentials: number, borrowToRepay: boolean) {
    if (lockRef.current) return;
    lockRef.current = true;
    try {
      userSay(
        `Penghasilan ${rupiahShort(income)}/bln · pokok ${rupiahShort(essentials)}/bln${borrowToRepay ? " · pernah gali lubang" : ""}`
      );
      patch({ income, essentials, borrowToRepay, stage: "akar" });
      await say([
        "Satu pertanyaan terakhir — dan ini yang paling penting.",
        "Menurutmu sendiri, apa yang paling membuatmu sampai di titik ini? Tidak apa-apa kalau belum tahu. Justru itu yang akan kita cari bersama.",
      ]);
    } finally {
      lockRef.current = false;
    }
  }

  async function submitRoot(root: RootCause) {
    if (lockRef.current) return;
    lockRef.current = true;
    try {
    userSay(ROOT_CAUSE_LABEL[root]);
    const d = draftRef.current;
    patch({ stage: "selesai" });

    const assessment: Assessment = {
      story: d.story,
      screening: {
        phq4: d.phq4.length ? d.phq4 : null,
        phq9: d.phq9.length === 9 ? d.phq9 : null,
        gad7: d.gad7.length === 7 ? d.gad7 : null,
      },
      finance: {
        income: d.income ?? 0,
        essentials: d.essentials ?? 0,
        debts: d.debts,
        borrowToRepay: d.borrowToRepay ?? false,
      },
      rootCause: root,
      dangerSignal: d.danger,
    };

    const scr = summarizeScreening(assessment.screening);
    await say([
      "Selesai. Terima kasih sudah memercayakan ceritamu. 🤝",
      `Ringkasanku: ${scr.lines.join(" · ")}${
        d.debts.length
          ? ` · ${d.debts.length} pinjaman aktif`
          : " · tanpa pinjaman aktif"
      }${d.borrowToRepay ? " · pola gali lubang" : ""}.`,
      {
        text: "Ringkasan dihitung dengan aturan skoring baku (bukan kotak hitam). Narasi AI pada prototype ini disimulasikan — versi produksi memakai LLM dengan guardrail klinis.",
        small: true,
      },
      "Sekarang — lihat apa arti semua ini untukmu.",
    ]);

    completeAssessment(assessment);
    try {
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {}
    } finally {
      lockRef.current = false;
    }
  }

  // ── render ──
  const scaleStage =
    draft.stage === "phq4" || draft.stage === "phq9" || draft.stage === "gad7";
  const totalItems =
    draft.stage === "phq4" ? 4 : draft.stage === "phq9" ? 9 : 7;

  const finished = draft.stage === "selesai" && state.triage;

  return (
    <div className="flex h-full flex-col bg-canvas">
      {/* Header */}
      <header className="z-10 flex items-center gap-3 border-b border-line/60 bg-canvas/95 px-4 pb-3 pt-4 backdrop-blur-sm">
        <button
          aria-label="Kembali"
          onClick={() => router.push("/")}
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-transform duration-150 ease-out active:scale-97"
        >
          <ArrowLeft size={19} strokeWidth={2.2} />
        </button>
        <div className="flex-1">
          <p className="text-[13px] font-semibold leading-none">Pemetaan kondisi</p>
          <p className="mt-1 text-[11px] text-ink-faint">
            Keuangan × kesehatan mental · ±3 menit
          </p>
        </div>
        <ProgressBar value={STAGE_PROGRESS[draft.stage]} className="w-16" />
      </header>

      {/* Chat */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overscroll-contain px-4 py-4"
      >
        <div className="flex flex-col gap-2.5 pb-2">
          {draft.messages.map((m) => (
            <ChatBubble key={m.id} msg={m} />
          ))}
          {typing && <TypingBubble />}
          {finished && (
            <div className="rise-in mt-2">
              <button
                onClick={() => router.push("/hasil")}
                className="w-full rounded-full bg-pine px-6 py-3.5 text-[15px] font-semibold text-white shadow-card transition-transform duration-150 ease-out active:scale-97"
              >
                Lihat hasilku →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Panel interaksi */}
      {panelVisible && !finished && (
        <div className="fade-in">
          {draft.stage === "intro" && <StoryPanel onSubmit={submitStory} />}
          {scaleStage && (
            <ScalePanel
              current={draft.itemIndex + 1}
              total={totalItems}
              onAnswer={(v) => void answerScale(v)}
            />
          )}
          {draft.stage === "debts" && (
            <DebtPanel
              count={draft.debts.length}
              onAdd={(d) => void addDebt(d)}
              onDone={() => void doneDebts()}
            />
          )}
          {draft.stage === "income" && <MoneyPanel onSubmit={(i, e, b) => void submitMoney(i, e, b)} />}
          {draft.stage === "akar" && <RootPanel onSubmit={(r) => void submitRoot(r)} />}
        </div>
      )}
    </div>
  );
}
