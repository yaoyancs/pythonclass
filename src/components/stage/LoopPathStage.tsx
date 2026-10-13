import { useState } from 'react';
import { useStageAdvance } from '../../hooks/useStageAdvance';
import type { LoopPathContent } from '../../types/scene';

interface Props {
  content: LoopPathContent;
  sceneId: string;
}

function Next({ onClick, children }: { onClick: () => void; children: string }) {
  return (
    <button type="button" className="mt-6 text-left text-lg font-semibold text-accent" onClick={onClick}>
      {children}
    </button>
  );
}

function WhyCopy() {
  const lines = ['print("请打卡")', 'print("请打卡")', 'print("请打卡")'];
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">同一件事做三次</h2>
      <p className="mt-3 text-xl text-text-secondary">早课打卡要提醒三次。复制三条语句，程序能跑。</p>
      <pre className="mt-6 rounded-3xl bg-white p-6 text-2xl leading-relaxed">{lines.join('\n')}</pre>
      <p className="mt-6 text-2xl font-semibold">次数写死在语句的条数里。</p>
    </div>
  );
}

function WhyCount() {
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">改成提醒 100 次呢？</h2>
      <p className="mt-4 text-xl text-text-secondary">左边的代码只写了 3 行。次数一变，就要增删同样的语句。</p>
      <p className="mt-6 text-2xl font-semibold">重复的是动作，变化的是次数。循环把这两件事分开。</p>
    </div>
  );
}

function WhyParts() {
  const items = [
    ['从哪里开始', 'n = 1'],
    ['什么时候继续', 'n <= 3'],
    ['每次做什么', 'print(n)'],
    ['怎样靠近结束', 'n = n + 1'],
  ];
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">循环要回答四件事</h2>
      <div className="mt-6 grid grid-cols-2 gap-4">
        {items.map(([title, code]) => (
          <div key={title} className="rounded-3xl bg-white px-5 py-4">
            <p className="text-lg text-text-secondary">{title}</p>
            <p className="mt-2 font-mono text-2xl">{code}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xl text-text-secondary">少了「怎样靠近结束」，循环就停不下来。</p>
    </div>
  );
}

function WhileSyntax() {
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">while</h2>
      <p className="mt-4 text-xl leading-relaxed text-text-secondary">
        先看条件。条件为 True，执行缩进的语句块，再回到条件。条件为 False，跳过语句块，执行后面的语句。
      </p>
      <p className="mt-6 text-2xl font-semibold">冒号后面是循环体，靠缩进圈定。</p>
    </div>
  );
}

const WHILE_STEPS = [
  { n: '1', cond: '1 <= 3 → True', out: '打印 1', next: 'n 变成 2' },
  { n: '2', cond: '2 <= 3 → True', out: '打印 2', next: 'n 变成 3' },
  { n: '3', cond: '3 <= 3 → True', out: '打印 3', next: 'n 变成 4' },
  { n: '4', cond: '4 <= 3 → False', out: '不进入循环体', next: '打印「结束」' },
];

function WhileTrace({ sceneId }: { sceneId: string }) {
  const advance = useStageAdvance(sceneId, WHILE_STEPS.length);
  const shown = WHILE_STEPS.slice(0, advance.phase);
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">条件、循环体、再判断</h2>
      <p className="mt-2 text-lg text-text-secondary">点击画面，看 n 每一轮怎么变。</p>
      <div className="mt-4 space-y-3">
        {shown.map((step) => (
          <div key={step.n} className="grid grid-cols-4 gap-2 rounded-2xl bg-white px-4 py-3 text-lg">
            <span>n = {step.n}</span>
            <span>{step.cond}</span>
            <span>{step.out}</span>
            <span className="font-semibold text-accent">{step.next}</span>
          </div>
        ))}
      </div>
      {advance.phase === 0 && <p className="mt-6 text-xl text-text-secondary">从 n = 1 开始。</p>}
    </div>
  );
}

function WhileInfinite() {
  const [ticks, setTicks] = useState(0);
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">n 一直是 1</h2>
      <p className="mt-3 text-xl text-text-secondary">左边少了 n = n + 1。条件 1 &lt;= 3 永远成立。</p>
      <button
        type="button"
        className="mt-6 rounded-2xl bg-white px-5 py-3 text-xl font-semibold"
        onClick={() => setTicks((n) => n + 1)}
      >
        再执行一轮
      </button>
      <p className="mt-4 font-mono text-2xl">已打印 {ticks} 次「1」，还没有走到「结束」。</p>
      {ticks >= 3 && <p className="mt-4 text-xl font-semibold text-error">循环体必须改变条件里用到的量。</p>}
    </div>
  );
}

function WhilePractice() {
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">写出 1、2、3、结束</h2>
      <p className="mt-4 text-xl text-text-secondary">用 while。每个数字一行，循环结束后再打印「结束」。</p>
    </div>
  );
}

function ForMeet() {
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">次数已经数得清</h2>
      <p className="mt-4 text-xl leading-relaxed text-text-secondary">
        while 要自己准备起点、条件和更新。若只是把 1 到 3 依次交给变量，for 和 range 把这三件事收进一句话。
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4 text-xl">
        <pre className="rounded-3xl bg-white p-5 leading-relaxed">{'n = 1\nwhile n <= 3:\n    print(n)\n    n = n + 1'}</pre>
        <pre className="rounded-3xl bg-white p-5 leading-relaxed">{'for n in range(1, 4):\n    print(n)'}</pre>
      </div>
    </div>
  );
}

function ForRange() {
  const nums = [1, 2, 3];
  const [i, setI] = useState(-1);
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">range 依次交出整数</h2>
      <p className="mt-3 text-xl text-text-secondary">for 每轮取一个数放进 n，循环体用完后再取下一个。</p>
      <div className="mt-6 flex gap-3">
        {nums.map((n, index) => (
          <button
            key={n}
            type="button"
            onClick={() => setI(index)}
            className={`h-16 w-16 rounded-2xl text-2xl font-semibold ${
              index === i ? 'bg-accent text-white' : index < i ? 'bg-accent-muted' : 'bg-white'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      {i >= 0 && <p className="mt-5 text-2xl">这一轮 n = {nums[i]}，打印 {nums[i]}。</p>}
      {i < 2 && <Next onClick={() => setI((n) => n + 1)}>{i < 0 ? '取出第一个' : '取出下一个'}</Next>}
    </div>
  );
}

function ForStop() {
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">先选序列，再运行</h2>
      <p className="mt-4 text-xl text-text-secondary">range(起点, 终点) 包含起点，不包含终点。</p>
    </div>
  );
}

function ForStep() {
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">第三个参数是步长</h2>
      <p className="mt-4 text-2xl">range(0, 6, 2) → 0、2、4</p>
      <p className="mt-3 text-xl text-text-secondary">从 0 出发，每次加 2，遇到 6 就停，6 不包含。</p>
      <p className="mt-4 text-xl text-text-secondary">只写 range(3)，起点默认是 0，得到 0、1、2。</p>
    </div>
  );
}

function ForString() {
  const chars = ['曲', '师'];
  const [i, setI] = useState(-1);
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">字符串也能被依次取出</h2>
      <p className="mt-3 text-xl text-text-secondary">for ch in word 每次取出一个字符。这里还没有列表，先用字符串。</p>
      <div className="mt-6 flex gap-3">
        {chars.map((ch, index) => (
          <span
            key={ch}
            className={`flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-semibold ${
              index === i ? 'bg-accent text-white' : 'bg-white'
            }`}
          >
            {ch}
          </span>
        ))}
      </div>
      {i < 1 && <Next onClick={() => setI((n) => n + 1)}>{i < 0 ? '取出第一个字' : '取出下一个字'}</Next>}
      {i >= 0 && <p className="mt-4 text-2xl">ch = {chars[i]}</p>}
    </div>
  );
}

function ForPractice() {
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">打印 2、4、6</h2>
      <p className="mt-4 text-xl text-text-secondary">用 for 和 range。每个数字一行。终点不要写成 6。</p>
    </div>
  );
}

const SUM_ROWS = [
  ['开始', 'total = 0', '还没有加任何数'],
  ['n = 1', 'total = 0 + 1', 'total 变成 1'],
  ['n = 2', 'total = 1 + 2', 'total 变成 3'],
  ['n = 3', 'total = 3 + 3', 'total 变成 6'],
  ['结束', 'print(total)', '打印 6'],
];

function AccPattern() {
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">三步</h2>
      <ol className="mt-6 space-y-3 text-2xl">
        <li className="rounded-2xl bg-white px-5 py-3">1. 循环前：total = 0</li>
        <li className="rounded-2xl bg-white px-5 py-3">2. 循环中：total = total + n</li>
        <li className="rounded-2xl bg-white px-5 py-3">3. 循环后：print(total)</li>
      </ol>
    </div>
  );
}

function AccTrace({ sceneId }: { sceneId: string }) {
  const advance = useStageAdvance(sceneId, SUM_ROWS.length);
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">1 + 2 + 3</h2>
      <div className="mt-5 space-y-3">
        {SUM_ROWS.slice(0, advance.phase).map((row) => (
          <div key={row[0]} className="grid grid-cols-3 gap-2 rounded-2xl bg-white px-4 py-3 text-lg">
            {row.map((cell) => (
              <span key={cell}>{cell}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function AccReset() {
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">每轮都把 total 清成 0</h2>
      <p className="mt-4 text-xl leading-relaxed text-text-secondary">
        total = 0 写在循环里面。n 为 1 时 total 变成 1，n 为 2 时又从 0 加起，最后只剩下 3。
      </p>
      <p className="mt-6 text-2xl font-semibold">初值放在循环前面，更新放在循环里面。</p>
    </div>
  );
}

function AccCount() {
  const text = 'aabbc';
  const [i, setI] = useState(0);
  const count = text.slice(0, i).split('').filter((ch) => ch === 'a').length;
  const ch = text[i];
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">计数也是累加</h2>
      <p className="mt-2 font-mono text-3xl tracking-[0.3em]">{text}</p>
      <p className="mt-4 text-2xl">
        已看 {i} 个字，count = {count}
        {ch ? `，下一个是 ${ch}` : '，统计结束'}
      </p>
      {ch && (
        <Next onClick={() => setI((n) => n + 1)}>{ch === 'a' ? `「${ch}」要计数` : `「${ch}」跳过`}</Next>
      )}
      {i === text.length && <p className="mt-4 text-xl font-semibold text-accent">aabbc 里有 2 个 a。</p>}
    </div>
  );
}

function AccPractice() {
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">数一数「曲」</h2>
      <p className="mt-4 text-xl text-text-secondary">「曲师大曲师」里有几个「曲」？最后只打印这个整数。</p>
    </div>
  );
}

function JumpBreak() {
  const items = ['香蕉皮', '过期药品', '易拉罐'];
  const [i, setI] = useState(0);
  const stopped = i > 1;
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">break 离开整个循环</h2>
      <div className="mt-5 flex gap-3">
        {items.map((item, index) => (
          <span
            key={item}
            className={`rounded-2xl px-4 py-3 text-xl ${
              index < i ? 'bg-accent-muted' : index === 1 && stopped ? 'bg-error/15' : 'bg-white'
            }`}
          >
            {item}
          </span>
        ))}
      </div>
      {!stopped && <Next onClick={() => setI((n) => n + 1)}>{i === 0 ? '分拣香蕉皮' : '遇到过期药品'}</Next>}
      {i === 1 && !stopped && <p className="mt-4 text-xl">打印「香蕉皮」。</p>}
      {stopped && (
        <p className="mt-5 text-xl font-semibold">
          打印停止分拣。易拉罐不再处理，循环结束。
        </p>
      )}
    </div>
  );
}

function JumpContinue() {
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">continue 只跳过本轮</h2>
      <p className="mt-4 text-2xl">1、2、4、5</p>
      <p className="mt-3 text-xl text-text-secondary">n 等于 3 时，continue 后面的 print 不执行，循环回到 range 取下一个数。</p>
    </div>
  );
}

function JumpPlace() {
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">continue 写晚了</h2>
      <p className="mt-4 text-xl leading-relaxed text-text-secondary">
        print 在 continue 前面。1 到 5 都会先打印，continue 后面已经没有语句，所以它不起作用。
      </p>
      <p className="mt-6 text-2xl font-semibold">要跳过的语句，必须写在 continue 后面。</p>
    </div>
  );
}

function JumpPractice() {
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">停在 5，跳过偶数</h2>
      <p className="mt-4 text-xl text-text-secondary">range(1, 8)。遇到 5 停止，偶数不打印。应当只看到 1 和 3。</p>
    </div>
  );
}

function NestGrid({ sceneId }: { sceneId: string }) {
  const advance = useStageAdvance(sceneId, 6);
  const cells = [
    [1, 1],
    [1, 2],
    [1, 3],
    [2, 1],
    [2, 2],
    [2, 3],
  ];
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">两行三列</h2>
      <p className="mt-2 text-lg text-text-secondary">外层换行时，内层从第 1 列重新走。</p>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {cells.map(([row, col], index) => (
          <div
            key={`${row}-${col}`}
            className={`rounded-2xl px-4 py-6 text-center text-2xl ${
              index < advance.phase ? 'bg-accent text-white' : 'bg-white'
            }`}
          >
            {row} 行 {col} 列
          </div>
        ))}
      </div>
    </div>
  );
}

function NestTrace() {
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">内层走完，外层才进一步</h2>
      <p className="mt-4 text-xl leading-relaxed text-text-secondary">
        row 先取 1。col 依次取 1、2、3，打印三行。然后 row 取 2，col 再从 1 走到 3。一共 6 行。
      </p>
    </div>
  );
}

function NestPractice() {
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">左下三角</h2>
      <pre className="mt-4 rounded-3xl bg-white p-5 text-xl leading-relaxed">{'1×1=1\n2×1=2  2×2=4\n3×1=3  3×2=6  3×3=9'}</pre>
      <p className="mt-4 text-xl text-text-secondary">内层的终点跟着外层的 i 变，并且要比 i 大 1。</p>
    </div>
  );
}

function CloseValues() {
  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col">
      <p className="text-center text-3xl font-semibold">循环能跑完，结果就一定对吗？</p>
      <div className="mt-6 grid flex-1 grid-cols-3 gap-4">
        {[
          ['忘记更新', '条件一直成立', '程序停不下来'],
          ['初值位置', '每轮把结果清零', '只剩下最后一轮'],
          ['终点写法', 'range 含头不含尾', '少算或多算一次'],
        ].map(([title, mid, end]) => (
          <div key={title} className="rounded-3xl border border-classroom-border bg-white px-4 py-6 text-center">
            <p className="text-2xl font-semibold">{title}</p>
            <p className="mt-4 text-lg text-text-secondary">{mid}</p>
            <p className="my-2 text-xl text-text-secondary">↓</p>
            <p className="text-xl font-semibold">{end}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 border-t border-classroom-border py-4 text-center text-2xl font-semibold">重复的次数，也是一种责任</p>
    </div>
  );
}

function CloseSummary() {
  const keys = [
    '循环分开「做什么」和「做多少次」',
    'while：先判断条件，成立才执行循环体',
    '循环体要让条件有机会变成 False',
    'for 依次取出序列中的每一项',
    'range(起点, 终点, 步长)：含起点，不含终点',
    '累加和计数：初值在循环前，更新在循环中',
    'break 离开循环，continue 跳过本轮剩余语句',
    '嵌套时，外层每走一轮，内层都要走完',
  ];
  return (
    <div className="flex h-full flex-col justify-center">
      <p className="text-center text-3xl font-semibold">循环结构</p>
      <ul className="mx-auto mt-8 max-w-3xl space-y-3">
        {keys.map((line) => (
          <li key={line} className="rounded-2xl bg-white px-5 py-3 text-xl">
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Thanks() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="relative px-14 py-12">
        <div className="pointer-events-none absolute inset-0 border border-accent/35" />
        <div className="pointer-events-none absolute inset-2 border border-accent/15" />
        <h2 className="font-display text-6xl tracking-[0.55em] text-[#1B3A6B]" style={{ writingMode: 'vertical-rl' }}>
          谢谢大家
        </h2>
      </div>
    </div>
  );
}

export function LoopPathStage({ content, sceneId }: Props) {
  const { topic, mode } = content;
  if (topic === 'why') {
    if (mode === 'copy') return <WhyCopy />;
    if (mode === 'count') return <WhyCount />;
    if (mode === 'parts') return <WhyParts />;
  }
  if (topic === 'while') {
    if (mode === 'syntax') return <WhileSyntax />;
    if (mode === 'trace') return <WhileTrace sceneId={sceneId} />;
    if (mode === 'infinite') return <WhileInfinite />;
    if (mode === 'practice') return <WhilePractice />;
  }
  if (topic === 'for') {
    if (mode === 'meet') return <ForMeet />;
    if (mode === 'range') return <ForRange />;
    if (mode === 'stop') return <ForStop />;
    if (mode === 'step') return <ForStep />;
    if (mode === 'string') return <ForString />;
    if (mode === 'practice') return <ForPractice />;
  }
  if (topic === 'acc') {
    if (mode === 'pattern') return <AccPattern />;
    if (mode === 'trace') return <AccTrace sceneId={sceneId} />;
    if (mode === 'reset') return <AccReset />;
    if (mode === 'count') return <AccCount />;
    if (mode === 'practice') return <AccPractice />;
  }
  if (topic === 'jump') {
    if (mode === 'break') return <JumpBreak />;
    if (mode === 'continue') return <JumpContinue />;
    if (mode === 'place') return <JumpPlace />;
    if (mode === 'practice') return <JumpPractice />;
  }
  if (topic === 'nest') {
    if (mode === 'grid') return <NestGrid sceneId={sceneId} />;
    if (mode === 'trace') return <NestTrace />;
    if (mode === 'practice') return <NestPractice />;
  }
  if (topic === 'close') {
    if (mode === 'values') return <CloseValues />;
    if (mode === 'summary') return <CloseSummary />;
    if (mode === 'homework') return null;
    if (mode === 'thanks') return <Thanks />;
  }
  return null;
}
