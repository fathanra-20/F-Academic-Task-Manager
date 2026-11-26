import './style.css';
import emailIcon from './assets/social/email.svg';
import githubIcon from './assets/social/github.svg';
import linkedinIcon from './assets/social/linkedin.svg';
import { COURSES, TOTAL_SKS } from './data/courses.ts';
import type { Course, PriorityLevel, Task, TaskStatus, TaskSummary } from './types/task.ts';
import { getFromStorage, removeFromStorage, saveToStorage } from './utils/storage.ts';

const APP_NAME: string = import.meta.env.VITE_APP_NAME || 'Sistem Manajemen Tugas Kuliah';
const APP_VERSION: string = import.meta.env.VITE_APP_VERSION || '1.0.0';
const STUDENT_NAME: string = import.meta.env.VITE_STUDENT_NAME || 'Fathan Rafif Athaya';
const STUDENT_NIM: string = import.meta.env.VITE_STUDENT_NIM || '1247050044';

const TASKS_STORAGE_KEY: string = 'paw6.tasks.v1';
const PRIORITIES: readonly PriorityLevel[] = ['Rendah', 'Sedang', 'Tinggi'];
const MONTHS_SHORT: readonly string[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

let tasks: Task[] = loadTasks();
let editingId: number | null = null;

/* --------------------------------------------------------------------------
   Data awal & penyimpanan
   -------------------------------------------------------------------------- */

function createSeedTasks(): Task[] {
  return [
    {
      id: 1,
      title: 'Menyusun laporan sprint review',
      courseName: 'Manajemen Proyek Perangkat Lunak',
      deadline: '2026-12-02',
      priority: 'Tinggi',
      status: 'Belum Selesai',
      createdAt: '2026-11-20T08:00:00.000Z',
    },
    {
      id: 2,
      title: 'Normalisasi skema database perpustakaan',
      courseName: 'Manajemen Basis Data',
      deadline: '2026-12-05',
      priority: 'Sedang',
      status: 'Belum Selesai',
      createdAt: '2026-11-21T09:30:00.000Z',
    },
    {
      id: 3,
      title: 'Implementasi algoritma pencarian A*',
      courseName: 'Intelegensia Buatan',
      deadline: '2026-11-28',
      priority: 'Tinggi',
      status: 'Selesai',
      createdAt: '2026-11-18T13:15:00.000Z',
    },
    {
      id: 4,
      title: 'Menyusun laporan observasi usability',
      courseName: 'Interaksi Manusia dan Komputer',
      deadline: '2026-12-08',
      priority: 'Rendah',
      status: 'Selesai',
      createdAt: '2026-11-22T10:45:00.000Z',
    },
  ];
}

function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === 'number' &&
    typeof candidate.title === 'string' &&
    typeof candidate.courseName === 'string' &&
    typeof candidate.deadline === 'string' &&
    typeof candidate.priority === 'string' &&
    isPriorityLevel(candidate.priority) &&
    (candidate.status === 'Belum Selesai' || candidate.status === 'Selesai') &&
    typeof candidate.createdAt === 'string'
  );
}

function loadTasks(): Task[] {
  const stored: unknown = getFromStorage<unknown>(TASKS_STORAGE_KEY, null);

  if (Array.isArray(stored)) {
    const storedTasks: Task[] = stored.filter(isTask);
    if (storedTasks.length === stored.length) {
      return storedTasks;
    }
  }

  if (stored !== null) {
    removeFromStorage(TASKS_STORAGE_KEY);
  }

  const seededTasks: Task[] = createSeedTasks();
  saveToStorage<Task[]>(TASKS_STORAGE_KEY, seededTasks);
  return seededTasks;
}

function commitTasks(): void {
  saveToStorage<Task[]>(TASKS_STORAGE_KEY, tasks);
  renderTasks();
}

/* --------------------------------------------------------------------------
   Utilitas
   -------------------------------------------------------------------------- */

function getElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Elemen "${selector}" tidak ditemukan.`);
  }
  return element;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDeadline(deadline: string): string {
  const parts: string[] = deadline.split('-');
  if (parts.length !== 3) {
    return deadline;
  }

  const [year, month, day] = parts;
  const monthLabel: string | undefined = MONTHS_SHORT[Number(month) - 1];
  const dayNumber: number = Number(day);

  if (!monthLabel || Number.isNaN(dayNumber) || dayNumber < 1 || dayNumber > 31) {
    return deadline;
  }

  return `${dayNumber} ${monthLabel} ${year}`;
}

function summarizeTasks(taskList: Task[]): TaskSummary {
  const total: number = taskList.length;
  const done: number = taskList.filter((task: Task): boolean => task.status === 'Selesai').length;
  const pending: number = total - done;
  const completionRate: number = total === 0 ? 0 : Math.round((done / total) * 100);

  return { total, done, pending, completionRate };
}

function isPriorityLevel(value: string): value is PriorityLevel {
  return value === 'Rendah' || value === 'Sedang' || value === 'Tinggi';
}

function getNextTaskId(): number {
  return tasks.reduce((maxId: number, task: Task): number => Math.max(maxId, task.id), 0) + 1;
}

/* --------------------------------------------------------------------------
   Markup
   -------------------------------------------------------------------------- */

function renderCourseOptions(courses: Course[]): string {
  return courses
    .map(
      (course: Course): string =>
        `<option value="${escapeHtml(course.nama)}">${escapeHtml(course.nama)} · ${course.sks} SKS</option>`,
    )
    .join('');
}

function createShellMarkup(): string {
  const courseOptions: string = renderCourseOptions(COURSES);
  const priorityOptions: string = PRIORITIES.map(
    (priority: PriorityLevel): string =>
      `<option value="${priority}"${priority === 'Sedang' ? ' selected' : ''}>${priority}</option>`,
  ).join('');

  return `
    <div class="page-shell">
      <a class="skip-link" href="#main-content">Loncat ke konten utama</a>

      <header class="site-header">
        <nav class="nav-container" aria-label="Navigasi utama">
          <a class="nav-brand" href="#main-content">
            <span>${escapeHtml(APP_NAME)}</span>
          </a>
          <ul class="nav-links">
            <li><a class="nav-link" href="#daftar-tugas">Daftar Tugas</a></li>
            <li><a class="nav-link" href="#tambah-tugas">Tambah Tugas</a></li>
            <li><a class="nav-link" href="#dokumentasi">Dokumentasi</a></li>
            <li>
              <a
                class="nav-link nav-external"
                href="https://fathanra.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Profil Tugas 2 <span aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main id="main-content" class="main-content">
        <section class="card identity-card" aria-labelledby="app-heading">
          <span class="eyebrow">Tugas Pertemuan 6 · Vite + TypeScript</span>
          <h1 id="app-heading">${escapeHtml(APP_NAME)}</h1>
          <p class="lede">
            Kelola daftar tugas kuliah semester 5 dalam satu tempat: tambah tugas baru, tandai
            selesai, edit judul atau deadline, dan hapus tugas yang tidak diperlukan. Seluruh data
            tersimpan otomatis di localStorage peramban.
          </p>

          <div class="stat-grid" id="stat-grid" aria-label="Ringkasan tugas"></div>

          <div class="row identity-meta">
            <p class="identity-owner">
              <strong>${escapeHtml(STUDENT_NAME)}</strong> · NIM ${escapeHtml(STUDENT_NIM)}
            </p>
            <p class="muted">S1 Teknik Informatika · Semester 5</p>
            <p class="muted">${COURSES.length} mata kuliah · ${TOTAL_SKS} SKS</p>
            <span class="badge badge-outline">v${escapeHtml(APP_VERSION)}</span>
          </div>
        </section>

        <section id="tambah-tugas" class="card" aria-labelledby="form-heading">
          <div class="card-header">
            <div>
              <h2 id="form-heading">Tambah Tugas Baru</h2>
              <p class="muted">Isi judul, mata kuliah, deadline, dan prioritas tugas.</p>
            </div>
          </div>

          <form id="task-form" class="form-grid" novalidate>
            <div class="field field--full" data-field="title">
              <label for="task-title">Judul Tugas</label>
              <input
                id="task-title"
                name="title"
                type="text"
                maxlength="120"
                required
                autocomplete="off"
                placeholder="Contoh: Menyusun laporan sprint review"
                aria-describedby="task-title-error"
              />
              <p class="field-error" id="task-title-error" hidden></p>
            </div>

            <div class="field" data-field="course">
              <label for="task-course">Mata Kuliah</label>
              <select id="task-course" name="course" required aria-describedby="task-course-error">
                <option value="">Pilih mata kuliah</option>
                ${courseOptions}
              </select>
              <p class="field-error" id="task-course-error" hidden></p>
            </div>

            <div class="field" data-field="deadline">
              <label for="task-deadline">Deadline</label>
              <input
                id="task-deadline"
                name="deadline"
                type="date"
                required
                aria-describedby="task-deadline-error"
              />
              <p class="field-error" id="task-deadline-error" hidden></p>
            </div>

            <div class="field" data-field="priority">
              <label for="task-priority">Prioritas</label>
              <select id="task-priority" name="priority">
                ${priorityOptions}
              </select>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Tambah Tugas</button>
            </div>
          </form>
        </section>

        <section id="daftar-tugas" class="card" aria-labelledby="daftar-heading">
          <div class="card-header">
            <div>
              <h2 id="daftar-heading">Daftar Tugas Kuliah</h2>
              <p class="muted">Klik badge status untuk menandai tugas selesai atau belum selesai.</p>
            </div>
            <span class="badge badge-outline" id="task-count">0 tugas</span>
          </div>

          <div class="table-scroll">
            <table class="task-table">
              <caption class="sr-only">
                Daftar tugas kuliah beserta mata kuliah, deadline, prioritas, dan status
              </caption>
              <thead>
                <tr>
                  <th scope="col" class="col-no">No</th>
                  <th scope="col">Mata Kuliah</th>
                  <th scope="col">Judul Tugas</th>
                  <th scope="col" class="col-center">Deadline</th>
                  <th scope="col" class="col-center">Prioritas</th>
                  <th scope="col" class="col-center">Status</th>
                  <th scope="col" class="col-actions">Aksi</th>
                </tr>
              </thead>
              <tbody id="task-tbody"></tbody>
              <tfoot id="task-summary" aria-live="polite"></tfoot>
            </table>
          </div>
        </section>

        <section id="dokumentasi" class="card" aria-labelledby="docs-heading">
          <h2 id="docs-heading">Dokumentasi Teknis</h2>
          <p class="lede">
            Ringkasan peran perkakas yang digunakan untuk membangun dan merilis aplikasi ini.
          </p>

          <dl class="docs-grid">
            <div class="docs-item">
              <dt>Git &amp; GitHub</dt>
              <dd>
                Git adalah version control yang mencatat setiap perubahan kode sebagai commit,
                sehingga riwayat pekerjaan dapat ditelusuri dan dikembalikan. Branch digunakan
                untuk mengembangkan fitur secara terpisah, lalu digabungkan kembali ke branch utama
                melalui merge. GitHub menjadi tempat menyimpan repositori remote, membuka pull
                request untuk meninjau perubahan, dan mendokumentasikan penyelesaian merge
                conflict.
              </dd>
            </div>

            <div class="docs-item">
              <dt>npm</dt>
              <dd>
                npm adalah package manager yang mengelola dependensi proyek melalui package.json
                dan folder node_modules. dependencies berisi pustaka yang dibutuhkan saat aplikasi
                berjalan, sedangkan devDependencies hanya dibutuhkan saat pengembangan seperti
                TypeScript dan Vite. Nomor versi mengikuti semantic versioning
                (MAJOR.MINOR.PATCH) agar pembaruan dependensi dapat dikendalikan dengan aman.
              </dd>
            </div>

            <div class="docs-item">
              <dt>Vite</dt>
              <dd>
                Vite menyediakan dev server yang sangat cepat karena memanfaatkan native ES modules
                dan hot module replacement saat pengembangan. Ketika aplikasi dirilis, Vite
                berperan sebagai bundler yang mengompilasi, menggabungkan, dan mengoptimalkan aset
                menjadi berkas produksi di folder dist. Konfigurasi proyek tetap ringkas karena
                Vite bekerja langsung dengan struktur HTML dan TypeScript yang ada.
              </dd>
            </div>

            <div class="docs-item">
              <dt>TypeScript</dt>
              <dd>
                TypeScript menambahkan static typing di atas JavaScript sehingga kesalahan tipe
                dapat dideteksi sebelum kode dijalankan. Compiler tsc memeriksa tipe dan melakukan
                transpile ke JavaScript yang kompatibel dengan peramban, sementara Vite menangani
                proses build akhir. Anotasi seperti interface, type alias, union type, dan generics
                membuat data tugas serta helper penyimpanan lebih mudah dipahami dan dipelihara.
              </dd>
            </div>

            <div class="docs-item">
              <dt>Environment Variables</dt>
              <dd>
                File .env menyimpan konfigurasi lokal seperti nama aplikasi, versi, nama mahasiswa,
                dan NIM; file ini tidak di-commit karena sudah masuk .gitignore. File .env.example
                di-commit sebagai template agar kontributor lain mengetahui variabel yang dibutuhkan
                tanpa menyalin nilai rahasia. Di Vite, variabel non-rahasia diawali VITE_ dan
                diakses melalui import.meta.env, sehingga tidak ada API key atau password yang
                terekspos di sisi klien.
              </dd>
            </div>
          </dl>
        </section>
      </main>

      <footer class="site-footer">
        <div class="contact-links" aria-label="Kontak ${escapeHtml(STUDENT_NAME)}">
          <a
            href="https://www.linkedin.com/in/fathan-rafif-athaya-80bb37437"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn: ${escapeHtml(STUDENT_NAME)}"
          >
            <img src="${linkedinIcon}" alt="" width="32" height="32" />
            <span>${escapeHtml(STUDENT_NAME)}</span>
          </a>
          <a href="mailto:fathanrafif20@gmail.com" aria-label="Email: fathanrafif20@gmail.com">
            <img src="${emailIcon}" alt="" width="32" height="32" />
            <span>fathanrafif20@gmail.com</span>
          </a>
          <a
            href="https://github.com/fathanra-20"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub: fathanra-20"
          >
            <img src="${githubIcon}" alt="" width="32" height="32" />
            <span>fathanra-20</span>
          </a>
        </div>
        <p>© 2026 ${escapeHtml(STUDENT_NAME)}. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   Render tabel & statistik
   -------------------------------------------------------------------------- */

function renderStats(summary: TaskSummary): void {
  const statGrid = getElement<HTMLDivElement>('#stat-grid');
  statGrid.setAttribute(
    'aria-label',
    `Ringkasan tugas: ${summary.done} dari ${summary.total} tugas selesai (${summary.completionRate}%).`,
  );
  statGrid.innerHTML = `
    <div class="stat-card">
      <span class="stat-value">${summary.total}</span>
      <span class="stat-label">Total Tugas</span>
    </div>
    <div class="stat-card">
      <span class="stat-value">${summary.done}</span>
      <span class="stat-label">Selesai</span>
    </div>
    <div class="stat-card">
      <span class="stat-value">${summary.pending}</span>
      <span class="stat-label">Belum Selesai</span>
    </div>
  `;
}

function renderTaskRow(task: Task, index: number): string {
  const isEditing: boolean = editingId === task.id;
  const isDone: boolean = task.status === 'Selesai';
  const statusClass: string = isDone ? 'badge-solid' : 'badge-outline';
  const rowClass: string = isEditing ? ' class="is-editing"' : '';
  const safeTitle: string = escapeHtml(task.title);

  const titleCell: string = isEditing
    ? `<input
        class="inline-input"
        type="text"
        maxlength="120"
        value="${safeTitle}"
        data-edit-field="title"
        aria-label="Judul tugas"
      />`
    : safeTitle;

  const deadlineCell: string = isEditing
    ? `<input
        class="inline-input"
        type="date"
        value="${escapeHtml(task.deadline)}"
        data-edit-field="deadline"
        aria-label="Deadline tugas"
      />`
    : escapeHtml(formatDeadline(task.deadline));

  const actionButtons: string = isEditing
    ? `<button type="button" class="btn btn-primary btn-sm" data-action="save-edit" data-id="${task.id}" aria-label="Simpan perubahan tugas: ${safeTitle}">Simpan</button>
       <button type="button" class="btn btn-outline btn-sm" data-action="cancel-edit" data-id="${task.id}" aria-label="Batalkan edit tugas: ${safeTitle}">Batal</button>`
    : `<button type="button" class="btn btn-outline btn-sm" data-action="edit" data-id="${task.id}" aria-label="Edit tugas: ${safeTitle}">Edit</button>
       <button type="button" class="btn btn-danger btn-sm" data-action="delete" data-id="${task.id}" aria-label="Hapus tugas: ${safeTitle}">Hapus</button>`;

  return `
    <tr${rowClass}>
      <td class="col-no">${index + 1}</td>
      <td>${escapeHtml(task.courseName)}</td>
      <td class="table-title">${titleCell}</td>
      <td class="col-center">${deadlineCell}</td>
      <td class="col-center"><span class="badge badge-ghost">${escapeHtml(task.priority)}</span></td>
      <td class="col-center">
        <button
          type="button"
          class="badge ${statusClass} status-toggle"
          data-action="toggle"
          data-id="${task.id}"
          aria-pressed="${isDone}"
          aria-label="Tandai ${safeTitle} sebagai ${isDone ? 'Belum Selesai' : 'Selesai'}"
        >${escapeHtml(task.status)}</button>
      </td>
      <td class="col-actions">
        <div class="row-actions">${actionButtons}</div>
      </td>
    </tr>
  `;
}

function renderEmptyRow(): string {
  return `
    <tr>
      <td colspan="7" class="empty-cell">
        <div class="empty-state">
          <h3>Belum ada tugas kuliah</h3>
          <p>
            Tambahkan tugas pertama melalui formulir "Tambah Tugas Baru" di atas. Data akan
            tersimpan otomatis di peramban ini.
          </p>
        </div>
      </td>
    </tr>
  `;
}

function renderSummaryRow(summary: TaskSummary): string {
  return `
    <tr>
      <th scope="row" colspan="3">Ringkasan Tugas</th>
      <td class="col-center"><span class="sr-only">Total: </span>${summary.total}</td>
      <td class="col-center"><span class="sr-only">Selesai: </span>${summary.done}</td>
      <td class="col-center"><span class="sr-only">Belum selesai: </span>${summary.pending}</td>
      <td aria-hidden="true"></td>
    </tr>
  `;
}

function renderTasks(): void {
  const summary: TaskSummary = summarizeTasks(tasks);

  renderStats(summary);

  const countBadge = getElement<HTMLSpanElement>('#task-count');
  countBadge.textContent = `${summary.total} tugas`;

  const tableBody = getElement<HTMLTableSectionElement>('#task-tbody');
  tableBody.innerHTML =
    tasks.length === 0 ? renderEmptyRow() : tasks.map(renderTaskRow).join('');

  const tableSummary = getElement<HTMLTableSectionElement>('#task-summary');
  tableSummary.innerHTML = renderSummaryRow(summary);
}

/* --------------------------------------------------------------------------
   Aksi pengguna
   -------------------------------------------------------------------------- */

function focusInlineTitle(): void {
  const input = document.querySelector<HTMLInputElement>('#task-tbody [data-edit-field="title"]');
  if (!input) {
    return;
  }
  input.focus();
  input.select();
}

function setInlineError(input: HTMLInputElement, hasError: boolean): void {
  input.classList.toggle('has-error', hasError);
  if (hasError) {
    input.setAttribute('aria-invalid', 'true');
  } else {
    input.removeAttribute('aria-invalid');
  }
}

function saveInlineEdit(button: HTMLElement, taskId: number): void {
  const row = button.closest<HTMLTableRowElement>('tr');
  if (!row) {
    return;
  }

  const titleInput = row.querySelector<HTMLInputElement>('[data-edit-field="title"]');
  const deadlineInput = row.querySelector<HTMLInputElement>('[data-edit-field="deadline"]');
  if (!titleInput || !deadlineInput) {
    return;
  }

  const title: string = titleInput.value.trim();
  const deadline: string = deadlineInput.value;
  const titleInvalid: boolean = title.length < 3;
  const deadlineInvalid: boolean = deadline.length === 0;

  setInlineError(titleInput, titleInvalid);
  setInlineError(deadlineInput, deadlineInvalid);

  if (titleInvalid) {
    titleInput.focus();
    return;
  }

  if (deadlineInvalid) {
    deadlineInput.focus();
    return;
  }

  tasks = tasks.map((task: Task): Task =>
    task.id === taskId ? { ...task, title, deadline } : task,
  );
  editingId = null;
  commitTasks();
}

function handleAppClick(event: MouseEvent): void {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const actionElement = target.closest<HTMLElement>('[data-action]');
  if (!actionElement) {
    return;
  }

  const action: string | undefined = actionElement.dataset.action;
  const taskId: number = Number(actionElement.dataset.id);
  if (!Number.isInteger(taskId)) {
    return;
  }

  const task: Task | undefined = tasks.find((item: Task): boolean => item.id === taskId);
  if (!task) {
    return;
  }

  switch (action) {
    case 'toggle': {
      const nextStatus: TaskStatus = task.status === 'Selesai' ? 'Belum Selesai' : 'Selesai';
      tasks = tasks.map((item: Task): Task =>
        item.id === taskId ? { ...item, status: nextStatus } : item,
      );
      commitTasks();
      break;
    }
    case 'edit': {
      editingId = taskId;
      renderTasks();
      focusInlineTitle();
      break;
    }
    case 'delete': {
      const confirmed: boolean = window.confirm(
        `Hapus tugas "${task.title}"? Tindakan ini tidak dapat dibatalkan.`,
      );
      if (!confirmed) {
        return;
      }
      tasks = tasks.filter((item: Task): boolean => item.id !== taskId);
      if (editingId === taskId) {
        editingId = null;
      }
      commitTasks();
      break;
    }
    case 'save-edit': {
      saveInlineEdit(actionElement, taskId);
      break;
    }
    case 'cancel-edit': {
      editingId = null;
      renderTasks();
      break;
    }
    default: {
      break;
    }
  }
}

function setFieldError(fieldName: string, message: string | null): void {
  const field = document.querySelector<HTMLElement>(`.field[data-field="${fieldName}"]`);
  if (!field) {
    return;
  }

  const error = field.querySelector<HTMLParagraphElement>('.field-error');
  field.classList.toggle('has-error', message !== null);

  if (error) {
    error.textContent = message ?? '';
    error.hidden = message === null;
  }

  const control = field.querySelector<HTMLInputElement | HTMLSelectElement>('input, select');
  if (control) {
    if (message === null) {
      control.removeAttribute('aria-invalid');
    } else {
      control.setAttribute('aria-invalid', 'true');
    }
  }
}

function clearFormErrors(): void {
  setFieldError('title', null);
  setFieldError('course', null);
  setFieldError('deadline', null);
}

function handleTaskSubmit(event: SubmitEvent): void {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || form.id !== 'task-form') {
    return;
  }
  event.preventDefault();

  const titleInput = getElement<HTMLInputElement>('#task-title');
  const courseSelect = getElement<HTMLSelectElement>('#task-course');
  const deadlineInput = getElement<HTMLInputElement>('#task-deadline');
  const prioritySelect = getElement<HTMLSelectElement>('#task-priority');

  const title: string = titleInput.value.trim();
  const courseName: string = courseSelect.value;
  const deadline: string = deadlineInput.value;
  const priorityValue: string = prioritySelect.value;
  const priority: PriorityLevel = isPriorityLevel(priorityValue) ? priorityValue : 'Sedang';

  const titleInvalid: boolean = title.length < 3;
  const courseInvalid: boolean = courseName.length === 0;
  const deadlineInvalid: boolean = deadline.length === 0;

  setFieldError('title', titleInvalid ? 'Judul tugas minimal 3 karakter.' : null);
  setFieldError('course', courseInvalid ? 'Pilih mata kuliah terlebih dahulu.' : null);
  setFieldError('deadline', deadlineInvalid ? 'Tanggal deadline wajib diisi.' : null);

  if (titleInvalid) {
    titleInput.focus();
    return;
  }

  if (courseInvalid) {
    courseSelect.focus();
    return;
  }

  if (deadlineInvalid) {
    deadlineInput.focus();
    return;
  }

  const newTask: Task = {
    id: getNextTaskId(),
    title,
    courseName,
    deadline,
    priority,
    status: 'Belum Selesai',
    createdAt: new Date().toISOString(),
  };

  tasks = [...tasks, newTask];
  editingId = null;
  form.reset();
  clearFormErrors();
  commitTasks();
  titleInput.focus();
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || editingId === null) {
    return;
  }
  editingId = null;
  renderTasks();
}

const originalScrollBehavior: string = document.documentElement.style.scrollBehavior;
let activeScrollAnimation: number | null = null;

function gentleScroll(target: HTMLElement, hash: string): void {
  const startPosition: number = window.scrollY;
  const headerOffset: number = 88;
  const targetPosition: number = Math.max(
    0,
    Math.min(
      target.getBoundingClientRect().top + startPosition - headerOffset,
      document.documentElement.scrollHeight - window.innerHeight,
    ),
  );
  const distance: number = targetPosition - startPosition;
  const duration: number = 1400;
  const startTime: number = performance.now();

  if (activeScrollAnimation !== null) {
    cancelAnimationFrame(activeScrollAnimation);
  }
  document.documentElement.style.scrollBehavior = 'auto';

  function animate(currentTime: number): void {
    const progress: number = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress: number = 0.5 - Math.cos(progress * Math.PI) / 2;

    window.scrollTo({
      top: startPosition + distance * easedProgress,
      left: 0,
      behavior: 'auto',
    });

    if (progress < 1) {
      activeScrollAnimation = requestAnimationFrame(animate);
    } else {
      document.documentElement.style.scrollBehavior = originalScrollBehavior;
      activeScrollAnimation = null;
      history.pushState(null, '', hash);
    }
  }

  activeScrollAnimation = requestAnimationFrame(animate);
}

function handleNavigationClick(event: MouseEvent): void {
  const eventTarget: EventTarget | null = event.target;
  if (!(eventTarget instanceof Element)) {
    return;
  }

  const link: HTMLAnchorElement | null = eventTarget.closest<HTMLAnchorElement>(
    '.nav-container a[href^="#"]',
  );
  const hash: string | null = link?.getAttribute('href') ?? null;
  const target: HTMLElement | null = hash
    ? document.querySelector<HTMLElement>(hash)
    : null;

  if (!hash || !target) {
    return;
  }

  event.preventDefault();
  gentleScroll(target, hash);
}

/* --------------------------------------------------------------------------
   Inisialisasi
   -------------------------------------------------------------------------- */

function init(): void {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) {
    throw new Error('Elemen #app tidak ditemukan.');
  }

  app.innerHTML = createShellMarkup();
  app.addEventListener('click', handleNavigationClick);
  app.addEventListener('click', handleAppClick);
  app.addEventListener('submit', handleTaskSubmit);
  document.addEventListener('keydown', handleKeydown);

  renderTasks();
}

init();
