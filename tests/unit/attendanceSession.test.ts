import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  loadAttendanceLog,
  loadClasses,
  loadOrCreateSession,
  loadStoredSession,
  patchAttendanceBySessionId,
  pickPool,
  previousTodaySessionId,
  resumePreviousTodaySession,
  saveClassRoster,
  setAttendance,
  startNewSession,
  studentMatchesQuery,
  buildAttendanceRanking,
  exportAttendanceCsv,
} from '../../src/utils/rosterStorage';

describe('attendance sessions', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it('keeps last class attendance when a new day starts', () => {
    vi.setSystemTime(new Date(2026, 2, 2, 10, 0, 0));
    const classId = loadClasses()[0]!.id;
    saveClassRoster(classId, [
      { id: 's1', name: '张三', studentNo: '2026001' },
      { id: 's2', name: '李四', studentNo: '2026002' },
    ]);

    const first = loadOrCreateSession(classId, 'lesson01');
    setAttendance(first, 's1', 'present');

    vi.setSystemTime(new Date(2026, 2, 9, 10, 0, 0));
    const next = loadOrCreateSession(classId, 'lesson02');
    expect(next.date).toBe('2026-03-09');
    expect(next.sessionId).not.toBe(first.sessionId);
    expect(next.attendance.s1).toBeUndefined();

    setAttendance(next, 's1', 'absent');
    const log = loadAttendanceLog(classId);
    expect(log.entries).toHaveLength(2);
    const old = log.entries.find((e) => e.sessionId === first.sessionId);
    const neu = log.entries.find((e) => e.sessionId === next.sessionId);
    expect(old?.attendance.s1).toBe('present');
    expect(neu?.attendance.s1).toBe('absent');
  });

  it('startNewSession does not overwrite the previous log entry', () => {
    vi.setSystemTime(new Date(2026, 2, 2, 10, 0, 0));
    const classId = loadClasses()[0]!.id;
    saveClassRoster(classId, [{ id: 's1', name: '张三', studentNo: '2026001' }]);

    const first = loadOrCreateSession(classId, 'lesson01');
    setAttendance(first, 's1', 'present');

    const second = startNewSession(classId, 'lesson01');
    expect(second.sessionId).not.toBe(first.sessionId);
    expect(Object.keys(second.attendance)).toHaveLength(0);

    setAttendance(second, 's1', 'leave');
    const log = loadAttendanceLog(classId);
    expect(log.entries).toHaveLength(2);
    expect(log.entries.find((e) => e.sessionId === first.sessionId)?.attendance.s1).toBe('present');
    expect(log.entries.find((e) => e.sessionId === second.sessionId)?.attendance.s1).toBe('leave');
  });

  it('does not overwrite yesterday when marking on a stale in-memory session', () => {
    vi.setSystemTime(new Date(2026, 2, 2, 10, 0, 0));
    const classId = loadClasses()[0]!.id;
    const first = loadOrCreateSession(classId, 'lesson01');
    const marked = setAttendance(first, 's1', 'present');

    vi.setSystemTime(new Date(2026, 2, 9, 10, 0, 0));
    setAttendance(marked, 's1', 'absent');
    const log = loadAttendanceLog(classId);
    expect(log.entries.find((e) => e.sessionId === marked.sessionId)?.attendance.s1).toBe('present');
    expect(log.entries).toHaveLength(2);
    const today = log.entries.find((e) => e.date === '2026-03-09');
    expect(today?.attendance.s1).toBe('absent');
  });

  it('reuses today session when switching lessons and keeps original lessonId', () => {
    vi.setSystemTime(new Date(2026, 2, 2, 10, 0, 0));
    const classId = loadClasses()[0]!.id;
    const a = loadOrCreateSession(classId, 'lesson01');
    const marked = setAttendance(a, 's1', 'present');
    const b = loadOrCreateSession(classId, 'lesson02');
    expect(b.sessionId).toBe(marked.sessionId);
    expect(b.attendance.s1).toBe('present');
    expect(b.lessonId).toBe('lesson01');
  });

  it('patches a past meeting without flipping today or triggering date guard', () => {
    vi.setSystemTime(new Date(2026, 2, 2, 10, 0, 0));
    const classId = loadClasses()[0]!.id;
    saveClassRoster(classId, [{ id: 's1', name: '张三', studentNo: '2026001' }]);
    const first = loadOrCreateSession(classId, 'lesson01');
    setAttendance(first, 's1', 'present');

    vi.setSystemTime(new Date(2026, 2, 9, 10, 0, 0));
    const today = loadOrCreateSession(classId, 'lesson02');
    setAttendance(today, 's1', 'absent');

    const log = patchAttendanceBySessionId(classId, first.sessionId, 's1', 'leave');
    expect(log.entries.find((e) => e.sessionId === first.sessionId)?.attendance.s1).toBe('leave');
    expect(loadStoredSession(first.sessionId)?.attendance.s1).toBe('leave');

    const live = loadOrCreateSession(classId, 'lesson02');
    expect(live.sessionId).toBe(today.sessionId);
    expect(live.date).toBe('2026-03-09');
    expect(live.attendance.s1).toBe('absent');
    expect(log.entries.find((e) => e.sessionId === today.sessionId)?.attendance.s1).toBe('absent');
  });

  it('resumePreviousTodaySession points active back to the earlier meeting', () => {
    vi.setSystemTime(new Date(2026, 2, 2, 10, 0, 0));
    const classId = loadClasses()[0]!.id;
    saveClassRoster(classId, [{ id: 's1', name: '张三', studentNo: '2026001' }]);
    const first = loadOrCreateSession(classId, 'lesson01');
    setAttendance(first, 's1', 'present');
    const second = startNewSession(classId, 'lesson01');
    expect(previousTodaySessionId(classId, second.sessionId)).toBe(first.sessionId);

    const resumed = resumePreviousTodaySession(classId, second.sessionId);
    expect(resumed?.sessionId).toBe(first.sessionId);
    const live = loadOrCreateSession(classId, 'lesson99');
    expect(live.sessionId).toBe(first.sessionId);
    const marked = setAttendance(live, 's1', 'leave');
    expect(marked.sessionId).toBe(first.sessionId);
    expect(loadAttendanceLog(classId).entries.find((e) => e.sessionId === first.sessionId)?.attendance.s1).toBe(
      'leave',
    );
  });
});

describe('studentMatchesQuery', () => {
  const student = { id: 'stu-9', name: '王小明', studentNo: '20260123' };

  it('matches name or student number', () => {
    expect(studentMatchesQuery(student, '小明')).toBe(true);
    expect(studentMatchesQuery(student, '0123')).toBe(true);
    expect(studentMatchesQuery(student, ' 20260123 ')).toBe(true);
    expect(studentMatchesQuery(student, '李四')).toBe(false);
  });
});

describe('early leave', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 2, 10, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it('counts in rate denominator and stays out of the pick pool', () => {
    const classId = loadClasses()[0]!.id;
    const students = [
      { id: 's1', name: '张三', studentNo: '1' },
      { id: 's2', name: '李四', studentNo: '2' },
    ];
    saveClassRoster(classId, students);
    let session = loadOrCreateSession(classId, 'lesson01');
    session = setAttendance(session, 's1', 'present');
    session = setAttendance(session, 's2', 'early_leave');

    const row = buildAttendanceRanking(students, loadAttendanceLog(classId)).find(
      (r) => r.student.id === 's2',
    )!;
    expect(row.earlyLeave).toBe(1);
    expect(row.present).toBe(0);
    expect(row.unknown).toBe(0);
    expect(row.rate).toBe(0);

    const presentRow = buildAttendanceRanking(students, loadAttendanceLog(classId)).find(
      (r) => r.student.id === 's1',
    )!;
    expect(presentRow.rate).toBe(1);

    const mixedLog = {
      classId,
      updatedAt: 'x',
      entries: [
        {
          sessionId: 'a',
          date: '2026-03-02',
          lessonId: 'lesson01',
          attendance: { s1: 'present' as const, s2: 'early_leave' as const },
          flowers: {},
          clovers: {},
          pickHistory: [],
        },
        {
          sessionId: 'b',
          date: '2026-03-09',
          lessonId: 'lesson02',
          attendance: { s1: 'early_leave' as const, s2: 'present' as const },
          flowers: {},
          clovers: {},
          pickHistory: [],
        },
      ],
    };
    const mixed = buildAttendanceRanking(students, mixedLog).find((r) => r.student.id === 's1')!;
    expect(mixed.present).toBe(1);
    expect(mixed.earlyLeave).toBe(1);
    expect(mixed.rate).toBe(0.5);

    expect(pickPool(students, session).map((s) => s.id)).toEqual(['s1']);

    const csv = exportAttendanceCsv(students, loadAttendanceLog(classId));
    expect(csv).toContain('早退');
    expect(csv).toContain('折算缺勤');
    expect(csv).toContain('可否期末');
  });
});
