import { createClassId, type ClassId, type TeachingClass } from '../data/classes';
import type {
  AttendanceLog,
  AttendanceLogEntry,
  AttendanceRankRow,
  AttendanceStatus,
  ClassRoster,
  MultiRosterStore,
  SemesterLedger,
  SessionLedger,
  Student,
} from '../types/roster';

const REGISTRY_KEY = 'pyclass-class-registry-v1';
const ROSTERS_KEY = 'pyclass-rosters-v2';
const ACTIVE_CLASS_KEY = 'pyclass-active-class';
const LEGACY_ROSTER_KEY = 'pyclass-roster';
const LEGACY_SEMESTER_KEY = 'pyclass-semester-flowers';

function emptyClassRoster(): ClassRoster {
  return { students: [], updatedAt: '', source: undefined };
}

function emptyStore(): MultiRosterStore {
  return { classes: {}, updatedAt: '' };
}

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function makeSessionId(classId: ClassId, lessonId: string, date = todayIso()): string {
  return `${date}_${lessonId}_${classId}`;
}

function sessionStorageKey(sessionId: string): string {
  return `pyclass-session-${sessionId}`;
}

function semesterKey(classId: ClassId): string {
  return `pyclass-semester-flowers-${classId}`;
}

function attendanceLogKey(classId: ClassId): string {
  return `pyclass-attendance-log-${classId}`;
}

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota
  }
}

function defaultClasses(): TeachingClass[] {
  const now = new Date().toISOString();
  return [
    { id: 'monday', name: '大数据1班', note: '周一', createdAt: now },
    { id: 'tuesday', name: '大数据2班', note: '周二', createdAt: now },
  ];
}

/** 首次或旧数据：建立班级列表，并迁移单名单到大数据1班 */
function ensureRegistry(): TeachingClass[] {
  const existing = readJson<TeachingClass[]>(REGISTRY_KEY);
  if (existing?.length) return existing;

  const rosterStore = readJson<MultiRosterStore>(ROSTERS_KEY);
  const classes = defaultClasses();

  // 若已有 monday/tuesday 名单数据，保留 id；否则也创建默认两个班方便上手
  if (rosterStore?.classes) {
    const ids = Object.keys(rosterStore.classes);
    if (ids.length && !ids.includes('monday') && !ids.includes('tuesday')) {
      // 已有其他 id，按名单键生成班级
      const fromRosters: TeachingClass[] = ids.map((id, i) => ({
        id,
        name: `教学班${i + 1}`,
        createdAt: new Date().toISOString(),
      }));
      writeJson(REGISTRY_KEY, fromRosters);
      return fromRosters;
    }
  }

  writeJson(REGISTRY_KEY, classes);

  // 迁移最旧版单名单
  const legacy = readJson<{ students: Student[]; updatedAt: string }>(LEGACY_ROSTER_KEY);
  if (legacy?.students?.length) {
    const store = loadRostersRaw();
    if (!(store.classes.monday?.students.length)) {
      store.classes.monday = {
        students: legacy.students,
        updatedAt: legacy.updatedAt || new Date().toISOString(),
        source: 'local',
      };
      store.updatedAt = new Date().toISOString();
      writeJson(ROSTERS_KEY, store);
    }
    const legacySem = readJson<{ flowers: Record<string, number>; updatedAt: string }>(
      LEGACY_SEMESTER_KEY,
    );
    if (legacySem?.flowers && !readJson(semesterKey('monday'))) {
      writeJson(semesterKey('monday'), {
        classId: 'monday',
        flowers: legacySem.flowers,
        updatedAt: legacySem.updatedAt || new Date().toISOString(),
      });
    }
  }

  return classes;
}

function loadRostersRaw(): MultiRosterStore {
  return readJson<MultiRosterStore>(ROSTERS_KEY) ?? emptyStore();
}

export function loadClasses(): TeachingClass[] {
  return ensureRegistry();
}

export function getClassMeta(id: ClassId): TeachingClass | undefined {
  return loadClasses().find((c) => c.id === id);
}

export function getClassLabel(id: ClassId): string {
  return getClassMeta(id)?.name ?? id;
}

export function saveClasses(list: TeachingClass[]): void {
  writeJson(REGISTRY_KEY, list);
}

export function addClass(name: string, note?: string): TeachingClass {
  const trimmed = name.trim();
  if (!trimmed) throw new Error('班级名称不能为空');
  const list = loadClasses();
  if (list.some((c) => c.name === trimmed)) {
    throw new Error('已存在同名班级');
  }
  const created: TeachingClass = {
    id: createClassId(),
    name: trimmed,
    ...(note?.trim() ? { note: note.trim() } : {}),
    createdAt: new Date().toISOString(),
  };
  saveClasses([...list, created]);
  // 预建空名单
  const store = loadRosters();
  store.classes[created.id] = emptyClassRoster();
  store.updatedAt = new Date().toISOString();
  writeJson(ROSTERS_KEY, store);
  return created;
}

export function renameClass(classId: ClassId, name: string, note?: string): TeachingClass {
  const trimmed = name.trim();
  if (!trimmed) throw new Error('班级名称不能为空');
  const list = loadClasses();
  if (list.some((c) => c.id !== classId && c.name === trimmed)) {
    throw new Error('已存在同名班级');
  }
  const next = list.map((c) =>
    c.id === classId
      ? {
          ...c,
          name: trimmed,
          note: note?.trim() ? note.trim() : undefined,
        }
      : c,
  );
  saveClasses(next);
  const found = next.find((c) => c.id === classId);
  if (!found) throw new Error('班级不存在');
  return found;
}

/** 删除班级，并同步清除名单、考勤档案、学期小红花、本堂会话 */
export function deleteClass(classId: ClassId): ClassId | null {
  const list = loadClasses().filter((c) => c.id !== classId);
  saveClasses(list);

  const store = loadRosters();
  const rest = { ...store.classes };
  delete rest[classId];
  writeJson(ROSTERS_KEY, { classes: rest, updatedAt: new Date().toISOString() });

  localStorage.removeItem(semesterKey(classId));
  localStorage.removeItem(attendanceLogKey(classId));

  const suffix = `_${classId}`;
  const toRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith('pyclass-session-')) continue;
    if (key.endsWith(suffix) || key.includes(`_${classId}`)) {
      // session key = pyclass-session-${date}_${lessonId}_${classId}
      const sessionId = key.slice('pyclass-session-'.length);
      if (sessionId.endsWith(`_${classId}`)) toRemove.push(key);
    }
  }
  for (const key of toRemove) localStorage.removeItem(key);

  const active = localStorage.getItem(ACTIVE_CLASS_KEY);
  if (active === classId) {
    const nextId = list[0]?.id ?? '';
    if (nextId) localStorage.setItem(ACTIVE_CLASS_KEY, nextId);
    else localStorage.removeItem(ACTIVE_CLASS_KEY);
    return nextId || null;
  }
  return active && list.some((c) => c.id === active) ? active : list[0]?.id ?? null;
}

export function loadRosters(): MultiRosterStore {
  ensureRegistry();
  const base = loadRostersRaw();
  return {
    updatedAt: base.updatedAt ?? '',
    classes: { ...(base.classes ?? {}) },
  };
}

export function saveClassRoster(
  classId: ClassId,
  students: Student[],
  source: 'local' | 'static' = 'local',
): MultiRosterStore {
  const store = loadRosters();
  const next: MultiRosterStore = {
    classes: {
      ...store.classes,
      [classId]: {
        students,
        updatedAt: new Date().toISOString(),
        source,
      },
    },
    updatedAt: new Date().toISOString(),
  };
  writeJson(ROSTERS_KEY, next);
  return next;
}

export function getClassStudents(classId: ClassId): Student[] {
  if (!classId) return [];
  return loadRosters().classes[classId]?.students ?? [];
}

export function loadActiveClassId(fallback?: ClassId): ClassId {
  const list = loadClasses();
  const raw = localStorage.getItem(ACTIVE_CLASS_KEY);
  if (raw && list.some((c) => c.id === raw)) return raw;
  if (fallback && list.some((c) => c.id === fallback)) return fallback;
  return list[0]?.id ?? '';
}

export function saveActiveClassId(classId: ClassId): void {
  if (!classId) {
    localStorage.removeItem(ACTIVE_CLASS_KEY);
    return;
  }
  localStorage.setItem(ACTIVE_CLASS_KEY, classId);
}

export function loadSemester(classId: ClassId): SemesterLedger {
  if (!classId) return { classId: '', flowers: {}, updatedAt: '' };
  return (
    readJson<SemesterLedger>(semesterKey(classId)) ?? {
      classId,
      flowers: {},
      updatedAt: '',
    }
  );
}

function saveSemester(ledger: SemesterLedger): void {
  if (!ledger.classId) return;
  writeJson(semesterKey(ledger.classId), {
    ...ledger,
    updatedAt: new Date().toISOString(),
  });
}

function emptySession(classId: ClassId, lessonId: string, date: string): SessionLedger {
  return {
    sessionId: makeSessionId(classId, lessonId, date),
    classId,
    date,
    lessonId,
    attendance: {},
    flowers: {},
    pickHistory: [],
    updatedAt: new Date().toISOString(),
  };
}

export function loadOrCreateSession(classId: ClassId, lessonId: string): SessionLedger {
  if (!classId) {
    return emptySession('', lessonId, todayIso());
  }
  const date = todayIso();
  const id = makeSessionId(classId, lessonId, date);
  const existing = readJson<SessionLedger>(sessionStorageKey(id));
  if (existing && existing.sessionId === id) return existing;
  const created = emptySession(classId, lessonId, date);
  writeJson(sessionStorageKey(id), created);
  return created;
}

export function saveSession(session: SessionLedger): void {
  if (!session.classId) return;
  writeJson(sessionStorageKey(session.sessionId), {
    ...session,
    updatedAt: new Date().toISOString(),
  });
}

export function loadAttendanceLog(classId: ClassId): AttendanceLog {
  if (!classId) return { classId: '', entries: [], updatedAt: '' };
  return (
    readJson<AttendanceLog>(attendanceLogKey(classId)) ?? {
      classId,
      entries: [],
      updatedAt: '',
    }
  );
}

export function upsertAttendanceLog(session: SessionLedger): AttendanceLog {
  if (!session.classId) return { classId: '', entries: [], updatedAt: '' };
  const log = loadAttendanceLog(session.classId);
  const entry: AttendanceLogEntry = {
    sessionId: session.sessionId,
    date: session.date,
    lessonId: session.lessonId,
    attendance: { ...session.attendance },
  };
  const idx = log.entries.findIndex((e) => e.sessionId === session.sessionId);
  const entries = [...log.entries];
  if (idx >= 0) entries[idx] = entry;
  else entries.push(entry);
  entries.sort((a, b) => a.date.localeCompare(b.date) || a.sessionId.localeCompare(b.sessionId));
  const next: AttendanceLog = {
    classId: session.classId,
    entries,
    updatedAt: new Date().toISOString(),
  };
  writeJson(attendanceLogKey(session.classId), next);
  return next;
}

export function setAttendance(
  session: SessionLedger,
  studentId: string,
  status: AttendanceStatus,
): SessionLedger {
  const next: SessionLedger = {
    ...session,
    attendance: { ...session.attendance, [studentId]: status },
    updatedAt: new Date().toISOString(),
  };
  saveSession(next);
  upsertAttendanceLog(next);
  return next;
}

export function setAllAttendance(
  session: SessionLedger,
  studentIds: string[],
  status: AttendanceStatus,
): SessionLedger {
  const attendance = { ...session.attendance };
  for (const id of studentIds) attendance[id] = status;
  const next: SessionLedger = {
    ...session,
    attendance,
    updatedAt: new Date().toISOString(),
  };
  saveSession(next);
  upsertAttendanceLog(next);
  return next;
}

export function buildAttendanceRanking(
  students: Student[],
  log: AttendanceLog,
): AttendanceRankRow[] {
  return students
    .map((student) => {
      let present = 0;
      let absent = 0;
      let leave = 0;
      let unknown = 0;
      for (const entry of log.entries) {
        const st = entry.attendance[student.id] ?? 'unknown';
        if (st === 'present') present += 1;
        else if (st === 'absent') absent += 1;
        else if (st === 'leave') leave += 1;
        else unknown += 1;
      }
      const marked = present + absent + leave;
      const rate = marked > 0 ? present / marked : 0;
      return {
        student,
        present,
        absent,
        leave,
        unknown,
        sessions: log.entries.length,
        rate,
      };
    })
    .sort((a, b) => {
      if (b.present !== a.present) return b.present - a.present;
      if (b.rate !== a.rate) return b.rate - a.rate;
      return a.student.name.localeCompare(b.student.name, 'zh');
    });
}

export function exportAttendanceCsv(students: Student[], log: AttendanceLog): string {
  const statusLabel = (s: AttendanceStatus) =>
    ({ present: '出席', absent: '缺席', leave: '请假', unknown: '未点' })[s];

  const dateHeaders = log.entries.map((e) => `${e.date}/${e.lessonId}`);
  const header = ['学号', '姓名', ...dateHeaders, '出席', '缺席', '请假', '未点', '出勤率%'].join(',');

  const ranking = buildAttendanceRanking(students, log);
  const lines = ranking.map((row) => {
    const cells = log.entries.map((e) =>
      statusLabel(e.attendance[row.student.id] ?? 'unknown'),
    );
    return [
      row.student.studentNo ?? '',
      row.student.name,
      ...cells,
      row.present,
      row.absent,
      row.leave,
      row.unknown,
      Math.round(row.rate * 1000) / 10,
    ].join(',');
  });
  return [header, ...lines].join('\n');
}

export function adjustFlowers(
  session: SessionLedger,
  studentId: string,
  delta: number,
): { session: SessionLedger; semester: SemesterLedger } {
  const semester = loadSemester(session.classId);
  const prevSession = session.flowers[studentId] ?? 0;
  const prevSemester = semester.flowers[studentId] ?? 0;
  const sessionCount = Math.max(0, prevSession + delta);
  const applied = sessionCount - prevSession;
  const semesterCount = Math.max(0, prevSemester + applied);

  const nextSession: SessionLedger = {
    ...session,
    flowers: { ...session.flowers, [studentId]: sessionCount },
    updatedAt: new Date().toISOString(),
  };
  const nextSemester: SemesterLedger = {
    classId: session.classId,
    flowers: { ...semester.flowers, [studentId]: semesterCount },
    updatedAt: new Date().toISOString(),
  };
  saveSession(nextSession);
  saveSemester(nextSemester);
  return { session: nextSession, semester: nextSemester };
}

export function recordPick(session: SessionLedger, studentId: string): SessionLedger {
  if (session.pickHistory.includes(studentId)) return session;
  const next: SessionLedger = {
    ...session,
    pickHistory: [...session.pickHistory, studentId],
    updatedAt: new Date().toISOString(),
  };
  saveSession(next);
  return next;
}

export function pickPool(students: Student[], session: SessionLedger): Student[] {
  const picked = new Set(session.pickHistory);
  return students.filter((s) => {
    if (picked.has(s.id)) return false;
    const att = session.attendance[s.id] ?? 'unknown';
    return att !== 'absent' && att !== 'leave';
  });
}

export function pickRandomStudent(pool: Student[]): Student | null {
  if (!pool.length) return null;
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const idx = buf[0]! % pool.length;
  return pool[idx]!;
}

export function rosterSummary(): { id: ClassId; label: string; count: number }[] {
  const classes = loadClasses();
  const store = loadRosters();
  return classes.map((c) => ({
    id: c.id,
    label: c.name,
    count: store.classes[c.id]?.students.length ?? 0,
  }));
}
