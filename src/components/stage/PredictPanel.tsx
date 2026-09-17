import { useSceneEngine } from '../../engine/SceneEngine';
import { Button } from '../ui/Button';

export function PredictPanel() {
  const { state, dispatch, scene } = useSceneEngine();
  const prediction = scene.prediction;
  if (!prediction) return null;

  const submitted = state.sceneLocal.predictionSubmitted;
  const selected = state.sceneLocal.predictionSelected;

  return (
    <div className="mt-8 space-y-6">
      <p className="stage-emphasis text-stage-body">{prediction.question}</p>

      <div className="space-y-3">
        {prediction.options.map((opt) => {
          const isSelected = selected === opt.id;
          const showCorrect = submitted && state.sceneLocal.revealShown && opt.isCorrect;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={submitted}
              onClick={() => dispatch({ type: 'SELECT_PREDICTION', optionId: opt.id })}
              className={`w-full text-left rounded-2xl border px-6 py-4 text-stage-sub transition-all ${
                isSelected
                  ? 'border-accent bg-accent-muted shadow-card'
                  : 'border-classroom-border bg-classroom-stage hover:border-accent/60 hover:shadow-card'
              } ${showCorrect ? 'ring-2 ring-success' : ''}`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {!submitted && (
        <Button
          variant="primary"
          size="lg"
          disabled={!selected}
          onClick={() => dispatch({ type: 'SUBMIT_PREDICTION' })}
        >
          提交预测
        </Button>
      )}

      {submitted && !state.sceneLocal.runUnlocked && null}
      {submitted && (
        <p className="text-success text-stage-sub">
          预测已提交 — 现在可以运行代码验证你的预测
        </p>
      )}

      {prediction.stepTrace && state.sceneLocal.revealShown && (
        <div className="mt-6 rounded-lg border border-classroom-border bg-classroom-playground p-6 font-mono text-lg space-y-2">
          {prediction.stepTrace.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}
