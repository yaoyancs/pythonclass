import type { ClassId } from '../data/classes';

export interface Student {
  id: string;
  name: string;
  studentNo?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'unknown';

export interface ClassRoster {
  students: Student[];
  updatedAt: string;
  /** local = 本机上传；static = 从站点 /rosters 载入 */
  source?: 'local' | 'static';
}

export interface MultiRosterStore {
  classes: Record<ClassId, ClassRoster>;
  updatedAt: string;
}

export interface SemesterLedger {
  classId: ClassId;
  flowers: Record<string, number>;
  updatedAt: string;
}

export interface SessionLedger {
  sessionId: string;
  classId: ClassId;
  date: string;
  lessonId: string;
  attendance: Record<string, AttendanceStatus>;
  flowers: Record<string, number>;
  pickHistory: string[];
  updatedAt: string;
}

/** 一次课的考勤快照（写入学期考勤档案） */
export interface AttendanceLogEntry {
  sessionId: string;
  date: string;
  lessonId: string;
  attendance: Record<string, AttendanceStatus>;
}

export interface AttendanceLog {
  classId: ClassId;
  entries: AttendanceLogEntry[];
  updatedAt: string;
}

export interface AttendanceRankRow {
  student: Student;
  present: number;
  absent: number;
  leave: number;
  unknown: number;
  sessions: number;
  /** 出席 / 已考勤次数（不含未点） */
  rate: number;
}
