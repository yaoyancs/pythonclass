import { useCallback, useRef, useState } from 'react';
import { useLessonAnalytics } from '../../analytics/useLessonAnalytics';
import { useSceneEngine } from '../../engine/SceneEngine';
import { ClassroomHeader } from './ClassroomHeader';
import { ClassroomFooter } from './ClassroomFooter';
import { TeachingStage } from '../stage/TeachingStage';
import { PythonPlayground } from '../playground/PythonPlayground';
import { KeyboardShortcuts } from '../controls/KeyboardShortcuts';

const DEFAULT_RIGHT_PCT = 53;
const MIN_RIGHT_PCT = 28;
const MAX_RIGHT_PCT = 72;

export function ClassroomShell() {
  useLessonAnalytics();
  const { dispatch, scene } = useSceneEngine();
  const isFullscreenLayout = scene.layout === 'fullscreen';
  const mainRef = useRef<HTMLElement>(null);
  const [rightPct, setRightPct] = useState(DEFAULT_RIGHT_PCT);
  const [isDragging, setIsDragging] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen();
      dispatch({ type: 'SET_FULLSCREEN', value: true });
    } else {
      void document.exitFullscreen();
      dispatch({ type: 'SET_FULLSCREEN', value: false });
    }
  }, [dispatch]);

  const handleRun = useCallback(() => {
    const run = (window as unknown as { __pyclassRun?: () => void }).__pyclassRun;
    run?.();
  }, []);

  const handleSplitterPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const main = mainRef.current;
    if (!main) return;

    const startX = e.clientX;
    const startPct = rightPct;
    const mainWidth = main.getBoundingClientRect().width;
    if (mainWidth <= 0) return;

    setIsDragging(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMove = (ev: PointerEvent) => {
      const deltaPct = ((ev.clientX - startX) / mainWidth) * 100;
      const next = Math.min(MAX_RIGHT_PCT, Math.max(MIN_RIGHT_PCT, startPct - deltaPct));
      setRightPct(next);
    };

    const onUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [rightPct]);

  return (
    <div className="classroom-grid h-full">
      <ClassroomHeader onToggleFullscreen={toggleFullscreen} />

      <main
        ref={mainRef}
        className="grid min-h-0 overflow-hidden"
        style={
          isFullscreenLayout
            ? undefined
            : { gridTemplateColumns: `minmax(0, 1fr) 6px ${rightPct}%` }
        }
      >
        <div className="min-h-0 overflow-hidden">
          <TeachingStage />
        </div>
        {!isFullscreenLayout && (
          <>
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="调整讲台与代码区宽度"
              aria-valuenow={Math.round(rightPct)}
              aria-valuemin={MIN_RIGHT_PCT}
              aria-valuemax={MAX_RIGHT_PCT}
              tabIndex={0}
              className={`relative z-10 cursor-col-resize touch-none ${
                isDragging ? 'bg-accent' : 'bg-classroom-border hover:bg-accent/70'
              }`}
              onPointerDown={handleSplitterPointerDown}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') {
                  e.preventDefault();
                  setRightPct((p) => Math.min(MAX_RIGHT_PCT, p + 2));
                } else if (e.key === 'ArrowRight') {
                  e.preventDefault();
                  setRightPct((p) => Math.max(MIN_RIGHT_PCT, p - 2));
                }
              }}
            />
            <div className="min-h-0 overflow-hidden">
              <PythonPlayground />
            </div>
          </>
        )}
      </main>

      <ClassroomFooter />
      <KeyboardShortcuts onRun={handleRun} onToggleFullscreen={toggleFullscreen} />
    </div>
  );
}
