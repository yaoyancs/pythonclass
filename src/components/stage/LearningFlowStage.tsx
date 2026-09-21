import { useCallback, useEffect, useState } from 'react';
import type { LearningFlowContent } from '../../types/scene';

declare global {
  interface Window {
    __pyclassStageAdvance?: () => boolean;
  }
}

interface LearningFlowStageProps {
  flow: LearningFlowContent;
  sceneId: string;
}

/**
 * 课堂分步动画：点击或空格/右键逐步揭示。
 * 步骤：开场 → 流程节点依次出现 → AI 说明。
 */
export function LearningFlowStage({ flow, sceneId }: LearningFlowStageProps) {
  // phase: 0=仅 lead，1..n=steps，n+1=ai（完成）
  const maxPhase = flow.steps.length + 1;
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    setPhase(0);
  }, [sceneId]);

  const advance = useCallback(() => {
    if (phase >= maxPhase) return false;
    setPhase((p) => p + 1);
    return true;
  }, [phase, maxPhase]);

  useEffect(() => {
    window.__pyclassStageAdvance = () => advance();
    return () => {
      delete window.__pyclassStageAdvance;
    };
  }, [advance]);

  const stepsVisible = Math.min(phase, flow.steps.length);
  const showAi = phase > flow.steps.length;
  const done = phase >= maxPhase;

  return (
    <div
      className="mt-5 cursor-pointer select-none"
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
      <p className="title-kai text-2xl text-text-primary leading-relaxed">{flow.lead}</p>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)_18rem] gap-8 items-center">
        <div className="flex flex-col items-start">
          {flow.steps.map((step, i) => {
            const visible = i < stepsVisible;
            const showArrow = i < flow.steps.length - 1 && visible && i + 1 < stepsVisible;
            return (
              <div key={step} className={visible ? 'w-full' : 'hidden'}>
                <div className="rounded-2xl bg-classroom-stage shadow-card px-5 py-2.5 text-xl text-text-primary stage-fade-in">
                  {step}
                </div>
                {showArrow && (
                  <div className="pl-7 py-0.5 text-accent text-xl leading-none stage-fade-in">↓</div>
                )}
              </div>
            );
          })}
        </div>

        <div
          className={`transition-all duration-700 ${
            showAi ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6 pointer-events-none'
          }`}
        >
          <div className="rounded-3xl bg-accent-muted px-5 py-5 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl" aria-hidden>
                🤖
              </span>
              <p className="title-kai text-lg text-accent leading-snug">{flow.aiNote.title}</p>
            </div>
            <p className="text-lg text-text-primary leading-relaxed">{flow.aiNote.body}</p>
          </div>
        </div>
      </div>

      {!done && (
        <p className="mt-6 text-base text-accent/80">点击继续 · 或按空格 / →</p>
      )}
    </div>
  );
}
