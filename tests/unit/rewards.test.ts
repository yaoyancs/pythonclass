import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  adjustClovers,
  adjustFlowers,
  buildSemesterGradeRows,
  canTakeFinalExam,
  equivalentAbsences,
  exportMeetingDetailCsv,
  exportSemesterPerformanceCsv,
  exportTeacherPack,
  importTeacherPack,
  listMeetingEntries,
  loadAttendanceLog,
  loadClasses,
  loadOrCreateSession,
  loadSemester,
  recordPick,
  saveClassRoster,
  scalePerformanceScore,
  setAttendance,
  startNewSession,
} from '../../src/utils/rosterStorage';
import type { SessionLedger } from '../../src/types/roster';

function roster(classId: string) {
  saveClassRoster(classId, [
    { id: 's1', name: '张三', studentNo: '001' },
    { id: 's2', name: '李四', studentNo: '002' },
  ]);
}

describe('flowers vs clovers', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 2, 10, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it('does not mix flowers and clovers; semester uses applied delta', () => {
    const classId = loadClasses()[0]!.id;
    roster(classId);
    const session = loadOrCreateSession(classId, 'lesson01');
    const afterFlower = adjustFlowers(session, 's1', 2);
    expect(afterFlower.session.flowers.s1).toBe(2);
    expect(afterFlower.session.clovers.s1 ?? 0).toBe(0);
    expect(afterFlower.semester.flowers.s1).toBe(2);
    expect(afterFlower.semester.clovers.s1 ?? 0).toBe(0);

    const afterClover = adjustClovers(afterFlower.session, 's1', 3);
    expect(afterClover.session.flowers.s1).toBe(2);
    expect(afterClover.session.clovers.s1).toBe(3);
    expect(afterClover.semester.flowers.s1).toBe(2);
    expect(afterClover.semester.clovers.s1).toBe(3);

    const floored = adjustClovers(afterClover.session, 's1', -100);
    expect(floored.session.clovers.s1).toBe(-50);
    expect(floored.semester.clovers.s1).toBe(-50);
    const again = adjustClovers(floored.session, 's1', -1);
    expect(again.session.clovers.s1).toBe(-50);
    expect(again.semester.clovers.s1).toBe(-50);
  });

  it('loads legacy session JSON without clovers', () => {
    const classId = loadClasses()[0]!.id;
    const date = '2026-03-02';
    const sessionId = `${date}_${classId}`;
    const legacy = {
      sessionId,
      classId,
      date,
      lessonId: 'lesson01',
      attendance: {},
      flowers: { s1: 1 },
      pickHistory: [],
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(`pyclass-session-${sessionId}`, JSON.stringify(legacy));
    localStorage.setItem(`pyclass-active-session-${classId}`, sessionId);

    const loaded = loadOrCreateSession(classId, 'lesson99');
    expect(loaded.sessionId).toBe(sessionId);
    expect(loaded.clovers).toEqual({});
    expect(loaded.flowers.s1).toBe(1);
    expect(loaded.lessonId).toBe('lesson01');

    const next = adjustClovers(loaded as SessionLedger, 's1', 1);
    expect(next.session.clovers.s1).toBe(1);
    expect(next.session.flowers.s1).toBe(1);
    expect(loadSemester(classId).flowers.s1 ?? 0).toBe(0);
    expect(loadSemester(classId).clovers.s1).toBe(1);
  });

  it('does not rewrite lessonId when switching lessons the same day', () => {
    const classId = loadClasses()[0]!.id;
    const a = loadOrCreateSession(classId, 'lesson01');
    const marked = setAttendance(a, 's1', 'present');
    const b = loadOrCreateSession(classId, 'lesson02');
    expect(b.sessionId).toBe(marked.sessionId);
    expect(b.attendance.s1).toBe('present');
    expect(b.lessonId).toBe('lesson01');
  });

  it('does not overwrite yesterday when awarding on a stale session', () => {
    const classId = loadClasses()[0]!.id;
    roster(classId);
    const first = loadOrCreateSession(classId, 'lesson01');
    const withFlower = adjustFlowers(first, 's1', 1);
    const withClover = adjustClovers(withFlower.session, 's1', 1);
    const picked = recordPick(withClover.session, 's1');

    vi.setSystemTime(new Date(2026, 2, 9, 10, 0, 0));
    const nextFlower = adjustFlowers(picked, 's1', 1);
    expect(nextFlower.session.date).toBe('2026-03-09');
    expect(nextFlower.session.sessionId).not.toBe(picked.sessionId);
    expect(nextFlower.session.flowers.s1).toBe(1);

    const log = loadAttendanceLog(classId);
    const old = log.entries.find((e) => e.sessionId === picked.sessionId);
    const neu = log.entries.find((e) => e.sessionId === nextFlower.session.sessionId);
    expect(old?.flowers.s1).toBe(1);
    expect(old?.clovers.s1).toBe(1);
    expect(old?.pickHistory).toContain('s1');
    expect(neu?.flowers.s1).toBe(1);
  });

  it('keeps previous meeting rewards after startNewSession', () => {
    const classId = loadClasses()[0]!.id;
    roster(classId);
    let current = loadOrCreateSession(classId, 'lesson01');
    current = adjustFlowers(current, 's1', 2).session;
    current = adjustClovers(current, 's1', 1).session;
    current = recordPick(current, 's1');
    current = setAttendance(current, 's1', 'present');

    const second = startNewSession(classId, 'lesson01');
    adjustClovers(second, 's2', 1);

    const meetings = listMeetingEntries(classId);
    expect(meetings).toHaveLength(2);
    const old = meetings.find((m) => m.sessionId === current.sessionId);
    expect(old?.flowers.s1).toBe(2);
    expect(old?.clovers.s1).toBe(1);
    expect(old?.attendance.s1).toBe('present');
    expect(old?.pickHistory).toContain('s1');

    const csv = exportMeetingDetailCsv(
      [
        { id: 's1', name: '张三', studentNo: '001' },
        { id: 's2', name: '李四', studentNo: '002' },
      ],
      classId,
    );
    expect(csv).toContain(current.sessionId);
    expect(csv).toContain('是');
  });

  it('round-trips flowers, clovers, sessions and attendance snapshots in teacher pack', () => {
    const classId = loadClasses()[0]!.id;
    roster(classId);
    const session = loadOrCreateSession(classId, 'lesson01');
    adjustFlowers(session, 's1', 2);
    const withClover = adjustClovers(loadOrCreateSession(classId, 'lesson01'), 's2', 4);
    setAttendance(withClover.session, 's1', 'present');

    const pack = exportTeacherPack();
    expect(pack.semesters[classId]?.flowers.s1).toBe(2);
    expect(pack.semesters[classId]?.clovers.s2).toBe(4);
    expect(pack.attendanceLogs[classId]?.entries[0]?.clovers.s2).toBe(4);

    localStorage.clear();
    importTeacherPack(pack);

    expect(loadSemester(classId).flowers.s1).toBe(2);
    expect(loadSemester(classId).clovers.s2).toBe(4);
    expect(loadAttendanceLog(classId).entries[0]?.flowers.s1).toBe(2);
    const again = exportTeacherPack();
    expect(again.semesters[classId]?.clovers.s2).toBe(4);
  });
});

describe('performance scoring', () => {
  it('scales flowers and clovers independently', () => {
    const students = [
      { id: 'a', name: '甲', studentNo: '1' },
      { id: 'b', name: '乙', studentNo: '2' },
    ];
    const semester = {
      classId: 'monday',
      flowers: { b: 2 },
      clovers: { a: 2 },
      updatedAt: 'x',
    };
    const log = {
      classId: 'monday',
      updatedAt: 'x',
      entries: [],
    };
    const rows = buildSemesterGradeRows(students, semester, log);
    const jia = rows.find((r) => r.student.id === 'a')!;
    const yi = rows.find((r) => r.student.id === 'b')!;
    expect(jia.flowersFinal).toBe(0);
    expect(jia.cloversFinal).toBe(5);
    expect(yi.flowersFinal).toBe(5);
    expect(yi.cloversFinal).toBe(0);

    const csv = exportSemesterPerformanceCsv(students, semester, log);
    expect(csv).toContain('提问最终分');
    expect(csv).toContain('课堂互动最终分');
    expect(csv).not.toContain('课堂表现最终分');
    expect(csv).toContain('早退');
  });

  it('does not lower question or interact scores for absences', () => {
    const students = [
      { id: 'a', name: '甲', studentNo: '1' },
      { id: 'b', name: '乙', studentNo: '2' },
    ];
    const semester = {
      classId: 'monday',
      flowers: { b: 2 },
      clovers: { a: 2 },
      updatedAt: 'x',
    };
    const absences = {
      a: 'absent' as const,
      b: 'leave' as const,
    };
    const log = {
      classId: 'monday',
      updatedAt: 'x',
      entries: [1, 2, 3].map((n) => ({
        sessionId: String(n),
        date: `2026-03-0${n}`,
        lessonId: `lesson0${n}`,
        attendance: absences,
        flowers: {},
        clovers: {},
        pickHistory: [],
      })),
    };
    const rows = buildSemesterGradeRows(students, semester, log);
    const jia = rows.find((r) => r.student.id === 'a')!;
    const yi = rows.find((r) => r.student.id === 'b')!;
    expect(jia.absent).toBe(3);
    expect(jia.cloversFinal).toBe(5);
    expect(jia.canTakeFinal).toBe(true);
    expect(yi.leave).toBe(3);
    expect(yi.equivalentAbsences).toBe(0);
    expect(yi.canTakeFinal).toBe(true);
    expect(yi.flowersFinal).toBe(5);
  });

  it('counts three early leaves as one absence for the final exam', () => {
    expect(equivalentAbsences(0, 2)).toBe(0);
    expect(equivalentAbsences(0, 3)).toBe(1);
    expect(equivalentAbsences(5, 3)).toBe(6);
    expect(canTakeFinalExam(5, 2)).toBe(true);
    expect(canTakeFinalExam(5, 3)).toBe(false);
    expect(canTakeFinalExam(6, 0)).toBe(false);
    expect(canTakeFinalExam(0, 0)).toBe(true);

    const students = [{ id: 'c', name: '丙', studentNo: '3' }];
    const semester = { classId: 'monday', flowers: { c: 4 }, clovers: {}, updatedAt: 'x' };
    const log = {
      classId: 'monday',
      updatedAt: 'x',
      entries: Array.from({ length: 6 }, (_, i) => ({
        sessionId: String(i + 1),
        date: `2026-03-${String(i + 2).padStart(2, '0')}`,
        lessonId: 'lesson01',
        attendance: { c: (i < 3 ? 'early_leave' : 'leave') as const },
        flowers: {},
        clovers: {},
        pickHistory: [],
      })),
    };
    const row = buildSemesterGradeRows(students, semester, log)[0]!;
    expect(row.earlyLeave).toBe(3);
    expect(row.leave).toBe(3);
    expect(row.absent).toBe(0);
    expect(row.equivalentAbsences).toBe(1);
    expect(row.canTakeFinal).toBe(true);
    expect(row.flowersFinal).toBe(5);
    expect(row.rate).toBe(0);
  });

  it('blocks the final at six equivalent absences', () => {
    const students = [{ id: 'd', name: '丁', studentNo: '4' }];
    const semester = { classId: 'monday', flowers: {}, clovers: { d: 3 }, updatedAt: 'x' };
    const log = {
      classId: 'monday',
      updatedAt: 'x',
      entries: Array.from({ length: 6 }, (_, i) => ({
        sessionId: String(i + 1),
        date: `2026-03-${String(i + 2).padStart(2, '0')}`,
        lessonId: 'lesson01',
        attendance: { d: 'absent' as const },
        flowers: {},
        clovers: {},
        pickHistory: [],
      })),
    };
    const row = buildSemesterGradeRows(students, semester, log)[0]!;
    expect(row.equivalentAbsences).toBe(6);
    expect(row.canTakeFinal).toBe(false);
    expect(row.cloversFinal).toBe(5);
  });

  it('gives 5 when p90 is 0 but points are positive', () => {
    expect(scalePerformanceScore(1, 0)).toBe(5);
    expect(scalePerformanceScore(0, 0)).toBe(0);
  });
});
