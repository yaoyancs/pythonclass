import { useEffect, useState } from 'react';
import { useSceneEngine } from '../../engine/SceneEngine';
import { useStageAdvance } from '../../hooks/useStageAdvance';
import type { StringSliceContent } from '../../types/scene';

interface Props {
  content: StringSliceContent;
  sceneId: string;
}

const DEFAULT_PHONE = '13800001234';
const MASK_TARGET = '138****1234';
const MASK_CODES = [
  'phone = "13800001234"\n# 任务：输出 138****1234',
  'phone = "13800001234"\n# 任务：输出 138****1234\n\nfront = phone[:3]\n# 省略 start：往右取时从 0 开始',
  'phone = "13800001234"\n# 任务：输出 138****1234\n\nfront = phone[:3]\n# 省略 start：往右取时从 0 开始\n\ntail = phone[-4:]\n# 负索引定格子：-1 是最后一格\n# 省略 end：取到这一侧的尽头',
  'phone = "13800001234"\n# 任务：输出 138****1234\n\nfront = phone[:3]\n# 省略 start：往右取时从 0 开始\n\ntail = phone[-4:]\n# 负索引定格子：-1 是最后一格\n# 省略 end：取到这一侧的尽头\n\nprint(front + "****" + tail)',
];
const SYNTAX_CODE_WITH_STEP =
  'poem = "举头望明月低头思故乡"\nup = poem[0:5]\ndown = poem[5:10]\n\nprint(up)\nprint(down)\nprint(poem[0:5:2])\nprint(poem[5:10:2])';
const PITFALL_CODES = [
  'phone = "13800001234"\n# 先预测：phone[11] 和 phone[11:]',
  'phone = "13800001234"\nprint("起点越界", repr(phone[11:]))\nprint("终点等于长度", phone[7:11])\n# 11 作起点：这一格不存在，得到空字符串\n# 11 作终点：等于长度，最后一格仍然取得到\nprint(phone[11])\n# 单个下标越界会报错',
  'phone = "13800001234"\nfront = phone[:3]\n# 先预测：phone 还剩几位？',
  'phone = "13800001234"\nfront = phone[:3]\nprint(front)\nprint(phone)\n# 切片得到新字符串，原来的 phone 仍是 11 位',
];
const MINUS_CODES = [
  'phone = "13800001234"\nprint(phone[-4:])\n# 负号在格子上：-4 是倒数第 4 格',
  'phone = "13800001234"\nprint(phone[-4:])\n\nname = "客上天然居"\nprint(name[::-1])\nprint(phone[::-1])\n# 负号在步长上：从最后一格往左走',
];
const HIDE_OPTIONS = [
  { id: 'front' as const, label: '藏前 3 位', note: '****00001234' },
  { id: 'middle' as const, label: '藏中间 4 位', note: '138****1234' },
  { id: 'tail' as const, label: '藏后 4 位', note: '1380000****' },
];
const HIDE_FEEDBACK: Record<(typeof HIDE_OPTIONS)[number]['id'], string> = {
  front: '后面 8 位还在，仍然能对上这个人。',
  middle: '前 3 位和后 4 位都留着：本人认得，别人补不全。',
  tail: '前 7 位还在，号码仍然太完整。',
};
const PRIVACY_PROMPT = '藏哪一段，本人还认得，别人却补不全？';

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
    <div
      className="grid gap-1.5"
      style={{ gridTemplateColumns: `repeat(${chars.length}, minmax(0, 1fr))` }}
    >
      {chars.map((char, index) => (
        <div key={`${char}-${index}`} className="text-center">
          <div
            className={`rounded-xl border py-3 font-mono text-2xl font-semibold transition-all ${
              active?.(index)
                ? 'border-accent bg-accent text-white shadow-card'
                : 'border-classroom-border bg-classroom-stage text-text-primary'
            }`}
          >
            {char}
          </div>
          <div className="mt-1 font-mono text-sm text-text-secondary">
            {negative ? index - chars.length : index}
          </div>
        </div>
      ))}
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
}: {
  start: string;
  end: string;
  showLabels?: boolean;
}) {
  return (
    <div className="slice-code-display inline-flex flex-col items-center">
      <code className={`inline-flex rounded-2xl border border-code-border bg-code-bg px-6 pt-3 font-mono text-xl text-code-text shadow-card ${
        showLabels ? 'pb-8' : 'pb-3'
      }`}>
        <span>phone[</span>
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
  const { state, dispatch } = useSceneEngine();
  const phone = content.phone ?? DEFAULT_PHONE;
  const [hideChoice, setHideChoice] = useState<(typeof HIDE_OPTIONS)[number]['id'] | null>(null);
  const maxPhase: Record<StringSliceContent['mode'], number> = {
    cover: 0,
    privacy: 2,
    decompose: 4,
    'index-need': 3,
    syntax: 4,
    'cut-demo': 6,
    negative: 2,
    boundary: 2,
    'ai-review': 2,
    cases: 4,
    pitfalls: 3,
    'minus-ways': 2,
    practice: 1,
    values: 2,
    summary: 3,
    homework: 2,
  };
  const { phase, advance, reset, done } = useStageAdvance(sceneId, maxPhase[content.mode]);
  const interactive = maxPhase[content.mode] > 0;
  const waitForHideChoice = content.mode === 'privacy' && phase === 1 && !hideChoice;

  useEffect(() => {
    setHideChoice(null);
  }, [sceneId]);

  useEffect(() => {
    const code = content.mode === 'cases'
      ? MASK_CODES[Math.min(phase, MASK_CODES.length - 1)]
      : content.mode === 'pitfalls'
        ? PITFALL_CODES[Math.min(phase, PITFALL_CODES.length - 1)]
        : content.mode === 'minus-ways'
          ? MINUS_CODES[Math.min(phase, MINUS_CODES.length - 1)]
          : content.mode === 'syntax' && phase >= 4
            ? SYNTAX_CODE_WITH_STEP
            : null;
    if (!code || state.sceneLocal.code === code) return;
    dispatch({ type: 'UPDATE_CODE', code, clearOutput: true });
  }, [content.mode, phase, state.sceneLocal.code, dispatch]);

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
          <div className="mx-auto mt-4 max-w-3xl">
            <p className="text-center title-kai text-2xl font-semibold text-error">
              信息可以直接公开发布吗？
            </p>
            <div className="mt-4 overflow-hidden rounded-3xl border border-classroom-border bg-classroom-stage shadow-card">
              <div className="border-b border-classroom-border bg-accent-muted px-7 py-3 text-lg font-semibold text-accent">
                大学生创新项目入选结果
              </div>
              <div className="space-y-3 px-8 py-5 text-xl">
                <p><span className="text-text-secondary">项目：</span>智慧校园节能系统</p>
                <p><span className="text-text-secondary">负责人：</span>李明</p>
                <p>
                  <span className="text-text-secondary">手机：</span>
                  <span className="font-mono">
                    {phone.slice(0, 3)}
                    {[...phone.slice(3, 7)].map((digit, index) => (
                      <span
                        key={`private-digit-${index}`}
                        className="relative inline-block"
                      >
                        {phase >= 2 ? (
                          <>
                            <span
                              className="phone-mask-digit-out inline-block"
                              style={{ animationDelay: `${index * 0.15}s` }}
                            >
                              {digit}
                            </span>
                            <span
                              className="phone-mask-star-in absolute inset-0 text-error"
                              style={{ animationDelay: `${index * 0.15}s` }}
                            >
                              *
                            </span>
                          </>
                        ) : digit}
                      </span>
                    ))}
                    {phone.slice(-4)}
                  </span>
                </p>
              </div>
            </div>
            {phase === 1 && (
              <div className="mt-4">
                <p className="text-center text-xl font-semibold text-accent">{PRIVACY_PROMPT}</p>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {HIDE_OPTIONS.map((option) => {
                    const selected = hideChoice === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`rounded-2xl border px-3 py-4 text-center transition ${
                          selected
                            ? 'border-accent bg-accent-muted shadow-card'
                            : 'border-classroom-border bg-classroom-stage'
                        }`}
                        onClick={(event) => {
                          event.stopPropagation();
                          setHideChoice(option.id);
                        }}
                      >
                        <p className="text-lg font-semibold text-text-primary">{option.label}</p>
                        <p className="mt-2 font-mono text-base text-text-secondary">{option.note}</p>
                      </button>
                    );
                  })}
                </div>
                {hideChoice && (
                  <p className="mt-3 text-center text-lg text-text-primary timeline-node-in">
                    {HIDE_FEEDBACK[hideChoice]}
                  </p>
                )}
              </div>
            )}
            {phase >= 2 && (
              <p className="mt-4 text-center text-xl font-semibold text-accent timeline-node-in">
                {hideChoice === 'middle'
                  ? '你藏的就是这一段。公示留下前 3 位和后 4 位。'
                  : '公示藏住的是中间 4 位。前 3 位和后 4 位留下，本人还认得。'}
              </p>
            )}
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
              <CodePill accent={phase >= 1}>138</CodePill>
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

      case 'index-need':
        return (
          <div className="mt-4">
            <p className="stage-emphasis text-2xl">思考：用索引如何解决？</p>
            <div className="mt-5">
              <PhoneCells
                phone={phone}
                active={(index) => (
                  phase === 1 ? index < 5
                    : phase === 2 ? index >= phone.length - 4
                      : phase < 3 && index < 3
                )}
              />
            </div>
            <div className="mt-6 space-y-4">
              {phase === 0 && (
                <p className="text-lg text-text-secondary">
                  右侧用三个下标拼出前 3 位。先别改它，看这样写会遇到什么。
                </p>
              )}
              {phase >= 1 && (
                <div className="rounded-2xl border border-error/40 bg-error/10 px-6 py-4 timeline-node-in">
                  <p className="text-xl font-semibold text-error">改为取前 5 位？</p>
                  <p className="mt-2 font-mono text-lg text-text-primary">
                    phone[0] + phone[1] + phone[2] + phone[3] + phone[4]
                  </p>
                  <p className="mt-2 text-lg text-text-secondary">
                    如果硬改，多两位就要多写两个方括号。要取多长，代码就写多长。
                  </p>
                </div>
              )}
              {phase >= 2 && (
                <div className="rounded-2xl border border-error/40 bg-error/10 px-6 py-4 timeline-node-in">
                  <p className="text-xl font-semibold text-error">改为取后 4 位？</p>
                  <p className="mt-2 font-mono text-lg text-text-primary">
                    phone[7] + phone[8] + phone[9] + phone[10]
                  </p>
                  <p className="mt-2 text-lg text-text-secondary">
                    如果硬改，要先数到下标 7。号码不是 11 位时，7 就指错地方。
                  </p>
                </div>
              )}
              {phase >= 3 && (
                <div className="rounded-2xl border-2 border-accent bg-accent-muted px-6 py-5 text-center timeline-node-in">
                  <p className="text-xl text-text-primary">连续的一段，要一次取出来。</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'syntax': {
        const poem = '举头望明月低头思故乡';
        const chars = [...poem];
        const bounds = phase === 1
          ? { start: 0, end: 5 }
          : phase === 2
            ? { start: 5, end: 10 }
            : null;
        const cutting = phase === 1 || phase === 2;
        const showMarks = phase === 4;
        const boundaryLeft = (boundary: number) => `${(boundary / chars.length) * 100}%`;
        const knifeLeft = (boundary: number) => (
          boundary === 0 ? '0px' : `calc(${boundaryLeft(boundary)} - 1rem)`
        );
        const mark = (index: number) => {
          if (phase !== 4) return null;
          const offset = index % 5;
          if (offset % 2 === 0) {
            return { text: offset === 0 ? 'start' : '+2', tone: offset === 0 ? 'text-accent' : 'text-success' };
          }
          return { text: '跳过', tone: 'text-text-secondary' };
        };
        const cellTone = (index: number) => {
          if (phase === 1) return index < 5 ? 'lift' : 'dim';
          if (phase === 2) return index >= 5 ? 'lift' : 'dim';
          if (phase === 4) return (index % 5) % 2 === 0 ? 'hop' : 'skip';
          return 'idle';
        };

        return (
          <div className="mt-2">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-white">重点</span>
              <code className="whitespace-nowrap font-mono text-2xl text-code-text">
                s[<span className="text-accent">start</span>:<span className="text-highlight">end</span>]
              </code>
              <span className="text-sm text-text-secondary">刀落在缝上</span>
            </div>
            {phase === 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  ['start', '拿到的第一格', 'text-accent border-accent/40 bg-accent-muted'],
                  ['end', '右刀那条缝，这一格不取', 'text-highlight border-highlight/40 bg-classroom-stage'],
                ].map(([name, note, tone]) => (
                  <div key={name} className={`rounded-xl border px-2 py-2 text-center ${tone}`}>
                    <p className="font-mono text-base font-semibold">{name}</p>
                    <p className="text-sm text-text-primary">{note}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 rounded-2xl bg-classroom-playground px-3 py-3">
              <p className="mb-2 font-mono text-sm text-text-secondary">
                poem = &quot;{poem}&quot;
              </p>
              {showMarks && (
                <div
                  className="mb-1 grid gap-1"
                  style={{ gridTemplateColumns: `repeat(${chars.length}, minmax(0, 1fr))` }}
                >
                  {chars.map((char, index) => {
                    const label = mark(index);
                    return (
                      <p
                        key={`${char}-mark`}
                        className={`h-4 text-center font-mono text-xs font-semibold ${label ? label.tone : 'text-transparent'}`}
                      >
                        {label?.text ?? '·'}
                      </p>
                    );
                  })}
                </div>
              )}
              <div className={`relative ${cutting ? 'pt-7' : ''}`}>
                <div
                  className="grid gap-1"
                  style={{ gridTemplateColumns: `repeat(${chars.length}, minmax(0, 1fr))` }}
                >
                  {chars.map((char, index) => {
                    const tone = cellTone(index);
                    return (
                      <div
                        key={`${char}-${index}`}
                        className={`rounded-lg border py-2 text-center font-mono text-xl font-semibold ${
                          tone === 'hop' ? 'slice-syntax-hop' : 'transition-all'
                        } ${
                          tone === 'lift' || tone === 'hop'
                            ? 'border-accent bg-accent text-white shadow-card'
                            : tone === 'skip' || tone === 'dim'
                              ? 'border-classroom-border bg-classroom-stage text-text-primary opacity-35'
                              : 'border-classroom-border bg-classroom-stage text-text-primary'
                        } ${tone === 'lift' ? '-translate-y-1' : ''}`}
                        style={tone === 'hop' ? { animationDelay: `${((index % 5) / 2 + (index >= 5 ? 3 : 0)) * 0.28}s` } : undefined}
                      >
                        {char}
                      </div>
                    );
                  })}
                </div>
                <div
                  className="mt-1 grid gap-1 text-center font-mono text-xs text-text-secondary"
                  style={{ gridTemplateColumns: `repeat(${chars.length}, minmax(0, 1fr))` }}
                >
                  {chars.map((char, index) => (
                    <span key={`${char}-index`}>{index}</span>
                  ))}
                </div>
                {bounds && (
                  <>
                    <span
                      className={`slice-boundary-line slice-boundary-start absolute bottom-4 z-10 ${cutting ? 'top-7' : 'top-0'}`}
                      style={{ left: boundaryLeft(bounds.start) }}
                    />
                    <span
                      className={`slice-boundary-line slice-boundary-end slice-motion-delay absolute bottom-4 z-10 ${cutting ? 'top-7' : 'top-0'}`}
                      style={{ left: boundaryLeft(bounds.end) }}
                    />
                    {cutting && (
                      <>
                        <span
                          key={`knife-start-${bounds.start}`}
                          className="absolute top-0 z-30"
                          style={{ left: knifeLeft(bounds.start) }}
                        >
                          <SliceKnife compact />
                        </span>
                        <span
                          key={`knife-end-${bounds.end}`}
                          className="absolute top-0 z-30"
                          style={{ left: knifeLeft(bounds.end) }}
                        >
                          <SliceKnife compact delayed end />
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>
              {phase === 1 && (
                <p className="mt-2 text-center text-sm text-highlight">下标 5 的「低」留在刀外，这一格不取。</p>
              )}
              {phase === 2 && (
                <p className="mt-2 text-center text-sm text-highlight">上一段的 end 就是这一段的 start。</p>
              )}
              {phase === 4 && (
                <p className="mt-2 text-center text-sm text-success">深度：step = 2，跳过的格子不取。省略 step 时，每次向右走 1 格。</p>
              )}
            </div>
            {phase === 1 && (
              <div className="mt-2 grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-xl bg-classroom-stage px-3 py-2 timeline-node-in">
                <span className="text-xs font-semibold text-accent">第一刀</span>
                <code className="rounded-lg bg-code-bg px-2 py-1.5 text-center font-mono text-sm text-code-text">
                  poem[0:5]
                </code>
                <span className="rounded-lg bg-accent px-2 py-1.5 text-base font-semibold text-white">举头望明月</span>
              </div>
            )}
            {phase === 2 && (
              <div className="mt-2 grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-xl bg-classroom-stage px-3 py-2 timeline-node-in">
                <span className="text-xs font-semibold text-accent">第二刀</span>
                <code className="rounded-lg bg-code-bg px-2 py-1.5 text-center font-mono text-sm text-code-text">
                  poem[5:10]
                </code>
                <span className="rounded-lg bg-accent px-2 py-1.5 text-base font-semibold text-white">低头思故乡</span>
              </div>
            )}
            {phase === 3 && (
              <div className="mt-2 rounded-xl border-2 border-accent bg-accent-muted px-3 py-3 timeline-node-in">
                <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-sm font-semibold">
                  <span className="rounded-lg bg-accent px-2 py-1 text-white">[0:5] 举头望明月</span>
                  <span className="rounded-lg bg-accent px-2 py-1 text-white">[5:10] 低头思故乡</span>
                </div>
                <p className="mt-2 text-center text-base text-text-primary">
                  两段接在下标 5 这条缝上。缝左边取到，缝右边的字留给下一段。
                </p>
              </div>
            )}
            {phase === 4 && (
              <div className="mt-2 space-y-1.5 rounded-xl border border-dashed border-success/40 bg-classroom-stage px-3 py-2 timeline-node-in">
                {[
                  ['poem[0:5:2]', '举望月'],
                  ['poem[5:10:2]', '低思乡'],
                ].map(([code, result], index) => (
                  <div key={code} className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
                    <span className="rounded-full bg-success/10 px-2 py-1 text-xs font-semibold text-success">
                      {index === 0 ? '深度' : '同理'}
                    </span>
                    <code className="rounded-lg bg-code-bg px-2 py-1.5 text-center font-mono text-sm text-code-text">
                      {code}
                    </code>
                    <span className="rounded-lg border border-success px-2 py-1.5 text-base font-semibold text-success">{result}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      case 'cut-demo': {
        const chars = [...phone];
        const middleRound = phase >= 3;
        const start = middleRound ? 3 : 0;
        const end = middleRound ? 7 : 3;
        const showCuts = phase >= 1;
        const cutting = phase === 1 || phase === 3;
        const extracted = phase === 2 || phase >= 3;
        const showBoundaryLabels = (phase >= 1 && phase <= 2) || phase >= 5;
        const selected = (index: number) => (
          (!middleRound && phase >= 2 && index < end)
          || (middleRound && index >= start && index < end)
        );
        const boundaryLeft = (boundary: number) => `${(boundary / chars.length) * 100}%`;
        const selectionWidth = `${((end - start) / chars.length) * 100}%`;
        const result = phone.slice(start, end);

        if (phase >= 6) {
          return (
            <div className="mx-auto mt-4 max-w-4xl">
              <p className="text-center text-sm font-semibold tracking-[0.16em] text-accent">重点 · 缝与缝接上</p>
              <div className="mt-6 grid grid-cols-[3fr_4fr_4fr] overflow-hidden rounded-3xl border-2 border-accent text-center font-mono text-3xl font-semibold">
                <div className="bg-accent-muted px-5 py-7">{phone.slice(0, 3)}</div>
                <div className="border-x-2 border-accent bg-classroom-stage px-5 py-7">{phone.slice(3, 7)}</div>
                <div className="bg-accent-muted px-5 py-7">{phone.slice(7)}</div>
              </div>
              <div className="grid grid-cols-[3fr_4fr_4fr] text-center">
                <p className="py-3 font-mono text-lg">[0:3]</p>
                <p className="py-3 font-mono text-lg">[3:7]</p>
                <p className="py-3 font-mono text-lg">[7:11]</p>
              </div>
              <p className="mt-6 text-center text-xl text-text-primary">前一段的 end，就是后一段的 start。</p>
              <div className="mt-4 flex justify-center gap-4">
                <span className="rounded-full bg-success/10 px-6 py-2 text-lg font-semibold text-success">不重复</span>
                <span className="rounded-full bg-success/10 px-6 py-2 text-lg font-semibold text-success">不遗漏</span>
              </div>
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
          <div className="mx-auto mt-1 max-w-5xl">
            <div className="flex items-center justify-between">
              <p className="stage-emphasis text-2xl">切片：在两个边界之间取出一段</p>
              <span className="rounded-full border border-classroom-border bg-classroom-stage px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-text-secondary">
                VISUAL SLICE
              </span>
            </div>

            <div className="mt-2 flex min-h-[76px] items-start justify-center text-center">
              {phase === 0 && (
                <div className="slice-task-card timeline-node-in">
                  <span>任务一</span>
                  <strong>切出前 3 位</strong>
                </div>
              )}
              {phase >= 1 && phase <= 2 && (
                <div className="timeline-node-in">
                  <SliceCodeDisplay start="0" end="3" showLabels />
                </div>
              )}
              {phase === 3 && (
                <div className="slice-task-card timeline-node-in">
                  <span>任务二</span>
                  <strong>切出要藏住的 4 位</strong>
                </div>
              )}
              {phase === 4 && (
                <div className="timeline-node-in">
                  <p className="mb-1 text-base font-semibold text-text-primary">边界已经找到，代码如何写？</p>
                  <SliceCodeDisplay start="??" end="??" />
                </div>
              )}
              {phase >= 5 && (
                <div className="timeline-node-in">
                  <SliceCodeDisplay start="3" end="7" showLabels />
                </div>
              )}
            </div>

            <div className="slice-visual-stage mx-3 rounded-3xl border border-classroom-border px-7 pb-10 pt-4 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <code className="font-mono text-base font-semibold text-text-secondary">
                  phone = <span className="text-accent">&quot;{phone}&quot;</span>
                </code>
                <div className="flex items-center gap-4 text-xs font-semibold text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    <i className="h-2.5 w-2.5 rounded-full bg-accent" />
                    start
                  </span>
                  <span className="flex items-center gap-1.5">
                    <i className="h-2.5 w-2.5 rounded-full bg-highlight" />
                    end
                  </span>
                </div>
              </div>

              <div className="relative">
                <div
                  className="grid gap-2.5"
                  style={{ gridTemplateColumns: `repeat(${chars.length}, minmax(0, 1fr))` }}
                >
                  {chars.map((char, index) => {
                    const isSelected = selected(index);
                    const isDimmed = extracted && !isSelected;
                    const automatic = phase === 3;
                    return (
                      <div
                        key={`${char}-${index}`}
                        className={`slice-demo-cell ${
                          isSelected
                            ? automatic
                              ? 'slice-demo-cell-auto-selected'
                              : 'slice-demo-cell-selected'
                            : isDimmed
                              ? automatic
                                ? 'slice-demo-cell-auto-dimmed'
                                : 'slice-demo-cell-dimmed'
                              : ''
                        }`}
                        style={
                          automatic
                            ? { animationDelay: `${1.28 + Math.max(0, index - start) * 0.06}s` }
                            : undefined
                        }
                      >
                        {char}
                      </div>
                    );
                  })}
                </div>
                <div
                  className="mt-2 grid gap-2.5 text-center font-mono text-base text-text-secondary"
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

                {showBoundaryLabels && (
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
                    className={`slice-selection-bracket absolute -bottom-9 ${
                      phase === 3 ? 'slice-auto-reveal' : ''
                    }`}
                    style={{ left: boundaryLeft(start), width: selectionWidth }}
                  >
                    <span>{middleRound ? '要藏的 4 位' : '前 3 位'}</span>
                  </div>
                )}
              </div>
            </div>

            {(phase === 2 || phase >= 5) && (
              <div className="mt-3">
              <div className="slice-result-reveal flex flex-wrap items-center justify-center gap-3">
                <span className="rounded-full bg-accent-muted px-4 py-2 text-sm font-semibold text-accent">
                  切片完成
                </span>
                <code className="rounded-xl bg-code-bg px-4 py-2 font-mono text-lg text-code-text shadow-card">
                  phone[{start}:{end}]
                </code>
                <span className="text-2xl text-accent">→</span>
                <span className="rounded-2xl border border-success/20 bg-success/10 px-6 py-2 font-mono text-3xl font-semibold text-success shadow-card">
                  {result}
                </span>
                {done && (
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
                )}
              </div>
              <p className="mt-2 text-center text-base text-highlight">
                {middleRound
                  ? '下标 3 上一刀在刀外，这一刀是 start。取 3、4、5、6，下标 7 不取。公示时这四位换成 ****。'
                  : '取下标 0、1、2。下标 3 在右刀外面，不取。'}
              </p>
              </div>
            )}
          </div>
        );
      }

      case 'cases': {
        const chars = [...phone];
        const isFront = (index: number) => index < 3;
        const isTail = (index: number) => index >= chars.length - 4;
        const active = (index: number) => (
          (phase === 1 && isFront(index))
          || (phase === 2 && isTail(index))
          || (phase === 3 && (isFront(index) || isTail(index)))
        );
        const hidden = (index: number) => phase === 3 && !isFront(index) && !isTail(index);
        const question = [
          '先取出哪一段？',
          '从开头取，start 还要写成 0 吗？',
          '号码长度一变，[7:11] 还指得住这段吗？从右边第 4 格开始，怎样写？',
          '怎样和 **** 接成一条？',
        ][phase];

        if (phase >= 4) {
          return (
            <div className="mx-auto mt-6 max-w-3xl">
              <p className="text-center text-lg font-semibold text-accent">任务完成</p>
              <div className="mx-auto mt-6 flex max-w-md flex-col items-stretch gap-3">
                <div className="rounded-2xl border border-classroom-border bg-classroom-stage px-5 py-4 text-center">
                  <p className="text-sm font-semibold text-text-secondary">处理前</p>
                  <p className="mt-2 font-mono text-2xl font-semibold text-text-primary">{phone}</p>
                </div>
                <span className="text-center text-3xl text-accent">↓</span>
                <div className="rounded-2xl border border-success/40 bg-success/10 px-5 py-4 text-center">
                  <p className="text-sm font-semibold text-success">处理后</p>
                  <p className="mt-2 font-mono text-2xl font-semibold text-text-primary">{MASK_TARGET}</p>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="mt-2">
            <p className="stage-emphasis text-xl">任务：手机号只让本人认出</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 font-mono text-2xl font-semibold">
              <span className="text-text-primary">{phone}</span>
              <span className="text-accent">→</span>
              <span className="text-accent">{MASK_TARGET}</span>
            </div>
            <div
              className="mt-5 grid gap-1"
              style={{ gridTemplateColumns: `repeat(${chars.length}, minmax(0, 1fr))` }}
            >
              {chars.map((char, index) => (
                <div
                  key={`${char}-${index}`}
                  className={`rounded-lg border py-2 text-center font-mono text-xl font-semibold transition-all ${
                    active(index)
                      ? 'border-accent bg-accent text-white shadow-card'
                      : hidden(index)
                        ? 'border-classroom-border bg-classroom-stage text-text-secondary opacity-40'
                        : 'border-classroom-border bg-classroom-stage text-text-primary'
                  }`}
                >
                  {hidden(index) ? '*' : char}
                </div>
              ))}
            </div>
            {phase >= 2 && (
              <div
                className="mt-1 grid gap-1"
                style={{ gridTemplateColumns: `repeat(${chars.length}, minmax(0, 1fr))` }}
              >
                {chars.map((_, index) => (
                  <span
                    key={`neg-${index}`}
                    className={`text-center font-mono text-xs ${
                      isTail(index) ? 'font-semibold text-accent' : 'text-text-secondary'
                    }`}
                  >
                    {index - chars.length}
                  </span>
                ))}
              </div>
            )}
            {phase >= 2 && phase < 4 && (
              <p className="mt-2 text-center text-sm text-accent">-1 是最后一格。-4 定的是位置，不是往左走。</p>
            )}
            {question && <p className="stage-emphasis mt-5 text-xl">{question}</p>}
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
              className="mt-4 grid gap-1"
              style={{ gridTemplateColumns: `repeat(${chars.length + (showGhost ? 1 : 0)}, minmax(0, 1fr))` }}
            >
              {chars.map((char, index) => (
                <div key={`${char}-${index}`} className="text-center">
                  <div className="rounded-lg border border-classroom-border bg-classroom-stage py-2 font-mono text-lg font-semibold text-text-primary">
                    {char}
                  </div>
                  <p className="mt-1 font-mono text-xs text-text-secondary">{index}</p>
                </div>
              ))}
              {showGhost && (
                <div className="text-center">
                  <div className="rounded-lg border border-dashed border-highlight py-2 font-mono text-lg font-semibold text-highlight">
                    ?
                  </div>
                  <p className="mt-1 font-mono text-xs font-semibold text-highlight">11</p>
                </div>
              )}
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
            <p className="text-sm font-semibold tracking-[0.14em] text-accent">难点 · 负号有两种走法</p>
            {phase === 0 && (
              <>
                <div
                  className="mt-4 grid gap-1"
                  style={{ gridTemplateColumns: `repeat(${chars.length}, minmax(0, 1fr))` }}
                >
                  {chars.map((char, index) => (
                    <div
                      key={`${char}-${index}`}
                      className={`rounded-lg border py-2 text-center font-mono text-xl font-semibold ${
                        tail(index)
                          ? 'border-accent bg-accent text-white'
                          : 'border-classroom-border bg-classroom-stage text-text-primary'
                      }`}
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
                <div className="grid grid-cols-5 gap-1">
                  {nameChars.map((char, index) => (
                    <div key={`name-${index}`} className="text-center">
                      <div className="rounded-lg border border-accent/40 bg-accent-muted py-2 font-mono text-xl font-semibold text-text-primary">
                        {char}
                      </div>
                      <div className="mt-1 font-mono text-xs text-text-secondary">{index}</div>
                    </div>
                  ))}
                </div>
                <p className="my-2 text-center font-mono text-sm font-semibold text-highlight">
                  ↓ name[::-1] 从最后一格往左走
                </p>
                <div className="grid grid-cols-5 gap-1">
                  {reversedChars.map((char, index) => (
                    <div
                      key={`rev-${index}`}
                      className="rounded-lg border border-highlight bg-classroom-stage py-2 text-center font-mono text-xl font-semibold text-text-primary"
                    >
                      {char}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {phase >= 1 && (
              <p className="mt-4 text-center text-lg text-text-primary timeline-node-in">
                步长上的负号是方向：从最后一格往左，一直走到开头。手机号同理，<span className="font-mono">phone[::-1]</span> 下一页要用。
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
            <p className="mt-3 break-all text-center font-mono text-2xl font-semibold leading-tight text-text-primary">
              2026100443210000831
            </p>
            {phase >= 1 && (
              <div className="mt-4 grid grid-cols-[8fr_11fr] gap-2 timeline-node-in">
                <div className="rounded-xl border border-accent bg-accent-muted px-3 py-3 text-center">
                  <p className="font-mono text-xl font-semibold text-text-primary">20261004</p>
                  <p className="mt-1 text-sm text-accent">前 8 位 · 日期</p>
                </div>
                <div className="rounded-xl border border-highlight bg-classroom-stage px-3 py-3 text-center">
                  <p className="font-mono text-xl font-semibold text-text-primary">43210000831</p>
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
          <div className="mx-auto max-w-4xl">
            <p className="stage-emphasis text-center text-2xl">贴到公示栏的是哪一行？</p>
            <div className="mt-4 space-y-3">
              <div className={`rounded-2xl border px-6 py-4 ${phase >= 1 ? 'border-success bg-success/10' : 'border-classroom-border bg-classroom-stage'}`}>
                <div className="flex items-center justify-between gap-4">
                  <p className="font-mono text-2xl font-semibold text-text-primary">20261004 138****1234</p>
                  {phase >= 1 && <span className="rounded-full bg-success px-4 py-1 text-base font-semibold text-white">可以贴</span>}
                </div>
                {phase >= 1 && (
                  <p className="mt-2 text-base text-text-secondary">公示行。能核对号码，看不到完整手机号。</p>
                )}
              </div>
              <div className={`rounded-2xl border px-6 py-4 ${phase >= 1 ? 'border-error/50 bg-error/10' : 'border-classroom-border bg-classroom-stage'}`}>
                <div className="flex items-center justify-between gap-4">
                  <p className="font-mono text-2xl font-semibold text-text-primary">2026100443210000831</p>
                  {phase >= 1 && <span className="rounded-full bg-error px-4 py-1 text-base font-semibold text-white">不能贴</span>}
                </div>
                {phase >= 1 && (
                  <p className="mt-2 text-base text-text-secondary">原记录。还能用 row[8:][::-1] 还原手机号。</p>
                )}
              </div>
            </div>
            {phase >= 2 && (
              <div className="mt-4 rounded-2xl bg-accent-muted px-6 py-4 text-center timeline-node-in">
                <p className="title-kai text-2xl leading-snug text-text-primary">
                  切片决定别人看见什么。能切，就要为交出去的那一行负责。
                </p>
              </div>
            )}
          </div>
        );

      case 'summary':
        return (
          <div className="mx-auto max-w-5xl">
            <div className="rounded-2xl border-2 border-accent bg-classroom-stage px-5 py-3 text-center shadow-card">
              <p className="text-sm font-semibold tracking-[0.16em] text-accent">重点</p>
              <p className="mt-1 font-mono text-3xl font-semibold leading-none text-text-primary">
                s[<span className="text-accent">start</span>:<span className="text-highlight">end</span>]
              </p>
              <p className="mt-2 text-lg text-text-secondary">含 start，不含 end。刀落在缝上，缝右边的字不取。</p>
            </div>
            {phase >= 1 && (
              <div className="mt-3 grid grid-cols-2 gap-3 timeline-node-in">
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
            )}
            {phase >= 2 && (
              <div className="mt-3 timeline-node-in">
                <p className="mb-2 text-sm font-semibold tracking-[0.16em] text-highlight">难点</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    ['下标越界会报错', '切片越界得到空字符串'],
                    ['原字符串不动', '切片得到的是新串'],
                    ['[::-1]', '负号在步长上，是方向：客上天然居 → 居然天上客'],
                  ].map(([left, right]) => (
                    <div key={left} className="rounded-xl border border-highlight/40 bg-classroom-stage px-3 py-2 text-center text-base leading-snug text-text-primary">
                      <p>{left}</p>
                      <p className="mt-1 text-text-secondary">{right}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {phase >= 3 && (
              <div className="mt-3 rounded-xl border border-dashed border-success/40 px-5 py-3 timeline-node-in">
                <p className="text-sm font-semibold tracking-[0.16em] text-success">深度 · 可以后记</p>
                <p className="mt-1 text-center font-mono text-lg text-text-primary">[::2] 隔位取：举头望明月 → 举望月。省略 step 时每次走 1 格，步长不能为 0。</p>
                <p className="mt-2 text-center text-lg font-semibold text-accent">程序里可以留原记录，交出去的只能是公示行。</p>
              </div>
            )}
          </div>
        );

      case 'homework':
        return (
          <div className="mx-auto mt-5 max-w-4xl space-y-4">
            {[
              {
                tag: '必做',
                title: '倒序手机号',
                body: '导出串 23010000831 是倒序手机号。还原后，只输出可以发到群里的形式，并说明原来的字符串还在不在。写明每一刀切在哪。',
              },
              {
                tag: '选做',
                title: '判断日期能否入库',
                body: '20261301 按 YYYYMMDD 入库。切出年、月、日，判断能不能入库；若不能，指出是哪一段不合法。',
              },
            ].map((task, index) => (
              <div
                key={task.title}
                className={`flex items-center gap-5 rounded-2xl border bg-classroom-stage px-6 py-5 shadow-card transition-all ${
                  phase >= index + 1
                    ? 'border-accent opacity-100 translate-x-0'
                    : 'border-classroom-border opacity-30 translate-x-2'
                }`}
              >
                <span className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-base font-semibold text-white ${task.tag === '必做' ? 'bg-accent' : 'bg-highlight'}`}>{task.tag}</span>
                <div>
                  <p className="text-xl font-semibold text-text-primary">{task.title}</p>
                  <p className="mt-1 text-lg text-text-secondary">{task.body}</p>
                </div>
              </div>
            ))}
          </div>
        );
    }
  })();

  return (
    <div
      className={interactive ? 'cursor-pointer select-none' : ''}
      onClick={() => interactive && !waitForHideChoice && advance()}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={(event) => {
        if (!interactive || waitForHideChoice) return;
        if ((event.key === 'Enter' || event.key === ' ') && advance()) {
          event.preventDefault();
          event.stopPropagation();
        }
      }}
    >
      {body}
      {interactive && !done && (
        <p className="mt-6 text-center text-base text-accent/80">
          {waitForHideChoice ? '先选一段' : '点击继续 · 或按空格 / →'}
        </p>
      )}
    </div>
  );
}
