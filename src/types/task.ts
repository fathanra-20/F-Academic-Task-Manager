export type TaskStatus = 'Belum Selesai' | 'Selesai';
export type PriorityLevel = 'Rendah' | 'Sedang' | 'Tinggi';

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

export interface TaskSummary {
  total: number;
  done: number;
  pending: number;
  completionRate: number;
}
