export const HIT_TYPES = [
  'session_start',
  'lesson_view',
  'scene_view',
  'scene_dwell',
  'run',
  'homework_open',
  'run_result',
  'choice',
  'lesson_complete',
  'first_run',
] as const;

export type HitType = (typeof HIT_TYPES)[number];
export type DeviceKind = 'desktop' | 'mobile' | 'tablet';

export const DWELL_MIN_SECONDS = 10;
export const SCENE_VIEW_DEDUP_MS = 10_000;
export const SCENE_VIEW_DEBOUNCE_MS = 400;
export const RUN_DEDUP_MS = 15_000;
export const RECENT_LIMIT = 50;
export const RATE_LIMIT_PER_MIN = 60;
export const MAX_REFERER_LEN = 200;
export const MAX_PATH_LEN = 120;
export const MAX_ID_LEN = 64;

export interface IncomingHit {
  type?: unknown;
  ts?: unknown;
  path?: unknown;
  referrer?: unknown;
  sessionId?: unknown;
  lessonId?: unknown;
  sceneIndex?: unknown;
  sceneId?: unknown;
  partId?: unknown;
  seconds?: unknown;
  teacher?: unknown;
  source?: unknown;
  outcome?: unknown;
  errorType?: unknown;
  codeChanged?: unknown;
  choiceId?: unknown;
  correct?: unknown;
  attempt?: unknown;
}

export interface StoredHit {
  ts: string;
  type: HitType;
  sessionId: string;
  path: string | null;
  referrer: string | null;
  lessonId: string | null;
  sceneIndex: number | null;
  sceneId: string | null;
  partId: string | null;
  dwellSeconds: number | null;
  ip: string;
  device: DeviceKind;
  /** 服务端根据边缘节点地理位置写成的「省 + 市」，例如山东省日照市 */
  region: string | null;
  teacher: boolean;
  source: 'homework' | 'other';
  outcome: 'ok' | 'error' | null;
  errorType: string | null;
  codeChanged: boolean | null;
  choiceId: string | null;
  correct: boolean | null;
  attempt: number | null;
}

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
  /** 可上地图的市名，例如「日照」。省级、未知、境外为 null。 */
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

const ERROR_TYPE_RE = /^[A-Za-z][A-Za-z0-9_]{0,40}$/;

export function normalizeErrorType(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return ERROR_TYPE_RE.test(trimmed) ? trimmed : null;
}

export function normalizeChoiceId(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.replace(/[\u0000-\u001f]/g, '').trim();
  if (!trimmed) return null;
  return clip(trimmed, 40);
}

function signalDefaults(): Pick<
  StoredHit,
  'outcome' | 'errorType' | 'codeChanged' | 'choiceId' | 'correct' | 'attempt'
> {
  return {
    outcome: null,
    errorType: null,
    codeChanged: null,
    choiceId: null,
    correct: null,
    attempt: null,
  };
}

export function isHitType(value: string): value is HitType {
  return (HIT_TYPES as readonly string[]).includes(value);
}

export function clip(value: string, max: number): string {
  return value.length <= max ? value : value.slice(0, max);
}

function asTrimmedString(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  const s = value.trim();
  if (!s) return null;
  return clip(s, max);
}

export function classifyDevice(ua: string, chMobile: string | null): DeviceKind {
  const hint = (chMobile || '').trim();
  if (hint === '?1' || hint === '1') return 'mobile';
  const u = ua.toLowerCase();
  if (/ipad|tablet|playbook|silk/.test(u)) return 'tablet';
  if (/mobile|iphone|android.+mobile|windows phone/.test(u)) return 'mobile';
  return 'desktop';
}

/** YYYY-MM-DD in Asia/Shanghai */
export function shanghaiDate(isoOrDate: string | Date): string {
  const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(d.getTime())) return shanghaiDate(new Date());
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(d);
  const y = parts.find((p) => p.type === 'year')?.value;
  const m = parts.find((p) => p.type === 'month')?.value;
  const day = parts.find((p) => p.type === 'day')?.value;
  return `${y}-${m}-${day}`;
}

export function shanghaiHour(iso: string): number {
  const d = new Date(iso);
  const hour = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Shanghai',
    hour: 'numeric',
    hourCycle: 'h23',
  }).format(d);
  return Number.parseInt(hour, 10);
}

export function formatShanghaiDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(d);
}

/** Inclusive UTC range covering a Shanghai calendar day. */
export function shanghaiDayUtcRange(dateYmd: string): { startIso: string; endIso: string } {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateYmd);
  if (!m) {
    return shanghaiDayUtcRange(shanghaiDate(new Date()));
  }
  const start = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), -8, 0, 0, 0));
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { startIso: start.toISOString(), endIso: end.toISOString() };
}

export function isValidDateYmd(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/** 含今天在内的 7 个北京时间自然日，endIso 为明天 0 点（不含）。 */
export function shanghaiLast7Range(now = new Date()): { startIso: string; endIso: string; days: string[] } {
  const { endIso } = shanghaiDayUtcRange(shanghaiDate(now));
  const endMs = new Date(endIso).getTime();
  const startMs = endMs - 7 * 24 * 60 * 60 * 1000;
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    days.push(shanghaiDate(new Date(endMs - i * 24 * 60 * 60 * 1000 - 60 * 60 * 1000)));
  }
  return { startIso: new Date(startMs).toISOString(), endIso, days };
}

const MUNICIPALITIES = ['北京', '上海', '天津', '重庆'];
const SARS = ['香港', '澳门'];

/** 从「山东省日照市」取出「日照」。只有省、未知或境外时返回 null。 */
export function visitCityName(region: string | null | undefined): string | null {
  if (!region) return null;
  const text = region.trim();
  if (!text || text === '未知地区' || text === '中国') return null;
  for (const name of SARS) {
    if (text.startsWith(name)) return name;
  }
  for (const name of MUNICIPALITIES) {
    if (text === `${name}市` || text.startsWith(`${name}市`)) return name;
  }
  const matched = /(?:省|自治区)(.+)市$/.exec(text);
  if (matched?.[1]) return matched[1];
  if (text.endsWith('市') && !/省|自治区/.test(text)) return text.slice(0, -1);
  return null;
}

export interface OverviewDayRow {
  day: string;
  sessions: number;
  pv: number;
  homeworkOpens: number;
}

export interface OverviewCityRow {
  key: string;
  total: number;
  last7: number;
}

function countNamedCities(rows: OverviewCity[], field: 'total' | 'last7'): number {
  const names = new Set<string>();
  for (const row of rows) {
    if (row[field] <= 0 || !row.name) continue;
    names.add(row.name);
  }
  return names.size;
}

const PV_TYPES_OVERVIEW = new Set<HitType>(['session_start', 'lesson_view', 'scene_view']);

function sessionFirstHits(hits: StoredHit[]): StoredHit[] {
  const firstBySession = new Map<string, StoredHit>();
  for (const hit of hits) {
    if (hit.type !== 'session_start') continue;
    const prev = firstBySession.get(hit.sessionId);
    if (!prev || hit.ts < prev.ts) firstBySession.set(hit.sessionId, hit);
  }
  for (const hit of hits) {
    if (firstBySession.has(hit.sessionId)) continue;
    const prev = firstBySession.get(hit.sessionId);
    if (!prev || hit.ts < prev.ts) firstBySession.set(hit.sessionId, hit);
  }
  return [...firstBySession.values()];
}

function totalsOf(hits: StoredHit[]): Omit<OverviewTotals, 'cities'> {
  return {
    sessions: uniqueSessionCount(hits),
    pv: hits.filter((hit) => PV_TYPES_OVERVIEW.has(hit.type)).length,
    homeworkOpens: homeworkOpenSessions(hits),
  };
}

/** 用已加载的访问记录算出累计和近 7 天。本地模拟与单测走这里，线上走数据库聚合。 */
export function buildOverview(hits: StoredHit[], excludeTeacher = true, now = new Date()): OverviewResult {
  const range = shanghaiLast7Range(now);
  const scoped = excludeTeacher ? studentHits(hits) : hits;
  const last7Hits = scoped.filter((hit) => hit.ts >= range.startIso && hit.ts < range.endIso);
  const activeSessions = new Set(last7Hits.map((hit) => hit.sessionId));
  const regionCounts = new Map<string, { total: number; last7: number }>();
  for (const hit of sessionFirstHits(scoped)) {
    const key = hit.region?.trim() || '未知地区';
    const row = regionCounts.get(key) ?? { total: 0, last7: 0 };
    row.total += 1;
    if (activeSessions.has(hit.sessionId)) row.last7 += 1;
    regionCounts.set(key, row);
  }
  const dayMap = new Map<string, StoredHit[]>();
  for (const hit of last7Hits) {
    const day = shanghaiDate(hit.ts);
    const list = dayMap.get(day) ?? [];
    list.push(hit);
    dayMap.set(day, list);
  }
  return shapeOverview({
    excludeTeacher,
    days: range.days,
    totals: totalsOf(scoped),
    last7: totalsOf(last7Hits),
    dayRows: [...dayMap.entries()].map(([day, list]) => ({ day, ...totalsOf(list) })),
    cityRows: [...regionCounts.entries()].map(([key, row]) => ({ key, ...row })),
  });
}

export function shapeOverview(input: {
  excludeTeacher: boolean;
  days: string[];
  totals: Omit<OverviewTotals, 'cities'>;
  last7: Omit<OverviewTotals, 'cities'>;
  dayRows: OverviewDayRow[];
  cityRows: OverviewCityRow[];
}): OverviewResult {
  const byDay = new Map(input.dayRows.map((row) => [row.day, row]));
  const days = input.days.map((date) => {
    const row = byDay.get(date);
    return {
      date,
      sessions: row?.sessions ?? 0,
      pv: row?.pv ?? 0,
      homeworkOpens: row?.homeworkOpens ?? 0,
    };
  });
  const cities = input.cityRows
    .map((row) => ({
      key: row.key,
      name: visitCityName(row.key),
      total: row.total,
      last7: row.last7,
    }))
    .sort((a, b) => b.total - a.total || b.last7 - a.last7);
  const totals = { ...input.totals, cities: countNamedCities(cities, 'total') };
  const last7 = { ...input.last7, cities: countNamedCities(cities, 'last7') };
  return {
    excludeTeacher: input.excludeTeacher,
    totals,
    last7,
    days,
    cities,
    note: input.excludeTeacher
      ? '累计与近 7 天已排除教师解锁会话。会话按独立会话计，城市取该会话第一次访问的地区。'
      : '累计与近 7 天含教师演示会话。会话按独立会话计，城市取该会话第一次访问的地区。',
  };
}

export type ParseHitResult =
  | { ok: true; hit: StoredHit }
  | { ok: false; drop: true }
  | { ok: false; drop: false; error: string };

export function parseIncomingHit(
  body: IncomingHit,
  meta: { ip: string; device: DeviceKind; region?: string | null; nowIso?: string },
): ParseHitResult {
  const typeRaw = typeof body.type === 'string' ? body.type.trim() : '';
  if (!isHitType(typeRaw)) {
    return { ok: false, drop: false, error: '未知事件类型' };
  }

  const sessionId = asTrimmedString(body.sessionId, MAX_ID_LEN);
  if (!sessionId || !/^[A-Za-z0-9_-]{8,64}$/.test(sessionId)) {
    return { ok: false, drop: false, error: 'sessionId 无效' };
  }

  let ts = meta.nowIso ?? new Date().toISOString();
  if (typeof body.ts === 'string') {
    const parsed = new Date(body.ts);
    if (!Number.isNaN(parsed.getTime())) {
      ts = parsed.toISOString();
    }
  }

  const path = asTrimmedString(body.path, MAX_PATH_LEN);
  const referrer = asTrimmedString(body.referrer, MAX_REFERER_LEN);
  const lessonId = asTrimmedString(body.lessonId, MAX_ID_LEN);
  const sceneId = asTrimmedString(body.sceneId, MAX_ID_LEN);
  const partId = asTrimmedString(body.partId, MAX_ID_LEN);

  let sceneIndex: number | null = null;
  if (typeof body.sceneIndex === 'number' && Number.isInteger(body.sceneIndex)) {
    if (body.sceneIndex < 0 || body.sceneIndex > 9999) {
      return { ok: false, drop: false, error: 'sceneIndex 无效' };
    }
    sceneIndex = body.sceneIndex;
  }

  let dwellSeconds: number | null = null;
  if (typeRaw === 'scene_dwell') {
    const seconds = typeof body.seconds === 'number' ? body.seconds : Number(body.seconds);
    if (!Number.isFinite(seconds)) {
      return { ok: false, drop: true };
    }
    if (seconds < DWELL_MIN_SECONDS) {
      return { ok: false, drop: true };
    }
    dwellSeconds = Math.min(Math.round(seconds), 24 * 60 * 60);
  }

  if (typeRaw === 'lesson_view' && !lessonId) {
    return { ok: false, drop: false, error: '缺少 lessonId' };
  }
  if (typeRaw === 'homework_open' && !lessonId) {
    return { ok: false, drop: false, error: '缺少 lessonId' };
  }
  const needsScene =
    typeRaw === 'scene_view' ||
    typeRaw === 'scene_dwell' ||
    typeRaw === 'run' ||
    typeRaw === 'run_result' ||
    typeRaw === 'choice' ||
    typeRaw === 'lesson_complete';
  if ((needsScene || typeRaw === 'first_run') && !lessonId) {
    return { ok: false, drop: false, error: '缺少 lessonId' };
  }
  if (needsScene && sceneIndex == null) {
    return { ok: false, drop: false, error: '缺少 sceneIndex' };
  }

  const signals = signalDefaults();
  if (typeRaw === 'run_result') {
    if (body.outcome !== 'ok' && body.outcome !== 'error') {
      return { ok: false, drop: false, error: 'outcome 无效' };
    }
    signals.outcome = body.outcome;
    signals.codeChanged = body.codeChanged === true;
    if (body.outcome === 'error') {
      signals.errorType = normalizeErrorType(body.errorType) ?? 'Error';
    }
  }
  if (typeRaw === 'choice') {
    const choiceId = normalizeChoiceId(body.choiceId);
    const attempt = typeof body.attempt === 'number' ? body.attempt : Number(body.attempt);
    if (!choiceId || !Number.isInteger(attempt) || attempt < 1 || attempt > 20) {
      return { ok: false, drop: true };
    }
    if (body.correct !== true && body.correct !== false) {
      return { ok: false, drop: true };
    }
    signals.choiceId = choiceId;
    signals.correct = body.correct;
    signals.attempt = attempt;
  }
  if (typeRaw === 'first_run') {
    const seconds = typeof body.seconds === 'number' ? body.seconds : Number(body.seconds);
    if (!Number.isFinite(seconds) || seconds < 0) {
      return { ok: false, drop: true };
    }
    dwellSeconds = Math.min(Math.round(seconds), 24 * 60 * 60);
  }

  const teacher = body.teacher === true;
  const source: 'homework' | 'other' =
    typeRaw === 'homework_open' || body.source === 'homework' ? 'homework' : 'other';

  return {
    ok: true,
    hit: {
      ts,
      type: typeRaw,
      sessionId,
      path: path,
      referrer: typeRaw === 'session_start' ? referrer : null,
      lessonId,
      sceneIndex,
      sceneId,
      partId,
      dwellSeconds,
      ip: clip(meta.ip || 'unknown', 64),
      device: meta.device,
      region: asTrimmedString(meta.region, 40),
      teacher,
      source,
      ...signals,
    },
  };
}

const PV_TYPES = new Set<HitType>(['session_start', 'lesson_view', 'scene_view']);

export function uniqueSessionCount(hits: StoredHit[]): number {
  return new Set(hits.map((h) => h.sessionId)).size;
}

function countMap(entries: Array<string | null>, emptyKey: string): CountRow[] {
  const map = new Map<string, number>();
  for (const raw of entries) {
    const key = raw && raw.trim() ? raw.trim() : emptyKey;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

export function teacherSessionIds(hits: StoredHit[]): Set<string> {
  return new Set(hits.filter((h) => h.teacher).map((h) => h.sessionId));
}

export function studentHits(hits: StoredHit[]): StoredHit[] {
  const teachers = teacherSessionIds(hits);
  return hits.filter((h) => !teachers.has(h.sessionId));
}

function homeworkOpenSessions(hits: StoredHit[]): number {
  return new Set(hits.filter((h) => h.type === 'homework_open').map((h) => h.sessionId)).size;
}

export function buildSummary(
  dateYmd: string,
  allHits: StoredHit[],
  excludeTeacher = true,
): SummaryResult {
  const teachers = teacherSessionIds(allHits);
  const teacherUv = teachers.size;
  const students = studentHits(allHits);
  const studentUv = uniqueSessionCount(students);
  const hits = excludeTeacher ? students : allHits;
  const uv = uniqueSessionCount(hits);
  const pv = hits.filter((h) => PV_TYPES.has(h.type)).length;
  const homeworkOpens = homeworkOpenSessions(hits);

  const firstBySession = new Map<string, StoredHit>();
  for (const hit of hits) {
    if (hit.type !== 'session_start') continue;
    const prev = firstBySession.get(hit.sessionId);
    if (!prev || hit.ts < prev.ts) firstBySession.set(hit.sessionId, hit);
  }
  for (const hit of hits) {
    if (firstBySession.has(hit.sessionId)) continue;
    const prev = firstBySession.get(hit.sessionId);
    if (!prev || hit.ts < prev.ts) firstBySession.set(hit.sessionId, hit);
  }

  const firstHits = [...firstBySession.values()];
  const hourCounts = Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 }));
  for (const hit of hits.filter((h) => PV_TYPES.has(h.type) || h.type === 'homework_open')) {
    const hour = shanghaiHour(hit.ts);
    if (hour >= 0 && hour < 24) hourCounts[hour]!.count += 1;
  }

  const recentSource = [...hits].sort((a, b) => (a.ts < b.ts ? 1 : -1)).slice(0, RECENT_LIMIT);

  return {
    date: dateYmd,
    excludeTeacher,
    uv,
    pv,
    studentUv,
    teacherUv,
    homeworkOpens,
    byReferrer: countMap(
      firstHits.map((h) => h.referrer),
      '直接打开 / 无来源',
    ),
    byDevice: countMap(
      firstHits.map((h) => h.device),
      'unknown',
    ),
    byRegion: countMap(
      firstHits.map((h) => h.region),
      '未知地区',
    ),
    timeline: hourCounts,
    recent: recentSource.map((h) => ({
      ts: h.ts,
      tsLocal: formatShanghaiDateTime(h.ts),
      ip: h.ip,
      device: h.device,
      region: h.region,
      referrer: h.referrer,
      path: h.path,
      lessonId: h.lessonId,
      sceneIndex: h.sceneIndex,
    })),
    note: excludeTeacher
      ? '默认已排除教师解锁会话。人数按独立会话，不以 IP 去重。课后作业打开数来自封面「作业」链接。'
      : '含教师演示会话。人数按独立会话，不以 IP 去重。',
    emptyStudents: studentUv === 0,
  };
}

export function buildLessonHeat(hits: StoredHit[], excludeTeacher = true): LessonHeat[] {
  const scoped = excludeTeacher ? studentHits(hits) : hits;
  const byLesson = new Map<string, StoredHit[]>();
  for (const hit of scoped) {
    if (!hit.lessonId) continue;
    const list = byLesson.get(hit.lessonId) ?? [];
    list.push(hit);
    byLesson.set(hit.lessonId, list);
  }

  const result: LessonHeat[] = [];
  for (const [lessonId, list] of byLesson) {
    const views = list.filter((h) => h.type === 'lesson_view' || h.type === 'scene_view').length;
    const sessions = new Set(list.map((h) => h.sessionId)).size;
    const homeworkOpens = new Set(
      list.filter((h) => h.type === 'homework_open').map((h) => h.sessionId),
    ).size;
    const runs = list.filter((h) => h.type === 'run').length;
    const dwells = list.filter((h) => h.type === 'scene_dwell' && h.dwellSeconds != null);
    const avgDwellSeconds =
      dwells.length === 0
        ? 0
        : Math.round(dwells.reduce((s, h) => s + (h.dwellSeconds ?? 0), 0) / dwells.length);

    const sceneMap = new Map<number, StoredHit[]>();
    for (const hit of list) {
      if (hit.sceneIndex == null) continue;
      const rows = sceneMap.get(hit.sceneIndex) ?? [];
      rows.push(hit);
      sceneMap.set(hit.sceneIndex, rows);
    }

    const scenes = [...sceneMap.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([sceneIndex, rows]) => {
        const sceneDwells = rows.filter((h) => h.type === 'scene_dwell' && h.dwellSeconds != null);
        const lastMeta = [...rows].reverse().find((h) => h.sceneId || h.partId);
        return {
          sceneIndex,
          sceneId: lastMeta?.sceneId ?? null,
          partId: lastMeta?.partId ?? null,
          views: rows.filter((h) => h.type === 'scene_view').length,
          avgDwellSeconds:
            sceneDwells.length === 0
              ? 0
              : Math.round(
                  sceneDwells.reduce((s, h) => s + (h.dwellSeconds ?? 0), 0) / sceneDwells.length,
                ),
          runs: rows.filter((h) => h.type === 'run').length,
          runOk: rows.filter((h) => h.type === 'run_result' && h.outcome === 'ok').length,
          runError: rows.filter((h) => h.type === 'run_result' && h.outcome === 'error').length,
          choices: rows.filter((h) => h.type === 'choice').length,
          choicesCorrect: rows.filter((h) => h.type === 'choice' && h.correct).length,
        };
      });

    const results = list.filter((h) => h.type === 'run_result');
    const choices = list.filter((h) => h.type === 'choice');
    const firstRuns = list.filter((h) => h.type === 'first_run' && h.dwellSeconds != null);
    result.push({
      lessonId,
      views,
      sessions,
      homeworkOpens,
      runs,
      avgDwellSeconds,
      scenes,
      runOk: results.filter((h) => h.outcome === 'ok').length,
      runError: results.filter((h) => h.outcome === 'error').length,
      codeChanged: results.filter((h) => h.codeChanged === true).length,
      codeSame: results.filter((h) => h.codeChanged === false).length,
      choices: choices.length,
      choicesCorrect: choices.filter((h) => h.correct).length,
      firstTryCorrect: choices.filter((h) => h.correct && h.attempt === 1).length,
      completions: new Set(list.filter((h) => h.type === 'lesson_complete').map((h) => h.sessionId)).size,
      avgFirstRunSeconds:
        firstRuns.length === 0
          ? 0
          : Math.round(firstRuns.reduce((s, h) => s + (h.dwellSeconds ?? 0), 0) / firstRuns.length),
      errorTypes: countMap(
        results.filter((h) => h.outcome === 'error').map((h) => h.errorType),
        'Error',
      ),
    });
  }

  return result.sort((a, b) => b.views - a.views);
}

export function allowRate(prev: number[], now: number, limit = RATE_LIMIT_PER_MIN, windowMs = 60_000): {
  ok: boolean;
  next: number[];
} {
  const next = prev.filter((t) => now - t < windowMs);
  if (next.length >= limit) return { ok: false, next };
  next.push(now);
  return { ok: true, next };
}
