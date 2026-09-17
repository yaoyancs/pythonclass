import { useSceneEngine } from '../../engine/SceneEngine';

export function VotePanel() {
  const { state, dispatch, scene } = useSceneEngine();
  const options = scene.content.voteOptions;
  if (!options?.length) return null;

  return (
    <div className="mt-8 grid grid-cols-2 gap-4">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => dispatch({ type: 'SELECT_VOTE', option: opt })}
          className={`rounded-2xl border px-6 py-5 text-xl transition-all ${
            state.sceneLocal.voteSelection === opt
              ? 'border-accent bg-accent-muted shadow-card'
              : 'border-classroom-border bg-classroom-stage hover:border-accent/60 hover:shadow-card'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
