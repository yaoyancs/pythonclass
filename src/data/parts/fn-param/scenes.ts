import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 第三部分：围绕发红包与汇总红包，依次讲透形参/实参、位置参数、默认参数、关键字参数、可变参数 *args。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-param-concept",
    title: "形参与实参：给函数留好输入口",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "定义时写「形参」占位，调用时传「实参」赋值",
      image: {
        src: "/lesson08/rp-param.svg",
        alt: "调用处实参 20、4 按位置绑定到定义处形参 total、count",
      },
      body: "如果把金额 20 和包数 4 写死在函数里面，这个函数就永远只能发一种红包。把变化的数据留成参数，同一个函数就能处理任意金额和包数。",
      bulletPoints: [
        "形式参数（形参）：def 括号里的变量名（如 total, count），相当于红包封面上待填写的空栏",
        "实际参数（实参）：调用括号里传入的具体数值或变量（如 20, 4），在调用瞬间赋给对应形参",
      ],
    },
  },
  {
    id: "fn-param-pos",
    title: "位置参数：按从左到右顺序对应",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "实参按位置依次传给形参，顺序不能颠倒",
      flowDiagram: [
        'send_equal("班长", 20, 4)',
        '  "班长" → sender',
        "  20     → total",
        "  4      → count",
      ],
      body: "位置参数完全依靠书写先后对号入座。一旦把 20 和 4 写反，20 元发 4 包就会变成 4 元发 20 包！",
    },
    code: code(`def send_equal(sender, total, count):
    each = round(total / count, 2)
    print(f"{sender} 发出 {total} 元（{count} 包），每包 {each} 元")

send_equal("班长", 20, 4)
send_equal("团支书", 30, 5)`),
    expectedOutput: `班长 发出 20 元（4 包），每包 5.0 元
团支书 发出 30 元（5 包），每包 6.0 元`,
  },
  {
    id: "fn-param-missing",
    title: "实参个数必须与必填形参一致",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "少传或多传位置实参都会触发 TypeError",
      body: "send_equal 需要 3 个参数，左侧调用时漏掉了红包个数，先运行观察报错提示，再补上发 4 包的实参。",
    },
    code: code(`def send_equal(sender, total, count):
    each = round(total / count, 2)
    print(f"{sender} 发出 {total} 元（{count} 包），每包 {each} 元")

send_equal("班长", 20)`),
    hints: [
      { level: 1, text: "报错提示 missing 1 required positional argument: 'count'（缺少必填的位置参数 count）。" },
      { level: 2, text: "在调用括号末尾补上第 3 个实参 4。" },
      {
        level: 3,
        text: `def send_equal(sender, total, count):
    each = round(total / count, 2)
    print(f"{sender} 发出 {total} 元（{count} 包），每包 {each} 元")

send_equal("班长", 20, 4)`,
      },
    ],
    reveal: {
      title: "没有默认值的形参都是必填项",
      body: "函数头声明了几个无默认值的形参，调用时就必须准确给出几个实参。",
    },
    expectedOutput: "班长 发出 20 元（4 包），每包 5.0 元",
  },
  {
    id: "fn-param-default",
    title: "默认参数：省去每次重复填写常规项",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "形参 = 默认值：不传就用默认，传了就用新值",
      flowDiagram: [
        "send_equal(20)                # 4 包，默认祝福语",
        "send_equal(50, 5)             # 改为 5 包，默认祝福语",
        'send_equal(88, 4, "期末全过") # 全部自定义',
      ],
      body: "发微信红包时，不填祝福语会自动使用「恭喜发财，大吉大利」；4 人宿舍群常发 4 包。把它们设成默认参数，日常调用最省事。",
    },
    code: code(`def send_equal(total, count=4, wish="恭喜发财，大吉大利"):
    each = round(total / count, 2)
    print(f"🧧 [{wish}] 共 {count} 包，每包 {each} 元")

send_equal(20)
send_equal(50, 5)
send_equal(88, 4, "期末全过")`),
    expectedOutput: `🧧 [恭喜发财，大吉大利] 共 4 包，每包 5.0 元
🧧 [恭喜发财，大吉大利] 共 5 包，每包 10.0 元
🧧 [期末全过] 共 4 包，每包 22.0 元`,
  },
  {
    id: "fn-param-def-order",
    title: "默认参数的定义位置规则",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "必填形参必须在左，带默认值的形参在右",
      body: "左侧代码把 count=4 写在了必填参数 total 前面，定义这一行就会直接报语法错误。请调整形参顺序修复它。",
    },
    code: code(`def send_equal(count=4, total, wish="恭喜发财"):
    each = round(total / count, 2)
    print(f"[{wish}] 共 {count} 包，每包 {each} 元")

send_equal(20)`),
    hints: [
      { level: 1, text: "SyntaxError: non-default argument follows default argument（无默认值的参数不能跟在默认参数后面）。" },
      { level: 2, text: "把必填的 total 移到最前面：def send_equal(total, count=4, wish=\"恭喜发财\"):" },
      {
        level: 3,
        text: `def send_equal(total, count=4, wish="恭喜发财"):
    each = round(total / count, 2)
    print(f"[{wish}] 共 {count} 包，每包 {each} 元")

send_equal(20)`,
      },
    ],
    reveal: {
      title: "为什么默认形参必须靠右排？",
      body: "如果允许写成 (count=4, total)，那么调用 send_equal(20) 时，解释器根本无法判断 20 是在改 count 还是在填 total。",
    },
    expectedOutput: "[恭喜发财] 共 4 包，每包 5.0 元",
  },
  {
    id: "fn-param-keyword",
    title: "关键字参数：指名道姓跳过中间默认项",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "调用时写「形参名=实参」，精准修改指定选项",
      body: "室友过生日发 66 元红包，包数想保留默认的 count=4 不变，只改最后的祝福语 wish。用关键字参数无需重抄中间的 4，直接按名字传给 wish！",
      bulletPoints: [
        "按名匹配：关键字参数之间不看先后顺序",
        "高可读性：一眼看清每个数字代表总额还是包数",
      ],
    },
    code: code(`def send_equal(total, count=4, wish="恭喜发财，大吉大利"):
    each = round(total / count, 2)
    print(f"🧧 [{wish}] 共 {count} 包，每包 {each} 元")

# 跳过中间的 count，直接指定 wish
send_equal(66, wish="生日快乐，天天开心")

# 全部用关键字参数时，先后顺序可互换
send_equal(wish="开工大吉", count=5, total=100)`),
    expectedOutput: `🧧 [生日快乐，天天开心] 共 4 包，每包 16.5 元
🧧 [开工大吉] 共 5 包，每包 20.0 元`,
  },
  {
    id: "fn-param-quiz",
    title: "混用规则：位置实参必须在关键字实参之前",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "位置传参先排好，关键字传参跟在后",
      body: "调用同一个函数时可以混用位置参数和关键字参数，但必须遵守「位置在前、关键字在后，且同一形参不能传两次」。",
    },
    code: code(`def send_equal(total, count=4, wish="恭喜发财"):
    print(total, count, wish)`),
    prediction: {
      question: "以下四次调用中，哪一次能够合法运行？",
      options: [
        { id: "a", label: 'send_equal(88, wish="金榜题名")', isCorrect: true },
        { id: "b", label: 'send_equal(wish="金榜题名", 88)' },
        { id: "c", label: "send_equal(88, , \"金榜题名\")" },
        { id: "d", label: "send_equal(88, 4, total=88)" },
      ],
    },
    reveal: {
      title: "先按位置、再按名字，不留空位、不重复赋值",
      body: "B 把位置实参 88 写在了关键字后面（报 SyntaxError）；C 语法上不能用逗号空出位置；D 给 total 传了两次值（报 TypeError）。只有 A 完全合规。",
    },
  },
  {
    id: "fn-param-star",
    title: "可变参数 *args：接收任意数量的红包",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "*形参名 把不定长的位置实参打包成元组",
      flowDiagram: [
        'sum_luck("小明", 3.28, 8.66, 1.06)',
        '  name    → "小明"',
        "  amounts → (3.28, 8.66, 1.06)  # 元组",
      ],
      body: "除夕夜有人抢了 2 个红包，有人抢了 5 个。在形参前加一个星号 *amounts，不管传入几个金额，都会被自动收集成一个元组。",
      bulletPoints: [
        "*args：收集多余位置实参为元组（tuple）",
        "拓展了解：**kwargs 可将多余的「名=值」关键字实参收集为字典（dict）",
      ],
    },
    code: code(`def sum_luck(name, *amounts):
    print("收到元组:", amounts)
    total = round(sum(amounts), 2)
    print(f"{name} 共抢到 {len(amounts)} 包，合计 {total} 元")

sum_luck("小明", 3.28, 8.66)
sum_luck("小红", 1.50, 6.66, 12.80, 0.88)`),
    expectedOutput: `收到元组: (3.28, 8.66)
小明 共抢到 2 包，合计 11.94 元
收到元组: (1.5, 6.66, 12.8, 0.88)
小红 共抢到 4 包，合计 21.84 元`,
  },
  {
    id: "fn-param-practice",
    title: "实战练习：支持默认配置的等额发包函数",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "模块组件 ②：announce_equal(total, count=4, wish=\"恭喜发财\")",
      body: "请编写一个支持默认包数和默认祝福语的普通红包播报函数，并用三种传参方式调用它：",
      bulletPoints: [
        "count 默认值为 4，wish 默认值为 \"恭喜发财\"",
        "算出每包金额 each = round(total / count, 2)",
        "输出格式：[{wish}] {count} 包共 {total} 元，每包 {each} 元",
        "依次调用：① 只传 20；② 传 66 并用关键字改 wish 为 \"生日快乐\"；③ 传 30, 6, \"开工大吉\"",
      ],
    },
    code: code(`# 请定义 announce_equal 函数


# 按题目要求依次调用三次
`),
    hints: [
      { level: 1, text: '函数头写成 def announce_equal(total, count=4, wish="恭喜发财"):' },
      { level: 2, text: '第二次调用跳过 count，写成 announce_equal(66, wish="生日快乐")。' },
      {
        level: 3,
        text: `def announce_equal(total, count=4, wish="恭喜发财"):
    each = round(total / count, 2)
    print(f"[{wish}] {count} 包共 {total} 元，每包 {each} 元")

announce_equal(20)
announce_equal(66, wish="生日快乐")
announce_equal(30, 6, "开工大吉")`,
      },
    ],
    reveal: {
      title: "对照：灵活适配各种发包场景",
      body: "有了默认参数与关键字参数，同一个函数既能一键发起常规 4 人红包，也能按需只改祝福语或包数。",
    },
    expectedOutput: `[恭喜发财] 4 包共 20 元，每包 5.0 元
[生日快乐] 4 包共 66 元，每包 16.5 元
[开工大吉] 6 包共 30 元，每包 5.0 元`,
  },
];
