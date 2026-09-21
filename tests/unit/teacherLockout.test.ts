import { describe, expect, it } from 'vitest';
import {
  BASE_LOCK_MS,
  emptyLockout,
  FAIL_THRESHOLD,
  FAIL_WINDOW_MS,
  isLocked,
  MAX_LOCK_MS,
  recordFailure,
  retryAfterSec,
} from '../../functions/api/teacher/lockout';

describe('teacher login lockout', () => {
  it('locks after threshold failures in the window', () => {
    const now = 1_000_000;
    let rec = emptyLockout(now);
    for (let i = 0; i < FAIL_THRESHOLD - 1; i++) {
      rec = recordFailure(rec, now + i);
      expect(isLocked(rec, now + i)).toBe(false);
    }
    rec = recordFailure(rec, now + FAIL_THRESHOLD);
    expect(isLocked(rec, now + FAIL_THRESHOLD)).toBe(true);
    expect(retryAfterSec(rec, now + FAIL_THRESHOLD)).toBe(Math.ceil(BASE_LOCK_MS / 1000));
  });

  it('resets fails after the window if not locked', () => {
    const now = 1_000_000;
    let rec = emptyLockout(now);
    rec = recordFailure(rec, now);
    rec = recordFailure(rec, now + FAIL_WINDOW_MS);
    expect(rec.fails).toBe(1);
    expect(isLocked(rec, now + FAIL_WINDOW_MS)).toBe(false);
  });

  it('doubles lock duration up to the cap', () => {
    const now = 1_000_000;
    let rec = emptyLockout(now);
    for (let i = 0; i < FAIL_THRESHOLD; i++) rec = recordFailure(rec, now);
    expect(rec.lockMs).toBe(BASE_LOCK_MS * 2);

    const later = rec.lockedUntil + 1;
    rec = { ...rec, lockedUntil: 0 };
    for (let i = 0; i < FAIL_THRESHOLD; i++) rec = recordFailure(rec, later);
    expect(rec.lockMs).toBe(BASE_LOCK_MS * 4);

    rec.lockMs = MAX_LOCK_MS;
    rec.lockedUntil = 0;
    rec.fails = 0;
    rec.windowStart = later + 1;
    for (let i = 0; i < FAIL_THRESHOLD; i++) rec = recordFailure(rec, later + 1);
    expect(rec.lockMs).toBe(MAX_LOCK_MS);
  });
});
