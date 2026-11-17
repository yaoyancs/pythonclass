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
  region: string | null;
  referrer: string | null;
  path: string | null;
  lessonId: string | null;
  sceneIndex: number | null;
}

export interface OverviewTotals {
  sessions: number;
  pv: number;
  homeworkOpens: number;
  cities: number;
}

export interface OverviewDay {
  date: string;
  sessions: number;
  pv: number;
  homeworkOpens: number;
}

export interface OverviewCity {
  key: string;
  name: string | null;
  total: number;
  last7: number;
}

export interface OverviewResult {
  excludeTeacher: boolean;
  totals: OverviewTotals;
  last7: OverviewTotals;
  days: OverviewDay[];
  cities: OverviewCity[];
  note: string;
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
  byRegion: CountRow[];
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
    runOk: number;
    runError: number;
    choices: number;
    choicesCorrect: number;
  }>;
  runOk: number;
  runError: number;
  codeChanged: number;
  codeSame: number;
  choices: number;
  choicesCorrect: number;
  firstTryCorrect: number;
  completions: number;
  avgFirstRunSeconds: number;
  errorTypes: CountRow[];
}
