import type { TranslateStackContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface TranslateStackStageProps {
  stack: TranslateStackContent;
  sceneId: string;
}

export function TranslateStackStage({ stack, sceneId }: TranslateStackStageProps) {
  const maxPhase = stack.layers.length + 1;
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);
  const litCount = Math.min(phase, stack.layers.length);
  const showConclusion = phase > stack.layers.length;

  return (
    <div
      className="mt-2 cursor-pointer select-none"
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
      <p className="title-kai text-xl text-text-primary leading-snug">{stack.lead}</p>
      <p className="mt-1 text-sm text-text-secondary">例：{stack.task}</p>

      <div className="mt-5 grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] gap-y-0 gap-x-1 items-stretch">
        {stack.layers.map((layer, i) => {
          const lit = i < litCount;
          return (
            <div key={layer.label} className="contents">
              {i > 0 && (
                <div
                  className={`self-center text-accent text-2xl px-0.5 transition-opacity duration-500 ${
                    i < litCount ? 'opacity-100' : 'opacity-20'
                  }`}
                >
                  →
                </div>
              )}
              <div
                className={`min-w-0 rounded-2xl px-3 py-3 shadow-card transition-all duration-500 ${
                  lit ? 'bg-classroom-stage opacity-100' : 'bg-classroom-playground/70 opacity-45'
                }`}
              >
                <p className="text-xs tracking-[0.12em] text-accent leading-tight">{layer.label}</p>
                <p className="mt-0.5 text-xs text-text-secondary leading-snug">{layer.note}</p>
                <pre
                  className={`mt-2 font-mono text-[clamp(0.68rem,1.05vw,0.9rem)] leading-snug whitespace-pre-wrap ${
                    layer.label.includes('机器')
                      ? `rounded-lg px-2 py-1.5 ${lit ? 'bg-code-bg text-code-text' : 'text-text-secondary'}`
                      : 'text-text-primary'
                  }`}
                >
                  {lit ? layer.body : '……'}
                </pre>
              </div>
            </div>
          );
        })}
      </div>

      {showConclusion && (
        <p className="mt-5 title-kai text-lg md:text-xl text-text-primary leading-relaxed stage-fade-in">
          {stack.conclusion}
        </p>
      )}

      {!done && (
        <p className="mt-4 text-base text-accent/80">
          {phase === 0 && '点击继续 · 人想做什么'}
          {phase === 1 && '点击继续 · 写成高级语言'}
          {phase === 2 && '点击继续 · 靠近硬件的汇编'}
          {phase === 3 && '点击继续 · CPU 真正执行的指令'}
          {phase === 4 && '点击继续 · CPU 算出结果'}
          {phase === 5 && '点击继续'}
        </p>
      )}
    </div>
  );
}
