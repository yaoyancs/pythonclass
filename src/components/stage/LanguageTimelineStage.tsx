import type { LanguageTimelineContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface LanguageTimelineStageProps {
  content: LanguageTimelineContent;
  sceneId: string;
}

export function LanguageTimelineStage({ content, sceneId }: LanguageTimelineStageProps) {
  // phase 0..n-1：逐个点亮时间轴节点；随后轴线 → Prompt → 教师悬置 → 用途表
  const eraCount = content.eras.length;
  const maxPhase = eraCount + 3;
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);

  const erasVisible = Math.min(phase + 1, eraCount);
  const showAxis = phase >= eraCount;
  const showConflict = phase >= eraCount + 1;
  const showHold = phase >= eraCount + 2;
  const showTable = phase >= eraCount + 3;

  return (
    <div
      className="mt-3 cursor-pointer select-none"
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
      <div className="rounded-3xl bg-classroom-stage shadow-card px-5 py-4 min-h-[7.5rem]">
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
          {content.eras.slice(0, erasVisible).map((era, i) => {
            const isNewest = i === erasVisible - 1;
            return (
              <div key={era} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span
                    className={`text-accent text-base shrink-0 ${isNewest ? 'timeline-arrow-in' : ''}`}
                    aria-hidden
                  >
                    →
                  </span>
                )}
                <span
                  className={`title-kai text-base md:text-lg px-2.5 py-1 rounded-xl bg-accent-muted text-text-primary shrink-0 ${
                    isNewest ? 'timeline-node-in' : ''
                  }`}
                >
                  {era}
                </span>
              </div>
            );
          })}
        </div>

        {showAxis && (
          <div className="mt-3 flex items-center justify-between text-sm text-text-secondary timeline-node-in border-t border-classroom-border pt-3">
            <span>{content.axisLeft}</span>
            <span className="flex-1 mx-3 h-px bg-gradient-to-r from-code-bg/50 via-accent/50 to-accent origin-left timeline-axis-grow" />
            <span>{content.axisRight}</span>
          </div>
        )}
      </div>

      {showConflict && (
        <p className="mt-4 stage-emphasis text-xl leading-relaxed timeline-node-in">
          {content.conflictQuestion}
        </p>
      )}

      {showHold && (
        <blockquote className="mt-3 rounded-3xl bg-accent-muted px-5 py-3.5 timeline-node-in">
          <p className="title-kai text-base md:text-lg text-text-primary leading-relaxed">
            “{content.teacherHold}”
          </p>
        </blockquote>
      )}

      {showTable && (
        <div className="mt-3 rounded-3xl bg-classroom-stage shadow-card overflow-hidden timeline-node-in">
          <p className="px-5 pt-3 pb-1 text-sm tracking-[0.18em] text-accent">{content.tableTitle}</p>
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-text-secondary border-b border-classroom-border">
                <th className="px-5 py-2 font-normal w-36">语言</th>
                <th className="px-5 py-2 font-normal">典型用途</th>
              </tr>
            </thead>
            <tbody>
              {content.tableRows.map((row) => (
                <tr key={row.language} className="border-b border-classroom-border/60 last:border-0">
                  <td className="px-5 py-2 text-base text-accent">{row.language}</td>
                  <td className="px-5 py-2 text-base text-text-primary">{row.uses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!done && (
        <p className="mt-4 text-base text-accent/80">
          {erasVisible < eraCount
            ? `点击继续 · 时间轴 ${erasVisible}/${eraCount}`
            : '点击继续 · 或按空格 / →'}
        </p>
      )}
    </div>
  );
}
