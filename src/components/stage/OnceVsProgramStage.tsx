import type { OnceVsProgramContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: OnceVsProgramContent;
  sceneId: string;
}

export function OnceVsProgramStage({ content, sceneId }: Props) {
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
      <div className="grid grid-cols-2 gap-5">
        <div className="rounded-3xl bg-classroom-stage shadow-card px-5 py-5">
          <p className="text-sm tracking-[0.18em] text-accent mb-3">问 AI 一次</p>
          <p className="title-kai text-lg text-text-secondary mb-3">{content.aiAsk}</p>
          <p className="font-mono text-2xl text-accent">{content.aiAnswer}</p>
        </div>
        <div
          className={`rounded-3xl bg-code-bg shadow-card px-5 py-5 transition-all duration-700 ${
            phase >= 1 ? 'opacity-100' : 'opacity-40'
          }`}
        >
          <p className="text-sm tracking-[0.18em] text-code-muted mb-3">可重复程序</p>
          <pre className="font-mono text-base text-code-text whitespace-pre-wrap">{content.programCode}</pre>
        </div>
      </div>

      {phase >= 2 && (
        <div className="mt-5 space-y-2 timeline-node-in">
          {content.teacherLines.map((line) => (
            <p key={line} className="title-kai text-xl text-text-primary leading-relaxed">
              “{line}”
            </p>
          ))}
        </div>
      )}

      {!done && <p className="mt-5 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}
