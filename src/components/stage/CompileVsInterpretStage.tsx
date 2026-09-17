import type { CompileVsInterpretContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: CompileVsInterpretContent;
  sceneId: string;
}

function CodePanel({
  lines,
  mode,
  activeLine,
  batchActive,
  dimmed,
}: {
  lines: string[];
  mode: 'batch' | 'line';
  activeLine: number;
  batchActive: boolean;
  dimmed?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl bg-code-bg px-3 py-2.5 shadow-card font-mono text-[0.7rem] md:text-xs text-left transition-all duration-500 ${
        dimmed ? 'opacity-35 scale-95' : 'opacity-100'
      }`}
    >
      {lines.map((line, i) => {
        const isBatchLit = mode === 'batch' && batchActive;
        const isCurrent = mode === 'line' && i === activeLine;
        const isDone = mode === 'line' && activeLine > i;
        return (
          <div
            key={`${line}-${i}`}
            className={`flex items-center gap-2 rounded-lg px-2 py-1 transition-all duration-400 ${
              isBatchLit
                ? 'bg-accent/30 text-code-text digest-packet-bounce'
                : isCurrent
                  ? 'bg-accent text-white digest-station-in'
                  : isDone
                    ? 'text-code-muted/80'
                    : 'text-code-text'
            }`}
          >
            <span className="w-4 shrink-0 opacity-50 tabular-nums">{i + 1}</span>
            <span className="whitespace-pre">{line}</span>
            {isCurrent && <span className="ml-auto text-[0.65rem] tracking-wider">读→执行</span>}
            {isBatchLit && i === 0 && (
              <span className="ml-auto text-[0.65rem] tracking-wider text-accent">整份</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ConsolePanel({
  outputs,
  visibleCount,
  burst,
}: {
  outputs: string[];
  visibleCount: number;
  burst?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-[#0A1210] px-3 py-2.5 shadow-card min-h-[5.5rem] font-mono text-[0.7rem] md:text-xs text-left">
      <p className="text-code-muted mb-1.5 text-[0.65rem] tracking-wider">Console</p>
      {visibleCount <= 0 && <p className="text-code-muted/50">（尚未输出）</p>}
      {outputs.slice(0, visibleCount).map((out, i) => (
        <div
          key={`${out}-${i}`}
          className={`text-[#C5E0D6] py-0.5 ${burst ? 'digest-result-pop' : 'digest-bits-in'}`}
          style={burst ? { animationDelay: `${i * 80}ms` } : undefined}
        >
          {out}
        </div>
      ))}
    </div>
  );
}

/**
 * 编译：整份源码一次性翻译 → .exe → 再运行（输出一起出现）
 * 解释：读一行、执行一行、出一行
 */
export function CompileVsInterpretStage({ content, sceneId }: Props) {
  const n = Math.max(content.lines.length, 1);
  // 0 对照 → 1 整份编译 → 2..1+n 解释逐行（2 时同时出现 .exe）
  // → 2+n 编译一次性运行 → 3+n 结论
  const maxPhase = 3 + n;
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);

  const compileTranslating = phase === 1;
  const exeReady = phase >= 2;
  const compileRunning = phase >= 2 + n;
  const showConclusion = phase >= 3 + n;

  const interpretActiveLine =
    phase >= 2 && phase < 2 + n ? phase - 2 : phase >= 2 + n ? n : -1;
  const interpretOutCount = phase < 2 ? 0 : phase < 2 + n ? phase - 1 : n;
  const compileOutCount = compileRunning ? n : 0;

  let hint = '点击继续 · 编译轨：整份代码进入编译器';
  if (phase === 1) hint = '点击继续 · 得到完整 .exe；解释轨读第 1 行并执行';
  else if (phase >= 2 && phase < 2 + n - 1)
    hint = `点击继续 · 解释轨读第 ${phase} 行并执行`;
  else if (phase === 2 + n - 1) hint = '点击继续 · 编译轨现在才运行（结果一次性出现）';
  else if (phase === 2 + n) hint = '点击继续 · 看结论';

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 编译轨 */}
        <div className="rounded-3xl bg-classroom-stage shadow-card border border-classroom-border/40 px-4 py-4">
          <div className="flex items-baseline justify-between gap-2 mb-3">
            <p className="title-kai text-lg text-text-primary">{content.compiledTitle}</p>
            <span className="text-xs tracking-[0.16em] text-accent">{content.compiledTag}</span>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center mb-3">
            <CodePanel
              lines={content.lines}
              mode="batch"
              activeLine={-1}
              batchActive={compileTranslating}
              dimmed={exeReady && !compileTranslating}
            />
            <div className="flex flex-col items-center gap-1">
              <div
                className={`rounded-full px-2.5 py-1 text-xs title-kai ${
                  compileTranslating || exeReady
                    ? 'bg-accent text-white'
                    : 'bg-classroom-playground text-text-secondary'
                } ${compileTranslating ? 'digest-packet-bounce' : ''}`}
              >
                编译器
              </div>
              <span className="text-accent text-lg">→</span>
            </div>
            <div
              className={`rounded-2xl border-2 px-3 py-4 text-center transition-all duration-700 ${
                exeReady
                  ? 'border-accent bg-accent text-white digest-station-in'
                  : 'border-dashed border-classroom-border text-text-secondary/50'
              }`}
            >
              <p className="title-kai text-xl">{exeReady ? '.exe' : '？'}</p>
              <p className="text-[0.65rem] mt-1 opacity-80">
                {exeReady ? '完整程序已就绪' : '尚无完整程序'}
              </p>
            </div>
          </div>

          <div className="mb-2">
            <span
              className={`inline-block rounded-full px-3 py-1 text-sm ${
                compileRunning
                  ? 'bg-accent text-white digest-cpu-pulse'
                  : exeReady
                    ? 'bg-accent-muted text-accent'
                    : 'bg-classroom-playground text-text-secondary/50'
              }`}
            >
              {compileRunning ? '运行完整程序' : exeReady ? '译完了，还没运行' : '等待整份翻译完成'}
            </span>
          </div>

          <ConsolePanel outputs={content.outputs} visibleCount={compileOutCount} burst />

          {compileTranslating && (
            <p className="mt-2 text-center text-sm text-accent digest-station-in">
              三行一起送进编译器，先全部翻译完
            </p>
          )}
          {exeReady && !compileRunning && (
            <p className="mt-2 text-center text-sm text-text-secondary digest-station-in">
              有完整程序了，但此刻还不运行——先看右边逐行
            </p>
          )}
          {compileRunning && (
            <p className="mt-2 text-center text-sm text-accent digest-station-in">
              先全部翻译完，再一次性运行
            </p>
          )}
        </div>

        {/* 解释轨 */}
        <div className="rounded-3xl bg-classroom-stage shadow-card border border-classroom-border/40 px-4 py-4">
          <div className="flex items-baseline justify-between gap-2 mb-3">
            <p className="title-kai text-lg text-text-primary">{content.interpretedTitle}</p>
            <span className="text-xs tracking-[0.16em] text-accent">{content.interpretedTag}</span>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center mb-3">
            <CodePanel
              lines={content.lines}
              mode="line"
              activeLine={interpretActiveLine}
              batchActive={false}
            />
            <div className="flex flex-col items-center gap-1">
              <div
                className={`rounded-full px-2.5 py-1 text-xs title-kai ${
                  interpretActiveLine >= 0 && interpretActiveLine < n
                    ? 'bg-accent text-white digest-cpu-pulse'
                    : interpretOutCount >= n
                      ? 'bg-accent-muted text-accent'
                      : 'bg-classroom-playground text-text-secondary'
                }`}
              >
                解释器
              </div>
              <span className="text-accent text-lg">→</span>
            </div>
            <div
              className={`rounded-2xl border-2 px-3 py-4 text-center transition-all duration-500 ${
                interpretActiveLine >= 0
                  ? 'border-accent bg-accent-muted digest-station-in'
                  : 'border-dashed border-classroom-border text-text-secondary/50'
              }`}
            >
              <p className="title-kai text-base text-text-primary">
                {interpretActiveLine >= 0 && interpretActiveLine < n
                  ? `第 ${interpretActiveLine + 1} 行`
                  : interpretOutCount >= n
                    ? '逐行完成'
                    : '待命'}
              </p>
              <p className="text-[0.65rem] mt-1 text-text-secondary">不生成整份 .exe</p>
            </div>
          </div>

          <div className="mb-2">
            <span
              className={`inline-block rounded-full px-3 py-1 text-sm ${
                interpretActiveLine >= 0 && interpretActiveLine < n
                  ? 'bg-accent text-white'
                  : 'bg-classroom-playground text-text-secondary'
              }`}
            >
              {interpretActiveLine >= 0 && interpretActiveLine < n
                ? `读第 ${interpretActiveLine + 1} 行 → 立刻执行`
                : interpretOutCount >= n
                  ? '一行一行都执行过了'
                  : '等待逐行开始'}
            </span>
          </div>

          <ConsolePanel outputs={content.outputs} visibleCount={interpretOutCount} />

          {interpretOutCount > 0 && interpretOutCount < n && (
            <p className="mt-2 text-center text-sm text-accent digest-station-in">
              读一行，执行一行，输出一行
            </p>
          )}
          {interpretOutCount >= n && (
            <p className="mt-2 text-center text-sm text-accent digest-station-in">
              始终没有「先译完全文」这一步
            </p>
          )}
        </div>
      </div>

      {showConclusion && (
        <p className="mt-5 title-kai text-xl md:text-2xl text-text-primary text-center leading-relaxed digest-station-in">
          {content.conclusion}
        </p>
      )}

      {!done && <p className="mt-4 text-base text-accent/80">{hint}</p>}
    </div>
  );
}
