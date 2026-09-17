import { useSceneEngine } from '../../engine/SceneEngine';

export function HintPanel() {
  const { state, scene } = useSceneEngine();
  if (!scene.hints?.length || state.sceneLocal.hintLevel === 0) return null;

  const visibleHints = scene.hints.slice(0, state.sceneLocal.hintLevel);

  return (
    <div className="mt-8 space-y-4">
      {visibleHints.map((hint) => (
        <div
          key={hint.level}
          className="rounded-lg border border-classroom-border bg-classroom-playground px-6 py-4"
        >
          <p className="text-text-secondary text-sm font-semibold mb-1">提示 {hint.level}</p>
          <p className="text-stage-sub font-medium text-text-primary">{hint.text}</p>
        </div>
      ))}
    </div>
  );
}
