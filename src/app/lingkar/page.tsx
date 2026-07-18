"use client";

// ── Lingkar Saksi — pemulihanmu punya saksi ──────────────────
// 77% peminjam menyembunyikan utangnya: tak ada satu pun orang di dunia
// nyata yang bisa merayakan pelunasannya. Di sinilah lingkar mengisi.
// (Prototype: tampilan disimulasikan; lingkar beta dibuka bertahap.)

import React, { useState } from "react";
import { Handshake, PartyPopper, ShieldCheck } from "lucide-react";
import Card, { SectionTitle } from "@/components/ui/Card";
import { LINGKAR } from "@/lib/content-retensi";
import { cn } from "@/lib/utils";

const BIRD_TONE: Record<string, string> = {
  Kenari: "bg-amber text-white",
  Elang: "bg-pine text-white",
  Merpati: "bg-deep text-white",
  Gelatik: "bg-clay text-white",
};

export default function LingkarPage() {
  const [witnessed, setWitnessed] = useState(false);

  return (
    <div className="px-5 pt-1">
      {/* Kepala lingkar */}
      <Card className="bg-deep p-5 text-white">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide">
            {LINGKAR.name}
          </span>
          <span className="text-[11.5px] text-white/60">{LINGKAR.members} anggota</span>
        </div>
        <p className="mt-3 font-display text-[20px] font-semibold leading-snug">
          Tempat pemulihanmu punya saksi
        </p>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/75">
          Lingkar kecil, anonim, satu jalur pemulihan. Tidak ada nasihat pintar
          — cukup orang-orang yang mengerti tanpa perlu dijelaskan.
        </p>
        <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-white/55">
          <ShieldCheck size={13} /> {LINGKAR.moderated}
        </p>
      </Card>

      {/* Milestone */}
      <Card className="mt-3 border-amber/60 bg-amber-tint">
        <div className="flex items-start gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber text-white">
            <PartyPopper size={19} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-bold leading-snug text-warn">
              {LINGKAR.milestone.who} {LINGKAR.milestone.what} 🎉
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-ink-soft">
              Tidak ada orang di hidupnya yang tahu perjuangan ini — kecuali
              lingkar ini. Jadilah saksinya.
            </p>
            <button
              onClick={() => setWitnessed(true)}
              disabled={witnessed}
              className={cn(
                "mt-2.5 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[12px] font-semibold transition-transform duration-150 ease-out active:scale-97",
                witnessed
                  ? "bg-pine-tint text-pine-dark"
                  : "bg-amber text-white"
              )}
            >
              <Handshake size={13} />
              {witnessed
                ? `Kamu + ${LINGKAR.milestone.witnesses} orang menjadi saksi`
                : `Aku jadi saksi · ${LINGKAR.milestone.witnesses}`}
            </button>
          </div>
        </div>
      </Card>

      {/* Feed */}
      <SectionTitle className="mt-6">Kabar lingkar minggu ini</SectionTitle>
      <div className="mt-2.5 flex flex-col gap-2">
        {LINGKAR.feed.map((f) => (
          <Card key={f.who} className="flex items-start gap-3">
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold",
                BIRD_TONE[f.who] ?? "bg-pine text-white"
              )}
            >
              {f.who[0]}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px]">
                <span className="font-bold">{f.who}</span>{" "}
                <span className="text-ink-faint">· {f.when}</span>
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-ink">{f.text}</p>
              <p className="mt-1.5 text-[11.5px] font-semibold text-pine">
                🤝 {f.reactions} menemani
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Aturan */}
      <SectionTitle className="mt-6">Aturan lingkar</SectionTitle>
      <Card className="mt-2.5">
        <ul className="flex flex-col gap-2">
          {LINGKAR.rules.map((r) => (
            <li key={r} className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-ink-soft">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-pine" />
              {r}
            </li>
          ))}
        </ul>
      </Card>

      <p className="mt-5 rounded-md border border-dashed border-amber/60 bg-amber-tint/50 px-4 py-3 text-center text-[11px] leading-relaxed text-ink-soft">
        <strong className="text-warn">Simulasi tampilan.</strong> Lingkar beta
        dibuka bertahap dengan moderator terlatih — keselamatan komunitas lebih
        penting daripada kecepatan rilis.
      </p>
    </div>
  );
}
