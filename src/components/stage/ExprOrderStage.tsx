import type { ExprOrderContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: ExprOrderContent;
  sceneId: string;
}

export function ExprOrderStage({ content, sceneId }: Props) {
  // 0 表达式+预测 → 1..steps 求值 → alt → conclusion
  const maxPhase = content.steps.length + 2;
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);

  const stepsVisible = Math.min(phase, content.steps.length);
  const showAlt = phase >= content.steps.length + 1;
  const showConclusion = phase >= content.steps.length + 2;

  return (
    <div
      className="mt-4 cursor-pointer select-none"
      onClick={() => advance()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && advance()) e.preventDefault();
      }}
    >
      <div className="rounded-3xl bg-classroom-stage shadow-card px-8 py-8 text-center">
        <p className="font-mono text-4xl text-text-primary tracking-wide">{content.expression}</p>
        {phase === 0 && content.studentPredict && (
          <p className="mt-4 stage-emphasis text-xl">先预测：{content.studentPredict}</p>
        )}

        {stepsVisible > 0 && (
          <div className="mt-8 space-y-4">
            {content.steps.slice(0, stepsVisible).map((s) => (
              <div key={s.label} className="timeline-node-in">
                <p className="text-sm text-text-secondary mb-1">{s.label}</p>
                <p className="font-mono text-3xl text-accent">{s.focus}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAlt && (
        <div className="mt-5 rounded-3xl bg-code-bg shadow-card px-6 py-5 timeline-node-in text-center">
          <p className="font-mono text-2xl text-code-text">{content.altExpression}</p>
          <p className="mt-3 stage-emphasis text-xl">→ {content.altResult}</p>
        </div>
      )}

      {showConclusion && (
        <p className="mt-5 title-kai text-xl text-text-primary leading-relaxed timeline-node-in">
          {content.conclusion}
        </p>
      )}

      {!done && <p className="mt-5 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}
