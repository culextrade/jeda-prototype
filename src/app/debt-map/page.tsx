"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDebts } from "@/lib/provider";
import { priorityOrder, totalOutstanding } from "@/lib/selectors";
import { formatRupiah } from "@/lib/format";
import EmptyState from "@/components/shell/EmptyState";
import DebtCard from "@/components/jeda/DebtCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Sheet from "@/components/ui/Sheet";
import { Debt, DebtType, InterestType } from "@/lib/types";
import { Lock, ArrowRight, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_OPTIONS: { key: DebtType; label: string; emoji: string }[] = [
  { key: "pinjol", label: "Pinjol", emoji: "📱" },
  { key: "paylater", label: "PayLater", emoji: "💳" },
  { key: "kartu-kredit", label: "Kartu Kredit", emoji: "🎴" },
  { key: "koperasi", label: "Koperasi", emoji: "🏦" },
  { key: "personal", label: "Pribadi", emoji: "👤" },
  { key: "lainnya", label: "Lainnya", emoji: "📦" },
];

const INTEREST_OPTIONS: { key: InterestType; label: string }[] = [
  { key: "tidak-tahu", label: "Tidak tahu" },
  { key: "per-bulan", label: "% Per Bulan" },
  { key: "per-tahun", label: "% Per Tahun" },
  { key: "flat", label: "Flat" },
];

export default function DebtMapPage() {
  const { debts, addDebt, updateDebt, deleteDebt } = useDebts();

  const sortedDebts = priorityOrder(debts);
  const total = totalOutstanding(debts);

  // Bottom Sheet Form States
  const [isOpen, setIsOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);

  // Form Field States
  const [lenderName, setLenderName] = useState("");
  const [type, setType] = useState<DebtType>("pinjol");
  const [outstanding, setOutstanding] = useState("");
  const [principal, setPrincipal] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [interestType, setInterestType] = useState<InterestType>("tidak-tahu");
  const [dueDate, setDueDate] = useState("");
  const [collectorPressure, setCollectorPressure] = useState<1 | 2 | 3>(1);
  const [note, setNote] = useState("");
  const [isLicensedKnown, setIsLicensedKnown] = useState<boolean | undefined>(undefined);
  
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleOpenAdd = () => {
    setEditingDebt(null);
    setLenderName("");
    setType("pinjol");
    setOutstanding("");
    setPrincipal("");
    setInterestRate("");
    setInterestType("tidak-tahu");
    setDueDate("");
    setCollectorPressure(1);
    setNote("");
    setIsLicensedKnown(undefined);
    setErrorMsg("");
    setIsOpen(true);
  };

  const handleOpenEdit = (debt: Debt) => {
    setEditingDebt(debt);
    setLenderName(debt.lenderName);
    setType(debt.type);
    setOutstanding(debt.outstanding.toString());
    setPrincipal(debt.principal ? debt.principal.toString() : "");
    setInterestRate(debt.interestRate ? debt.interestRate.toString() : "");
    setInterestType(debt.interestType || "tidak-tahu");
    setDueDate(debt.dueDate || "");
    setCollectorPressure(debt.collectorPressure || 1);
    setNote(debt.note || "");
    setIsLicensedKnown(debt.isLicensedKnown);
    setErrorMsg("");
    setIsOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lenderName.trim()) {
      setErrorMsg("Nama pemberi pinjaman wajib diisi.");
      return;
    }

    const outstandingNum = parseFloat(outstanding);
    if (isNaN(outstandingNum) || outstandingNum <= 0) {
      setErrorMsg("Sisa kewajiban harus berupa angka positif.");
      return;
    }

    const payload = {
      lenderName: lenderName.trim(),
      type,
      outstanding: outstandingNum,
      principal: principal ? parseFloat(principal) : undefined,
      interestRate: interestRate ? parseFloat(interestRate) : undefined,
      interestType,
      dueDate: dueDate || undefined,
      collectorPressure,
      note: note.trim() || undefined,
      isLicensedKnown: type === "pinjol" ? isLicensedKnown : undefined,
    };

    if (editingDebt) {
      updateDebt({
        ...editingDebt,
        ...payload,
      });
    } else {
      addDebt(payload);
    }
    setIsOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col gap-4 p-5 bg-canvas overflow-y-auto select-none">
      {/* Top Banner (🔒 Local-First Integrity Banner) */}
      <Card tone="default" className="py-2.5 px-3 border border-line bg-surface/50 flex items-start gap-2.5 select-none text-left shadow-sm">
        <Lock className="w-4 h-4 text-pine mt-0.5" />
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-ink uppercase tracking-wider">Penyimpanan Aman</span>
          <p className="text-[10px] leading-normal text-ink-soft/90 mt-0.5 font-medium">
            Semua data ini tersimpan di perangkatmu, tidak dikirim ke mana pun.
          </p>
        </div>
      </Card>

      {debts.length === 0 ? (
        <EmptyState
          title="Belum ada utang yang dicatat"
          description="Kita susun pelan-pelan. Tambahkan satu dulu — cukup yang kamu ingat untuk memulai pemetaan."
          ctaText="Tambah Utang"
          onCtaClick={handleOpenAdd}
        />
      ) : (
        <>
          {/* Summary outstanding card */}
          <Card tone="pine" className="py-4 px-4 flex flex-col gap-1 select-none border border-pine/10">
            <span className="text-[10px] text-pine font-bold uppercase tracking-wider">Total Terpetakan:</span>
            <div className="flex justify-between items-baseline">
              <span className="text-H1 font-display font-extrabold text-pine-dark">
                {formatRupiah(total)}
              </span>
              <span className="text-[10px] font-bold text-pine bg-pine-tint px-2.5 py-1 rounded-full border border-pine/10">
                {debts.length} Catatan
              </span>
            </div>
            <p className="text-[10.5px] leading-normal text-ink-soft/90 mt-1.5 font-semibold italic">
              &ldquo;Melihatnya utuh adalah langkah besar — bukan untuk membuatmu cemas, tapi agar punya kendali.&rdquo;
            </p>
          </Card>

          {/* Navigasi summary primer */}
          <Link href="/debt-map/summary" className="w-full">
            <Button variant="primary" className="w-full font-bold flex items-center justify-center gap-2">
              Lihat Ringkasan & Prioritas
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          {/* Quick Add Button */}
          <Button
            variant="secondary"
            size="md"
            onClick={handleOpenAdd}
            className="w-full text-caption font-bold border-dashed border-2 hover:bg-pine-tint bg-surface select-none py-2.5"
          >
            + Tambah Catatan Utang
          </Button>

          {/* Recommended Priority List */}
          <div className="flex flex-col gap-3 select-none pt-1">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-caption font-bold text-ink-soft">
                Daftar Utang Terpetakan:
              </h3>
              <span className="text-[10px] text-ink-soft font-semibold bg-canvas px-2 py-0.5 rounded border border-line/60">
                Prioritas Rekomendasi
              </span>
            </div>

            {sortedDebts.map((debt) => (
              <DebtCard
                key={debt.id}
                debt={debt}
                onDelete={(id) => setConfirmDeleteId(id)}
                onEdit={handleOpenEdit}
              />
            ))}
          </div>
        </>
      )}

      {/* 2. Add/Edit Bottom Sheet Form */}
      <Sheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editingDebt ? "Ubah Catatan Utang" : "Tambah Catatan Utang"}
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4 text-left">
          {errorMsg && (
            <div className="p-3 bg-clay-tint border border-clay text-[10.5px] rounded text-clay font-bold">
              {errorMsg}
            </div>
          )}

          {/* Lender Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-ink uppercase tracking-wide">
              Nama Kreditur / Pemberi Pinjaman *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Bank Mandiri, Pinjol Terang, Sahabat Budi"
              value={lenderName}
              onChange={(e) => setLenderName(e.target.value)}
              className="w-full p-2.5 rounded border border-line text-caption font-medium outline-none focus:border-pine bg-surface"
            />
          </div>

          {/* Debt Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-ink uppercase tracking-wide">
              Jenis Pinjaman *
            </label>
            <div className="grid grid-cols-3 gap-2 select-none">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setType(opt.key)}
                  className={cn(
                    "p-2 rounded border flex flex-col items-center justify-center gap-1 transition-all",
                    type === opt.key
                      ? "bg-pine-tint border-pine text-pine font-bold"
                      : "bg-surface border-line text-ink-soft hover:bg-canvas"
                  )}
                >
                  <span className="text-lg">{opt.emoji}</span>
                  <span className="text-[10px]">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Legal check nudge if pinjol */}
          {type === "pinjol" && (
            <div className="p-3 rounded-md bg-amber-tint/80 border border-warn/15 flex flex-col gap-1.5 text-left text-[10.5px]">
              <span className="font-bold text-warn flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-warn" />
                Konfirmasi Status Pinjol
              </span>
              <p className="text-ink-soft leading-normal font-semibold">
                Apakah kamu yakin pinjol ini terdaftar dan berizin resmi di OJK?
              </p>
              <div className="flex gap-2.5 mt-1 select-none">
                <button
                  type="button"
                  onClick={() => setIsLicensedKnown(true)}
                  className={cn(
                    "px-3 py-1.5 rounded-full border font-bold text-[10px] transition-all",
                    isLicensedKnown === true
                      ? "bg-pine text-surface border-pine"
                      : "bg-surface text-ink-soft border-line hover:bg-canvas"
                  )}
                >
                  Ya, Berizin OJK
                </button>
                <button
                  type="button"
                  onClick={() => setIsLicensedKnown(false)}
                  className={cn(
                    "px-3 py-1.5 rounded-full border font-bold text-[10px] transition-all",
                    isLicensedKnown === false
                      ? "bg-clay text-surface border-clay"
                      : "bg-surface text-ink-soft border-line hover:bg-canvas"
                  )}
                >
                  Tidak / Ragu
                </button>
              </div>
              {isLicensedKnown === false && (
                <p className="text-[10px] text-clay font-bold leading-normal mt-1 bg-clay-tint/50 p-2 rounded border border-clay/10">
                  Rekomendasi JEDA: Sebelum mengonfirmasi, kamu bisa memeriksa legalitas pinjol di daftar resmi bantuan.{" "}
                  <Link href="/resources" className="underline font-extrabold hover:text-clay/80" onClick={() => setIsOpen(false)}>
                    Cek Daftar OJK
                  </Link>
                </p>
              )}
            </div>
          )}

          {/* Outstanding */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-ink uppercase tracking-wide">
              Sisa Saldo Kewajiban (Outstanding) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-caption font-bold text-ink-soft">
                Rp
              </span>
              <input
                type="number"
                required
                placeholder="0"
                value={outstanding}
                onChange={(e) => setOutstanding(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded border border-line text-caption font-semibold outline-none focus:border-pine bg-surface"
              />
            </div>
          </div>

          {/* Principal */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-ink uppercase tracking-wide">
              Utang Pokok Awal (Principal)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-caption font-bold text-ink-soft">
                Rp
              </span>
              <input
                type="number"
                placeholder="Opsional"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded border border-line text-caption outline-none focus:border-pine bg-surface"
              />
            </div>
          </div>

          {/* Interest rate & Interest Type */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-ink uppercase tracking-wide">
                Bunga / Biaya (%)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Opsional"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full p-2.5 rounded border border-line text-caption outline-none focus:border-pine bg-surface"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-ink uppercase tracking-wide">
                Tipe Bunga
              </label>
              <select
                value={interestType}
                onChange={(e) => setInterestType(e.target.value as InterestType)}
                className="w-full p-2.5 rounded border border-line text-caption outline-none focus:border-pine bg-surface font-semibold"
              >
                {INTEREST_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-ink uppercase tracking-wide">
              Tanggal Jatuh Tempo Terdekat
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2.5 rounded border border-line text-caption font-semibold outline-none focus:border-pine bg-surface"
            />
          </div>

          {/* Collector pressure */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-ink uppercase tracking-wide">
              Tingkat Tekanan Penagih (Collector)
            </label>
            <div className="grid grid-cols-3 gap-2.5 select-none">
              {[
                { key: 1, label: "Rendah" },
                { key: 2, label: "Sedang" },
                { key: 3, label: "Tinggi" },
              ].map((lvl) => (
                <button
                  key={lvl.key}
                  type="button"
                  onClick={() => setCollectorPressure(lvl.key as 1 | 2 | 3)}
                  className={cn(
                    "p-2.5 rounded border text-[10.5px] font-bold transition-all",
                    collectorPressure === lvl.key
                      ? lvl.key === 3
                        ? "bg-clay-tint border-clay text-clay"
                        : lvl.key === 2
                        ? "bg-amber-tint border-warn text-warn"
                        : "bg-pine-tint border-pine text-pine"
                      : "bg-surface border-line text-ink-soft hover:bg-canvas"
                  )}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-ink uppercase tracking-wide">
              Catatan Khusus (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: penagihan dilakukan lewat telepon kantor, dll"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2.5 rounded border border-line text-caption outline-none focus:border-pine bg-surface resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3.5 pt-4">
            <Button type="submit" variant="primary" className="flex-1 font-bold">
              Simpan
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen(false)}
              className="flex-1 font-bold"
            >
              Batal
            </Button>
          </div>
        </form>
      </Sheet>

      {/* 3. Custom Delete Confirmation Sheet */}
      <Sheet
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        title="Hapus Catatan"
      >
        <div className="flex flex-col gap-5 text-left py-2">
          <p className="text-caption text-ink font-semibold leading-relaxed">
            Apakah kamu yakin ingin menghapus catatan utang ini? Tindakan ini tidak bisa dibatalkan dan progres misi peta utangmu akan disesuaikan.
          </p>
          <div className="flex gap-3">
            <Button
              variant="primary"
              className="flex-1 bg-clay hover:bg-clay/90 border-clay text-surface font-bold shadow-sm"
              onClick={() => {
                if (confirmDeleteId) {
                  deleteDebt(confirmDeleteId);
                  setConfirmDeleteId(null);
                }
              }}
            >
              Hapus
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="flex-1 font-bold"
              onClick={() => setConfirmDeleteId(null)}
            >
              Batal
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  );
}

