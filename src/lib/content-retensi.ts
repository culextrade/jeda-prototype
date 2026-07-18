// ── Konten retensi berlangganan: Kelas, Lingkar Saksi, Malam Jeda ──
// Prinsip: retensi lewat pertumbuhan, bukan ketergantungan.

// ── Kelas Jeda: Bedah Kasus (format laporan kasus klinis) ──
export interface BedahKasus {
  id: string;
  edition: string;
  title: string;
  profile: string;
  sections: { heading: string; body: string }[];
  lesson: string;
}

export const BEDAH_KASUS: BedahKasus[] = [
  {
    id: "bk-03",
    edition: "Edisi #3 · minggu ini",
    title: "Empat aplikasi, satu lubang",
    profile:
      "S., 24, admin gudang, Sukoharjo. Gaji Rp3,8 jt. Empat pindar berjalan, total cicilan Rp2,1 jt/bln (DSR 55%). Pinjaman ke-4 dipakai membayar cicilan ke-1 sampai ke-3.",
    sections: [
      {
        heading: "Kondisi awal",
        body: "S. datang lewat Tombol Jeda — bukan asesmen. Dorongan meminjam kelima muncul pukul 23.40, tiga hari sebelum gajian. Skrining menunjukkan kecemasan sedang (GAD-7: 12) dan tidur rusak berat: tertidur pukul 02.00–03.00 sambil menghitung ulang tanggal jatuh tempo.",
      },
      {
        heading: "Yang kami hentikan lebih dulu",
        body: "Bukan utangnya — tidurnya. Minggu pertama fokus satu hal: jam tidur tetap + HP di luar jangkauan pukul 22.00. Terdengar remeh, tapi rem impuls tinggal separuh pada orang yang tidurnya rusak; menasihati soal bunga pada jam segitu sia-sia.",
      },
      {
        heading: "Minggu 2–4",
        body: "Setelah tidur membaik, baru matematika: keempat pinjaman diurutkan, satu yang tidak berizin dilaporkan ke Satgas PASTI, dua dinegosiasikan restrukturisasi dengan skrip tertulis. Pinjaman kelima tidak pernah terjadi — tercatat 6 kali dijeda di counter.",
      },
    ],
    lesson:
      "Gali lubang jarang selesai dengan nasihat keuangan, karena akarnya sering bukan di keuangan. Urutkan: pulihkan remnya dulu, baru rapikan utangnya.",
  },
];

// ── Kelas Jeda: kurikulum mikro "Uang × Otak" ──
export interface Pelajaran {
  id: string;
  minutes: number;
  title: string;
  hook: string;
  body: string[];
}

export const KURIKULUM: Pelajaran[] = [
  {
    id: "k1",
    minutes: 3,
    title: "Rem impulsmu tinggal separuh saat kurang tidur",
    hook: "Kenapa checkout jam 23.00 terasa masuk akal — dan paginya tidak.",
    body: [
      "Bagian otak yang menahan keputusan impulsif (korteks prefrontal) adalah bagian yang paling dulu melemah saat kamu kurang tidur. Sementara bagian yang menginginkan hadiah cepat justru makin nyaring. Kombinasi itu terjadi persis di jam-jam kamu scroll marketplace sambil kepikiran tagihan.",
      "Artinya: belanja impulsif malammu bukan soal lemah iman. Itu pertandingan yang tidak seimbang — dan cara paling cepat menyeimbangkannya bukan tekad, tapi tidur. Satu minggu jam tidur yang stabil sering menurunkan dorongan lebih banyak daripada seribu nasihat.",
    ],
  },
  {
    id: "k2",
    minutes: 4,
    title: "Matematika gali lubang: kenapa otak tertipu",
    hook: "Pinjaman baru terasa seperti solusi. Hitungannya bilang sebaliknya.",
    body: [
      "Saat cicilan jatuh tempo dan saldo kosong, pinjaman baru terasa melegakan — karena otak menghitung rasa lega hari ini jauh lebih berat daripada beban bulan depan (namanya present bias). Padahal setiap lubang baru menambah satu lapis bunga di atas bunga.",
      "Rp1 juta di pindar legal = bunga maksimal Rp1.000/hari. Dipakai menutup cicilan lama, kamu kini membayar bunga di dua tempat untuk uang yang sama. Tiga lapis begini, dan separuh cicilanmu adalah bunga murni — uang yang bekerja untuk orang lain, bukan untukmu.",
      "Jeda 90 detik tidak melarang meminjam. Ia cuma memaksa hitungan itu terlihat sebelum rasa lega mengambil alih.",
    ],
  },
  {
    id: "k3",
    minutes: 3,
    title: "Rahasia itu berbunga juga",
    hook: "77% peminjam menyembunyikan utangnya. Ongkosnya bukan cuma uang.",
    body: [
      "Menyimpan rahasia besar itu kerja berat untuk otak: selalu waspada, selalu mengarang cerita, selalu takut ketahuan. Beban ini memperparah cemas dan merusak tidur — dua hal yang justru melemahkan kemampuanmu keluar dari utang.",
      "Kamu tidak wajib bercerita ke semua orang. Tapi satu tempat yang aman untuk jujur — anonim sekalipun — terbukti menurunkan bebannya. Itulah kenapa Lingkar Saksi ada.",
    ],
  },
];

export const TANYA_DOKTER = {
  title: "Tanya Dokter Jeda",
  schedule: "Jumat pekan ini · 20.00 WIB · live 45 menit",
  desc: "Sesi tanya-jawab bulanan dengan dokter tim JEDA — seputar tidur, cemas, dan tubuh yang ikut menanggung utang. Dalam batas layanan primer; bukan konsultasi pribadi.",
  note: "Pertanyaan dikirim anonim. Yang butuh penanganan personal diarahkan ke faskes.",
};

// ── Lingkar Saksi (simulasi tampilan untuk prototype) ──
export const LINGKAR = {
  name: "Lingkar 12 — Musim Pulih",
  members: 7,
  moderated: "Dipandu moderator terlatih",
  milestone: {
    who: "Kenari",
    what: "baru saja melunasi pinjaman pertamanya",
    witnesses: 6,
  },
  feed: [
    {
      who: "Elang",
      when: "kemarin 22.10",
      text: "Hampir checkout paylater buat sepatu. Buka Tombol Jeda dulu — 90 detik kemudian nggak jadi. Kecil, tapi menang.",
      reactions: 5,
    },
    {
      who: "Merpati",
      when: "2 hari lalu",
      text: "Minggu ke-3 tanpa pinjaman baru. Telepon DC juga sudah nggak bikin tangan dingin — skripnya kupakai persis.",
      reactions: 7,
    },
    {
      who: "Gelatik",
      when: "3 hari lalu",
      text: "Minggu ini berat. Nggak nyicil cerita, cuma mau bilang: masih di sini.",
      reactions: 6,
    },
  ],
  rules: [
    "Tanpa nama asli — semua memakai nama burung",
    "Tidak ada yang wajib menyebut angka utangnya",
    "Tanpa nasihat investasi & tanpa tawaran pinjaman",
    "Moderator memantau; sinyal krisis diarahkan ke protokol resmi",
  ],
};

// ── Malam Jeda 21.30 (audio wind-down; player disimulasikan) ──
export const MALAM_JEDA = {
  time: "Setiap malam · 21.30 WIB",
  why: "Jam 21.00–01.00 adalah jam paling rawan dorongan impulsif — data jurnalmu sendiri yang menunjukkannya. Malam Jeda dipasang tepat di gerbangnya.",
  tracks: [
    { title: "Menutup hari, menutup aplikasi", minutes: 8 },
    { title: "Tidur saat kepikiran tagihan", minutes: 12 },
    { title: "Napas sebelum cek saldo", minutes: 5 },
    { title: "Malam gajian", minutes: 10 },
  ],
};
