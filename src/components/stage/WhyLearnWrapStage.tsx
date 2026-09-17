import type { WhyLearnWrapContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: WhyLearnWrapContent;
  sceneId: string;
}

export function WhyLearnWrapStage({ content, sceneId }: Props) {
  // 0 reopen → 1 keywords → 2..layers → flow+ai
  const maxPhase = content.layers.length + 2;
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);

  const showKeywords = phase >= 1;
  const layersVisible = Math.max(0, Math.min(phase - 1, content.layers.length));
  const showFlow = phase >= content.layers.length + 2;

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
      <p className="stage-emphasis text-2xl leading-relaxed">{content.reopenQuestion}</p>

      {showKeywords && (
        <div className="mt-5 flex flex-wrap gap-2 timeline-node-in">
          {content.keywords.map((k) => (
            <span key={k} className="rounded-full bg-accent-muted px-4 py-1.5 title-kai text-lg">
              {k}
            </span>
          ))}
        </div>
      )}

      {layersVisible > 0 && (
        <div className="mt-6 space-y-3">
          {content.layers.slice(0, layersVisible).map((layer, i) => (
            <div key={layer.title} className="rounded-3xl bg-classroom-stage shadow-card px-5 py-4 timeline-node-in">
              <p className="text-sm tracking-[0.18em] text-accent mb-1">
                第 {i + 1} 层 · {layer.title}
              </p>
              <p className="title-kai text-xl text-text-primary">{layer.body}</p>
            </div>
          ))}
        </div>
      )}

      {showFlow && (
        <div className="mt-6 grid grid-cols-[1fr_auto] gap-6 items-center timeline-node-in">
          <div className="rounded-3xl bg-classroom-stage shadow-card px-5 py-4 space-y-1">
            {content.flow.map((f, i) => (
              <div key={f} className="flex items-center gap-2">
                {i > 0 && <span className="text-accent pl-6">↓</span>}
                <span className={i === 0 ? 'title-kai text-lg' : 'text-lg'}>{f}</span>
              </div>
            ))}
          </div>
          <div className="rounded-3xl bg-accent-muted px-5 py-5 w-48 text-center">
            <div className="text-4xl mb-2" aria-hidden>
              🤖
            </div>
            <p className="title-kai text-base text-text-primary leading-snug">{content.aiNote}</p>
          </div>
        </div>
      )}

      {!done && <p className="mt-5 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}
