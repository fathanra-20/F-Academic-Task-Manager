import type { Course } from '../types/task.ts';

export const COURSES: Course[] = [
  { kode: '20100470501034', nama: 'Manajemen Proyek Perangkat Lunak', sks: 3 },
  { kode: '20100470501024', nama: 'Manajemen Basis Data', sks: 3 },
  { kode: '20100470501033', nama: 'Intelegensia Buatan', sks: 3 },
  { kode: '20100470503006', nama: 'Kewirausahaan & Etika Bisnis', sks: 2 },
  { kode: '20100470501032', nama: 'Interaksi Manusia dan Komputer', sks: 3 },
  { kode: '20100470501028', nama: 'Pengembangan Aplikasi Mobile', sks: 3 },
  { kode: '20100470501026', nama: 'Jaringan Komputer', sks: 3 },
  { kode: '20100470501030', nama: 'Pengembangan Aplikasi Web', sks: 3 },
];

export const TOTAL_SKS: number = COURSES.reduce(
  (total: number, course: Course): number => total + course.sks,
  0,
);
