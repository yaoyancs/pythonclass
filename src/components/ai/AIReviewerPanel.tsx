import { useEffect } from 'react';
import { useSceneEngine } from '../../engine/SceneEngine';
import { useAIReviewer } from '../../ai/useAIReviewer';
import { Button } from '../ui/Button';

export function AIReviewerPanel() {
  const { state, scene, dispatch } = useSceneEngine();
  const { response, hintLevel, loading, review, nextHint, reset } = useAIReviewer();

  const showPanel =
    scene.aiReview &&
    (state.scenePhase === 'aiReview' || state.sceneLocal.aiReviewShown) &&
    state.sceneLocal.aiUnlocked;

  useEffect(() => {
    reset();
  }, [scene.id, reset]);

  useEffect(() => {
    if (state.scenePhase === 'aiReview' && scene.aiReview && !response && !loading) {
      void review({
        code: state.sceneLocal.code,
        sceneId: scene.id,
        presetKey: scene.aiReview.presetKey,
        runOutput: state.sceneLocal.lastOutput?.stdout,
        runError: state.sceneLocal.lastOutput?.error?.message,
      });
    }
  }, [state.scenePhase, scene, state.sceneLocal, response, loading, review]);

  if (!scene.aiReview) return null;

  if (!state.sceneLocal.aiUnlocked) {
    return (
      <div className="mt-6 rounded-lg border border-classroom-border bg-classroom-playground p-6 opacity-60">
        <p className="text-text-secondary text-sm uppercase tracking-wide">AI Reviewer</p>
        <p className="text-stage-sub mt-2">完成第一次 Run 后解锁</p>
      </div>
    );
  }

  if (!showPanel) return null;

  const typeLabel = {
    hint: 'Hint',
    question: 'Question',
    observation: 'Observation',
  }[response?.type ?? 'hint'];

  return (
    <div className="mt-6 rounded-xl border border-accent/30 bg-accent-muted p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-accent text-sm uppercase tracking-widest font-semibold">AI Reviewer</p>
          <p className="text-text-secondary text-sm mt-1">先提示，后答案</p>
        </div>
        <Button variant="ghost" size="md" onClick={() => dispatch({ type: 'RESTART_SCENE' })}>
          关闭
        </Button>
      </div>

      {loading && <p className="text-stage-sub">分析中...</p>}

      {response && (
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">
            {typeLabel} {hintLevel > 0 ? `${hintLevel}` : '1'}
          </p>
          <p className="text-stage-sub">{response.content}</p>
          {response.hasMore && (
            <Button
              variant="secondary"
              size="md"
              disabled={loading}
              onClick={() =>
                void nextHint({
                  code: state.sceneLocal.code,
                  sceneId: scene.id,
                  presetKey: scene.aiReview!.presetKey,
                  runOutput: state.sceneLocal.lastOutput?.stdout,
                  runError: state.sceneLocal.lastOutput?.error?.message,
                  hintLevel: hintLevel + 1,
                })
              }
            >
              下一个 Hint
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
