import { createClassId, type ClassId, type TeachingClass } from '../data/classes';
import type {
  AttendanceLog,
  AttendanceLogEntry,
  AttendanceRankRow,
  AttendanceStatus,
  ClassRoster,
  MultiRosterStore,
  PerformanceGradeRow,
  RewardKind,
  SemesterLedger,
  SessionLedger,
  Student,
} from '../types/roster';
import { emptyTeacherPack, type TeacherCloudPack } from '../types/teacherPack';

const REGISTRY_KEY = 'pyclass-class-registry-v1';
const ROSTERS_KEY = 'pyclass-rosters-v2';
const ACTIVE_CLASS_KEY = 'pyclass-active-class';
const LEGACY_ROSTER_KEY = 'pyclass-roster';
const LEGACY_SEMESTER_KEY = 'pyclass-semester-flowers';

function activeSessionKey(classId: ClassId): string {
  return `pyclass-active-session-${classId}`;
}

/** 本堂 / 学期花、草下限（可为负） */
export const REWARD_MIN = -50;
/** @deprecated 使用 REWARD_MIN */
export const FLOWER_MIN = REWARD_MIN;

export const FINAL_ABSENCE_LIMIT = 6;

export const PERFORMANCE_CSV_NOTE = [
  '# 提问（小红花）与课堂互动（幸运草）各占 5 分，分别按本班第90百分位折到满分5（一位小数）；负值按 0。',
  '# 考勤不算分。折算缺勤=无故缺席+⌊早退/3⌋；请假不计。折算缺勤达 6 次不得参加期末。',
].join('\n');

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

/** 本堂身份：日期 + 班级 + 当天第几次课。不绑定讲次，换页不另开考勤。 */
export function makeSessionId(classId: ClassId, date = todayIso(), meeting = 1): string {
  return meeting <= 1 ? `${date}_${classId}` : `${date}_${classId}_m${meeting}`;
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
        clovers: {},
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
  localStorage.removeItem(activeSessionKey(classId));

  const toRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith('pyclass-session-')) continue;
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    try {
      const session = JSON.parse(raw) as SessionLedger;
      if (session.classId === classId) toRemove.push(key);
    } catch {
      // skip
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

function countMap(raw?: Record<string, number> | null): Record<string, number> {
  return raw && typeof raw === 'object' ? { ...raw } : {};
}

export function normalizeSemester(ledger: SemesterLedger): SemesterLedger {
  return {
    classId: ledger.classId,
    flowers: countMap(ledger.flowers),
    clovers: countMap(ledger.clovers),
    updatedAt: ledger.updatedAt ?? '',
  };
}

export function normalizeSession(session: SessionLedger): SessionLedger {
  return {
    ...session,
    attendance: session.attendance ?? {},
    flowers: countMap(session.flowers),
    clovers: countMap(session.clovers),
    pickHistory: Array.isArray(session.pickHistory) ? session.pickHistory : [],
  };
}

export function normalizeLogEntry(entry: AttendanceLogEntry): AttendanceLogEntry {
  return {
    sessionId: entry.sessionId,
    date: entry.date,
    lessonId: entry.lessonId,
    attendance: entry.attendance ?? {},
    flowers: countMap(entry.flowers),
    clovers: countMap(entry.clovers),
    pickHistory: Array.isArray(entry.pickHistory) ? entry.pickHistory : [],
  };
}

export function loadSemester(classId: ClassId): SemesterLedger {
  if (!classId) return { classId: '', flowers: {}, clovers: {}, updatedAt: '' };
  const raw =
    readJson<SemesterLedger>(semesterKey(classId)) ?? {
      classId,
      flowers: {},
      clovers: {},
      updatedAt: '',
    };
  return normalizeSemester({ ...raw, classId });
}

function saveSemester(ledger: SemesterLedger): void {
  if (!ledger.classId) return;
  writeJson(semesterKey(ledger.classId), {
    ...ledger,
    updatedAt: new Date().toISOString(),
  });
}

function emptySession(
  classId: ClassId,
  lessonId: string,
  date: string,
  meeting = 1,
): SessionLedger {
  return {
    sessionId: makeSessionId(classId, date, meeting),
    classId,
    date,
    lessonId,
    attendance: {},
    flowers: {},
    clovers: {},
    pickHistory: [],
    updatedAt: new Date().toISOString(),
  };
}

function loadActiveSessionId(classId: ClassId): string | null {
  if (!classId) return null;
  return localStorage.getItem(activeSessionKey(classId));
}

function saveActiveSessionId(classId: ClassId, sessionId: string): void {
  if (!classId) return;
  localStorage.setItem(activeSessionKey(classId), sessionId);
}

function findLatestSessionOnDate(classId: ClassId, date: string): SessionLedger | null {
  let best: SessionLedger | null = null;
  for (const session of Object.values(collectSessions())) {
    if (session.classId !== classId || session.date !== date) continue;
    if (!best || session.updatedAt > best.updatedAt) best = session;
  }
  return best;
}

function nextMeetingNumber(classId: ClassId, date: string): number {
  let count = 0;
  for (const session of Object.values(collectSessions())) {
    if (session.classId !== classId || session.date !== date) continue;
    count += 1;
  }
  return count + 1;
}

/** 复用当天本堂；lessonId 以首次创建为准，换讲不改写。 */
function adoptSession(session: SessionLedger): SessionLedger {
  saveActiveSessionId(session.classId, session.sessionId);
  return normalizeSession(session);
}

export function loadOrCreateSession(classId: ClassId, lessonId: string): SessionLedger {
  if (!classId) {
    return emptySession('', lessonId, todayIso());
  }
  const date = todayIso();
  const activeId = loadActiveSessionId(classId);
  const fromActive = activeId ? readJson<SessionLedger>(sessionStorageKey(activeId)) : null;
  if (fromActive && fromActive.classId === classId && fromActive.date === date) {
    return adoptSession(fromActive);
  }
  const fromToday = findLatestSessionOnDate(classId, date);
  if (fromToday) {
    return adoptSession(fromToday);
  }
  const created = emptySession(classId, lessonId, date, 1);
  saveSession(created);
  saveActiveSessionId(classId, created.sessionId);
  return created;
}

/** 新开本堂：上次考勤留在学期档案，不再被覆盖 */
export function startNewSession(classId: ClassId, lessonId: string): SessionLedger {
  if (!classId) {
    return emptySession('', lessonId, todayIso());
  }
  const date = todayIso();
  const created = emptySession(classId, lessonId, date, nextMeetingNumber(classId, date));
  saveSession(created);
  saveActiveSessionId(classId, created.sessionId);
  return created;
}

/** 本堂 sessionId 中的当天第几次（无 _mN 则为 1） */
export function meetingNumberFromSessionId(sessionId: string): number {
  const m = sessionId.match(/_m(\d+)$/);
  return m ? Number(m[1]) : 1;
}

export function meetingLabel(entry: { date: string; sessionId: string; lessonId?: string }): string {
  const n = meetingNumberFromSessionId(entry.sessionId);
  const lesson = entry.lessonId ? ` · ${entry.lessonId}` : '';
  return `${entry.date} · 当天第 ${n} 次${lesson}`;
}

export function teachingDateIso(): string {
  return todayIso();
}

export function loadStoredSession(sessionId: string): SessionLedger | null {
  if (!sessionId) return null;
  const raw = readJson<SessionLedger>(sessionStorageKey(sessionId));
  return raw ? normalizeSession(raw) : null;
}

/**
 * 补改某一堂考勤：只改档案，并在本机仍有该会话时同步会话。
 * 不走日期保护，不切换当前 active 本堂。
 */
export function patchAttendanceBySessionId(
  classId: ClassId,
  sessionId: string,
  studentId: string,
  status: AttendanceStatus,
): AttendanceLog {
  if (!classId || !sessionId) return loadAttendanceLog(classId);
  const log = loadAttendanceLog(classId);
  const idx = log.entries.findIndex((e) => e.sessionId === sessionId);
  if (idx < 0) return log;
  const prev = normalizeLogEntry(log.entries[idx]!);
  const entries = [...log.entries];
  entries[idx] = {
    ...prev,
    attendance: { ...prev.attendance, [studentId]: status },
  };
  const next: AttendanceLog = {
    classId,
    entries,
    updatedAt: new Date().toISOString(),
  };
  writeJson(attendanceLogKey(classId), next);

  const stored = loadStoredSession(sessionId);
  if (stored && stored.classId === classId) {
    writeJson(sessionStorageKey(sessionId), {
      ...stored,
      attendance: { ...stored.attendance, [studentId]: status },
      updatedAt: new Date().toISOString(),
    });
  }
  return next;
}

function sessionFromLogEntry(classId: ClassId, entry: AttendanceLogEntry): SessionLedger {
  return normalizeSession({
    sessionId: entry.sessionId,
    classId,
    date: entry.date,
    lessonId: entry.lessonId,
    attendance: entry.attendance,
    flowers: entry.flowers,
    clovers: entry.clovers,
    pickHistory: entry.pickHistory,
    updatedAt: new Date().toISOString(),
  });
}

/** 把当前本堂指到指定会话（仅允许今天的课次，以便沿用现有点名逻辑） */
export function resumeSession(classId: ClassId, sessionId: string): SessionLedger | null {
  if (!classId || !sessionId) return null;
  const stored = loadStoredSession(sessionId);
  const entry = loadAttendanceLog(classId).entries.find((e) => e.sessionId === sessionId);
  if (!stored && !entry) return null;
  const session = stored ?? sessionFromLogEntry(classId, entry!);
  if (session.classId !== classId) return null;
  if (session.date !== todayIso()) return null;
  if (!stored) saveSession(session);
  saveActiveSessionId(classId, session.sessionId);
  return session;
}

export function previousTodaySessionId(
  classId: ClassId,
  currentSessionId: string,
): string | null {
  if (!classId) return null;
  const date = todayIso();
  const ids = new Set<string>();
  for (const entry of loadAttendanceLog(classId).entries) {
    if (entry.date === date) ids.add(entry.sessionId);
  }
  for (const session of Object.values(collectSessions())) {
    if (session.classId === classId && session.date === date) ids.add(session.sessionId);
  }
  const currentN = meetingNumberFromSessionId(currentSessionId);
  let bestId: string | null = null;
  let bestN = 0;
  for (const id of ids) {
    if (id === currentSessionId) continue;
    const n = meetingNumberFromSessionId(id);
    if (n < currentN && n >= bestN) {
      bestN = n;
      bestId = id;
    }
  }
  return bestId;
}

/** 同一天误开新堂：指回当天上一堂（meeting 更小的那条） */
export function resumePreviousTodaySession(
  classId: ClassId,
  currentSessionId: string,
): SessionLedger | null {
  const prevId = previousTodaySessionId(classId, currentSessionId);
  if (!prevId) return null;
  return resumeSession(classId, prevId);
}

export function saveSession(session: SessionLedger): void {
  if (!session.classId) return;
  const snap = normalizeSession(session);
  writeJson(sessionStorageKey(session.sessionId), {
    ...snap,
    updatedAt: new Date().toISOString(),
  });
}

function sessionForWrite(session: SessionLedger): SessionLedger {
  if (!session.classId) return normalizeSession(session);
  if (session.date === todayIso()) return normalizeSession(session);
  return startNewSession(session.classId, session.lessonId);
}

export function loadAttendanceLog(classId: ClassId): AttendanceLog {
  if (!classId) return { classId: '', entries: [], updatedAt: '' };
  const raw =
    readJson<AttendanceLog>(attendanceLogKey(classId)) ?? {
      classId,
      entries: [],
      updatedAt: '',
    };
  return {
    classId,
    entries: (raw.entries ?? []).map(normalizeLogEntry),
    updatedAt: raw.updatedAt ?? '',
  };
}

export function upsertAttendanceLog(session: SessionLedger): AttendanceLog {
  if (!session.classId) return { classId: '', entries: [], updatedAt: '' };
  const log = loadAttendanceLog(session.classId);
  const snap = normalizeSession(session);
  const entry: AttendanceLogEntry = {
    sessionId: snap.sessionId,
    date: snap.date,
    lessonId: snap.lessonId,
    attendance: { ...snap.attendance },
    flowers: { ...snap.flowers },
    clovers: { ...snap.clovers },
    pickHistory: [...snap.pickHistory],
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
  const base = sessionForWrite(session);
  const next: SessionLedger = {
    ...base,
    attendance: { ...base.attendance, [studentId]: status },
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
  const base = sessionForWrite(session);
  const attendance = { ...base.attendance };
  for (const id of studentIds) attendance[id] = status;
  const next: SessionLedger = {
    ...base,
    attendance,
    updatedAt: new Date().toISOString(),
  };
  saveSession(next);
  upsertAttendanceLog(next);
  return next;
}

const STATUS_LABEL: Record<AttendanceStatus, string> = {
  present: '出席',
  early_leave: '早退',
  absent: '缺席',
  leave: '请假',
  unknown: '未点',
};

/** 折算缺勤：无故缺席 + ⌊早退/3⌋；请假不计 */
export function equivalentAbsences(absent: number, earlyLeave: number): number {
  return Math.max(0, absent) + Math.floor(Math.max(0, earlyLeave) / 3);
}

export function canTakeFinalExam(absent: number, earlyLeave: number): boolean {
  return equivalentAbsences(absent, earlyLeave) < FINAL_ABSENCE_LIMIT;
}

export function buildAttendanceRanking(
  students: Student[],
  log: AttendanceLog,
): AttendanceRankRow[] {
  return students
    .map((student) => {
      let present = 0;
      let earlyLeave = 0;
      let absent = 0;
      let leave = 0;
      let unknown = 0;
      for (const entry of log.entries) {
        const st = entry.attendance[student.id] ?? 'unknown';
        if (st === 'present') present += 1;
        else if (st === 'early_leave') earlyLeave += 1;
        else if (st === 'absent') absent += 1;
        else if (st === 'leave') leave += 1;
        else unknown += 1;
      }
      const marked = present + earlyLeave + absent + leave;
      const rate = marked > 0 ? present / marked : 0;
      const eq = equivalentAbsences(absent, earlyLeave);
      return {
        student,
        present,
        earlyLeave,
        absent,
        leave,
        unknown,
        sessions: log.entries.length,
        rate,
        equivalentAbsences: eq,
        canTakeFinal: eq < FINAL_ABSENCE_LIMIT,
      };
    })
    .sort((a, b) => {
      if (b.present !== a.present) return b.present - a.present;
      if (b.rate !== a.rate) return b.rate - a.rate;
      return a.student.name.localeCompare(b.student.name, 'zh');
    });
}

export function exportAttendanceCsv(students: Student[], log: AttendanceLog): string {
  const dateHeaders = log.entries.map((e) => `${e.date}/${e.lessonId}`);
  const header = [
    '学号',
    '姓名',
    ...dateHeaders,
    '出席',
    '早退',
    '缺席',
    '请假',
    '未点',
    '出勤率%',
    '折算缺勤',
    '可否期末',
  ].join(',');

  const ranking = buildAttendanceRanking(students, log);
  const lines = ranking.map((row) => {
    const cells = log.entries.map((e) =>
      STATUS_LABEL[e.attendance[row.student.id] ?? 'unknown'],
    );
    return [
      row.student.studentNo ?? '',
      row.student.name,
      ...cells,
      row.present,
      row.earlyLeave,
      row.absent,
      row.leave,
      row.unknown,
      Math.round(row.rate * 1000) / 10,
      row.equivalentAbsences,
      row.canTakeFinal ? '可以' : '不得参加',
    ].join(',');
  });
  return [header, ...lines].join('\n');
}

/** 升序数组的第 90 百分位（ceil(0.9n)-1） */
export function percentile90(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil(0.9 * sorted.length) - 1));
  return sorted[idx]!;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function scalePerformanceScore(points: number, p90: number): number {
  if (p90 <= 0) return points > 0 ? 5 : 0;
  return round1(5 * Math.min(1, points / p90));
}

export function buildSemesterGradeRows(
  students: Student[],
  semester: SemesterLedger,
  log: AttendanceLog,
): PerformanceGradeRow[] {
  const ranking = buildAttendanceRanking(students, log);
  const byId = new Map(ranking.map((row) => [row.student.id, row]));
  const sem = normalizeSemester(semester);
  const flowerCounts = students.map((s) => Math.max(0, sem.flowers[s.id] ?? 0));
  const cloverCounts = students.map((s) => Math.max(0, sem.clovers[s.id] ?? 0));
  const flowerP90 = percentile90(flowerCounts);
  const cloverP90 = percentile90(cloverCounts);

  return students.map((student) => {
    const att = byId.get(student.id);
    const flowers = sem.flowers[student.id] ?? 0;
    const clovers = sem.clovers[student.id] ?? 0;
    const flowersScaled = scalePerformanceScore(Math.max(0, flowers), flowerP90);
    const cloversScaled = scalePerformanceScore(Math.max(0, clovers), cloverP90);
    const eq = att?.equivalentAbsences ?? equivalentAbsences(att?.absent ?? 0, att?.earlyLeave ?? 0);
    return {
      student,
      flowers,
      clovers,
      present: att?.present ?? 0,
      earlyLeave: att?.earlyLeave ?? 0,
      absent: att?.absent ?? 0,
      leave: att?.leave ?? 0,
      unknown: att?.unknown ?? 0,
      rate: att?.rate ?? 0,
      flowersScaled,
      flowersFinal: flowersScaled,
      cloversScaled,
      cloversFinal: cloversScaled,
      equivalentAbsences: eq,
      canTakeFinal: att?.canTakeFinal ?? eq < FINAL_ABSENCE_LIMIT,
    };
  });
}

export function exportSemesterPerformanceCsv(
  students: Student[],
  semester: SemesterLedger,
  log: AttendanceLog,
): string {
  const header = [
    '学号',
    '姓名',
    '学期小红花',
    '提问折算',
    '提问最终分',
    '学期幸运草',
    '课堂互动折算',
    '课堂互动最终分',
    '出席',
    '早退',
    '缺席',
    '请假',
    '未点',
    '出勤率%',
    '折算缺勤',
    '可否期末',
  ].join(',');
  const rows = [...buildSemesterGradeRows(students, semester, log)].sort((a, b) => {
    const aTotal = a.flowersFinal + a.cloversFinal;
    const bTotal = b.flowersFinal + b.cloversFinal;
    if (bTotal !== aTotal) return bTotal - aTotal;
    if (b.cloversFinal !== a.cloversFinal) return b.cloversFinal - a.cloversFinal;
    return a.student.name.localeCompare(b.student.name, 'zh');
  });
  const lines = rows.map((row) =>
    [
      row.student.studentNo ?? '',
      row.student.name,
      row.flowers,
      row.flowersScaled,
      row.flowersFinal,
      row.clovers,
      row.cloversScaled,
      row.cloversFinal,
      row.present,
      row.earlyLeave,
      row.absent,
      row.leave,
      row.unknown,
      Math.round(row.rate * 1000) / 10,
      row.equivalentAbsences,
      row.canTakeFinal ? '可以' : '不得参加',
    ].join(','),
  );
  return [PERFORMANCE_CSV_NOTE, header, ...lines].join('\n');
}

/** 档案 + 本机会话合并，供本堂明细导出与对账 */
export function listMeetingEntries(classId: ClassId): AttendanceLogEntry[] {
  const byId = new Map<string, AttendanceLogEntry>();
  for (const entry of loadAttendanceLog(classId).entries) {
    byId.set(entry.sessionId, normalizeLogEntry(entry));
  }
  for (const session of Object.values(collectSessions())) {
    if (session.classId !== classId || !session.sessionId) continue;
    const live = normalizeSession(session);
    const fromSession: AttendanceLogEntry = {
      sessionId: live.sessionId,
      date: live.date,
      lessonId: live.lessonId,
      attendance: { ...live.attendance },
      flowers: { ...live.flowers },
      clovers: { ...live.clovers },
      pickHistory: [...live.pickHistory],
    };
    const prev = byId.get(live.sessionId);
    if (!prev) {
      byId.set(live.sessionId, fromSession);
      continue;
    }
    byId.set(live.sessionId, {
      sessionId: live.sessionId,
      date: live.date || prev.date,
      lessonId: prev.lessonId || live.lessonId,
      attendance: { ...prev.attendance, ...fromSession.attendance },
      flowers: { ...prev.flowers, ...fromSession.flowers },
      clovers: { ...prev.clovers, ...fromSession.clovers },
      pickHistory: fromSession.pickHistory.length ? fromSession.pickHistory : prev.pickHistory,
    });
  }
  return [...byId.values()].sort(
    (a, b) => a.date.localeCompare(b.date) || a.sessionId.localeCompare(b.sessionId),
  );
}

export function exportMeetingDetailCsv(students: Student[], classId: ClassId): string {
  const header = [
    'date',
    'sessionId',
    'lessonId',
    '学号',
    '姓名',
    '该堂出勤',
    '该堂小红花（提问）',
    '该堂幸运草（课堂互动）',
    '该堂是否被抽中',
  ].join(',');
  const meetings = listMeetingEntries(classId);
  const lines: string[] = [];
  for (const meeting of meetings) {
    const picked = new Set(meeting.pickHistory);
    for (const student of students) {
      lines.push(
        [
          meeting.date,
          meeting.sessionId,
          meeting.lessonId,
          student.studentNo ?? '',
          student.name,
          STATUS_LABEL[meeting.attendance[student.id] ?? 'unknown'],
          meeting.flowers[student.id] ?? 0,
          meeting.clovers[student.id] ?? 0,
          picked.has(student.id) ? '是' : '否',
        ].join(','),
      );
    }
  }
  return [header, ...lines].join('\n');
}

export function adjustReward(
  session: SessionLedger,
  studentId: string,
  delta: number,
  kind: RewardKind,
): { session: SessionLedger; semester: SemesterLedger } {
  const base = normalizeSession(sessionForWrite(session));
  const semester = loadSemester(base.classId);
  const prevSession = (base[kind][studentId] ?? 0);
  const prevSemester = (semester[kind][studentId] ?? 0);
  const sessionCount = Math.max(REWARD_MIN, prevSession + delta);
  const applied = sessionCount - prevSession;
  const semesterCount = Math.max(REWARD_MIN, prevSemester + applied);

  const nextSession: SessionLedger = {
    ...base,
    [kind]: { ...base[kind], [studentId]: sessionCount },
    updatedAt: new Date().toISOString(),
  };
  const nextSemester: SemesterLedger = {
    classId: base.classId,
    flowers: kind === 'flowers' ? { ...semester.flowers, [studentId]: semesterCount } : { ...semester.flowers },
    clovers: kind === 'clovers' ? { ...semester.clovers, [studentId]: semesterCount } : { ...semester.clovers },
    updatedAt: new Date().toISOString(),
  };
  saveSession(nextSession);
  saveSemester(nextSemester);
  upsertAttendanceLog(nextSession);
  return { session: nextSession, semester: nextSemester };
}

export function adjustFlowers(
  session: SessionLedger,
  studentId: string,
  delta: number,
): { session: SessionLedger; semester: SemesterLedger } {
  return adjustReward(session, studentId, delta, 'flowers');
}

export function adjustClovers(
  session: SessionLedger,
  studentId: string,
  delta: number,
): { session: SessionLedger; semester: SemesterLedger } {
  return adjustReward(session, studentId, delta, 'clovers');
}

export function recordPick(session: SessionLedger, studentId: string): SessionLedger {
  const base = normalizeSession(sessionForWrite(session));
  if (base.pickHistory.includes(studentId)) return base;
  const next: SessionLedger = {
    ...base,
    pickHistory: [...base.pickHistory, studentId],
    updatedAt: new Date().toISOString(),
  };
  saveSession(next);
  upsertAttendanceLog(next);
  return next;
}

export function pickPool(students: Student[], session: SessionLedger): Student[] {
  const picked = new Set(session.pickHistory);
  return students.filter((s) => {
    if (picked.has(s.id)) return false;
    const att = session.attendance[s.id] ?? 'unknown';
    return att !== 'absent' && att !== 'leave' && att !== 'early_leave';
  });
}

export function studentMatchesQuery(student: Student, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (student.name.toLowerCase().includes(q)) return true;
  if (student.studentNo?.toLowerCase().includes(q)) return true;
  if (student.id.toLowerCase().includes(q)) return true;
  return false;
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

function collectSessions(): Record<string, SessionLedger> {
  const sessions: Record<string, SessionLedger> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith('pyclass-session-')) continue;
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      try {
        const session = normalizeSession(JSON.parse(raw) as SessionLedger);
        if (session?.sessionId) sessions[session.sessionId] = session;
      } catch {
        // skip bad entry
      }
    }
  } catch {
    // ignore
  }
  return sessions;
}

function collectSemesters(classIds: ClassId[]): Record<string, SemesterLedger> {
  const out: Record<string, SemesterLedger> = {};
  for (const id of classIds) {
    const ledger = loadSemester(id);
    if (
      ledger.updatedAt ||
      Object.keys(ledger.flowers).length ||
      Object.keys(ledger.clovers).length
    ) {
      out[id] = ledger;
    }
  }
  return out;
}

function collectAttendanceLogs(classIds: ClassId[]): Record<string, AttendanceLog> {
  const out: Record<string, AttendanceLog> = {};
  for (const id of classIds) {
    const log = loadAttendanceLog(id);
    if (log.updatedAt || log.entries.length) {
      out[id] = log;
    }
  }
  return out;
}

/** 将本机教师数据打包，供上传 KV */
export function exportTeacherPack(): TeacherCloudPack {
  ensureRegistry();
  const classes = loadClasses();
  const classIds = classes.map((c) => c.id);
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    classes,
    rosters: loadRosters(),
    activeClassId: loadActiveClassId(),
    semesters: collectSemesters(classIds),
    attendanceLogs: collectAttendanceLogs(classIds),
    sessions: collectSessions(),
  };
}

function clearTeacherLocalKeys(): void {
  const toRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (
      key === REGISTRY_KEY ||
      key === ROSTERS_KEY ||
      key === ACTIVE_CLASS_KEY ||
      key === LEGACY_ROSTER_KEY ||
      key === LEGACY_SEMESTER_KEY ||
      key.startsWith('pyclass-session-') ||
      key.startsWith('pyclass-active-session-') ||
      key.startsWith('pyclass-semester-flowers-') ||
      key.startsWith('pyclass-attendance-log-')
    ) {
      toRemove.push(key);
    }
  }
  for (const key of toRemove) localStorage.removeItem(key);
}

/** 用云端整包覆盖本机教师数据（解锁后 hydrate） */
export function importTeacherPack(pack: TeacherCloudPack): void {
  clearTeacherLocalKeys();

  const classes = Array.isArray(pack.classes) ? pack.classes : [];
  writeJson(REGISTRY_KEY, classes);

  const rosters = pack.rosters ?? emptyStore();
  writeJson(ROSTERS_KEY, {
    classes: rosters.classes ?? {},
    updatedAt: rosters.updatedAt ?? new Date().toISOString(),
  });

  const active =
    pack.activeClassId && classes.some((c) => c.id === pack.activeClassId)
      ? pack.activeClassId
      : classes[0]?.id ?? '';
  if (active) localStorage.setItem(ACTIVE_CLASS_KEY, active);
  else localStorage.removeItem(ACTIVE_CLASS_KEY);

  for (const [classId, semester] of Object.entries(pack.semesters ?? {})) {
    if (!semester) continue;
    writeJson(semesterKey(classId), {
      classId,
      flowers: semester.flowers ?? {},
      clovers: semester.clovers ?? {},
      updatedAt: semester.updatedAt ?? '',
    });
  }

  for (const [classId, log] of Object.entries(pack.attendanceLogs ?? {})) {
    if (!log) continue;
    writeJson(attendanceLogKey(classId), {
      classId,
      entries: Array.isArray(log.entries) ? log.entries.map(normalizeLogEntry) : [],
      updatedAt: log.updatedAt ?? '',
    });
  }

  for (const session of Object.values(pack.sessions ?? {})) {
    if (!session?.sessionId || !session.classId) continue;
    writeJson(sessionStorageKey(session.sessionId), normalizeSession(session));
  }
}

export function packHasTeachingData(pack: TeacherCloudPack | null | undefined): boolean {
  if (!pack) return false;
  if (pack.classes?.length) return true;
  if (Object.keys(pack.rosters?.classes ?? {}).length) return true;
  if (Object.keys(pack.semesters ?? {}).length) return true;
  if (Object.keys(pack.attendanceLogs ?? {}).length) return true;
  if (Object.keys(pack.sessions ?? {}).length) return true;
  return false;
}

export function isValidTeacherPack(value: unknown): value is TeacherCloudPack {
  if (!value || typeof value !== 'object') return false;
  const pack = value as TeacherCloudPack;
  return pack.version === 1 && Array.isArray(pack.classes) && !!pack.rosters;
}

export { emptyTeacherPack };
