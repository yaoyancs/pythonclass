import type { PythonEnvContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: PythonEnvContent;
  sceneId: string;
}

function PyFileIcon({ active, name }: { active: boolean; name: string }) {
  return (
    <svg viewBox="0 0 96 100" className="w-[4.75rem] h-20" aria-hidden>
      <rect
        x="18"
        y="10"
        width="54"
        height="72"
        rx="6"
        className={active ? 'fill-accent-muted' : 'fill-classroom-playground'}
        stroke="#0A5C4F"
        strokeWidth="2.5"
      />
      <path d="M56 10v16h16" fill="none" stroke="#0A5C4F" strokeWidth="2.5" />
      <path d="M56 10l16 16" fill="none" stroke="#0A5C4F" strokeWidth="2.5" />
      <rect x="30" y="40" width="30" height="3.5" rx="1.5" fill="#0A5C4F" opacity={active ? 1 : 0.3} />
      <rect x="30" y="50" width="24" height="3.5" rx="1.5" fill="#0A5C4F" opacity={active ? 0.7 : 0.22} />
      <rect x="30" y="60" width="18" height="3.5" rx="1.5" fill="#0A5C4F" opacity={active ? 0.45 : 0.18} />
      <rect x="22" y="78" width="46" height="14" rx="4" fill="#0A5C4F" opacity={active ? 0.95 : 0.4} />
      <text
        x="45"
        y="88"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="9"
        fontFamily="ui-monospace, monospace"
      >
        {name.length > 10 ? name.slice(-10) : name}
      </text>
    </svg>
  );
}

function EditorIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 120 88" className="w-[7.5rem] h-[5.5rem]" aria-hidden>
      <rect
        x="6"
        y="8"
        width="108"
        height="72"
        rx="10"
        className={active ? 'fill-accent-muted' : 'fill-classroom-playground'}
        stroke="#0A5C4F"
        strokeWidth="2.5"
      />
      <rect x="6" y="8" width="108" height="16" rx="10" fill="#0A5C4F" opacity={active ? 0.9 : 0.35} />
      <rect x="6" y="18" width="108" height="6" fill="#0A5C4F" opacity={active ? 0.9 : 0.35} />
      <circle cx="18" cy="16" r="3" fill="#FFFFFF" opacity="0.9" />
      <circle cx="28" cy="16" r="3" fill="#FFFFFF" opacity="0.7" />
      <circle cx="38" cy="16" r="3" fill="#FFFFFF" opacity="0.5" />
      <rect x="14" y="32" width="28" height="40" rx="4" fill="#FFFFFF" opacity={active ? 0.85 : 0.45} />
      <rect x="48" y="32" width="58" height="40" rx="4" fill="#0A1210" opacity={active ? 0.88 : 0.35} />
      <rect x="54" y="40" width="36" height="3" rx="1" fill="#C5E0D6" opacity={active ? 1 : 0.4} />
      <rect x="54" y="48" width="28" height="3" rx="1" fill="#C5E0D6" opacity={active ? 0.75 : 0.3} />
      <rect x="54" y="56" width="40" height="3" rx="1" fill="#C5E0D6" opacity={active ? 0.55 : 0.22} />
    </svg>
  );
}

function InterpreterIcon({ active, working }: { active: boolean; working: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className={`w-20 h-20 ${working ? 'digest-cpu-pulse' : ''}`} aria-hidden>
      <ellipse
        cx="50"
        cy="78"
        rx="28"
        ry="8"
        fill="#0A5C4F"
        opacity={active ? 0.2 : 0.08}
      />
      <rect
        x="22"
        y="28"
        width="56"
        height="48"
        rx="12"
        className={active ? 'fill-accent' : 'fill-classroom-playground'}
        stroke="#0A5C4F"
        strokeWidth="2.5"
      />
      <circle cx="38" cy="48" r="5" fill={active ? '#FFFFFF' : '#C5E0D6'} />
      <circle cx="62" cy="48" r="5" fill={active ? '#FFFFFF' : '#C5E0D6'} />
      <path
        d="M40 62c4 5 16 5 20 0"
        fill="none"
        stroke={active ? '#FFFFFF' : '#9BB0A6'}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* chef hat / brain cap = interpreter head */}
      <path
        d="M30 30c0-14 40-14 40 0"
        fill={active ? '#C5E0D6' : '#E8EEEA'}
        stroke="#0A5C4F"
        strokeWidth="2"
      />
      <rect x="34" y="22" width="32" height="10" rx="4" fill="#0A5C4F" opacity={active ? 0.85 : 0.35} />
      {working && (
        <g className="digest-station-in">
          <circle cx="78" cy="34" r="8" fill="#FFFFFF" stroke="#0A5C4F" strokeWidth="2" />
          <text x="78" y="38" textAnchor="middle" fontSize="10" fill="#0A5C4F">
            ▶
          </text>
        </g>
      )}
    </svg>
  );
}

function ConsoleIcon({ active, output }: { active: boolean; output: string }) {
  return (
    <svg viewBox="0 0 110 88" className={`w-[6.75rem] h-[5.5rem] ${active ? 'digest-result-pop' : ''}`} aria-hidden>
      <rect
        x="6"
        y="8"
        width="98"
        height="72"
        rx="10"
        fill={active ? '#0A1210' : '#E8EEEA'}
        stroke="#0A5C4F"
        strokeWidth="2.5"
        opacity={active ? 0.92 : 1}
      />
      <text
        x="18"
        y="30"
        fill={active ? '#C5E0D6' : '#9BB0A6'}
        fontFamily="ui-monospace, monospace"
        fontSize="11"
      >
        {'> _'}
      </text>
      {active && (
        <text
          x="18"
          y="52"
          fill="#FFFFFF"
          fontFamily="ui-monospace, monospace"
          fontSize="14"
          className="digest-bits-in"
        >
          {output}
        </text>
      )}
    </svg>
  );
}

const PACKET_LEFT = ['8%', '34%', '60%', '86%'] as const;

/**
 * 插画流水线：.py → 编辑器 → 解释器 → 控制台。
 * 强调编辑器是工作台，解释器才执行。
 */
export function PythonEnvStage({ content, sceneId }: Props) {
  // 0 .py → 1 编辑器 → 2 解释器 → 3 控制台 + 收束
  const { phase, advance, done } = useStageAdvance(sceneId, 3);

  const inEditor = phase >= 1;
  const inInterpreter = phase >= 2;
  const showConsole = phase >= 3;
  const packetAt = Math.min(phase, 3);

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
        {/* 编程环境括号感：后三站同属环境 */}
        {inEditor && (
          <div
            className="absolute left-[22%] right-[4%] top-3 bottom-3 rounded-3xl border-2 border-dashed border-accent/35 pointer-events-none digest-station-in"
            aria-hidden
          />
        )}
        {inEditor && (
          <p className="absolute top-4 left-1/2 -translate-x-1/2 text-xs tracking-[0.2em] text-accent bg-classroom-stage px-3 digest-station-in">
            编程环境
          </p>
        )}

        <div className="absolute left-10 right-10 top-[6.8rem] h-3 rounded-full bg-classroom-playground border border-classroom-border/60" />
        <div className="absolute left-10 right-10 top-[6.8rem] h-3 rounded-full overflow-hidden pointer-events-none">
          <div
            className="h-full bg-accent/25 origin-left transition-transform duration-700 ease-out"
            style={{ transform: `scaleX(${(packetAt + 1) / 4})` }}
          />
        </div>

        <div
          className="absolute top-[5.95rem] z-10 -translate-x-1/2 transition-all duration-700 ease-out"
          style={{ left: PACKET_LEFT[packetAt] }}
          aria-hidden
        >
          <div
            className={`rounded-xl px-2.5 py-1 shadow-card border border-accent/30 font-mono text-[0.65rem] leading-none whitespace-nowrap bg-white text-accent ${
              inInterpreter && !showConsole ? 'digest-packet-bounce' : ''
            }`}
          >
            {packetAt >= 2 ? '执行…' : content.filename}
          </div>
        </div>

        <div className="relative grid grid-cols-4 gap-3 md:gap-5 items-start pt-8 pb-2">
          <div
            className={`flex flex-col items-center text-center transition-all duration-700 ${
              inEditor ? 'opacity-55' : 'opacity-100 digest-station-in'
            }`}
          >
            <PyFileIcon active={!inEditor} name={content.filename} />
            <p className="mt-2 text-xs tracking-[0.16em] text-accent">{content.fileLabel}</p>
            <p className="mt-1 text-sm text-text-secondary">{content.fileHint}</p>
            <div
              className={`mt-8 w-full max-w-[9.5rem] rounded-2xl bg-code-bg px-3 py-2 shadow-card transition-all duration-700 ${
                inEditor ? 'opacity-30 scale-90' : ''
              }`}
            >
              <pre className="font-mono text-[0.65rem] md:text-xs text-code-text text-left whitespace-pre-wrap">
                {content.sampleCode}
              </pre>
            </div>
          </div>

          <div
            className={`flex flex-col items-center text-center transition-all duration-700 ${
              inEditor ? 'scale-105' : 'opacity-40 scale-95'
            }`}
          >
            <EditorIcon active={inEditor} />
            <p className="mt-2 text-xs tracking-[0.16em] text-accent">{content.editorLabel}</p>
            <p className="mt-1 text-sm text-text-secondary leading-snug">{content.editorHint}</p>
            <div className="mt-8 min-h-[2rem]">
              {inEditor && !inInterpreter && (
                <span className="inline-block rounded-full bg-accent-muted text-accent text-sm px-3 py-0.5 digest-station-in">
                  编辑 · 不执行
                </span>
              )}
              {inInterpreter && (
                <span className="inline-block rounded-full bg-classroom-playground text-text-secondary text-sm px-3 py-0.5">
                  交给解释器
                </span>
              )}
            </div>
          </div>

          <div
            className={`flex flex-col items-center text-center transition-all duration-700 ${
              inInterpreter ? 'scale-110' : 'opacity-35 scale-95'
            }`}
          >
            <InterpreterIcon active={inInterpreter} working={inInterpreter && !showConsole} />
            <p className="mt-2 text-xs tracking-[0.16em] text-accent">{content.interpreterLabel}</p>
            <p className="mt-1 text-sm text-text-secondary leading-snug">{content.interpreterHint}</p>
            <div className="mt-8 min-h-[2rem]">
              {inInterpreter && !showConsole && (
                <span className="inline-block rounded-full bg-accent text-white text-sm px-3 py-0.5 digest-station-in">
                  真正执行
                </span>
              )}
            </div>
          </div>

          <div
            className={`flex flex-col items-center text-center transition-all duration-700 ${
              showConsole ? 'opacity-100' : 'opacity-30'
            }`}
          >
            <ConsoleIcon active={showConsole} output={content.consoleOutput} />
            <p className="mt-2 text-xs tracking-[0.16em] text-accent">{content.consoleLabel}</p>
            <p className="mt-1 text-sm text-text-secondary">看到结果</p>
            <div className="mt-8 min-h-[2rem]" />
          </div>
        </div>
      </div>

      {showConsole && (
        <p className="mt-5 title-kai text-xl md:text-2xl text-text-primary text-center leading-relaxed digest-station-in">
          {content.conclusion}
        </p>
      )}

      {!done && (
        <p className="mt-4 text-base text-accent/80">
          {phase === 0 && '点击继续 · 在编辑器里打开'}
          {phase === 1 && '点击继续 · 交给解释器'}
          {phase === 2 && '点击继续 · 控制台出结果'}
        </p>
      )}
    </div>
  );
}
