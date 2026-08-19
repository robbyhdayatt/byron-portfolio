# Task Breakdown — Website Portofolio Pribadi

**Cara pakai:** dokumen ini disusun sebagai daftar task berurutan yang bisa langsung diberikan ke Antigravity satu per satu (atau per fase). Tiap task punya *prompt starter* yang bisa disalin ke chat Antigravity.

---

## Fase 0 — Setup Proyek

- [ ] Inisialisasi proyek Vite (vanilla JS template)
  `npm create vite@latest byron-portfolio -- --template vanilla`
- [ ] Setup struktur folder sesuai `02-SYSTEM-DESIGN.md` §3
- [ ] Install dependency: `npm install gsap lenis`
- [ ] Setup Git repository (opsional tapi disarankan untuk versioning)
- [ ] **Install Impeccable** — ikuti `05-IMPECCABLE-SETUP-GUIDE.md` sebelum mulai membangun UI, agar setiap perubahan UI langsung dicek detector-nya

> Prompt starter Antigravity: *"Buatkan struktur project Vite vanilla JS sesuai struktur folder di 02-SYSTEM-DESIGN.md, termasuk file kosong untuk tiap modul JS dan CSS yang disebutkan."*

## Fase 1 — Design Tokens & Foundation

- [ ] Tulis `tokens.css` berisi semua CSS custom properties dari `03-UI-UX-DESIGN.md` §1 (warna, font, radius, spacing)
- [ ] Import Google Fonts / self-host: Fraunces (display) & General Sans/Satoshi (body)
- [ ] Tulis `base.css`: reset, box-sizing, typography scale dengan `clamp()`
- [ ] Siapkan aset: kompres & convert `pas-foto-formal.jpg` dan `foto-bebas-wisuda.jpg` ke WebP + fallback

> Prompt starter: *"Buatkan tokens.css berdasarkan palet warna dan tipografi di 03-UI-UX-DESIGN.md bagian Design Tokens, lengkap dengan CSS custom properties dan gradient signature --sky-gradient."*

## Fase 2 — Markup & Struktur Section

- [ ] Bangun `index.html` dengan semua section (Hero, About, Skills, Projects, Certifications, Experience, Contact, Footer) dalam markup semantik (`<section>`, `<nav>`, `<article>`)
- [ ] Isi `content.js` dengan seluruh data dari CV (proyek, sertifikat, pengalaman, skill) sesuai contoh struktur di system design
- [ ] Render Projects, Certifications, dan Experience secara dinamis dari `content.js` via JS (bukan hardcode HTML repetitif)

> Prompt starter: *"Buatkan index.html dengan struktur section sesuai wireframe di 03-UI-UX-DESIGN.md bagian 2, gunakan markup semantik dan siapkan container kosong untuk section yang di-render dari data (Projects, Certifications, Experience)."*

## Fase 3 — Komponen Visual Utama

- [ ] Navbar sticky dengan efek transparan→solid saat scroll
- [ ] Komponen Project Card & Certification Card + modal preview
- [ ] Komponen ID Card (bungkus foto formal) — markup + CSS dasar bentuk kartu+tali
- [ ] Komponen Floating Photo (bungkus foto bebas) — markup + CSS dasar posisi & shadow
- [ ] Elemen awan SVG (beberapa layer untuk parallax)

> Prompt starter: *"Buatkan komponen ID Card untuk foto formal: elemen kartu dengan tali/lanyard SVG di atasnya, posisi sedikit miring, siap dianimasikan dengan GSAP nanti."*

## Fase 4 — Animasi & Interaksi

- [ ] `preloader.js` — animasi matahari naik + progress + transisi buka tirai awan
- [ ] `idcard.js` — ayunan tali mengikuti mouse (GSAP quickTo), animasi entrance
- [ ] `floating-photo.js` — animasi entrance + floating loop
- [ ] `sky-background.js` — parallax awan + interpolasi warna background berbasis scroll progress (GSAP ScrollTrigger)
- [ ] `scroll-reveal.js` — fade-up staggered untuk card & teks section saat masuk viewport
- [ ] `certifications.js` — buka/tutup modal preview sertifikat
- [ ] Setup Lenis untuk smooth scroll, pastikan terintegrasi dengan ScrollTrigger

> Prompt starter: *"Implementasikan preloader.js sesuai spesifikasi di 03-UI-UX-DESIGN.md bagian Pre-loader: matahari naik mengikuti progress asset loading, lalu transisi tirai awan menyibak sebelum menampilkan Hero."*

## Fase 5 — Contact Form

- [ ] Buat `contact.php` (handler PHP mail sederhana) sesuai target shared hosting
- [ ] Hubungkan form di Contact section ke `contact.php` via fetch/AJAX, dengan feedback sukses/gagal di UI
- [ ] Validasi input dasar (client-side) sebelum submit

> Prompt starter: *"Buatkan contact.php sederhana yang menerima POST nama/email/pesan lalu mengirim email menggunakan fungsi mail() PHP, plus contact-form.js yang mengirim data via fetch dan menampilkan status kirim di UI."*

## Fase 6 — Responsif & Aksesibilitas

- [ ] Uji & perbaiki layout di breakpoint 360px, 768px, 1024px, 1440px
- [ ] Pastikan semua interaktif elemen bisa diakses keyboard (focus-visible states)
- [ ] Tambahkan media query `prefers-reduced-motion` untuk menonaktifkan/melambatkan animasi non-esensial
- [ ] Cek kontras warna teks vs background (target WCAG AA)

## Fase 7 — Performa & SEO

- [ ] Lazy-load gambar non-kritikal, preload font & gambar Hero
- [ ] Tambahkan meta tags (title, description, Open Graph, JSON-LD Person schema)
- [ ] Generate `sitemap.xml` & `robots.txt`
- [ ] Jalankan Lighthouse audit, perbaiki temuan sampai skor ≥ 90 di semua kategori

## Fase 8 — Anti-AI-Slop Pass (Impeccable)

- [ ] `/impeccable init` sudah dijalankan di Fase 0 — pastikan `PRODUCT.md` terisi konteks brand yang benar
- [ ] Jalankan `/impeccable polish` per section utama (Hero, About, Projects, Certifications)
- [ ] Jalankan `/impeccable audit` untuk cek kualitas produksi & severity findings
- [ ] Jalankan `/impeccable critique` (opsional) untuk review heuristik Nielsen
- [ ] Perbaiki semua temuan sampai 0 findings
- [ ] Jalankan `npx impeccable detect src/` sebagai pengecekan akhir sebelum build

## Fase 9 — Build & Deploy

- [ ] `npm run build` → hasilkan `dist/`
- [ ] Upload isi `dist/` + `contact.php` ke `public_html/` di hosting byron.my.id (lihat langkah detail di `02-SYSTEM-DESIGN.md` §8)
- [ ] Aktifkan SSL (AutoSSL/Let's Encrypt) di cPanel
- [ ] Test end-to-end di domain live: semua section, animasi, form kontak

## Fase 10 — QA Akhir

- [ ] Checklist teknis di `02-SYSTEM-DESIGN.md` §9
- [ ] Checklist anti-slop di `03-UI-UX-DESIGN.md` §4
- [ ] Review konten: cek ulang semua data CV ter-render akurat, tidak ada typo
- [ ] Minta 1–2 orang lain buka link live untuk feedback cepat sebelum dianggap final
