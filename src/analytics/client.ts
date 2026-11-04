import { loadTeacherToken } from '../api/teacherApi';

const SESSION_KEY = 'pyclass-analytics-sid';
const STARTED_KEY = 'pyclass-analytics-started';

export const DWELL_MIN_SECONDS = 10;
export const SCENE_VIEW_DEDUP_MS = 10_000;
export const SCENE_VIEW_DEBOUNCE_MS = 400;
export const RUN_DEDUP_MS = 15_000;

export function getAnalyticsSessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing && /^[A-Za-z0-9_-]{8,64}$/.test(existing)) return existing;
    const id = crypto.randomUUID().replace(/-/g, '');
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return 'anon00000000';
  }
}

function sameOriginReferrer(referrer: string): boolean {
  try {
    if (!referrer) return true;
    const ref = new URL(referrer);
    return ref.origin === window.location.origin;
  } catch {
    return true;
  }
}

/** Fire-and-forget. Never returns a Promise. Failures are dropped. */
export function track(payload: Record<string, unknown>): void {
  try {
    const body = JSON.stringify({
      ...payload,
      sessionId: getAnalyticsSessionId(),
      ts: new Date().toISOString(),
      teacher: !!loadTeacherToken(),
    });
    const blob = new Blob([body], { type: 'application/json' });
    if (typeof navigator.sendBeacon === 'function') {
      navigator.sendBeacon('/api/analytics/hit', blob);
      return;
    }
    void fetch('/api/analytics/hit', {
      method: 'POST',
      body,
      headers: { 'content-type': 'application/json' },
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // drop
  }
}

export function trackSessionStart(path: string): void {
  try {
    if (sessionStorage.getItem(STARTED_KEY) === '1') return;
    sessionStorage.setItem(STARTED_KEY, '1');
  } catch {
    // continue
  }
  const ref = document.referrer || '';
  track({
    type: 'session_start',
    path,
    referrer: sameOriginReferrer(ref) ? '' : ref,
  });
}

const lessonEnteredAt = new Map<string, number>();

export function trackLessonView(lessonId: string): void {
  lessonEnteredAt.set(`${getAnalyticsSessionId()}:${lessonId}`, Date.now());
  track({ type: 'lesson_view', lessonId, path: `/lesson/${lessonId}` });
}

const completedLessons = new Set<string>();

export function trackLessonComplete(input: {
  lessonId: string;
  sceneIndex: number;
  sceneId?: string;
  partId?: string;
}): void {
  const key = `${getAnalyticsSessionId()}:${input.lessonId}`;
  if (completedLessons.has(key)) return;
  completedLessons.add(key);
  track({
    type: 'lesson_complete',
    lessonId: input.lessonId,
    sceneIndex: input.sceneIndex,
    sceneId: input.sceneId,
    partId: input.partId,
  });
}

const firstRuns = new Set<string>();

function trackFirstRun(lessonId: string): void {
  const key = `${getAnalyticsSessionId()}:${lessonId}`;
  if (firstRuns.has(key)) return;
  firstRuns.add(key);
  const entered = lessonEnteredAt.get(key) ?? Date.now();
  track({
    type: 'first_run',
    lessonId,
    seconds: Math.max(0, Math.round((Date.now() - entered) / 1000)),
  });
}

const homeworkOpened = new Set<string>();

export function trackHomeworkOpen(lessonId: string): void {
  const key = `${getAnalyticsSessionId()}:${lessonId}`;
  if (homeworkOpened.has(key)) return;
  homeworkOpened.add(key);
  track({
    type: 'homework_open',
    lessonId,
    path: `/lesson/${lessonId}?page=homework`,
    source: 'homework',
  });
}

const sceneViewLast = new Map<string, number>();
let sceneViewTimer: number | null = null;
let sceneViewPending: {
  lessonId: string;
  sceneIndex: number;
  sceneId?: string;
  partId?: string;
} | null = null;

export function scheduleSceneView(input: {
  lessonId: string;
  sceneIndex: number;
  sceneId?: string;
  partId?: string;
}): void {
  sceneViewPending = input;
  if (sceneViewTimer != null) window.clearTimeout(sceneViewTimer);
  sceneViewTimer = window.setTimeout(() => {
    sceneViewTimer = null;
    const pending = sceneViewPending;
    sceneViewPending = null;
    if (!pending) return;
    const key = `${getAnalyticsSessionId()}:${pending.lessonId}:${pending.sceneIndex}`;
    const now = Date.now();
    const prev = sceneViewLast.get(key) ?? 0;
    if (now - prev < SCENE_VIEW_DEDUP_MS) return;
    sceneViewLast.set(key, now);
    track({
      type: 'scene_view',
      lessonId: pending.lessonId,
      sceneIndex: pending.sceneIndex,
      sceneId: pending.sceneId,
      partId: pending.partId,
      path: `/lesson/${pending.lessonId}`,
    });
  }, SCENE_VIEW_DEBOUNCE_MS);
}

export function trackSceneDwell(input: {
  lessonId: string;
  sceneIndex: number;
  seconds: number;
  sceneId?: string;
  partId?: string;
}): void {
  if (input.seconds < DWELL_MIN_SECONDS) return;
  track({
    type: 'scene_dwell',
    lessonId: input.lessonId,
    sceneIndex: input.sceneIndex,
    seconds: Math.round(input.seconds),
    sceneId: input.sceneId,
    partId: input.partId,
  });
}

const runLast = new Map<string, number>();

export function trackRun(lessonId: string, sceneIndex: number): boolean {
  const key = `${getAnalyticsSessionId()}:${lessonId}:${sceneIndex}`;
  const now = Date.now();
  const prev = runLast.get(key) ?? 0;
  if (now - prev < RUN_DEDUP_MS) return false;
  runLast.set(key, now);
  trackFirstRun(lessonId);
  track({ type: 'run', lessonId, sceneIndex });
  return true;
}

export function trackRunResult(input: {
  lessonId: string;
  sceneIndex: number;
  sceneId?: string;
  partId?: string;
  ok: boolean;
  errorType?: string | null;
  codeChanged: boolean;
}): void {
  track({
    type: 'run_result',
    lessonId: input.lessonId,
    sceneIndex: input.sceneIndex,
    sceneId: input.sceneId,
    partId: input.partId,
    outcome: input.ok ? 'ok' : 'error',
    errorType: input.ok ? undefined : input.errorType || 'Error',
    codeChanged: input.codeChanged,
  });
}

const choiceAttempts = new Map<string, number>();

export function trackChoice(input: {
  lessonId: string;
  sceneIndex: number;
  sceneId?: string;
  partId?: string;
  choiceId: string;
  correct: boolean;
  group?: string;
}): void {
  const key = `${getAnalyticsSessionId()}:${input.lessonId}:${input.sceneIndex}:${input.group ?? 'q'}`;
  const attempt = (choiceAttempts.get(key) ?? 0) + 1;
  if (attempt > 20) return;
  choiceAttempts.set(key, attempt);
  track({
    type: 'choice',
    lessonId: input.lessonId,
    sceneIndex: input.sceneIndex,
    sceneId: input.sceneId,
    partId: input.partId,
    choiceId: input.choiceId,
    correct: input.correct,
    attempt,
  });
}
