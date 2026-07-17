"use client";

// ── Beranda hub pasca-triage ─────────────────────────────────

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Info,
  LifeBuoy,
  Moon,
  Sparkles,
} from "lucide-react";
import Card, { SectionTitle } from "@/components/ui/Card";
import CountUp from "@/components/ui/CountUp";
import Button from "@/components/ui/Button";
import { useJeda } from "@/lib/store";
import { JALUR_META } from "@/lib/engine/triage";
import { journalInsight } from "@/lib/engine/journal";
import { rupiahShort } from "@/lib/format";

export default function HomePage() {
  const router = useRouter();
  const state = useJeda();

  if (!state.triage) {
    return (
      <div className="px-5 pt-2">
        <Card className="flex flex-col items-center px-6 py-10 text-center">
          <p className="font-display text-[20px] font-semibold tracking-tight">
            Mulai dari peta, bukan tebakan
          </p>
          <p className="mt-2 max-w-[280px] text-[13px] leading-relaxed text-ink-soft">
            3 menit percakapan untuk memetakan kondisi keuangan × mentalmu.
            Gratis, anonim, tanpa akun.
          </p>
          <Button className="mt-5" onClick={() => router.push(state.consentAt ? "/asesmen" : "/mulai")}>
            Mulai pemetaan <ArrowRight size={16} />
          </Button>
        </Card>
      </div>
    );
  }

  const t = state.triage;
  const meta = JALUR_META[t.jalur];
  const tunda = state.jedaEvents.filter((e) => e.decision === "tunda");
  const nominalTunda = tunda.reduce((s, e) => s + e.amount, 0);
  const bungaHemat = tunda.reduce((s, e) => s + e.interestAvoided, 0);

  const insight = journalInsight(state.journal);
  const nextTask = state.plan?.tasks.find((x) => !x.done);
  const showUpgrade = t.jalur === "kuratif" && insight.found;

  return (
    <div className="px-5 pt-1">
      {/* Sapaan + jalur */}
      <div className="rise-in">
        <p className="px-1 font-display text-[24px] font-semibold leading-snug tracking-tight">
          {tunda.length > 0 ? (
            <>
              Kamu sudah menjeda{" "}
              <em className="italic text-pine">{tunda.length} keputusan</em>
            </>
          ) : (
            <>Satu jeda kecil, tiap hari</>
          )}
        </p>
        <Link
          href="/hasil"
          className="mt-3 flex items-center gap-3 rounded-lg border border-line bg-surface p-3.5 shadow-card transition-transform duration-150 ease-out active:scale-98"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pine-tint">
            <span className="h-2.5 w-2.5 rounded-full bg-pine" />
          </span>
          <span className="flex-1">
            <span className="block text-[13.5px] font-semibold">
              Jalur {meta.title}
            </span>
            <span className="text-[11.5px] text-ink-soft">
              Lihat lagi peta & alasan penilaianmu
            </span>
          </span>
          <ChevronRight size={16} className="text-ink-faint" />
        </Link>
      </div>

      {/* Upgrade kuratif → rehabilitatif */}
      {showUpgrade && (
        <Link
          href="/jurnal"
          className="rise-in mt-3 flex items-center gap-3.5 rounded-lg border border-amber/50 bg-amber-tint p-4 shadow-card transition-transform duration-150 ease-out active:scale-98"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber text-white">
            <Sparkles size={18} />
          </span>
          <span className="flex-1">
            <span className="block text-[13.5px] font-bold text-warn">
              Pola akar masalahmu ketemu!
            </span>
            <span className="text-[12px] leading-snug text-ink-soft">
              Buka jurnal untuk melihat & naik ke jalur Rehabilitatif
            </span>
          </span>
          <ChevronRight size={16} className="text-warn" />
        </Link>
      )}

      {/* Counter dampak */}
      <Card className="mt-4 bg-deep p-5 text-white">
        <p className="text-[12px] font-semibold uppercase tracking-[0.13em] text-white/55">
          Dampak jedamu
        </p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <div>
            <p className="font-display text-[26px] font-semibold leading-none">
              <CountUp value={tunda.length} format={(v) => String(Math.round(v))} />
            </p>
            <p className="mt-1.5 text-[10.5px] leading-tight text-white/60">
              keputusan
              <br />
              dijeda
            </p>
          </div>
          <div>
            <p className="font-display text-[26px] font-semibold leading-none text-amber">
              <CountUp value={nominalTunda} format={(v) => rupiahShort(v)} />
            </p>
            <p className="mt-1.5 text-[10.5px] leading-tight text-white/60">
              utang baru
              <br />
              ditunda
            </p>
          </div>
          <div>
            <p className="font-display text-[26px] font-semibold leading-none text-amber">
              <CountUp value={bungaHemat} format={(v) => rupiahShort(v)} />
            </p>
            <p className="mt-1.5 text-[10.5px] leading-tight text-white/60">
              bunga tak jadi
              <br />
              berjalan*
            </p>
          </div>
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-white/40">
          *estimasi 90 hari pada batas bunga legal. Inilah metrik dampak JEDA —
          terukur langsung di aplikasi, bukan klaim.
        </p>
      </Card>

      {/* Langkah hari ini */}
      {nextTask && (
        <>
          <SectionTitle className="mt-6">Langkah berikutnya</SectionTitle>
          <Link
            href={nextTask.href ?? "/rencana"}
            className="mt-2.5 flex items-start gap-3.5 rounded-lg border border-pine/25 bg-pine-tint/60 p-4 transition-transform duration-150 ease-out active:scale-98"
          >
            <span className="mt-0.5 h-5 w-5 shrink-0 rounded-[8px] border-2 border-pine/50 bg-surface" />
            <span className="flex-1">
              <span className="block text-[13.5px] font-semibold leading-snug">
                {nextTask.title}
              </span>
              {nextTask.detail && (
                <span className="mt-0.5 block text-[11.5px] leading-relaxed text-ink-soft">
                  {nextTask.detail}
                </span>
              )}
            </span>
          </Link>
        </>
      )}

      {/* Aksi cepat */}
      <SectionTitle className="mt-6">Alatmu</SectionTitle>
      <div className="mt-2.5 grid grid-cols-2 gap-2.5">
        {[
          {
            href: "/jurnal",
            icon: BookOpen,
            title: "Jurnal malam ini",
            desc: "60 detik — mood × uang",
            tone: "bg-pine-tint text-pine-dark",
          },
          {
            href: "/dc",
            icon: LifeBuoy,
            title: "Mode Tenang",
            desc: "Saat penagih menekan",
            tone: "bg-clay-tint text-clay",
          },
          {
            href: "/tidur",
            icon: Moon,
            title: "Modul tidur",
            desc: "Rem impuls dimulai di sini",
            tone: "bg-amber-tint text-warn",
          },
          {
            href: "/tentang",
            icon: Info,
            title: "Tentang prototype",
            desc: "Status jujur & privasi",
            tone: "bg-line/50 text-ink-soft",
          },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="rounded-lg border border-line bg-surface p-4 shadow-card transition-transform duration-150 ease-out active:scale-98"
          >
            <span className={`flex h-9 w-9 items-center justify-center rounded-full ${a.tone}`}>
              <a.icon size={17} strokeWidth={2.2} />
            </span>
            <p className="mt-2.5 text-[13px] font-semibold leading-tight">{a.title}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-ink-faint">{a.desc}</p>
          </Link>
        ))}
      </div>

      <p className="mt-6 px-2 text-center text-[11px] leading-relaxed text-ink-faint">
        Merasa memburuk kapan pun?{" "}
        <Link href="/krisis" className="font-semibold text-clay underline-offset-2 hover:underline">
          Bantuan 24 jam selalu di sini
        </Link>{" "}
        — gratis.
      </p>
    </div>
  );
}
