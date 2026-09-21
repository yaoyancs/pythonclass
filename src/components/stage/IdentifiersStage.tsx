import type { IdentifiersContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: IdentifiersContent;
  sceneId: string;
}

export function IdentifiersStage({ content, sceneId }: Props) {
  // 0 定义 → 1 规则 → 2 保留字
  const { phase, advance, done } = useStageAdvance(sceneId, 2);

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
      <div className="rounded-3xl bg-classroom-stage shadow-card px-6 py-5">
        <p className="text-sm text-accent font-semibold tracking-wide">1. 标识符</p>
        <p className="mt-3 text-xl leading-relaxed">{content.definition}</p>
        <p className="mt-2 text-lg text-text-secondary">{content.examples}</p>
      </div>

      {phase >= 1 && (
        <div className="mt-4 timeline-node-in">
          <p className="mb-3 text-lg font-semibold">标识符命名规则</p>
          <ol className="space-y-2">
            {content.rules.map((rule, i) => (
              <li
                key={rule}
                className="rounded-2xl bg-classroom-stage shadow-card px-5 py-3 text-lg flex gap-4"
              >
                <span className="text-accent tabular-nums">{i + 1}.</span>
                <span>{rule}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {phase >= 2 && (
        <div className="mt-5 timeline-node-in">
          <p className="text-sm text-accent font-semibold tracking-wide">2. Python 关键字（保留字）</p>
          <p className="mt-2 text-lg text-text-secondary">{content.keywordLead}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {content.keywords.map((word) => (
              <span
                key={word}
                className="rounded-xl bg-code-bg px-3 py-1.5 font-mono text-base text-code-text"
              >
                {word}
              </span>
            ))}
          </div>
          {content.keywordNote && (
            <p className="mt-4 text-lg">{content.keywordNote}</p>
          )}
        </div>
      )}

      {done && content.close && (
        <p className="mt-5 text-lg text-text-secondary">{content.close}</p>
      )}
      {!done && <p className="mt-4 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}
