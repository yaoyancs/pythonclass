import { useState } from 'react';
import type { PythonProsContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface PythonProsStageProps {
  content: PythonProsContent;
  sceneId: string;
}

export function PythonProsStage({ content, sceneId }: PythonProsStageProps) {
  // 0 选优点 → 1 边界补充
  const { phase, advance, done } = useStageAdvance(sceneId, 1);
  const [selected, setSelected] = useState<string[]>([]);
  const showBoundary = phase >= 1;

  const toggle = (reason: string) => {
    setSelected((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason],
    );
  };

  return (
    <div
      className="mt-4 select-none"
      onClick={() => {
        if (phase < 1) advance();
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (phase < 1) advance();
        }
      }}
    >
      <p className="stage-emphasis text-2xl leading-relaxed mb-5">{content.question}</p>

      <div className="grid grid-cols-2 gap-3">
        {content.reasons.map((reason) => {
          const on = selected.includes(reason);
          return (
            <button
              key={reason}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggle(reason);
              }}
              className={`rounded-2xl px-5 py-4 text-left text-xl transition-all ${
                on
                  ? 'bg-accent text-white shadow-card'
                  : 'bg-classroom-stage shadow-card text-text-primary hover:bg-accent-muted'
              }`}
            >
              {reason}
            </button>
          );
        })}
      </div>

      {showBoundary && (
        <div className="mt-6 rounded-3xl bg-highlight-muted px-6 py-5 timeline-node-in">
          <p className="title-kai text-xl text-text-primary leading-relaxed">{content.boundary}</p>
        </div>
      )}

      {!done && (
        <p className="mt-5 text-base text-accent/80">
          先点选理由，再点击空白处 / 空格继续
        </p>
      )}
    </div>
  );
}
