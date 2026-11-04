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

const SCHEMA_SQL = [
  CREATE_TABLE_SQL,
  'CREATE INDEX IF NOT EXISTS idx_hits_ts ON hits(ts)',
  'CREATE INDEX IF NOT EXISTS idx_hits_lesson ON hits(lesson_id)',
];

const ALTER_SQL = [
  'ALTER TABLE hits ADD COLUMN teacher INTEGER NOT NULL DEFAULT 0',
  'ALTER TABLE hits ADD COLUMN source TEXT',
  'ALTER TABLE hits ADD COLUMN detail TEXT',
];

let ensured = false;

/** D1 的 exec 往往只接受单条语句；Pages 上用 prepare().run() 更稳。 */
async function runSql(db: D1Database, sql: string): Promise<void> {
  await db.prepare(sql).run();
}

export async function ensureHitsTable(db: D1Database): Promise<void> {
  if (ensured) return;
  for (const sql of SCHEMA_SQL) {
    await runSql(db, sql);
  }
  for (const sql of ALTER_SQL) {
    try {
      await runSql(db, sql);
    } catch {
      // column already exists
    }
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
  if (hit.outcome) detail.outcome = hit.outcome;
  if (hit.errorType) detail.errorType = hit.errorType;
  if (hit.codeChanged != null) detail.codeChanged = hit.codeChanged ? 1 : 0;
  if (hit.choiceId) detail.choiceId = hit.choiceId;
  if (hit.correct != null) detail.correct = hit.correct ? 1 : 0;
  if (hit.attempt != null) detail.attempt = hit.attempt;
  return Object.keys(detail).length === 0 ? null : JSON.stringify(detail);
}

function decodeDetail(raw: string | null | undefined): Pick<
  StoredHit,
  'outcome' | 'errorType' | 'codeChanged' | 'choiceId' | 'correct' | 'attempt'
> {
  const empty = {
    outcome: null,
    errorType: null,
    codeChanged: null,
    choiceId: null,
    correct: null,
    attempt: null,
  } as const;
  if (!raw) return { ...empty };
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      outcome: parsed.outcome === 'ok' || parsed.outcome === 'error' ? parsed.outcome : null,
      errorType: typeof parsed.errorType === 'string' ? parsed.errorType : null,
      codeChanged: parsed.codeChanged === 1 ? true : parsed.codeChanged === 0 ? false : null,
      choiceId: typeof parsed.choiceId === 'string' ? parsed.choiceId : null,
      correct: parsed.correct === 1 ? true : parsed.correct === 0 ? false : null,
      attempt: typeof parsed.attempt === 'number' ? parsed.attempt : null,
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
  limit = 5000,
): Promise<StoredHit[]> {
  try {
    return await selectHitsInRange(db, startIso, endIso, limit);
  } catch {
    await ensureHitsTable(db);
    return await selectHitsInRange(db, startIso, endIso, limit);
  }
}
