import { useEffect, useState } from 'react';
import type { AssemblyLangContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';
import { PairArrow, RegisterA, TranslatorMini } from './MachineDiagram';

interface AssemblyLangStageProps {
  content: AssemblyLangContent;
  sceneId: string;
}

export function AssemblyLangStage({ content, sceneId }: AssemblyLangStageProps) {
  // 0 二进制 → 1 缩成汇编 → 2 教师说明 → 3 汇编器 → 4 板书
  const maxPhase = content.conclusion ? 4 : 3;
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);
  const showAsm = phase >= 1;
  const showNote = phase >= 2;
  const showAssembler = phase >= 3;
  const [reg, setReg] = useState('—');

  useEffect(() => {
    if (phase < 1) {
      setReg('—');
      return;
    }
    setReg('12');
    const t = window.setTimeout(() => setReg('20'), 480);
    return () => window.clearTimeout(t);
  }, [phase, sceneId]);

  const rowCount = Math.max(content.binaryLines.length, content.assemblyLines.length);

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
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <div className="flex items-baseline gap-4 flex-wrap">
          <p className="text-sm tracking-[0.2em] text-accent">第二代</p>
          <p className="title-kai text-xl text-text-secondary">汇编语言</p>
        </div>
        {showAsm && <RegisterA value={reg} />}
      </div>

      <div
        className={`mt-5 grid gap-4 items-center transition-all duration-700 ${
          showAssembler
            ? 'grid-cols-[1fr_auto_1fr]'
            : showAsm
              ? 'grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]'
              : 'grid-cols-1 max-w-xl mx-auto'
        }`}
      >
        <div
          className={`rounded-3xl bg-code-bg shadow-card px-6 py-5 transition-all duration-700 ${
            showAsm && !showAssembler ? 'opacity-80' : 'opacity-100'
          }`}
        >
          <p className="text-sm tracking-[0.18em] text-code-muted mb-3">机器语言 · 示意</p>
          <div className="space-y-3">
            {content.binaryLines.map((line) => (
              <div
                key={line}
                className={`font-mono tracking-wider whitespace-nowrap transition-all duration-700 ${
                  showAsm && !showAssembler
                    ? 'text-sm text-code-muted'
                    : 'text-lg text-code-text'
                }`}
              >
                {line}
              </div>
            ))}
          </div>
        </div>

        {showAssembler ? (
          <div className="flex flex-col items-center gap-2 stage-fade-in px-1">
            <TranslatorMini spinning label={content.assemblerLabel} />
            <p className="text-xs text-text-secondary text-center max-w-[7.5rem] leading-snug">
              {content.translatorHint}
            </p>
          </div>
        ) : showAsm ? (
          <div className="flex flex-col items-center gap-3">
            {Array.from({ length: rowCount }).map((_, i) => (
              <PairArrow key={i} visible />
            ))}
          </div>
        ) : null}

        <div
          className={`rounded-3xl bg-classroom-stage shadow-card px-6 py-5 transition-all duration-700 ${
            showAsm
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-4 pointer-events-none h-0 overflow-hidden py-0'
          }`}
        >
          <p className="text-sm tracking-[0.18em] text-accent mb-3">汇编语言</p>
          <div className="space-y-3">
            {content.assemblyLines.map((line, i) => (
              <div
                key={line}
                className="font-mono text-[clamp(1rem,1.8vw,1.35rem)] text-text-primary whitespace-nowrap stage-fade-in"
                style={{ animationDelay: `${i * 220}ms` }}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showNote && (
        <blockquote className="mt-6 rounded-3xl bg-accent-muted px-7 py-4 stage-fade-in">
          <p className="title-kai text-[clamp(1.05rem,1.8vw,1.25rem)] text-text-primary leading-relaxed">
            “{content.teacherNote}”
          </p>
        </blockquote>
      )}

      {content.conclusion && phase >= 4 && (
        <p className="mt-4 rounded-3xl bg-accent-muted px-6 py-4 title-kai text-xl text-text-primary stage-fade-in">
          {content.conclusion}
        </p>
      )}

      {!done && (
        <p className="mt-5 text-base text-accent/80">点击继续 · 或按空格 / →</p>
      )}
    </div>
  );
}
