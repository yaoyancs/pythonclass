/** 教师登录失败限速（纯函数，便于单测） */

export const MIN_PIN_LENGTH = 8;
export const FAIL_WINDOW_MS = 15 * 60 * 1000;
export const FAIL_THRESHOLD = 20;
export const BASE_LOCK_MS = 15 * 60 * 1000;
export const MAX_LOCK_MS = 60 * 60 * 1000;
export const LOCKOUT_PREFIX = 'pyclass:teacher:lockout:';

export type LockoutRecord = {
  fails: number;
  windowStart: number;
  lockedUntil: number;
  lockMs: number;
};

export function emptyLockout(now: number): LockoutRecord {
  return { fails: 0, windowStart: now, lockedUntil: 0, lockMs: BASE_LOCK_MS };
}

export function parseLockout(raw: string | null, now: number): LockoutRecord {
  if (!raw) return emptyLockout(now);
  try {
    const data = JSON.parse(raw) as Partial<LockoutRecord>;
    return {
      fails: typeof data.fails === 'number' ? data.fails : 0,
      windowStart: typeof data.windowStart === 'number' ? data.windowStart : now,
      lockedUntil: typeof data.lockedUntil === 'number' ? data.lockedUntil : 0,
      lockMs: typeof data.lockMs === 'number' ? data.lockMs : BASE_LOCK_MS,
    };
  } catch {
    return emptyLockout(now);
  }
}

export function isLocked(record: LockoutRecord, now: number): boolean {
  return record.lockedUntil > now;
}

export function retryAfterSec(record: LockoutRecord, now: number): number {
  return Math.max(1, Math.ceil((record.lockedUntil - now) / 1000));
}

export function lockoutMessage(retrySec: number): string {
  const minutes = Math.max(1, Math.ceil(retrySec / 60));
  return `尝试过多，请 ${minutes} 分钟后再试`;
}

/** 滑动 15 分钟窗口内累计失败；达阈值则锁 15 分钟，再犯则冷却加倍至 60 分钟。 */
export function recordFailure(prev: LockoutRecord, now: number): LockoutRecord {
  if (isLocked(prev, now)) return prev;

  let { fails, windowStart, lockMs } = prev;
  if (now - windowStart >= FAIL_WINDOW_MS) {
    fails = 0;
    windowStart = now;
  }

  fails += 1;
  if (fails < FAIL_THRESHOLD) {
    return { fails, windowStart, lockedUntil: 0, lockMs };
  }

  const lockedUntil = now + lockMs;
  const nextLockMs = Math.min(lockMs * 2, MAX_LOCK_MS);
  return { fails: 0, windowStart: now, lockedUntil, lockMs: nextLockMs };
}

export function kvTtlSec(record: LockoutRecord, now: number): number {
  const until = Math.max(record.lockedUntil, record.windowStart + FAIL_WINDOW_MS);
  return Math.max(60, Math.ceil((until - now) / 1000) + 60);
}

export function clientIp(request: Request): string {
  const cf = request.headers.get('CF-Connecting-IP')?.trim();
  if (cf) return cf;
  return '0.0.0.0';
}

export function lockoutKey(ip: string): string {
  return `${LOCKOUT_PREFIX}${ip}`;
}
