import type { QuestionCascadeContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: QuestionCascadeContent;
  sceneId: string;
}

export function QuestionCascadeStage({ content, sceneId }: Props) {
  const maxPhase = content.questions.length + 1;
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);
  const qVisible = Math.min(phase + 1, content.questions.length);
  const showConclusion = phase >= content.questions.length;

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
      {content.title && (
        <p className="title-stage text-xl text-text-primary mb-4">{content.title}</p>
      )}
      <ol className="space-y-3">
        {content.questions.slice(0, qVisible).map((q, i) => (
          <li
            key={q}
            className="rounded-2xl bg-classroom-stage shadow-card px-5 py-3 text-lg timeline-node-in flex gap-3"
          >
            <span className="text-accent tabular-nums">{i + 1}.</span>
            <span>{q}</span>
          </li>
        ))}
      </ol>

      {showConclusion && (
        <div className="mt-6 rounded-3xl bg-accent-muted px-6 py-5 space-y-2 timeline-node-in">
          {content.conclusionLines.map((line) => (
            <p key={line} className="title-kai text-xl text-text-primary">
              {line}
            </p>
          ))}
          {content.footer && (
            <p className="mt-3 text-lg text-text-secondary">{content.footer}</p>
          )}
        </div>
      )}

      {!done && <p className="mt-5 text-base text-accent/80">点击继续 · 问题逐个出现</p>}
    </div>
  );
}
