const STROKE = '#0A5C4F';

const TASK_STEPS = ['加载 12', '加载 8', '相加', '结果 20'] as const;

/** 12+8 任务链：早期为线框，随后按步点亮。 */
export function TaskChain({
  highlightCount,
}: {
  /** 点亮前 N 步；0 为仅框架 */
  highlightCount: number;
}) {
  return (
    <svg viewBox="0 0 640 52" className="w-full max-w-4xl h-[3.25rem]" aria-hidden>
      {TASK_STEPS.map((label, i) => {
        const x = 8 + i * 160;
        const lit = i < highlightCount;
        return (
          <g key={label}>
            <rect
              x={x}
              y="8"
              width="112"
              height="40"
              rx="12"
              fill={lit ? '#D8EDE6' : '#F4F7F5'}
              stroke={STROKE}
              strokeWidth={lit ? 2.5 : 1.5}
              opacity={lit ? 1 : 0.45}
            />
            <text
              x={x + 56}
              y="34"
              textAnchor="middle"
              fill={STROKE}
              fontSize="15"
              fontFamily="Kaiti SC, STKaiti, KaiTi, serif"
              opacity={lit ? 1 : 0.5}
            >
              {label}
            </text>
            {i < TASK_STEPS.length - 1 && (
              <path
                d={`M${x + 118} 28h26`}
                fill="none"
                stroke={STROKE}
                strokeWidth="2"
                strokeLinecap="round"
                markerEnd="url(#task-arrow)"
                opacity={i < highlightCount - 1 || (highlightCount === 0 && i === 0) ? (lit ? 0.9 : 0.35) : 0.35}
              />
            )}
          </g>
        );
      })}
      <defs>
        <marker id="task-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0 0l8 4-8 4z" fill={STROKE} />
        </marker>
      </defs>
    </svg>
  );
}

/** 内存格 → CPU：程序是位模式。 */
export function MemoryCpuDiagram({ lit }: { lit: boolean }) {
  const cells = ['1011', '0000', '0000', '1000'];
  return (
    <svg viewBox="0 0 220 88" className="w-[22rem] h-[8.75rem]" aria-hidden>
      {cells.map((bits, i) => (
        <g key={bits + i}>
          <rect
            x={6 + i * 28}
            y="22"
            width="24"
            height="44"
            rx="4"
            fill={lit ? '#0A1210' : '#F4F7F5'}
            stroke={STROKE}
            strokeWidth="1.8"
            opacity={lit ? 0.92 : 0.5}
          />
          <text
            x={18 + i * 28}
            y="48"
            textAnchor="middle"
            fill={lit ? '#C5E0D6' : '#9BB0A6'}
            fontFamily="ui-monospace, monospace"
            fontSize="8"
          >
            {bits}
          </text>
        </g>
      ))}
      <path
        d="M122 44h22"
        fill="none"
        stroke={STROKE}
        strokeWidth="2.2"
        strokeLinecap="round"
        markerEnd="url(#mem-arrow)"
        opacity={lit ? 1 : 0.4}
      />
      <g className={lit ? 'digest-cpu-pulse' : ''}>
      <rect
        x="152"
        y="22"
        width="44"
        height="44"
        rx="6"
        className={lit ? 'fill-accent' : 'fill-classroom-playground'}
        stroke={STROKE}
        strokeWidth="2.2"
      />
      <rect
        x="162"
        y="32"
        width="24"
        height="24"
        rx="3"
        fill={lit ? '#FFFFFF' : '#C5E0D6'}
        opacity={lit ? 0.95 : 0.7}
      />
      {[0, 1, 2].map((n) => (
        <g key={n}>
          <line
            x1="146"
            y1={30 + n * 14}
            x2="152"
            y2={30 + n * 14}
            stroke={STROKE}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="196"
            y1={30 + n * 14}
            x2="202"
            y2={30 + n * 14}
            stroke={STROKE}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      ))}
      </g>
      <text x="60" y="82" textAnchor="middle" fill={STROKE} fontSize="10" opacity="0.7">
        内存 · 位模式
      </text>
      <text x="174" y="82" textAnchor="middle" fill={STROKE} fontSize="10" opacity="0.7">
        CPU
      </text>
      <defs>
        <marker id="mem-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0 0l8 4-8 4z" fill={STROKE} />
        </marker>
      </defs>
    </svg>
  );
}

/** 打孔卡线稿，标注示意。 */
export function PunchCardSketch() {
  return (
    <svg viewBox="0 0 92 56" className="w-[14rem] h-[8.5rem]" aria-hidden>
      <rect x="2" y="8" width="88" height="40" rx="4" fill="#F4F7F5" stroke={STROKE} strokeWidth="1.6" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <circle
          key={i}
          cx={12 + i * 10}
          cy={i % 3 === 1 ? 22 : 34}
          r="2.4"
          fill={STROKE}
          opacity={i % 2 === 0 ? 0.85 : 0.35}
        />
      ))}
    </svg>
  );
}

/** 与 Digest 翻译器同造型的小型齿轮漏斗。 */
export function TranslatorMini({
  spinning,
  label,
}: {
  spinning: boolean;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-1">
      <svg viewBox="0 0 120 100" className="w-[5.5rem] h-[4.6rem]" aria-hidden>
        <rect
          x="8"
          y="28"
          width="104"
          height="56"
          rx="12"
          className="fill-accent-muted"
          stroke={STROKE}
          strokeWidth="2.5"
        />
        <rect x="20" y="40" width="36" height="32" rx="6" fill="#0A1210" opacity="0.08" />
        <rect x="64" y="40" width="36" height="32" rx="6" fill="#0A1210" opacity="0.08" />
        <path d="M28 18h64l-10 12H38z" className="fill-accent" opacity="0.9" />
        <g className={spinning ? 'digest-gear-spin' : ''} style={{ transformOrigin: '38px 56px' }}>
          <circle cx="38" cy="56" r="11" fill="#FFFFFF" stroke={STROKE} strokeWidth="2" />
          <path
            d="M38 42l2.2 5.2h5.5l-4.4 3.6 1.6 5.4L38 53.6 33.1 56.2l1.6-5.4-4.4-3.6h5.5z"
            fill={STROKE}
          />
        </g>
        <g
          className={spinning ? 'digest-gear-spin-rev' : ''}
          style={{ transformOrigin: '82px 56px' }}
        >
          <circle cx="82" cy="56" r="11" fill="#FFFFFF" stroke={STROKE} strokeWidth="2" />
          <path
            d="M82 42l2.2 5.2h5.5l-4.4 3.6 1.6 5.4L82 53.6 77.1 56.2l1.6-5.4-4.4-3.6h5.5z"
            fill={STROKE}
          />
        </g>
        <path d="M48 84h24l8 10H40z" className="fill-accent" opacity="0.85" />
      </svg>
      <p className="title-kai text-base text-accent leading-none">{label}</p>
    </div>
  );
}

export function PairArrow({ visible }: { visible: boolean }) {
  return (
    <svg
      viewBox="0 0 40 16"
      className={`w-10 h-4 transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}
      aria-hidden
    >
      <path d="M2 8h28" fill="none" stroke={STROKE} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M26 3l10 5-10 5" fill="none" stroke={STROKE} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function RegisterA({ value }: { value: string }) {
  const lit = value !== '—';
  return (
    <svg viewBox="0 0 120 64" className={`w-[7.5rem] h-10 ${lit ? 'digest-result-pop' : ''}`} aria-hidden>
      <rect
        x="4"
        y="6"
        width="112"
        height="52"
        rx="12"
        fill={lit ? '#D8EDE6' : '#F4F7F5'}
        stroke={STROKE}
        strokeWidth="2"
      />
      <text x="28" y="40" fill={STROKE} fontSize="20" fontFamily="ui-monospace, monospace">
        A
      </text>
      <text x="52" y="40" fill={STROKE} fontSize="18" opacity="0.6">
        =
      </text>
      <text
        x="88"
        y="40"
        textAnchor="middle"
        fill={STROKE}
        fontSize="22"
        fontFamily="Kaiti SC, STKaiti, KaiTi, serif"
      >
        {value}
      </text>
    </svg>
  );
}
