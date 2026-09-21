import { beforeEach, describe, expect, it } from 'vitest';
import {
  exportTeacherPack,
  importTeacherPack,
  loadClasses,
  loadSemester,
  packHasTeachingData,
  saveClassRoster,
  adjustFlowers,
  loadOrCreateSession,
} from '../../src/utils/rosterStorage';

describe('teacher pack export/import', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('round-trips roster and flowers', () => {
    const classes = loadClasses();
    const classId = classes[0]!.id;
    saveClassRoster(classId, [
      { id: 's1', name: '张三', studentNo: '001' },
      { id: 's2', name: '李四', studentNo: '002' },
    ]);
    const session = loadOrCreateSession(classId, 'lesson01');
    adjustFlowers(session, 's1', 2);

    const pack = exportTeacherPack();
    expect(packHasTeachingData(pack)).toBe(true);
    expect(pack.rosters.classes[classId]?.students).toHaveLength(2);
    expect(pack.semesters[classId]?.flowers.s1).toBe(2);
    expect(pack.semesters[classId]?.clovers.s1 ?? 0).toBe(0);

    localStorage.clear();
    importTeacherPack(pack);

    expect(loadClasses().map((c) => c.id)).toContain(classId);
    expect(loadSemester(classId).flowers.s1).toBe(2);
    expect(loadSemester(classId).clovers).toEqual({});
    const again = exportTeacherPack();
    expect(again.rosters.classes[classId]?.students.map((s) => s.name)).toEqual(['张三', '李四']);
  });
});
