import type { InputFlowContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: InputFlowContent;
  sceneId: string;
}

export function InputFlowStage({ content, sceneId }: Props) {
  const maxPhase = content.steps.length + (content.typeContrast ? 1 : 0);
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);
  const stepsVisible = Math.min(phase + 1, content.steps.length);
  const showContrast = Boolean(content.typeContrast) && phase >= content.steps.length;

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
      <pre className="rounded-3xl bg-code-bg shadow-card px-6 py-5 font-mono text-xl text-code-text whitespace-pre-wrap">
        {content.code}
      </pre>

      <div className="mt-5 space-y-2">
        {content.steps.slice(0, stepsVisible).map((s, i) => (
          <div key={s} className="flex items-start gap-3 timeline-node-in">
            {i > 0 && <span className="text-accent text-xl leading-none pt-1">↓</span>}
            <p
              className={`rounded-2xl px-4 py-2.5 text-lg ${
                i === stepsVisible - 1 ? 'bg-accent text-white' : 'bg-classroom-stage shadow-card'
              }`}
            >
              {s}
            </p>
          </div>
        ))}
      </div>

      {showContrast && content.typeContrast && (
        <div className="mt-5 grid grid-cols-3 gap-3 timeline-node-in">
          {content.typeContrast.map((c) => (
            <div key={c.label} className="rounded-2xl bg-classroom-stage shadow-card px-4 py-3 text-center">
              <p className="font-mono text-xl">{c.label}</p>
              <p className="mt-1 text-accent">{c.kind}</p>
            </div>
          ))}
        </div>
      )}

      {phase >= 1 && (
        <p className="mt-5 title-kai text-xl text-text-primary leading-relaxed timeline-node-in">
          “{content.teacherLine}”
        </p>
      )}

      {!done && <p className="mt-5 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}
