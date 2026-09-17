import type { DigestPipelineContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface DigestPipelineStageProps {
  content: DigestPipelineContent;
  sceneId: string;
}

function FileIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 80 88" className="w-16 h-[4.4rem]" aria-hidden>
      <rect
        x="10"
        y="8"
        width="52"
        height="68"
        rx="6"
        className={active ? 'fill-accent-muted' : 'fill-classroom-playground'}
        stroke="#0A5C4F"
        strokeWidth="2.5"
      />
      <path d="M46 8v16h16" fill="none" stroke="#0A5C4F" strokeWidth="2.5" />
      <path d="M46 8l16 16" fill="none" stroke="#0A5C4F" strokeWidth="2.5" />
      <rect x="22" y="36" width="28" height="3.5" rx="1.5" fill="#0A5C4F" opacity={active ? 1 : 0.35} />
      <rect x="22" y="46" width="22" height="3.5" rx="1.5" fill="#0A5C4F" opacity={active ? 0.75 : 0.25} />
      <rect x="22" y="56" width="18" height="3.5" rx="1.5" fill="#0A5C4F" opacity={active ? 0.5 : 0.2} />
    </svg>
  );
}

function TranslatorMachine({ active, spinning }: { active: boolean; spinning: boolean }) {
  return (
    <svg viewBox="0 0 120 100" className="w-[7.5rem] h-[6.25rem]" aria-hidden>
      <rect
        x="8"
        y="28"
        width="104"
        height="56"
        rx="12"
        className={active ? 'fill-accent-muted' : 'fill-classroom-playground'}
        stroke="#0A5C4F"
        strokeWidth="2.5"
      />
      <rect x="20" y="40" width="36" height="32" rx="6" fill="#0A1210" opacity="0.08" />
      <rect x="64" y="40" width="36" height="32" rx="6" fill="#0A1210" opacity="0.08" />
      {/* funnel mouth */}
      <path
        d="M28 18h64l-10 12H38z"
        className={active ? 'fill-accent' : 'fill-classroom-border'}
        opacity={active ? 0.9 : 0.5}
      />
      <g className={spinning ? 'digest-gear-spin' : ''} style={{ transformOrigin: '38px 56px' }}>
        <circle cx="38" cy="56" r="11" fill="#FFFFFF" stroke="#0A5C4F" strokeWidth="2" />
        <path
          d="M38 42l2.2 5.2h5.5l-4.4 3.6 1.6 5.4L38 53.6 33.1 56.2l1.6-5.4-4.4-3.6h5.5z"
          fill="#0A5C4F"
        />
      </g>
      <g
        className={spinning ? 'digest-gear-spin-rev' : ''}
        style={{ transformOrigin: '82px 56px' }}
      >
        <circle cx="82" cy="56" r="11" fill="#FFFFFF" stroke="#0A5C4F" strokeWidth="2" />
        <path
          d="M82 42l2.2 5.2h5.5l-4.4 3.6 1.6 5.4L82 53.6 77.1 56.2l1.6-5.4-4.4-3.6h5.5z"
          fill="#0A5C4F"
        />
      </g>
      {/* output chute */}
      <path
        d="M48 84h24l8 10H40z"
        className={active ? 'fill-accent' : 'fill-classroom-border'}
        opacity={active ? 0.85 : 0.45}
      />
    </svg>
  );
}

function MachineStrip({ lines, active }: { lines: string[]; active: boolean }) {
  return (
    <svg viewBox="0 0 88 88" className="w-16 h-16" aria-hidden>
      <rect
        x="6"
        y="10"
        width="76"
        height="68"
        rx="10"
        fill="#0A1210"
        opacity={active ? 0.92 : 0.35}
      />
      {(active ? lines.slice(0, 4) : ['········', '········', '········', '········']).map(
        (line, i) => (
          <text
            key={`${line}-${i}`}
            x="44"
            y={28 + i * 14}
            textAnchor="middle"
            fill={active ? '#C5E0D6' : '#9BB0A6'}
            fontFamily="ui-monospace, monospace"
            fontSize="9"
            className={active ? 'digest-bits-in' : undefined}
            style={active ? { animationDelay: `${i * 100}ms` } : undefined}
          >
            {line}
          </text>
        ),
      )}
    </svg>
  );
}

function CpuIcon({ lit }: { lit: boolean }) {
  return (
    <svg viewBox="0 0 88 88" className={`w-16 h-16 ${lit ? 'digest-cpu-pulse' : ''}`} aria-hidden>
      <rect
        x="22"
        y="22"
        width="44"
        height="44"
        rx="6"
        className={lit ? 'fill-accent' : 'fill-classroom-playground'}
        stroke="#0A5C4F"
        strokeWidth="2.5"
      />
      <rect
        x="32"
        y="32"
        width="24"
        height="24"
        rx="3"
        fill={lit ? '#FFFFFF' : '#C5E0D6'}
        opacity={lit ? 0.95 : 0.7}
      />
      {[14, 28, 42, 56].map((v) => (
        <g key={v}>
          <line x1="8" y1={v + 8} x2="22" y2={v + 8} stroke="#0A5C4F" strokeWidth="3" strokeLinecap="round" />
          <line x1="66" y1={v + 8} x2="80" y2={v + 8} stroke="#0A5C4F" strokeWidth="3" strokeLinecap="round" />
          <line x1={v + 8} y1="8" x2={v + 8} y2="22" stroke="#0A5C4F" strokeWidth="3" strokeLinecap="round" />
          <line x1={v + 8} y1="66" x2={v + 8} y2="80" stroke="#0A5C4F" strokeWidth="3" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

function ResultBadge({ value, active }: { value: string; active: boolean }) {
  return (
    <svg viewBox="0 0 88 88" className={`w-16 h-16 ${active ? 'digest-result-pop' : ''}`} aria-hidden>
      <circle
        cx="44"
        cy="44"
        r="30"
        className={active ? 'fill-accent' : 'fill-accent-muted'}
        stroke="#0A5C4F"
        strokeWidth="2.5"
      />
      <text
        x="44"
        y="52"
        textAnchor="middle"
        fill={active ? '#FFFFFF' : '#0A5C4F'}
        opacity={active ? 1 : 0.35}
        fontSize="28"
        fontFamily="KaiTi, STKaiti, serif"
        fontWeight="600"
      >
        {active ? value : '?'}
      </text>
    </svg>
  );
}

/** 沿传送带移动的数据包位置：0 源码 … 4 结果 */
const PACKET_LEFT = ['6%', '26%', '46%', '66%', '86%'] as const;

/**
 * 横向流水线插画：源码 → 翻译器 → 机器指令 → CPU → 结果。
 * 数据包沿传送带迁移；旁注仅短标签。
 */
export function DigestPipelineStage({ content, sceneId }: DigestPipelineStageProps) {
  // 0 源码就绪 → 1 进入翻译器 → 2 吐出指令 → 3 CPU → 4 结果
  const { phase, advance, done } = useStageAdvance(sceneId, 4);

  const intoTranslator = phase >= 1;
  const showMachine = phase >= 2;
  const cpuLit = phase >= 3;
  const showResult = phase >= 4;

  const packetAt = Math.min(phase, 4);
  const packetVisible = phase >= 1 || phase === 0;

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
      <div className="rounded-3xl bg-classroom-stage shadow-card px-5 py-5 md:px-8 md:py-7 relative overflow-hidden">
        {/* 背景轨道 */}
        <div className="absolute left-8 right-8 top-[7.25rem] h-3 rounded-full bg-classroom-playground border border-classroom-border/60" />
        <div className="absolute left-8 right-8 top-[7.25rem] h-3 rounded-full overflow-hidden pointer-events-none">
          <div
            className={`h-full bg-accent/25 origin-left transition-transform duration-700 ease-out ${
              showResult ? 'scale-x-100' : ''
            }`}
            style={{ transform: `scaleX(${(packetAt + 1) / 5})` }}
          />
        </div>

        {/* 移动中的数据包 */}
        {packetVisible && (
          <div
            className="absolute top-[6.35rem] z-10 -translate-x-1/2 transition-all duration-700 ease-out"
            style={{ left: PACKET_LEFT[packetAt] }}
            aria-hidden
          >
            <div
              className={`rounded-xl px-2.5 py-1 shadow-card border border-accent/30 font-mono text-[0.65rem] leading-none whitespace-nowrap ${
                showMachine && packetAt >= 2
                  ? 'bg-code-bg text-code-text'
                  : 'bg-white text-accent'
              } ${phase === 1 ? 'digest-packet-bounce' : ''}`}
            >
              {packetAt < 2 ? content.sourceCode : content.machineLines[0] ?? '1011…'}
            </div>
          </div>
        )}

        <div className="relative grid grid-cols-5 gap-2 md:gap-4 items-start pt-1 pb-2">
          {/* 源码 */}
          <div
            className={`flex flex-col items-center text-center transition-all duration-700 ${
              intoTranslator ? 'opacity-55' : 'opacity-100 digest-station-in'
            }`}
          >
            <FileIcon active={!intoTranslator} />
            <p className="mt-2 text-xs tracking-[0.16em] text-accent">{content.sourceLabel}</p>
            <div
              className={`mt-10 w-full max-w-[10rem] rounded-2xl bg-code-bg px-3 py-2.5 shadow-card transition-all duration-700 ${
                intoTranslator ? 'opacity-30 scale-90' : 'opacity-100'
              }`}
            >
              <pre className="font-mono text-[0.7rem] md:text-xs text-code-text leading-relaxed whitespace-pre-wrap text-left">
                {content.sourceCode}
              </pre>
            </div>
            <p className="mt-2 text-sm text-text-secondary">给人看</p>
          </div>

          {/* 翻译器 */}
          <div
            className={`flex flex-col items-center text-center transition-all duration-700 ${
              intoTranslator ? 'scale-105' : 'opacity-45 scale-95'
            }`}
          >
            <TranslatorMachine active={intoTranslator} spinning={intoTranslator && !showResult} />
            <p className="mt-1 text-xs tracking-[0.16em] text-accent">{content.translatorLabel}</p>
            <p className="mt-1 text-sm text-text-secondary leading-snug">{content.translatorHint}</p>
            <div className="mt-8 h-10" />
            <p className="text-sm text-text-secondary">中间翻译</p>
          </div>

          {/* 机器指令 */}
          <div
            className={`flex flex-col items-center text-center transition-all duration-700 ${
              showMachine ? 'opacity-100' : 'opacity-35'
            }`}
          >
            <MachineStrip lines={content.machineLines} active={showMachine} />
            <p className="mt-2 text-xs tracking-[0.16em] text-accent">{content.machineLabel}</p>
            <div className="mt-10 flex gap-1 justify-center min-h-[1.25rem]" aria-hidden>
              {showMachine &&
                Array.from({ length: 10 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-2.5 h-4 rounded-sm bg-accent digest-bits-in"
                    style={{
                      opacity: 0.3 + (i % 4) * 0.18,
                      animationDelay: `${i * 50}ms`,
                    }}
                  />
                ))}
            </div>
            <p className="mt-2 text-sm text-text-secondary">机器能读</p>
          </div>

          {/* CPU */}
          <div
            className={`flex flex-col items-center text-center transition-all duration-700 ${
              cpuLit ? 'scale-110' : 'opacity-35 scale-95'
            }`}
          >
            <CpuIcon lit={cpuLit} />
            <p className="mt-2 text-xs tracking-[0.16em] text-accent">{content.cpuLabel}</p>
            <div className="mt-10 min-h-[1.25rem]">
              {cpuLit && !showResult && (
                <span className="inline-block rounded-full bg-accent text-white text-sm px-3 py-0.5 digest-station-in">
                  执行
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-text-secondary">真正干活</p>
          </div>

          {/* 结果 */}
          <div
            className={`flex flex-col items-center text-center transition-all duration-700 ${
              showResult ? 'opacity-100' : 'opacity-30'
            }`}
          >
            <ResultBadge value={content.result} active={showResult} />
            <p className="mt-2 text-xs tracking-[0.16em] text-accent">{content.resultLabel}</p>
            <div className="mt-10 min-h-[1.25rem]" />
            <p className="text-sm text-text-secondary">算出答案</p>
          </div>
        </div>
      </div>

      {showResult && (
        <p className="mt-5 title-kai text-xl md:text-2xl text-text-primary text-center leading-relaxed digest-station-in">
          {content.conclusion}
        </p>
      )}

      {!done && (
        <p className="mt-4 text-base text-accent/80">
          {phase === 0 && '点击继续 · 源码送进翻译器'}
          {phase === 1 && '点击继续 · 吐出机器指令'}
          {phase === 2 && '点击继续 · 指令进入 CPU'}
          {phase === 3 && '点击继续 · 亮起结果'}
        </p>
      )}
    </div>
  );
}
