import { useCallback, useEffect, useState } from 'react';
import type { HistoryDialogueContent } from '../../types/scene';

declare global {
  interface Window {
    __pyclassStageAdvance?: () => boolean;
  }
}

interface HistoryDialogueStageProps {
  dialogue: HistoryDialogueContent;
  sceneId: string;
}

/** 人机对话动画：人类自然语言 → CPU 从 ??? 变为二进制指令 */
export function HistoryDialogueStage({ dialogue, sceneId }: HistoryDialogueStageProps) {
  // 0: 初始 人话 + ???；1: 人话淡出，二进制出现
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    setPhase(0);
  }, [sceneId]);

  const advance = useCallback(() => {
    if (phase >= 1) return false;
    setPhase(1);
    return true;
  }, [phase]);

  useEffect(() => {
    window.__pyclassStageAdvance = () => advance();
    return () => {
      delete window.__pyclassStageAdvance;
    };
  }, [advance]);

  const transformed = phase >= 1;

  return (
    <div
      className="mt-8 cursor-pointer select-none"
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
      <p className="text-sm uppercase tracking-[0.2em] font-semibold text-accent mb-3">例</p>
      <p className="title-stage text-stage-body text-text-primary">{dialogue.task}</p>
      <p className="text-2xl text-text-secondary mt-4 font-medium">{dialogue.subtitle}</p>

      <div className="mt-10 grid grid-cols-2 gap-8 items-stretch">
        <div className="rounded-3xl bg-classroom-stage shadow-card p-8 min-h-[280px] flex flex-col">
          <p className="text-sm tracking-[0.18em] text-text-secondary mb-6">人类</p>
          <div className="flex-1 flex items-center justify-center relative">
            <p
              className={`title-kai text-3xl text-center leading-relaxed transition-all duration-1000 ${
                transformed
                  ? 'opacity-0 scale-95 blur-sm -translate-y-2'
                  : 'opacity-100'
              }`}
            >
              {dialogue.humanText}
            </p>
          </div>
          {transformed && dialogue.transformHint && (
            <p className="text-center text-lg text-text-secondary stage-fade-in mt-4">
              {dialogue.transformHint}
            </p>
          )}
        </div>

        <div className="rounded-3xl bg-code-bg shadow-card p-8 min-h-[280px] flex flex-col">
          <p className="text-sm tracking-[0.18em] text-code-muted mb-6">CPU</p>
          <div className="flex-1 flex items-center justify-center relative">
            <p
              className={`absolute title-kai text-5xl text-code-error tracking-[0.3em] transition-all duration-700 ${
                transformed ? 'opacity-0 scale-90' : 'opacity-100'
              }`}
            >
              {dialogue.cpuConfused}
            </p>
            <div
              className={`font-mono text-lg text-code-text space-y-2 text-left w-full transition-all duration-1000 ${
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

      {!transformed ? (
        <p className="mt-8 text-base text-accent/80">点击继续：人类语言变成机器指令</p>
      ) : (
        <div className="mt-8 space-y-3 stage-fade-in">
          <p className="text-stage-sub text-accent">
            CPU 只听得懂机器指令——人类语言到不了处理器。
          </p>
          {dialogue.conclusion && (
            <p className="title-kai text-xl text-text-primary leading-relaxed">
              {dialogue.conclusion}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
