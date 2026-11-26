# Design System — Web Profile & Academic Apps

**Referensi Visual:** Halaman Profil Diri (Tugas Pertemuan 2)

**Pemilik:** Fathan Rafif Athaya (`1247050044`)

Dokumen ini mendefinisikan standar antarmuka (UI) agar seluruh aplikasi pada **Tugas 6, Tugas 7, dan Tugas 8** memiliki identitas visual yang seragam, bersih, dan konsisten dengan palet warna asli halaman profil utama.

## 1. Filosofi & Karakter Visual

- **Gaya Desain:** *Strict Monochrome, Clean Minimalist, Card-Based UI*.

- **Kesan Utama:** Akademik, rapi, terstruktur, kontras tinggi, dan mudah dibaca (*high legibility*).

- **Prinsip Layout:** Setiap kelompok informasi atau fitur dibungkus di dalam kartu putih (`#FFFFFF`) yang mengambang di atas latar belakang abu-abu terang (`#F3F3F3`), dengan *header* dan *footer* penuh yang memiliki sudut melengkung di sisi dalam.

## 2. Palet Warna (Strict 4-Color System)

Palet utama hanya menggunakan 4 warna inti (`#030303`, `#000000`, `#FFFFFF`, `#F3F3F3`) beserta variasi opasitasnya untuk hirarki teks, border halus, dan bayangan:

```
:root {
  /* 4 Core Palette Colors */
  --color-black: #000000;       /* Hitam murni: garis tabel tegas, ikon, aksen aktif */
  --color-ink: #030303;         /* Hitam pekat utama: heading, teks utama, tombol primer */
  --color-surface: #FFFFFF;     /* Putih murni: background card, navbar, footer, teks tombol */
  --color-bg-page: #F3F3F3;     /* Abu-abu terang: background utama halaman */

  /* Derived Typography Tokens (dari #030303) */
  --text-primary: #030303;                  /* Judul utama, header tabel, nav link */
  --text-secondary: rgba(3, 3, 3, 0.78);    /* Paragraf deskripsi & subjudul */
  --text-muted: rgba(3, 3, 3, 0.55);        /* Placeholder, metadata ringan, copyright */

  /* Derived Borders & Interactive States */
  --border-strong: #000000;                 /* Garis horizontal & vertikal tabel (ciri khas Tugas 2) */
  --border-subtle: rgba(3, 3, 3, 0.16);     /* Garis pemisah ringan & border input form */
  --bg-hover: #F3F3F3;                      /* Hover state pada baris tabel / tombol sekunder */

  /* Buttons & Accents */
  --btn-primary-bg: #030303;
  --btn-primary-hover: #000000;
  --btn-primary-text: #FFFFFF;

  /* Shadows (berbasis #000000) */
  --shadow-nav: 0 4px 16px rgba(0, 0, 0, 0.08);
  --shadow-card: 0 6px 24px rgba(0, 0, 0, 0.06);
  --shadow-footer: 0 -4px 16px rgba(0, 0, 0, 0.06);
}
```

### Aturan Badge Status (Tetap Monokrom)

Untuk menjaga konsistensi 4 warna pada Tugas 6–8 (misalnya status *Selesai* vs *Belum Selesai* atau *Prioritas*):

- **Status Aktif / Selesai:** Background `#030303`, teks `#FFFFFF` (*solid dark pill*).

- **Status Menunggu / Belum Selesai:** Background `#F3F3F3`, border `1px solid #030303`, teks `#030303` (*outlined light pill*).

- **Aksi Hapus / Destruktif:** Background `#FFFFFF`, border `1px solid #000000`, teks `#000000` dengan hover background `#000000` dan teks `#FFFFFF`.

## 3. Tipografi (Typography)

- **Font Family:** `'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

- **Skala Ukuran & Ketebalan:**

  - **Page Title (`h1`):** `2rem` (`32px`), `font-weight: 800`, warna `--text-primary` (`#030303`).

  - **Section Heading (`h2`):** `1.375rem` (`22px`), `font-weight: 700`, warna `--text-primary` (`#030303`).

  - **Subsection Heading (`h3`):** `1.05rem` (`17px`), `font-weight: 700`, warna `--text-primary` (`#030303`).

  - **Body Text:** `0.9375rem` (`15px`), `line-height: 1.6`, `font-weight: 400`, warna `--text-secondary`.

  - **Table Header & Nav Link:** `0.875rem` (`14px`), `font-weight: 700`, warna `--text-primary` (`#030303`).

  - **Caption / Footer:** `0.8125rem` (`13px`), `font-weight: 400`.

## 4. Struktur Layout & Komponen Inti

### A. Top Navigation Bar (`<header>` / `<nav>`)

- **Bentuk:** Lebar penuh (`100%`), background `#FFFFFF`, sudut bawah melengkung (`border-radius: 0 0 24px 24px`), bayangan `--shadow-nav`.

- **Isi:** Menu navigasi sejajar di tengah (*centered flex*), jarak antar menu `32px`, teks tebal (`font-weight: 700`, warna `#030303`).

### B. Main Container (`<main>`)

- **Lebar Maksimal:** `max-width: 960px`, posisi tengah (`margin: 40px auto`), padding samping `20px`.

- **Jarak Antar Section:** `display: flex; flex-direction: column; gap: 32px;`.

### C. Section Card (`<section>` / `.card`)

- **Bentuk:** Background `#FFFFFF`, sudut membulat besar (`border-radius: 24px`), padding dalam `32px`–`40px` (desktop) dan `20px` (mobile), bayangan `--shadow-card`.

- **Aturan:** Setiap fitur utama (Form Input, Search/Filter Bar, Tabel/Daftar Data, Penjelasan Teknis) ditempatkan di dalam card terpisah.

### D. Tabel Data (Ciri Khas Tugas 2)

- **Gaya Garis:** `border-collapse: collapse; width: 100%;` dengan garis horizontal dan vertikal tegas berwarna `#000000` (`1px solid #000000`) pada header dan batas kolom.

- **Padding Sel:** `12px 14px`, teks rata kiri untuk teks panjang dan rata tengah untuk nomor/kode/status.

- **Footer Tabel:** Baris ringkasan tebal di bagian bawah tabel (seperti baris *Total Beban SKS Semester Ini*).

### E. Form, Input & Button (Adaptasi untuk Tugas 6–8)

- **Input & Select:** Tinggi `42px`, background `#FFFFFF`, `border: 1.5px solid var(--border-subtle)`, `border-radius: 10px`, padding `0 14px`, warna teks `#030303`. Saat fokus, border berubah menjadi `#000000`.

- **Primary Button:** Background `#030303`, teks `#FFFFFF` tebal, `border-radius: 10px`, padding `10px 20px`, hover `#000000`.

- **Secondary / Outline Button:** Background `#FFFFFF`, `border: 1.5px solid #000000`, teks `#030303`, `border-radius: 10px`, hover `#F3F3F3`.

### F. Bottom Footer (`<footer>`)

- **Bentuk:** Lebar penuh (`100%`), background `#FFFFFF`, sudut atas melengkung (`border-radius: 24px 24px 0 0`), bayangan `--shadow-footer`, padding `28px 20px`.

- **Isi:** Baris ikon `#000000` + tautan kontak (*LinkedIn: Fathan Rafif Athaya*, *Email: fathanrafif20\@gmail.com*, *GitHub: fathanra-20*) sejajar horizontal di atas teks copyright `© 2026 Fathan Rafif Athaya. Hak Cipta Dilindungi.`.

## 5. Responsivitas

- **Desktop (`> 768px`):** Container `960px`, grid info 2 kolom, tabel penuh.

- **Mobile (`<= 768px`):** Padding card `20px`, grid form/info menumpuk 1 kolom (`grid-template-columns: 1fr`), tabel dibungkus `overflow-x: auto`.