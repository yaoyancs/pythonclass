import { useEffect } from 'react';
import { useSceneEngine } from '../../engine/SceneEngine';
import { useStageAdvance } from '../../hooks/useStageAdvance';
import type { StringSliceContent } from '../../types/scene';

interface Props {
  content: StringSliceContent;
  sceneId: string;
}

const DEFAULT_PHONE = '13906331234';
const DEFAULT_ID = '532625999999994021';
const SLICE_TEXT = '风送花香红满地，雨滋春树碧连天';
const MASK_TARGET = '139****1234';
const SYNTAX_CODES = [
  'text = "风送花香红满地，雨滋春树碧连天"\n# start 是起点，end 是终点。含 start，不含 end\nprint(text[0:7])',
  'text = "风送花香红满地，雨滋春树碧连天"\n# 不写 start：从头。不写 end：到尾。都省略：整串\nprint(text[:7])\nprint(text[8:])\nprint(text[:])',
  'text = "风送花香红满地，雨滋春树碧连天"\n# 切片里下标越界不报错\nprint(repr(text[20:]))\nprint(text[0:100])\n# 单个下标越界才会报错\nprint(text[15])',
  'text = "风送花香红满地，雨滋春树碧连天"\n# 负索引：-1 是最后一格\nprint(text[-7:])',
  'text = "风送花香红满地，雨滋春树碧连天"\n# step 是步长。不写默认 1，也可以是 2、3\nprint(text[0:7])\nprint(text[0:7:2])\nprint(text[0:7:3])',
  'text = "风送花香红满地，雨滋春树碧连天"\n# step 为负：从右向左切\nprint(text[::-1])',
];
const INDEX_NEED_CODES = [
  'id = "532625999999994021"\n# 前 6 位：每个下标一个方括号\nfront = id[0] + id[1] + id[2] + id[3] + id[4] + id[5]\nprint(front)',
  'id = "532625999999994021"\nfront = id[0] + id[1] + id[2] + id[3] + id[4] + id[5]\n# 要取几位，代码就写多长\nprint(front)',
  'id = "532625999999994021"\nfront = id[0] + id[1] + id[2] + id[3] + id[4] + id[5]\n# 后 4 位从右边数：-4 -3 -2 -1\ntail = id[-4] + id[-3] + id[-2] + id[-1]\nprint(front)\nprint(tail)',
  'id = "532625999999994021"\nfront = id[0] + id[1] + id[2] + id[3] + id[4] + id[5]\ntail = id[-4] + id[-3] + id[-2] + id[-1]\n# 中间 8 位要一次换成星号\n# 索引一次只拿一格，连续一段要一次取出来\nprint(front + "********" + tail)',
];
const MASK_CODES = [
  'phone = "13906331234"\n# 能运行，结果是 139****1234\nprint(phone[:3] + "****" + phone[7:11])',
  'phone = "13906331234"\n# 能运行，结果也对。写对了，就写好了吗？\nprint(phone[:3] + "****" + phone[7:11])',
  'phone = "13906331234"\n# [7:11] 写死位置。号码一变，就指错地方\n# [-4:] 说的是最后 4 位\nprint(phone[:3] + "****" + phone[-4:])',
  'phone = "13906331234"\nprint(phone[:3] + "****" + phone[-4:])\n# 好代码不仅能运行，还要说清：只要最后 4 位',
];
function PhoneCells({
  phone,
  negative = false,
  active,
}: {
  phone: string;
  negative?: boolean;
  active?: (index: number) => boolean;
}) {
  const chars = [...phone];
  return (
    <div>
      <div className="slice-row" style={{ gridTemplateColumns: `repeat(${chars.length}, minmax(0, 1fr))` }}>
        {chars.map((char, index) => (
          <div
            key={`${char}-${index}`}
            className={`slice-row-cell ${active?.(index) ? 'slice-row-cell-on' : ''}`}
          >
            {char}
          </div>
        ))}
      </div>
      <div
        className="mt-1 grid text-center font-mono text-sm text-text-secondary"
        style={{ gridTemplateColumns: `repeat(${chars.length}, minmax(0, 1fr))` }}
      >
        {chars.map((_, index) => (
          <span key={`idx-${index}`}>{negative ? index - chars.length : index}</span>
        ))}
      </div>
    </div>
  );
}

function CodePill({ children, accent = false }: { children: string; accent?: boolean }) {
  return (
    <code
      className={`rounded-xl px-4 py-2 font-mono text-xl ${
        accent ? 'bg-accent text-white' : 'bg-code-bg text-code-text'
      }`}
    >
      {children}
    </code>
  );
}

function SliceCodeDisplay({
  start,
  end,
  showLabels = false,
  binding = 'phone',
}: {
  start: string;
  end: string;
  showLabels?: boolean;
  binding?: string;
}) {
  return (
    <div className="slice-code-display inline-flex flex-col items-center">
      <code className={`inline-flex rounded-2xl border border-code-border bg-code-bg px-6 pt-3 font-mono text-xl text-code-text shadow-card ${
        showLabels ? 'pb-8' : 'pb-3'
      }`}>
        <span>{binding}[</span>
        <span className={`relative font-semibold ${start === '??' ? 'text-code-muted' : 'text-accent-muted'}`}>
          {start}
          {showLabels && (
            <span className="absolute right-1/2 top-full mr-1 mt-1 whitespace-nowrap font-sans text-xs font-semibold text-accent-muted">
              start ↑
            </span>
          )}
        </span>
        <span className="text-code-muted">:</span>
        <span className={`relative font-semibold ${end === '??' ? 'text-code-muted' : 'text-highlight-muted'}`}>
          {end}
          {showLabels && (
            <span className="absolute left-1/2 top-full ml-1 mt-1 whitespace-nowrap font-sans text-xs font-semibold text-highlight-muted">
              ↑ end
            </span>
          )}
        </span>
        <span>]</span>
      </code>
    </div>
  );
}

function SliceKnife({
  delayed = false,
  end = false,
  compact = false,
}: {
  delayed?: boolean;
  end?: boolean;
  compact?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 108 88"
      className={`slice-vector-knife ${compact ? 'slice-vector-knife-compact' : ''} ${
        delayed ? 'slice-motion-delay' : ''
      } ${end ? 'text-highlight' : 'text-accent'}`}
      aria-hidden
    >
      <g transform="rotate(-8 54 44)">
        <path
          d="M10 18h58c10 0 18 8 18 18v17H10z"
          fill="currentColor"
        />
        <path
          d="M10 53h76l-8 12H18c-4 0-8-4-8-8z"
          fill="#eef5f0"
          stroke="currentColor"
          strokeWidth="3"
        />
        <rect x="67" y="17" width="34" height="15" rx="7.5" fill="#78350f" />
        <circle cx="91" cy="24.5" r="2.5" fill="#fef3c7" />
        <circle cx="71" cy="38" r="3" fill="#ffffff" opacity="0.85" />
      </g>
    </svg>
  );
}

export function StringSliceStage({ content, sceneId }: Props) {
  const { dispatch } = useSceneEngine();
  const phone = content.phone ?? DEFAULT_PHONE;
  const maxPhase: Record<StringSliceContent['mode'], number> = {
    cover: 0,
    privacy: 0,
    decompose: 4,
    'index-need': 3,
    syntax: 6,
    'cut-demo': 6,
    negative: 2,
    boundary: 2,
    'ai-review': 2,
    cases: 3,
    pitfalls: 3,
    'minus-ways': 2,
    practice: 1,
    values: 0,
    summary: 0,
    homework: 0,
  };
  const { phase, advance, retreat, reset, done } = useStageAdvance(sceneId, maxPhase[content.mode]);
  const interactive = maxPhase[content.mode] > 0;

  useEffect(() => {
    const code = content.mode === 'index-need'
      ? INDEX_NEED_CODES[Math.min(phase, INDEX_NEED_CODES.length - 1)]
      : content.mode === 'cases'
        ? MASK_CODES[Math.min(phase, MASK_CODES.length - 1)]
        : content.mode === 'syntax'
          ? phase === 0
            ? 'text = "风送花香红满地，雨滋春树碧连天"\n# 完整写法：s[start:end:step]\nprint(text[0:7:1])'
            : SYNTAX_CODES[Math.min(phase - 1, SYNTAX_CODES.length - 1)]
          : null;
    if (!code) return;
    dispatch({ type: 'UPDATE_CODE', code, clearOutput: true });
  }, [content.mode, phase, dispatch]);

  const body = (() => {
    switch (content.mode) {
      case 'cover':
        return (
          <div className="mx-auto mt-8 max-w-4xl text-center">
            <div className="inline-flex rounded-full bg-accent-muted px-5 py-2 text-6xl font-semibold text-accent">
            字符串操作：切片
            </div>
            <p className="mt-10 title-kai text-2xl leading-relaxed text-text-primary">
            26数据科学与大数据
            </p>
           
          </div>
        );

      case 'privacy':
        return (
          <div className="mx-auto mt-2 max-w-5xl">
            <img
              src="/social-aid-notice.png"
              alt="社会救助对象公示单，身份证号中间用星号遮住"
              className="w-full rounded-2xl border border-classroom-border bg-white shadow-card"
            />
            <p className="mt-4 text-center text-xl font-semibold text-accent">
              身份证号中间打码。既隐私保护 且 本人能认得。
            </p>
          
          </div>
        );

      case 'decompose':
        return (
          <div className="mx-auto mt-8 max-w-4xl">
            <p className="mb-4 text-center text-base font-semibold tracking-[0.16em] text-accent">
              任务一 · 明确需求
            </p>
            <p className="text-center title-kai text-2xl text-text-secondary">
              先别写代码：计算机不知道什么叫“脱敏”
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <CodePill accent={phase >= 1}>139</CodePill>
              <CodePill accent={phase >= 2}>****</CodePill>
              <CodePill accent={phase >= 3}>1234</CodePill>
            </div>
            <div className="mt-4 flex items-center justify-center gap-16 text-lg text-text-secondary">
              <span>前3位</span><span>替换</span><span>后4位</span>
            </div>
            {phase >= 4 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3 timeline-node-in">
                {['取前3位', '＋', '放入“****”', '＋', '取后4位', '→', '拼接结果'].map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className={item === '＋' || item === '→' ? 'text-2xl text-accent' : 'rounded-xl border border-classroom-border bg-classroom-stage px-4 py-3 text-lg'}
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
            <p className="mt-10 text-center text-xl font-semibold text-accent">
              现实问题 → 数据表示 → 问题分解 → 可执行步骤
            </p>
          </div>
        );

      case 'index-need': {
        const chars = [...DEFAULT_ID];
        const tone = (index: number) => {
          if (phase === 0 || phase === 1) return index < 6 ? 'on' : 'idle';
          if (phase === 2) return index >= 14 ? 'on' : 'idle';
          return index >= 6 && index < 14 ? 'on' : 'dim';
        };
        return (
          <div className="mt-4">
            <p className="stage-emphasis text-2xl">思考，如何用<span className="text-highlight">索引</span>给身份证号打码？</p>
            <div className="mt-5">
              <div className="slice-row" style={{ gridTemplateColumns: `repeat(${chars.length}, minmax(0, 1fr))` }}>
                {chars.map((char, index) => (
                  <div key={`${char}-${index}`} className={`slice-row-cell ${tone(index) === 'on' ? 'slice-row-cell-on' : ''} ${tone(index) === 'dim' ? 'slice-row-cell-dim' : ''}`}>
                    {char}
                  </div>
                ))}
              </div>
              <div
                className="mt-1 grid text-center font-mono text-xs text-text-secondary"
                style={{ gridTemplateColumns: `repeat(${chars.length}, minmax(0, 1fr))` }}
              >
                {chars.map((_, index) => <span key={`id-i-${index}`}>{index}</span>)}
              </div>
              <div
                className="mt-1 grid text-center font-mono text-xs text-accent"
                style={{ gridTemplateColumns: `repeat(${chars.length}, minmax(0, 1fr))` }}
              >
                {chars.map((_, index) => <span key={`id-n-${index}`}>{index - chars.length}</span>)}
              </div>
            </div>
          </div>
        );
      }

      case 'syntax': {
        if (phase === 0) {
          return (
            <div className="mt-8 text-center">
              <p className="stage-emphasis text-2xl">切片的完整写法</p>
              <p className="mt-8 font-mono text-5xl font-semibold text-text-primary">
                s[<span className="text-accent">start</span>:<span className="text-highlight">end</span>:<span className="text-success">step</span>]
              </p>
              <div className="mt-8 flex justify-center gap-10 text-xl">
                <span className="text-accent">start 起点</span>
                <span className="text-highlight">end 终点</span>
                <span className="text-success">step 步长</span>
              </div>
              <p className="mt-6 text-xl text-text-secondary">含 start，不含 end。step 不写时，每次走 1 格。</p>
            </div>
          );
        }
        const step = phase - 1;
        const chars = [...SLICE_TEXT];
        const on = (index: number) => {
          if (step === 0 || step === 1) return index < 7 || (step === 1 && index >= 8);
          if (step === 3) return index >= chars.length - 7;
          if (step === 4) return index < 7 && index % 2 === 0;
          return false;
        };
        const titles = [
          'start 是起点，end 是终点',
          'start、end 省略时的默认值',
          '切片里下标越界不报错',
          '可以用负索引切',
          'step 是步长，不写默认是 1',
          'step 为负：从右向左切',
        ];
        return (
          <div className="mt-2">
            <p className="stage-emphasis text-2xl">{titles[Math.min(step, titles.length - 1)]}</p>
            <p className="mt-3 text-center font-mono text-lg text-text-secondary">text = "{SLICE_TEXT}"</p>
            <div className="slice-row mt-4" style={{ gridTemplateColumns: `repeat(${chars.length}, minmax(0, 1fr))` }}>
              {chars.map((char, index) => (
                <div key={`${char}-${index}`} className={`slice-row-cell ${on(index) ? 'slice-row-cell-on' : ''}`}>
                  {char}
                </div>
              ))}
            </div>
            <div
              className="mt-1 grid text-center font-mono text-xs text-text-secondary"
              style={{ gridTemplateColumns: `repeat(${chars.length}, minmax(0, 1fr))` }}
            >
              {chars.map((_, index) => <span key={`t-${index}`}>{index}</span>)}
            </div>
            {(step === 3 || step === 5) && (
              <div
                className="mt-1 grid text-center font-mono text-xs text-accent"
                style={{ gridTemplateColumns: `repeat(${chars.length}, minmax(0, 1fr))` }}
              >
                {chars.map((_, index) => <span key={`tn-${index}`}>{index - chars.length}</span>)}
              </div>
            )}
          </div>
        );
      }

      case 'cut-demo': {
        const id = DEFAULT_ID;
        const chars = [...id];
        const middleRound = phase >= 3;
        const start = middleRound ? 6 : 0;
        const end = middleRound ? 14 : 6;
        const showCuts = phase === 1 || phase === 2 || phase === 4 || phase === 5;
        const cutting = phase === 1 || phase === 4;
        const extracted = phase === 2 || phase === 5;
        const selected = (index: number) => extracted && index >= start && index < end;
        const boundaryLeft = (boundary: number) => `${(boundary / chars.length) * 100}%`;
        const selectionWidth = `${((end - start) / chars.length) * 100}%`;
        const captions = [
          '先看前 6 位。点击，在这一段的两边各切一刀。',
          '左刀是 start，右刀是 end。含 start，不含 end。',
          'id[0:6] 取出下标 0 到 5。下标 6 在右刀外面，不取。',
          '再看中间 8 位。点击，看两刀落在哪里。',
          '左刀落在 6，右刀落在 14。',
          'id[6:14] 取出下标 6 到 13。下标 14 不取。',
        ];

        if (phase >= 6) {
          return (
            <div className="mx-auto mt-6 max-w-4xl">
              <p className="text-center text-2xl font-semibold text-text-primary">三段接在一起，不重也不漏</p>
              <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                {[
                  ['前 6 位', 'id[0:6]', id.slice(0, 6)],
                  ['中间 8 位', 'id[6:14]', id.slice(6, 14)],
                  ['后 4 位', 'id[14:]', id.slice(14)],
                ].map(([label, code, piece]) => (
                  <div key={code} className="rounded-2xl border border-classroom-border bg-classroom-stage px-4 py-5">
                    <p className="text-base text-text-secondary">{label}</p>
                    <p className="mt-3 font-mono text-2xl font-semibold text-accent">{piece}</p>
                    <p className="mt-3 font-mono text-lg">{code}</p>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-center text-xl text-text-primary">前一段的 end，就是后一段的 start。</p>
              <div className="mt-6 text-center">
                <button
                  type="button"
                  className="rounded-xl border border-accent bg-white px-4 py-2 text-base font-semibold text-accent shadow-card transition hover:bg-accent-muted"
                  onClick={(event) => {
                    event.stopPropagation();
                    reset();
                  }}
                >
                  ↻ 再次播放
                </button>
              </div>
            </div>
          );
        }

        return (
          <div className="mx-auto mt-2 max-w-5xl">
            <p className="stage-emphasis text-2xl">切片：在两刀之间取出一段</p>
            <p className="mt-3 text-center text-lg text-text-primary">{captions[phase]}</p>

            <div className="mt-4 flex min-h-[76px] items-start justify-center text-center">
              {(phase === 1 || phase === 2) && (
                <div className="timeline-node-in">
                  <SliceCodeDisplay start="0" end="6" showLabels binding="id" />
                </div>
              )}
              {(phase === 4 || phase === 5) && (
                <div className="timeline-node-in">
                  <SliceCodeDisplay start="6" end="14" showLabels binding="id" />
                </div>
              )}
            </div>

            <div className="slice-visual-stage mx-3 rounded-3xl border border-classroom-border px-7 pb-10 pt-8 shadow-card">
              <code className="mb-5 block text-center font-mono text-lg font-semibold text-text-secondary">
                id = <span className="text-accent">&quot;{id}&quot;</span>
              </code>

              <div className="relative">
                <div
                  className="slice-row"
                  style={{ gridTemplateColumns: `repeat(${chars.length}, minmax(0, 1fr))` }}
                >
                  {chars.map((char, index) => {
                    const isSelected = selected(index);
                    const isDimmed = extracted && !isSelected;
                    return (
                      <div
                        key={`${char}-${index}`}
                        className={`slice-row-cell ${isSelected ? 'slice-row-cell-on' : ''} ${isDimmed ? 'slice-row-cell-dim' : ''}`}
                      >
                        {char}
                      </div>
                    );
                  })}
                </div>
                <div
                  className="mt-1 grid text-center font-mono text-xs text-text-secondary"
                  style={{ gridTemplateColumns: `repeat(${chars.length}, minmax(0, 1fr))` }}
                >
                  {chars.map((char, index) => <span key={`${char}-i-${index}`}>{index}</span>)}
                </div>

                {showCuts && (
                  <>
                    <div
                      key={`start-line-${start}`}
                      className="slice-boundary-line slice-boundary-start absolute -bottom-7 -top-5 z-10"
                      style={{ left: boundaryLeft(start) }}
                    />
                    {cutting && (
                      <>
                        <span
                          key={`start-knife-${start}`}
                          className="absolute -top-16 z-30 -translate-x-1/2"
                          style={{ left: boundaryLeft(start) }}
                        >
                          <SliceKnife />
                        </span>
                        <span
                          key={`start-impact-${start}`}
                          className="slice-cut-impact absolute -top-1 z-20 -translate-x-1/2 border-accent"
                          style={{ left: boundaryLeft(start) }}
                        />
                      </>
                    )}
                  </>
                )}
                {showCuts && (
                  <>
                    <div
                      key={`end-line-${end}`}
                      className="slice-boundary-line slice-boundary-end slice-motion-delay absolute -bottom-7 -top-5 z-10"
                      style={{ left: boundaryLeft(end) }}
                    />
                    {cutting && (
                      <>
                        <span
                          key={`end-knife-${end}`}
                          className="absolute -top-16 z-30 -translate-x-1/2"
                          style={{ left: boundaryLeft(end) }}
                        >
                          <SliceKnife delayed end />
                        </span>
                        <span
                          key={`end-impact-${end}`}
                          className="slice-cut-impact slice-motion-delay absolute -top-1 z-20 -translate-x-1/2 border-highlight"
                          style={{ left: boundaryLeft(end) }}
                        />
                      </>
                    )}
                  </>
                )}

                {showCuts && (
                  <>
                    <span
                      className="slice-boundary-label absolute -top-8 -translate-x-1/2 bg-accent text-white"
                      style={{ left: boundaryLeft(start) }}
                    >
                      start={start}
                    </span>
                    <span
                      className="slice-boundary-label absolute -top-8 -translate-x-1/2 bg-highlight text-white"
                      style={{ left: boundaryLeft(end) }}
                    >
                      end={end}
                    </span>
                  </>
                )}

                {extracted && (
                  <div
                    className="slice-selection-bracket absolute -bottom-9"
                    style={{ left: boundaryLeft(start), width: selectionWidth }}
                  >
                    <span>{middleRound ? '中间 8 位' : '前 6 位'}</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        );
      }

      case 'cases': {
        const chars = [...phone];
        const isFront = (index: number) => index < 3;
        const isTail = (index: number) => index >= chars.length - 4;
        const titles = [
          '这样写，结果是对的',
          '写对了，就写好了吗？',
          '最后 4 位，不要写死位置',
          '好代码要说清真实意图',
        ];
        return (
          <div className="mt-2">
            <p className="stage-emphasis text-xl">{titles[Math.min(phase, titles.length - 1)]}</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 font-mono text-2xl font-semibold">
              <span className="text-text-primary">{phone}</span>
              <span className="text-accent">→</span>
              <span className="text-accent">{MASK_TARGET}</span>
            </div>
            <div className="slice-row mt-5" style={{ gridTemplateColumns: `repeat(${chars.length}, minmax(0, 1fr))` }}>
              {chars.map((char, index) => (
                <div
                  key={`${char}-${index}`}
                  className={`slice-row-cell ${isFront(index) || isTail(index) ? 'slice-row-cell-on' : 'slice-row-cell-dim'}`}
                >
                  {isFront(index) || isTail(index) ? char : '*'}
                </div>
              ))}
            </div>
            {phase >= 2 && (
              <div className="mt-6 grid grid-cols-2 gap-3 timeline-node-in">
                <div className="rounded-2xl border border-classroom-border bg-classroom-stage px-4 py-3 text-center">
                  <p className="text-sm text-text-secondary">写死位置</p>
                  <p className="mt-1 font-mono text-xl">phone[7:11]</p>
                </div>
                <div className="rounded-2xl border border-accent bg-accent-muted px-4 py-3 text-center">
                  <p className="text-sm text-accent">最后 4 位</p>
                  <p className="mt-1 font-mono text-xl">phone[-4:]</p>
                </div>
              </div>
            )}
          </div>
        );
      }

      case 'pitfalls': {
        const chars = [...phone];
        const rule = Math.floor(phase / 2);
        const revealed = phase % 2 === 1;
        const question = [
          'phone[11] 和 phone[11:] 会一样吗？',
          'front = phone[:3] 之后，phone 还剩几位？',
        ][rule];
        const reveal = [
          '前两行都写了 11，先比这两行；最后一行是单个下标。',
          '看两行打印：新变量里有几位，原来的 phone 有几位。',
        ][rule];
        const showGhost = rule === 0;

        return (
          <div className="mt-2">
            <p className="text-sm font-semibold tracking-[0.14em] text-accent">
              难点 · 预测 {rule + 1} / 2
            </p>
            <div
              className="slice-row mt-4"
              style={{ gridTemplateColumns: `repeat(${chars.length + (showGhost ? 1 : 0)}, minmax(0, 1fr))` }}
            >
              {chars.map((char, index) => (
                <div key={`${char}-${index}`} className="slice-row-cell">
                  {char}
                </div>
              ))}
              {showGhost && <div className="slice-row-cell text-highlight">?</div>}
            </div>
            <div
              className="mt-1 grid text-center font-mono text-xs text-text-secondary"
              style={{ gridTemplateColumns: `repeat(${chars.length + (showGhost ? 1 : 0)}, minmax(0, 1fr))` }}
            >
              {chars.map((_, index) => <span key={`pit-${index}`}>{index}</span>)}
              {showGhost && <span className="font-semibold text-highlight">11</span>}
            </div>
            {question && <p className="stage-emphasis mt-5 text-xl">{question}</p>}
            {revealed && reveal && (
              <p className="mt-3 text-center text-base text-text-secondary timeline-node-in">{reveal} 运行右侧代码核对。</p>
            )}
          </div>
        );
      }

      case 'negative':
        return (
          <div className="mt-5">
            <p className="mb-5 text-center text-base font-semibold tracking-[0.16em] text-accent">
              任务三 · 取得后四位，完成脱敏
            </p>
            <PhoneCells phone={phone} negative active={(index) => index >= phone.length - 4} />
            <div className="mt-8 grid grid-cols-2 gap-5">
              <div className="rounded-2xl border border-classroom-border bg-classroom-stage p-5">
                <p className="text-sm font-semibold text-text-secondary">按固定位置描述</p>
                <p className="mt-3 font-mono text-2xl text-text-primary">phone[7:11]</p>
              </div>
              {phase >= 1 && (
                <div className="rounded-2xl border-2 border-accent bg-accent-muted p-5 timeline-node-in">
                  <p className="text-sm font-semibold text-accent">按真实意图描述</p>
                  <p className="mt-3 font-mono text-2xl text-text-primary">phone[-4:]</p>
                </div>
              )}
            </div>
            {phase >= 2 && (
              <div className="mt-7 text-center timeline-node-in">
                <code className="rounded-2xl bg-code-bg px-6 py-4 font-mono text-xl text-code-text">
                  phone[:3] + "****" + phone[-4:]
                </code>
                <p className="mt-5 text-2xl font-semibold text-success">138****1234</p>
              </div>
            )}
          </div>
        );

      case 'boundary':
        return (
          <div className="mx-auto mt-8 max-w-4xl">
            <p className="mb-6 text-center text-base font-semibold tracking-[0.16em] text-accent">
              任务四 · 解释设计规则
            </p>
            <div className="grid grid-cols-[3fr_4fr_4fr] overflow-hidden rounded-3xl border-2 border-accent text-center font-mono text-3xl font-semibold">
              <div className="bg-accent-muted px-5 py-7">138</div>
              <div className="border-x-2 border-accent bg-classroom-stage px-5 py-7">0000</div>
              <div className="bg-accent-muted px-5 py-7">1234</div>
            </div>
            <div className="grid grid-cols-[3fr_4fr_4fr] text-center">
              <p className="py-3 font-mono text-lg">[0:3]</p>
              <p className="py-3 font-mono text-lg">[3:7]</p>
              <p className="py-3 font-mono text-lg">[7:11]</p>
            </div>
            {phase >= 1 && (
              <div className="mt-7 flex items-center justify-center gap-6 text-2xl timeline-node-in">
                <span className="rounded-xl bg-accent-muted px-5 py-3">前段终点 = 后段起点</span>
                <span className="text-accent">3 → 3　　7 → 7</span>
              </div>
            )}
            {phase >= 2 && (
              <div className="mt-8 flex justify-center gap-6 timeline-node-in">
                <span className="rounded-full bg-success/10 px-7 py-3 text-2xl font-semibold text-success">不重复</span>
                <span className="rounded-full bg-success/10 px-7 py-3 text-2xl font-semibold text-success">不遗漏</span>
              </div>
            )}
          </div>
        );

      case 'ai-review':
        return (
          <div className="mt-6">
            <div className="rounded-3xl border border-classroom-border bg-classroom-stage px-7 py-6 shadow-card">
              <p className="text-lg font-semibold text-accent">🤖 AI给出的方案</p>
              <code className="mt-4 block rounded-2xl bg-code-bg px-5 py-4 font-mono text-lg text-code-text">
                phone[:3] + "****" + phone[7:11]
              </code>
            </div>
            {phase >= 1 && (
              <div className="mt-6 stage-emphasis rounded-2xl px-6 py-5 text-xl timeline-node-in">
                它能正确运行。但“写对了”，就代表“写得好吗”？
              </div>
            )}
            {phase >= 2 && (
              <div className="mt-6 space-y-3 timeline-node-in">
                <p className="font-mono text-xl"><span className="text-text-secondary">固定位置：</span>phone[7:11]</p>
                <p className="font-mono text-xl"><span className="text-accent">真实意图：</span>phone[-4:]　<span className="font-sans text-base text-success">← 最后4位</span></p>
                <p className="pt-3 text-xl font-semibold text-text-primary">
                  好代码不仅能运行，还要准确表达问题。
                </p>
                <div className="flex flex-wrap gap-3 pt-2 text-base font-semibold">
                  <span className="rounded-full bg-success/10 px-4 py-2 text-success">能否运行</span>
                  <span className="rounded-full bg-success/10 px-4 py-2 text-success">结果是否正确</span>
                  <span className="rounded-full bg-accent-muted px-4 py-2 text-accent">能否清楚表达需求</span>
                </div>
              </div>
            )}
          </div>
        );

      case 'minus-ways': {
        const chars = [...phone];
        const tail = (index: number) => index >= chars.length - 4;
        const nameChars = [...'客上天然居'];
        const reversedChars = [...nameChars].reverse();
        return (
          <div className="mt-2">
            <p className="text-sm font-semibold tracking-[0.14em] text-accent">负索引是位置，负步长是方向</p>
            {phase === 0 && (
              <>
                <div className="slice-row mt-4" style={{ gridTemplateColumns: `repeat(${chars.length}, minmax(0, 1fr))` }}>
                  {chars.map((char, index) => (
                    <div
                      key={`${char}-${index}`}
                      className={`slice-row-cell ${tail(index) ? 'slice-row-cell-on' : ''}`}
                    >
                      {char}
                    </div>
                  ))}
                </div>
                <div
                  className="mt-1 grid gap-1 text-center font-mono text-xs text-text-secondary"
                  style={{ gridTemplateColumns: `repeat(${chars.length}, minmax(0, 1fr))` }}
                >
                  {chars.map((_, index) => <span key={`pos-${index}`}>{index}</span>)}
                </div>
                <div
                  className="grid gap-1 text-center font-mono text-xs"
                  style={{ gridTemplateColumns: `repeat(${chars.length}, minmax(0, 1fr))` }}
                >
                  {chars.map((_, index) => (
                    <span key={`neg-${index}`} className={tail(index) ? 'font-semibold text-accent' : 'text-text-secondary'}>
                      {index - chars.length}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-center text-lg text-text-primary">
                  上面是从左数，下面是从右数。<span className="font-mono text-accent">-4</span> 定住倒数第 4 格，<span className="font-mono">phone[-4:]</span> 取到尽头。
                </p>
              </>
            )}
            {phase >= 1 && (
              <div className="mx-auto mt-4 max-w-md timeline-node-in">
                <p className="mb-1 font-mono text-sm text-text-secondary">name = &quot;客上天然居&quot;</p>
                <div className="slice-row grid-cols-5">
                  {nameChars.map((char, index) => (
                    <div key={`name-${index}`} className="slice-row-cell">
                      {char}
                    </div>
                  ))}
                </div>
                <div className="mt-1 grid grid-cols-5 text-center font-mono text-xs text-text-secondary">
                  {nameChars.map((_, index) => <span key={`name-i-${index}`}>{index}</span>)}
                </div>
                <p className="my-2 text-center font-mono text-sm font-semibold text-highlight">
                  ↓ name[::-1] 从最后一格往左走
                </p>
                <div className="slice-row grid-cols-5">
                  {reversedChars.map((char, index) => (
                    <div key={`rev-${index}`} className="slice-row-cell slice-row-cell-on">
                      {char}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {phase >= 1 && (
              <p className="mt-4 text-center text-lg text-text-primary timeline-node-in">
                步长上的负号是方向：从最后一格往左，一直走到开头。手机号同理，<span className="font-mono">phone[::-1]</span> 
              </p>
            )}
            {phase >= 2 && (
              <div className="mt-4 grid grid-cols-2 gap-3 timeline-node-in">
                <div className="rounded-2xl border border-accent bg-accent-muted px-4 py-3 text-center">
                  <p className="text-sm font-semibold text-accent">位置</p>
                  <p className="mt-1 font-mono text-xl">[-4:] → 1234</p>
                </div>
                <div className="rounded-2xl border border-highlight bg-classroom-stage px-4 py-3 text-center">
                  <p className="text-sm font-semibold text-highlight">方向</p>
                  <p className="mt-1 font-mono text-xl">[::-1] → 居然天上客</p>
                </div>
              </div>
            )}
          </div>
        );
      }

      case 'practice':
        return (
          <div className="mt-3">
            <p className="stage-emphasis text-xl">练习：写出可以公示的那一行</p>
            <div className="slice-row mt-3" style={{ gridTemplateColumns: 'repeat(19, minmax(0, 1fr))' }}>
                  {[...'2026100443213360931'].map((char, index) => (
                <div key={`row-${index}`} className="slice-row-cell">{char}</div>
              ))}
            </div>
            {phase >= 1 && (
              <div className="mt-4 grid grid-cols-[8fr_11fr] gap-2 timeline-node-in">
                <div className="rounded-xl border border-accent bg-accent-muted px-3 py-3 text-center">
                  <p className="font-mono text-xl font-semibold text-text-primary">20261004</p>
                  <p className="mt-1 text-sm text-accent">前 8 位 · 日期</p>
                </div>
                <div className="rounded-xl border border-highlight bg-classroom-stage px-3 py-3 text-center">
                  <p className="font-mono text-xl font-semibold text-text-primary">43213360931</p>
                  <p className="mt-1 text-sm text-highlight">后面 · 倒序手机号</p>
                </div>
              </div>
            )}
            <div className="mt-5 space-y-2">
              {[
                '公示行里要有日期，还要能核对是哪一个号码。',
                '公示行里不能出现完整的 11 位手机号。',
                '原记录请打印出来，但这一行不能贴出去。',
              ].map((item) => (
                <p key={item} className="rounded-xl border border-classroom-border bg-classroom-stage px-4 py-3 text-lg text-text-primary">
                  {item}
                </p>
              ))}
            </div>
          </div>
        );

      case 'values':
        return (
          <div className="mx-auto max-w-5xl">
            <div className="space-y-2 text-center">
              <p className="text-xl font-semibold text-text-primary">切片是技术。</p>
              <p className="text-xl font-semibold text-accent">显示什么，是人决定的。</p>
              <p className="text-xl leading-relaxed text-text-primary">
                技术不会替你做这个选择。能切出完整号码，不代表应该把它贴出去。<span className="rounded-md bg-[#FDE047] px-1.5">责任在人，不在技术。</span>
              </p>
            </div>
            <img
              src="/social-aid-notice.png"
              alt="社会救助对象公示单"
              className="mx-auto mt-4 w-full rounded-xl border border-classroom-border bg-white shadow-card"
            />
          </div>
        );

      case 'summary':
        return (
          <div className="mx-auto max-w-5xl">
            <div className="rounded-2xl border-2 border-accent bg-classroom-stage px-5 py-3 text-center shadow-card">
              <p className="text-sm font-semibold tracking-[0.16em] text-accent">重点</p>
              <p className="mt-1 font-mono text-3xl font-semibold leading-none text-text-primary">
                s[<span className="text-accent">start</span>:<span className="text-highlight">end</span>:<span className="text-success">step</span>]
              </p>
              <p className="mt-2 text-lg text-text-secondary">含 start，不含 end。省略 step 时每次走 1 格。</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
                {[
                  ['[:3]', '前几位，省略 start'],
                  ['[-4:]', '后几位，负号定位置'],
                ].map(([code, label]) => (
                  <div key={code} className="rounded-xl border border-accent bg-accent-muted px-3 py-2 text-center">
                    <p className="font-mono text-xl text-text-primary">{code}</p>
                    <p className="mt-0.5 text-sm text-accent">{label}</p>
                  </div>
                ))}
              </div>
            <div className="mt-3">
                <p className="mb-2 text-sm font-semibold tracking-[0.16em] text-highlight">难点</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    ['下标越界会报错', '切片越界得到空字符串'],
                    ['原字符串不动', '切片得到的是新串'],
                    ['[::-1]', '负号在步长上，是方向：从右向左切'],
                  ].map(([left, right]) => (
                    <div key={left} className="rounded-xl border border-highlight/40 bg-classroom-stage px-3 py-2 text-center text-base leading-snug text-text-primary">
                      <p>{left}</p>
                      <p className="mt-1 text-text-secondary">{right}</p>
                    </div>
                  ))}
                </div>
              </div>
            <div className="mt-3 rounded-xl border border-dashed border-success/40 px-5 py-3">
                <p className="text-center font-mono text-lg text-text-primary">[::2] 隔位取：风送花香红满地 → 风花红地。省略 step 时每次走 1 格，步长不能为 0。</p>
              </div>
          </div>
        );

      case 'homework':
        return (
          <div className="mx-auto mt-5 max-w-4xl">
            <div className="flex items-start gap-5 rounded-2xl border border-accent bg-classroom-stage px-6 py-5 shadow-card">
              <span className="shrink-0 whitespace-nowrap rounded-full bg-accent px-4 py-2 text-base font-semibold text-white">Python编程实现</span>
              <div>
                <p className="text-xl font-semibold text-text-primary">公示开始日写得对不对</p>
                <p className="mt-2 text-lg leading-relaxed text-text-secondary">
                  公示单上的开始日期被录成了 <span className="font-mono text-text-primary">20261301</span>。
                  用切片取出年、月、日，判断这个日期能不能印上去。不能的话，指出是哪一段不合法。
                </p>
              </div>
            </div>
          </div>
        );
    }
  })();

  return (
    <div
      className={interactive ? 'cursor-pointer select-none' : ''}
      onClick={() => interactive && advance()}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={(event) => {
        if (!interactive) return;
        if ((event.key === 'Enter' || event.key === ' ') && advance()) {
          event.preventDefault();
          event.stopPropagation();
        }
      }}
    >
      {body}
      {interactive && (phase > 0 || !done) && (
        <div className="mt-6 flex items-center justify-center gap-8 text-base text-accent/80">
          {phase > 0 && (
            <button
              type="button"
              className="rounded-full border border-accent/40 px-4 py-1.5"
              onClick={(event) => {
                event.stopPropagation();
                retreat();
              }}
            >
              点击后退
            </button>
          )}
          {!done && <p>点击继续 · 或按空格 / →</p>}
        </div>
      )}
    </div>
  );
}
