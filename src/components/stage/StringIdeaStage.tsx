import { useStageAdvance } from '../../hooks/useStageAdvance';
import type { StringIdeaContent } from '../../types/scene';

interface Props {
  content: StringIdeaContent;
  sceneId: string;
}

export function StringIdeaStage({ content, sceneId }: Props) {
  const maxPhase = content.branches.length + 1;
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);
  const visible = Math.min(phase, content.branches.length);
  const showClose = phase > content.branches.length;

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
      <div className="flex justify-center">
        <div className="rounded-2xl bg-accent px-8 py-3 text-2xl font-semibold text-white">
          {content.title}
        </div>
      </div>

      {visible > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          {content.branches.slice(0, visible).map((branch) => (
            <div
              key={branch.title}
              className="rounded-3xl border-2 border-accent bg-white px-5 py-4 timeline-node-in"
            >
              <p className="text-xl font-semibold text-accent">{branch.title}</p>
              <ul className="mt-3 space-y-1 font-mono text-lg text-text-primary break-words">
                {branch.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {showClose && (
        <p className="mt-6 text-center title-kai text-2xl text-text-primary timeline-node-in">
          {content.close}
        </p>
      )}

      {!done && <p className="mt-6 text-center text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}
