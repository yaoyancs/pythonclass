import { useEffect, useRef, useState } from 'react';
import type { SemesterLedger, SessionLedger, Student } from '../../types/roster';
import { FLOWER_MIN, pickRandomStudent } from '../../utils/rosterStorage';
import { FlowerCount } from '../ui/FlowerIcon';
import { Button } from '../ui/Button';

interface PickStudentContentProps {
  pool: Student[];
  students: Student[];
  session: SessionLedger;
  semester: SemesterLedger;
  onPicked: (studentId: string) => void;
  onChangeFlowers: (studentId: string, delta: number) => void;
  onMarkEarlyLeave: (studentId: string) => void;
  onNeedRoster: () => void;
}

function studentFromHistory(id: string, students: Student[]): Student {
  return students.find((s) => s.id === id) ?? { id, name: '已不在名单' };
}

export function PickStudentContent({
  pool,
  students,
  session,
  semester,
  onPicked,
  onChangeFlowers,
  onMarkEarlyLeave,
  onNeedRoster,
}: PickStudentContentProps) {
  const lastId = session.pickHistory.at(-1);
  const [phase, setPhase] = useState<'idle' | 'rolling' | 'done'>(() =>
    lastId ? 'done' : 'idle',
  );
  const [displayName, setDisplayName] = useState(() =>
    lastId ? studentFromHistory(lastId, students).name : '？？？',
  );
  const [picked, setPicked] = useState<Student | null>(() =>
    lastId ? studentFromHistory(lastId, students) : null,
  );
  const timerRef = useRef<number | null>(null);
  const recordedRef = useRef(false);
  const poolRef = useRef(pool);
  const previewRef = useRef<Student | null>(null);
  const studentsRef = useRef(students);
  const historyRef = useRef(session.pickHistory);
  poolRef.current = pool;
  studentsRef.current = students;
  historyRef.current = session.pickHistory;

  useEffect(() => {
    return () => {
      if (timerRef.current != null) window.clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (timerRef.current != null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const id = historyRef.current.at(-1);
    const last = id ? studentFromHistory(id, studentsRef.current) : null;
    setPicked(last);
    setDisplayName(last?.name ?? '？？？');
    setPhase(last ? 'done' : 'idle');
    recordedRef.current = false;
  }, [session.sessionId]);

  const settleOn = (finalStudent: Student) => {
    if (timerRef.current != null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setDisplayName(finalStudent.name);
    setPicked(finalStudent);
    setPhase('done');
    if (!recordedRef.current) {
      recordedRef.current = true;
      onPicked(finalStudent.id);
    }
  };

  const startRoll = () => {
    const currentPool = poolRef.current;
    if (!currentPool.length) {
      if (session.pickHistory.length > 0) {
        window.alert('本堂可抽同学已全部抽过。');
        return;
      }
      onNeedRoster();
      return;
    }
    recordedRef.current = false;
    previewRef.current = null;
    setPicked(null);
    setPhase('rolling');

    let ticks = 0;
    const totalTicks = 28 + Math.floor(Math.random() * 12);
    if (timerRef.current != null) window.clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      ticks += 1;
      const preview = pickRandomStudent(currentPool);
      if (preview) {
        previewRef.current = preview;
        setDisplayName(preview.name);
      }
      if (ticks >= totalTicks) {
        const finalStudent = pickRandomStudent(currentPool) ?? previewRef.current;
        if (!finalStudent) {
          if (timerRef.current != null) window.clearInterval(timerRef.current);
          timerRef.current = null;
          setPhase('idle');
          return;
        }
        settleOn(finalStudent);
      }
    }, 70);
  };

  const stopRoll = () => {
    const currentPool = poolRef.current;
    const finalStudent = previewRef.current ?? pickRandomStudent(currentPool);
    if (!finalStudent) {
      if (timerRef.current != null) window.clearInterval(timerRef.current);
      timerRef.current = null;
      setPhase('idle');
      return;
    }
    settleOn(finalStudent);
  };

  const sessionF = picked ? (session.flowers[picked.id] ?? 0) : 0;
  const semesterF = picked ? (semester.flowers[picked.id] ?? 0) : 0;
  const remaining = pool.length;
  const pickedCount = session.pickHistory.length;
  const isEarlyLeave = picked
    ? (session.attendance[picked.id] ?? 'unknown') === 'early_leave'
    : false;

  if (!pool.length && phase === 'idle' && pickedCount === 0) {
    return (
      <div>
        <p className="title-kai text-3xl text-white">请先导入名单并完成考勤</p>
        <p className="text-lg mt-3 text-white/70">
          抽点从出席（含未点）同学中随机抽取，缺席 / 请假 / 早退不参与
        </p>
        <div className="mt-8 flex gap-3">
          <Button variant="secondary" size="lg" type="button" onClick={onNeedRoster}>
            去名单 / 考勤
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-white/55 mb-2">
        本堂已抽 {pickedCount} 人
        {session.lessonId ? ` · 绑定讲次 ${session.lessonId}` : ''}
      </p>
      <p
        className={`title-kai text-center transition-all ${
          phase === 'done' ? 'text-6xl text-white mt-6' : 'text-5xl text-white/90 mt-8'
        }`}
      >
        {displayName}
      </p>

      {phase === 'done' && picked && (
        <p className="mt-6 text-xl text-white/85 flex flex-wrap justify-center items-center gap-4">
          {isEarlyLeave ? (
            <span>已记早退，未发小红花</span>
          ) : (
            <>
              <span className="inline-flex items-center gap-2">
                本堂 <FlowerCount count={sessionF} className="text-white" iconClassName="w-6 h-6" />
              </span>
              <span className="opacity-40">·</span>
              <span className="inline-flex items-center gap-2">
                学期 <FlowerCount count={semesterF} className="text-white" iconClassName="w-6 h-6" />
              </span>
            </>
          )}
        </p>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {phase === 'rolling' && (
          <Button variant="primary" size="lg" type="button" onClick={stopRoll}>
            停止
          </Button>
        )}
        {phase !== 'rolling' && (
          <Button
            variant="primary"
            size="lg"
            type="button"
            onClick={startRoll}
            disabled={remaining === 0}
          >
            {phase === 'done' ? (remaining > 0 ? '再抽一次' : '本堂已抽完') : '开始抽点'}
          </Button>
        )}
        {phase === 'done' && picked && (
          <>
            <Button
              variant="secondary"
              size="lg"
              type="button"
              disabled={isEarlyLeave}
              onClick={() => onMarkEarlyLeave(picked.id)}
            >
              {isEarlyLeave ? '已记早退' : '记录早退'}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              type="button"
              disabled={isEarlyLeave}
              onClick={() => onChangeFlowers(picked.id, 1)}
            >
              + 小红花
            </Button>
            <Button
              variant="ghost"
              size="lg"
              type="button"
              className="text-white hover:bg-white/10"
              disabled={isEarlyLeave || sessionF <= FLOWER_MIN}
              onClick={() => onChangeFlowers(picked.id, -1)}
            >
              − 小红花
            </Button>
          </>
        )}
      </div>

      {pickedCount > 0 && (
        <div className="mt-10">
          <p className="text-sm text-white/55 mb-2">本堂抽点记录</p>
          <ul className="divide-y divide-white/10 max-h-64 overflow-auto">
            {[...session.pickHistory].reverse().map((id, index) => {
              const student = studentFromHistory(id, students);
              const flowers = session.flowers[id] ?? 0;
              const early =
                (session.attendance[id] ?? 'unknown') === 'early_leave';
              const order = pickedCount - index;
              return (
                <li key={id} className="flex flex-wrap items-center gap-3 py-2.5">
                  <span className="w-8 text-sm text-white/40 tabular-nums">{order}</span>
                  <span className="text-lg text-white min-w-24">{student.name}</span>
                  {student.studentNo && (
                    <span className="text-sm text-white/45 tabular-nums">{student.studentNo}</span>
                  )}
                  <span className="inline-flex items-center gap-1 text-white/80">
                    <FlowerCount count={flowers} className="text-white" iconClassName="w-5 h-5" />
                  </span>
                  {early && <span className="text-sm text-white/45">早退</span>}
                  <div className="flex gap-2 ml-auto">
                    <Button
                      variant="secondary"
                      size="md"
                      type="button"
                      disabled={early}
                      onClick={() => onChangeFlowers(id, 1)}
                    >
                      + 小红花
                    </Button>
                    <Button
                      variant="ghost"
                      size="md"
                      type="button"
                      className="text-white hover:bg-white/10"
                      disabled={early || flowers <= FLOWER_MIN}
                      onClick={() => onChangeFlowers(id, -1)}
                    >
                      − 小红花
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
