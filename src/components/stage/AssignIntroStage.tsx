import type { AssignIntroContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: AssignIntroContent;
  sceneId: string;
}

/** 0 名字指向对象 → 1 写出赋值 → 2 等号的含义。 */
export function AssignIntroStage({ content, sceneId }: Props) {
  const { phase, advance, done } = useStageAdvance(sceneId, 2);
  const showAssign = phase >= 1;
  const showSummary = phase >= 2;

  return (
    <div
      className="mt-2 cursor-pointer select-none space-y-4"
      onClick={() => advance()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && advance()) e.preventDefault();
      }}
    >
      <div className="rounded-3xl bg-classroom-stage shadow-card px-6 py-6">
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <div className="rounded-full bg-accent text-white px-5 py-2 title-kai text-xl">{content.name}</div>
            <p className="mt-2 text-sm text-text-secondary">名字</p>
          </div>
          <div className="text-accent text-3xl" aria-hidden>
            →
          </div>
          <div className="text-center">
            <div className="rounded-2xl border-2 border-dashed border-accent px-8 py-4 font-mono text-3xl text-text-primary">
              {content.value}
            </div>
            <p className="mt-2 text-sm text-text-secondary">对象</p>
          </div>
        </div>
      </div>

      {showAssign && (
        <div className="rounded-3xl bg-code-bg shadow-card px-6 py-5 timeline-node-in">
          <div className="flex items-center justify-center gap-4 font-mono text-2xl text-code-text min-h-[4rem]">
            <span className="rounded-full bg-accent text-white px-4 py-1 title-kai text-xl">{content.name}</span>
            <span>=</span>
            <span className="rounded-2xl border-2 border-dashed border-accent px-5 py-2">{content.value}</span>
          </div>
        </div>
      )}

      {showSummary && (
        <p className="rounded-3xl bg-accent-muted px-6 py-4 title-kai text-xl text-text-primary leading-relaxed timeline-node-in">
          {content.summary}
        </p>
      )}

      {!done && <p className="text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}
