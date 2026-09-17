import { useSceneEngine } from '../../engine/SceneEngine';
import { Button } from '../ui/Button';
import { TeacherControls } from '../controls/TeacherControls';

export function ClassroomFooter() {
  const { state, dispatch, lesson } = useSceneEngine();
  const atStart = state.currentSceneIndex === 0;
  const atEnd = state.currentSceneIndex >= lesson.sceneCount - 1;

  return (
    <footer className="bg-classroom-stage border-t border-classroom-border px-10 py-4">
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="secondary"
          size="lg"
          disabled={atStart}
          onClick={() => dispatch({ type: 'PREV_SCENE' })}
        >
          ← 上一页
        </Button>

        <TeacherControls />

        <Button
          variant="primary"
          size="lg"
          disabled={atEnd}
          onClick={() => dispatch({ type: 'NEXT_SCENE' })}
        >
          下一页 →
        </Button>
      </div>
    </footer>
  );
}
