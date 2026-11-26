# Sistem Manajemen Tugas Kuliah Semester 5

Aplikasi web untuk mengelola tugas delapan mata kuliah semester 5 secara terpusat.

**Mahasiswa:** Fathan Rafif Athaya  
**NIM:** 1247050044 — S1 Teknik Informatika, Semester 5  
**Profil:** [fathanra.vercel.app](https://fathanra.vercel.app)

## Fitur

- CRUD tugas: menambah, mengedit, menandai selesai, dan menghapus tugas.
- Integrasi delapan mata kuliah semester 5 beserta jumlah SKS.
- Status penyelesaian, prioritas, dan deadline tugas.
- Penyimpanan otomatis dengan `localStorage`, sehingga data tetap ada setelah halaman dimuat ulang.
- Validasi formulir serta tampilan responsif.

## Teknologi dan konsep

- **Git dan GitHub** digunakan untuk mencatat perubahan melalui commit, mengelola branch, berkolaborasi, dan menyimpan repository jarak jauh.
- **npm** membaca konfigurasi proyek dari `package.json`, memasang paket, dan menjalankan skrip proyek. `dependencies` berisi paket yang diperlukan saat aplikasi berjalan; `devDependencies` berisi alat pengembangan seperti Vite dan TypeScript. Versi paket mengikuti **semantic versioning** (`major.minor.patch`); rentang versi pada manifest mengatur versi yang dapat dipasang.
- **Vite** menyediakan development server untuk pengembangan lokal dan membundel aset menjadi hasil produksi.
- **TypeScript** memberi tipe primitive seperti `string`, `number`, dan `boolean`, tipe array, `interface`, serta `type` alias dan union untuk membatasi nilai. Generic dipakai agar fungsi dapat bekerja dengan tipe data yang tetap terjaga, misalnya helper DOM dan penyimpanan. Compiler TypeScript memeriksa tipe dan mentranspilasi sintaks TypeScript menjadi JavaScript; Vite kemudian membundel JavaScript tersebut untuk browser.
- **Environment variables** disediakan melalui berkas `.env` lokal dan dibaca Vite melalui `import.meta.env`. Gunakan `.env.example` sebagai templat nilai; jangan commit `.env` karena dapat berisi konfigurasi privat.

## Struktur folder

```text
tugas-pertemuan-6/
├── index.html
├── public/                 # aset statis
├── src/
│   ├── data/               # mata kuliah dan data awal
│   ├── types/              # interface dan tipe aplikasi
│   ├── utils/              # helper dan penyimpanan
│   ├── main.ts             # antarmuka dan interaksi aplikasi
│   └── style.css           # gaya dan layout
├── .env.example
├── package.json
```

## Menjalankan secara lokal

```sh
npm install
npm run dev
```

Untuk membuat bundel produksi:

```sh
npm run build
```
