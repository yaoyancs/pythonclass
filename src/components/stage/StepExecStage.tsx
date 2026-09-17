import type { StepExecContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: StepExecContent;
  sceneId: string;
}

export function StepExecStage({ content, sceneId }: Props) {
  // 0 显示文件名与代码 → 1..pipeline 推进解释链 → 然后逐行高亮执行
  // 简化：phase 0 = 仅文件；1 = pipeline 全出；然后 lineIndex 执行
  // Better: phase 0..pipeline.length-1 reveal pipeline; then execute lines
  const pipeLen = content.pipeline.length;
  const maxPhase = pipeLen + content.lines.length;
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);

  const pipeVisible = Math.min(phase + 1, pipeLen);
  const execStarted = phase >= pipeLen;
  const lineIndex = execStarted ? phase - pipeLen : -1; // 0-based current executing
  const outputsVisible = execStarted ? lineIndex + 1 : 0;

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
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {content.pipeline.slice(0, pipeVisible).map((p, i) => (
          <div key={p} className="flex items-center gap-2">
            {i > 0 && <span className="text-accent">↓</span>}
            <span
              className={`rounded-xl px-3 py-1.5 text-base ${
                i === pipeVisible - 1 ? 'bg-accent text-white timeline-node-in' : 'bg-accent-muted text-text-primary'
              }`}
            >
              {i === 0 ? content.filename : p}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="rounded-3xl bg-code-bg shadow-card overflow-hidden">
          <div className="px-4 py-2 text-sm text-code-muted border-b border-code-border">{content.filename}</div>
          <pre className="px-4 py-4 font-mono text-lg leading-relaxed">
            {content.lines.map((line, i) => (
              <div
                key={`${line}-${i}`}
                className={`px-2 py-0.5 rounded transition-all duration-300 ${
                  execStarted && i === lineIndex
                    ? 'bg-highlight text-code-bg'
                    : execStarted && i < lineIndex
                      ? 'text-code-muted'
                      : 'text-code-text'
                }`}
              >
                {line}
              </div>
            ))}
          </pre>
        </div>

        <div className="rounded-3xl bg-classroom-stage shadow-card px-5 py-4 min-h-[14rem]">
          <p className="text-sm tracking-[0.18em] text-accent mb-3">Console</p>
          <div className="font-mono text-lg space-y-1">
            {content.outputs.slice(0, outputsVisible).map((o) => (
              <div key={o} className="timeline-node-in text-text-primary">
                {o}
              </div>
            ))}
            {!execStarted && (
              <p className="text-text-secondary text-base">等待解释器执行…</p>
            )}
          </div>
        </div>
      </div>

      {done && (
        <p className="mt-5 stage-emphasis text-xl timeline-node-in">{content.conclusion}</p>
      )}

      {!done && <p className="mt-5 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}
