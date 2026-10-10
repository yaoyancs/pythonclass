import { useEffect } from 'react';
import { useSceneEngine } from '../../engine/SceneEngine';

interface KeyboardShortcutsProps {
  annotationActive: boolean;
  onRun: () => void;
  onToggleAnnotation: () => void;
  onToggleFullscreen: () => void;
}

export function KeyboardShortcuts({
  annotationActive,
  onRun,
  onToggleAnnotation,
  onToggleFullscreen,
}: KeyboardShortcutsProps) {
  const { state, dispatch } = useSceneEngine();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (state.editorFocused) return;
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (window.__pyclassStageRetreat?.()) break;
          dispatch({ type: 'PREV_SCENE' });
          break;
        case 'ArrowRight':
          e.preventDefault();
          // 分步动画未完成时，右键先推进动画，不翻页
          if (window.__pyclassStageAdvance?.()) break;
          dispatch({ type: 'NEXT_SCENE' });
          break;
        case ' ':
          e.preventDefault();
          if (!window.__pyclassStageAdvance?.()) {
            dispatch({ type: 'NEXT_SCENE' });
          }
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          onRun();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          onToggleAnnotation();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          onToggleFullscreen();
          break;
        case 'Escape':
          if (annotationActive) {
            e.preventDefault();
            onToggleAnnotation();
          } else if (state.isFullscreen) {
            onToggleFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [
    annotationActive,
    state.editorFocused,
    state.isFullscreen,
    dispatch,
    onRun,
    onToggleAnnotation,
    onToggleFullscreen,
  ]);

  return null;
}
