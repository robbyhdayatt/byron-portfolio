# PRD — Website Portofolio Pribadi Robby Hidayat

**Versi:** 1.0
**Tanggal:** 29 Juli 2026
**Dikerjakan dengan:** Antigravity (AI coding agent)
**Domain target:** byron.my.id (shared hosting)

---

## 1. Latar Belakang & Tujuan

Robby Hidayat, Staff Programmer di Divisi IT PT. Lautan Teduh Interniaga dan lulusan S1 Ilmu Komputer Universitas Lampung, ingin memiliki website portofolio pribadi untuk:

1. Menampilkan proyek, pengalaman kerja, dan sertifikasi secara profesional kepada calon *employer*, klien, atau rekan kerja.
2. Menjadi kartu nama digital yang bisa dibagikan (link tunggal, pengganti CV statis).
3. Menunjukkan kemampuan teknis sekaligus rasa desain — portofolio ini *adalah* contoh karya itu sendiri.

**Tema visual:** langit, awan, cerah, bebas — merepresentasikan semangat terbuka dan tidak terkurung template generik.

## 2. Target Pengguna

| Persona | Kebutuhan |
|---|---|
| Recruiter / HR | Scan cepat: siapa, skill apa, bukti kerja apa |
| Sesama developer / kolaborator | Detail teknis proyek, stack yang dipakai |
| Dosen / kolega akademik | Rekam jejak akademik & organisasi |
| Robby sendiri | Media promosi diri yang mudah diperbarui |

## 3. Tujuan Produk (Goals)

- Halaman single-page yang bisa di-scroll penuh, memuat seluruh informasi penting dalam satu alur naratif.
- Kesan pertama kuat lewat animasi pre-loading bertema langit sebelum masuk ke halaman utama.
- Elemen visual personal yang kuat: foto formal dibungkus animasi "ID card", dan foto bebas (foto wisuda "terbang" di langit) ditempatkan sebagai elemen dekoratif utama yang mendukung tema.
- Desain terasa dibuat dengan sengaja (*intentional*), bukan hasil template AI generik ("AI slop") — divalidasi lewat skill Impeccable.
- Bisa di-deploy langsung ke shared hosting existing (byron.my.id) tanpa server Node.js.

## 4. Non-Goals (di luar cakupan v1)

- Tidak ada CMS/admin panel — konten di-hardcode di source code (update dilakukan lewat edit kode, wajar untuk portofolio personal).
- Tidak ada blog/artikel (bisa jadi fase berikutnya).
- Tidak ada multi-bahasa (default Bahasa Indonesia, bisa expand nanti).
- Tidak ada dark mode di v1 (opsional fase berikutnya, dicatat sebagai *nice-to-have*).

## 5. Inventaris Konten (sumber: CV)

**Identitas:** Robby Hidayat — Software Developer | IT Staff | S1 Ilmu Komputer, Bandar Lampung.

**Ringkasan profesional:** lulusan baru S1 Ilmu Komputer Universitas Lampung (IPK 3.74/4.00), Staff Programmer PT. Lautan Teduh Interniaga, berpengalaman Laravel/React/PHP/MySQL/JavaScript, pernah memimpin organisasi besar (142+ anggota).

**Keahlian teknis:**
- Languages: PHP, JavaScript, Python, HTML, CSS
- Frameworks & Tools: Laravel, React, MySQL, Git/GitHub, Figma, REST API, Composer
- Soft skills: Kepemimpinan, Problem Solving, Manajemen Proyek, Komunikasi, Mengajar
- Bahasa: Indonesia (Fasih), Inggris (Menengah/B1)

**Pengalaman kerja** (4 entri — Staff Programmer, Asisten Dosen x2, Software Developer Magang) — jadi bagian Experience/Timeline.

**Proyek** (4 entri — jadi bagian Projects/Showcase):
1. SPARTAN — Laravel 10, MySQL, PHP, Livewire
2. Company Profile PT. Lautan Teduh Interniaga — PHP Native, Bootstrap, MySQL
3. Dreamride — PHP Native, Bootstrap, MySQL
4. SIGAP (Sistem Generator Akta PPAT) — Laravel, MySQL, PHP, PHPWord

**Pendidikan:** Universitas Lampung, S1 Ilmu Komputer (2022–2026), IPK 3.74/4.00; SMA Negeri 1 Bandar Lampung (2019–2022).

**Organisasi:** BEM FMIPA Unila — Kepala Dinas PSDM; HIMAKOM Unila — Ketua Umum; HIMAKOM — Anggota Bidang Kaderisasi.

**Pelatihan & Sertifikasi** (7 entri) — jadi bagian Certifications, ditampilkan sebagai grid/carousel dengan modal preview.

**Kontak:** email, telepon, LinkedIn, GitHub — ditampilkan di bagian Contact & Footer (ambil dari CV saat implementasi, jangan di-hardcode di dokumen publik ini).

## 6. Fitur & Komponen (Scope v1)

Struktur single-page, urutan section sesuai alur narasi "landing → siapa saya → apa yang saya bisa → bukti kerja → penghargaan → cara hubungi":

1. **Pre-loader** — animasi bertema langit sebelum konten utama muncul (lihat detail di UI/UX doc).
2. **Navbar** — sticky, link ke tiap section, transparan di atas hero lalu solid saat scroll.
3. **Hero** — nama, tagline, CTA (Lihat Proyek / Hubungi Saya), foto formal dengan animasi ID card.
4. **About** — ringkasan profesional + foto bebas (foto wisuda) ditempatkan sebagai elemen visual dekoratif "melayang" di langit.
5. **Skills** — grid/list kemampuan teknis, dikelompokkan (Languages, Frameworks & Tools, Soft Skills).
6. **Projects/Showcase** — 4 proyek dari CV, tiap kartu: judul, deskripsi singkat, stack, hasil/dampak.
7. **Certifications** — grid card sertifikasi & pelatihan, dengan interaksi hover + modal detail.
8. **Experience/Timeline** — riwayat kerja & mengajar secara kronologis.
9. **Organisasi** (opsional digabung ke Experience atau section tersendiri singkat) — HIMAKOM & BEM FMIPA.
10. **Contact** — form kontak sederhana (nama, email, pesan) + link langsung email/LinkedIn/GitHub.
11. **Footer** — social links, copyright.

## 7. Requirement Khusus dari Klien (Robby)

- **Tema:** langit, awan, cerah, bebas — dipakai konsisten di palet warna, ilustrasi, dan motion, bukan sekadar warna biru di background.
- **Pre-loading animation:** wajib ada sebelum halaman utama tampil.
- **Foto formal (pas foto 3x4):** dibungkus animasi bertema ID card/lanyard di area Hero.
- **Foto bebas (foto wisuda "melayang"):** ditempatkan bebas (tidak harus di grid standar), memperkuat tema "bebas" dan "langit" karena foto aslinya sudah menampilkan pose melayang dengan latar langit biru.
- **Anti-AI-slop:** desain harus melewati proses audit menggunakan skill Impeccable sebelum dianggap selesai (lihat dokumen task breakdown & panduan setup terpisah).

## 8. Requirement Non-Fungsional

| Aspek | Target |
|---|---|
| Responsif | Mobile-first, mulus di 360px–1920px |
| Performa | Lighthouse Performance ≥ 90, LCP < 2.5s |
| Aksesibilitas | Kontras warna AA, fokus keyboard terlihat, `prefers-reduced-motion` dihormati |
| SEO dasar | Meta title/description, Open Graph tags, sitemap.xml sederhana |
| Hosting | Harus jalan sebagai static files di shared hosting (tanpa Node.js runtime) |
| Browser support | 2 versi terakhir Chrome, Firefox, Safari, Edge |

## 9. Metrik Keberhasilan

- Website live di byron.my.id dan bisa diakses publik.
- Skor audit Impeccable: 0 temuan "AI slop" pada halaman final.
- Lighthouse Performance/Accessibility/Best Practices/SEO masing-masing ≥ 90.
- Semua konten dari CV tampil akurat tanpa typo.

## 10. Dokumen Terkait

- `02-SYSTEM-DESIGN.md` — arsitektur teknis & rencana deploy
- `03-UI-UX-DESIGN.md` — sistem desain, wireframe, spesifikasi animasi
- `04-TASK-BREAKDOWN.md` — pemecahan kerja untuk dieksekusi Antigravity
- `05-IMPECCABLE-SETUP-GUIDE.md` — panduan instalasi & pemakaian skill anti-AI-slop
