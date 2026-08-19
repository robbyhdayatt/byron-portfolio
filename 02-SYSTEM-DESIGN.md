# System Design — Website Portofolio Pribadi

**Terkait:** `01-PRD.md`

---

## 1. Keputusan Arsitektur Utama

Karena target deploy adalah **shared hosting + domain byron.my.id** (umumnya hanya melayani static files dan PHP, tanpa proses Node.js/server-side rendering), stack dipilih agar hasil akhirnya adalah **static site murni** (HTML/CSS/JS), dengan opsi kecil PHP hanya untuk contact form.

> Kenapa bukan Next.js/React penuh? Next.js butuh Node server untuk fitur SSR/API routes. Shared hosting biasa tidak menyediakan itu. Next.js *static export* memungkinkan, tapi untuk single-page portfolio, overhead build-nya tidak sepadan dengan manfaatnya. Vanilla stack + Vite lebih ringan, lebih cepat di-deploy (drag-drop folder `dist/`), dan sejalan dengan kebutuhan animasi custom (GSAP/Lenis) yang tetap optimal tanpa framework UI.

## 2. Tech Stack

| Layer | Pilihan | Alasan |
|---|---|---|
| Markup | HTML5 semantik | SEO & aksesibilitas dasar |
| Styling | CSS3 (custom properties / design tokens) | Kontrol penuh atas tema langit-awan, tanpa bloat framework CSS |
| Build tool | Vite | Dev server cepat, bundling & minifikasi otomatis, output static murni |
| Interaksi/animasi | JavaScript (ES6+, vanilla) | Tidak butuh React runtime untuk 1 halaman |
| Animasi scroll & motion | GSAP + ScrollTrigger | Standar industri untuk animasi scroll-based & timeline yang presisi |
| Smooth scroll | Lenis | Scroll behavior halus, kompatibel dengan GSAP ScrollTrigger |
| Ikon | Lucide (SVG) atau custom SVG | Ringan, konsisten dengan tema |
| Contact form | PHP mail handler sederhana (`contact.php`) di shared hosting **atau** layanan pihak ketiga tanpa backend (Web3Forms/Formspree) sebagai fallback | Shared hosting umumnya mendukung PHP native, sejalan dengan skill Robby |
| Design QA | Impeccable (skill anti-AI-slop untuk Antigravity) | Lihat `05-IMPECCABLE-SETUP-GUIDE.md` |

## 3. Struktur Folder Proyek

```
byron-portfolio/
├── src/
│   ├── index.html
│   ├── styles/
│   │   ├── tokens.css        # design tokens: warna, spacing, tipografi
│   │   ├── base.css          # reset + global styles
│   │   ├── components.css    # navbar, card, button, modal, id-card, dll
│   │   └── sections.css      # styling per-section
│   ├── scripts/
│   │   ├── main.js           # entry point, init semua modul
│   │   ├── preloader.js
│   │   ├── idcard.js         # animasi id card foto formal
│   │   ├── floating-photo.js # animasi foto bebas melayang
│   │   ├── sky-background.js # parallax awan & gradasi langit saat scroll
│   │   ├── scroll-reveal.js  # animasi masuk tiap section
│   │   ├── certifications.js # modal preview sertifikat
│   │   └── contact-form.js
│   ├── assets/
│   │   ├── images/
│   │   │   ├── pas-foto-formal.jpg
│   │   │   ├── foto-bebas-wisuda.jpg
│   │   │   ├── certificates/
│   │   │   └── clouds/        # SVG/PNG elemen awan
│   │   └── favicon/
│   └── data/
│       └── content.js         # semua data CV (proyek, sertifikat, pengalaman) sebagai objek JS
├── public/
│   └── (file yang di-copy apa adanya: robots.txt, sitemap.xml)
├── contact.php                # handler form kontak (dipindah ke root saat deploy)
├── vite.config.js
├── package.json
├── PRODUCT.md                 # ditulis oleh Impeccable saat /impeccable init
├── DESIGN.md                  # ditulis oleh Impeccable, spesifikasi visual portabel
└── dist/                      # hasil build, ini yang di-upload ke hosting
```

## 4. Alur Data

Karena tidak ada CMS, semua konten (daftar proyek, sertifikat, pengalaman kerja) disimpan sebagai **objek JavaScript terstruktur** di `src/data/content.js`. Komponen (Projects, Certifications, Experience) me-render list ini secara dinamis lewat JS — sehingga menambah 1 proyek baru di masa depan cukup menambah 1 object di array, tanpa menyentuh HTML/CSS.

Contoh bentuk data (ilustratif):

```js
export const projects = [
  {
    title: "SIGAP",
    subtitle: "Sistem Generator Akta PPAT",
    period: "Jun 2026 – Jul 2026",
    stack: ["Laravel", "MySQL", "PHP", "PHPWord"],
    description: "...",
    impact: "...",
  },
  // ...
];
```

## 5. Rencana Animasi (ringkas — detail di UI/UX doc)

- **Preloader:** dijalankan di `preloader.js`, mem-block scroll sampai animasi selesai, lalu fade-out dan trigger animasi masuk Hero.
- **ID Card:** foto formal dibungkus elemen `.id-card` dengan efek "tergantung" (subtle rotate mengikuti posisi mouse/scroll, mirip lanyard fisik) menggunakan GSAP `quickTo` untuk performa halus.
- **Floating photo:** foto bebas diberi transform `rotate` tetap + animasi `float` (translateY looping halus) via CSS keyframes atau GSAP, membuatnya terasa "melayang" konsisten dengan foto aslinya.
- **Sky parallax:** elemen awan (SVG) bergerak dengan kecepatan berbeda saat scroll (parallax), warna gradient background berubah bertahap dari "pagi cerah" di Hero ke warna lebih dalam menjelang Contact — dikontrol oleh GSAP ScrollTrigger yang mengubah CSS custom property.

## 6. Performa & Optimasi Aset

- Semua foto (`pas-foto-formal.jpg`, `foto-bebas-wisuda.jpg`, sertifikat) dikonversi ke WebP + fallback JPEG, dengan `srcset` untuk resolusi berbeda.
- Lazy-load gambar di luar viewport awal (`loading="lazy"`, kecuali foto Hero yang perlu tampil cepat).
- Font di-subset dan di-preload (`<link rel="preload">`) untuk font display.
- Vite otomatis melakukan code-splitting & minifikasi JS/CSS saat build produksi.
- Target ukuran total halaman (setelah kompresi) < 2MB termasuk gambar.

## 7. SEO & Metadata

- `<title>`, `<meta name="description">`, `<meta property="og:*">` di `index.html`.
- Structured data `Person` (schema.org/JSON-LD) berisi nama, jobTitle, sameAs (LinkedIn/GitHub).
- `sitemap.xml` dan `robots.txt` sederhana di `public/`.

## 8. Rencana Deploy ke Shared Hosting

1. Jalankan `npm run build` → menghasilkan folder `dist/` berisi HTML/CSS/JS/aset yang sudah di-minify.
2. Login ke cPanel hosting → File Manager (atau pakai FTP/FileZilla dengan kredensial hosting).
3. Masuk ke folder `public_html/` (root domain byron.my.id).
4. Upload seluruh isi `dist/` ke `public_html/` (bukan foldernya, tapi isinya langsung di root).
5. Jika pakai contact form PHP, upload juga `contact.php` ke `public_html/` dan sesuaikan alamat email tujuan di dalam file tersebut.
6. Cek DNS/SSL domain byron.my.id sudah aktif (biasanya cPanel menyediakan AutoSSL/Let's Encrypt gratis — aktifkan lewat menu SSL/TLS Status).
7. Test akses `https://byron.my.id` dari browser, cek semua section, animasi, dan form kontak berfungsi.
8. (Opsional) Setup cache-control header lewat `.htaccess` untuk aset statis agar loading lebih cepat pada kunjungan berikutnya.

## 9. Testing Checklist Teknis

- [ ] Cross-browser: Chrome, Firefox, Safari, Edge
- [ ] Responsive: mobile (360px), tablet (768px), desktop (1440px+)
- [ ] Lighthouse audit (Performance, Accessibility, Best Practices, SEO)
- [ ] Form kontak terkirim & masuk ke email tujuan
- [ ] Semua gambar sertifikat termuat & modal berfungsi
- [ ] `prefers-reduced-motion` menonaktifkan animasi non-esensial
