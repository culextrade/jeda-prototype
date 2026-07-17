"use client";

// ── Jurnal mood × uang — mesin fase kuratif ──────────────────
// Catat 60 detik; engine mencari pola (rule-based, dijelaskan).
// Pola ketemu → tawaran naik jalur kuratif → rehabilitatif.

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check, Sparkles } from "lucide-react";
import Card, { SectionTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Sheet from "@/components/ui/Sheet";
import { RupiahInput } from "@/components/asesmen/panels";
import { journalInsight } from "@/lib/engine/journal";
import {
  addJournal,
  advanceDemoWeek,
  upgradeToRehabilitatif,
  useJeda,
} from "@/lib/store";
import { jam, rupiahShort, tanggal } from "@/lib/format";
import { uid } from "@/lib/utils";
import { cn } from "@/lib/utils";

const MOODS = [
  { v: 1, label: "😞" },
  { v: 2, label: "😕" },
  { v: 3, label: "😐" },
  { v: 4, label: "🙂" },
  { v: 5, label: "😊" },
] as const;

export default function JurnalPage() {
  const router = useRouter();
  const state = useJeda();
  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [urge, setUrge] = useState(false);
  const [spend, setSpend] = useState<number | undefined>();
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const insight = journalInsight(state.journal);
  const isKuratif = state.triage?.jalur === "kuratif";

  function save() {
    if (!mood) return;
    addJournal({
      id: uid(),
      at: new Date().toISOString(),
      mood,
      urge,
      spend: urge ? spend : undefined,
      note: note.trim() || undefined,
    });
    setMood(null);
    setUrge(false);
    setSpend(undefined);
    setNote("");
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="px-5 pt-1">
      {/* Insight pola */}
      {insight.found ? (
        <Card className="border-amber/50 bg-amber-tint p-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber text-white">
              <Sparkles size={17} />
            </span>
            <div className="flex-1">
              <p className="text-[14px] font-bold leading-snug text-warn">
                {insight.headline}
              </p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink">
                {insight.detail}
              </p>
              <p className="mt-2 text-[11px] text-ink-soft">
                Dorongan malam tercatat: {insight.nightUrges}× · total belanja
                impulsif {rupiahShort(insight.totalSpendOnUrge)}
              </p>
              {isKuratif && (
                <Button
                  size="sm"
                  className="mt-3 bg-amber"
                  onClick={() => setUpgradeOpen(true)}
                >
                  Akar ketemu — naik ke Rehabilitatif <ArrowUpRight size={14} />
                </Button>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-4">
          <p className="text-[13.5px] font-semibold">
            {isKuratif
              ? "Kita sedang mencari akar masalahmu"
              : "Deteksi pola sebelum jadi masalah"}
          </p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">
            Catat mood + dorongan belanja/pinjam tiap malam. Setelah ±1 minggu,
            JEDA mencari polanya: jam rawan, pemicu, dan kaitannya dengan
            suasana hatimu. Aturannya terbuka — bukan kotak hitam.
          </p>
          {state.settings.demo && state.journal.length === 0 && (
            <button
              onClick={() => advanceDemoWeek()}
              className="mt-3 rounded-full border border-dashed border-amber px-4 py-2 text-[11.5px] font-semibold text-warn transition-transform duration-150 ease-out active:scale-97"
            >
              ▸ Demo: maju 7 hari (isi jurnal contoh)
            </button>
          )}
        </Card>
      )}

      {/* Entri baru */}
      <SectionTitle className="mt-6">Malam ini</SectionTitle>
      <Card className="mt-2.5 p-4">
        <p className="text-[12.5px] font-semibold text-ink-soft">Bagaimana perasaanmu?</p>
        <div className="mt-2.5 flex justify-between">
          {MOODS.map((m) => (
            <button
              key={m.v}
              onClick={() => setMood(m.v)}
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full text-[22px] transition-[transform,background-color] duration-150 ease-out active:scale-95",
                mood === m.v
                  ? "bg-pine-tint ring-2 ring-pine"
                  : "bg-canvas hover:bg-line/40"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-[12.5px] font-semibold text-ink-soft">
            Ada dorongan belanja / pinjam?
          </p>
          <div className="flex gap-1.5">
            {[
              { v: false, label: "Tidak" },
              { v: true, label: "Ya" },
            ].map((o) => (
              <button
                key={String(o.v)}
                onClick={() => setUrge(o.v)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-colors duration-150",
                  urge === o.v
                    ? o.v
                      ? "border-clay bg-clay text-white"
                      : "border-pine bg-pine text-white"
                    : "border-line bg-surface text-ink-soft"
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {urge && (
          <div className="fade-in mt-3">
            <RupiahInput
              value={spend}
              onChange={setSpend}
              placeholder="Jadi keluar berapa? (0 kalau berhasil dijeda)"
            />
          </div>
        )}

        <input
          className="mt-3 min-h-[44px] w-full rounded-md border border-line bg-surface px-3.5 text-[13px] outline-none placeholder:text-ink-faint/70 focus:border-pine/60"
          placeholder="Catatan singkat (opsional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <Button full size="md" className="mt-3.5" disabled={!mood} onClick={save}>
          {saved ? (
            <>
              <Check size={16} /> Tersimpan
            </>
          ) : (
            "Simpan — 60 detik selesai"
          )}
        </Button>
      </Card>

      {/* Riwayat */}
      {state.journal.length > 0 && (
        <>
          <SectionTitle className="mt-6">Riwayat</SectionTitle>
          <div className="mt-2.5 flex flex-col gap-2">
            {state.journal.slice(0, 14).map((e) => (
              <div
                key={e.id}
                className="flex items-center gap-3 rounded-lg border border-line/80 bg-surface px-3.5 py-3"
              >
                <span className="text-[20px]">
                  {MOODS.find((m) => m.v === e.mood)?.label}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-semibold">
                    {tanggal(e.at)} · {jam(e.at)}
                    {e.urge && (
                      <span className="ml-2 rounded-full bg-clay-tint px-2 py-0.5 text-[10px] font-bold text-clay">
                        DORONGAN{e.spend ? ` · ${rupiahShort(e.spend)}` : e.spend === 0 ? " · dijeda ✓" : ""}
                      </span>
                    )}
                  </p>
                  {e.note && (
                    <p className="mt-0.5 truncate text-[11.5px] text-ink-soft">{e.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Sheet upgrade */}
      <Sheet
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        title="Naik ke jalur Rehabilitatif"
      >
        <p className="text-[13px] leading-relaxed text-ink-soft">
          Dari pola jurnalmu, akar yang paling mungkin:{" "}
          <strong className="text-ink">belanja/pinjam impulsif saat mood turun di malam hari</strong>.
          Kalau ini terasa benar, rencanamu akan disusun ulang untuk menyasar
          akar ini — termasuk penghalang impuls malam & latihan pikiran-uang.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Button
            full
            onClick={() => {
              upgradeToRehabilitatif("impulsif");
              setUpgradeOpen(false);
              router.push("/rencana");
            }}
          >
            Ya, itu aku — susun ulang rencanaku
          </Button>
          <Button full variant="ghost" size="md" onClick={() => setUpgradeOpen(false)}>
            Belum yakin — lanjut jurnal dulu
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
