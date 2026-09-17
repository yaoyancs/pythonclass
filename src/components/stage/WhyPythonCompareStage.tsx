import type { WhyPythonCompareContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface WhyPythonCompareStageProps {
  content: WhyPythonCompareContent;
  sceneId: string;
}

export function WhyPythonCompareStage({ content, sceneId }: WhyPythonCompareStageProps) {
  // 0 双栏代码 → 1 淡化 C 底层细节 → 2 说明句
  const { phase, advance, done } = useStageAdvance(sceneId, 2);
  const hideDetails = phase >= 1;
  const showExplain = phase >= 2;
  const leftLines = content.left.code.split('\n');
  const hidden = new Set(content.hiddenLineIndexes);

  return (
    <div
      className="mt-4 cursor-pointer select-none"
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
      <p className="text-sm tracking-[0.18em] text-accent mb-3">{content.taskLabel}</p>

      <div className="grid grid-cols-2 gap-5">
        <div className="rounded-3xl bg-code-bg shadow-card overflow-hidden">
          <div className="px-5 py-2.5 text-sm tracking-[0.18em] text-code-muted border-b border-code-border">
            {content.left.label}
          </div>
          <pre className="px-5 py-4 font-mono text-base md:text-lg text-code-text leading-relaxed whitespace-pre-wrap">
            {leftLines.map((line, i) => {
              const isHidden = hideDetails && hidden.has(i);
              const isCore = hideDetails && !hidden.has(i) && line.trim().length > 0;
              return (
                <div
                  key={`l-${i}`}
                  className={`transition-all duration-700 ${
                    isHidden
                      ? 'opacity-25 line-through decoration-code-muted/80 scale-[0.98]'
                      : isCore
                        ? 'text-success bg-success/10 rounded px-1 -mx-1'
                        : ''
                  }`}
                >
                  {line.length ? line : ' '}
                </div>
              );
            })}
          </pre>
        </div>

        <div className="rounded-3xl bg-classroom-stage shadow-card overflow-hidden">
          <div className="px-5 py-2.5 text-sm tracking-[0.18em] text-accent border-b border-classroom-border">
            {content.right.label}
          </div>
          <pre
            className={`px-5 py-4 font-mono text-base md:text-lg text-text-primary leading-relaxed whitespace-pre-wrap transition-all duration-700 ${
              hideDetails ? 'bg-accent-muted/60 rounded-none' : ''
            }`}
          >
            {content.right.code}
          </pre>
        </div>
      </div>

      {showExplain && (
        <blockquote className="mt-6 rounded-3xl bg-accent-muted px-6 py-5 timeline-node-in">
          <p className="title-kai text-xl text-text-primary leading-relaxed">
            “{content.explanation}”
          </p>
        </blockquote>
      )}

      {!done && (
        <p className="mt-5 text-base text-accent/80">
          {phase === 0 ? '点击继续：看 Python 隐藏了什么' : '点击继续 · 或按空格 / →'}
        </p>
      )}
    </div>
  );
}
