import type { IpoContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: IpoContent;
  sceneId: string;
}

export function IpoStage({ content, sceneId }: Props) {
  const extra = content.englishFlow ? 1 : 0;
  const maxPhase = content.modules.length + extra;
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);
  const visible = Math.min(phase + 1, content.modules.length);
  const showAnswers = phase >= 1;
  const showEnglish = Boolean(content.englishFlow) && phase >= content.modules.length;

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
      <p className="title-kai text-xl text-text-secondary mb-5">{content.task}</p>

      <div className="flex flex-col items-stretch gap-2 mb-6 max-w-md">
        {content.modules.slice(0, visible).map((m, i) => (
          <div key={m.title}>
            <div className="rounded-3xl bg-classroom-stage shadow-card px-5 py-4 timeline-node-in">
              <p className="text-sm tracking-[0.18em] text-accent mb-1">{m.title}</p>
              <p className="title-kai text-lg text-text-secondary mb-2">{m.prompt}</p>
              {(showAnswers && i < phase) || done || phase > i ? (
                <p className="text-lg text-text-primary leading-relaxed">{m.answer}</p>
              ) : (
                <p className="text-base text-accent/70">先请学生说…</p>
              )}
            </div>
            {i < visible - 1 && <div className="pl-8 py-1 text-accent text-xl">↓</div>}
          </div>
        ))}
      </div>

      {showEnglish && content.englishFlow && (
        <p className="stage-emphasis text-2xl tracking-wide timeline-node-in">
          {content.englishFlow.join(' → ')}
        </p>
      )}

      {!done && <p className="mt-5 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}
