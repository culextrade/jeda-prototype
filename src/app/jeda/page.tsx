"use client";

// ── Tombol Jeda: ritual 90 detik ─────────────────────────────
// napas → simulasi biaya riil → 2 pertanyaan reflektif → keputusan dicatat.
// Tidak melarang, tidak menghakimi — hanya memberi jarak.

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import CountUp from "@/components/ui/CountUp";
import { RupiahInput } from "@/components/asesmen/panels";
import { PauseMark } from "@/components/shell/Logo";
import { StepDots } from "@/components/ui/Progress";
import {
  LEGAL_DAILY_RATE,
  ILLEGAL_DAILY_RATE,
  interestAvoided,
  simulateCost,
} from "@/lib/engine/simulasi";
import { REFLECTIVE_QUESTIONS } from "@/lib/content";
import { addJedaEvent, useJeda } from "@/lib/store";
import { rupiah, rupiahShort } from "@/lib/format";
import { uid } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Phase = "napas" | "angka" | "simulasi" | "refleksi" | "hasil";

const PHASE_INDEX: Record<Phase, number> = {
  napas: 0,
  angka: 1,
  simulasi: 2,
  refleksi: 3,
  hasil: 4,
};

const AMOUNT_PRESETS = [500_000, 1_000_000, 2_000_000];
const TENOR_PRESETS = [30, 60, 90];

export default function JedaPage() {
  const router = useRouter();
  const state = useJeda();

  const [phase, setPhase] = useState<Phase>("napas");
  const [breathText, setBreathText] = useState("Tarik napas…");
  const [canSkip, setCanSkip] = useState(false);
  const [amount, setAmount] = useState<number | undefined>();
  const [tenor, setTenor] = useState(30);
  const [reflIndex, setReflIndex] = useState(0);
  const [decision, setDecision] = useState<"tunda" | "lanjut" | null>(null);

  const income = state.assessment?.finance.income;

  // Napas: sinkron dengan animasi 8 dtk (4 tarik · 4 hembus)
  useEffect(() => {
    if (phase !== "napas") return;
    let inhale = true;
    const t = setInterval(() => {
      inhale = !inhale;
      setBreathText(inhale ? "Tarik napas…" : "Hembuskan pelan…");
    }, 4000);
    const skipT = setTimeout(() => setCanSkip(true), 8000);
    return () => {
      clearInterval(t);
      clearTimeout(skipT);
    };
  }, [phase]);

  const sim = amount ? simulateCost(amount, tenor, income) : null;

  function decide(d: "tunda" | "lanjut") {
    if (!amount) return;
    addJedaEvent({
      id: uid(),
      at: new Date().toISOString(),
      amount,
      tenorDays: tenor,
      decision: d,
      interestAvoided: d === "tunda" ? interestAvoided(amount) : 0,
    });
    setDecision(d);
    setPhase("hasil");
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-deep text-white">
      {/* Header */}
      <header className="z-10 flex items-center justify-between px-5 pt-5">
        <StepDots total={4} current={Math.min(3, PHASE_INDEX[phase])} />
        <button
          aria-label="Tutup"
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition-transform duration-150 ease-out active:scale-97"
        >
          <X size={17} />
        </button>
      </header>

      <main className="z-10 flex flex-1 flex-col overflow-y-auto px-7 pb-8">
        {/* ── Fase napas ── */}
        {phase === "napas" && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="relative mb-10 flex h-44 w-44 items-center justify-center">
              <span className="animate-breathe-halo absolute inset-0 rounded-full bg-pine/60" />
              <span className="animate-breathe flex h-32 w-32 items-center justify-center rounded-full bg-pine shadow-float">
                <PauseMark className="h-9 w-8" bar="bg-white" />
              </span>
            </div>
            <p
              key={breathText}
              className="fade-in font-display text-[24px] font-medium tracking-tight"
            >
              {breathText}
            </p>
            <p className="mt-3 max-w-[260px] text-[13px] leading-relaxed text-white/60">
              Dorongan itu nyata — dan dia akan mengecil kalau diberi jarak.
              Ikuti lingkarannya sebentar.
            </p>
            <div className="mt-10 h-[52px]">
              {canSkip && (
                <button
                  onClick={() => setPhase("angka")}
                  className="rise-in min-h-[48px] rounded-full bg-white px-8 text-[14px] font-semibold text-deep transition-transform duration-150 ease-out active:scale-97"
                >
                  Aku sudah lebih tenang →
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Fase angka ── */}
        {phase === "angka" && (
          <div className="flex flex-1 flex-col justify-center">
            <h1 className="rise-in font-display text-[26px] font-medium leading-snug tracking-tight">
              Berapa yang sedang ingin kamu pinjam?
            </h1>
            <p
              className="rise-in mt-2 text-[13px] text-white/60"
              style={{ ["--d" as string]: "80ms" }}
            >
              Atau nilai belanja yang sedang menggoda. Kita hitung dulu harga
              sebenarnya.
            </p>
            <div className="rise-in mt-6 rounded-lg bg-white p-1.5" style={{ ["--d" as string]: "160ms" }}>
              <RupiahInput value={amount} onChange={setAmount} placeholder="0" autoFocus />
            </div>
            <div className="rise-in mt-3 flex gap-2" style={{ ["--d" as string]: "220ms" }}>
              {AMOUNT_PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => setAmount(p)}
                  className={cn(
                    "flex-1 rounded-full border px-3 py-2 text-[12.5px] font-semibold transition-colors duration-150",
                    amount === p
                      ? "border-white bg-white text-deep"
                      : "border-white/25 text-white/75"
                  )}
                >
                  {rupiahShort(p)}
                </button>
              ))}
            </div>
            <p className="rise-in mt-6 text-[12.5px] font-semibold uppercase tracking-wide text-white/50" style={{ ["--d" as string]: "280ms" }}>
              Perkiraan tenor
            </p>
            <div className="rise-in mt-2 flex gap-2" style={{ ["--d" as string]: "320ms" }}>
              {TENOR_PRESETS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTenor(t)}
                  className={cn(
                    "flex-1 rounded-full border px-3 py-2 text-[12.5px] font-semibold transition-colors duration-150",
                    tenor === t
                      ? "border-white bg-white text-deep"
                      : "border-white/25 text-white/75"
                  )}
                >
                  {t} hari
                </button>
              ))}
            </div>
            <Button
              full
              className="mt-8 bg-white text-deep"
              disabled={!amount}
              onClick={() => setPhase("simulasi")}
            >
              Tunjukkan harga sebenarnya
            </Button>
          </div>
        )}

        {/* ── Fase simulasi ── */}
        {phase === "simulasi" && sim && (
          <div className="flex flex-1 flex-col justify-center">
            <p className="rise-in text-[12px] font-semibold uppercase tracking-[0.14em] text-white/50">
              Harga sebenarnya · {tenor} hari
            </p>
            <h1
              className="rise-in mt-2 font-display text-[38px] font-medium leading-none tracking-tight"
              style={{ ["--d" as string]: "80ms" }}
            >
              <CountUp value={sim.legalTotal} format={(v) => rupiah(v)} duration={900} />
            </h1>
            <p
              className="rise-in mt-2 text-[13px] leading-relaxed text-white/70"
              style={{ ["--d" as string]: "160ms" }}
            >
              {rupiah(sim.amount)} pokok +{" "}
              <span className="font-semibold text-amber">
                {rupiah(sim.legalInterest)} bunga
              </span>{" "}
              — itu pun di pindar legal (batas OJK 2026:{" "}
              {(LEGAL_DAILY_RATE * 100).toFixed(1)}%/hari).
            </p>

            <div
              className="rise-in mt-5 rounded-lg border border-danger/40 bg-danger/15 px-4 py-3"
              style={{ ["--d" as string]: "240ms" }}
            >
              <p className="text-[12.5px] leading-relaxed text-white/85">
                Di pinjol <strong>ilegal</strong> (±{ILLEGAL_DAILY_RATE * 100}%/hari):{" "}
                <span className="font-bold text-[#FFB4A0]">
                  {rupiah(sim.illegalTotal)}
                </span>{" "}
                — dan tidak ada aturan yang melindungimu.
              </p>
            </div>

            {sim.workDaysLegal && (
              <div
                className="rise-in mt-3 rounded-lg bg-white/[0.07] px-4 py-3"
                style={{ ["--d" as string]: "320ms" }}
              >
                <p className="text-[12.5px] leading-relaxed text-white/85">
                  Dengan penghasilanmu, jumlah itu ={" "}
                  <span className="font-display text-[17px] font-semibold text-amber">
                    <CountUp
                      value={sim.workDaysLegal}
                      format={(v) => v.toFixed(1)}
                      duration={900}
                    />{" "}
                    hari kerja
                  </span>{" "}
                  — berangkat pagi, pulang sore, untuk cicilan ini saja.
                </p>
              </div>
            )}

            <Button
              full
              className="mt-8 bg-white text-deep"
              onClick={() => setPhase("refleksi")}
            >
              Lanjut — dua pertanyaan singkat
            </Button>
          </div>
        )}

        {/* ── Fase refleksi ── */}
        {phase === "refleksi" && (
          <div className="flex flex-1 flex-col justify-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/50">
              Pertanyaan {reflIndex + 1} dari 2 · tidak ada jawaban salah
            </p>
            <h1
              key={reflIndex}
              className="rise-in mt-3 font-display text-[24px] font-medium leading-snug tracking-tight"
            >
              {REFLECTIVE_QUESTIONS[reflIndex]}
            </h1>
            <div className="mt-8 flex flex-col gap-2.5">
              {reflIndex === 0 ? (
                <>
                  <ReflButton onClick={() => setReflIndex(1)}>
                    Kebutuhan mendesak — tidak bisa menunggu
                  </ReflButton>
                  <ReflButton onClick={() => setReflIndex(1)}>
                    Sebenarnya… bisa menunggu 3 hari
                  </ReflButton>
                  <ReflButton onClick={() => setReflIndex(1)}>
                    Aku belum yakin
                  </ReflButton>
                </>
              ) : (
                <>
                  <ReflButton onClick={() => decide("tunda")}>
                    Terasa berat… aku tunda dulu
                  </ReflButton>
                  <ReflButton onClick={() => decide("lanjut")}>
                    Masih cukup — aku tetap perlu pinjam
                  </ReflButton>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Fase hasil ── */}
        {phase === "hasil" && decision && amount && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            {decision === "tunda" ? (
              <>
                <div className="rise-in mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-pine shadow-float">
                  <PauseMark className="h-7 w-6" bar="bg-white" />
                </div>
                <h1 className="rise-in font-display text-[28px] font-medium tracking-tight" style={{ ["--d" as string]: "80ms" }}>
                  Kamu barusan menang.
                </h1>
                <p className="rise-in mt-3 max-w-[280px] text-[13.5px] leading-relaxed text-white/70" style={{ ["--d" as string]: "160ms" }}>
                  {rupiah(amount)} tetap jadi milikmu — dan{" "}
                  <span className="font-semibold text-amber">
                    ±{rupiah(interestAvoided(amount))}
                  </span>{" "}
                  bunga 90 hari tidak pernah mulai berjalan.
                </p>
                <p className="rise-in mt-4 text-[12px] text-white/45" style={{ ["--d" as string]: "240ms" }}>
                  Tercatat di counter dampakmu. Dorongan biasanya kembali —
                  dan sekarang kamu tahu tempat menjedanya.
                </p>
              </>
            ) : (
              <>
                <h1 className="rise-in font-display text-[26px] font-medium tracking-tight">
                  Oke — tanpa penghakiman.
                </h1>
                <p className="rise-in mt-3 max-w-[290px] text-[13.5px] leading-relaxed text-white/70" style={{ ["--d" as string]: "100ms" }}>
                  Kalau memang harus meminjam, pinjamlah dengan aman:
                </p>
                <ul className="rise-in mt-5 flex w-full max-w-[300px] flex-col gap-2 text-left" style={{ ["--d" as string]: "200ms" }}>
                  {[
                    "Hanya di penyelenggara berizin OJK (cek daftarnya)",
                    "Satu pinjaman — jangan tumpuk",
                    `Pastikan total cicilan tetap di bawah 30% penghasilan`,
                    "Simpan bukti & baca biaya sebelum tanda tangan",
                  ].map((s) => (
                    <li key={s} className="flex items-start gap-2.5 rounded-md bg-white/[0.07] px-3.5 py-2.5 text-[12.5px] leading-relaxed text-white/85">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                      {s}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <Button
              full
              className="mt-9 bg-white text-deep"
              onClick={() => router.push(state.triage ? "/home" : "/")}
            >
              {decision === "tunda" ? "Kembali dengan tenang" : "Aku mengerti"}
            </Button>
          </div>
        )}
      </main>

      {/* Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[30%] h-[380px] w-[380px] -translate-x-1/2 rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(31,111,101,0.5) 0%, rgba(15,43,38,0) 65%)",
        }}
      />
    </div>
  );
}

function ReflButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rise-in min-h-[54px] w-full rounded-lg border border-white/20 bg-white/[0.06] px-5 text-left text-[14px] font-medium text-white transition-[transform,background-color] duration-150 ease-out hover:bg-white/10 active:scale-98"
    >
      {children}
    </button>
  );
}
