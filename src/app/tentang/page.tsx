"use client";

// ── Status pengembangan yang jujur + kontrol demo + privasi ──
// Kriteria feasibility: bedakan yang berfungsi / simulasi / rencana.

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, FlaskConical, Play, RotateCcw } from "lucide-react";
import Card, { SectionTitle } from "@/components/ui/Card";
import { advanceDemoWeek, resetAll, seedDemo, useJeda } from "@/lib/store";

const STATUS = [
  {
    label: "Sudah berfungsi",
    tone: "text-success",
    dot: "bg-success",
    items: [
      "Asesmen percakapan + skoring PHQ-4 / PHQ-9 / GAD-7 (aturan baku)",
      "Peta utang + DSR terhadap batas OJK 30%",
      "Mesin triage 3 jalur + penjelasan “kenapa aku di sini”",
      "Generator rencana pemulihan (rule-based, aturan terbuka)",
      "Tombol Jeda: simulasi biaya (batas bunga 2026) + counter dampak",
      "Protokol krisis (PHQ-9 item 9) — selalu tanpa paywall",
      "Mode Tenang: hak konsumen + skrip + grounding",
      "Jurnal mood×uang + deteksi pola rule-based",
      "Laporan Jeda bulanan + Struk Jeda — dihitung dari data user",
      "Penyimpanan local-first — tanpa akun, tanpa server",
    ],
  },
  {
    label: "Disimulasikan di prototype",
    tone: "text-warn",
    dot: "bg-warn",
    items: [
      "Narasi “AI” pada ringkasan asesmen (scripted; produksi: LLM + guardrail klinis)",
      "Pembayaran paket jeruk (tidak ada transaksi nyata)",
      "Lingkar Saksi (tampilan; beta bertahap dengan moderator terlatih)",
      "Pemutar audio Malam Jeda & sesi live Tanya Dokter",
      "Data persona demo (Raka) untuk presentasi",
      "Pengingat/notifikasi",
    ],
  },
  {
    label: "Direncanakan",
    tone: "text-ink-soft",
    dot: "bg-ink-faint",
    items: [
      "LLM API untuk personalisasi narasi + guardrail klinis berlapis",
      "Panel konselor/psikolog (rujukan hangat)",
      "Dasbor B2B employer wellness & laporan literasi POJK 3/2023",
      "API cooling-off untuk lender (visi jangka panjang)",
    ],
  },
];

export default function TentangPage() {
  const router = useRouter();
  const state = useJeda();
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="px-5 pt-1">
      <Card className="p-4">
        <p className="text-[13.5px] leading-relaxed text-ink">
          <strong>JEDA</strong> — intervensi terintegrasi finansial–mental.
          Kami menampilkan status pengembangan apa adanya: yang berfungsi,
          yang disimulasikan, dan yang masih rencana.
        </p>
      </Card>

      {STATUS.map((s) => (
        <div key={s.label} className="mt-5">
          <div className="flex items-center gap-2 px-1">
            <span className={`h-2 w-2 rounded-full ${s.dot}`} />
            <p className={`text-[13px] font-bold uppercase tracking-wide ${s.tone}`}>
              {s.label}
            </p>
          </div>
          <div className="mt-2 rounded-lg border border-line bg-surface p-4 shadow-card">
            <ul className="flex flex-col gap-2">
              {s.items.map((it) => (
                <li key={it} className="flex items-start gap-2 text-[12.5px] leading-relaxed text-ink-soft">
                  <Check size={13} strokeWidth={3} className={`mt-0.5 shrink-0 ${s.tone}`} />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      <SectionTitle className="mt-6">Privasi</SectionTitle>
      <Card className="mt-2 p-4">
        <p className="text-[12.5px] leading-relaxed text-ink-soft">
          Seluruh jawaban dan datamu tersimpan <strong>hanya di perangkat
          ini</strong> (localStorage) — tanpa akun, tanpa server, tanpa
          pelacak. Menghapus data situs = menghapus semuanya, permanen. Metrik
          dampak yang kami sebut di pitch dihitung agregat & anonim, dengan
          persetujuan terpisah pada versi produksi.
        </p>
      </Card>

      <SectionTitle className="mt-6">Instrumen & rujukan aturan</SectionTitle>
      <Card className="mt-2 p-4">
        <ul className="flex flex-col gap-1.5 text-[12px] leading-relaxed text-ink-soft">
          <li>PHQ-4 / PHQ-9 / GAD-7 — Kroenke, Spitzer, Williams (domain publik); adaptasi Bahasa Indonesia. Skrining, bukan diagnosis.</li>
          <li>Batas bunga pindar konsumtif 2026 maks 0,1%/hari; total biaya maks 100% pokok — SEOJK 19/2025 (POJK 40/2024).</li>
          <li>Batas cicilan 30% penghasilan — ketentuan OJK berlaku 2026.</li>
          <li>Etika penagihan (jam 08.00–20.00, larangan intimidasi) — OJK & AFPI.</li>
          <li>Krisis: Healing119 (Kemenkes × IPK Indonesia), 119 ext 8, 24 jam.</li>
        </ul>
      </Card>

      {/* Demo controls */}
      <SectionTitle className="mt-6">Mode demo</SectionTitle>
      <div className="mt-2 flex flex-col gap-2">
        <button
          onClick={() => {
            seedDemo();
            router.push("/home");
          }}
          className="flex items-center gap-3.5 rounded-lg border border-amber/60 bg-amber-tint p-4 text-left transition-transform duration-150 ease-out active:scale-98"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber text-white">
            <Play size={17} />
          </span>
          <span className="flex-1">
            <span className="block text-[13.5px] font-semibold text-ink">
              Muat persona demo — “Raka”
            </span>
            <span className="text-[11.5px] leading-snug text-ink-soft">
              26 th, staf ritel · 3 pindar, DSR 45%, gali lubang, cemas & sulit
              tidur → jalur Kuratif
            </span>
          </span>
        </button>
        {state.settings.demo && state.settings.demoDayOffset === 0 && (
          <button
            onClick={() => advanceDemoWeek()}
            className="flex items-center gap-3.5 rounded-lg border border-line bg-surface p-4 text-left shadow-card transition-transform duration-150 ease-out active:scale-98"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pine-tint text-pine">
              <FlaskConical size={17} />
            </span>
            <span className="flex-1">
              <span className="block text-[13.5px] font-semibold">Demo: maju 7 hari</span>
              <span className="text-[11.5px] leading-snug text-ink-soft">
                Jurnal terisi seminggu → pola impuls malam ditemukan → tawaran
                naik jalur
              </span>
            </span>
          </button>
        )}
        <button
          onClick={() => {
            if (!confirmReset) {
              setConfirmReset(true);
              setTimeout(() => setConfirmReset(false), 2500);
              return;
            }
            resetAll();
            router.push("/");
          }}
          className="flex items-center gap-3.5 rounded-lg border border-danger/40 bg-danger-tint/60 p-4 text-left transition-transform duration-150 ease-out active:scale-98"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger text-white">
            <RotateCcw size={17} />
          </span>
          <span className="flex-1">
            <span className="block text-[13.5px] font-semibold text-danger">
              {confirmReset ? "Ketuk lagi untuk konfirmasi" : "Hapus semua data"}
            </span>
            <span className="text-[11.5px] text-ink-soft">
              Menghapus seluruh data di perangkat ini — permanen
            </span>
          </span>
        </button>
      </div>

      <p className="mt-6 text-center text-[10.5px] leading-relaxed text-ink-faint">
        JEDA prototype v2 · PIDI Digdaya × Hackathon 2026 · Tim Pria-Pria Solo
        Itu
        <br />
        Berhenti sejenak, sebelum terjerat lebih dalam.
      </p>
    </div>
  );
}
