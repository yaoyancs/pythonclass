import type { MachineLangContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';
import { MemoryCpuDiagram, PunchCardSketch } from './MachineDiagram';

interface MachineLangStageProps {
  content: MachineLangContent;
  sceneId: string;
}

/** 示意用二进制墙：中间偏后藏一个错误位 */
const BUG_LINE = 2;
const BUG_COL = 14;

function buildBinaryWall(seedLines: string[]): string[] {
  return [
    ...seedLines,
    '11001010 00110101',
    '01101100 10010111',
    '10101101 01001011',
    '00111001 11100010',
  ];
}

export function MachineLangStage({ content, sceneId }: MachineLangStageProps) {
  // 0 示意二进制 → 1 提问 → 2 痛点 → 3 找错动画 → 4 板书
  const maxPhase = content.conclusion ? 4 : 3;
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);
  const wall = buildBinaryWall(content.binaryLines);
  const mappedSteps = Math.min(content.binaryLines.length, 2);
  const showBug = phase >= 3;

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
      <div className="flex items-baseline gap-4 flex-wrap">
        <p className="text-sm tracking-[0.2em] text-accent">第一代</p>
        <p className="title-kai text-lg text-text-secondary">{content.era}</p>
        {content.taskNote && (
          <p className="text-base text-text-secondary">· {content.taskNote}</p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-[minmax(18rem,22rem)_max-content] gap-8 items-start">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <PunchCardSketch />
            <p className="title-kai text-lg text-text-primary leading-snug">
              打孔卡
              <span className="block text-base text-text-secondary font-sans">
                有孔 / 无孔 ≈ 1 / 0
              </span>
            </p>
          </div>
          <div className="flex flex-col items-start gap-1">
            <MemoryCpuDiagram lit />
            <p className="title-kai text-lg text-text-primary leading-snug">
              内存里的位 → 送进 CPU
              <span className="block text-base text-text-secondary font-sans">
                存的是 0 和 1，不是「12+8」这句话
              </span>
            </p>
          </div>
        </div>

        <div
          className={`rounded-3xl bg-code-bg shadow-card ${
            showBug ? 'px-6 py-4 w-[min(36rem,100%)]' : 'px-7 py-5 w-max'
          }`}
        >
          <p className="text-sm tracking-[0.18em] text-code-muted mb-3">
            {showBug ? '找错 · 示意' : `${content.disclaimer ?? '示意'} · CPU 真正执行的指令`}
          </p>
          {showBug ? (
            <div className="stage-fade-in">
              <p className="text-base text-code-muted mb-2 leading-snug">
                {content.bugHint}
                <span className="ml-2 text-code-error">一位错了，结果可能全错。</span>
              </p>
              <div className="font-mono text-sm text-code-muted leading-relaxed tracking-widest">
                {wall.map((line, li) => (
                  <div key={`${line}-${li}`} className="whitespace-pre">
                    {line.split('').map((ch, ci) => {
                      const isBug = li === BUG_LINE && ci === BUG_COL && ch !== ' ';
                      return (
                        <span
                          key={`${li}-${ci}`}
                          className={
                            isBug
                              ? 'text-code-error bit-error-pulse font-bold inline-block scale-125 origin-center outline outline-1 outline-code-error rounded-sm'
                              : undefined
                          }
                        >
                          {ch}
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="font-mono text-2xl text-code-text space-y-2 tracking-wider whitespace-nowrap">
              {content.binaryLines.map((line, i) => {
                const mapped = i < mappedSteps && phase >= 1;
                return (
                  <div
                    key={line}
                    className={`transition-colors duration-500 ${mapped ? 'text-accent' : ''}`}
                  >
                    {line}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {phase >= 1 && (
        <p className="mt-4 stage-emphasis text-[clamp(1rem,1.6vw,1.2rem)] leading-snug stage-fade-in">
          {content.question}
        </p>
      )}

      {phase >= 2 && (
        <ul className="mt-3 grid grid-cols-4 gap-2.5 stage-fade-in">
          {content.painPoints.map((point) => (
            <li
              key={point}
              className="rounded-2xl bg-classroom-stage shadow-card px-3 py-1.5 text-center text-[clamp(0.95rem,1.4vw,1.1rem)] text-text-primary"
            >
              {point}
            </li>
          ))}
        </ul>
      )}

      {content.conclusion && phase >= 4 && (
        <p className="mt-4 rounded-3xl bg-accent-muted px-6 py-4 title-kai text-xl text-text-primary stage-fade-in">
          {content.conclusion}
        </p>
      )}

      {!done && (
        <p className="mt-3 text-base text-accent/80">点击继续 · 或按空格 / →</p>
      )}
    </div>
  );
}
