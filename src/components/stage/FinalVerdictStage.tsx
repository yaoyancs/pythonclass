import type { FinalVerdictContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: FinalVerdictContent;
  sceneId: string;
}

export function FinalVerdictStage({ content, sceneId }: Props) {
  const maxPhase = content.lines.length + 2;
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);
  const linesVisible = Math.min(phase + 1, content.lines.length);
  const showChecklist = phase >= content.lines.length;
  const showTeaser = phase >= content.lines.length + 1;

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
      <div className="space-y-4">
        {content.lines.slice(0, linesVisible).map((line, i) => (
          <p
            key={line}
            className={`leading-relaxed timeline-node-in ${
              i === 0
                ? 'title-stage text-3xl text-text-primary'
                : 'text-2xl font-semibold text-text-primary'
            }`}
          >
            {line}
          </p>
        ))}
      </div>

      {showChecklist && (
        <div className="mt-8 rounded-3xl bg-classroom-stage shadow-card px-6 py-5 timeline-node-in">
          <p className="text-sm tracking-[0.18em] text-accent mb-3">我能够：</p>
          <ul className="space-y-2">
            {content.abilities.map((a) => (
              <li key={a} className="text-lg flex gap-3">
                <span className="text-accent">✓</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showTeaser && (
        <div className="mt-6 timeline-node-in">
          <p className="text-sm tracking-[0.18em] text-highlight mb-2">下一课悬念</p>
          <pre className="rounded-3xl bg-code-bg shadow-card px-5 py-4 font-mono text-lg text-code-text whitespace-pre-wrap">
            {content.teaserCode}
          </pre>
          <p className="mt-4 stage-emphasis text-xl">{content.teaserQuestion}</p>
          <p className="mt-3 title-kai text-lg text-text-secondary">{content.teaserClose}</p>
        </div>
      )}

      {!done && <p className="mt-5 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}
