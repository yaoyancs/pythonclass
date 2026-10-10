import { useEffect, useState } from 'react';
import { useSceneEngine } from '../../engine/SceneEngine';
import { getBeatPhase, subscribeBeatPhase } from '../../hooks/useStageAdvance';
import { Button } from '../ui/Button';
import { TeacherControls } from '../controls/TeacherControls';

export function ClassroomFooter() {
  const { state, dispatch, lesson } = useSceneEngine();
  const [beatPhase, setBeatPhase] = useState(getBeatPhase);
  const atStart = state.currentSceneIndex === 0;
  const atEnd = state.currentSceneIndex >= lesson.sceneCount - 1;
  const canRetreat = beatPhase > 0;

  useEffect(() => subscribeBeatPhase(() => setBeatPhase(getBeatPhase())), []);

  return (
    <footer className="relative z-[70] bg-classroom-stage border-t border-classroom-border px-8 py-1">
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="secondary"
          size="sm"
          className="shrink-0 whitespace-nowrap min-w-[8.5rem]"
          disabled={atStart && !canRetreat}
          onClick={() => {
            if (window.__pyclassStageRetreat?.()) return;
            dispatch({ type: 'PREV_SCENE' });
          }}
        >
          {canRetreat ? '← 后退' : '← 上一页'}
        </Button>

        <TeacherControls />

        <Button
          variant="primary"
          size="sm"
          className="shrink-0 whitespace-nowrap min-w-[8.5rem]"
          disabled={atEnd && !window.__pyclassStageAdvance}
          onClick={() => {
            if (window.__pyclassStageAdvance?.()) return;
            dispatch({ type: 'NEXT_SCENE' });
          }}
        >
          下一页 →
        </Button>
      </div>
    </footer>
  );
}
