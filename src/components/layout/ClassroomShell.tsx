import { useCallback, useEffect, useRef, useState, type Dispatch, type PointerEvent as ReactPointerEvent, type SetStateAction } from 'react';
import { useLessonAnalytics } from '../../analytics/useLessonAnalytics';
import { useSceneEngine } from '../../engine/SceneEngine';
import { ClassroomHeader } from './ClassroomHeader';
import { ClassroomFooter } from './ClassroomFooter';
import { TeachingStage } from '../stage/TeachingStage';
import { PythonPlayground } from '../playground/PythonPlayground';
import { KeyboardShortcuts } from '../controls/KeyboardShortcuts';
import { AnnotationCanvas } from '../controls/AnnotationCanvas';

const DEFAULT_RIGHT_PCT = 38;
const MIN_RIGHT_PCT = 28;
const MAX_RIGHT_PCT = 72;

export function ClassroomShell() {
  useLessonAnalytics();
  const { dispatch, scene } = useSceneEngine();
  const editorOnly = Boolean(scene.editorOnly);
  const isFullscreenLayout = scene.layout === 'fullscreen' && !editorOnly;
  const editorLeft = scene.editorSide === 'left';
  const mainRef = useRef<HTMLElement>(null);
  const [rightPct, setRightPct] = useState(DEFAULT_RIGHT_PCT);
  const [isDragging, setIsDragging] = useState(false);
  const [annotationActive, setAnnotationActive] = useState(false);

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

  useEffect(() => {
    if (editorLeft) setRightPct(42);
  }, [editorLeft, scene.id]);

  const handleSplitterPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
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
      <ClassroomHeader
        annotationActive={annotationActive}
        onToggleAnnotation={() => setAnnotationActive((value) => !value)}
        onToggleFullscreen={toggleFullscreen}
      />

      <main
        ref={mainRef}
        className="grid min-h-0 overflow-hidden"
        style={
          isFullscreenLayout || editorOnly
            ? undefined
            : { gridTemplateColumns: editorLeft ? `${100 - rightPct}% 6px ${rightPct}%` : `minmax(0, 1fr) 6px ${rightPct}%` }
        }
      >
        {editorOnly ? (
          <div className="min-h-0 overflow-hidden">
            <PythonPlayground />
          </div>
        ) : editorLeft && !isFullscreenLayout ? (
          <>
            <div className="min-h-0 overflow-hidden">
              <PythonPlayground />
            </div>
            <Splitter
              isDragging={isDragging}
              rightPct={rightPct}
              setRightPct={setRightPct}
              onPointerDown={handleSplitterPointerDown}
            />
            <div className="min-h-0 overflow-hidden">
              <TeachingStage />
            </div>
          </>
        ) : (
          <>
            <div className="min-h-0 overflow-hidden">
              <TeachingStage />
            </div>
            {!isFullscreenLayout && (
              <>
                <Splitter
                  isDragging={isDragging}
                  rightPct={rightPct}
                  setRightPct={setRightPct}
                  onPointerDown={handleSplitterPointerDown}
                />
                <div className="min-h-0 overflow-hidden">
                  <PythonPlayground />
                </div>
              </>
            )}
          </>
        )}
      </main>

      <ClassroomFooter />
      <AnnotationCanvas
        active={annotationActive}
        sceneId={scene.id}
        onActiveChange={setAnnotationActive}
      />
      <KeyboardShortcuts
        annotationActive={annotationActive}
        onRun={handleRun}
        onToggleAnnotation={() => setAnnotationActive((value) => !value)}
        onToggleFullscreen={toggleFullscreen}
      />
    </div>
  );
}

function Splitter({
  isDragging,
  rightPct,
  setRightPct,
  onPointerDown,
}: {
  isDragging: boolean;
  rightPct: number;
  setRightPct: Dispatch<SetStateAction<number>>;
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
}) {
  return (
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
      onPointerDown={onPointerDown}
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
  );
}
