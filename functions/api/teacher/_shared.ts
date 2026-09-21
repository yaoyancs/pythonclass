import type { D1Database } from '../analytics/_db';

/** Cloudflare Pages Functions 环境绑定 */
export interface TeacherEnv {
  TEACHER_KV: KVNamespace;
  /** 教师 PIN（Pages 环境变量 / secret） */
  TEACHER_PIN: string;
  /** 访问统计（D1）；未绑定时写入接口返回 503，课堂端忽略失败 */
  ANALYTICS_DB?: D1Database;
}

export const PACK_KEY = 'pyclass:teacher:pack:v1';
export const SESSION_PREFIX = 'pyclass:teacher:session:';
export const SESSION_TTL_SEC = 12 * 60 * 60;

export function json(data: unknown, status = 200, extraHeaders?: HeadersInit): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...extraHeaders,
    },
  });
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

export function bearerToken(request: Request): string | null {
  const header = request.headers.get('authorization') || '';
  const m = /^Bearer\s+(.+)$/i.exec(header.trim());
  return m?.[1]?.trim() || null;
}

export async function requireTeacherSession(
  request: Request,
  env: TeacherEnv,
): Promise<Response | null> {
  const token = bearerToken(request);
  if (!token) {
    return json({ error: '未登录教师台' }, 401);
  }
  const ok = await env.TEACHER_KV.get(`${SESSION_PREFIX}${token}`);
  if (!ok) {
    return json({ error: '登录已失效，请重新输入 PIN' }, 401);
  }
  return null;
}

export function randomToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}
