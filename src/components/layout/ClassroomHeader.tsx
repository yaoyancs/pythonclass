import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSceneEngine } from '../../engine/SceneEngine';
import { sceneProgressPercent } from '../../engine/sceneTransitions';
import { COURSE } from '../../data/course';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';

interface ClassroomHeaderProps {
  onToggleFullscreen: () => void;
}

function formatClock(date: Date): string {
  const datePart = date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const timePart = date.toLocaleTimeString('zh-CN', { hour12: false });
  return `${datePart} ${timePart}`;
}

export function ClassroomHeader({ onToggleFullscreen }: ClassroomHeaderProps) {
  const { state, scene, lesson } = useSceneEngine();
  const [logoAvailable, setLogoAvailable] = useState(true);
  const [now, setNow] = useState(() => new Date());
  const progress = sceneProgressPercent(state.currentSceneIndex, lesson.sceneCount);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <header className="bg-classroom-stage border-b border-classroom-border">
      <div className="px-10 pt-4 pb-3">
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-4 min-w-0">
            <Link to="/" className="shrink-0" title="返回课程首页">
              {logoAvailable ? (
                <img
                  src="/logo.png"
                  alt={COURSE.university}
                  className="h-16 w-auto object-contain"
                  onError={() => setLogoAvailable(false)}
                />
              ) : (
                <span className="title-stage text-lg text-accent">{COURSE.university}</span>
              )}
            </Link>
            <span className="h-8 w-px bg-classroom-border shrink-0" aria-hidden />
            <p className="text-sm text-text-secondary truncate">
              {COURSE.department}
              <span className="mx-2 text-classroom-border">|</span>
              {COURSE.title}
              <span className="mx-2 text-classroom-border">|</span>
              授课教师：{COURSE.teacher}
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div className="text-right">
              <p className="text-xl font-semibold tabular-nums tracking-tight leading-none">
                <span className="text-text-secondary text-base font-medium">Slide </span>
                {scene.index}
                <span className="text-text-secondary text-base font-medium">
                  {' / '}
                  {lesson.sceneCount}
                </span>
              </p>
              <p className="text-sm font-semibold text-accent mt-1 leading-none tabular-nums">
                {formatClock(now)}
              </p>
            </div>
            <Button variant="ghost" size="md" onClick={onToggleFullscreen} title="全屏 (F)">
              {state.isFullscreen ? '退出全屏' : '全屏'}
            </Button>
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-4 min-w-0">
          <Link
            to="/"
            className="title-stage text-4xl text-text-primary shrink-0 hover:text-accent transition-colors"
            title="返回课程首页"
          >
            {lesson.subtitle}
          </Link>
          <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" aria-hidden />
          <p className="text-2xl text-text-secondary truncate">{scene.title}</p>
        </div>
      </div>

      <ProgressBar percent={progress} />
    </header>
  );
}
