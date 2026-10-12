export type DemoBooking = {
  id: string;
  slug: string;
  title: string;
  location: string;
  date: string;
  time: string;
  adults: number;
  children: number;
  name: string;
  email: string;
  phone: string;
  total: number;
  status: string;
  createdAt: string;
};

export type DemoUser = { name: string; email: string; role: "customer" | "partner" | "admin" };

export function readDemo<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

export function writeDemo<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}