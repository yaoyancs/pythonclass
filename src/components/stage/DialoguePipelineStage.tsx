import type { DigestPipelineContent, HistoryDialogueContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';
import { DigestPipelineStage } from './DigestPipelineStage';

interface DialoguePipelineStageProps {
  dialogue: HistoryDialogueContent;
  pipeline: DigestPipelineContent;
  sceneId: string;
}

/** 上：人机对话；下：翻译流水线。同一次点击先揭开 CPU，再推进流水线。 */
export function DialoguePipelineStage({
  dialogue,
  pipeline,
  sceneId,
}: DialoguePipelineStageProps) {
  // 0 人话+??? → 1 CPU 二进制 → 2–5 流水线四步
  const { phase, advance, done } = useStageAdvance(sceneId, 5);
  const transformed = phase >= 1;
  const digestPhase = Math.max(0, phase - 1);

  return (
    <div
      className="mt-3 cursor-pointer select-none"
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
      <p className="text-sm tracking-[0.2em] font-semibold text-accent mb-1">例</p>
      <p className="title-stage text-xl text-text-primary">{dialogue.task}</p>
      <p className="text-lg text-text-secondary mt-1 font-medium">{dialogue.subtitle}</p>

      <div className="mt-4 grid grid-cols-2 gap-5 items-stretch">
        <div className="rounded-3xl bg-classroom-stage shadow-card px-6 py-4 min-h-[10.5rem] flex flex-col">
          <p className="text-sm tracking-[0.18em] text-text-secondary mb-3">人类</p>
          <div className="flex-1 flex items-center justify-center relative">
            <p
              className={`title-kai text-2xl text-center leading-relaxed transition-all duration-1000 ${
                transformed ? 'opacity-0 scale-95 blur-sm' : 'opacity-100'
              }`}
            >
              {dialogue.humanText}
            </p>
          </div>
          {transformed && dialogue.transformHint && (
            <p className="text-center text-base text-text-secondary stage-fade-in mt-2">
              {dialogue.transformHint}
            </p>
          )}
        </div>

        <div className="rounded-3xl bg-code-bg shadow-card px-6 py-4 min-h-[10.5rem] flex flex-col">
          <p className="text-sm tracking-[0.18em] text-code-muted mb-3">CPU</p>
          <div className="flex-1 flex items-center justify-center relative">
            <p
              className={`absolute title-kai text-4xl text-code-error tracking-[0.3em] transition-all duration-700 ${
                transformed ? 'opacity-0 scale-90' : 'opacity-100'
              }`}
            >
              {dialogue.cpuConfused}
            </p>
            <div
              className={`font-mono text-base text-code-text space-y-1 text-left w-full transition-all duration-1000 ${
                transformed
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-3 pointer-events-none'
              }`}
            >
              {dialogue.cpuBinary.map((line) => (
                <div key={line} className="tracking-wider">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <DigestPipelineStage content={pipeline} playbackPhase={digestPhase} />

      {!done && (
        <p className="mt-3 text-base text-accent/80">
          {phase === 0 && '点击继续：人类语言变成机器指令'}
          {phase === 1 && '点击继续 · 源码送进翻译器'}
          {phase === 2 && '点击继续 · 吐出机器指令'}
          {phase === 3 && '点击继续 · 指令进入 CPU'}
          {phase === 4 && '点击继续 · 亮起结果'}
        </p>
      )}
    </div>
  );
}
