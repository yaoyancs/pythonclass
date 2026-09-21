CREATE TABLE IF NOT EXISTS hits (
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
  device TEXT
);

CREATE INDEX IF NOT EXISTS idx_hits_ts ON hits(ts);
CREATE INDEX IF NOT EXISTS idx_hits_lesson ON hits(lesson_id);
