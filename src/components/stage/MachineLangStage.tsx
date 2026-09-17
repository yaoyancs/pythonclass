import type { MachineLangContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

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
  // 0 示意二进制 → 1 提问 → 2 痛点 → 3 找错动画
  const { phase, advance, done } = useStageAdvance(sceneId, 3);
  const wall = buildBinaryWall(content.binaryLines);

  return (
    <div
      className="mt-4 cursor-pointer select-none"
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

      <div className="mt-4 rounded-3xl bg-code-bg shadow-card px-7 py-4 relative">
        <p className="absolute top-3 right-5 text-sm tracking-[0.18em] text-code-muted">
          {content.disclaimer ?? '示意'}
        </p>
        <div className="font-mono text-lg text-code-text space-y-1 tracking-wider pt-1">
          {content.binaryLines.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      </div>

      {phase >= 1 && (
        <p className="mt-5 stage-emphasis text-xl leading-relaxed stage-fade-in">
          {content.question}
        </p>
      )}

      {phase >= 2 && (
        <ul className="mt-4 grid grid-cols-4 gap-3 stage-fade-in">
          {content.painPoints.map((point) => (
            <li
              key={point}
              className="rounded-2xl bg-classroom-stage shadow-card px-4 py-2.5 text-center text-lg text-text-primary"
            >
              {point}
            </li>
          ))}
        </ul>
      )}

      {phase >= 3 && (
        <div className="mt-4 stage-fade-in">
          <p className="text-base text-text-secondary mb-2">{content.bugHint}</p>
          <div className="rounded-3xl bg-code-bg shadow-card px-5 py-3">
            <div className="font-mono text-xs md:text-sm text-code-muted leading-relaxed tracking-widest">
              {wall.map((line, li) => (
                <div key={`${line}-${li}`} className="whitespace-pre">
                  {line.split('').map((ch, ci) => {
                    const isBug = li === BUG_LINE && ci === BUG_COL && ch !== ' ';
                    return (
                      <span
                        key={`${li}-${ci}`}
                        className={isBug ? 'text-code-error bit-error-pulse font-bold' : undefined}
                      >
                        {ch}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!done && (
        <p className="mt-5 text-base text-accent/80">点击继续 · 或按空格 / →</p>
      )}
    </div>
  );
}
