# Panduan Setup Impeccable (Anti-AI-Slop) untuk Antigravity

Sumber: [impeccable.style](https://impeccable.style/#slop) — skill desain yang mendeteksi & menghilangkan "AI slop" (pola desain generik khas hasil AI) dari UI yang dibuat agent, dan **mendukung Antigravity secara native**.

---

## Prasyarat

- Node.js versi **22.12+** terinstall di komputer (cek dengan `node -v` di terminal). Kalau belum, install dari [nodejs.org](https://nodejs.org).
- Project website portofolio sudah ada di suatu folder (boleh masih kosong/baru di-scaffold).

## Langkah-langkah

### 1. Buka terminal di root folder project

Pastikan posisi terminal ada di folder utama project (yang berisi `package.json`, atau folder kosong tempat kamu akan mulai coding).

### 2. Install Impeccable

```bash
npx impeccable install
```

Perintah ini otomatis mendeteksi bahwa kamu memakai Antigravity dan menaruh file skill di lokasi yang tepat untuk Antigravity kenali (mirip `.claude/skills/` untuk Claude Code, tapi disesuaikan untuk Antigravity).

### 3. Reload Antigravity

Tutup dan buka ulang window/agent Antigravity (atau reload workspace) supaya skill baru terbaca.

### 4. Cek skill sudah terpasang

Ketik `/` di chat Antigravity — kamu harus melihat `/impeccable` muncul di autocomplete. Ketik `/impeccable` saja untuk melihat daftar 23 command yang tersedia.

### 5. Set konteks project

Jalankan di chat Antigravity:

```
/impeccable init
```

Ini akan men-scan project (token warna, komponen, config) dan membuat dua file:
- **`PRODUCT.md`** — konteks produk: siapa audiensnya, mode halaman (persuade/operate/read), voice, dan anti-reference (hal yang harus dihindari).
- **`DESIGN.md`** — spesifikasi visual portabel (warna, tipografi, komponen) dalam format Google Stitch.

**Isi `PRODUCT.md` untuk proyek ini**, sesuaikan kira-kira seperti:

```
Users: Recruiter, sesama developer, dosen — mengevaluasi cepat siapa Robby & bukti kerjanya
Mode: Persuade (landing page personal branding) tapi tetap informatif
Brand voice: Profesional tapi hangat, tidak kaku, mencerminkan tema langit/cerah/bebas
Anti-references: gradient ungu-ke-biru generik, font Inter sebagai display, card bersarang berlapis,
  icon tile membulat generik di atas tiap heading, numbered label 01/02/03 di luar timeline
```

### 6. Bangun halaman seperti biasa

Lanjutkan development sesuai `04-TASK-BREAKDOWN.md`. Tidak perlu memanggil Impeccable di setiap langkah — biarkan dulu progress berjalan.

### 7. Jalankan pass "polish" setelah section utama jadi

```
/impeccable polish hero section
/impeccable polish about section
/impeccable polish projects section
/impeccable polish certifications section
```

Impeccable akan membaca `DESIGN.md`/token project (bukan menimpa dengan gaya sendiri), mendeteksi "tells" AI-generic, lalu memperbaikinya langsung di source code.

### 8. Audit kualitas produksi

Setelah seluruh halaman selesai:

```
/impeccable audit
```

Ini memberi skor 5 dimensi kualitas dengan severity P0–P3. Perbaiki temuan P0/P1 dulu.

### 9. (Opsional) Critique dari sisi UX

```
/impeccable critique
```

Mengevaluasi halaman dengan heuristik Nielsen dan beberapa persona, membuka overlay temuan langsung di browser.

### 10. Cek final via CLI (opsional, cocok untuk sanity check terakhir)

```bash
npx impeccable detect src/
```

Menjalankan 44+ rule deteksi anti-pattern secara deterministik, hasilnya JSON dengan exit code — bisa dijadikan gate manual sebelum kamu anggap desain final.

### 11. Update skill jika ada versi baru

```bash
npx impeccable update
```

---

## Ringkasan Command yang Paling Sering Dipakai

| Command | Kapan dipakai |
|---|---|
| `/impeccable init` | Sekali di awal proyek |
| `/impeccable polish [target]` | Setelah section/halaman selesai dibuat, sebelum dianggap final |
| `/impeccable audit` | Sebelum deploy, sebagai gate kualitas |
| `/impeccable critique` | Kalau ingin review UX lebih dalam |
| `npx impeccable detect src/` | Cek cepat lewat terminal, tanpa masuk ke chat agent |

## Catatan

- Impeccable **tidak menimpa** design token/komponen yang sudah kamu tentukan di `03-UI-UX-DESIGN.md` — ia bekerja *di dalam* sistem yang sudah ada, memperbaiki penerapan yang generik, bukan mengganti arah desainmu.
- Kalau butuh eksplorasi visual lebih liar (variasi tampilan section tertentu), ada command `/impeccable live` untuk iterasi langsung di browser sebelum commit ke source.
