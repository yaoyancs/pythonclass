import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const PINGS = `pings = [42, 18, 25, 31, 95, 22]`;

/** 解包赋值、个数不一致、星号接收不定长、调用处 * 与 ** 展开。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-unpack-assign",
    title: "解包赋值",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-unpack-assign.svg",
        alt: "解包赋值：return len, min, max 返回元组 (6, 18, 95)，按位置交给 n、low、high",
      },
    },
    code: code(`# return a, b, c 返回元组，调用处可直接解包到多个变量
${PINGS}

def ping_summary(pings):
    return len(pings), min(pings), max(pings)

n, low, high = ping_summary(pings)
print(n)
print(low)
print(high)`),
    expectedOutput: `6
18
95`,
  },
  {
    id: "fn-unpack-mismatch",
    title: "解包个数不确定怎么办？",
    type: "debug",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`# 只想要个数和最小值，左边只写两个变量
${PINGS}

def ping_summary(pings):
    return len(pings), min(pings), max(pings)

n, low = ping_summary(pings)
print(n, low)`),
    hints: [
      { level: 1, text: "ValueError: too many values to unpack (expected 2, got 3)" },
      { level: 2, text: "元组里有 3 个值，左边也要写 3 个变量：n, low, high = ping_summary(pings)" },
      {
        level: 3,
        text: `pings = [42, 18, 25, 31, 95, 22]

def ping_summary(pings):
    return len(pings), min(pings), max(pings)

n, low, high = ping_summary(pings)
print(n, low)`,
      },
    ],
    reveal: {
      title: "左边变量个数必须与元素个数一致",
      body: "ping_summary 返回 3 个值，左边只有 n 和 low 两个变量，多出的 1 个值没有去处。元素个数不固定时，用下一页的星号接收。",
    },
    expectedOutput: "6 18",
  },
  {
    id: "fn-unpack-return",
    title: "星号接收不定长元素",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-unpack-return.svg",
        alt: "星号解包：fastest 取第一个 18，slowest 取最后一个 95，*middle 把中间的全部收成列表",
      },
    },
    code: code(`# 元素个数不固定时，用 *middle 接收中间全部元素
${PINGS}

def sorted_pings(pings):
    return tuple(sorted(pings))

fastest, *middle, slowest = sorted_pings(pings)
print("最快:", fastest)
print("中间:", middle)
print("最慢:", slowest)`),
    expectedOutput: `最快: 18
中间: [22, 25, 31, 42]
最慢: 95`,
  },
  {
    id: "fn-unpack-call",
    title: "调用处的 *",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-unpack-call.svg",
        alt: "调用处的 *：*samples 把列表展开成 4 个位置实参，等价于 ping_span(42, 18, 25, 31)",
      },
    },
    code: code(`# 调用处的 * 把列表元素逐个展开为位置实参
def ping_span(*ms):
    return max(ms) - min(ms)

samples = [42, 18, 25, 31]
print(ping_span(42, 18, 25, 31))
print(ping_span(*samples))`),
    expectedOutput: `24
24`,
  },
  {
    id: "fn-unpack-call-dict",
    title: "调用处的 **",
    type: "run",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`# 调用处的 ** 把字典的 键: 值 逐个展开为关键字实参 键=值
def export_image(name, width=1920, fmt="png"):
    print(f"{name}.{fmt} ({width}px)")

options = {"width": 800, "fmt": "webp"}
export_image("avatar", width=800, fmt="webp")
export_image("avatar", **options)`),
    expectedOutput: `avatar.webp (800px)
avatar.webp (800px)`,
  },
  {
    id: "fn-unpack-practice",
    title: "练习：trimmed_avg",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`# 定义 trimmed_avg(pings)
# 1. 对 pings 排序后，用 fastest, *middle, slowest 解包去掉最快和最慢各一次
# 2. 返回 middle 的平均值（保留 1 位小数）
${PINGS}

def trimmed_avg(pings):
    pass

print(trimmed_avg(pings))
print(trimmed_avg([10, 50, 20, 30]))`),
    hints: [
      { level: 1, text: "fastest, *middle, slowest = sorted(pings)" },
      { level: 2, text: "return round(sum(middle) / len(middle), 1)" },
      {
        level: 3,
        text: `pings = [42, 18, 25, 31, 95, 22]

def trimmed_avg(pings):
    fastest, *middle, slowest = sorted(pings)
    return round(sum(middle) / len(middle), 1)

print(trimmed_avg(pings))
print(trimmed_avg([10, 50, 20, 30]))`,
      },
    ],
    reveal: {
      title: "星号解包适配任意长度的采样列表",
      body: "6 个样本去极值剩 4 个均值 30.0，4 个样本去极值剩 2 个均值 25.0。",
    },
    expectedOutput: `30.0
25.0`,
  },
  {
    id: "fn-unpack-syntax",
    title: "语法小结：元组解包",
    type: "explain",
    layout: "fullscreen",
    content: {
      syntaxMap: {
        root: "元组解包",
        branches: [
          {
            title: "解包赋值",
            code: `return a, b, c
n, low, high = f()`,
            notes: ["返回的是元组", "变量个数与元素个数一致"],
          },
          {
            title: "星号接收",
            code: `first, *mid, last = f()`,
            notes: ["*mid 接收中间全部元素", "mid 是列表"],
          },
          {
            title: "调用处的 *",
            code: `f(*[42, 18, 25])`,
            notes: ["列表拆成位置实参"],
          },
          {
            title: "调用处的 **",
            code: `f("avatar", **{"fmt": "webp"})`,
            notes: ["字典拆成关键字实参"],
          },
        ],
      },
    },
  },
];
