"use client";

// ── Rencana Pemulihan — di-generate rule-based, aturannya terbuka ──

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Copy,
  Lock,
  Moon,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card, { SectionTitle } from "@/components/ui/Card";
import Sheet from "@/components/ui/Sheet";
import { createPlan, toggleTask, useJeda } from "@/lib/store";
import { JALUR_META } from "@/lib/engine/triage";
import { CBT_CARDS, SKRIP_DC } from "@/lib/content";
import { rupiahShort } from "@/lib/format";
import { PlanTask, TaskKind } from "@/lib/types";
import { cn } from "@/lib/utils";

const WEEK_META: Record<number, { title: string; focus: string }> = {
  1: { title: "Minggu 1", focus: "Stabilisasi — hentikan pendarahan" },
  2: { title: "Minggu 2", focus: "Negosiasi — redakan tekanan" },
  3: { title: "Minggu 3", focus: "Arus kas — atur napas" },
  4: { title: "Minggu 4", focus: "Penguatan — rawat akarnya" },
};

const KIND_STYLE: Record<TaskKind, string> = {
  keuangan: "bg-amber-tint text-warn",
  mental: "bg-clay-tint text-clay",
  perlindungan: "bg-danger-tint text-danger",
  kebiasaan: "bg-pine-tint text-pine-dark",
};

const GEN_STEPS = [
  "Membaca peta kondisimu…",
  "Mengurutkan utang menurut aturan prioritas…",
  "Menyisipkan modul sesuai kebutuhanmu…",
  "Menyusun 4 minggu pertamamu…",
];

export default function RencanaPage() {
  const router = useRouter();
  const state = useJeda();
  const [genStep, setGenStep] = useState(-1);
  const [skripOpen, setSkripOpen] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const generatingRef = useRef(false);

  const needGenerate =
    !!state.triage &&
    state.triage.jalur !== "preventif" &&
    state.membership.plan === "jeruk" &&
    !state.plan;

  useEffect(() => {
    if (!needGenerate || generatingRef.current) return;
    generatingRef.current = true;
    let i = 0;
    setGenStep(0);
    const tick = setInterval(() => {
      i += 1;
      if (i < GEN_STEPS.length) {
        setGenStep(i);
      } else {
        clearInterval(tick);
        createPlan();
        setGenStep(-1);
      }
    }, 620);
    return () => clearInterval(tick);
  }, [needGenerate]);

  // ── Belum asesmen ──
  if (!state.triage) {
    return (
      <EmptyShell
        title="Belum ada peta kondisi"
        desc="Rencana pemulihan disusun dari hasil pemetaanmu. Mulai dari percakapan singkat dulu ya."
        cta="Mulai pemetaan"
        onCta={() => router.push(state.consentAt ? "/asesmen" : "/mulai")}
      />
    );
  }

  // ── Sedang generate ──
  if (genStep >= 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-8 pb-24">
        <div className="w-full max-w-[300px]">
          <p className="mb-6 text-center font-display text-[20px] font-semibold tracking-tight">
            Menyusun rencanamu
          </p>
          <div className="flex flex-col gap-3">
            {GEN_STEPS.map((s, i) => (
              <div
                key={s}
                className={cn(
                  "flex items-center gap-3 text-[13px] transition-opacity duration-300",
                  i <= genStep ? "opacity-100" : "opacity-30"
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                    i < genStep
                      ? "bg-pine text-white"
                      : i === genStep
                        ? "bg-pine-tint text-pine"
                        : "bg-line/60 text-ink-faint"
                  )}
                >
                  {i < genStep ? (
                    <Check size={12} strokeWidth={3.5} />
                  ) : (
                    <span
                      className={cn("h-1.5 w-1.5 rounded-full bg-current", i === genStep && "animate-pulse-soft")}
                    />
                  )}
                </span>
                {s}
              </div>
            ))}
          </div>
          <p className="mt-7 text-center text-[10.5px] leading-relaxed text-ink-faint">
            Disusun dengan aturan terbuka (rule-based) — bisa ditelusuri di
            setiap langkah. Narasi AI pada versi produksi, dengan guardrail
            klinis.
          </p>
        </div>
      </div>
    );
  }

  // ── Preventif / gratis ──
  if (!state.plan) {
    if (state.triage.jalur === "preventif") {
      return <PreventifToolkit />;
    }
    return (
      <div className="px-5 pt-2">
        <Card className="flex flex-col items-center px-6 py-8 text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-tint text-warn">
            <Lock size={20} />
          </span>
          <p className="font-display text-[19px] font-semibold tracking-tight">
            Rencana personal menunggumu
          </p>
          <p className="mt-2 max-w-[280px] text-[13px] leading-relaxed text-ink-soft">
            Urutan utang, skrip negosiasi, dan 4 minggu pertama — bagian dari
            paket pendampingan seharga sebiji jeruk 🍊
          </p>
          <Button className="mt-5" onClick={() => router.push("/pilihan")}>
            Lihat pilihanku <ArrowRight size={16} />
          </Button>
        </Card>
        <p className="mt-4 text-center text-[12px] text-ink-faint">
          Tombol Jeda, jurnal, mode ditagih, dan protokol krisis tetap gratis
          untukmu.
        </p>
      </div>
    );
  }

  // ── Rencana aktif ──
  const plan = state.plan;
  const debts = state.assessment?.finance.debts ?? [];
  const doneCount = plan.tasks.filter((t) => t.done).length;
  const meta = JALUR_META[plan.jalur];

  return (
    <div className="px-5 pt-1">
      {/* Ringkas */}
      <Card className="bg-deep p-5 text-white">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide">
            Jalur {meta.title}
          </span>
          <Sparkles size={16} className="text-amber" />
        </div>
        <p className="mt-3 text-[13.5px] leading-relaxed text-white/85">
          Satu langkah kecil per hari. Rencana ini menyasar{" "}
          <strong>akar</strong>, bukan cuma gejala — dan berubah mengikuti
          perkembanganmu.
        </p>
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11.5px] text-white/70">
            <span>
              {doneCount} dari {plan.tasks.length} langkah selesai
            </span>
            <span>{Math.round((doneCount / plan.tasks.length) * 100)}%</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-amber transition-[width] duration-500 ease-out"
              style={{ width: `${(doneCount / plan.tasks.length) * 100}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Urutan utang */}
      <SectionTitle className="mt-6">Urutan penanganan utang</SectionTitle>
      <p className="mt-1 px-1 text-[12px] leading-relaxed text-ink-soft">
        Aturannya terbuka: tak berizin → menunggak & ditagih kasar → beban
        bulanan terbesar.
      </p>
      <div className="mt-3 flex flex-col gap-2.5">
        {plan.debtOrder.map((o, i) => {
          const d = debts.find((x) => x.id === o.debtId);
          if (!d) return null;
          return (
            <Card key={o.debtId} className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pine text-[13px] font-bold text-white">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="text-[14.5px] font-semibold">{d.name}</p>
                  {d.licensed === "tidak" && (
                    <span className="rounded-full bg-danger-tint px-2 py-0.5 text-[10px] font-bold text-danger">
                      TAK BERIZIN
                    </span>
                  )}
                  {d.overdue && (
                    <span className="rounded-full bg-amber-tint px-2 py-0.5 text-[10px] font-bold text-warn">
                      MENUNGGAK
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[12px] text-ink-soft">
                  Sisa {rupiahShort(d.outstanding)} · cicilan{" "}
                  {rupiahShort(d.installment)}/bln
                </p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-ink-soft">
                  {o.reason}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Skrip negosiasi */}
      <button
        onClick={() => setSkripOpen(true)}
        className="mt-3 flex w-full items-center gap-3.5 rounded-lg border border-line bg-surface p-4 shadow-card transition-transform duration-150 ease-out active:scale-98"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pine-tint text-pine">
          <ShieldCheck size={18} />
        </span>
        <span className="flex-1 text-left">
          <span className="block text-[14px] font-semibold">
            Skrip negosiasi & hak konsumen
          </span>
          <span className="text-[12px] text-ink-soft">
            Kalimat siap salin untuk menghadapi penagih
          </span>
        </span>
        <ChevronRight size={17} className="text-ink-faint" />
      </button>

      {/* 4 minggu */}
      <SectionTitle className="mt-7">4 minggu pertamamu</SectionTitle>
      {[1, 2, 3, 4].map((w) => {
        const tasks = plan.tasks.filter((t) => t.week === w);
        if (tasks.length === 0) return null;
        return (
          <div key={w} className="mt-4">
            <div className="flex items-baseline gap-2 px-1">
              <p className="text-[13px] font-bold text-pine">{WEEK_META[w].title}</p>
              <p className="text-[11.5px] text-ink-faint">{WEEK_META[w].focus}</p>
            </div>
            <div className="mt-2 flex flex-col gap-2">
              {tasks.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
            </div>
          </div>
        );
      })}

      {/* CBT mikro */}
      <SectionTitle className="mt-7">Latihan pikiran & uang</SectionTitle>
      <p className="mt-1 px-1 text-[12px] text-ink-soft">
        Keyakinan lama yang menjerat — dan cara mengujinya.
      </p>
      <div className="scrollbar-none -mx-5 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1">
        {CBT_CARDS.map((c) => (
          <div
            key={c.belief}
            className="w-[250px] shrink-0 snap-center rounded-lg border border-line bg-surface p-4 shadow-card"
          >
            <p className="font-display text-[15px] font-medium italic leading-snug text-clay">
              {c.belief}
            </p>
            <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink">
              {c.challenge}
            </p>
            <p className="mt-2.5 rounded-md bg-pine-tint px-3 py-2 text-[11.5px] font-medium leading-relaxed text-pine-dark">
              Coba: {c.action}
            </p>
          </div>
        ))}
      </div>

      {/* Modul tidur shortcut */}
      <Link
        href="/tidur"
        className="mt-4 flex items-center gap-3.5 rounded-lg bg-deep p-4 text-white shadow-card transition-transform duration-150 ease-out active:scale-98"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/12">
          <Moon size={18} className="text-amber" />
        </span>
        <span className="flex-1">
          <span className="block text-[14px] font-semibold">Modul tidur</span>
          <span className="text-[12px] text-white/70">
            Tidur yang pulih = rem impuls yang bekerja
          </span>
        </span>
        <ChevronRight size={17} className="text-white/60" />
      </Link>

      {/* Batas kompetensi */}
      <p className="mt-6 rounded-md border border-line/70 bg-surface/60 px-4 py-3 text-[11.5px] leading-relaxed text-ink-soft">
        <strong>Catatan batas:</strong> bila dalam 4 minggu skormu tidak
        membaik — atau kapan pun terasa memberat — rencana ini otomatis
        mengarahkanmu ke profesional (psikolog Puskesmas, Healing119). Itu
        bukan kegagalan; itu bagian dari rencana.
      </p>

      {/* Sheet skrip */}
      <Sheet open={skripOpen} onClose={() => setSkripOpen(false)} title="Skrip menghadapi penagih">
        <div className="flex flex-col gap-3 pb-2">
          {SKRIP_DC.map((s, i) => (
            <div key={s.title} className="rounded-md border border-line bg-canvas/50 p-3.5">
              <p className="text-[13px] font-semibold">{s.title}</p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">
                “{s.text}”
              </p>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(s.text);
                  setCopied(i);
                  setTimeout(() => setCopied(null), 1500);
                }}
                className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-pine-tint px-3 py-1.5 text-[11.5px] font-semibold text-pine-dark transition-transform duration-150 ease-out active:scale-97"
              >
                {copied === i ? <Check size={12} /> : <Copy size={12} />}
                {copied === i ? "Tersalin" : "Salin"}
              </button>
            </div>
          ))}
          <Link
            href="/dc"
            className="mt-1 text-center text-[12.5px] font-semibold text-pine underline-offset-2 hover:underline"
            onClick={() => setSkripOpen(false)}
          >
            Sedang ditagih sekarang? Buka Mode Tenang →
          </Link>
        </div>
      </Sheet>
    </div>
  );
}

function TaskRow({ task }: { task: PlanTask }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-line/80 bg-surface p-3.5 shadow-card">
      <button
        aria-label={task.done ? "Tandai belum selesai" : "Tandai selesai"}
        onClick={() => toggleTask(task.id)}
        className={cn(
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[9px] border-2 transition-colors duration-150 ease-out active:scale-95",
          task.done ? "border-pine bg-pine text-white" : "border-line bg-canvas"
        )}
      >
        {task.done && <Check size={13} strokeWidth={3.5} />}
      </button>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-[13.5px] font-semibold leading-snug",
            task.done && "text-ink-faint line-through decoration-ink-faint/50"
          )}
        >
          {task.title}
        </p>
        {task.detail && (
          <p className="mt-1 text-[12px] leading-relaxed text-ink-soft">{task.detail}</p>
        )}
        <div className="mt-1.5 flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
              KIND_STYLE[task.kind]
            )}
          >
            {task.kind}
          </span>
          {task.href && (
            <Link
              href={task.href}
              className="text-[11.5px] font-semibold text-pine underline-offset-2 hover:underline"
            >
              Buka modul →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function PreventifToolkit() {
  return (
    <div className="px-5 pt-1">
      <Card className="bg-pine p-5 text-white">
        <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide">
          Jalur Preventif
        </span>
        <p className="mt-3 font-display text-[20px] font-semibold leading-snug">
          Kondisimu baik — mari jaga tetap begitu
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-white/85">
          Tiga kebiasaan kecil di bawah ini jauh lebih murah daripada satu
          pinjaman panik.
        </p>
      </Card>
      <div className="mt-4 flex flex-col gap-2.5">
        {[
          {
            title: "Jeda sebelum utang baru",
            desc: "Buka Tombol Jeda tiap ada dorongan — 90 detik yang menyelamatkan ratusan ribu rupiah.",
            href: "/jeda",
          },
          {
            title: "Bantalan mikro harian",
            desc: "Rp5–10 rb/hari. Dalam 3 bulan kamu punya alasan untuk tidak meminjam.",
            href: "/home",
          },
          {
            title: "Jurnal mood × uang",
            desc: "60 detik sebelum tidur — deteksi pola sebelum jadi masalah.",
            href: "/jurnal",
          },
        ].map((c) => (
          <Link
            key={c.title}
            href={c.href}
            className="flex items-center gap-3.5 rounded-lg border border-line bg-surface p-4 shadow-card transition-transform duration-150 ease-out active:scale-98"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold">{c.title}</p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-ink-soft">{c.desc}</p>
            </div>
            <ChevronRight size={17} className="shrink-0 text-ink-faint" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function EmptyShell({
  title,
  desc,
  cta,
  onCta,
}: {
  title: string;
  desc: string;
  cta: string;
  onCta: () => void;
}) {
  return (
    <div className="px-5 pt-2">
      <Card className="flex flex-col items-center px-6 py-10 text-center">
        <p className="font-display text-[19px] font-semibold tracking-tight">{title}</p>
        <p className="mt-2 max-w-[280px] text-[13px] leading-relaxed text-ink-soft">{desc}</p>
        <Button className="mt-5" onClick={onCta}>
          {cta} <ArrowRight size={16} />
        </Button>
      </Card>
    </div>
  );
}
