
const DEFAULT_BASE = "http://localhost:8000";

export const API_BASE: string =
  (window as any).__APP_CONFIG__?.API_BASE ||
  (import.meta as any).env?.VITE_API_BASE ||
  DEFAULT_BASE;

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export type UploadResponse = {
  id: string;
  name: string;
  path: string;
  size: number;
  columns: string[];
  dtypes: Record<string, string>;
  row_count: number;
};

export const api = {
  health: () => http<{ status: string; version?: string }>(`/health`),
  upload: (file: File, opts?: { delimiter?: string; sheet_name?: string }) => {
    const fd = new FormData();
    fd.append("file", file);
    if (opts?.delimiter) fd.append("delimiter", opts.delimiter);
    if (opts?.sheet_name) fd.append("sheet_name", opts.sheet_name);
    return fetch(`${API_BASE}/api/upload`, { method: "POST", body: fd }).then(async (r) => {
      if (!r.ok) {
        const t = await r.text();
        throw new Error(`${r.status} ${r.statusText}: ${t}`);
      }
      return r.json() as Promise<UploadResponse>;
    });
  },
  task: <T=any>(name: string, payload: any) => http<T>(`/api/tasks/${name}`, { method: "POST", body: JSON.stringify(payload) }),
};
