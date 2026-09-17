import { Fragment, useMemo } from 'react';
import type { TiobeRankContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface TiobeRankStageProps {
  content: TiobeRankContent;
  sceneId: string;
}

function LeadWithTiobeLink({ lead, href }: { lead: string; href: string }) {
  const parts = lead.split(/(TIOBE)/g);
  return (
    <p className="title-kai text-xl md:text-2xl text-text-primary leading-relaxed">
      {parts.map((part, i) =>
        part === 'TIOBE' ? (
          <a
            key={`tiobe-${i}`}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-accent underline underline-offset-4 hover:opacity-90"
            onClick={(e) => e.stopPropagation()}
          >
            TIOBE
          </a>
        ) : (
          <Fragment key={`t-${i}`}>{part}</Fragment>
        ),
      )}
    </p>
  );
}

/**
 * 分步：开场说明（TIOBE 可点）→ 水平柱状图逐根长出。
 */
export function TiobeRankStage({ content, sceneId }: TiobeRankStageProps) {
  // phase: 0=lead+空图，1..n=bars 全部出现即完成
  const maxPhase = content.rows.length;
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);

  const barsVisible = Math.min(phase, content.rows.length);

  const maxRating = useMemo(
    () => Math.max(...content.rows.map((r) => r.rating), 1),
    [content.rows],
  );

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
      <LeadWithTiobeLink lead={content.lead} href={content.href} />

      <div className="mt-4 rounded-3xl bg-classroom-stage shadow-card px-5 py-4">
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <p className="text-sm tracking-[0.18em] text-accent">
            <a
              href={content.href}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 hover:opacity-90"
              onClick={(e) => e.stopPropagation()}
            >
              {content.sourceLabel}
            </a>
          </p>
          <p className="text-sm text-text-secondary">流行度份额（%）</p>
        </div>

        <div className="space-y-1.5 min-h-[18rem]">
          {barsVisible === 0 ? (
            <div className="h-[18rem] grid place-items-center">
              <p className="text-base text-accent/80">点击继续，柱状图逐根出现</p>
            </div>
          ) : (
            content.rows.slice(0, barsVisible).map((row, i) => {
              const isNewest = i === barsVisible - 1;
              const widthPct = Math.max(4, (row.rating / maxRating) * 100);
              return (
                <div
                  key={row.language}
                  className={`grid grid-cols-[7.5rem_1fr_4rem] items-center gap-3 ${
                    isNewest ? 'stage-fade-in' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-6 shrink-0 title-kai text-sm text-accent tabular-nums">
                      {String(row.rank).padStart(2, '0')}
                    </span>
                    <span className="title-kai text-base text-text-primary truncate">
                      {row.language}
                    </span>
                  </div>
                  <div className="h-7 rounded-full bg-accent-muted/50 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-accent origin-left ${
                        isNewest ? 'tiobe-bar-grow' : ''
                      }`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <span className="text-right font-mono text-sm text-text-secondary tabular-nums">
                    {row.rating.toFixed(2)}%
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {!done && (
        <p className="mt-5 text-base text-accent/80">
          {barsVisible < content.rows.length
            ? `点击继续 · 柱状图 ${barsVisible}/${content.rows.length}`
            : '点击继续 · 或按空格 / →'}
        </p>
      )}
    </div>
  );
}
