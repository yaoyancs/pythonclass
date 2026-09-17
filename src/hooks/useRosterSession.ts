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

export function useRosterSession(lessonId: string) {
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
      }
      return;
    }
    const nextSession = loadOrCreateSession(classId, lessonId);
    setSession(nextSession);
    setSemester(loadSemester(classId));
    setAttendanceLog(loadAttendanceLog(classId));
    if (Object.keys(nextSession.attendance).length > 0) {
      setAttendanceLog(upsertAttendanceLog(nextSession));
    }
  }, [classId, lessonId]);

  const students = useMemo(() => {
    void rosterVersion;
    return getClassStudents(classId);
  }, [classId, rosterVersion]);

  const setClassId = useCallback((id: ClassId) => {
    saveActiveClassId(id);
    setClassIdState(id);
  }, []);

  const replaceRoster = useCallback(
    (targetClass: ClassId, list: Student[], source: 'local' | 'static' = 'local') => {
      saveClassRoster(targetClass, list, source);
      setRosterVersion((t) => t + 1);
    },
    [],
  );

  const refreshRosters = useCallback(() => {
    setRosterVersion((t) => t + 1);
  }, []);

  const createClass = useCallback(
    (name: string, note?: string): TeachingClass => {
      const created = addClass(name, note);
      setClassListVersion((v) => v + 1);
      setRosterVersion((t) => t + 1);
      setClassId(created.id);
      return created;
    },
    [setClassId],
  );

  const updateClass = useCallback((id: ClassId, name: string, note?: string) => {
    renameClass(id, name, note);
    setClassListVersion((v) => v + 1);
  }, []);

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
    },
    [lessonId, setClassId],
  );

  const updateAttendance = useCallback((studentId: string, status: AttendanceStatus) => {
    const next = setAttendance(sessionRef.current, studentId, status);
    sessionRef.current = next;
    setSession(next);
    setAttendanceLog(loadAttendanceLog(next.classId));
  }, []);

  const markAllPresent = useCallback(() => {
    const ids = getClassStudents(sessionRef.current.classId).map((s) => s.id);
    const next = setAllAttendance(sessionRef.current, ids, 'present');
    sessionRef.current = next;
    setSession(next);
    setAttendanceLog(loadAttendanceLog(next.classId));
  }, []);

  const changeFlowers = useCallback((studentId: string, delta: number) => {
    const { session: nextSession, semester: nextSemester } = adjustFlowers(
      sessionRef.current,
      studentId,
      delta,
    );
    sessionRef.current = nextSession;
    semesterRef.current = nextSemester;
    setSession(nextSession);
    setSemester(nextSemester);
  }, []);

  const commitPick = useCallback((studentId: string) => {
    const next = recordPick(sessionRef.current, studentId);
    sessionRef.current = next;
    setSession(next);
  }, []);

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
