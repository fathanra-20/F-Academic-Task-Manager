export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn(`Gagal menyimpan data ke localStorage (${key}).`, error);
  }
}

export function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw: string | null = localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`Gagal membaca data dari localStorage (${key}).`, error);
    return fallback;
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Gagal menghapus data dari localStorage (${key}).`, error);
  }
}
