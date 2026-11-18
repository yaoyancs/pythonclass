export type DeviceKind = 'desktop' | 'mobile' | 'tablet';

export type HitType =
  | 'session_start'
  | 'lesson_view'
  | 'scene_view'
  | 'scene_dwell'
  | 'run'
  | 'homework_open'
  | 'run_result'
  | 'choice'
  | 'lesson_complete'
  | 'first_run'
  | 'hint_view'
  | 'ai_review';

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
  type: HitType;
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
  visitors: number;
  pv: number;
  homeworkOpens: number;
  cities: number;
}

export interface OverviewDay {
  date: string;
  sessions: number;
  visitors: number;
  pv: number;
  homeworkOpens: number;
}

export interface OverviewCity {
  key: string;
  name: string | null;
  total: number;
  last7: number;
}

export interface OverviewProvince {
  name: string;
  total: number;
  last7: number;
}

export interface OverviewResult {
  excludeTeacher: boolean;
  totals: OverviewTotals;
  last7: OverviewTotals;
  days: OverviewDay[];
  cities: OverviewCity[];
  provinces: OverviewProvince[];
  note: string;
}

export interface SummaryResult {
  date: string;
  excludeTeacher: boolean;
  uv: number;
  visitors: number;
  pv: number;
  studentUv: number;
  studentVisitors: number;
  teacherUv: number;
  homeworkOpens: number;
  runs: number;
  truncated: boolean;
  byReferrer: CountRow[];
  byDevice: CountRow[];
  byRegion: CountRow[];
  timeline: TimelineRow[];
  recent: RecentRow[];
  note: string;
  emptyStudents: boolean;
}

export interface LessonSceneHeat {
  sceneIndex: number;
  sceneId: string | null;
  partId: string | null;
  views: number;
  sessions: number;
  avgDwellSeconds: number;
  medianDwellSeconds: number;
  runs: number;
  runOk: number;
  runError: number;
  errorSessions: number;
  fixedErrors: number;
  choices: number;
  choicesCorrect: number;
  firstTryCorrect: number;
  hintViews: number;
  aiReviews: number;
}

export interface LessonHeat {
  lessonId: string;
  views: number;
  sessions: number;
  visitors: number;
  homeworkOpens: number;
  runs: number;
  avgDwellSeconds: number;
  medianDwellSeconds: number;
  scenes: LessonSceneHeat[];
  runOk: number;
  runError: number;
  errorSessions: number;
  fixedErrors: number;
  codeChanged: number;
  codeSame: number;
  choices: number;
  choicesCorrect: number;
  firstTryCorrect: number;
  completions: number;
  avgFirstRunSeconds: number;
  hintViews: number;
  hintSessions: number;
  aiReviews: number;
  errorTypes: CountRow[];
}

export type AnalyticsFilterRange =
  | { mode: 'day'; date: string }
  | { mode: 'last7' }
  | { mode: 'all' }
  | { mode: 'custom'; start: string; end: string };
