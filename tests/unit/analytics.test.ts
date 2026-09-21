import { describe, expect, it } from 'vitest';
import {
  DWELL_MIN_SECONDS,
  allowRate,
  buildSummary,
  classifyDevice,
  parseIncomingHit,
  shanghaiDate,
  shanghaiDayUtcRange,
  uniqueSessionCount,
  type StoredHit,
} from '../../functions/api/analytics/_logic';
import { track } from '../../src/analytics/client';

function hit(partial: Partial<StoredHit> & Pick<StoredHit, 'sessionId' | 'type' | 'ts'>): StoredHit {
  return {
    path: '/',
    referrer: null,
    lessonId: null,
    sceneIndex: null,
    sceneId: null,
    partId: null,
    dwellSeconds: null,
    ip: '1.1.1.1',
    device: 'desktop',
    teacher: false,
    source: 'other',
    ...partial,
  };
}

describe('analytics payload', () => {
  it('rejects unknown type and short sessionId', () => {
    const badType = parseIncomingHit({ type: 'click', sessionId: 'abcdefgh' }, { ip: '1', device: 'desktop' });
    expect(badType.ok).toBe(false);
    if (!badType.ok) expect(badType.drop).toBe(false);

    const badSid = parseIncomingHit({ type: 'session_start', sessionId: 'short' }, { ip: '1', device: 'desktop' });
    expect(badSid.ok).toBe(false);
  });

  it('drops dwell below 10 seconds', () => {
    const dropped = parseIncomingHit(
      {
        type: 'scene_dwell',
        sessionId: 'abcdefghij',
        lessonId: 'lesson01',
        sceneIndex: 0,
        seconds: 2,
      },
      { ip: '1', device: 'desktop' },
    );
    expect(dropped.ok).toBe(false);
    if (!dropped.ok) expect(dropped.drop).toBe(true);

    const kept = parseIncomingHit(
      {
        type: 'scene_dwell',
        sessionId: 'abcdefghij',
        lessonId: 'lesson01',
        sceneIndex: 0,
        seconds: DWELL_MIN_SECONDS,
      },
      { ip: '1', device: 'desktop' },
    );
    expect(kept.ok).toBe(true);
  });

  it('accepts session_start and clips referrer', () => {
    const parsed = parseIncomingHit(
      {
        type: 'session_start',
        sessionId: 'abcdefghij',
        path: '/',
        referrer: 'https://example.com/' + 'x'.repeat(500),
      },
      { ip: '203.0.113.9', device: 'mobile' },
    );
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.hit.referrer?.length).toBeLessThanOrEqual(200);
      expect(parsed.hit.ip).toBe('203.0.113.9');
    }
  });
});

describe('analytics summary', () => {
  it('counts one UV for the same session on a Shanghai day', () => {
    const { startIso } = shanghaiDayUtcRange(shanghaiDate(new Date()));
    const ts = new Date(new Date(startIso).getTime() + 8 * 3600 * 1000).toISOString();
    const sid = 'sessionAAA111';
    const hits: StoredHit[] = [
      hit({ type: 'session_start', sessionId: sid, ts, referrer: 'https://weixin.qq.com' }),
      hit({ type: 'lesson_view', sessionId: sid, ts, lessonId: 'lesson01' }),
      hit({ type: 'scene_view', sessionId: sid, ts, lessonId: 'lesson01', sceneIndex: 0 }),
    ];
    expect(uniqueSessionCount(hits)).toBe(1);
    const summary = buildSummary(shanghaiDate(new Date()), hits);
    expect(summary.uv).toBe(1);
    expect(summary.pv).toBe(3);
    expect(summary.studentUv).toBe(1);
    expect(summary.teacherUv).toBe(0);
    expect(summary.homeworkOpens).toBe(0);
    expect(summary.recent.length).toBeLessThanOrEqual(50);
  });

  it('excludes teacher sessions from student UV and counts homework opens', () => {
    const { startIso } = shanghaiDayUtcRange(shanghaiDate(new Date()));
    const ts = new Date(new Date(startIso).getTime() + 8 * 3600 * 1000).toISOString();
    const hits: StoredHit[] = [
      hit({ type: 'session_start', sessionId: 'teach000001', ts, teacher: true }),
      hit({ type: 'homework_open', sessionId: 'teach000001', ts, lessonId: 'lesson02', teacher: true, source: 'homework' }),
      hit({ type: 'session_start', sessionId: 'stud0000001', ts }),
      hit({
        type: 'homework_open',
        sessionId: 'stud0000001',
        ts,
        lessonId: 'lesson02',
        source: 'homework',
      }),
    ];
    const summary = buildSummary(shanghaiDate(new Date()), hits, true);
    expect(summary.teacherUv).toBe(1);
    expect(summary.studentUv).toBe(1);
    expect(summary.uv).toBe(1);
    expect(summary.homeworkOpens).toBe(1);
    expect(summary.emptyStudents).toBe(false);

    const all = buildSummary(shanghaiDate(new Date()), hits, false);
    expect(all.uv).toBe(2);
    expect(all.homeworkOpens).toBe(2);
  });
});

describe('device and rate limit', () => {
  it('classifies mobile from UA', () => {
    expect(classifyDevice('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', null)).toBe('mobile');
    expect(classifyDevice('Mozilla/5.0', '?1')).toBe('mobile');
    expect(classifyDevice('Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '?0')).toBe('desktop');
  });

  it('rate-limits after the window fills', () => {
    let times: number[] = [];
    const now = 1_000_000;
    for (let i = 0; i < 60; i++) {
      const r = allowRate(times, now + i);
      expect(r.ok).toBe(true);
      times = r.next;
    }
    expect(allowRate(times, now + 61).ok).toBe(false);
  });
});

describe('track is non-blocking', () => {
  it('returns undefined immediately', () => {
    const result = track({ type: 'session_start', path: '/' });
    expect(result).toBeUndefined();
  });
});

describe('analytics D1 reads', () => {
  it('loads hits without calling exec', async () => {
    const { loadHitsInRange } = await import('../../functions/api/analytics/_db');
    let execCalls = 0;
    const db = {
      exec: async () => {
        execCalls += 1;
        throw new Error('exec cannot run multiple statements');
      },
      prepare: (sql: string) => ({
        bind: (..._values: unknown[]) => ({
          run: async () => ({}),
          all: async () => {
            if (sql.includes('SELECT')) {
              return {
                results: [
                  {
                    ts: '2026-09-21T01:00:00.000Z',
                    type: 'session_start',
                    session_id: 'abcdefghij',
                    path: '/',
                    referrer: null,
                    lesson_id: null,
                    scene_index: null,
                    scene_id: null,
                    part_id: null,
                    dwell_seconds: null,
                    ip: '1.1.1.1',
                    device: 'desktop',
                    teacher: 0,
                    source: null,
                  },
                ],
              };
            }
            return { results: [] };
          },
        }),
        run: async () => ({}),
        all: async () => ({ results: [] }),
      }),
    };
    const hits = await loadHitsInRange(db, '2026-09-20T16:00:00.000Z', '2026-09-21T16:00:00.000Z');
    expect(execCalls).toBe(0);
    expect(hits).toHaveLength(1);
    expect(hits[0]?.sessionId).toBe('abcdefghij');
  });
});
