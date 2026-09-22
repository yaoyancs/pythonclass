import type { VarDefinitionContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: VarDefinitionContent;
  sceneId: string;
}

export function VarDefinitionStage({ content, sceneId }: Props) {
  const { phase, advance, done } = useStageAdvance(sceneId, 2);

  return (
    <div
      className="mt-6 cursor-pointer select-none"
      onClick={() => advance()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && advance()) e.preventDefault();
      }}
    >
      <div className="grid grid-cols-3 gap-4">
        {content.parts.map((part, i) => (
          <div
            key={part.label}
            className={`rounded-3xl bg-classroom-stage shadow-card px-5 py-6 text-center transition-opacity duration-500 ${
              phase >= 0 ? 'opacity-100' : 'opacity-40'
            }`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <p className="text-sm tracking-[0.16em] text-accent">{part.label}</p>
            <p className="mt-1 text-base text-text-secondary">{part.note}</p>
            <pre className="mt-4 font-mono text-2xl text-text-primary whitespace-pre-wrap">
              {part.example}
            </pre>
          </div>
        ))}
      </div>

      {phase >= 1 && (
        <p className="mt-8 rounded-3xl bg-accent-muted px-7 py-5 title-kai text-2xl text-text-primary leading-relaxed timeline-node-in">
          {content.definition}
        </p>
      )}

      {phase >= 2 && (
        <div className="mt-5 grid grid-cols-2 gap-4 timeline-node-in">
          <p className="rounded-2xl bg-classroom-stage shadow-card px-5 py-4 title-kai text-lg text-text-secondary">
            {content.mathLine}
          </p>
          <p className="rounded-2xl bg-classroom-stage shadow-card px-5 py-4 title-kai text-lg text-text-primary">
            {content.programLine}
          </p>
        </div>
      )}

      {!done && <p className="mt-6 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}
