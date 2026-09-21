import type { TeacherCloudPack } from '../types/teacherPack';

const TOKEN_KEY = 'pyclass-teacher-token';

export class TeacherApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'TeacherApiError';
    this.status = status;
  }
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string; retryAfter?: number };
    if (data?.error) return data.error;
  } catch {
    // ignore
  }
  if (res.status === 429) return '尝试过多，请稍后再试';
  return `请求失败（${res.status}）`;
}

export function loadTeacherToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function saveTeacherToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearTeacherToken(): void {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

export async function teacherLogin(pin: string): Promise<{ token: string; expiresIn: number }> {
  const res = await fetch('/api/teacher/session', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ pin }),
  });
  if (!res.ok) {
    throw new TeacherApiError(await parseError(res), res.status);
  }
  return (await res.json()) as { token: string; expiresIn: number };
}

export async function teacherLogout(token: string): Promise<void> {
  try {
    await fetch('/api/teacher/session', {
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
    });
  } catch {
    // ignore network errors on logout
  }
}

export async function fetchTeacherPack(token: string): Promise<TeacherCloudPack | null> {
  const res = await fetch('/api/teacher/pack', {
    headers: { authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new TeacherApiError(await parseError(res), res.status);
  }
  const data = (await res.json()) as { pack: TeacherCloudPack | null };
  return data.pack ?? null;
}

export async function saveTeacherPack(token: string, pack: TeacherCloudPack): Promise<string> {
  const res = await fetch('/api/teacher/pack', {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ pack }),
  });
  if (!res.ok) {
    throw new TeacherApiError(await parseError(res), res.status);
  }
  const data = (await res.json()) as { updatedAt?: string };
  return data.updatedAt ?? new Date().toISOString();
}
