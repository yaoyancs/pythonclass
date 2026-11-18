import { useEffect } from 'react';
import { trackHintView } from '../../analytics/client';
import { useSceneEngine } from '../../engine/SceneEngine';

export function HintPanel() {
  const { state, scene } = useSceneEngine();
  const level = state.sceneLocal.hintLevel;

  useEffect(() => {
    if (!scene.hints?.length || level <= 0) return;
    trackHintView({
      lessonId: state.lessonId,
      sceneIndex: state.currentSceneIndex,
      sceneId: scene.id,
      partId: scene.partId,
      hintLevel: level,
    });
  }, [level, scene.hints?.length, scene.id, scene.partId, state.currentSceneIndex, state.lessonId]);

  if (!scene.hints?.length || level === 0) return null;

  const visibleHints = scene.hints.slice(0, level);

  return (
    <div className="mt-8 space-y-4">
      {visibleHints.map((hint) => (
        <div
          key={hint.level}
          className="rounded-lg border border-classroom-border bg-classroom-playground px-6 py-4"
        >
          <p className="text-text-secondary text-sm font-semibold mb-1">提示 {hint.level}</p>
          <p className="text-stage-sub font-medium text-text-primary whitespace-pre-line">{hint.text}</p>
        </div>
      ))}
    </div>
  );
}
