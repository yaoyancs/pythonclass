import type { PythonVersionContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: PythonVersionContent;
  sceneId: string;
}

/**
 * 版本号拆解插画 + 本课要求 + 官网下载链接。
 */
export function PythonVersionStage({ content, sceneId }: Props) {
  // 0 版本徽章 → 1 分段释义 → 2 注意点 → 3 外链
  const { phase, advance, done } = useStageAdvance(sceneId, 3);

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
      <p className="title-kai text-xl md:text-2xl text-text-primary leading-relaxed">{content.lead}</p>

      <div className="mt-6 flex flex-col items-center">
        <div className="rounded-[2rem] bg-accent text-white px-10 py-5 shadow-card digest-station-in">
          <p className="text-sm tracking-[0.2em] opacity-80">本课统一</p>
          <p className="title-kai text-4xl md:text-5xl mt-1 tabular-nums">Python {content.courseVersion}</p>
        </div>

        {phase >= 1 && (
          <div className="mt-6 flex flex-wrap items-stretch justify-center gap-3 digest-station-in">
            {content.versionParts.map((part, i) => (
              <div key={part.label} className="flex items-center gap-3">
                {i > 0 && <span className="text-accent text-2xl title-kai">.</span>}
                <div className="rounded-3xl bg-classroom-stage shadow-card px-5 py-4 min-w-[7rem] text-center">
                  <p className="title-kai text-3xl text-accent tabular-nums">{part.label}</p>
                  <p className="mt-2 text-sm text-text-secondary leading-snug">{part.meaning}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {phase >= 2 && (
        <ul className="mt-6 space-y-2.5 digest-station-in">
          {content.notes.map((note) => (
            <li
              key={note}
              className="flex items-baseline gap-3 text-lg text-text-primary font-medium"
            >
              <span className="h-2 w-2 rounded-full bg-accent shrink-0 translate-y-[-0.2em]" />
              {note}
            </li>
          ))}
        </ul>
      )}

      {phase >= 3 && (
        <div className="mt-6 digest-station-in" onClick={(e) => e.stopPropagation()}>
          <a
            href={content.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-3xl bg-accent-muted px-6 py-3.5 text-lg text-accent underline underline-offset-4 hover:opacity-90"
          >
            {content.linkLabel}
            <span aria-hidden>↗</span>
          </a>
          <p className="mt-2 text-sm text-text-secondary">{content.href}</p>
        </div>
      )}

      {!done && (
        <p className="mt-5 text-base text-accent/80">点击继续 · 或按空格 / →</p>
      )}
    </div>
  );
}
