import type { PythonDesignContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface PythonDesignStageProps {
  content: PythonDesignContent;
  sceneId: string;
}

/** 设计原则分步出现 → 可选短对照 → 可选结语 */
export function PythonDesignStage({ content, sceneId }: PythonDesignStageProps) {
  const hasCompare = Boolean(content.compare);
  const hasConclusion = Boolean(content.conclusion);
  // phase 0..p-1：原则；可选 compare；可选 conclusion
  const maxPhase =
    content.principles.length -
    1 +
    (hasCompare ? 1 : 0) +
    (hasConclusion ? 1 : 0);
  const { phase, advance, done } = useStageAdvance(sceneId, Math.max(maxPhase, 0));

  const principlesVisible = Math.min(phase + 1, content.principles.length);
  const showCompare = hasCompare && phase >= content.principles.length;
  const showConclusion =
    hasConclusion && phase >= content.principles.length + (hasCompare ? 1 : 0);

  return (
    <div
      className="mt-6 cursor-pointer select-none"
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
      <div className="space-y-4">
        {content.principles.slice(0, principlesVisible).map((p, i) => {
          const isNewest = i === principlesVisible - 1;
          return (
            <div
              key={p.line}
              className={`rounded-3xl bg-classroom-stage shadow-card px-7 py-5 ${
                isNewest ? 'pyhist-card-in' : ''
              }`}
            >
              <p className="title-kai text-2xl text-text-primary leading-relaxed">{p.line}</p>
              <p className="mt-2 text-lg text-text-secondary leading-relaxed">{p.gloss}</p>
            </div>
          );
        })}
      </div>

      {showCompare && content.compare && (
        <div className="mt-6 grid grid-cols-2 gap-4 pyhist-card-in">
          {[content.compare.left, content.compare.right].map((side) => (
            <div key={side.label} className="rounded-xl border border-code-border overflow-hidden">
              <div className="bg-code-bg border-b border-code-border px-4 py-2 text-sm text-code-muted">
                {side.label}
              </div>
              <pre className="bg-code-bg p-4 text-base font-mono text-code-text overflow-x-auto whitespace-pre-wrap">
                {side.code}
              </pre>
            </div>
          ))}
        </div>
      )}

      {showConclusion && content.conclusion && (
        <div className="mt-6 rounded-3xl bg-accent-muted px-7 py-5 pyhist-card-in">
          <p className="title-kai text-xl text-text-primary leading-relaxed">{content.conclusion}</p>
        </div>
      )}

      {!done && <p className="mt-6 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}
