import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ClassId, TeachingClass } from '../data/classes';
import type {
  AttendanceLog,
  AttendanceStatus,
  SemesterLedger,
  SessionLedger,
  Student,
} from '../types/roster';
import {
  addClass,
  adjustFlowers,
  deleteClass,
  getClassStudents,
  loadActiveClassId,
  loadAttendanceLog,
  loadClasses,
  loadOrCreateSession,
  loadSemester,
  pickPool,
  recordPick,
  renameClass,
  saveActiveClassId,
  saveClassRoster,
  setAllAttendance,
  setAttendance,
  upsertAttendanceLog,
} from '../utils/rosterStorage';

interface UseRosterSessionOptions {
  /** 本机持久化变更后回调（用于云端同步） */
  onPersist?: () => void;
}

export function useRosterSession(lessonId: string, options: UseRosterSessionOptions = {}) {
  const onPersistRef = useRef(options.onPersist);
  onPersistRef.current = options.onPersist;

  const notifyPersist = useCallback(() => {
    onPersistRef.current?.();
  }, []);

  const [classListVersion, setClassListVersion] = useState(0);
  const [classId, setClassIdState] = useState<ClassId>(() => loadActiveClassId());
  const [rosterVersion, setRosterVersion] = useState(0);
  const [session, setSession] = useState<SessionLedger>(() =>
    loadOrCreateSession(loadActiveClassId(), lessonId),
  );
  const [semester, setSemester] = useState<SemesterLedger>(() =>
    loadSemester(loadActiveClassId()),
  );
  const [attendanceLog, setAttendanceLog] = useState<AttendanceLog>(() =>
    loadAttendanceLog(loadActiveClassId()),
  );

  const sessionRef = useRef(session);
  const semesterRef = useRef(semester);
  sessionRef.current = session;
  semesterRef.current = semester;

  const classes = useMemo(() => {
    void classListVersion;
    return loadClasses();
  }, [classListVersion]);

  useEffect(() => {
    if (!classId) {
      const first = loadClasses()[0]?.id ?? '';
      if (first) {
        saveActiveClassId(first);
        setClassIdState(first);
        notifyPersist();
      }
      return;
    }
    const nextSession = loadOrCreateSession(classId, lessonId);
    setSession(nextSession);
    setSemester(loadSemester(classId));
    let nextLog = loadAttendanceLog(classId);
    if (Object.keys(nextSession.attendance).length > 0) {
      nextLog = upsertAttendanceLog(nextSession);
    }
    setAttendanceLog(nextLog);
    notifyPersist();
  }, [classId, lessonId, notifyPersist]);

  const students = useMemo(() => {
    void rosterVersion;
    return getClassStudents(classId);
  }, [classId, rosterVersion]);

  const setClassId = useCallback(
    (id: ClassId) => {
      saveActiveClassId(id);
      setClassIdState(id);
      notifyPersist();
    },
    [notifyPersist],
  );

  const replaceRoster = useCallback(
    (targetClass: ClassId, list: Student[], source: 'local' | 'static' = 'local') => {
      saveClassRoster(targetClass, list, source);
      setRosterVersion((t) => t + 1);
      notifyPersist();
    },
    [notifyPersist],
  );

  const refreshRosters = useCallback(() => {
    setRosterVersion((t) => t + 1);
  }, []);

  /** 云端 hydrate 后强制从 localStorage 重读 */
  const reloadFromStorage = useCallback(() => {
    const active = loadActiveClassId();
    setClassIdState(active);
    setClassListVersion((v) => v + 1);
    setRosterVersion((t) => t + 1);
    setSession(loadOrCreateSession(active, lessonId));
    setSemester(loadSemester(active));
    setAttendanceLog(loadAttendanceLog(active));
  }, [lessonId]);

  const createClass = useCallback(
    (name: string, note?: string): TeachingClass => {
      const created = addClass(name, note);
      setClassListVersion((v) => v + 1);
      setRosterVersion((t) => t + 1);
      setClassId(created.id);
      notifyPersist();
      return created;
    },
    [notifyPersist, setClassId],
  );

  const updateClass = useCallback(
    (id: ClassId, name: string, note?: string) => {
      renameClass(id, name, note);
      setClassListVersion((v) => v + 1);
      notifyPersist();
    },
    [notifyPersist],
  );

  const removeClass = useCallback(
    (id: ClassId) => {
      const nextActive = deleteClass(id);
      setClassListVersion((v) => v + 1);
      setRosterVersion((t) => t + 1);
      if (nextActive) {
        setClassId(nextActive);
      } else {
        setClassIdState('');
        saveActiveClassId('');
        setSession(loadOrCreateSession('', lessonId));
        setSemester(loadSemester(''));
        setAttendanceLog(loadAttendanceLog(''));
      }
      notifyPersist();
    },
    [lessonId, notifyPersist, setClassId],
  );

  const updateAttendance = useCallback(
    (studentId: string, status: AttendanceStatus) => {
      const next = setAttendance(sessionRef.current, studentId, status);
      sessionRef.current = next;
      setSession(next);
      setAttendanceLog(loadAttendanceLog(next.classId));
      notifyPersist();
    },
    [notifyPersist],
  );

  const markAllPresent = useCallback(() => {
    const ids = getClassStudents(sessionRef.current.classId).map((s) => s.id);
    const next = setAllAttendance(sessionRef.current, ids, 'present');
    sessionRef.current = next;
    setSession(next);
    setAttendanceLog(loadAttendanceLog(next.classId));
    notifyPersist();
  }, [notifyPersist]);

  const changeFlowers = useCallback(
    (studentId: string, delta: number) => {
      const { session: nextSession, semester: nextSemester } = adjustFlowers(
        sessionRef.current,
        studentId,
        delta,
      );
      sessionRef.current = nextSession;
      semesterRef.current = nextSemester;
      setSession(nextSession);
      setSemester(nextSemester);
      notifyPersist();
    },
    [notifyPersist],
  );

  const commitPick = useCallback(
    (studentId: string) => {
      const next = recordPick(sessionRef.current, studentId);
      sessionRef.current = next;
      setSession(next);
      notifyPersist();
    },
    [notifyPersist],
  );

  const getPickPool = useCallback(() => pickPool(students, session), [students, session]);

  return {
    classId,
    setClassId,
    classes,
    students,
    session,
    semester,
    attendanceLog,
    rosterVersion,
    replaceRoster,
    refreshRosters,
    reloadFromStorage,
    createClass,
    updateClass,
    removeClass,
    updateAttendance,
    markAllPresent,
    changeFlowers,
    commitPick,
    getPickPool,
  };
}
