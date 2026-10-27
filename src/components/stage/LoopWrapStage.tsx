import type { LoopWrapContent } from '../../types/scene';

function Title({ children }: { children: string }) {
  return <h2 className="title-stage text-center text-3xl text-text-primary">{children}</h2>;
}

function Arrow() {
  return <p className="py-0.5 text-center text-lg leading-none text-accent">↓</p>;
}

function Pill({ children }: { children: string }) {
  return (
    <div className="mx-auto w-fit rounded-full border-2 border-accent bg-accent-muted px-4 py-1.5 text-center text-base font-semibold">
      {children}
    </div>
  );
}

function Box({ children }: { children: string }) {
  return (
    <div className="rounded-2xl border border-classroom-border bg-white px-3 py-2 text-center text-base leading-snug">
      {children}
    </div>
  );
}

function Diamond({ text, yes, no }: { text: string; yes: string; no: string }) {
  return (
    <div className="mx-auto w-full max-w-[16rem]">
      <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-1 rotate-45 rounded-md border-2 border-accent bg-white" />
        <p className="relative z-10 whitespace-pre-line px-1 text-center text-sm font-semibold leading-tight">{text}</p>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-center text-sm">
        <p className="rounded-xl bg-accent-muted px-2 py-1.5 leading-snug">
          <span className="font-semibold text-accent">是</span>　{yes}
        </p>
        <p className="rounded-xl bg-white px-2 py-1.5 leading-snug">
          <span className="font-semibold text-accent">否</span>　{no}
        </p>
      </div>
    </div>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="mt-3 overflow-x-auto rounded-2xl bg-code-bg px-5 py-4 font-mono text-lg leading-relaxed text-code-text">
      {children}
    </pre>
  );
}

function Overview() {
  const rows = [
    ['顺序结构', '按照先后顺序执行操作', '依次做什么？'],
    ['分支结构', '根据条件选择不同的操作', '满足什么条件？'],
    ['循环结构', '按照一定规则重复执行操作', '重复多少次？'],
  ];
  return (
    <div className="flex h-full flex-col justify-center">
      <Title>程序的三种基本结构</Title>
      <p className="mt-3 text-center text-xl text-text-secondary">再复杂的程序，也可以拆成这三种控制结构。</p>
      <ul className="mx-auto mt-8 w-full max-w-4xl space-y-3">
        {rows.map(([name, what, ask]) => (
          <li key={name} className="grid grid-cols-[8rem_1fr_10rem] items-center gap-4 rounded-2xl bg-white px-5 py-4">
            <span className="text-xl font-semibold text-accent">{name}</span>
            <span className="text-xl">{what}</span>
            <span className="text-right text-lg font-semibold text-text-secondary">{ask}</span>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-center text-2xl font-semibold">三种结构可以组合，共同构成完整程序。</p>
    </div>
  );
}

function Flows() {
  return (
    <div className="flex h-full flex-col">
      <Title>三种结构的流程图</Title>
      <div className="mt-4 grid min-h-0 flex-1 grid-cols-3 gap-4">
        <div className="flex flex-col rounded-3xl border border-classroom-border bg-classroom-playground/60 px-3 py-4">
          <h3 className="text-center text-xl font-semibold text-accent">顺序结构</h3>
          <div className="mt-3 space-y-0">
            <Pill>开始</Pill>
            <Arrow />
            <Box>输入原价</Box>
            <Arrow />
            <Box>输入折扣</Box>
            <Arrow />
            <Box>计算应付金额</Box>
            <Arrow />
            <Box>输出结果</Box>
            <Arrow />
            <Pill>结束</Pill>
          </div>
          <p className="mt-auto pt-4 text-center text-base text-text-secondary">从上到下，依次执行</p>
        </div>
        <div className="flex flex-col rounded-3xl border border-classroom-border bg-classroom-playground/60 px-3 py-4">
          <h3 className="text-center text-xl font-semibold text-accent">分支结构</h3>
          <div className="mt-3 space-y-0">
            <Pill>开始</Pill>
            <Arrow />
            <Box>读入成绩 score</Box>
            <Arrow />
            <Diamond text={'score\n≥ 60?'} yes="输出：合格" no="输出：不合格" />
            <Arrow />
            <Pill>结束</Pill>
          </div>
          <p className="mt-auto pt-4 text-center text-base text-text-secondary">按条件选择一条路径</p>
        </div>
        <div className="flex flex-col rounded-3xl border border-classroom-border bg-classroom-playground/60 px-3 py-4">
          <h3 className="text-center text-xl font-semibold text-accent">循环结构</h3>
          <div className="mt-3 space-y-0">
            <Pill>开始</Pill>
            <Arrow />
            <Box>初始化（如 i = 1）</Box>
            <Arrow />
            <Diamond text={'条件\n成立?'} yes="执行循环体" no="离开循环" />
            <Arrow />
            <Box>更新状态（如 i += 1）</Box>
            <p className="py-1 text-center text-base font-semibold text-accent">↑ 回到条件判断</p>
            <Pill>结束</Pill>
          </div>
          <p className="mt-auto pt-2 text-center text-base text-text-secondary">条件成立就重复执行</p>
        </div>
      </div>
    </div>
  );
}

function Sequence() {
  return (
    <div className="mx-auto flex h-full w-full max-w-4xl flex-col justify-center">
      <Title>顺序结构：按步骤解决问题</Title>
      <p className="mt-3 text-center text-xl text-text-secondary">程序按语句先后顺序，从上到下依次执行。</p>
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <p className="text-lg font-semibold text-accent">示例：计算折后价</p>
          <Code>{`price = float(input())
rate = float(input())
money = price * rate
print(money)`}</Code>
        </div>
        <div>
          <p className="text-lg font-semibold text-accent">执行过程</p>
          <ul className="mt-3 space-y-3">
            {['输入商品原价和折扣', '计算实际支付金额', '输出计算结果'].map((line) => (
              <li key={line} className="rounded-2xl bg-white px-4 py-3 text-xl">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 rounded-2xl bg-white px-5 py-4">
        <p className="text-lg font-semibold text-accent">关键认识：赋值不是等式</p>
        <Code>{`x = 10
x = x + 5
print(x)   # 15`}</Code>
        <p className="mt-3 text-lg text-text-secondary">右边先算出结果，再保存到左边的变量。</p>
      </div>
    </div>
  );
}

function Branch() {
  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col justify-center">
      <Title>分支结构：根据条件作出选择</Title>
      <p className="mt-3 text-center text-xl text-text-secondary">现实任务常有多条路线，程序按条件只走其中一条。</p>
      <div className="mt-5 grid grid-cols-2 gap-6">
        <div>
          <p className="text-lg font-semibold text-accent">示例：是否合格</p>
          <Code>{`score = int(input())
if score >= 60:
    print("合格")
else:
    print("不合格")`}</Code>
        </div>
        <div>
          <p className="text-lg font-semibold text-accent">三种常见形式</p>
          <ul className="mt-3 space-y-3">
            {[
              ['单分支', 'if 条件：满足才执行'],
              ['双分支', 'if … else：二选一'],
              ['多分支', 'if … elif … else：多选一'],
            ].map(([name, line]) => (
              <li key={name} className="rounded-2xl bg-white px-4 py-3 text-xl">
                <span className="font-semibold text-accent">{name}</span>
                <span className="text-text-secondary">　{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function BranchKey() {
  const rows = [
    ['比较运算符', '>  <  >=  <=  ==  !=', '判断数量关系'],
    ['逻辑运算符', 'and  or  not', '组合多个条件'],
    ['if / elif / else', '选择执行路径', '覆盖不同情况'],
    ['分支嵌套', '分支里再写分支', '处理多层判断'],
  ];
  return (
    <div className="mx-auto flex h-full w-full max-w-4xl flex-col justify-center">
      <Title>分支结构：核心知识与思维</Title>
      <table className="mt-6 w-full border-collapse text-left text-xl">
        <thead>
          <tr className="border-b border-classroom-border text-text-secondary">
            <th className="py-3 pr-4 font-semibold">知识点</th>
            <th className="py-3 pr-4 font-semibold">写法</th>
            <th className="py-3 font-semibold">作用</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b, c]) => (
            <tr key={a} className="border-b border-classroom-border/60">
              <td className="py-3 pr-4 font-semibold text-accent">{a}</td>
              <td className="py-3 pr-4 font-mono text-lg">{b}</td>
              <td className="py-3">{c}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-8 grid grid-cols-3 gap-4">
        {['条件写得准不准？', '分支有没有遗漏？', '边界有没有重叠？'].map((line) => (
          <p key={line} className="rounded-2xl bg-white px-4 py-5 text-center text-xl font-semibold">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function Loop() {
  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col justify-center">
      <Title>循环结构：解决重复性问题</Title>
      <p className="mt-3 text-center text-xl text-text-secondary">按规律重复处理数据，避免把同样的语句写很多遍。</p>
      <div className="mt-5 grid grid-cols-2 gap-6">
        <div>
          <p className="text-lg font-semibold text-accent">示例：统计 1～100 中偶数个数</p>
          <Code>{`count = 0
for i in range(1, 101):
    if i % 2 == 0:
        count += 1
print(count)`}</Code>
          <p className="mt-3 text-lg text-text-secondary">循环遍历 + 分支筛选，两种结构常一起用。</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-accent">for 与 while</p>
          <table className="mt-3 w-full border-collapse text-left text-lg">
            <thead>
              <tr className="border-b border-classroom-border text-text-secondary">
                <th className="py-2 pr-3 font-semibold"> </th>
                <th className="py-2 pr-3 font-semibold">for</th>
                <th className="py-2 font-semibold">while</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['特点', '遍历可迭代对象', '条件为真就继续'],
                ['场景', '范围明确的重复', '次数事先不确定'],
                ['关键', 'range()', '条件与状态更新'],
                ['易错', '边界写错', '忘记更新导致死循环'],
              ].map(([a, b, c]) => (
                <tr key={a} className="border-b border-classroom-border/60">
                  <td className="py-2 pr-3 font-semibold text-accent">{a}</td>
                  <td className="py-2 pr-3">{b}</td>
                  <td className="py-2">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function LoopModel() {
  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col justify-center">
      <Title>循环控制与常见任务模型</Title>
      <div className="mt-5 grid grid-cols-2 gap-6">
        <div>
          <p className="text-lg font-semibold text-accent">break、continue 与 else</p>
          <Code>{`# break：结束当前这一层循环
# continue：跳过本次剩余语句
# for / while 的 else：没有 break 才执行
for x in [1, 3, 5, 9]:
    if x == 7:
        print("找到了")
        break
else:
    print("没有找到")`}</Code>
        </div>
        <div>
          <p className="text-lg font-semibold text-accent">常见任务模型</p>
          <ul className="mt-3 space-y-2">
            {[
              ['枚举', '逐个遍历，寻找符合条件的数'],
              ['累加', 'total += x，计算总量'],
              ['计数', 'count += 1，统计数量'],
              ['最值', '比较并更新最大值 / 最小值'],
              ['查找', '找到后可用 break 提前结束'],
              ['嵌套', '外层一轮，内层完整走完'],
            ].map(([name, line]) => (
              <li key={name} className="rounded-2xl bg-white px-4 py-2.5 text-lg">
                <span className="font-semibold text-accent">{name}</span>
                <span className="text-text-secondary">　{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Combine() {
  const steps = [
    ['1. 顺序', '完成一件确定的事', '输入整数，输出平方'],
    ['2. 顺序 + 分支', '按条件决定怎么做', '偶数输出平方，奇数输出立方'],
    ['3. 顺序 + 循环', '重复完成同类任务', '输出 1～100 每个数的平方'],
    ['4. 三者结合', '完整解决复杂问题', '只对偶数求平方，并统计个数'],
  ];
  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col justify-center">
      <Title>三种结构如何组合</Title>
      <p className="mt-2 text-center text-xl text-text-secondary">顺序、分支、循环不是互相排斥的程序类型，而是可以组合的工具。</p>
      <div className="mt-5 grid grid-cols-2 gap-4">
        {steps.map(([title, idea, eg]) => (
          <div key={title} className="rounded-2xl bg-white px-5 py-4">
            <p className="text-xl font-semibold text-accent">{title}</p>
            <p className="mt-2 text-lg">{idea}</p>
            <p className="mt-1 text-base text-text-secondary">{eg}</p>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <p className="text-lg font-semibold text-accent">三者同时出现的例子</p>
        <Code>{`n = int(input())
count = 0
for i in range(1, n + 1):
    if i % 2 == 0:
        print(i * i)
        count += 1
print(count)`}</Code>
        <p className="mt-3 text-lg text-text-secondary">
          顺序构成基本过程；分支改变路径；循环改变次数。
        </p>
      </div>
    </div>
  );
}

function Choose() {
  const steps = [
    ['1', '是否只需执行确定的几个步骤？', '是 → 顺序结构'],
    ['2', '是否要根据条件选择不同处理？', '是 → 引入分支'],
    ['3', '是否有操作需要重复执行？', '是 → 引入循环'],
    ['4', '重复中是否还要判断或再次重复？', '是 → 嵌套分支 / 循环'],
  ];
  return (
    <div className="mx-auto flex h-full w-full max-w-4xl flex-col justify-center">
      <Title>如何根据问题选择结构？</Title>
      <ol className="mt-8 space-y-4">
        {steps.map(([index, ask, ans]) => (
          <li key={index} className="grid grid-cols-[3rem_1fr_12rem] items-center gap-4 rounded-2xl bg-white px-5 py-4">
            <span className="text-2xl font-semibold text-accent">{index}</span>
            <span className="text-xl">{ask}</span>
            <span className="text-right text-lg font-semibold text-text-secondary">{ans}</span>
          </li>
        ))}
      </ol>
      <p className="mt-8 text-center text-xl text-text-secondary">
        同一问题可能有多种写法。还要比较可读性、规模与效率。
      </p>
    </div>
  );
}

function Quality() {
  return (
    <div className="mx-auto flex h-full w-full max-w-4xl flex-col justify-center">
      <Title>从程序正确性到算法效率</Title>
      <div className="mt-8 grid grid-cols-2 gap-6">
        <div className="rounded-3xl border border-classroom-border bg-white px-6 py-8">
          <p className="text-2xl font-semibold text-accent">第一层</p>
          <p className="mt-3 text-2xl font-semibold">程序能否正确解决问题？</p>
          <ul className="mt-6 space-y-3 text-xl text-text-secondary">
            <li>输入、输出是否符合题意</li>
            <li>变量如何变化</li>
            <li>判断条件是否准确</li>
            <li>循环何时结束</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-classroom-border bg-white px-6 py-8">
          <p className="text-2xl font-semibold text-accent">第二层</p>
          <p className="mt-3 text-2xl font-semibold">方法是否合理、高效？</p>
          <ul className="mt-6 space-y-3 text-xl text-text-secondary">
            <li>是否有更简洁的算法</li>
            <li>枚举范围能否缩小</li>
            <li>同样用 for，效率也可能不同</li>
            <li>正确之后，再谈优化</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Table() {
  const rows = [
    ['核心问题', '做什么，顺序是什么？', '满足什么条件，走哪条路？', '重复什么，何时停止？'],
    ['关键语法', '赋值、表达式、输入输出', 'if / elif / else', 'for / while'],
    ['执行特点', '依次执行', '选择执行', '重复执行'],
    ['关键思维', '分解步骤', '分类讨论', '寻找重复规律'],
    ['典型错误', '操作顺序不当', '条件重叠或遗漏', '边界错误、死循环'],
  ];
  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col justify-center">
      <Title>三种基本结构知识体系</Title>
      <table className="mt-6 w-full border-collapse text-left text-lg">
        <thead>
          <tr className="border-b border-classroom-border text-text-secondary">
            <th className="py-3 pr-3 font-semibold">维度</th>
            <th className="py-3 pr-3 font-semibold">顺序</th>
            <th className="py-3 pr-3 font-semibold">分支</th>
            <th className="py-3 font-semibold">循环</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b, c, d]) => (
            <tr key={a} className="border-b border-classroom-border/60 align-top">
              <td className="py-3 pr-3 font-semibold text-accent">{a}</td>
              <td className="py-3 pr-3">{b}</td>
              <td className="py-3 pr-3">{c}</td>
              <td className="py-3">{d}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Goals() {
  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col justify-center">
      <Title>三个问题贯穿程序设计</Title>
      <div className="mt-6 grid grid-cols-3 gap-4">
        {[
          ['顺序', '先做什么，再做什么？', '把任务拆成步骤'],
          ['分支', '什么情况下做什么？', '分析条件、分类处理'],
          ['循环', '什么要重复，到何时？', '找规律、设计算法'],
        ].map(([name, ask, skill]) => (
          <div key={name} className="rounded-3xl bg-white px-5 py-6 text-center">
            <p className="text-2xl font-semibold text-accent">{name}</p>
            <p className="mt-4 text-xl font-semibold">{ask}</p>
            <p className="mt-3 text-lg text-text-secondary">{skill}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-3xl border border-classroom-border bg-classroom-playground/60 px-6 py-5">
        <p className="text-lg font-semibold text-accent">学习目标的三层</p>
        <ol className="mt-3 space-y-2 text-xl">
          <li>
            <span className="font-semibold">1. 读懂执行过程</span>
            <span className="text-text-secondary">　变量怎么变、条件怎么判、循环怎么走</span>
          </li>
          <li>
            <span className="font-semibold">2. 把问题写成程序</span>
            <span className="text-text-secondary">　识别步骤、条件与重复，组织代码</span>
          </li>
          <li>
            <span className="font-semibold">3. 评价并改进方案</span>
            <span className="text-text-secondary">　比较简洁性、可读性与效率</span>
          </li>
        </ol>
      </div>
      <p className="mt-6 text-center text-2xl font-semibold">
        程序设计：把现实问题转化为有序操作、明确条件和可重复规则。
      </p>
    </div>
  );
}

export function LoopWrapStage({ content }: { content: LoopWrapContent }) {
  switch (content.mode) {
    case 'overview':
      return <Overview />;
    case 'flows':
      return <Flows />;
    case 'sequence':
      return <Sequence />;
    case 'branch':
      return <Branch />;
    case 'branchKey':
      return <BranchKey />;
    case 'loop':
      return <Loop />;
    case 'loopModel':
      return <LoopModel />;
    case 'combine':
      return <Combine />;
    case 'choose':
      return <Choose />;
    case 'quality':
      return <Quality />;
    case 'table':
      return <Table />;
    case 'goals':
      return <Goals />;
    default:
      return null;
  }
}
