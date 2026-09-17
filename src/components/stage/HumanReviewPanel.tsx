import { useSceneEngine } from '../../engine/SceneEngine';
import { Button } from '../ui/Button';

export function HumanReviewPanel() {
  const { state, dispatch, scene } = useSceneEngine();

  if (scene.type !== 'aiReview') return null;
  if (state.sceneLocal.runCount === 0) return null;

  if (state.sceneLocal.humanReviewDone) {
    return (
      <div className="mt-6 rounded-lg border border-success/30 bg-success/10 p-6">
        <p className="text-success text-stage-sub">人工审查已完成 — 可打开 AI Reviewer</p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-lg border border-classroom-border p-6">
      <p className="text-stage-sub font-medium mb-4">Human Review：先自己找代码中的问题</p>
      <Button variant="primary" size="lg" onClick={() => dispatch({ type: 'COMPLETE_HUMAN_REVIEW' })}>
        完成人工审查
      </Button>
    </div>
  );
}
