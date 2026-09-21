import type { ClassId } from '../data/classes';

export interface Student {
  id: string;
  name: string;
  studentNo?: string;
}

export type AttendanceStatus = 'present' | 'early_leave' | 'absent' | 'leave' | 'unknown';

export type RewardKind = 'flowers' | 'clovers';

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
  /** 提问（抽点）：小红花 */
  flowers: Record<string, number>;
  /** 课堂互动：幸运草 */
  clovers: Record<string, number>;
  updatedAt: string;
}

export interface SessionLedger {
  sessionId: string;
  classId: ClassId;
  date: string;
  lessonId: string;
  attendance: Record<string, AttendanceStatus>;
  flowers: Record<string, number>;
  clovers: Record<string, number>;
  pickHistory: string[];
  updatedAt: string;
}

/** 一次课的完整快照（考勤 + 花/草 + 抽点） */
export interface AttendanceLogEntry {
  sessionId: string;
  date: string;
  lessonId: string;
  attendance: Record<string, AttendanceStatus>;
  flowers: Record<string, number>;
  clovers: Record<string, number>;
  pickHistory: string[];
}

export interface AttendanceLog {
  classId: ClassId;
  entries: AttendanceLogEntry[];
  updatedAt: string;
}

export interface AttendanceRankRow {
  student: Student;
  present: number;
  earlyLeave: number;
  absent: number;
  leave: number;
  unknown: number;
  sessions: number;
  /** 出席 /（出席+早退+缺席+请假），不含未点 */
  rate: number;
  /** 无故缺席 + ⌊早退/3⌋；请假不计 */
  equivalentAbsences: number;
  /** 折算缺勤 < 6 */
  canTakeFinal: boolean;
}

export interface PerformanceGradeRow {
  student: Student;
  flowers: number;
  clovers: number;
  present: number;
  earlyLeave: number;
  absent: number;
  leave: number;
  unknown: number;
  rate: number;
  /** 小红花按本班第 90 百分位折到 5 */
  flowersScaled: number;
  flowersFinal: number;
  /** 幸运草按本班第 90 百分位折到 5 */
  cloversScaled: number;
  cloversFinal: number;
  equivalentAbsences: number;
  canTakeFinal: boolean;
}
