import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  loadAttendanceLog,
  loadClasses,
  loadOrCreateSession,
  saveClassRoster,
  setAttendance,
  startNewSession,
  studentMatchesQuery,
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

  it('reuses today session when switching lessons', () => {
    vi.setSystemTime(new Date(2026, 2, 2, 10, 0, 0));
    const classId = loadClasses()[0]!.id;
    const a = loadOrCreateSession(classId, 'lesson01');
    const marked = setAttendance(a, 's1', 'present');
    const b = loadOrCreateSession(classId, 'lesson02');
    expect(b.sessionId).toBe(marked.sessionId);
    expect(b.attendance.s1).toBe('present');
    expect(b.lessonId).toBe('lesson02');
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
