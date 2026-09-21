import {
  json,
  randomToken,
  SESSION_PREFIX,
  SESSION_TTL_SEC,
  timingSafeEqual,
  type TeacherEnv,
} from './_shared';
import {
  clientIp,
  isLocked,
  kvTtlSec,
  lockoutKey,
  lockoutMessage,
  MIN_PIN_LENGTH,
  parseLockout,
  recordFailure,
  retryAfterSec,
} from './lockout';

type PagesContext = {
  request: Request;
  env: TeacherEnv;
};

function lockedResponse(retrySec: number): Response {
  return json({ error: lockoutMessage(retrySec), retryAfter: retrySec }, 429, {
    'retry-after': String(retrySec),
  });
}

/** POST /api/teacher/session  { pin } → { token, expiresIn }
 *  DELETE /api/teacher/session  Authorization: Bearer … → 注销
 */
export const onRequestPost = async (context: PagesContext): Promise<Response> => {
  const { request, env } = context;
  if (!env.TEACHER_PIN) {
    return json({ error: '服务端未配置 TEACHER_PIN' }, 500);
  }
  if (env.TEACHER_PIN.trim().length < MIN_PIN_LENGTH) {
    return json({ error: `服务端 TEACHER_PIN 至少 ${MIN_PIN_LENGTH} 位，请用 Secret 重设` }, 500);
  }
  if (!env.TEACHER_KV) {
    return json({ error: '服务端未绑定 TEACHER_KV' }, 500);
  }

  let body: { pin?: string };
  try {
    body = (await request.json()) as { pin?: string };
  } catch {
    return json({ error: '请求格式错误' }, 400);
  }

  const pin = typeof body.pin === 'string' ? body.pin.trim() : '';
  if (!pin) {
    return json({ error: '请输入 PIN' }, 400);
  }

  const now = Date.now();
  const ip = clientIp(request);
  const key = lockoutKey(ip);
  const record = parseLockout(await env.TEACHER_KV.get(key), now);
  if (isLocked(record, now)) {
    return lockedResponse(retryAfterSec(record, now));
  }

  if (!timingSafeEqual(pin, env.TEACHER_PIN.trim())) {
    const next = recordFailure(record, now);
    await env.TEACHER_KV.put(key, JSON.stringify(next), { expirationTtl: kvTtlSec(next, now) });
    if (isLocked(next, now)) {
      return lockedResponse(retryAfterSec(next, now));
    }
    return json({ error: 'PIN 不正确' }, 401);
  }

  await env.TEACHER_KV.delete(key);

  const token = randomToken();
  await env.TEACHER_KV.put(`${SESSION_PREFIX}${token}`, '1', {
    expirationTtl: SESSION_TTL_SEC,
  });

  return json({ token, expiresIn: SESSION_TTL_SEC });
};

export const onRequestDelete = async (context: PagesContext): Promise<Response> => {
  const { request, env } = context;
  if (!env.TEACHER_KV) {
    return json({ error: '服务端未绑定 TEACHER_KV' }, 500);
  }

  const header = request.headers.get('authorization') || '';
  const m = /^Bearer\s+(.+)$/i.exec(header.trim());
  const token = m?.[1]?.trim();
  if (token) {
    await env.TEACHER_KV.delete(`${SESSION_PREFIX}${token}`);
  }
  return json({ ok: true });
};
