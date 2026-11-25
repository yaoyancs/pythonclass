import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const PINGS = `pings = [42, 18, 25, 31, 95, 22]`;

/** 星号语法扩展：赋值收集与容器构造。前面两页是没有星号时个数必须对齐。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-unpack-assign",
    title: "普通解包",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-unpack-assign.svg",
        alt: "解包赋值：return len, min, max 返回元组 (6, 18, 95)，按位置交给 n、low、high",
      },
    },
    code: code(`# 测速要同时告诉你：测了几次、最快多少、最慢多少。
# 函数一次返回这三个数，调用处用三个变量接住。
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
    title: "解包个数不一致",
    type: "debug",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`# 函数交回 3 个数，左边只准备 2 个变量，多出来的数没有地方放。
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
      body: "左边只有两个名字，第三个值没有去处。下一页用星号接住剩下的元素。",
    },
    expectedOutput: "6 18",
  },
  {
    id: "fn-ext-assign",
    title: "星号收集剩余元素",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: { starFlow: { kind: "assign" } },
    code: code("a, *b, c = [10, 20, 30, 40, 50]\nprint(a, b, c)"),
    expectedOutput: "10 [20, 30, 40] 50",
  },
  {
    id: "fn-unpack-practice",
    title: "拆开日志",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`# 日志按时间顺序排成列表，至少有两条。
# 定义 split_log(lines)，用星号赋值拆成：第一条、中间剩下的每条、最后一条。
# 中间可以一条都没有。返回这三个结果。

def split_log(lines):
    pass

print(split_log(["开机", "登录", "浏览", "退出"]))
print(split_log(["开始", "结束"]))`),
    hints: [
      { level: 1, text: "第一条, *中间, 最后一条 = lines。两条日志时，中间是空列表。" },
      { level: 2, text: "return 这三个名字。星号接住的是列表，不是元组。" },
      {
        level: 3,
        text: `def split_log(lines):
    first, *middle, last = lines
    return first, middle, last

print(split_log(["开机", "登录", "浏览", "退出"]))
print(split_log(["开始", "结束"]))`,
      },
    ],
    reveal: {
      title: "星号接住中间剩下的日志",
      body: "四条日志的中间是两条。只有首尾两条时，中间是空列表 []，不会报错。",
    },
    expectedOutput: `('开机', ['登录', '浏览'], '退出')
('开始', [], '结束')`,
  },
  {
    id: "fn-ext-nest",
    title: "容器构造中的星号",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: { starFlow: { kind: "nest" } },
    code: code("a = [1, 2, 3]\nb = [4, 5, 6]\n\nprint([a, b])\nprint([*a, *b])"),
    expectedOutput: "[[1, 2, 3], [4, 5, 6]]\n[1, 2, 3, 4, 5, 6]",
  },
  {
    id: "fn-ext-dict",
    title: "字典构造中的双星号",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: { starFlow: { kind: "dictmerge" } },
    code: code("a = {\"color\": \"blue\", \"size\": 16}\nb = {\"size\": 20, \"bold\": True}\n\nprint({**a, **b})"),
    expectedOutput: "{'color': 'blue', 'size': 20, 'bold': True}",
  },
  {
    id: "fn-ext-quiz",
    title: "课堂互动",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: { starFlow: { kind: "extquiz" } },
    code: code("a, *b = [10]\nprint(b)"),
    expectedOutput: "[]",
  },
  {
    id: "fn-ext-syntax",
    title: "星号语法全景",
    type: "explain",
    layout: "fullscreen",
    content: {
      syntaxMap: {
        root: "星号",
        branches: [
          { title: "定义 *", code: `def f(*args): ...`, notes: ["位置参数收成元组"] },
          { title: "定义 **", code: `def f(**kwargs): ...`, notes: ["关键字参数收成字典"] },
          { title: "调用 *", code: `f(*nums)`, notes: ["展开为位置参数"] },
          { title: "调用 **", code: `f(**data)`, notes: ["展开为关键字参数"] },
          { title: "赋值 *", code: `a, *b, c = nums`, notes: ["剩余元素收成列表"] },
          { title: "构造", code: `[*a, *b]\n{**a, **b}`, notes: ["列表展开元素", "字典合并键值，后写的覆盖"] },
        ],
      },
    },
  },
];
