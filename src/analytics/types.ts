export type DeviceKind = 'desktop' | 'mobile' | 'tablet';

export interface CountRow {
  key: string;
  count: number;
}

export interface TimelineRow {
  hour: number;
  count: number;
}

export interface RecentRow {
  ts: string;
  tsLocal: string;
  ip: string;
  device: DeviceKind;
  referrer: string | null;
  path: string | null;
  lessonId: string | null;
  sceneIndex: number | null;
}

export interface SummaryResult {
  date: string;
  excludeTeacher: boolean;
  uv: number;
  pv: number;
  studentUv: number;
  teacherUv: number;
  homeworkOpens: number;
  byReferrer: CountRow[];
  byDevice: CountRow[];
  timeline: TimelineRow[];
  recent: RecentRow[];
  note: string;
  emptyStudents: boolean;
}

export interface LessonHeat {
  lessonId: string;
  views: number;
  sessions: number;
  homeworkOpens: number;
  runs: number;
  avgDwellSeconds: number;
  scenes: Array<{
    sceneIndex: number;
    sceneId: string | null;
    partId: string | null;
    views: number;
    avgDwellSeconds: number;
    runs: number;
  }>;
}
