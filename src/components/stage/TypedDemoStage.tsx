import type { TypedDemoContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';
import { TypeBadge } from '../ui/TypeBadge';

const toneClass: Record<string, string> = {
  int: 'text-sky-600',
  float: 'text-violet-600',
  str: 'text-emerald-600',
  bool: 'text-amber-700',
  plain: 'text-text-primary',
};

interface Props {
  content: TypedDemoContent;
  sceneId: string;
}

export function TypedDemoStage({ content, sceneId }: Props) {
  // 0..lines-1 逐行出示 → predict 提问 → answers → takeaway
  const lineCount = content.lines.length;
  const hasPredict = Boolean(content.predict);
  const maxPhase = lineCount + (hasPredict ? 2 : 1);
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);

  const linesVisible = Math.min(phase + 1, lineCount);
  const showPredict = hasPredict && phase >= lineCount;
  const showAnswers = hasPredict && phase >= lineCount + 1;
  const showTakeaway = phase >= (hasPredict ? lineCount + 2 : lineCount);

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
      {content.lead && (
        <p className="title-kai text-xl text-text-secondary mb-4">{content.lead}</p>
      )}

      <div className="rounded-3xl bg-classroom-stage shadow-card px-6 py-5 space-y-2 font-mono text-xl">
        {content.lines.slice(0, linesVisible).map((line, i) => (
          <div
            key={`${line.code}-${i}`}
            className="timeline-node-in flex items-center justify-between gap-4"
          >
            {line.tokens ? (
              <span>
                {line.tokens.map((t, j) => (
                  <span key={`${t.text}-${j}`} className={toneClass[t.tone] ?? toneClass.plain}>
                    {t.text}
                  </span>
                ))}
              </span>
            ) : (
              <span className="text-text-primary">{line.code}</span>
            )}
            {line.kind && <TypeBadge kind={line.kind} />}
          </div>
        ))}
      </div>

      {showPredict && content.predict && (
        <div className="mt-5 timeline-node-in">
          <p className="stage-emphasis text-xl mb-3">{content.predict.question}</p>
          <div className="grid grid-cols-2 gap-3 font-mono text-lg">
            {content.predict.codes.map((c) => (
              <div key={c} className="rounded-2xl bg-code-bg text-code-text px-4 py-3">
                {c}
              </div>
            ))}
          </div>
        </div>
      )}

      {showAnswers && content.predict && (
        <div className="mt-4 rounded-3xl bg-accent-muted px-5 py-4 timeline-node-in">
          <p className="text-sm tracking-[0.18em] text-accent mb-2">输出</p>
          <pre className="font-mono text-xl text-text-primary whitespace-pre-wrap">
            {content.predict.answers.join('\n')}
          </pre>
        </div>
      )}

      {showTakeaway && (
        <p className="mt-5 title-kai text-xl text-text-primary leading-relaxed timeline-node-in">
          {content.takeaway}
        </p>
      )}

      {!done && <p className="mt-5 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}
