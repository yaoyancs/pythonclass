import type { RuntimeModelContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: RuntimeModelContent;
  sceneId: string;
}

export function RuntimeModelStage({ content, sceneId }: Props) {
  // 0 三对象 → 1 类比 → 2 澄清
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
      <div className="grid grid-cols-3 gap-4">
        {content.items.map((item, i) => (
          <div
            key={item.title}
            className="rounded-3xl bg-classroom-stage shadow-card px-5 py-5 timeline-node-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <p className="title-stage text-xl text-text-primary mb-2">{item.title}</p>
            <p className="text-lg text-text-primary leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>

      {phase >= 1 && (
        <div className="mt-6 rounded-3xl bg-classroom-stage shadow-card px-6 py-5 timeline-node-in">
          <p className="text-sm tracking-[0.18em] text-accent mb-3">类比</p>
          <div className="grid grid-cols-2 gap-3">
            {content.analogies.map((a) => (
              <div key={a.label} className="flex items-baseline gap-3 text-lg">
                <span className="text-accent shrink-0 w-28">{a.label}</span>
                <span className="text-text-secondary">＝</span>
                <span className="text-text-primary">{a.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {phase >= 2 && (
        <blockquote className="mt-5 rounded-3xl bg-highlight-muted px-6 py-4 timeline-node-in">
          <p className="title-kai text-xl text-text-primary leading-relaxed">{content.caveat}</p>
        </blockquote>
      )}

      {!done && <p className="mt-5 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}
