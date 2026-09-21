import type { Plugin } from 'vite';
import { randomBytes, timingSafeEqual as nodeTimingSafeEqual } from 'node:crypto';
import {
  isLocked,
  lockoutMessage,
  MIN_PIN_LENGTH,
  parseLockout,
  recordFailure,
  retryAfterSec,
} from './functions/api/teacher/lockout';
import {
  allowRate,
  buildLessonHeat,
  buildSummary,
  classifyDevice,
  isValidDateYmd,
  parseIncomingHit,
  shanghaiDate,
  shanghaiDayUtcRange,
  type IncomingHit,
  type StoredHit,
} from './functions/api/analytics/_logic';

type Pack = Record<string, unknown> | null;

function json(res: import('http').ServerResponse, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(data));
}

function readBody(req: import('http').IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return nodeTimingSafeEqual(ba, bb);
}

/** 仅本地默认，生产必须用 Cloudflare Secret 另设 ≥8 位 PIN */
const LOCAL_DEV_PIN = '24681357';

function resolveLocalPin(): string {
  const fromEnv = process.env.TEACHER_PIN?.trim() ?? '';
  if (fromEnv.length >= MIN_PIN_LENGTH) return fromEnv;
  if (fromEnv.length > 0) {
    console.warn(
      `[teacher-api-mock] 忽略过短的 TEACHER_PIN（${fromEnv.length} 位，需要 ≥${MIN_PIN_LENGTH}），改用本地默认 PIN`,
    );
  }
  return LOCAL_DEV_PIN;
}

/**
 * 本地开发：模拟 /api/teacher/* 与 /api/analytics/*（内存）
 * PIN 来自环境变量 TEACHER_PIN；过短或未设则用 24681357
 */
export function teacherApiMockPlugin(): Plugin {
  const tokens = new Set<string>();
  const lockouts = new Map<string, string>();
  let pack: Pack = null;
  const hits: StoredHit[] = [];
  const analyticsRate = new Map<string, number[]>();

  return {
    name: 'teacher-api-mock',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const full = req.url ?? '';
        const url = full.split('?')[0] ?? '';
        const query = new URLSearchParams(full.split('?')[1] ?? '');

        if (url.startsWith('/api/analytics/')) {
          try {
            if (url === '/api/analytics/hit' && req.method === 'POST') {
              const ip = req.socket.remoteAddress || 'local';
              const gated = allowRate(analyticsRate.get(ip) ?? [], Date.now());
              analyticsRate.set(ip, gated.next);
              if (!gated.ok) {
                return json(res, 429, { error: '请求过于频繁' });
              }
              const raw = await readBody(req);
              const body = JSON.parse(raw || '{}') as IncomingHit;
              const ua = String(req.headers['user-agent'] || '');
              const ch = String(req.headers['sec-ch-ua-mobile'] || '');
              const parsed = parseIncomingHit(body, { ip, device: classifyDevice(ua, ch) });
              if (!parsed.ok) {
                if (parsed.drop) {
                  res.statusCode = 204;
                  res.end();
                  return;
                }
                return json(res, 400, { error: parsed.error });
              }
              hits.push(parsed.hit);
              res.statusCode = 204;
              res.end();
              return;
            }

            const auth = req.headers.authorization || '';
            const m = /^Bearer\s+(.+)$/i.exec(auth.trim());
            const token = m?.[1]?.trim();
            if (!token || !tokens.has(token)) {
              return json(res, 401, { error: '未登录教师台' });
            }

            const dateParam = query.get('date')?.trim() || shanghaiDate(new Date());
            if (!isValidDateYmd(dateParam)) {
              return json(res, 400, { error: '日期格式无效' });
            }
            const { startIso, endIso } = shanghaiDayUtcRange(dateParam);
            const dayHits = hits.filter((h) => h.ts >= startIso && h.ts < endIso);
            const excludeTeacher = query.get('includeTeacher') !== '1';

            if (url === '/api/analytics/summary' && req.method === 'GET') {
              return json(res, 200, buildSummary(dateParam, dayHits, excludeTeacher));
            }
            if (url === '/api/analytics/lessons' && req.method === 'GET') {
              return json(res, 200, { date: dateParam, lessons: buildLessonHeat(dayHits, excludeTeacher) });
            }
            return json(res, 404, { error: 'Not found' });
          } catch (err) {
            const message = err instanceof Error ? err.message : 'mock api error';
            return json(res, 500, { error: message });
          }
        }

        if (!url.startsWith('/api/teacher/')) return next();

        try {
          if (url === '/api/teacher/session' && req.method === 'POST') {
            const pin = resolveLocalPin();
            const raw = await readBody(req);
            const body = JSON.parse(raw || '{}') as { pin?: string };
            const got = typeof body.pin === 'string' ? body.pin.trim() : '';
            if (!got) {
              return json(res, 400, { error: '请输入 PIN' });
            }
            const now = Date.now();
            const ip = req.socket.remoteAddress || 'local';
            const record = parseLockout(lockouts.get(ip) ?? null, now);
            if (isLocked(record, now)) {
              const retrySec = retryAfterSec(record, now);
              return json(res, 429, { error: lockoutMessage(retrySec), retryAfter: retrySec });
            }
            if (!safeEqual(got, pin)) {
              const next = recordFailure(record, now);
              lockouts.set(ip, JSON.stringify(next));
              if (isLocked(next, now)) {
                const retrySec = retryAfterSec(next, now);
                return json(res, 429, { error: lockoutMessage(retrySec), retryAfter: retrySec });
              }
              return json(res, 401, { error: 'PIN 不正确' });
            }
            lockouts.delete(ip);
            const token = randomBytes(24).toString('hex');
            tokens.add(token);
            return json(res, 200, { token, expiresIn: 12 * 60 * 60 });
          }

          if (url === '/api/teacher/session' && req.method === 'DELETE') {
            const auth = req.headers.authorization || '';
            const m = /^Bearer\s+(.+)$/i.exec(auth.trim());
            if (m?.[1]) tokens.delete(m[1].trim());
            return json(res, 200, { ok: true });
          }

          if (url === '/api/teacher/pack') {
            const auth = req.headers.authorization || '';
            const m = /^Bearer\s+(.+)$/i.exec(auth.trim());
            const token = m?.[1]?.trim();
            if (!token || !tokens.has(token)) {
              return json(res, 401, { error: '未登录教师台' });
            }

            if (req.method === 'GET') {
              return json(res, 200, { pack });
            }

            if (req.method === 'PUT') {
              const raw = await readBody(req);
              const body = JSON.parse(raw || '{}') as { pack?: Pack };
              if (!body.pack || typeof body.pack !== 'object' || (body.pack as { version?: number }).version !== 1) {
                return json(res, 400, { error: '整包格式无效' });
              }
              const updatedAt = new Date().toISOString();
              pack = { ...body.pack, version: 1, updatedAt };
              return json(res, 200, { ok: true, updatedAt });
            }
          }

          return json(res, 404, { error: 'Not found' });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'mock api error';
          return json(res, 500, { error: message });
        }
      });
    },
  };
}
