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
  'hint_view',
  'ai_review',
] as const;

export type HitType = (typeof HIT_TYPES)[number];
export type DeviceKind = 'desktop' | 'mobile' | 'tablet';

export const DWELL_MIN_SECONDS = 10;
export const DWELL_MAX_SECONDS = 600;
export const SCENE_VIEW_DEDUP_MS = 10_000;
export const SCENE_VIEW_DEBOUNCE_MS = 400;
export const RUN_DEDUP_MS = 1_500;
export const RECENT_LIMIT = 50;
export const RATE_LIMIT_PER_MIN = 60;
export const SESSION_RATE_LIMIT_PER_MIN = 120;
export const IP_RATE_LIMIT_PER_MIN = 1_500;
export const MAX_REFERER_LEN = 200;
export const MAX_PATH_LEN = 120;
export const MAX_ID_LEN = 64;

export interface IncomingHit {
  type?: unknown;
  ts?: unknown;
  path?: unknown;
  referrer?: unknown;
  sessionId?: unknown;
  visitorId?: unknown;
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
  hintLevel?: unknown;
}

export interface StoredHit {
  ts: string;
  type: HitType;
  sessionId: string;
  visitorId?: string | null;
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
  hintLevel?: number | null;
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
  type: HitType;
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
  /** 可上地图的市名，例如「日照」。省级、未知、境外为 null。 */
  name: string | null;
  total: number;
  last7: number;
}

export interface OverviewProvince {
  /** 与 chinaProvinces.json 中 properties.name 对齐，如「山东省」「北京市」 */
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

const ERROR_TYPE_RE = /^[A-Za-z][A-Za-z0-9_]{0,40}$/;
const ID_TOKEN_RE = /^[A-Za-z0-9_-]{8,64}$/;

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
  'outcome' | 'errorType' | 'codeChanged' | 'choiceId' | 'correct' | 'attempt' | 'hintLevel'
> {
  return {
    outcome: null,
    errorType: null,
    codeChanged: null,
    choiceId: null,
    correct: null,
    attempt: null,
    hintLevel: null,
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

/** 闭区间 [startYmd, endYmd] 对应的北京时间 UTC 范围 */
export function shanghaiDateSpanUtcRange(
  startYmd: string,
  endYmd: string,
): { startIso: string; endIso: string; label: string } {
  const [fromYmd, toYmd] = startYmd <= endYmd ? [startYmd, endYmd] : [endYmd, startYmd];
  const { startIso } = shanghaiDayUtcRange(fromYmd);
  const { endIso } = shanghaiDayUtcRange(toYmd);
  return {
    startIso,
    endIso,
    label: fromYmd === toYmd ? fromYmd : `${fromYmd} ~ ${toYmd}`,
  };
}

export function isValidDateYmd(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/** 解析查询参数中的时间范围（兼容 ?date=、?start=&end=、?range=last7|all） */
export function resolveQueryRange(
  params: URLSearchParams,
  now = new Date(),
): { ok: true; startIso: string; endIso: string; label: string } | { ok: false; error: string } {
  const rangeMode = params.get('range')?.trim();
  if (rangeMode === 'all') {
    return {
      ok: true,
      startIso: '2000-01-01T00:00:00.000Z',
      endIso: '2100-01-01T00:00:00.000Z',
      label: '累计全部',
    };
  }
  if (rangeMode === 'last7') {
    const r = shanghaiLast7Range(now);
    return {
      ok: true,
      startIso: r.startIso,
      endIso: r.endIso,
      label: `${r.days[0]} ~ ${r.days[r.days.length - 1]}`,
    };
  }
  const startParam = params.get('start')?.trim();
  const endParam = params.get('end')?.trim();
  if (startParam || endParam) {
    const s = startParam || endParam || shanghaiDate(now);
    const e = endParam || startParam || shanghaiDate(now);
    if (!isValidDateYmd(s) || !isValidDateYmd(e)) {
      return { ok: false, error: '日期格式无效' };
    }
    return { ok: true, ...shanghaiDateSpanUtcRange(s, e) };
  }
  const dateParam = params.get('date')?.trim() || shanghaiDate(now);
  if (!isValidDateYmd(dateParam)) {
    return { ok: false, error: '日期格式无效' };
  }
  const { startIso, endIso } = shanghaiDayUtcRange(dateParam);
  return { ok: true, startIso, endIso, label: dateParam };
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
const PROVINCE_NAMES = [
  '北京市',
  '天津市',
  '河北省',
  '山西省',
  '内蒙古自治区',
  '辽宁省',
  '吉林省',
  '黑龙江省',
  '上海市',
  '江苏省',
  '浙江省',
  '安徽省',
  '福建省',
  '江西省',
  '山东省',
  '河南省',
  '湖北省',
  '湖南省',
  '广东省',
  '广西壮族自治区',
  '海南省',
  '重庆市',
  '四川省',
  '贵州省',
  '云南省',
  '西藏自治区',
  '陕西省',
  '甘肃省',
  '青海省',
  '宁夏回族自治区',
  '新疆维吾尔自治区',
  '台湾省',
  '香港特别行政区',
  '澳门特别行政区',
];

/** 从「山东省日照市」取出「日照」。只有省、未知或境外时返回 null。 */
export function visitCityName(region: string | null | undefined): string | null {
  if (!region) return null;
  const text = region.trim();
  if (!text || text === '未知地区' || text === '中国') return null;
  for (const name of SARS) {
    if (text.startsWith(name) || text.startsWith(`中国${name}`)) return name;
  }
  for (const name of MUNICIPALITIES) {
    if (text === `${name}市` || text.startsWith(`${name}市`)) return name;
  }
  const matched = /(?:省|自治区)(.+)市$/.exec(text);
  if (matched?.[1]) return matched[1];
  if (text.endsWith('市') && !/省|自治区/.test(text)) return text.slice(0, -1);
  return null;
}

/** 从「山东省日照市」或「山东省」提取标准省级名称（如「山东省」），供省份热力底图着色。 */
export function visitProvinceName(region: string | null | undefined): string | null {
  if (!region) return null;
  const text = region.trim();
  if (!text || text === '未知地区' || text === '中国') return null;
  if (text.startsWith('中国香港') || text.startsWith('香港')) return '香港特别行政区';
  if (text.startsWith('中国澳门') || text.startsWith('澳门')) return '澳门特别行政区';
  if (text.startsWith('中国台湾') || text.startsWith('台湾')) return '台湾省';
  for (const prov of PROVINCE_NAMES) {
    if (text.startsWith(prov)) return prov;
  }
  return null;
}

export interface OverviewDayRow {
  day: string;
  sessions: number;
  visitors?: number;
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

function aggregateProvinces(cityRows: OverviewCityRow[]): OverviewProvince[] {
  const map = new Map<string, { total: number; last7: number }>();
  for (const row of cityRows) {
    const prov = visitProvinceName(row.key);
    if (!prov) continue;
    const prev = map.get(prov) ?? { total: 0, last7: 0 };
    prev.total += row.total;
    prev.last7 += row.last7;
    map.set(prov, prev);
  }
  return [...map.entries()]
    .map(([name, counts]) => ({ name, ...counts }))
    .sort((a, b) => b.total - a.total || b.last7 - a.last7);
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
    visitors: uniqueVisitorCount(hits),
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

type TotalsInput = {
  sessions: number;
  visitors?: number;
  pv: number;
  homeworkOpens: number;
};

export function shapeOverview(input: {
  excludeTeacher: boolean;
  days: string[];
  totals: TotalsInput;
  last7: TotalsInput;
  dayRows: OverviewDayRow[];
  cityRows: OverviewCityRow[];
}): OverviewResult {
  const byDay = new Map(input.dayRows.map((row) => [row.day, row]));
  const days = input.days.map((date) => {
    const row = byDay.get(date);
    const sessions = row?.sessions ?? 0;
    return {
      date,
      sessions,
      visitors: row?.visitors ?? sessions,
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
  const provinces = aggregateProvinces(input.cityRows);
  const totals: OverviewTotals = {
    ...input.totals,
    visitors: input.totals.visitors ?? input.totals.sessions,
    cities: countNamedCities(cities, 'total'),
  };
  const last7: OverviewTotals = {
    ...input.last7,
    visitors: input.last7.visitors ?? input.last7.sessions,
    cities: countNamedCities(cities, 'last7'),
  };
  return {
    excludeTeacher: input.excludeTeacher,
    totals,
    last7,
    days,
    cities,
    provinces,
    note: input.excludeTeacher
      ? '累计与近 7 天已排除教师解锁会话。独立设备跨标签页合并，会话按单标签页计，城市取会话首次访问地区。'
      : '累计与近 7 天含教师演示会话。独立设备跨标签页合并，会话按单标签页计，城市取会话首次访问地区。',
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
  if (!sessionId || !ID_TOKEN_RE.test(sessionId)) {
    return { ok: false, drop: false, error: 'sessionId 无效' };
  }

  const rawVisitorId = asTrimmedString(body.visitorId, MAX_ID_LEN);
  const visitorId = rawVisitorId && ID_TOKEN_RE.test(rawVisitorId) ? rawVisitorId : null;

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
    dwellSeconds = Math.min(Math.round(seconds), DWELL_MAX_SECONDS);
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
    typeRaw === 'lesson_complete' ||
    typeRaw === 'hint_view' ||
    typeRaw === 'ai_review';
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
  if (typeRaw === 'hint_view' || typeRaw === 'ai_review') {
    const levelRaw = typeof body.hintLevel === 'number' ? body.hintLevel : Number(body.hintLevel ?? 1);
    signals.hintLevel = Number.isInteger(levelRaw) && levelRaw >= 1 && levelRaw <= 20 ? levelRaw : 1;
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
      visitorId,
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

export function uniqueVisitorCount(hits: StoredHit[]): number {
  return new Set(hits.map((h) => h.visitorId || h.sessionId)).size;
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

function medianInt(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return Math.round(sorted[mid]!);
  return Math.round(((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2);
}

/** 统计同一幕内「遇到过运行报错的会话数」以及「报错后最终跑通修复的会话数」 */
function computeErrorRecovery(rows: StoredHit[]): { errorSessions: number; fixedErrors: number } {
  const bySession = new Map<string, StoredHit[]>();
  for (const h of rows) {
    if (h.type !== 'run_result') continue;
    const list = bySession.get(h.sessionId) ?? [];
    list.push(h);
    bySession.set(h.sessionId, list);
  }
  let errorSessions = 0;
  let fixedErrors = 0;
  for (const [, seq] of bySession) {
    const ordered = seq.length > 1 ? [...seq].sort((a, b) => (a.ts < b.ts ? -1 : a.ts > b.ts ? 1 : 0)) : seq;
    let sawError = false;
    let fixed = false;
    for (const item of ordered) {
      if (item.outcome === 'error') {
        sawError = true;
      } else if (item.outcome === 'ok' && sawError) {
        fixed = true;
      }
    }
    if (sawError) errorSessions += 1;
    if (fixed) fixedErrors += 1;
  }
  return { errorSessions, fixedErrors };
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
  dateLabel: string,
  allHits: StoredHit[],
  excludeTeacher = true,
  truncated = false,
): SummaryResult {
  const teachers = teacherSessionIds(allHits);
  const teacherUv = teachers.size;
  const students = studentHits(allHits);
  const studentUv = uniqueSessionCount(students);
  const studentVisitors = uniqueVisitorCount(students);
  const hits = excludeTeacher ? students : allHits;
  const uv = uniqueSessionCount(hits);
  const visitors = uniqueVisitorCount(hits);
  const pv = hits.filter((h) => PV_TYPES.has(h.type)).length;
  const homeworkOpens = homeworkOpenSessions(hits);
  const runs = hits.filter((h) => h.type === 'run').length;

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
    date: dateLabel,
    excludeTeacher,
    uv,
    visitors,
    pv,
    studentUv,
    studentVisitors,
    teacherUv,
    homeworkOpens,
    runs,
    truncated,
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
      type: h.type,
      ip: h.ip,
      device: h.device,
      region: h.region,
      referrer: h.referrer,
      path: h.path,
      lessonId: h.lessonId,
      sceneIndex: h.sceneIndex,
    })),
    note: excludeTeacher
      ? '默认已排除教师解锁会话。独立设备合并同浏览器多标签页；课后作业打开数来自封面「作业」链接。'
      : '含教师演示会话。独立设备合并同浏览器多标签页，不以校园网共用 IP 去重。',
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
    const sessions = uniqueSessionCount(list);
    const visitors = uniqueVisitorCount(list);
    const homeworkOpens = new Set(
      list.filter((h) => h.type === 'homework_open').map((h) => h.sessionId),
    ).size;
    const runs = list.filter((h) => h.type === 'run').length;
    const dwellValues = list
      .filter((h) => h.type === 'scene_dwell' && h.dwellSeconds != null)
      .map((h) => Math.min(h.dwellSeconds ?? 0, DWELL_MAX_SECONDS));
    const avgDwellSeconds =
      dwellValues.length === 0
        ? 0
        : Math.round(dwellValues.reduce((s, v) => s + v, 0) / dwellValues.length);
    const medianDwellSeconds = medianInt(dwellValues);

    const sceneMap = new Map<number, StoredHit[]>();
    for (const hit of list) {
      if (hit.sceneIndex == null) continue;
      const rows = sceneMap.get(hit.sceneIndex) ?? [];
      rows.push(hit);
      sceneMap.set(hit.sceneIndex, rows);
    }

    let lessonErrorSessions = 0;
    let lessonFixedErrors = 0;

    const scenes: LessonSceneHeat[] = [...sceneMap.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([sceneIndex, rows]) => {
        const sceneDwellValues = rows
          .filter((h) => h.type === 'scene_dwell' && h.dwellSeconds != null)
          .map((h) => Math.min(h.dwellSeconds ?? 0, DWELL_MAX_SECONDS));
        const lastMeta = [...rows].reverse().find((h) => h.sceneId || h.partId);
        const recovery = computeErrorRecovery(rows);
        lessonErrorSessions += recovery.errorSessions;
        lessonFixedErrors += recovery.fixedErrors;
        const sceneChoices = rows.filter((h) => h.type === 'choice');
        return {
          sceneIndex,
          sceneId: lastMeta?.sceneId ?? null,
          partId: lastMeta?.partId ?? null,
          views: rows.filter((h) => h.type === 'scene_view').length,
          sessions: uniqueSessionCount(rows),
          avgDwellSeconds:
            sceneDwellValues.length === 0
              ? 0
              : Math.round(
                  sceneDwellValues.reduce((s, v) => s + v, 0) / sceneDwellValues.length,
                ),
          medianDwellSeconds: medianInt(sceneDwellValues),
          runs: rows.filter((h) => h.type === 'run').length,
          runOk: rows.filter((h) => h.type === 'run_result' && h.outcome === 'ok').length,
          runError: rows.filter((h) => h.type === 'run_result' && h.outcome === 'error').length,
          errorSessions: recovery.errorSessions,
          fixedErrors: recovery.fixedErrors,
          choices: sceneChoices.length,
          choicesCorrect: sceneChoices.filter((h) => h.correct).length,
          firstTryCorrect: sceneChoices.filter((h) => h.correct && h.attempt === 1).length,
          hintViews: rows.filter((h) => h.type === 'hint_view').length,
          aiReviews: rows.filter((h) => h.type === 'ai_review').length,
        };
      });

    const results = list.filter((h) => h.type === 'run_result');
    const choices = list.filter((h) => h.type === 'choice');
    const firstRuns = list.filter((h) => h.type === 'first_run' && h.dwellSeconds != null);
    const hintHits = list.filter((h) => h.type === 'hint_view');
    const aiHits = list.filter((h) => h.type === 'ai_review');
    result.push({
      lessonId,
      views,
      sessions,
      visitors,
      homeworkOpens,
      runs,
      avgDwellSeconds,
      medianDwellSeconds,
      scenes,
      runOk: results.filter((h) => h.outcome === 'ok').length,
      runError: results.filter((h) => h.outcome === 'error').length,
      errorSessions: lessonErrorSessions,
      fixedErrors: lessonFixedErrors,
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
      hintViews: hintHits.length,
      hintSessions: uniqueSessionCount(hintHits),
      aiReviews: aiHits.length,
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

/** 适配校园网 NAT 多人共用出口 IP：先做宽松的出口 IP 保护，再按 IP+会话 独立限流 */
export function allowClassroomHitRate(
  buckets: Map<string, number[]>,
  ip: string,
  sessionId: string | null | undefined,
  now: number,
): boolean {
  if (buckets.size > 2000) {
    for (const [k, list] of buckets) {
      const pruned = list.filter((t) => now - t < 60_000);
      if (pruned.length === 0) buckets.delete(k);
      else buckets.set(k, pruned);
    }
  }
  const ipKey = `ip:${ip}`;
  const ipCheck = allowRate(buckets.get(ipKey) ?? [], now, IP_RATE_LIMIT_PER_MIN);
  buckets.set(ipKey, ipCheck.next);
  if (!ipCheck.ok) return false;

  const sid = typeof sessionId === 'string' && sessionId.trim() ? sessionId.trim().slice(0, 64) : 'anon';
  const sessionKey = `sid:${ip}:${sid}`;
  const sessionCheck = allowRate(buckets.get(sessionKey) ?? [], now, SESSION_RATE_LIMIT_PER_MIN);
  buckets.set(sessionKey, sessionCheck.next);
  return sessionCheck.ok;
}
