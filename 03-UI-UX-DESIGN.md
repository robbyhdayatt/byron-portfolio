# UI/UX Design — Website Portofolio Pribadi

**Terkait:** `01-PRD.md`, `02-SYSTEM-DESIGN.md`
**Konsep besar:** *"Naik ke langit yang cerah dan bebas."* Pengunjung memulai perjalanan dari pre-loader (fajar), menembus lapisan awan (tiap section), sampai ke titik paling terbuka (Contact) — merepresentasikan perjalanan karier Robby yang masih terbuka luas.

---

## 1. Design Tokens

### Warna

Palet dipilih dari langit sungguhan (fajar cerah → siang biru terang), **bukan** gradasi ungu generik atau tema gelap+neon yang jadi default AI:

| Token | Hex | Peran |
|---|---|---|
| `--sky-deep` | `#1B4B82` | Teks utama di atas terang, elemen navigasi |
| `--sky-bright` | `#4A90D9` | Warna primer, CTA, aksen link |
| `--sky-horizon` | `#8FC7E8` | Gradient tengah, elemen sekunder |
| `--cloud-white` | `#F6FAFF` | Background utama |
| `--sun-gold` | `#FFB84D` | Aksen hangat "cerah" — highlight, badge, hover state |
| `--ink-navy` | `#12213D` | Teks body, kontras tinggi |
| `--dusk-lavender` | `#6B7CA3` | Teks sekunder, border halus |

Gradient signature (`--sky-gradient`): `linear-gradient(180deg, var(--sun-gold) 0%, var(--sky-horizon) 35%, var(--sky-bright) 70%, var(--sky-deep) 100%)` — dipakai di background yang berubah seiring scroll (lihat §5).

### Tipografi

- **Display (judul besar, Hero, nama section):** *Fraunces* — serif dengan karakter hangat & sedikit playful, terasa "bebas" dibanding sans-serif kaku, dipakai dengan optical size besar & weight variabel.
- **Body:** *General Sans* atau *Satoshi* — sans-serif humanis, netral, sangat mudah dibaca. (Hindari Inter sebagai default generik.)
- **Utility/caption/label:** *Satoshi* weight medium, tracking sedikit lebar, huruf kapital kecil untuk label section (mis. "PROYEK", "SERTIFIKASI").

Skala tipe (fluid, pakai `clamp()`): H1 `clamp(2.5rem, 6vw, 5rem)`, H2 `clamp(1.75rem, 4vw, 2.75rem)`, body `1rem–1.125rem`.

### Layout

- Container max-width 1200px, padding responsif `clamp(1.25rem, 5vw, 4rem)`.
- Grid 12 kolom untuk section kompleks (Projects, Certifications); flex untuk Hero & About.
- Radius sudut: **tidak seragam membulat besar di semua elemen** (hindari tell "rounded-square everywhere") — card project pakai radius kecil (8px) dengan satu sudut tajam sebagai aksen, badge/pill pakai radius penuh secukupnya.

### Signature Element

**ID Card foto formal** di Hero — pas foto formal digantung seperti kartu identitas dengan tali (elemen SVG sederhana berbentuk tali/lanyard warna `--sun-gold`), sedikit miring, bergoyang halus mengikuti gerak mouse/scroll. Ini elemen paling ikonik di halaman dan jadi *thing pengunjung ingat*.

---

## 2. Wireframe per Section

### 0. Pre-loader

```
┌─────────────────────────────┐
│                               │
│     ☀ (matahari kecil naik)  │
│   ───────────────────────    │  <- garis horizon jadi progress bar
│        "Menyiapkan langit…"  │
│                               │
└─────────────────────────────┘
```
Matahari kecil "terbit" dari bawah garis horizon ke atas mengikuti progress loading aset (0–100%). Saat selesai, layar "terbuka" seperti tirai awan yang menyibak ke kiri-kanan, mengungkap Hero di baliknya. Durasi maksimal 2.5 detik (skip otomatis jika aset sudah di-cache).

### 1. Hero

```
┌───────────────────────────────────────────┐
│ [Navbar: logo/nama · About · Projects ·    │
│           Certifications · Contact]        │
│                                             │
│   Halo, saya                 ┌──────────┐  │
│   ROBBY HIDAYAT               │ ID CARD  │  │
│   Software Developer           │ [foto]  │  │
│   yang membangun sistem        │ ————    │  │
│   dengan bebas & cermat.       └──────────┘  │
│                                (tergantung   │
│   [Lihat Proyek] [Hubungi Saya]  tali miring)│
│                                             │
│      ~ awan-awan tipis melayang di bg ~     │
└───────────────────────────────────────────┘
```
Background: gradasi langit cerah paling terang di sini (bagian atas perjalanan = paling dekat matahari). Awan SVG bergerak parallax pelan.

### 2. About

```
┌───────────────────────────────────────────┐
│  Tentang Saya                               │
│  ┌───────────────┐   Ringkasan profesional  │
│  │ [foto bebas]  │   (dari CV): lulusan,     │
│  │  wisuda        │   staff programmer,      │
│  │  "melayang"    │   fokus Laravel/React... │
│  │  (miring, di   │                          │
│  │  posisi bebas) │   [Unduh CV] (opsional)  │
│  └───────────────┘                          │
└───────────────────────────────────────────┘
```
Foto wisuda "terbang" ditempatkan **tidak simetris** — sedikit keluar dari grid/kolom (overflow ke area lain), diberi shadow lembut + animasi floating (naik-turun pelan), memperkuat kata "bebas". Karena foto aslinya sudah bertema langit biru, ia jadi jembatan visual sempurna antara Hero dan About.

### 3. Skills

```
┌───────────────────────────────────────────┐
│  Yang Saya Kuasai                           │
│  ┌ Languages ┐ ┌ Frameworks ┐ ┌ Soft Skill ┐│
│  │ PHP  JS   │ │ Laravel    │ │ Leadership │ │
│  │ Python... │ │ React...   │ │ ...        │ │
│  └───────────┘ └────────────┘ └────────────┘│
└───────────────────────────────────────────┘
```
3 kolom (stack di mobile) berdasarkan kategori dari CV. Tiap skill sebagai pill kecil, bukan progress bar (progress bar skill sering terkesan arbitrer/generic).

### 4. Projects / Showcase

```
┌───────────────────────────────────────────┐
│  Proyek                                     │
│  ┌───────────────┐ ┌───────────────┐        │
│  │ SIGAP          │ │ SPARTAN       │  ...   │
│  │ Laravel·MySQL  │ │ Laravel·Live- │        │
│  │ deskripsi..    │ │ wire..        │        │
│  │ → hasil/dampak │ │ → hasil       │        │
│  └───────────────┘ └───────────────┘        │
└───────────────────────────────────────────┘
```
Grid 2 kolom desktop / 1 kolom mobile. Tiap card: judul, tag stack, 1-2 kalimat masalah→solusi, baris "Hasil:" di-highlight warna `--sun-gold`. Hover: card terangkat halus (translateY -6px) + shadow membesar sedikit — hindari efek shine/gradient sweep generik.

### 5. Certifications

```
┌───────────────────────────────────────────┐
│  Sertifikasi & Pelatihan                    │
│  [card] [card] [card] [card]  (scroll/grid) │
│    klik → modal preview besar               │
└───────────────────────────────────────────┘
```
Grid card kecil (logo penerbit + nama + tahun). Klik → modal (`AnimatePresence`-style fade+scale via GSAP) menampilkan detail lengkap. 7 item dari CV: IBM Bootcamp, XDemia Python, LKMM Menengah, LKMM Pra-Dasar & Dasar, Pemateri LKMM, Pemateri Upgrading, Pemateri LKMM Dasar.

### 6. Experience / Timeline

```
┌───────────────────────────────────────────┐
│  Pengalaman                                 │
│  │ Sep 2025 — Staff Programmer, PT LTI      │
│  │ Feb 2026 — Asisten Dosen, ADSI            │
│  │ Jun 2025 — Software Dev Magang           │
│  │ Feb 2025 — Asisten Dosen, Basis Data      │
└───────────────────────────────────────────┘
```
Garis vertikal timeline (bukan numbered 01/02/03 — urutan waktu memang informatif di sini, jadi label tanggal, bukan angka urut generik).

### 7. Contact

```
┌───────────────────────────────────────────┐
│  Mari Terhubung                             │
│  [Nama]  [Email]                            │
│  [Pesan..................]                  │
│  [Kirim Pesan]                              │
│  atau langsung: email · LinkedIn · GitHub   │
└───────────────────────────────────────────┘
```
Background di titik ini paling "dalam" (--sky-deep) — puncak perjalanan scroll, terasa seperti sudah terbang tinggi. Form minimal 3 field saja.

### 8. Footer

Logo/nama kecil, social icons (LinkedIn, GitHub, Email), copyright tahun berjalan.

---

## 3. Spesifikasi Animasi

| Elemen | Trigger | Efek |
|---|---|---|
| Pre-loader | Page load | Matahari naik + progress, lalu tirai awan menyibak |
| Hero teks | Setelah pre-loader selesai | Fade-up staggered per baris |
| ID Card | Hover/mousemove, load | Ayunan tali halus (rotate ±4°), animasi "jatuh dari atas lalu menetap" saat pertama muncul |
| Foto bebas (About) | Scroll into view | Fade-in + translateY, lalu floating loop terus-menerus |
| Awan background | Scroll (parallax) | Kecepatan berbeda per layer awan (depth) |
| Background gradient | Scroll progress keseluruhan halaman | Interpolasi warna dari `--sun-gold` → `--sky-deep` |
| Project/Cert cards | Scroll into view | Fade-up staggered per card |
| Modal sertifikat | Klik card | Scale+fade in/out |

**Aksesibilitas motion:** semua animasi non-esensial (floating loop, parallax) dinonaktifkan/diperlambat drastis jika `prefers-reduced-motion: reduce` terdeteksi. Animasi state-changing penting (mis. modal buka/tutup) tetap ada tapi versi instan/cepat.

---

## 4. Anti-AI-Slop Checklist (self-review sebelum audit Impeccable)

- [ ] Tidak pakai gradient ungu-ke-biru generik
- [ ] Tidak pakai font Inter sebagai display face
- [ ] Tidak ada card di dalam card berlapis-lapis tanpa alasan
- [ ] Numbered label (01/02/03) hanya dipakai kalau urutan itu benar-benar informatif (timeline saja)
- [ ] Bukan semua sudut membulat besar secara seragam
- [ ] Copy ditulis spesifik (bukan "Solusi inovatif untuk masa depan" ala template)
- [ ] Ada 1 elemen signature yang benar-benar unik (ID card + foto melayang) — bukan icon tile generik

Validasi akhir tetap dijalankan lewat `/impeccable audit` — lihat `05-IMPECCABLE-SETUP-GUIDE.md`.
