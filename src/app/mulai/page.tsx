"use client";

// ── Consent + disclaimer sebelum asesmen ─────────────────────

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, HeartPulse, Lock, Stethoscope } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { giveConsent } from "@/lib/store";
import { cn } from "@/lib/utils";

const POINTS = [
  {
    icon: HeartPulse,
    title: "Dua sisi, satu peta",
    desc: "JEDA memetakan kondisi keuangan dan kesehatan mentalmu sekaligus — karena keduanya saling mengunci.",
  },
  {
    icon: Stethoscope,
    title: "Skrining, bukan diagnosis",
    desc: "Kami memakai instrumen skrining standar layanan primer (PHQ-4, PHQ-9, GAD-7). Hasilnya peta awal — bukan vonis, bukan label.",
  },
  {
    icon: Lock,
    title: "Datamu tinggal di HP-mu",
    desc: "Tanpa akun, tanpa server. Jawabanmu tersimpan hanya di perangkat ini dan bisa kamu hapus kapan saja.",
  },
];

export default function MulaiPage() {
  const router = useRouter();
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);

  return (
    <div className="flex h-full flex-col bg-canvas">
      <header className="flex items-center gap-2 px-4 pt-4">
        <button
          aria-label="Kembali"
          onClick={() => router.push("/")}
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-transform duration-150 ease-out active:scale-97"
        >
          <ArrowLeft size={19} strokeWidth={2.2} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-4">
        <h1 className="rise-in font-display text-[28px] font-semibold leading-tight tracking-tight">
          Sebelum kita mulai
        </h1>
        <p
          className="rise-in mt-2 text-[13.5px] leading-relaxed text-ink-soft"
          style={{ ["--d" as string]: "80ms" }}
        >
          Sekitar 3 menit, berbentuk percakapan. Jawab sejujurnya — tidak ada
          jawaban yang salah, dan tidak ada yang menghakimi.
        </p>

        <div className="mt-5 flex flex-col gap-3">
          {POINTS.map((p, i) => (
            <Card
              key={p.title}
              className="rise-in flex items-start gap-3.5"
              style={{ ["--d" as string]: `${160 + i * 80}ms` } as React.CSSProperties}
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pine-tint text-pine">
                <p.icon size={18} strokeWidth={2.2} />
              </span>
              <div>
                <p className="text-[14px] font-semibold">{p.title}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">
                  {p.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-2.5">
          {[
            {
              checked: agree1,
              toggle: () => setAgree1((v) => !v),
              label:
                "Aku paham JEDA adalah alat skrining & pendampingan — bukan pengganti diagnosis dokter atau nasihat keuangan berlisensi.",
            },
            {
              checked: agree2,
              toggle: () => setAgree2((v) => !v),
              label: "Aku setuju jawabanku disimpan di perangkatku sendiri.",
            },
          ].map((c, i) => (
            <button
              key={i}
              onClick={c.toggle}
              className="flex items-start gap-3 rounded-md border border-line bg-surface p-3.5 text-left transition-transform duration-150 ease-out active:scale-98"
            >
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[7px] border transition-colors duration-150",
                  c.checked ? "border-pine bg-pine text-white" : "border-line bg-canvas"
                )}
              >
                {c.checked && <Check size={13} strokeWidth={3.5} />}
              </span>
              <span className="text-[12.5px] leading-relaxed text-ink">{c.label}</span>
            </button>
          ))}
        </div>
      </main>

      <footer className="px-6 pb-7 pt-2">
        <Button
          full
          disabled={!agree1 || !agree2}
          onClick={() => {
            giveConsent();
            router.push("/asesmen");
          }}
        >
          Aku siap — mulai percakapan
        </Button>
      </footer>
    </div>
  );
}
