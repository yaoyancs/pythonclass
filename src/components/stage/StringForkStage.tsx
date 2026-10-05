import { useStageAdvance } from '../../hooks/useStageAdvance';
import type { StringForkContent } from '../../types/scene';

interface Props {
  content: StringForkContent;
  sceneId: string;
}

function BindingRow({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex items-center gap-4 timeline-node-in">
      <span className="rounded-full bg-accent px-5 py-2 title-kai text-xl text-white">{name}</span>
      <span className="h-0.5 w-16 bg-accent" />
      <span className="rounded-2xl border-2 border-dashed border-accent bg-accent-muted px-6 py-4 font-mono text-3xl text-text-primary">
        {value}
      </span>
    </div>
  );
}

/** 0 原名字指向原串 → 1 划掉「在内部改字母」→ 2 新名字指向新串 */
export function StringForkStage({ content, sceneId }: Props) {
  const { phase, advance, done } = useStageAdvance(sceneId, 2);

  return (
    <div
      className="mt-6 cursor-pointer select-none"
      onClick={() => advance()}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && advance()) event.preventDefault();
      }}
    >
      <div className="space-y-6 rounded-3xl bg-classroom-stage px-8 py-8 shadow-card">
        <BindingRow name={content.keep.name} value={content.keep.value} />

        {phase >= 1 && (
          <p className="title-kai text-2xl text-text-secondary line-through decoration-2 timeline-node-in">
            {content.rejectInPlace}
          </p>
        )}

        {phase >= 2 && <BindingRow name={content.created.name} value={content.created.value} />}
      </div>

      {phase >= 2 && (
        <p className="mt-5 title-kai text-xl text-text-primary timeline-node-in">{content.close}</p>
      )}

      {!done && <p className="mt-5 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}
