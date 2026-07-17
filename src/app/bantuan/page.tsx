"use client";

// ── Bantuan & rujukan — semua gratis, selamanya ──────────────

import React from "react";
import Link from "next/link";
import { ChevronRight, ExternalLink, HeartHandshake, Phone, ShieldAlert } from "lucide-react";
import Card, { SectionTitle } from "@/components/ui/Card";
import { DIREKTORI_RUJUKAN, LAPOR } from "@/lib/content";

export default function BantuanPage() {
  return (
    <div className="px-5 pt-1">
      {/* Krisis */}
      <Link
        href="/krisis"
        className="block rounded-xl bg-deep p-5 text-white shadow-card transition-transform duration-150 ease-out active:scale-98"
      >
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-clay">
            <Phone size={20} />
          </span>
          <div className="flex-1">
            <p className="text-[15px] font-semibold">Sedang di titik terberat?</p>
            <p className="mt-0.5 text-[12.5px] leading-snug text-white/70">
              Healing119 · 119 ext 8 — 24 jam, gratis, dijawab manusia
            </p>
          </div>
          <ChevronRight size={18} className="text-white/60" />
        </div>
      </Link>

      {/* Mode tenang */}
      <Link
        href="/dc"
        className="mt-3 flex items-center gap-4 rounded-xl border border-clay/40 bg-clay-tint p-5 shadow-card transition-transform duration-150 ease-out active:scale-98"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-clay text-white">
          <ShieldAlert size={19} />
        </span>
        <div className="flex-1">
          <p className="text-[14px] font-semibold text-ink">Mode Tenang</p>
          <p className="mt-0.5 text-[12px] leading-snug text-ink-soft">
            Diteror penagih? Grounding + hak konsumen + skrip balasan
          </p>
        </div>
        <ChevronRight size={17} className="text-clay" />
      </Link>

      {/* Direktori */}
      <SectionTitle className="mt-6">Direktori rujukan resmi</SectionTitle>
      <p className="mt-1 px-1 text-[12px] leading-relaxed text-ink-soft">
        JEDA tahu batasnya: hal-hal ini milik profesional & kanal resmi. Kami
        mengantarmu ke pintunya.
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {DIREKTORI_RUJUKAN.map((d) => (
          <a
            key={d.name}
            href={d.href}
            target={d.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="flex items-center gap-3.5 rounded-lg border border-line bg-surface p-4 shadow-card transition-transform duration-150 ease-out active:scale-98"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pine-tint text-pine">
              <HeartHandshake size={17} />
            </span>
            <span className="flex-1">
              <span className="block text-[13.5px] font-semibold">{d.name}</span>
              <span className="text-[11.5px] leading-snug text-ink-soft">{d.detail}</span>
            </span>
            <ExternalLink size={14} className="shrink-0 text-ink-faint" />
          </a>
        ))}
      </div>

      {/* Lapor */}
      <SectionTitle className="mt-6">Laporkan pelanggaran</SectionTitle>
      <div className="mt-3 flex flex-col gap-2">
        {LAPOR.map((l) => (
          <a
            key={l.name}
            href={l.href}
            target={l.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="flex items-center justify-between rounded-lg border border-line bg-surface px-4 py-3.5 shadow-card transition-transform duration-150 ease-out active:scale-98"
          >
            <div>
              <p className="text-[13.5px] font-semibold">{l.name}</p>
              <p className="text-[11.5px] text-ink-soft">{l.detail}</p>
            </div>
            <ExternalLink size={14} className="text-ink-faint" />
          </a>
        ))}
      </div>

      <Card className="mt-6 border-pine/25 bg-pine-tint/60 p-4">
        <p className="text-[12px] leading-relaxed text-pine-dark">
          <strong>Janji JEDA:</strong> skrining, protokol krisis, dan seluruh
          halaman ini gratis selamanya — apa pun paketmu. Keselamatan tidak
          pernah ada di balik pembayaran.
        </p>
      </Card>
    </div>
  );
}
