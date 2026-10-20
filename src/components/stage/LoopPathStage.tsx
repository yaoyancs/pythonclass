import { useEffect, useState } from 'react';
import { useStageAdvance } from '../../hooks/useStageAdvance';
import { useSceneEngine } from '../../engine/SceneEngine';
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

function Task({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-lg font-semibold text-accent">任务</p>
      <h2 className="title-stage mt-2 text-4xl text-text-primary">{title}</h2>
      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item} className="rounded-2xl bg-white px-5 py-4 text-xl leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function WhyOnce() {
  return (
    <Task
      title="任务：编程实现猜数字大小游戏"
      items={[
        "补全右侧代码",
       
      ]}
    />
  );
}

function WhyUntil() {
  return (
    <Task
      title="未猜中则继续,直到猜中为止"
      items={[
        "右侧程序只比较一次，比较完就结束。",
        "新需求：未猜中则再次读入，直到 guess 与 secret 相等。",
      ]}
    />
  );
}

function WhyLimit() {
  return (
    <Task
      title="连续 10 次未猜中也结束"
      items={[
        "保留「猜中则结束」。",
        "再增加一条：连续 10 次未猜中，也结束。",
        "程序要记住已经猜了几次。",
        "分支结构只能选择路径，不能按次数重复执行。",
      ]}
    />
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

const WHILE_LINES = ['n = 1', 'while n <= 3:', '    print(n)', '    n = n + 1', 'print("结束")'];

const WHILE_STEPS = [
  { line: 0, note: '执行 n = 1', out: '' },
  { line: 1, note: '判断 1 <= 3，结果为 True，进入循环体', out: '' },
  { line: 2, note: '执行 print(n)，输出 1', out: '1' },
  { line: 3, note: '执行 n = n + 1，n 变为 2，回到 while', out: '1' },
  { line: 1, note: '判断 2 <= 3，结果为 True，进入循环体', out: '1' },
  { line: 2, note: '执行 print(n)，输出 2', out: '1\n2' },
  { line: 3, note: '执行 n = n + 1，n 变为 3，回到 while', out: '1\n2' },
  { line: 1, note: '判断 3 <= 3，结果为 True，进入循环体', out: '1\n2' },
  { line: 2, note: '执行 print(n)，输出 3', out: '1\n2\n3' },
  { line: 3, note: '执行 n = n + 1，n 变为 4，回到 while', out: '1\n2\n3' },
  { line: 1, note: '判断 4 <= 3，结果为 False，跳过循环体', out: '1\n2\n3' },
  { line: 4, note: '执行 print("结束")', out: '1\n2\n3\n结束' },
];

function WhileTrace({ sceneId }: { sceneId: string }) {
  const advance = useStageAdvance(sceneId, WHILE_STEPS.length);
  const step = advance.phase === 0 ? null : WHILE_STEPS[advance.phase - 1];
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">while 的执行过程</h2>
      <p className="mt-2 text-lg text-text-secondary">按 → 执行下一条语句。条件为 True 时进入循环体，循环体结束后回到 while。</p>
      <div className="mt-5 grid grid-cols-[1.15fr_0.85fr] gap-6">
        <pre className="rounded-3xl bg-white p-5 font-mono text-2xl leading-loose">
          {WHILE_LINES.map((line, index) => (
            <div
              key={line}
              className={`rounded-lg px-3 transition-colors duration-300 ${
                step?.line === index ? 'bg-accent text-white' : 'text-text-primary'
              }`}
            >
              {line}
            </div>
          ))}
        </pre>
        <div>
          <p className="min-h-16 text-2xl font-semibold leading-snug">
            {step ? step.note : '从 n = 1 开始。'}
          </p>
          <p className="mt-4 text-lg text-text-secondary">输出</p>
          <pre className="mt-2 min-h-36 rounded-3xl bg-white p-5 font-mono text-2xl leading-relaxed">
            {step?.out || ' '}
          </pre>
        </div>
      </div>
    </div>
  );
}

function WhileInfinite() {
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">分析左侧代码运行结果及原因</h2>
    </div>
  );
}

function WhilePractice() {
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">密码验证</h2>
      <p className="mt-4 text-xl leading-relaxed text-text-secondary">
        用户输入密码，如果输，提示重新输入，直到输对为止。
      </p>
    </div>
  );
}

const FLOWER_STEPS = [
  { label: '百位', expr: '153 // 100', value: '1' },
  { label: '十位', expr: '153 // 10 % 10', value: '5' },
  { label: '个位', expr: '153 % 10', value: '3' },
  { label: '立方和', expr: '1³ + 5³ + 3³', value: '153' },
];

function ForFlower({ sceneId }: { sceneId: string }) {
  const advance = useStageAdvance(sceneId, FLOWER_STEPS.length + 1);
  const phase = advance.phase;
  const shown = FLOWER_STEPS.slice(0, Math.min(phase, FLOWER_STEPS.length));
  const ask = phase > FLOWER_STEPS.length;
  return (
    <div>
      <p className="font-mono text-2xl font-semibold text-text-primary">一个三位数，恰好等于它各位数字的立方和</p>
      <div className="mt-5 space-y-2">
        {shown.map((step) => (
          <div key={step.label} className="flex items-center justify-between rounded-2xl bg-white px-5 py-3 text-2xl">
            <span>
              {step.label}　{step.expr}
            </span>
            <span className="font-semibold">{step.value}</span>
          </div>
        ))}
      </div>
      {phase >= FLOWER_STEPS.length && (
        <p className="mt-5 text-2xl font-semibold">1³ + 5³ + 3³ = 153，153 是水仙花数。</p>
      )}
      {ask && (
        <p className="mt-5 text-2xl font-semibold">还有哪些水仙花数？</p>
      )}
      {phase === 0 && <p className="mt-5 text-xl text-text-secondary">以 153 为例 </p>}
    </div>
  );
}

function FlowerActs() {
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">判断一个数是否是水仙花数</h2>
    </div>
  );
}

const WHILE_SCAN = `n = 100
while n <= 999:
    a = n // 100
    b = n // 10 % 10
    c = n % 10
    if a**3 + b**3 + c**3 == n:
        print(n)
    n = n + 1
`;

const FOR_SCAN = `for n in range(100, 1000):
    a = n // 100
    b = n // 10 % 10
    c = n % 10
    if a**3 + b**3 + c**3 == n:
        print(n)
`;

function ForWhile({ sceneId }: { sceneId: string }) {
  const advance = useStageAdvance(sceneId, 1);
  const { dispatch } = useSceneEngine();
  useEffect(() => {
    dispatch({
      type: 'UPDATE_CODE',
      code: advance.phase >= 1 ? WHILE_SCAN : '',
      clearOutput: true,
    });
  }, [advance.phase, dispatch]);
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">怎样找出所有三位水仙花数？</h2>
    </div>
  );
}

function ForMeet() {
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">让 Python 自动依次取数</h2>
      <p className="mt-5 text-xl leading-relaxed">
        我们真正想做的是不断修改 n，还是把 100～999 这些数逐个拿出来检验？
      </p>
      <p className="mt-4 text-xl leading-relaxed">我们要依次检查指定范围内的每一个数。</p>
    </div>
  );
}

const PY_KEYWORDS = new Set(['while', 'for', 'in', 'if', 'else', 'elif', 'and', 'or', 'not']);

function colorTokens(line: string) {
  const parts: { text: string; color: string }[] = [];
  const re = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\b\d+\b|\b[A-Za-z_]\w*\b| +|\S/g;
  for (const match of line.matchAll(re)) {
    const text = match[0];
    let color = '#d4d4d4';
    if (text.startsWith('"') || text.startsWith("'")) color = '#ce9178';
    else if (/^\d+$/.test(text)) color = '#b5cea8';
    else if (PY_KEYWORDS.has(text)) color = '#569cd6';
    else if (text === 'print') color = '#dcdcaa';
    parts.push({ text, color });
  }
  return parts;
}

function ColorCode({ source }: { source: string }) {
  const lines = source.replace(/\n$/, '').split('\n');
  return (
    <div className="mt-2 overflow-hidden rounded-3xl bg-[#12211c] px-4 py-4 font-mono text-lg leading-relaxed">
      {lines.map((line, index) => (
        <div key={`${index}-${line}`} className="flex">
          <span className="w-8 shrink-0 select-none text-right text-[#4f7267]">{index + 1}</span>
          <span className="whitespace-pre pl-4">
            {colorTokens(line).map((token, tokenIndex) => (
              <span key={tokenIndex} style={{ color: token.color }}>
                {token.text}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

function ForContrast() {
  return (
    <div className="flex h-full flex-col">
      <div className="space-y-2">
        <p className="text-2xl">while：条件满足，就继续执行。</p>
        <p className="text-2xl">for：从指定范围中依次取值，逐个处理。</p>
      </div>
      <div className="mt-6 grid min-h-0 flex-1 grid-cols-2 gap-4">
        <div>
          <p className="text-lg text-text-secondary">while</p>
          <ColorCode source={WHILE_SCAN} />
        </div>
        <div>
          <p className="text-lg text-text-secondary">for</p>
          <ColorCode source={FOR_SCAN} />
        </div>
      </div>
    </div>
  );
}

function RangeObserve() {
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">计算机怎样自动取出 100、101、102……999？</h2>
      <ColorCode source={FOR_SCAN} />
      <p className="mt-4 text-2xl font-semibold"> range(100, 1000)</p>
      <ol className="mt-4 space-y-2 text-xl">
        <li className="rounded-2xl bg-white px-5 py-3">100 表示什么？</li>
        <li className="rounded-2xl bg-white px-5 py-3">1000 表示什么？</li>
        <li className="rounded-2xl bg-white px-5 py-3">为什么检查到 999 就停，没有检查 1000？</li>
      </ol>
    </div>
  );
}

function rangeValues(start: number, stop: number, step: number) {
  const values: number[] = [];
  if (step <= 0 || values.length > 24) return values;
  for (let n = start; n < stop && values.length < 16; n += step) values.push(n);
  return values;
}

function RangeExplore() {
  const [start, setStart] = useState(2);
  const [stop, setStop] = useState(7);
  const [step, setStep] = useState(1);
  const [cursor, setCursor] = useState(-1);
  const values = rangeValues(start, stop, step);
  const current = cursor >= 0 && cursor < values.length ? values[cursor] : null;

  function retune(next: { start?: number; stop?: number; step?: number }) {
    setStart(next.start ?? start);
    setStop(next.stop ?? stop);
    setStep(next.step ?? step);
    setCursor(-1);
  }

  return (
    <div>
      <p className="mt-3 font-mono text-2xl">range({start}, {stop}, {step})</p>
      <div className="mt-3 flex flex-wrap gap-4 text-lg">
        <label>start <input className="ml-2 w-16 rounded-lg border px-2 py-1" type="number" value={start} onChange={(e) => retune({ start: Number(e.target.value) })} /></label>
        <label>stop <input className="ml-2 w-16 rounded-lg border px-2 py-1" type="number" value={stop} onChange={(e) => retune({ stop: Number(e.target.value) })} /></label>
        <label>step <input className="ml-2 w-16 rounded-lg border px-2 py-1" type="number" min={1} value={step} onChange={(e) => retune({ step: Math.max(1, Number(e.target.value) || 1) })} /></label>
      </div>
      <div className="mt-4 flex flex-wrap items-end gap-2">
        {values.map((n, index) => (
          <div key={`${n}-${index}`} className={`rounded-2xl px-4 py-3 text-center ${index === cursor ? 'bg-accent text-white' : index < cursor ? 'bg-accent-muted' : 'bg-white'}`}>
            <p className="font-mono text-2xl">{n}</p>
            <p className="text-sm">{index < cursor ? '已取' : index === cursor ? '本次' : '待取'}</p>
          </div>
        ))}
        <div className="rounded-2xl bg-white/60 px-4 py-3 text-center text-text-secondary">
          <p className="font-mono text-2xl">{stop}</p>
          <p className="text-sm">不取</p>
        </div>
      </div>
      <p className="mt-4 text-xl">本次取出的值：{current === null ? '尚未开始' : current}</p>
      <p className="mt-2 text-lg text-text-secondary">从起始值开始，每次加步长，到终止界限之前结束。包含 start，不包含 stop。</p>
      <div className="mt-3 flex gap-6">
        <Next onClick={() => setCursor((n) => Math.min(values.length - 1, n + 1))}>下一步</Next>
        <button type="button" className="mt-6 text-lg text-text-secondary" onClick={() => setCursor(-1)}>重置</button>
      </div>
    </div>
  );
}

const RANGE_FORMS = [
  { title: 'range(stop)', code: 'for i in range(5):\n    print(i)', out: '0 1 2 3 4', note: '只有一个参数时，从 0 开始，步长默认为 1。' },
  { title: 'range(start, stop)', code: 'for i in range(2, 7):\n    print(i)', out: '2 3 4 5 6', note: '指定起始值和终止界限，步长仍默认为 1。' },
  { title: 'range(start, stop, step)', code: 'for i in range(2, 11, 2):\n    print(i)', out: '2 4 6 8 10', note: '第三个参数是步长。这里每次加 2。' },
];

function RangeForms({ sceneId }: { sceneId: string }) {
  const advance = useStageAdvance(sceneId, 3);
  const shown = RANGE_FORMS.slice(0, Math.min(advance.phase + 1, 3));
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">range 的三种写法</h2>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {shown.map((form) => (
          <div key={form.title} className="rounded-3xl bg-white px-4 py-4">
            <p className="font-mono text-lg font-semibold">{form.title}</p>
            <pre className="mt-2 text-base leading-relaxed">{form.code}</pre>
            <p className="mt-2 text-lg">{form.out}</p>
            <p className="mt-2 text-base text-text-secondary">{form.note}</p>
          </div>
        ))}
      </div>
      {advance.phase >= 3 && (
        <div className="mt-4">
          <div className="grid grid-cols-3 gap-2 text-lg">
            <p className="rounded-2xl bg-white px-4 py-3">start 起始值，默认 0</p>
            <p className="rounded-2xl bg-white px-4 py-3">stop 终止界限，不包含，必须写</p>
            <p className="rounded-2xl bg-white px-4 py-3">step 步长，默认 1</p>
          </div>
          <p className="mt-3 text-lg text-text-secondary">range 按这个规律提供整数，for 负责逐个取出。它不是一份列表。</p>
        </div>
      )}
    </div>
  );
}

const RANGE_QUIZ = [
  { prompt: 'range(5) 会依次给出哪些数？', options: ['1、2、3、4、5', '0、1、2、3、4', '0、1、2、3、4、5'], answer: 1 },
  { prompt: 'range(2, 7) 会依次给出哪些数？', options: ['2、3、4、5、6、7', '2、3、4、5、6', '3、4、5、6、7'], answer: 1 },
  { prompt: 'range(100, 1000) 最后一个数是？', options: ['1000', '999', '100'], answer: 1 },
  { prompt: 'range(2, 11, 2) 会依次给出哪些数？', options: ['2、4、6、8、10、12', '2、4、6、8、10', '2、4、6、8'], answer: 1 },
  { prompt: '选学：range(5, 1, -1) 会依次给出哪些数？', options: ['5、4、3、2、1', '5、4、3、2', '4、3、2、1'], answer: 1 },
];

function RangeQuiz() {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const item = RANGE_QUIZ[index]!;
  return (
    <div>
      <p className="text-lg text-text-secondary">第 {index + 1} / {RANGE_QUIZ.length} 题{index === 4 ? ' · 选学' : ''}</p>
      <h2 className="title-stage mt-2 text-3xl text-text-primary">{item.prompt}</h2>
      <div className="mt-5 space-y-3">
        {item.options.map((label, option) => {
          const revealed = picked !== null;
          const correct = option === item.answer;
          const chosen = option === picked;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setPicked(option)}
              className={`block w-full rounded-2xl px-5 py-4 text-left text-xl ${
                revealed && correct ? 'bg-accent text-white' : revealed && chosen ? 'bg-white text-text-secondary' : 'bg-white'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex gap-6">
        <button type="button" className="text-lg text-text-secondary" onClick={() => { setIndex((n) => Math.max(0, n - 1)); setPicked(null); }}>上一题</button>
        <button type="button" className="text-lg font-semibold text-accent" onClick={() => { setIndex((n) => Math.min(RANGE_QUIZ.length - 1, n + 1)); setPicked(null); }}>下一题</button>
      </div>
    </div>
  );
}

const RUN_LINES = ['for i in range(1, 4):', '    print("你好，Python！")'];

const RUN_STEPS = [
  { line: 0, bound: 1, note: '取出整数 1。名字 i 指向它，1 本身不会被改写', out: '' },
  { line: 1, bound: 1, note: 'print 读的是 i 正指向的 1', out: '你好，Python！' },
  { line: 0, bound: 2, note: '又出现整数 2。i 改去指向 2，原来的 1 还在，没有变成 2', out: '你好，Python！' },
  { line: 1, bound: 2, note: 'print 读的是 i 正指向的 2', out: '你好，Python！\n你好，Python！' },
  { line: 0, bound: 3, note: '又出现整数 3。i 改去指向 3，1 和 2 都没有被修改', out: '你好，Python！\n你好，Python！' },
  { line: 1, bound: 3, note: 'print 读的是 i 正指向的 3', out: '你好，Python！\n你好，Python！\n你好，Python！' },
  { line: -1, bound: 3, note: '取值结束。i 仍指向 3，整数 1、2、3 都没有被改过', out: '你好，Python！\n你好，Python！\n你好，Python！' },
];

function ForRun({ sceneId }: { sceneId: string }) {
  const advance = useStageAdvance(sceneId, RUN_STEPS.length);
  const step = advance.phase === 0 ? null : RUN_STEPS[advance.phase - 1];
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">代码在内存里怎样执行</h2>
      <p className="mt-1 text-lg text-text-secondary">按 → 执行下一条。整数不能修改，变的是名字 i 指向哪一个。</p>
      <div className="mt-4 grid grid-cols-[1.05fr_0.95fr] gap-4">
        <pre className="rounded-3xl bg-white p-4 font-mono text-xl leading-loose">
          {RUN_LINES.map((line, index) => (
            <div key={line} className={`rounded-lg px-3 ${step?.line === index ? 'bg-accent text-white' : ''}`}>
              {line}
            </div>
          ))}
        </pre>
        <div>
          <p className="text-lg text-text-secondary">i的变化</p>
          <div className="mt-2 flex gap-3">
            {[1, 2, 3].map((n) => {
              const seen = step != null && step.bound >= n;
              const current = step?.bound === n;
              return (
                <div key={n} className="flex-1 text-center">
                  <div className={`mb-2 rounded-full px-2 py-1 text-sm ${current ? 'bg-accent text-white' : 'text-transparent'}`}>i</div>
                  <div
                    className={`rounded-2xl border-2 border-dashed py-4 font-mono text-3xl ${
                      !seen ? 'border-classroom-border text-transparent' : current ? 'border-accent bg-accent-muted' : 'border-classroom-border opacity-40'
                    }`}
                  >
                    {seen ? n : '·'}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-lg text-text-secondary">输出</p>
          <pre className="mt-2 min-h-24 rounded-2xl bg-white px-4 py-3 text-lg">{step?.out || '尚未输出'}</pre>
        </div>
      </div>
      <p className="mt-3 text-xl">{step ? step.note : '尚未开始'}</p>
    </div>
  );
}

function ForVar() {
  return (
    <div>
      <h2 className="title-stage text-xl text-text-primary">循环变量既可以用于控制每次处理的数据，也可以在只关心重复次数时不参与循环体的计算</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-3xl bg-white px-5 py-4">
          <p className="font-semibold">程序 A · 不使用 i</p>
          <pre className="mt-2 font-mono text-lg leading-relaxed">{'for i in range(3):\n    print("加油！")'}</pre>
          <p className="mt-2">加油！ 加油！ 加油！</p>
        </div>
        <div className="rounded-3xl bg-white px-5 py-4">
          <p className="font-semibold">程序 B · 使用 i</p>
          <pre className="mt-2 font-mono text-lg leading-relaxed">{'for i in range(3):\n    print(i)'}</pre>
          <p className="mt-2">0  1  2</p>
        </div>
      </div>
      <p className="mt-4 text-xl">只关心重复次数时，可以不使用循环变量。习惯写成 for _ in range(3)。</p>
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
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">break 离开它所在的这一层循环</h2>
      <p className="mt-4 text-xl">右侧把上一页的 continue 换成了 break。每一排生成到第 3 座就停，第 4、5、6 座不再打印。</p>
      <p className="mt-3 text-xl">停掉的是内层。外层还在，下一排会重新从第 1 座开始，再到第 3 座离开内层。</p>
      <p className="mt-3 text-xl">continue 只跳过这一座。break 把这一层循环剩下的轮次都丢掉。</p>
    </div>
  );
}

function JumpAisle() {
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">每一排的第 3 座不出售。怎样生成所有可出售的座位编号？</h2>
      <p className="mt-4 text-xl">先确定一排，再看这一排的每个座位。座号是 3 时，continue 跳过这一座，继续生成后面的座位。</p>
      <p className="mt-3 text-xl">这里不能用 break。break 会离开内层循环，这一排第 4、5、6 座也不再生成。</p>
    </div>
  );
}

function JumpCompare({ sceneId }: { sceneId: string }) {
  const advance = useStageAdvance(sceneId, 6);
  const step = advance.phase;
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">同一排，遇到第 3 座</h2>
      <p className="mt-1 text-lg text-text-secondary">按 → 看下一座。绿色是生成的座位，第 3 座两种写法走法不同。</p>
      <div className="mt-5 grid grid-cols-2 gap-4">
        {(['continue', 'break'] as const).map((kind) => (
          <div key={kind} className="rounded-3xl bg-white px-4 py-4">
            <p className="font-mono text-xl font-semibold">{kind}</p>
            <div className="mt-3 grid grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map((seat) => {
                const reached = step >= seat;
                const skipped = kind === 'continue' && seat === 3 && reached;
                const stopped = kind === 'break' && seat >= 3 && step >= 3;
                const sold = reached && !skipped && !stopped;
                return (
                  <div
                    key={seat}
                    className={`rounded-xl py-3 text-center font-mono text-xl ${
                      sold ? 'bg-emerald-600 text-white' : skipped ? 'bg-amber-400 text-white' : stopped && seat === 3 ? 'bg-red-500 text-white' : 'bg-classroom-stage text-text-secondary'
                    }`}
                  >
                    {seat}
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-lg">
              {step === 0
                ? '尚未开始'
                : kind === 'continue'
                  ? '跳过第 3 座，第 4、5、6 座继续生成'
                  : step < 3
                    ? '还没遇到第 3 座'
                    : '在第 3 座离开循环，后面不再看'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function JumpCheck() {
  return (
    <div>
      <p className="text-lg font-semibold text-accent">综合练习</p>
      <h2 className="title-stage mt-2 text-3xl text-text-primary">编写程序，判断用户输入的密码是否同时包含英文字母和数字</h2>
      <ul className="mt-4 space-y-2 text-xl">
        <li className="rounded-2xl bg-white px-5 py-3">abc123、Py2026：符合要求</li>
        <li className="rounded-2xl bg-white px-5 py-3">python、123456：不符合要求</li>
      </ul>
      <p className="mt-4 text-lg text-text-secondary">在右侧编写并运行。只检查组成，不代表真实系统的全部密码要求。</p>
    </div>
  );
}

function JumpClose() {
  const lines = [
    ['while', '密码不对就继续读，直到可以停'],
    ['for', '逐个取出字符串里的字符'],
    ['continue', '跳过本轮剩下的语句，处理下一个'],
    ['break', '结果已经确定，提前离开循环'],
  ];
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">Python 循环</h2>
      <div className="mt-4 space-y-2">
        {lines.map(([name, line]) => (
          <p key={name} className="rounded-2xl bg-white px-5 py-3 text-xl">
            <span className="font-mono font-semibold">{name}</span>　{line}
          </p>
        ))}
      </div>
    </div>
  );
}

function SeatMap({
  highlight,
  doneCount,
}: {
  highlight?: { row: number; seat: number };
  doneCount?: number;
}) {
  return (
    <div>
      <p className="text-center text-lg tracking-[0.4em] text-text-secondary">银幕</p>
      <div className="mx-auto mt-2 h-2 w-2/3 rounded-full bg-text-primary/80" />
      <div className="mt-4 space-y-2">
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="flex items-center gap-2">
            <span className="w-14 text-sm text-text-secondary">第{row}排</span>
            <div className="grid flex-1 grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map((seat) => {
                const index = (row - 1) * 6 + seat;
                const target = highlight?.row === row && highlight.seat === seat;
                const done = doneCount != null && index <= doneCount;
                const current = doneCount != null && index === doneCount;
                return (
                  <div
                    key={seat}
                    className={`rounded-xl py-2 text-center font-mono text-lg ${
                      current ? 'bg-accent text-white' : target || done ? 'bg-emerald-600 text-white' : 'bg-white'
                    }`}
                  >
                    {seat}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NestFind({ sceneId }: { sceneId: string }) {
  const advance = useStageAdvance(sceneId, 2);
  return (
    <div className="flex h-full flex-col">
      <h2 className="title-stage text-3xl text-text-primary">电影票写着第 3 排第 5 座，你怎样找到它？</h2>
      <div className="mt-3 grid min-h-0 flex-1 grid-cols-[0.72fr_1.28fr] gap-4">
        <img src="/lesson04/movie-ticket.jpg" alt="电影票，第3排第5座" className="h-full max-h-[28rem] w-full rounded-3xl object-cover" />
        <img src="/lesson04/cinema-seats.jpg" alt="座位分布图，第3排第5座为绿色" className="h-full max-h-[28rem] w-full rounded-3xl object-cover" />
      </div>
      {advance.phase >= 1 && <p className="mt-3 text-xl">先找到第 3 排，再在这一排找到第 5 座。</p>}
      {advance.phase >= 2 && <p className="mt-2 text-xl">要生成全部座位编号：先确定一排，再依次处理这一排的每一个座位。</p>}
      {advance.phase < 2 && <p className="mt-3 text-lg text-text-secondary">按 → 继续问。</p>}
    </div>
  );
}

function NestRepeat({ sceneId }: { sceneId: string }) {
  const advance = useStageAdvance(sceneId, 3);
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">5 排，每排 6 个座位</h2>
      {advance.phase >= 1 && <p className="mt-4 rounded-2xl bg-white px-5 py-3 text-xl">第一排：依次生成第 1 座到第 6 座。</p>}
      {advance.phase >= 2 && <p className="mt-3 rounded-2xl bg-white px-5 py-3 text-xl">第二排：还是第 1 座到第 6 座，只是排号换成 2。</p>}
      {advance.phase >= 3 && (
        <p className="mt-3 text-xl">已经能用一个 for 生成一排。让「生成一排」再重复 5 次，就是循环嵌套。</p>
      )}
      {advance.phase < 3 && <p className="mt-3 text-lg text-text-secondary">按 → 看下一问。</p>}
    </div>
  );
}

function NestCode() {
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">外层取排号，内层把这一排的座位走完</h2>
      <ul className="mt-4 space-y-2 text-xl">
        <li className="rounded-2xl bg-white px-5 py-3">row 依次取出 1 到 5。</li>
        <li className="rounded-2xl bg-white px-5 py-3">seat 在每一排取出 1 到 6。</li>
        <li className="rounded-2xl bg-white px-5 py-3">外层每换一个排号，内层都重新从 1 走到 6。</li>
      </ul>
      <p className="mt-3 text-lg text-text-secondary">右侧代码可以改，也可以运行。</p>
    </div>
  );
}

function NestGen({ sceneId }: { sceneId: string }) {
  const advance = useStageAdvance(sceneId, 30);
  const count = advance.phase;
  const row = count === 0 ? null : Math.floor((count - 1) / 6) + 1;
  const seat = count === 0 ? null : ((count - 1) % 6) + 1;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h2 className="title-stage text-3xl text-text-primary">座位编号生成器</h2>
        <p className="text-lg text-text-secondary">{count} / 30 个座位</p>
      </div>
      <div className="mt-3">
        <SeatMap doneCount={count} />
      </div>
      <p className="mt-3 text-xl">当前排号：{row ?? '—'}　当前座号：{seat ?? '—'}</p>
      <div className="flex gap-6">
        <Next onClick={() => advance.advance()}>生成下一个座位</Next>
        <button type="button" className="mt-6 text-lg text-text-secondary" onClick={() => advance.reset()}>重置</button>
      </div>
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
    if (mode === 'once') return <WhyOnce />;
    if (mode === 'until') return <WhyUntil />;
    if (mode === 'limit') return <WhyLimit />;
  }
  if (topic === 'while') {
    if (mode === 'syntax') return <WhileSyntax />;
    if (mode === 'trace') return <WhileTrace sceneId={sceneId} />;
    if (mode === 'infinite') return <WhileInfinite />;
    if (mode === 'practice') return <WhilePractice />;
  }
  if (topic === 'for') {
    if (mode === 'flower') return <ForFlower sceneId={sceneId} />;
    if (mode === 'check' || mode === 'judge') return <FlowerActs />;
    if (mode === 'while') return <ForWhile sceneId={sceneId} />;
    if (mode === 'meet') return <ForMeet />;
    if (mode === 'contrast') return <ForContrast />;
    if (mode === 'observe') return <RangeObserve />;
    if (mode === 'explore') return <RangeExplore />;
    if (mode === 'forms') return <RangeForms sceneId={sceneId} />;
    if (mode === 'quiz') return <RangeQuiz />;
    if (mode === 'run') return <ForRun sceneId={sceneId} />;
    if (mode === 'var') return <ForVar />;
  }
  if (topic === 'acc') {
    if (mode === 'pattern') return <AccPattern />;
    if (mode === 'trace') return <AccTrace sceneId={sceneId} />;
    if (mode === 'reset') return <AccReset />;
    if (mode === 'count') return <AccCount />;
    if (mode === 'practice') return <AccPractice />;
  }
  if (topic === 'jump') {
    if (mode === 'aisle') return <JumpAisle />;
    if (mode === 'break') return <JumpBreak />;
    if (mode === 'continue') return <JumpCompare sceneId={sceneId} />;
    if (mode === 'check') return <JumpCheck />;
    if (mode === 'close') return <JumpClose />;
  }
  if (topic === 'nest') {
    if (mode === 'find') return <NestFind sceneId={sceneId} />;
    if (mode === 'repeat') return <NestRepeat sceneId={sceneId} />;
    if (mode === 'code') return <NestCode />;
    if (mode === 'gen') return <NestGen sceneId={sceneId} />;
  }
  if (topic === 'close') {
    if (mode === 'values') return <CloseValues />;
    if (mode === 'summary') return <CloseSummary />;
    if (mode === 'homework') return null;
    if (mode === 'thanks') return <Thanks />;
  }
  return null;
}
