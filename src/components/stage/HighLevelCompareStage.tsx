import type { HighLevelCompareContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface HighLevelCompareStageProps {
  content: HighLevelCompareContent;
  sceneId: string;
}

export function HighLevelCompareStage({ content, sceneId }: HighLevelCompareStageProps) {
  // 0 三列代码 → 1 提问 → 2 结论
  const { phase, advance, done } = useStageAdvance(sceneId, 2);

  return (
    <div
      className="mt-5 cursor-pointer select-none"
      onClick={() => advance()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          advance();
        }
      }}
    >
      <div className="flex items-baseline gap-4 flex-wrap">
        <p className="text-sm tracking-[0.2em] text-accent">第三代</p>
        <p className="title-kai text-xl text-text-secondary">高级语言</p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {content.columns.map((col, i) => (
          <div
            key={col.label}
            className="rounded-3xl bg-classroom-stage shadow-card px-5 py-5 stage-fade-in"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <p className="text-sm tracking-[0.18em] text-accent mb-4">{col.label}</p>
            <pre className="font-mono text-lg md:text-xl text-text-primary leading-relaxed whitespace-pre-wrap">
              {col.code}
            </pre>
          </div>
        ))}
      </div>

      {phase >= 1 && (
        <p className="mt-7 stage-emphasis text-2xl leading-relaxed stage-fade-in">
          {content.question}
        </p>
      )}

      {phase >= 2 && (
        <div className="mt-5 rounded-3xl bg-accent-muted px-7 py-5 stage-fade-in">
          <p className="title-kai text-xl text-text-primary leading-relaxed">{content.conclusion}</p>
        </div>
      )}

      {!done && (
        <p className="mt-6 text-base text-accent/80">点击继续 · 或按空格 / →</p>
      )}
    </div>
  );
}
