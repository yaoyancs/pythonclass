CREATE INDEX IF NOT EXISTS idx_hits_session ON hits(session_id);
CREATE INDEX IF NOT EXISTS idx_hits_teacher_session ON hits(teacher, session_id);
