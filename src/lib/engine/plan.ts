// ── Generator recovery plan (deterministik — aturannya ditampilkan ke user) ──
// Prioritas utang: (1) tidak berizin → verifikasi + lapor, jangan terintimidasi;
// (2) tunggakan + penagihan kasar; (3) beban cicilan bulanan terbesar.
// Rencana 4 minggu: stabilisasi → negosiasi → arus kas → penguatan.

import {
  Assessment,
  DebtPriority,
  PlanTask,
  RecoveryPlan,
  TriageResult,
} from "../types";
import { summarizeScreening } from "./screening";
import { uid } from "../utils";

function debtScore(d: Assessment["finance"]["debts"][number]): number {
  let s = 0;
  if (d.licensed === "tidak") s += 100;
  if (d.overdue && d.harshCollection) s += 50;
  else if (d.overdue || d.harshCollection) s += 30;
  s += Math.min(20, d.installment / 100_000); // beban bulanan sebagai proxy bunga
  return s;
}

function priorityReason(d: Assessment["finance"]["debts"][number]): string {
  if (d.licensed === "tidak")
    return "Tidak berizin — verifikasi di ojk.go.id, laporkan ke Satgas PASTI. Kewajiban legalmu berbeda; jangan biarkan intimidasi menentukan urutan.";
  if (d.overdue && d.harshCollection)
    return "Menunggak dan ditagih kasar — redakan tekanan dulu lewat negosiasi tertulis.";
  if (d.overdue) return "Sedang menunggak — hubungi sebelum denda menumpuk.";
  if (d.harshCollection) return "Penagihan menekan — gunakan skrip hak konsumen.";
  return "Beban cicilan bulanan terbesar berikutnya.";
}

export function generatePlan(
  a: Assessment,
  t: TriageResult
): RecoveryPlan | undefined {
  if (t.jalur === "preventif") return undefined;

  const scr = summarizeScreening(a.screening);
  const debts = [...a.finance.debts].sort((x, y) => debtScore(y) - debtScore(x));
  const debtOrder: DebtPriority[] = debts.map((d) => ({
    debtId: d.id,
    reason: priorityReason(d),
  }));

  const tasks: PlanTask[] = [];
  const add = (
    week: 1 | 2 | 3 | 4,
    kind: PlanTask["kind"],
    title: string,
    detail?: string,
    href?: string
  ) => tasks.push({ id: uid(), week, kind, title, detail, href, done: false });

  // ── Minggu 1 — Stabilisasi ──
  add(
    1,
    "kebiasaan",
    "Aktifkan Tombol Jeda untuk setiap dorongan pinjam atau belanja",
    "Ritual 90 detik sebelum memutuskan. Tidak melarang — hanya memberi jarak.",
    "/jeda"
  );
  const unlicensed = debts.filter((d) => d.licensed !== "ya");
  if (unlicensed.length > 0)
    add(
      1,
      "perlindungan",
      `Cek izin ${unlicensed.map((d) => d.name).join(" & ")} di daftar resmi OJK`,
      "Pinjaman tidak berizin → laporkan ke Satgas PASTI. Kewajiban dan perlindunganmu berbeda.",
      "/bantuan"
    );
  if (debts.some((d) => d.harshCollection))
    add(
      1,
      "perlindungan",
      "Simpan skrip menghadapi penagih & kenali hakmu",
      "Penagihan hanya pukul 08.00–20.00, dilarang mengintimidasi. Skrip siap salin ada di Mode Tenang.",
      "/dc"
    );
  if (a.finance.borrowToRepay)
    add(
      1,
      "keuangan",
      "Hentikan pinjaman baru untuk menutup utang lama",
      "Gali lubang memperbesar total bunga. Kalau dorongan muncul, buka Tombol Jeda dulu."
    );

  // ── Minggu 2 — Negosiasi ──
  add(
    2,
    "keuangan",
    `Hubungi ${debts[0]?.name ?? "pemberi pinjaman prioritas"} untuk restrukturisasi`,
    "Ajukan keringanan tenor/cicilan secara tertulis. Gunakan skrip negosiasi di rencanamu."
  );
  if (scr.insomniaFlag)
    add(
      2,
      "mental",
      "Mulai modul tidur: jam tidur–bangun yang sama 7 hari",
      "Kurang tidur menurunkan kendali impuls — memperbaiki tidur adalah langkah finansial.",
      "/tidur"
    );
  if (t.jalur === "kuratif")
    add(
      2,
      "kebiasaan",
      "Isi jurnal 60 detik tiap malam selama 7 hari",
      "Mood + pengeluaran + dorongan. Polanya yang akan menunjukkan akar masalahmu.",
      "/jurnal"
    );

  // ── Minggu 3 — Arus kas ──
  add(
    3,
    "keuangan",
    "Susun anggaran bertahan: kebutuhan pokok → cicilan prioritas → sisanya",
    `Target: cicilan turun ke bawah 30% penghasilan (sekarang ${(t.dsr * 100).toFixed(0)}%).`
  );
  add(
    3,
    "keuangan",
    "Mulai bantalan darurat mikro",
    "Berapa pun — Rp5–10 rb/hari. Bantalan kecil memutus alasan pinjam berikutnya."
  );

  // ── Minggu 4 — Penguatan ──
  add(
    4,
    "mental",
    "Latihan pikiran & uang: tantang satu keyakinan lama",
    "“Aku memang tidak becus soal uang” itu pikiran, bukan fakta. Modul singkat di rencanamu."
  );
  add(
    4,
    "mental",
    "Cek ulang kondisimu (skrining ulang singkat)",
    "Kalau skor belum membaik, kami arahkan ke psikolog Puskesmas / layanan profesional — gratis.",
    "/bantuan"
  );

  return {
    id: uid(),
    createdAt: new Date().toISOString(),
    jalur: t.jalur === "kuratif" ? "kuratif" : "rehabilitatif",
    debtOrder,
    tasks,
  };
}
