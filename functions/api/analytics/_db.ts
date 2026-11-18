import type { StoredHit } from './_logic';

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<unknown>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  exec?(query: string): Promise<unknown>;
}

export const DEFAULT_HITS_LIMIT = 100_000;

const CREATE_TABLE_SQL = `CREATE TABLE IF NOT EXISTS hits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL,
  type TEXT NOT NULL,
  session_id TEXT NOT NULL,
  path TEXT,
  referrer TEXT,
  lesson_id TEXT,
  scene_index INTEGER,
  scene_id TEXT,
  part_id TEXT,
  dwell_seconds INTEGER,
  ip TEXT,
  device TEXT,
  teacher INTEGER NOT NULL DEFAULT 0,
  source TEXT,
  detail TEXT
)`;

const ALTER_SQL = [
  'ALTER TABLE hits ADD COLUMN teacher INTEGER NOT NULL DEFAULT 0',
  'ALTER TABLE hits ADD COLUMN source TEXT',
  'ALTER TABLE hits ADD COLUMN detail TEXT',
];

const INDEX_SQL = [
  'CREATE INDEX IF NOT EXISTS idx_hits_ts ON hits(ts)',
  'CREATE INDEX IF NOT EXISTS idx_hits_lesson ON hits(lesson_id)',
  'CREATE INDEX IF NOT EXISTS idx_hits_session ON hits(session_id)',
  'CREATE INDEX IF NOT EXISTS idx_hits_teacher_session ON hits(teacher, session_id)',
];

let ensured = false;

/** D1 的 exec 往往只接受单条语句；Pages 上用 prepare().run() 更稳。 */
async function runSql(db: D1Database, sql: string): Promise<void> {
  await db.prepare(sql).run();
}

export async function ensureHitsTable(db: D1Database): Promise<void> {
  if (ensured) return;
  await runSql(db, CREATE_TABLE_SQL);
  for (const sql of ALTER_SQL) {
    try {
      await runSql(db, sql);
    } catch {
      // column already exists
    }
  }
  for (const sql of INDEX_SQL) {
    await runSql(db, sql);
  }
  ensured = true;
}

export function resetHitsTableCache(): void {
  ensured = false;
}

export async function insertHit(db: D1Database, hit: StoredHit): Promise<void> {
  await ensureHitsTable(db);
  await db
    .prepare(
      `INSERT INTO hits (ts, type, session_id, path, referrer, lesson_id, scene_index, scene_id, part_id, dwell_seconds, ip, device, teacher, source, detail)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      hit.ts,
      hit.type,
      hit.sessionId,
      hit.path,
      hit.referrer,
      hit.lessonId,
      hit.sceneIndex,
      hit.sceneId,
      hit.partId,
      hit.dwellSeconds,
      hit.ip,
      hit.device,
      hit.teacher ? 1 : 0,
      hit.source,
      encodeDetail(hit),
    )
    .run();
}

interface HitRow {
  ts: string;
  type: StoredHit['type'];
  session_id: string;
  path: string | null;
  referrer: string | null;
  lesson_id: string | null;
  scene_index: number | null;
  scene_id: string | null;
  part_id: string | null;
  dwell_seconds: number | null;
  ip: string;
  device: StoredHit['device'];
  teacher?: number | null;
  source?: string | null;
  detail?: string | null;
}

function encodeDetail(hit: StoredHit): string | null {
  const detail: Record<string, string | number> = {};
  if (hit.visitorId) detail.vid = hit.visitorId;
  if (hit.outcome) detail.outcome = hit.outcome;
  if (hit.errorType) detail.errorType = hit.errorType;
  if (hit.codeChanged != null) detail.codeChanged = hit.codeChanged ? 1 : 0;
  if (hit.choiceId) detail.choiceId = hit.choiceId;
  if (hit.correct != null) detail.correct = hit.correct ? 1 : 0;
  if (hit.attempt != null) detail.attempt = hit.attempt;
  if (hit.hintLevel != null) detail.level = hit.hintLevel;
  if (hit.region) detail.region = hit.region;
  return Object.keys(detail).length === 0 ? null : JSON.stringify(detail);
}

function decodeDetail(raw: string | null | undefined): Pick<
  StoredHit,
  'visitorId' | 'outcome' | 'errorType' | 'codeChanged' | 'choiceId' | 'correct' | 'attempt' | 'hintLevel' | 'region'
> {
  const empty = {
    visitorId: null,
    outcome: null,
    errorType: null,
    codeChanged: null,
    choiceId: null,
    correct: null,
    attempt: null,
    hintLevel: null,
    region: null,
  } as const;
  if (!raw) return { ...empty };
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      visitorId: typeof parsed.vid === 'string' && parsed.vid.trim() ? parsed.vid : null,
      outcome: parsed.outcome === 'ok' || parsed.outcome === 'error' ? parsed.outcome : null,
      errorType: typeof parsed.errorType === 'string' ? parsed.errorType : null,
      codeChanged: parsed.codeChanged === 1 ? true : parsed.codeChanged === 0 ? false : null,
      choiceId: typeof parsed.choiceId === 'string' ? parsed.choiceId : null,
      correct: parsed.correct === 1 ? true : parsed.correct === 0 ? false : null,
      attempt: typeof parsed.attempt === 'number' ? parsed.attempt : null,
      hintLevel: typeof parsed.level === 'number' ? parsed.level : null,
      region: typeof parsed.region === 'string' && parsed.region.trim() ? parsed.region : null,
    };
  } catch {
    return { ...empty };
  }
}

function rowToHit(row: HitRow): StoredHit {
  return {
    ts: row.ts,
    type: row.type,
    sessionId: row.session_id,
    path: row.path,
    referrer: row.referrer,
    lessonId: row.lesson_id,
    sceneIndex: row.scene_index,
    sceneId: row.scene_id,
    partId: row.part_id,
    dwellSeconds: row.dwell_seconds,
    ip: row.ip,
    device: row.device,
    teacher: row.teacher === 1,
    source: row.source === 'homework' ? 'homework' : 'other',
    ...decodeDetail(row.detail),
  };
}

const SELECT_HITS_SQL = `SELECT ts, type, session_id, path, referrer, lesson_id, scene_index, scene_id, part_id, dwell_seconds, ip, device, teacher, source, detail
       FROM hits WHERE ts >= ? AND ts < ? ORDER BY ts ASC LIMIT ?`;

async function selectHitsInRange(
  db: D1Database,
  startIso: string,
  endIso: string,
  limit: number,
): Promise<StoredHit[]> {
  const { results } = await db.prepare(SELECT_HITS_SQL).bind(startIso, endIso, limit).all<HitRow>();
  return (results ?? []).map(rowToHit);
}

export async function loadHitsInRange(
  db: D1Database,
  startIso: string,
  endIso: string,
  limit = DEFAULT_HITS_LIMIT,
): Promise<StoredHit[]> {
  try {
    return await selectHitsInRange(db, startIso, endIso, limit);
  } catch {
    await ensureHitsTable(db);
    return await selectHitsInRange(db, startIso, endIso, limit);
  }
}

export async function loadHitsWindow(
  db: D1Database,
  startIso: string,
  endIso: string,
  limit = DEFAULT_HITS_LIMIT,
): Promise<{ hits: StoredHit[]; truncated: boolean }> {
  const rows = await loadHitsInRange(db, startIso, endIso, limit + 1);
  if (rows.length > limit) {
    return { hits: rows.slice(0, limit), truncated: true };
  }
  return { hits: rows, truncated: false };
}

const TEACHERS_CTE = `teachers AS (SELECT DISTINCT session_id FROM hits WHERE teacher = 1)`;

const TOTALS_SQL = `WITH ${TEACHERS_CTE}
SELECT
  COUNT(DISTINCT h.session_id) AS sessions,
  COUNT(DISTINCT COALESCE(json_extract(h.detail, '$.vid'), h.session_id)) AS visitors,
  COALESCE(SUM(CASE WHEN h.type IN ('session_start', 'lesson_view', 'scene_view') THEN 1 ELSE 0 END), 0) AS pv,
  COUNT(DISTINCT CASE WHEN h.type = 'homework_open' THEN h.session_id END) AS homework
FROM hits h
WHERE (? = 1 OR h.session_id NOT IN (SELECT session_id FROM teachers))`;

const RANGE_TOTALS_SQL = `${TOTALS_SQL} AND h.ts >= ? AND h.ts < ?`;

const DAILY_SQL = `WITH ${TEACHERS_CTE}
SELECT
  date(h.ts, '+8 hours') AS day,
  COUNT(DISTINCT h.session_id) AS sessions,
  COUNT(DISTINCT COALESCE(json_extract(h.detail, '$.vid'), h.session_id)) AS visitors,
  COALESCE(SUM(CASE WHEN h.type IN ('session_start', 'lesson_view', 'scene_view') THEN 1 ELSE 0 END), 0) AS pv,
  COUNT(DISTINCT CASE WHEN h.type = 'homework_open' THEN h.session_id END) AS homework
FROM hits h
WHERE (? = 1 OR h.session_id NOT IN (SELECT session_id FROM teachers))
  AND h.ts >= ? AND h.ts < ?
GROUP BY day`;

const CITIES_SQL = `WITH ${TEACHERS_CTE},
scoped AS (
  SELECT h.ts AS ts, h.type AS type, h.session_id AS session_id, h.detail AS detail
  FROM hits h
  WHERE ? = 1 OR h.session_id NOT IN (SELECT session_id FROM teachers)
),
starts AS (
  SELECT session_id, MIN(ts) AS ts
  FROM scoped
  WHERE type = 'session_start'
  GROUP BY session_id
),
anys AS (
  SELECT session_id, MIN(ts) AS ts
  FROM scoped
  GROUP BY session_id
),
first_ts AS (
  SELECT a.session_id AS session_id, COALESCE(s.ts, a.ts) AS ts,
         CASE WHEN s.session_id IS NULL THEN 0 ELSE 1 END AS from_start
  FROM anys a
  LEFT JOIN starts s ON s.session_id = a.session_id
),
active7 AS (
  SELECT DISTINCT session_id FROM scoped WHERE ts >= ? AND ts < ?
),
regions AS (
  SELECT
    f.session_id AS session_id,
    CASE WHEN f.from_start = 1 THEN (
      SELECT json_extract(s2.detail, '$.region')
      FROM scoped s2
      WHERE s2.session_id = f.session_id AND s2.ts = f.ts AND s2.type = 'session_start'
      LIMIT 1
    ) ELSE (
      SELECT json_extract(s2.detail, '$.region')
      FROM scoped s2
      WHERE s2.session_id = f.session_id AND s2.ts = f.ts
      LIMIT 1
    ) END AS region,
    CASE WHEN f.session_id IN (SELECT session_id FROM active7) THEN 1 ELSE 0 END AS in7
  FROM first_ts f
)
SELECT
  CASE WHEN region IS NULL OR TRIM(region) = '' THEN '未知地区' ELSE TRIM(region) END AS key,
  COUNT(*) AS total,
  SUM(in7) AS last7
FROM regions
GROUP BY key
ORDER BY total DESC`;

interface TotalsRow {
  sessions: number | null;
  visitors?: number | null;
  pv: number | null;
  homework: number | null;
}

interface DailyRow {
  day: string;
  sessions: number | null;
  visitors?: number | null;
  pv: number | null;
  homework: number | null;
}

interface CitySqlRow {
  key: string;
  total: number | null;
  last7: number | null;
}

function asCount(value: number | null | undefined): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export interface OverviewQuery {
  includeTeacher: boolean;
  last7Start: string;
  last7End: string;
}

export interface OverviewAggregates {
  totals: { sessions: number; visitors: number; pv: number; homeworkOpens: number };
  last7: { sessions: number; visitors: number; pv: number; homeworkOpens: number };
  dayRows: { day: string; sessions: number; visitors: number; pv: number; homeworkOpens: number }[];
  cityRows: { key: string; total: number; last7: number }[];
}

function mapTotals(row: TotalsRow | undefined): OverviewAggregates['totals'] {
  const sessions = asCount(row?.sessions);
  const visitors = row?.visitors != null ? asCount(row.visitors) : sessions;
  return {
    sessions,
    visitors,
    pv: asCount(row?.pv),
    homeworkOpens: asCount(row?.homework),
  };
}

async function queryOverview(db: D1Database, query: OverviewQuery): Promise<OverviewAggregates> {
  const includeFlag = query.includeTeacher ? 1 : 0;
  const totalsRes = await db.prepare(TOTALS_SQL).bind(includeFlag).all<TotalsRow>();
  const last7Res = await db
    .prepare(RANGE_TOTALS_SQL)
    .bind(includeFlag, query.last7Start, query.last7End)
    .all<TotalsRow>();
  const dailyRes = await db
    .prepare(DAILY_SQL)
    .bind(includeFlag, query.last7Start, query.last7End)
    .all<DailyRow>();
  const cityRes = await db
    .prepare(CITIES_SQL)
    .bind(includeFlag, query.last7Start, query.last7End)
    .all<CitySqlRow>();
  return {
    totals: mapTotals(totalsRes.results?.[0]),
    last7: mapTotals(last7Res.results?.[0]),
    dayRows: (dailyRes.results ?? []).map((row) => {
      const sessions = asCount(row.sessions);
      return {
        day: row.day,
        sessions,
        visitors: row.visitors != null ? asCount(row.visitors) : sessions,
        pv: asCount(row.pv),
        homeworkOpens: asCount(row.homework),
      };
    }),
    cityRows: (cityRes.results ?? []).map((row) => ({
      key: row.key,
      total: asCount(row.total),
      last7: asCount(row.last7),
    })),
  };
}

export async function loadOverview(db: D1Database, query: OverviewQuery): Promise<OverviewAggregates> {
  try {
    return await queryOverview(db, query);
  } catch {
    await ensureHitsTable(db);
    return await queryOverview(db, query);
  }
}
