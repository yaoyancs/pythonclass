import type { PythonBriefHistoryContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface PythonBriefHistoryStageProps {
  content: PythonBriefHistoryContent;
  sceneId: string;
}

/** 少量历史拐点逐条出现；可选 bridge */
export function PythonBriefHistoryStage({ content, sceneId }: PythonBriefHistoryStageProps) {
  const hasBridge = Boolean(content.bridge);
  // phase: 0..n-1 节点；若有 bridge 则再多一步
  const maxPhase = hasBridge ? content.nodes.length : Math.max(content.nodes.length - 1, 0);
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);

  const nodesVisible = Math.min(phase + 1, content.nodes.length);
  const showBridge = hasBridge && phase >= content.nodes.length;

  return (
    <div
      className="mt-6 cursor-pointer select-none"
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
      <ol className="space-y-4">
        {content.nodes.slice(0, nodesVisible).map((node, i) => {
          const isNewest = i === nodesVisible - 1;
          return (
            <li
              key={`${node.year}-${node.title}`}
              className={`flex gap-5 rounded-3xl bg-classroom-stage shadow-card px-6 py-5 ${
                isNewest ? 'pyhist-node-in' : ''
              }`}
            >
              <span className="shrink-0 w-28 title-kai text-xl text-accent">{node.year}</span>
              <div>
                <p className="title-kai text-xl text-text-primary leading-snug">{node.title}</p>
                <p className="mt-1.5 text-lg text-text-secondary leading-relaxed">{node.note}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {showBridge && content.bridge && (
        <p className="mt-7 stage-emphasis text-xl leading-relaxed pyhist-card-in">{content.bridge}</p>
      )}

      {!done && <p className="mt-6 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}
