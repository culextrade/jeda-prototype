"use client";

// ── Protokol krisis — SELALU gratis, tidak pernah di balik paywall ──

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, ExternalLink, MapPin } from "lucide-react";
import { CRISIS } from "@/lib/content";
import { PauseMark } from "@/components/shell/Logo";

const ICONS = [Phone, ExternalLink, MapPin];

export default function KrisisPage() {
  const router = useRouter();

  // Baca query di effect — saat render pertama dari router.push,
  // window.location bisa masih menunjuk URL lama.
  const [cameFromAsesmen, setCameFromAsesmen] = useState(false);
  useEffect(() => {
    setCameFromAsesmen(window.location.search.includes("from=asesmen"));
  }, []);

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-deep text-white">
      <main className="flex flex-1 flex-col px-6 pb-8 pt-10">
        <div className="fade-in mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
          <span className="animate-breathe flex h-11 w-11 items-center justify-center rounded-full bg-clay">
            <PauseMark className="h-4 w-3.5" bar="bg-white" />
          </span>
        </div>

        <h1 className="rise-in text-center font-display text-[26px] font-medium leading-snug tracking-tight">
          {CRISIS.headline}
        </h1>
        <p
          className="rise-in mx-auto mt-3 max-w-[310px] text-center text-[13.5px] leading-relaxed text-white/70"
          style={{ ["--d" as string]: "100ms" }}
        >
          {CRISIS.body}
        </p>

        <div className="mt-7 flex flex-col gap-3">
          {CRISIS.contacts.map((c, i) => {
            const Icon = ICONS[i] ?? Phone;
            return (
              <a
                key={c.name}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="rise-in flex items-center gap-4 rounded-lg bg-white/[0.07] p-4 backdrop-blur-sm transition-transform duration-150 ease-out active:scale-98"
                style={{ ["--d" as string]: `${180 + i * 90}ms` } as React.CSSProperties}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-deep">
                  <Icon size={19} strokeWidth={2.2} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14.5px] font-semibold">{c.name}</span>
                  <span className="mt-0.5 block text-[12px] leading-snug text-white/60">
                    {c.detail}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-clay px-3.5 py-2 text-[12px] font-semibold">
                  {i === 0 ? "Telepon" : "Buka"}
                </span>
              </a>
            );
          })}
        </div>

        <p
          className="fade-in mt-6 text-center text-[11.5px] leading-relaxed text-white/45"
          style={{ ["--d" as string]: "520ms" }}
        >
          {CRISIS.note}
        </p>

        <div className="mt-auto flex flex-col gap-2 pt-8">
          <button
            onClick={() =>
              router.push(cameFromAsesmen ? "/asesmen?resume=1" : "/home")
            }
            className="rise-in min-h-[50px] w-full rounded-full bg-white text-[14.5px] font-semibold text-deep transition-transform duration-150 ease-out active:scale-97"
            style={{ ["--d" as string]: "600ms" }}
          >
            {cameFromAsesmen
              ? "Aku merasa cukup aman — lanjutkan pelan-pelan"
              : "Kembali"}
          </button>
          <p className="text-center text-[11px] text-white/40">
            Tidak ada batas waktu. Layar ini selalu bisa kamu buka lagi.
          </p>
        </div>
      </main>
    </div>
  );
}
