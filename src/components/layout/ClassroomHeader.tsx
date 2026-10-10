import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSceneEngine } from "../../engine/SceneEngine";
import { sceneProgressPercent } from "../../engine/sceneTransitions";
import { COURSE } from "../../data/course";
import { ProgressBar } from "../ui/ProgressBar";
import { Button } from "../ui/Button";

interface ClassroomHeaderProps {
  annotationActive: boolean;
  onToggleAnnotation: () => void;
  onToggleFullscreen: () => void;
}

function formatStay(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  return `${minutes} 分 ${String(seconds).padStart(2, "0")} 秒`;
}

function LessonTimer({
  lessonId,
  sceneIndex,
  sceneCount,
  sceneTitles,
}: {
  lessonId: string;
  sceneIndex: number;
  sceneCount: number;
  sceneTitles: string[];
}) {
  const [now, setNow] = useState(() => Date.now());
  const [open, setOpen] = useState(false);
  const startedRef = useRef(false);
  const segmentStartRef = useRef(Date.now());
  const sceneRef = useRef(sceneIndex);
  const spentRef = useRef<number[]>(Array.from({ length: sceneCount }, () => 0));

  if (spentRef.current.length !== sceneCount) {
    spentRef.current = Array.from({ length: sceneCount }, (_, index) => spentRef.current[index] ?? 0);
  }

  useEffect(() => {
    startedRef.current = false;
    segmentStartRef.current = Date.now();
    sceneRef.current = 0;
    spentRef.current = Array.from({ length: sceneCount }, () => 0);
    setOpen(false);
  }, [lessonId, sceneCount]);

  useEffect(() => {
    if (sceneIndex !== 0 && !startedRef.current) return;
    const stamp = Date.now();
    if (!startedRef.current) {
      startedRef.current = true;
      segmentStartRef.current = stamp;
      sceneRef.current = sceneIndex;
      return;
    }
    if (sceneRef.current === sceneIndex) return;
    spentRef.current[sceneRef.current] += stamp - segmentStartRef.current;
    segmentStartRef.current = stamp;
    sceneRef.current = sceneIndex;
    setNow(stamp);
  }, [sceneIndex]);

  useEffect(() => {
    if (sceneIndex !== 0 && !startedRef.current) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [sceneIndex, lessonId]);

  if (!startedRef.current && sceneIndex !== 0) {
    return <p className="text-sm text-text-secondary">从第 1 页开始计时</p>;
  }

  const currentMs = (spentRef.current[sceneIndex] ?? 0) + (now - segmentStartRef.current);
  const totalMs = spentRef.current.reduce((sum, ms, index) => sum + (index === sceneIndex ? currentMs : ms), 0);

  return (
    <div className="relative text-right">
      <button
        type="button"
        className="text-sm font-semibold tabular-nums text-accent leading-tight"
        onClick={() => setOpen((value) => !value)}
        title="查看每一页停留时间"
      >
        本页 {formatStay(currentMs)}
        <span className="mx-1.5 text-classroom-border">·</span>
        共 {formatStay(totalMs)}
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 max-h-80 w-64 overflow-y-auto rounded-2xl border border-classroom-border bg-classroom-stage p-3 text-left shadow-card">
          {sceneTitles.map((title, index) => {
            const ms = index === sceneIndex ? currentMs : spentRef.current[index] ?? 0;
            return (
              <p key={`${title}-${index}`} className="flex justify-between gap-3 py-1 text-sm">
                <span className={index === sceneIndex ? "text-accent" : "text-text-secondary"}>
                  {index + 1}. {title}
                </span>
                <span className="shrink-0 tabular-nums">{formatStay(ms)}</span>
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatClock(date: Date): string {
  const datePart = date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const timePart = date.toLocaleTimeString("zh-CN", { hour12: false });
  return `${datePart} ${timePart}`;
}

export function ClassroomHeader({
  annotationActive,
  onToggleAnnotation,
  onToggleFullscreen,
}: ClassroomHeaderProps) {
  const { state, scene, lesson } = useSceneEngine();
  const [logoAvailable, setLogoAvailable] = useState(true);
  const [now, setNow] = useState(() => new Date());
  const progress = sceneProgressPercent(
    state.currentSceneIndex,
    lesson.sceneCount,
  );

  const sectionLabel = scene.partId
    ? `${scene.partId}　${scene.title}`
    : scene.title;

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <header className="relative z-[70] bg-classroom-stage border-b border-classroom-border">
      <div className="px-8 pt-1.5 pb-1">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/" className="shrink-0" title="返回课程首页">
              {logoAvailable ? (
                <img
                  src="/logo.png"
                  alt={COURSE.university}
                  className="h-9 w-auto object-contain"
                  onError={() => setLogoAvailable(false)}
                />
              ) : (
                <span className="title-stage text-base text-accent">
                  {COURSE.university}
                </span>
              )}
            </Link>
            <span
              className="h-5 w-px bg-classroom-border shrink-0"
              aria-hidden
            />
            <p className="text-sm text-text-secondary truncate">
              {COURSE.department}
              <span className="mx-2 text-classroom-border">|</span>
              {COURSE.title}
              <span className="mx-2 text-classroom-border">|</span>
              授课教师：{COURSE.teacher}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <LessonTimer
              lessonId={lesson.id}
              sceneIndex={state.currentSceneIndex}
              sceneCount={lesson.sceneCount}
              sceneTitles={lesson.scenes.map((item) => item.title)}
            />
            <div className="text-right">
              <p className="text-lg font-semibold tabular-nums tracking-tight leading-none">
                <span className="text-text-secondary text-sm font-medium">
                  Slide{" "}
                </span>
                {scene.index}
                <span className="text-text-secondary text-sm font-medium">
                  {" / "}
                  {lesson.sceneCount}
                </span>
              </p>
              <p className="text-sm font-semibold text-accent mt-0.5 leading-none tabular-nums">
                {formatClock(now)}
              </p>
            </div>
            <Button
              variant={annotationActive ? "primary" : "ghost"}
              size="sm"
              className="min-w-[7.5rem]"
              title="课堂画笔 (P)"
              onPointerDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onToggleAnnotation();
              }}
            >
              ✎ 画笔
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFullscreen}
              title="全屏 (F)"
            >
              {state.isFullscreen ? "退出全屏" : "全屏"}
            </Button>
          </div>
        </div>

        <div className="mt-1 flex items-baseline gap-3 min-w-0">
          <Link
            to="/"
            className="title-stage text-xl text-accent shrink-0 hover:text-accent-hover transition-colors"
            title="返回课程首页"
          >
            {lesson.subtitle}
          </Link>
          <span
            className="h-1.5 w-1.5 rounded-full bg-accent shrink-0"
            aria-hidden
          />
          <p className="text-lg text-highlight truncate min-w-0">
            {sectionLabel}
          </p>
        </div>
      </div>

      <ProgressBar percent={progress} />
    </header>
  );
}
