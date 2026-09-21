import {
  bearerToken,
  json,
  PACK_KEY,
  requireTeacherSession,
  SESSION_PREFIX,
  type TeacherEnv,
} from './_shared';

type PagesContext = {
  request: Request;
  env: TeacherEnv;
};

function isPackShape(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  const pack = value as { version?: number; classes?: unknown; rosters?: unknown };
  return pack.version === 1 && Array.isArray(pack.classes) && !!pack.rosters;
}

/** GET /api/teacher/pack — 读取班级整包
 *  PUT /api/teacher/pack — 写入班级整包
 */
export const onRequestGet = async (context: PagesContext): Promise<Response> => {
  const { request, env } = context;
  if (!env.TEACHER_KV) {
    return json({ error: '服务端未绑定 TEACHER_KV' }, 500);
  }

  const denied = await requireTeacherSession(request, env);
  if (denied) return denied;

  const raw = await env.TEACHER_KV.get(PACK_KEY);
  if (!raw) {
    return json({ pack: null });
  }

  try {
    const pack = JSON.parse(raw) as unknown;
    if (!isPackShape(pack)) {
      return json({ error: '云端数据损坏' }, 500);
    }
    return json({ pack });
  } catch {
    return json({ error: '云端数据无法解析' }, 500);
  }
};

export const onRequestPut = async (context: PagesContext): Promise<Response> => {
  const { request, env } = context;
  if (!env.TEACHER_KV) {
    return json({ error: '服务端未绑定 TEACHER_KV' }, 500);
  }

  const denied = await requireTeacherSession(request, env);
  if (denied) return denied;

  let body: { pack?: unknown };
  try {
    body = (await request.json()) as { pack?: unknown };
  } catch {
    return json({ error: '请求格式错误' }, 400);
  }

  if (!isPackShape(body.pack)) {
    return json({ error: '整包格式无效' }, 400);
  }

  const pack = body.pack as { updatedAt?: string };
  const next = {
    ...pack,
    version: 1 as const,
    updatedAt: new Date().toISOString(),
  };

  const payload = JSON.stringify(next);
  if (payload.length > 900_000) {
    return json({ error: '数据过大，无法写入 KV' }, 413);
  }

  await env.TEACHER_KV.put(PACK_KEY, payload);

  // 续期当前会话，避免长课时中途过期
  const token = bearerToken(request);
  if (token) {
    await env.TEACHER_KV.put(`${SESSION_PREFIX}${token}`, '1', {
      expirationTtl: 12 * 60 * 60,
    });
  }

  return json({ ok: true, updatedAt: next.updatedAt });
};
