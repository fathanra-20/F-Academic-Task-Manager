# Tugas Pertemuan 6

**Judul Aplikasi:** Manajemen Daftar Tugas Kuliah (Academic Task Manager)

**Teknologi Utama:** HTML5, CSS3 (Design System Tugas 2), TypeScript, Vite, npm, Git & GitHub

**Identitas Mahasiswa:** Fathan Rafif Athaya (`1247050044`)

## 1. Tujuan & Gambaran Aplikasi

Membangun aplikasi web manajemen daftar tugas kuliah menggunakan **TypeScript** dan **Vite** dengan tampilan yang selaras dengan halaman profil Tugas 2. Aplikasi terintegrasi dengan daftar mata kuliah semester 5 yang diambil mahasiswa dan menampilkan dokumentasi teknis penggunaan tools di bagian bawah halaman.

## 2. Spesifikasi Fungsional

### A. Manajemen Daftar Tugas (CRUD)

1. **Menampilkan Daftar Tugas:**

   - Ditampilkan dalam card bergaya tabel Tugas 2 (kolom: `No`, `Mata Kuliah`, `Judul Tugas`, `Deadline`, `Prioritas`, `Status`, `Aksi`).

   - Menyediakan ringkasan jumlah tugas (*Total Tugas*, *Selesai*, *Belum Selesai*) di bagian footer tabel.

2. **Menambahkan Tugas Baru:**

   - Form input dalam card tersendiri berisi:

     - Judul Tugas (`string`)

     - Pilihan Mata Kuliah (dropdown berisi 8 mata kuliah semester 5 dari Tugas 2, misal: *Pengembangan Aplikasi Web*, *Manajemen Basis Data*, dll.)

     - Tanggal Deadline (`string`)

     - Tingkat Prioritas (`Rendah` | `Sedang` | `Tinggi`)

3. **Mengubah Status Tugas:**

   - Tombol/checkbox toggle untuk mengubah status antara `Belum Selesai` dan `Selesai`.

4. **Mengedit & Menghapus Tugas:**

   - Fitur edit judul/deadline tugas dan tombol hapus tugas dengan konfirmasi.

   - Data disimpan di `localStorage` agar tidak hilang saat halaman di-refresh.

### B. Bagian Penjelasan Teknis (Wajib sesuai Ketentuan Pengumpulan)

Menambahkan satu section card khusus di halaman web yang menjelaskan secara ringkas dan jelas:

- Peran **Git & GitHub** (version control, branching, merge, PR).

- Peran **npm** (package manager, `package.json`, dependencies vs devDependencies, semantic versioning).

- Peran **Vite** (dev server cepat & bundler untuk production build).

- Peran **TypeScript** (static typing & transpiler ke JavaScript).

- Penggunaan **Environment Variables** (`.env` & `.env.example`).

## 3. Spesifikasi Teknis TypeScript (Wajib Ada dalam Kode)

Kode di dalam folder `src/` wajib mengimplementasikan seluruh konsep berikut secara nyata:

1. **Primitive Types:** `string`, `number`, `boolean` (misal pada properti tugas dan counter statistik).

2. **Array:** `Task[]` untuk menyimpan daftar tugas dan `Course[]` untuk daftar mata kuliah.

3. **Interface:**

   ```
   export interface Course {
     kode: string;
     nama: string;
     sks: number;
   }

   export interface Task {
     id: number;
     title: string;
     courseName: string;
     deadline: string;
     priority: PriorityLevel;
     status: TaskStatus;
     createdAt: string;
   }
   ```

4. **Type Alias & Union Type:**

   ```
   export type TaskStatus = 'Belum Selesai' | 'Selesai';
   export type PriorityLevel = 'Rendah' | 'Sedang' | 'Tinggi';
   ```

5. **Generics Sederhana:**

   ```
   // Contoh fungsi generic untuk helper storage atau filter data
   export function saveToStorage<T>(key: string, data: T): void {
     localStorage.setItem(key, JSON.stringify(data));
   }

   export function getFromStorage<T>(key: string, fallback: T): T {
     const raw = localStorage.getItem(key);
     return raw ? (JSON.parse(raw) as T) : fallback;
   }
   ```

## 4. Environment Variables

- File `.env` (di-ignore oleh Git) dan `.env.example` (di-commit ke GitHub):

  ```
  VITE_APP_NAME="Sistem Manajemen Tugas Kuliah"
  VITE_APP_VERSION="1.0.0"
  VITE_STUDENT_NAME="Fathan Rafif Athaya"
  VITE_STUDENT_NIM="1247050044"
  ```

- Menampilkan nama & versi aplikasi dari `import.meta.env` pada header/card informasi tanpa mengekspos data rahasia.

## 5. Struktur Folder Proyek

```
tugas-6/
├── .env                  # Tidak di-push ke GitHub
├── .env.example          # Template env untuk GitHub
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── src/
    ├── main.ts           # Entry point & DOM event binding
    ├── style.css         # Implementasi token dari DESIGN.md
    ├── types/
    │   └── task.ts       # Interface, Type Alias, Union Types
    ├── data/
    │   └── courses.ts    # Data 8 mata kuliah dari Tugas 2
    └── utils/
        └── storage.ts    # Generic helper functions
```

## 6. Checklist Git, GitHub & Deployment

- \[ ] Inisialisasi repo GitHub & pastikan `.env` serta `node_modules/` masuk `.gitignore`.

- \[ ] Minimal **5 commit** dengan pesan yang deskriptif.

- \[ ] Buat minimal **2 branch** (misal `main` dan `feature/task-crud`).

- \[ ] Simulasikan dan selesaikan **merge conflict** (ambil screenshot bukti).

- \[ ] Buat minimal **1 Pull Request** dan lakukan merge ke `main` (ambil screenshot bukti).

- \[ ] Jalankan `npm run build` dan deploy ke website pribadi (misal: `https://domainkamu.com/tugas-6/`).