import type { AssemblyLangContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface AssemblyLangStageProps {
  content: AssemblyLangContent;
  sceneId: string;
}

export function AssemblyLangStage({ content, sceneId }: AssemblyLangStageProps) {
  // 0 二进制 → 1 缩成汇编 → 2 教师说明 → 3 汇编器（翻译程序）
  const { phase, advance, done } = useStageAdvance(sceneId, 3);
  const showAsm = phase >= 1;
  const showNote = phase >= 2;
  const showAssembler = phase >= 3;

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
      <div className="flex items-baseline gap-4 flex-wrap">
        <p className="text-sm tracking-[0.2em] text-accent">第二代</p>
        <p className="title-kai text-xl text-text-secondary">汇编语言</p>
      </div>

      <div
        className={`mt-6 grid gap-4 items-center transition-all duration-700 ${
          showAssembler ? 'grid-cols-[1fr_auto_1fr]' : 'grid-cols-1 max-w-xl mx-auto'
        }`}
      >
        <div
          className={`rounded-3xl bg-code-bg shadow-card px-6 py-5 transition-all duration-1000 ${
            showAsm && !showAssembler ? 'opacity-40 scale-95' : 'opacity-100'
          } ${showAssembler ? 'opacity-100 scale-100' : ''}`}
        >
          <p className="text-sm tracking-[0.18em] text-code-muted mb-3">机器语言 · 示意</p>
          <div
            className={`font-mono text-code-text space-y-1.5 tracking-wider transition-all duration-1000 ${
              showAsm && !showAssembler ? 'text-sm opacity-50' : 'text-lg'
            }`}
          >
            {content.binaryLines.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </div>

        {showAssembler && (
          <div className="flex flex-col items-center gap-2 stage-fade-in px-2">
            <div className="rounded-full bg-accent text-white title-kai text-lg px-5 py-2 shadow-card">
              {content.assemblerLabel}
            </div>
            <p className="text-accent text-2xl leading-none">→</p>
            <p className="text-sm text-text-secondary text-center max-w-[7rem] leading-snug">
              {content.translatorHint}
            </p>
          </div>
        )}

        <div
          className={`rounded-3xl bg-classroom-stage shadow-card px-6 py-5 transition-all duration-1000 ${
            showAsm
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-4 scale-95 pointer-events-none h-0 overflow-hidden py-0'
          }`}
        >
          <p className="text-sm tracking-[0.18em] text-accent mb-3">汇编语言</p>
          <pre className="font-mono text-2xl text-text-primary leading-relaxed whitespace-pre">
            {content.assemblyLines.join('\n')}
          </pre>
        </div>
      </div>

      {showNote && (
        <blockquote className="mt-7 rounded-3xl bg-accent-muted px-7 py-5 stage-fade-in">
          <p className="title-kai text-xl text-text-primary leading-relaxed">
            “{content.teacherNote}”
          </p>
        </blockquote>
      )}

      {!done && (
        <p className="mt-6 text-base text-accent/80">点击继续 · 或按空格 / →</p>
      )}
    </div>
  );
}
