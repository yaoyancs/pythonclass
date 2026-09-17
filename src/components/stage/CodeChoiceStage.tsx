import { useState } from 'react';
import type { CodeChoiceContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: CodeChoiceContent;
  sceneId: string;
}

export function CodeChoiceStage({ content, sceneId }: Props) {
  const { phase, advance, done } = useStageAdvance(sceneId, 2);
  const [picked, setPicked] = useState<string | null>(null);
  const showFollow = phase >= 1;
  const showConclusion = phase >= 2;

  return (
    <div className="mt-4 select-none">
      <p className="title-kai text-xl text-text-secondary mb-3">{content.prompt}</p>
      <pre className="rounded-2xl bg-code-bg px-5 py-3 font-mono text-lg text-code-muted mb-5">
        {content.oldCode}
      </pre>

      <div className="grid grid-cols-2 gap-3">
        {content.options.map((opt) => {
          const on = picked === opt.id;
          const reveal = showFollow && opt.correct;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setPicked(opt.id)}
              className={`rounded-2xl px-4 py-4 text-left font-mono text-base transition-all ${
                reveal
                  ? 'bg-accent text-white shadow-card'
                  : on
                    ? 'bg-accent-muted shadow-card'
                    : 'bg-classroom-stage shadow-card hover:bg-accent-muted'
              }`}
            >
              <span className="text-sm opacity-70">#{opt.id}</span>
              <pre className="mt-2 whitespace-pre-wrap">{opt.code}</pre>
            </button>
          );
        })}
      </div>

      <div
        className="mt-5 cursor-pointer"
        onClick={() => advance()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && advance()) e.preventDefault();
        }}
      >
        {showFollow && (
          <ul className="space-y-2 timeline-node-in">
            {content.followUps.map((f) => (
              <li key={f} className="title-kai text-lg text-text-primary">
                · {f}
              </li>
            ))}
          </ul>
        )}
        {showConclusion && (
          <p className="mt-4 rounded-3xl bg-accent-muted px-6 py-4 title-kai text-xl timeline-node-in">
            {content.conclusion}
          </p>
        )}
        {!done && (
          <p className="mt-5 text-base text-accent/80">先选择，再点击空白处继续</p>
        )}
      </div>
    </div>
  );
}
