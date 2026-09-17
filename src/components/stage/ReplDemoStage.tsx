import type { ReplDemoContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: ReplDemoContent;
  sceneId: string;
}

export function ReplDemoStage({ content, sceneId }: Props) {
  const stepPhases = content.steps.length * 2;
  const maxPhase = stepPhases + 1;
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);

  const showSuited = phase >= stepPhases;
  const showDesign = phase >= stepPhases + 1;

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
      <div className="rounded-3xl bg-code-bg shadow-card px-6 py-5 font-mono text-lg min-h-[16rem]">
        <p className="text-sm tracking-[0.18em] text-code-muted mb-4">交互式 Python</p>
        {content.steps.map((step, i) => {
          const showIn = phase >= i * 2;
          const showOut = phase >= i * 2 + 1;
          if (!showIn) return null;
          return (
            <div key={`${step.input}-${i}`} className="mb-4 timeline-node-in">
              <div className="text-code-text">
                <span className="text-accent">&gt;&gt;&gt; </span>
                {step.input}
              </div>
              {step.promptPredict && !showOut && (
                <p className="mt-2 text-base text-highlight title-kai">先预测：{step.promptPredict}</p>
              )}
              {showOut && (
                <div className="mt-1 text-code-muted timeline-node-in whitespace-pre-wrap">
                  {step.output}
                  {step.note && (
                    <p className="mt-1 text-sm text-accent/90 font-sans title-kai">{step.note}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showSuited && (
        <ul className="mt-5 grid grid-cols-3 gap-3 timeline-node-in">
          {content.suitedFor.map((s) => (
            <li key={s} className="rounded-2xl bg-classroom-stage shadow-card px-4 py-3 text-center text-lg">
              {s}
            </li>
          ))}
        </ul>
      )}

      {showDesign && (
        <p className="mt-5 title-kai text-xl text-text-primary leading-relaxed timeline-node-in">
          {content.designNote}
        </p>
      )}

      {!done && <p className="mt-5 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}
