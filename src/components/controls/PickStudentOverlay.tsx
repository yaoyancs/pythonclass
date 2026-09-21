import { useEffect, useRef, useState } from 'react';
import type { SemesterLedger, SessionLedger, Student } from '../../types/roster';
import { FLOWER_MIN, getClassLabel, pickRandomStudent } from '../../utils/rosterStorage';
import { FlowerCount } from '../ui/FlowerIcon';
import { Button } from '../ui/Button';
import { TeacherPanel } from './TeacherPanel';

interface PickStudentOverlayProps {
  pool: Student[];
  session: SessionLedger;
  semester: SemesterLedger;
  onPicked: (studentId: string) => void;
  onChangeFlowers: (studentId: string, delta: number) => void;
  onClose: () => void;
  onNeedRoster: () => void;
}

export function PickStudentOverlay({
  pool,
  session,
  semester,
  onPicked,
  onChangeFlowers,
  onClose,
  onNeedRoster,
}: PickStudentOverlayProps) {
  const [phase, setPhase] = useState<'idle' | 'rolling' | 'done'>('idle');
  const [displayName, setDisplayName] = useState('？？？');
  const [picked, setPicked] = useState<Student | null>(null);
  const timerRef = useRef<number | null>(null);
  const recordedRef = useRef(false);
  const poolRef = useRef(pool);
  poolRef.current = pool;

  useEffect(() => {
    return () => {
      if (timerRef.current != null) window.clearInterval(timerRef.current);
    };
  }, []);

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
    setPicked(null);
    setPhase('rolling');

    let ticks = 0;
    const totalTicks = 28 + Math.floor(Math.random() * 12);
    if (timerRef.current != null) window.clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      ticks += 1;
      const preview = pickRandomStudent(currentPool);
      if (preview) setDisplayName(preview.name);
      if (ticks >= totalTicks) {
        if (timerRef.current != null) window.clearInterval(timerRef.current);
        timerRef.current = null;
        const finalStudent = pickRandomStudent(currentPool);
        if (!finalStudent) {
          setPhase('idle');
          return;
        }
        setDisplayName(finalStudent.name);
        setPicked(finalStudent);
        setPhase('done');
        if (!recordedRef.current) {
          recordedRef.current = true;
          onPicked(finalStudent.id);
        }
      }
    }, 70);
  };

  const classLabel = getClassLabel(session.classId);
  const sessionF = picked ? (session.flowers[picked.id] ?? 0) : 0;
  const semesterF = picked ? (semester.flowers[picked.id] ?? 0) : 0;
  const remaining = pool.length;
  const pickedCount = session.pickHistory.length;

  if (!pool.length && phase === 'idle' && pickedCount === 0) {
    return (
      <TeacherPanel
        title={`抽点学生 · ${classLabel}`}
        onClose={onClose}
        variant="dark"
        wide
        initialWidth={720}
        initialHeight={420}
      >
        <p className="title-kai text-3xl text-white">请先导入名单并完成考勤</p>
        <p className="text-lg mt-3 text-white/70">抽点从出席（含未点）同学中随机抽取，缺席/请假不参与</p>
        <div className="mt-8 flex gap-3">
          <Button variant="secondary" size="lg" type="button" onClick={onNeedRoster}>
            去名单 / 考勤
          </Button>
          <Button
            variant="ghost"
            size="lg"
            type="button"
            className="text-white/80 hover:bg-white/10"
            onClick={onClose}
          >
            关闭
          </Button>
        </div>
      </TeacherPanel>
    );
  }

  return (
    <TeacherPanel
      title={`抽点学生 · ${classLabel}`}
      onClose={onClose}
      variant="dark"
      wide
      initialWidth={820}
      initialHeight={520}
    >
      <p className="text-sm text-white/55 mb-2">
        本堂已抽 {pickedCount} 人 
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
          <span className="inline-flex items-center gap-2">
            本堂 <FlowerCount count={sessionF} className="text-white" iconClassName="w-6 h-6" />
          </span>
          <span className="opacity-40">·</span>
          <span className="inline-flex items-center gap-2">
            学期 <FlowerCount count={semesterF} className="text-white" iconClassName="w-6 h-6" />
          </span>
        </p>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-3">
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
              onClick={() => onChangeFlowers(picked.id, 1)}
            >
              + 小红花
            </Button>
            <Button
              variant="ghost"
              size="lg"
              type="button"
              className="text-white hover:bg-white/10"
              disabled={sessionF <= FLOWER_MIN}
              onClick={() => onChangeFlowers(picked.id, -1)}
            >
              − 小红花
            </Button>
          </>
        )}
      </div>
    </TeacherPanel>
  );
}
