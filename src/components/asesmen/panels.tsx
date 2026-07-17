"use client";

// Panel interaksi di bawah percakapan asesmen.
// Satu panel per jenis input; auto-lanjut di jawaban skala.

import React, { useState } from "react";
import { Plus, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import { cn } from "@/lib/utils";
import { uid } from "@/lib/utils";
import { AnswerValue, Debt, Licensed, RootCause } from "@/lib/types";
import { FREQ_OPTIONS } from "@/lib/engine/screening";
import { ROOT_CAUSE_LABEL } from "@/lib/engine/triage";
import { rupiahShort } from "@/lib/format";

export function PanelShell({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="border-t border-line/70 bg-surface/95 px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm">
      {hint && (
        <p className="mb-2 px-1 text-[11.5px] font-medium text-ink-faint">{hint}</p>
      )}
      {children}
    </div>
  );
}

// ── Cerita awal (multi-select) ──
export const STORY_OPTIONS = [
  "Cicilan mulai kejar-kejaran",
  "Sulit tidur kepikiran tagihan",
  "Pernah pinjam untuk nutup pinjaman lain",
  "Ditagih dengan cara yang kasar",
  "Belanja / pinjam impulsif susah direm",
  "Masih aman — mau jaga-jaga",
];

export function StoryPanel({
  onSubmit,
}: {
  onSubmit: (selected: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (s: string) =>
    setSelected((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  return (
    <PanelShell hint="Pilih yang paling terasa — boleh lebih dari satu">
      <div className="flex flex-wrap gap-2">
        {STORY_OPTIONS.map((s) => (
          <Chip key={s} selected={selected.includes(s)} onClick={() => toggle(s)}>
            {s}
          </Chip>
        ))}
      </div>
      <Button
        full
        size="md"
        className="mt-3"
        disabled={selected.length === 0}
        onClick={() => onSubmit(selected)}
      >
        Lanjut <ArrowRight size={16} />
      </Button>
    </PanelShell>
  );
}

// ── Skala frekuensi 0–3 ──
export function ScalePanel({
  current,
  total,
  onAnswer,
}: {
  current: number;
  total: number;
  onAnswer: (v: AnswerValue) => void;
}) {
  return (
    <PanelShell hint={`Pertanyaan ${current} dari ${total} · 2 minggu terakhir`}>
      <div className="grid grid-cols-2 gap-2">
        {FREQ_OPTIONS.map((o) => (
          <button
            key={o.value}
            onClick={() => onAnswer(o.value)}
            className="flex min-h-[56px] flex-col items-start justify-center rounded-md border border-line bg-surface px-3.5 py-2 text-left transition-[transform,border-color] duration-150 ease-out hover:border-pine/40 active:scale-97"
          >
            <span className="text-[13px] font-semibold text-ink">{o.label}</span>
            <span className="text-[11px] text-ink-faint">{o.hint}</span>
          </button>
        ))}
      </div>
    </PanelShell>
  );
}

// ── Input rupiah ──
export function RupiahInput({
  value,
  onChange,
  placeholder,
  autoFocus,
}: {
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-line bg-surface px-3.5 focus-within:border-pine/60">
      <span className="text-[13px] font-semibold text-ink-faint">Rp</span>
      <input
        inputMode="numeric"
        autoFocus={autoFocus}
        className="min-h-[46px] w-full bg-transparent text-[15px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-faint/70"
        placeholder={placeholder}
        value={value === undefined ? "" : value.toLocaleString("id-ID")}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "");
          onChange(digits ? Number(digits) : undefined);
        }}
      />
    </div>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-[13px] text-ink">{label}</span>
      <div className="flex gap-1.5">
        {[
          { v: false, label: "Tidak" },
          { v: true, label: "Ya" },
        ].map((o) => (
          <button
            key={String(o.v)}
            onClick={() => onChange(o.v)}
            className={cn(
              "rounded-full border px-3 py-1 text-[12px] font-semibold transition-colors duration-150",
              value === o.v
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
  );
}

// ── Tambah pinjaman ──
export function DebtPanel({
  count,
  onAdd,
  onDone,
}: {
  count: number;
  onAdd: (d: Debt) => void;
  onDone: () => void;
}) {
  const [name, setName] = useState("");
  const [licensed, setLicensed] = useState<Licensed>("tidak-tahu");
  const [outstanding, setOutstanding] = useState<number | undefined>();
  const [installment, setInstallment] = useState<number | undefined>();
  const [overdue, setOverdue] = useState(false);
  const [harsh, setHarsh] = useState(false);

  const valid = name.trim() && outstanding && installment;

  const add = () => {
    if (!valid) return;
    onAdd({
      id: uid(),
      name: name.trim(),
      licensed,
      outstanding: outstanding!,
      installment: installment!,
      overdue,
      harshCollection: harsh,
    });
    setName("");
    setLicensed("tidak-tahu");
    setOutstanding(undefined);
    setInstallment(undefined);
    setOverdue(false);
    setHarsh(false);
  };

  return (
    <PanelShell
      hint={
        count === 0
          ? "Pinjaman pertama — perkiraan kasar tidak apa-apa"
          : `${count} pinjaman tercatat`
      }
    >
      <div className="flex flex-col gap-2">
        <input
          className="min-h-[46px] rounded-md border border-line bg-surface px-3.5 text-[14px] font-medium outline-none placeholder:text-ink-faint/70 focus:border-pine/60"
          placeholder="Nama aplikasi / pemberi pinjaman"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-2">
          <RupiahInput
            value={outstanding}
            onChange={setOutstanding}
            placeholder="Sisa utang"
          />
          <RupiahInput
            value={installment}
            onChange={setInstallment}
            placeholder="Cicilan / bulan"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="mr-1 text-[12.5px] text-ink-soft">Terdaftar OJK?</span>
          {(
            [
              { v: "ya", label: "Ya" },
              { v: "tidak", label: "Tidak" },
              { v: "tidak-tahu", label: "Belum cek" },
            ] as { v: Licensed; label: string }[]
          ).map((o) => (
            <button
              key={o.v}
              onClick={() => setLicensed(o.v)}
              className={cn(
                "rounded-full border px-3 py-1 text-[12px] font-semibold transition-colors duration-150",
                licensed === o.v
                  ? "border-pine bg-pine text-white"
                  : "border-line bg-surface text-ink-soft"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
        <ToggleRow label="Sedang menunggak?" value={overdue} onChange={setOverdue} />
        <ToggleRow
          label="Penagihannya kasar / mengintimidasi?"
          value={harsh}
          onChange={setHarsh}
        />
        <div className="mt-1 flex gap-2">
          <Button size="md" variant="soft" className="flex-1" disabled={!valid} onClick={add}>
            <Plus size={16} /> Tambah
          </Button>
          <Button size="md" className="flex-1" onClick={() => {
            if (valid) add();
            onDone();
          }}>
            Cukup, lanjut
          </Button>
        </div>
      </div>
    </PanelShell>
  );
}

// ── Penghasilan & pengeluaran ──
export function MoneyPanel({
  onSubmit,
}: {
  onSubmit: (income: number, essentials: number, borrowToRepay: boolean) => void;
}) {
  const [income, setIncome] = useState<number | undefined>();
  const [essentials, setEssentials] = useState<number | undefined>();
  const [borrowToRepay, setBorrowToRepay] = useState(false);

  return (
    <PanelShell hint="Per bulan — perkiraan saja cukup">
      <div className="flex flex-col gap-2">
        <RupiahInput value={income} onChange={setIncome} placeholder="Penghasilan / bulan" />
        <RupiahInput
          value={essentials}
          onChange={setEssentials}
          placeholder="Pengeluaran pokok (makan, sewa, transport)"
        />
        <ToggleRow
          label="Pernah pinjam untuk menutup pinjaman lain?"
          value={borrowToRepay}
          onChange={setBorrowToRepay}
        />
        <Button
          full
          size="md"
          className="mt-1"
          disabled={!income}
          onClick={() => onSubmit(income!, essentials ?? 0, borrowToRepay)}
        >
          Lanjut <ArrowRight size={16} />
        </Button>
      </div>
    </PanelShell>
  );
}

// ── Akar masalah ──
export function RootPanel({ onSubmit }: { onSubmit: (r: RootCause) => void }) {
  const entries = Object.entries(ROOT_CAUSE_LABEL) as [RootCause, string][];
  return (
    <PanelShell hint="Tidak ada jawaban yang salah">
      <div className="flex flex-wrap gap-2">
        {entries.map(([key, label]) => (
          <Chip
            key={key}
            onClick={() => onSubmit(key)}
            className={key === "belum-tahu" ? "border-amber/70 bg-amber-tint" : ""}
          >
            {label}
          </Chip>
        ))}
      </div>
    </PanelShell>
  );
}

// ── Ringkasan tercatat (bubble kartu utang) ──
export function DebtEcho({ d }: { d: Debt }) {
  return (
    <span>
      {d.name} · sisa {rupiahShort(d.outstanding)} · cicilan {rupiahShort(d.installment)}
      /bln{d.licensed === "tidak" ? " · tidak berizin" : ""}
      {d.overdue ? " · menunggak" : ""}
      {d.harshCollection ? " · ditagih kasar" : ""}
    </span>
  );
}
