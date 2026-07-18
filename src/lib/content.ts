// ── Konten statis: krisis, hak konsumen, skrip, CBT mikro, tidur ──

export const CRISIS = {
  headline: "Kamu tidak harus menghadapi ini sendirian.",
  body: "Dari jawabanmu, ada tanda yang menurut kami perlu didahulukan daripada urusan uang. Ini bukan kelemahan — ini sinyal bahwa kamu butuh didengar oleh orang yang tepat, sekarang.",
  contacts: [
    {
      name: "Healing119 — Kemenkes",
      detail: "Telepon 119 lalu tekan ext 8 · 24 jam · gratis",
      href: "tel:119",
      action: "Telepon 119 ext 8",
    },
    {
      name: "healing119.id",
      detail: "Konseling via telepon/chat WhatsApp dari situs resmi",
      href: "https://healing119.id",
      action: "Buka healing119.id",
    },
    {
      name: "Psikolog Puskesmas terdekat",
      detail: "Layanan jiwa di Puskesmas — gratis dengan BPJS",
      href: "https://yankes.kemkes.go.id",
      action: "Cari faskes",
    },
  ],
  note: "Bagian ini selalu gratis dan tidak pernah berada di balik pembayaran. Data jawabanmu tetap tersimpan hanya di perangkatmu.",
};

export const HAK_KONSUMEN = [
  {
    title: "Waktu penagihan dibatasi",
    desc: "Penagihan hanya boleh pukul 08.00–20.00 waktu setempat, dan tidak pada hari libur nasional (aturan OJK & AFPI).",
  },
  {
    title: "Dilarang mengintimidasi",
    desc: "Ancaman, kekerasan fisik/verbal, dan mempermalukan lewat kontakmu adalah pelanggaran yang bisa dilaporkan.",
  },
  {
    title: "Hanya boleh menagih ke kamu",
    desc: "Penagih dilarang menghubungi orang lain di luar kontak darurat yang kamu setujui di awal.",
  },
  {
    title: "Penagih wajib beridentitas",
    desc: "Berhak minta identitas & bukti sertifikasi penagihan (AFPI) sebelum melanjutkan pembicaraan.",
  },
  {
    title: "Total biaya dibatasi",
    desc: "Sejak 2025–2026, bunga + denda + biaya pindar konsumtif dibatasi (bunga maks 0,1%/hari, total biaya maks 100% pokok).",
  },
];

export const LAPOR = [
  { name: "Kontak OJK 157", detail: "Telepon 157 · WA 081-157-157-157", href: "tel:157" },
  { name: "Satgas PASTI", detail: "Pinjaman ilegal & penawaran investasi ilegal", href: "https://www.ojk.go.id" },
  { name: "Pengaduan AFPI", detail: "Pelanggaran etika penagihan anggota", href: "https://afpi.or.id" },
];

export const SKRIP_DC = [
  {
    title: "Minta identitas & catat",
    text: "Sebelum lanjut, mohon sebutkan nama Anda, dari perusahaan apa, dan nomor sertifikasi penagihan Anda. Saya mencatat percakapan ini untuk arsip pengaduan bila diperlukan.",
  },
  {
    title: "Hentikan intimidasi",
    text: "Saya tahu kewajiban saya dan sedang mengupayakan penyelesaian. Cara penagihan Anda melanggar ketentuan OJK/AFPI (ancaman / menghubungi kontak saya / di luar jam 08.00–20.00). Bila berlanjut, saya laporkan ke Kontak OJK 157 dan AFPI.",
  },
  {
    title: "Ajukan komitmen realistis",
    text: "Saya beritikad baik menyelesaikan kewajiban. Kemampuan saya saat ini Rp___ per bulan. Saya mengajukan restrukturisasi/keringanan dan meminta jawaban tertulis dari pihak Anda.",
  },
];

export const GROUNDING_STEPS = [
  "Letakkan HP sebentar. Rasakan kedua kakimu menyentuh lantai.",
  "Tarik napas 4 hitungan… tahan 4… hembuskan 6. Ulangi 3 kali.",
  "Sebutkan 5 benda yang kamu lihat di sekitarmu.",
  "Sebutkan 3 suara yang kamu dengar.",
  "Ingat: suara di telepon itu tidak berada di ruanganmu. Kamu aman saat ini.",
];

export const CBT_CARDS = [
  {
    belief: "“Aku memang tidak becus mengatur uang.”",
    challenge: "Itu pikiran, bukan fakta. Kamu sedang berada dalam siklus yang menjerat jutaan orang — sistemnya yang licin, bukan kamu yang bodoh.",
    action: "Tulis satu keputusan uang yang pernah kamu ambil dengan baik, sekecil apa pun.",
  },
  {
    belief: "“Sekali ini saja, nanti juga kebayar sendiri.”",
    challenge: "Cek buktinya: dari pinjaman-pinjaman sebelumnya, berapa yang benar-benar “kebayar sendiri” tanpa pinjaman baru?",
    action: "Buka Tombol Jeda dan lihat simulasi biayanya dulu — 90 detik saja.",
  },
  {
    belief: "“Aku harus menutupi ini dari semua orang.”",
    challenge: "Rahasia menggandakan beban: kamu menanggung utang plus kecemasan menjaga rahasianya. 77% peminjam menyembunyikan utangnya — kamu tidak sendiri.",
    action: "Pilih satu orang paling aman. Tidak harus cerita semuanya — mulai dari “aku lagi berbenah soal keuangan.”",
  },
];

export const SLEEP_STEPS = [
  {
    title: "Jam tidur & bangun yang sama",
    desc: "Setiap hari, termasuk akhir pekan. Ritme yang stabil = perbaikan paling kuat.",
  },
  {
    title: "30 menit tanpa layar sebelum tidur",
    desc: "Notifikasi tagihan jam 23.00 tidak akan menyelesaikan apa pun malam ini.",
  },
  {
    title: "Kasur hanya untuk tidur",
    desc: "Tidak bisa tidur 20 menit? Bangun, duduk di tempat lain, kembali saat mengantuk.",
  },
  {
    title: "Kafein terakhir sebelum jam 14.00",
    desc: "Kopi sore terasa membantu, tapi mencuri tidur malammu.",
  },
];

export const REFLECTIVE_QUESTIONS = [
  "Ini kebutuhan yang tidak bisa menunggu — atau keinginan yang bisa menunggu 3 hari?",
  "Kalau gaji bulan depan sudah terpotong cicilan ini, apa yang tersisa untuk kebutuhanmu?",
];

export type RujukanIcon = "jiwa" | "krisis" | "legalitas" | "aduan" | "hukum";

export const DIREKTORI_RUJUKAN: {
  name: string;
  detail: string;
  href: string;
  icon: RujukanIcon;
}[] = [
  {
    name: "Psikolog Puskesmas",
    detail: "Layanan kesehatan jiwa primer, gratis via BPJS",
    href: "https://yankes.kemkes.go.id",
    icon: "jiwa",
  },
  {
    name: "Healing119 (Kemenkes)",
    detail: "Dukungan psikologis 24 jam — 119 ext 8",
    href: "https://healing119.id",
    icon: "krisis",
  },
  {
    name: "Cek legalitas pindar (OJK)",
    detail: "Daftar penyelenggara berizin, diperbarui berkala",
    href: "https://www.ojk.go.id",
    icon: "legalitas",
  },
  {
    name: "Kontak OJK 157",
    detail: "Pengaduan konsumen keuangan",
    href: "tel:157",
    icon: "aduan",
  },
  {
    name: "Lembaga Bantuan Hukum",
    detail: "Pendampingan hukum bila utang berujung sengketa",
    href: "https://ylbhi.or.id",
    icon: "hukum",
  },
];
