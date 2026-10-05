import { useEffect } from 'react';
import type { IdentifiersContent } from '../../types/scene';
import { useSceneEngine } from '../../engine/SceneEngine';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: IdentifiersContent;
  sceneId: string;
}

export function IdentifiersStage({ content, sceneId }: Props) {
  const { dispatch } = useSceneEngine();
  const demos = content.demos ?? [];
  const maxPhase = Math.max(demos.length - 1, 0);
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);
  const demo = demos[phase];
  const showKeywords = phase === 1;
  const showKeywordNote = phase === 2;

  useEffect(() => {
    if (!demo) return;
    dispatch({ type: 'UPDATE_CODE', code: demo.code, clearOutput: true });
  }, [phase, demo, dispatch]);

  return (
    <div
      className="mt-3 cursor-pointer select-none"
      onClick={() => advance()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && advance()) e.preventDefault();
      }}
    >
      <p className="text-xl leading-relaxed">{content.definition}</p>
      {phase === 0 && content.examples && (
        <p className="mt-1 text-lg text-text-secondary">{content.examples}</p>
      )}

      <ol className="mt-3 space-y-1.5">
        {content.rules.map((rule, i) => (
          <li
            key={rule}
            className="flex gap-3 rounded-2xl bg-classroom-stage px-4 py-2 text-lg shadow-card"
          >
            <span className="tabular-nums text-accent">{i + 1}.</span>
            <span>{rule}</span>
          </li>
        ))}
      </ol>

      {demo && (
        <p key={demo.title} className="mt-3 title-kai text-xl text-text-secondary timeline-node-in leading-relaxed">
          <span className="text-accent">{demo.title}。 </span>
          {demo.note}
        </p>
      )}

      {showKeywords && (
        <div className="mt-3 timeline-node-in">
          <p className="text-lg text-text-secondary">{content.keywordLead}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {content.keywords.map((word) => (
              <span
                key={word}
                className="rounded-lg bg-code-bg px-2.5 py-0.5 font-mono text-sm text-code-text"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {showKeywordNote && content.keywordNote && (
        <p className="mt-3 text-lg timeline-node-in">{content.keywordNote}</p>
      )}

      {done && content.close && (
        <p className="mt-4 text-lg text-text-secondary timeline-node-in">{content.close}</p>
      )}
      {!done && <p className="mt-3 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}
