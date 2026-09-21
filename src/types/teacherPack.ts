import type { TeachingClass, ClassId } from '../data/classes';
import type {
  AttendanceLog,
  MultiRosterStore,
  SemesterLedger,
  SessionLedger,
} from './roster';

/** 云端「班级整包」：名单 + 学期花/草 + 考勤快照 + 本堂会话 */
export interface TeacherCloudPack {
  version: 1;
  updatedAt: string;
  classes: TeachingClass[];
  rosters: MultiRosterStore;
  activeClassId: ClassId;
  semesters: Record<string, SemesterLedger>;
  attendanceLogs: Record<string, AttendanceLog>;
  sessions: Record<string, SessionLedger>;
}

export function emptyTeacherPack(): TeacherCloudPack {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    classes: [],
    rosters: { classes: {}, updatedAt: '' },
    activeClassId: '',
    semesters: {},
    attendanceLogs: {},
    sessions: {},
  };
}
