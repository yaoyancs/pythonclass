import { useSyncExternalStore } from 'react';
import { useSceneEngine } from '../../engine/SceneEngine';
import { getBeatPhase, subscribeBeatPhase } from '../../hooks/useStageAdvance';

export function RevealPanel() {
  const { state, scene } = useSceneEngine();
  const beatPhase = useSyncExternalStore(subscribeBeatPhase, getBeatPhase, getBeatPhase);
  if (!scene.reveal || !state.sceneLocal.revealShown || beatPhase > 0) return null;

  return (
    <div className="mt-8 rounded-2xl bg-accent-muted border border-classroom-border p-8">
      {scene.reveal.title && (
        <h3 className="title-stage text-2xl text-text-primary mb-4">{scene.reveal.title}</h3>
      )}
      <p className="text-stage-body font-medium text-text-primary whitespace-pre-line">
        {scene.reveal.body}
      </p>
      {scene.reveal.highlights && (
        <ul className="mt-4 space-y-2">
          {scene.reveal.highlights.map((h) => (
            <li key={h} className="text-stage-sub font-semibold text-success">
              → {h}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
