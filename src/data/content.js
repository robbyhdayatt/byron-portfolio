export const projects = [
  {
    title: "SPARTAN LTI",
    subtitle: "Sistem Manajemen Sparepart, Inventori & Bengkel Dealer Yamaha",
    period: "Des 2025 – Sekarang",
    image: "./assets/images/spartan-preview.jpg",
    images: [
      "./assets/images/spartan-preview.jpg",
      "./assets/images/spartan-inventory.svg",
      "./assets/images/spartan-invoice.svg"
    ],
    stack: ["Laravel 10", "Livewire", "MySQL", "AdminLTE 3", "DomPDF", "Doctrine DBAL"],
    highlights: [
      "ERP Main Dealer Yamaha Lampung & 34+ Jaringan Dealer",
      "Multi-Warehouse Realtime Inventory & Stok Sparepart",
      "Otomatisasi PO, Delivery Order, Faktur & Menggantikan Spreadsheet"
    ],
    description: "Aplikasi Enterprise Resource Planning (ERP) internal untuk pencatatan distribusi dan penjualan sparepart Yamaha Main Dealer (PT Lautan Teduh Interniaga) ke 34+ jaringan dealer & bengkel resmi se-Lampung. Mengelola stok multi-gudang, purchase order (PO), delivery order (DO), invoice, serta menggantikan pencatatan manual berbasis spreadsheet.",
    impact: "Mendigitalkan dan menyinkronkan seluruh rantai pasok sparepart serta operasional servis 34+ dealer resmi se-provinsi Lampung.",
    github: "https://github.com/robbyhdayatt/spartann"
  },
  {
    title: "QMSERVICE",
    subtitle: "Query Master Service & Workshop Analytics Engine",
    period: "2026",
    image: "./assets/images/qmservice-preview.svg",
    images: [
      "./assets/images/qmservice-preview.svg",
      "./assets/images/qmservice-mechanic.svg"
    ],
    stack: ["PHP", "MySQL", "PhpSpreadsheet", "SimpleXLSX", "JavaScript"],
    highlights: [
      "Formulasi Baku Parameter Produktivitas Mekanik",
      "Monitoring Pencapaian Target Servis (UE) Bulanan",
      "Ekspor Realtime Raw Data Transaksi & API DPACK"
    ],
    description: "Sistem analitik performa bengkel resmi Yamaha se-provinsi Lampung yang mengelola produktivitas mekanik, kalkulasi achievement target servis bulanan, visualisasi performa dealer, hingga ekspor data transaksi API DPACK.",
    impact: "Mengotomatisasi monitoring performa ratusan mekanik dan 34+ bengkel dengan metrik baku real-time.",
    github: "https://github.com/robbyhdayatt/qmservice"
  },
  {
    title: "Repeat Order (RO) System",
    subtitle: "CRM Retensi Pelanggan & Verifikasi STU Yamaha",
    period: "2026",
    image: "./assets/images/repeat-order-preview.svg",
    images: [
      "./assets/images/repeat-order-preview.svg"
    ],
    stack: ["PHP", "MySQL", "PhpSpreadsheet", "Bootstrap", "JavaScript"],
    highlights: [
      "Tiered Runtime Deduplication (KTP & No. Rangka)",
      "Penugasan Salesman & Tracking Follow-up CRM",
      "Verifikasi Digital STU & Batch Download ZIP Arsip"
    ],
    description: "Sistem CRM retensi pelanggan dealer Yamaha untuk penugasan follow-up salesman, pencatatan hasil prospek, verifikasi digital dokumen STU (Surat Tanda Terima Unit), dan deduplikasi cerdas berbasis KTP & No. Rangka.",
    impact: "Mencegah duplikasi data prospek dan mempercepat verifikasi dokumen STU penjualan antar level manajemen (Kacab hingga Main Dealer).",
    github: "https://github.com/robbyhdayatt/repeat-order-system"
  },
  {
    title: "Sistem Alokasi Unit PLN",
    subtitle: "Logistik & Pemantauan Distribusi Unit Kendaraan",
    period: "2026",
    image: "./assets/images/alokasi-unit-preview.svg",
    images: [
      "./assets/images/alokasi-unit-preview.svg"
    ],
    stack: ["PHP", "MySQL Views", "SimpleXLSX", "Bootstrap"],
    highlights: [
      "Realtime Sync ke Database Maxwheels & DPACK",
      "Tracking Status Unit dari Main Warehouse hingga STU",
      "Monitoring Alokasi Multi-Dealer Se-Lampung"
    ],
    description: "Aplikasi web pemantauan distribusi dan alokasi unit motor Yamaha dari gudang utama (Main Warehouse) hingga terbit faktur STU, tersinkronisasi langsung dengan database eksternal Maxwheels & DPACK.",
    impact: "Memberikan visibilitas real-time terhadap status ribuan unit kendaraan yang dialokasikan ke 34+ jaringan dealer.",
    github: "https://github.com/robbyhdayatt/alokasi_unit"
  },
  {
    title: "Undian Event & Stage Raffle",
    subtitle: "Dual-Screen Realtime Sync Raffle App",
    period: "2026",
    image: "./assets/images/undian-preview.jpg",
    images: [
      "./assets/images/undian-preview.jpg",
      "./assets/images/undian-operator.svg"
    ],
    stack: ["JavaScript ES6+", "BroadcastChannel API", "HTML5 Canvas", "SheetJS", "Tailwind CSS"],
    highlights: [
      "100% Offline-First Architecture (Zero Latency)",
      "Sinkronisasi Dua Layar Operator & Proyektor Panggung",
      "Animasi Gulungan Tiket Berputar & Dynamic Confetti"
    ],
    description: "Aplikasi web undian offline-first berlatensi 0ms dengan arsitektur dua layar independen (Panel Operator + Layar Proyektor Penonton) dengan animasi gulungan tiket berputar dan efek confetti dinamis untuk event besar Yamaha & Festival Krakatau.",
    impact: "Menjalankan pengundian ribuan nomor rangka motor secara transparan, aman, dan tanpa lag di panggung festival besar."
  },
  {
    title: "DreamRide",
    subtitle: "Sistem Rekomendasi Motor Yamaha — PT Lautan Teduh Interniaga",
    period: "2025 – 2026",
    image: "https://raw.githubusercontent.com/robbyhdayatt/byron-portfolio/main/public/assets/images/img_1788166237788_screenshot_2026-08-31_155029.png",
    images: [
      "https://raw.githubusercontent.com/robbyhdayatt/byron-portfolio/main/public/assets/images/img_1788166237788_screenshot_2026-08-31_155029.png",
      "https://raw.githubusercontent.com/robbyhdayatt/byron-portfolio/main/public/assets/images/img_1788166268581_screenshot_2026-08-31_155101.png",
      "https://raw.githubusercontent.com/robbyhdayatt/byron-portfolio/main/public/assets/images/img_1788166307167_screenshot_2026-08-31_155138.png",
      "https://raw.githubusercontent.com/robbyhdayatt/byron-portfolio/main/public/assets/images/img_1788166340397_screenshot_2026-08-31_155214.png"
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "MySQL", "Prisma", "Framer Motion", "JWT"],
    highlights: [
      "Multi-Stage AI Thinking Loading Screen (4 Tahap Analisis Visual & Indikator 0%–100%)",
      "Algoritma Rekomendasi Cerdas (Hard Filter, Soft Weight Scoring & Smart Fallback Ranking)",
      "Panel Admin & Manajemen Leads Terproteksi JWT Cookie (httpOnly) + Bcrypt & Rate Limiting",
      "Client Kuesioner Interaktif Neobrutalisme & Hasil Edge-to-Edge dengan Alternative Cards"
    ],
    description: "Aplikasi web rekomendasi motor cerdas dan interaktif yang dirancang untuk membantu calon pembeli menemukan pilihan motor Yamaha idaman yang paling sesuai berdasarkan budget, gaya hidup, postur tubuh, jenis transmisi, dan kebutuhan harian. Dilengkapi antarmuka neobrutalisme modern, multi-stage AI loading screen, kalkulasi scoring pintar (scoring.ts), dan panel admin manajemen leads prospek.",
    impact: "Memberikan konsultasi digital instan yang akurat dengan garansi hasil tidak pernah kosong (Smart Fallback Ranking), serta otomatis menangkap data leads prospek calon pembeli langsung ke sistem dealer PT Lautan Teduh Interniaga.",
    link: "https://dreamride.byron.my.id/",
    demo: "https://dreamride.lautanteduh.co.id",
    github: "https://github.com/robbyhdayatt/dream-ride"
  },
  {
    title: "SIGAP",
    subtitle: "Sistem Generator Akta PPAT & Manajemen Dokumen Legal",
    period: "Jun 2026 – Jul 2026",
    image: "./assets/images/sigap-preview.jpg",
    images: [
      "./assets/images/sigap-preview.jpg",
      "./assets/images/sigap-editor.svg"
    ],
    stack: ["Laravel 10", "MySQL", "PHPWord", "Laravel Queue", "Bootstrap"],
    highlights: [
      "Injeksi Data Dinamis Template Dokumen Legal (PHPWord)",
      "Pemrosesan Asinkron Background Queue Cegah Timeout",
      "Private Storage Route, RBAC, Audit Trail & SoftDeletes"
    ],
    description: "Sistem manajemen dan generator otomatis dokumen legal kantor Notaris/PPAT. Dilengkapi injeksi data dinamis ke template Word/PDF, antrean background (Laravel Queue) untuk mencegah timeout server, sistem arsip terproteksi (Private Storage Route), pembatasan hak akses (RBAC), audit trail, dan optimasi database.",
    impact: "Mengautomasi proses penyusunan akta kompleks menjadi hitungan detik, mengamankan data klien dengan otorisasi ketat, dan menjaga stabilitas server.",
    github: "https://github.com/robbyhdayatt/sigap"
  }
];

export const certifications = [
  {
    title: "Bootcamp Student Developer Initiative – AI for Data Summarization",
    issuer: "IBM",
    year: "2024",
    image: "",
    description: "Pelatihan intensif kecerdasan buatan, NLP, dan model ringkasan data otomatis."
  },
  {
    title: "Bootcamp XDemia × HIMAKOM – Python Programming",
    issuer: "XDemia",
    year: "2023",
    image: "",
    description: "Pelatihan pemrograman Python untuk data science, analisis data, dan rekayasa perangkat lunak."
  },
  {
    title: "LKMM Tingkat Menengah",
    issuer: "BEM-KM Universitas Andalas",
    year: "2025",
    image: "",
    description: "Latihan Keterampilan Manajemen Mahasiswa Tingkat Menengah se-wilayah Sumatra."
  },
  {
    title: "LKMM Pra-Dasar & Dasar",
    issuer: "HIMAKOM Universitas Lampung",
    year: "2024",
    image: "",
    description: "Latihan kepemimpinan, manajemen organisasi, dan penyusunan strategi program kerja."
  },
  {
    title: "Pemateri PROMIK (Orientasi Mahasiswa Baru)",
    issuer: "Ilmu Komputer Universitas Lampung",
    year: "2026",
    image: "",
    description: "Pemateri dan fasilitator pengenalan lingkungan akademik dan kompetensi software engineering bagi mahasiswa baru."
  },
  {
    title: "Pemateri LKMM Tingkat Dasar",
    issuer: "HIMAKOM Universitas Lampung",
    year: "2026",
    image: "",
    description: "Pemateri manajemen organisasi, penyusunan proposal program kerja, dan problem solving."
  },
  {
    title: "Pemateri Upgrading Organisasi",
    issuer: "HIMAKOM Universitas Lampung",
    year: "2025",
    image: "",
    description: "Pemateri peningkatan kapasitas staf, etika komunikasi, dan manajemen tim kerja."
  },
  {
    title: "Pemateri LKMM Tingkat Pra-Dasar",
    issuer: "Fakultas MIPA Universitas Lampung",
    year: "2025",
    image: "",
    description: "Pemateri kepemimpinan dasar dan manajemen diri untuk mahasiswa baru FMIPA."
  }
];

export const experiences = [
  {
    role: "Staff Software Developer",
    company: "PT. Lautan Teduh Interniaga",
    period: "Sep 2025 — Sekarang",
    type: "Full-time",
    description: "Divisi IT — Pengembangan Sistem Informasi. Mengembangkan arsitektur sistem informasi internal sesuai kebutuhan manajemen, pemeliharaan & optimasi performa sistem (zero critical downtime), serta penanganan troubleshooting bug aplikasi dan integritas data secara terstruktur."
  },
  {
    role: "Asisten Dosen Praktikum (ADSI)",
    company: "Universitas Lampung (Prodi Akuntansi)",
    period: "Feb 2026 — Jun 2026",
    type: "Akademik",
    description: "Mendampingi 60+ mahasiswa dalam praktikum Analisis dan Desain Sistem Informasi. Membimbing penyusunan SKPL, Pitchdeck, Feasibility Analysis, metodologi Agile/Waterfall, serta perancangan antarmuka UI/UX menggunakan Figma."
  },
  {
    role: "Programmer (Magang)",
    company: "PT. Lautan Teduh Interniaga",
    period: "Jun 2025 — Agu 2025",
    type: "Magang",
    description: "Membangun aplikasi internal pencatatan distribusi dan penjualan sparepart Yamaha menggunakan Laravel 10 dan MySQL, merancang skema relasional database, modul CRUD, serta melakukan testing dan internal deployment."
  },
  {
    role: "Asisten Dosen Praktikum (Basis Data)",
    company: "Universitas Lampung (Prodi Ilmu Komputer)",
    period: "Feb 2025 — Jun 2025",
    type: "Akademik",
    description: "Mendampingi 30+ mahasiswa dalam praktikum SQL & MySQL, memberikan materi normalisasi database (1NF–3NF), perancangan ERD, dan penulisan query SQL kompleks (JOIN, Subquery, Stored Procedure)."
  }
];

export const organizations = [
  {
    role: "Kepala Dinas PSDM",
    organization: "BEM FMIPA Universitas Lampung",
    name: "BEM FMIPA Universitas Lampung",
    period: "Jan 2025 — Des 2025",
    description: "Memimpin bidang Kaderisasi & Pengembangan Potensi, merancang dan mengeksekusi program strategis (Upgrading Staff, GARUDA Magang BEM, Forum Kaderisasi FMIPA), serta membangun sistem monitoring kinerja staf berkala."
  },
  {
    role: "Ketua Umum",
    organization: "HIMAKOM Universitas Lampung",
    name: "HIMAKOM Universitas Lampung",
    period: "Feb 2024 — Des 2024",
    description: "Memimpin organisasi dengan 142+ anggota aktif, mengawasi seluruh pelaksanaan program kerja tahunan, mengelola anggaran dan perencanaan strategis, serta membina kolaborasi dengan dosen, universitas, dan mitra eksternal."
  }
];

export const education = [
  {
    institution: "Universitas Lampung",
    degree: "S1 Ilmu Komputer",
    period: "2022 — 2026",
    gpa: "3.74 / 4.00"
  },
  {
    institution: "SMA Negeri 1 Bandar Lampung",
    degree: "Jurusan MIPA",
    period: "2019 — 2022",
    gpa: "Nilai Akhir: 86"
  }
];

export const skills = {
  languages: ["PHP", "JavaScript", "Python", "TypeScript", "HTML5", "CSS3"],
  frameworks: ["Laravel", "React", "MySQL", "Next.js", "Git/GitHub", "REST API", "Tailwind CSS", "Bootstrap", "Figma", "Composer", "Linux / Web Server"],
  softSkills: ["Kepemimpinan (142+ Anggota)", "Problem Solving", "Manajemen Proyek", "Komunikasi & Mengajar", "System Architecture"],
  languagesSpoken: ["Indonesia (Fasih / Native)", "Inggris (Menengah / B1 — TOEFL 453)"]
};

export const personal = {
  name: "Robby Hidayat",
  title: "Software Developer",
  tagline: "Merancang & membangun sistem web performa tinggi dengan arsitektur bersih dan presisi.",
  location: "Bandar Lampung, Indonesia",
  email: "robbyhdayatt@gmail.com",
  phone: "+62 877-4867-2761",
  linkedin: "https://www.linkedin.com/in/robby-hidayat",
  github: "https://www.github.com/robbyhdayatt",
  instagram: "https://www.instagram.com/robbyhdayatt",
  website: "https://byron.my.id"
};
