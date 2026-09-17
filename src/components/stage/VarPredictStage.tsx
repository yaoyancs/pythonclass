import type { VarPredictContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: VarPredictContent;
  sceneId: string;
}

export function VarPredictStage({ content, sceneId }: Props) {
  // 0 code+q → 1 reveal first → 2 compare → 3 compare reveal → 4 takeaway
  const maxPhase = content.compareCode ? 4 : 2;
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);

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
      <pre className="rounded-3xl bg-code-bg shadow-card px-6 py-5 font-mono text-xl text-code-text whitespace-pre-wrap">
        {content.code}
      </pre>
      <p className="mt-5 stage-emphasis text-2xl">{content.question}</p>

      {phase >= 1 && (
        <div className="mt-4 rounded-3xl bg-accent-muted px-5 py-4 timeline-node-in">
          <p className="text-sm tracking-[0.18em] text-accent mb-2">输出</p>
          <pre className="font-mono text-xl whitespace-pre-wrap">{content.revealOutputs.join('\n')}</pre>
        </div>
      )}

      {content.compareCode && phase >= 2 && (
        <pre className="mt-5 rounded-3xl bg-code-bg shadow-card px-6 py-5 font-mono text-xl text-code-text whitespace-pre-wrap timeline-node-in">
          {content.compareCode}
        </pre>
      )}

      {content.compareOutputs && phase >= 3 && (
        <div className="mt-4 rounded-3xl bg-accent-muted px-5 py-4 timeline-node-in">
          <pre className="font-mono text-xl whitespace-pre-wrap">{content.compareOutputs.join('\n')}</pre>
        </div>
      )}

      {phase >= (content.compareCode ? 4 : 2) && (
        <ul className="mt-5 space-y-2 timeline-node-in">
          {content.takeaway.map((t) => (
            <li key={t} className="title-kai text-xl text-text-primary">
              {t}
            </li>
          ))}
        </ul>
      )}

      {!done && <p className="mt-5 text-base text-accent/80">先预测，再点击继续</p>}
    </div>
  );
}
