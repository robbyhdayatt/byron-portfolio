# 🌤️ Byron Portfolio — Robby Hidayat

<div align="center">

![Robby Hidayat Portfolio](https://img.shields.io/badge/Portfolio-Live-42A5F5?style=for-the-badge&logo=vercel&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![GSAP](https://img.shields.io/badge/GSAP-3.x-88CE02?style=for-the-badge&logo=greensock&logoColor=black)
![PHP](https://img.shields.io/badge/PHP-CMS-777BB4?style=for-the-badge&logo=php&logoColor=white)

**🌐 Live Site: [byron.my.id](https://byron.my.id)**  
**🛠️ Admin CMS: [byron.my.id/admin](https://byron.my.id/admin)**

</div>

---

## 📖 Tentang Proyek

Website portofolio profesional milik **Robby Hidayat**, seorang _Software Developer_ lulusan S1 Ilmu Komputer Universitas Lampung. Dibangun dengan tema **langit dan kebebasan** (_sky & freedom_), menghadirkan pengalaman browsing yang imersif dengan animasi premium dan interaksi yang unik.

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| ✈️ **Sky Boarding Pass** | Kartu interaktif bergaya tiket penerbangan glassmorphism yang bisa di-drag dengan fisika _elastic spring bounce_ |
| 🔄 **Skills Logo Marquee** | Logo teknologi bergerak otomatis ke kanan secara _infinite loop_ |
| 💻 **Project Browser Mockup** | Setiap proyek ditampilkan dalam bingkai browser bergaya macOS |
| 🌍 **Bilingual (ID / EN)** | Beralih bahasa Indonesia / Inggris dengan satu klik, tersimpan di _localStorage_ |
| 🎯 **Scroll Blur-In Reveal** | Animasi scroll modern: _blur + scale + slide-up_ menggunakan GSAP ScrollTrigger |
| 📱 **Fully Responsive** | Optimal di semua ukuran layar: 360px hingga 1440px+ |
| ♿ **Aksesibel** | `prefers-reduced-motion` support, keyboard navigation, skip-to-content link |
| 🔐 **CMS Admin Dashboard** | Dashboard pengelola konten berbasis PHP tanpa database (JSON flat-file) |
| 📬 **Contact Form** | Integrasi Web3Forms + tombol _Copy Email_ sekali klik |
| ⚡ **Performa Tinggi** | ~115 KB gzip total, FOUC prevention, lazy loading gambar |

---

## 🗂️ Struktur Proyek

```
byron-portfolio/
├── src/                        # Source code utama
│   ├── index.html              # Markup HTML utama
│   ├── assets/
│   │   └── images/             # Foto profil & preview proyek
│   ├── data/
│   │   ├── content.js          # Data CV (proyek, pengalaman, sertifikasi)
│   │   └── translations.js     # Teks bilingual (ID & EN)
│   ├── scripts/
│   │   ├── main.js             # Entry point & orchestrator
│   │   ├── preloader.js        # Animasi preloader "Robby Hidayat"
│   │   ├── idcard.js           # Sky Boarding Pass draggable (GSAP)
│   │   ├── render.js           # Render dinamis proyek & timeline
│   │   ├── certifications.js   # Render sertifikasi + modal
│   │   ├── scroll-reveal.js    # Animasi scroll Blur-In + Scale
│   │   ├── sky-background.js   # Parallax awan & gradien scroll
│   │   ├── floating-photo.js   # Animasi foto wisuda
│   │   ├── contact-form.js     # Form kontak + Copy Email
│   │   └── i18n.js             # Sistem penggantian bahasa
│   └── styles/
│       ├── tokens.css          # Design tokens (warna, font, spacing)
│       ├── base.css            # Reset & tipografi
│       ├── components.css      # Komponen reusable (button, card, dll)
│       └── sections.css        # Layout & style per section
├── public/
│   ├── admin/
│   │   ├── index.php           # Dashboard CMS Admin UI
│   │   ├── api.php             # PHP API (login, save, upload)
│   │   └── content.json        # Database JSON flat-file
│   ├── assets/images/          # Gambar statis publik
│   ├── robots.txt
│   └── sitemap.xml
├── vite.config.js              # Konfigurasi Vite build
└── package.json
```

---

## 🎨 Design System

### Palet Warna — "Sky Blue"
```css
--sky-deep:    #1565C0   /* Biru langit dalam */
--sky-bright:  #42A5F5   /* Biru langit cerah */
--sky-horizon: #90CAF9   /* Biru cakrawala */
--cloud-white: #F0F7FF   /* Putih awan */
--sun-gold:    #FFB74D   /* Kuning matahari */
--ink-navy:    #0D1B2A   /* Teks gelap */
```

### Tipografi
- **Font**: [Quicksand](https://fonts.google.com/specimen/Quicksand) — rounded, cloud-like feel
- **Skala**: `clamp()` responsif dari `0.75rem` hingga `7.5rem`

---

## 🚀 Menjalankan di Lokal

### Prasyarat
- **Node.js** v18 atau lebih baru
- **npm** v9 atau lebih baru
- **PHP** v7.4+ (untuk CMS Admin)

### Instalasi

```bash
# 1. Clone repository
git clone https://github.com/robbyhdayatt/byron-portfolio.git
cd byron-portfolio

# 2. Install dependencies
npm install

# 3. Jalankan dev server
npm run dev
```

Website akan berjalan di: **`http://localhost:5173`**

### Build Production

```bash
npm run build
```

Output produksi akan berada di folder **`dist/`**, siap di-upload ke hosting.

### Jalankan CMS Admin di Lokal

```bash
# Masuk ke folder dist hasil build
cd dist

# Jalankan PHP built-in server
php -S localhost:8000
```

Buka **`http://localhost:8000/admin/`** di browser untuk mengakses Admin CMS.

---

## 🛠️ Tech Stack

### Frontend
| Teknologi | Kegunaan |
|---|---|
| [Vite 6](https://vitejs.dev) | Build tool & dev server |
| Vanilla JavaScript (ES2022) | Logic tanpa framework |
| [GSAP 3](https://gsap.com) | Semua animasi (preloader, scroll, drag & drop) |
| [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger) | Animasi berbasis scroll |
| [Lenis](https://lenis.darkroom.engineering) | Smooth scrolling |
| CSS Custom Properties | Design tokens & theming |

### Backend CMS
| Teknologi | Kegunaan |
|---|---|
| PHP 7.4+ | Server-side API untuk CMS |
| JSON Flat File | Database tanpa SQL (content.json) |
| PHP Sessions | Autentikasi admin |
| [Tailwind CSS](https://tailwindcss.com) (CDN) | Styling dashboard admin |

### Layanan Eksternal
| Layanan | Kegunaan |
|---|---|
| [Web3Forms](https://web3forms.com) | Pengiriman form kontak ke email |
| [Google Fonts](https://fonts.google.com) | Font Quicksand |
| [Devicon CDN](https://devicon.dev) | Logo teknologi di Skills section |

---

## 📦 Deployment ke Shared Hosting (cPanel)

1. Jalankan build: `npm run build`
2. Upload **seluruh isi** folder `dist/` ke `public_html/` di cPanel
3. Pastikan struktur akhir:
   ```
   public_html/
   ├── index.html
   ├── robots.txt
   ├── sitemap.xml
   ├── assets/
   │   ├── index-*.css
   │   ├── index-*.js
   │   └── images/
   └── admin/
       ├── index.php
       ├── api.php
       └── content.json
   ```
4. Buka domain Anda dan nikmati! 🎉

> **Catatan:** `base: './'` sudah dikonfigurasi di `vite.config.js` agar semua path aset menggunakan jalur relatif — kompatibel dengan shared hosting cPanel manapun.

---

## 🔐 Admin CMS

Dashboard admin berjalan di **`/admin`** dan ditenagai oleh flat-file PHP tanpa database.

**Fitur CMS:**
- 👤 Edit bio, profesi, dan informasi kontak
- 💻 Kelola proyek + upload gambar preview
- 💼 Kelola pengalaman kerja & organisasi
- 🏆 Kelola sertifikasi & pelatihan
- 💾 Simpan perubahan langsung ke `content.json` — live di website tanpa rebuild!

> Untuk keamanan, jangan bagikan kredensial admin Anda secara publik.

---

## 📄 Lisensi

Kode proyek ini adalah milik pribadi **Robby Hidayat**. Silakan gunakan sebagai referensi atau inspirasi, namun **tidak untuk digunakan atau dipublikasikan ulang secara komersial** tanpa izin.

---

## 🙋‍♂️ Kontak

**Robby Hidayat** — Software Developer

[![Email](https://img.shields.io/badge/Email-robbyhdayatt%40gmail.com-1565C0?style=flat&logo=gmail&logoColor=white)](mailto:robbyhdayatt@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-robby--hidayat-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/robby-hidayat)
[![GitHub](https://img.shields.io/badge/GitHub-robbyhdayatt-181717?style=flat&logo=github&logoColor=white)](https://www.github.com/robbyhdayatt)
[![Instagram](https://img.shields.io/badge/Instagram-%40robbyhdayatt-E4405F?style=flat&logo=instagram&logoColor=white)](https://www.instagram.com/robbyhdayatt)

---

<div align="center">
  <sub>Dibuat dengan ☁️ dan ✨ oleh Robby Hidayat — 2026</sub>
</div>
