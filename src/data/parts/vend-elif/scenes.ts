import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const ELIF = `code = "A2"
if code == "A1":
    product = "橙汁"
    price = 5
elif code == "A2":
    product = "矿泉水"
    price = 2
elif code == "A3":
    product = "咖啡"
    price = 8
else:
    product = "未知商品"
    price = 0
print(product, price)`;

const ORDER = `code = "A3"
if True:
    product = "橙汁"
    price = 5
elif code == "A3":
    product = "咖啡"
    price = 8
else:
    product = "未知商品"
    price = 0
print(product, price)`;

const ONLY_TWO = `code = "A2"
if code == "A1":
    product = "橙汁"
    price = 5
else:
    product = "其他商品"
    price = 0
print(product, price)`;

export const scenes: DraftScene[] = [
  {
    id: "vend-elif-intro",
    title: "双分支不够用",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      vendPath: {
        mode: "guide",
        title: "有些场景，双分支不够用",
        question: "商品编号有 A1、A2、A3 三种。code 为 \"A2\" 时，这段 if...else 能给出矿泉水的价格吗？",
        options: [
          { id: "no", label: "不能。else 把 A2、A3 和其他编号并成一种情况", correct: true },
          { id: "yes", label: "能。else 会按编号分别定价", correct: false },
        ],
        okText: "双分支只有两个语句块。取值多于两种、且每种要执行不同语句时，使用多分支。",
        badText: "左侧的 else 不判断 code 是 A2 还是 A3，两种编号进入同一个语句块。",
      },
    },
    code: code(ONLY_TWO),
  },
  {
    id: "vend-elif-run",
    title: "if...elif...else",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      vendPath: {
        mode: "guide",
        title: "多个分支只执行一个",
        question: "code 的值为 \"A2\" 时，A1 与 A3 的语句块是否执行？",
        options: [
          { id: "no", label: "不执行。只执行第一个值为 True 的分支", correct: true },
          { id: "all", label: "都执行。每个条件都会判断", correct: false },
        ],
        okText: "多分支自上而下求值。第一个值为 True 的分支执行后，其余分支不再判断。else 处理前面条件都不成立的情况。",
        badText: "先看 A1 的条件。它为 False 后才判断 A2。A2 为 True，A3 不再求值。",
      },
    },
    code: code(ELIF),
  },
  {
    id: "vend-elif-order",
    title: "判断顺序",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      vendPath: {
        mode: "guide",
        title: "先成立的条件会截住后续分支",
        question: "第一个条件为 True 时，elif code == \"A3\" 还会求值吗？",
        options: [
          { id: "no", label: "不会。该分支已被跳过", correct: true },
          { id: "yes", label: "会。code 确实等于 A3", correct: false },
        ],
        okText: "判断顺序决定被选中的分支。前面的条件一旦为 True，后面即使也为 True，对应语句块也不执行。",
        badText: "运行左侧。输出的是橙汁而不是咖啡，说明 A3 的分支没有执行。",
      },
    },
    code: code(ORDER),
  },
  {
    id: "vend-drone",
    title: "例子2：无人机避障",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { branchContest: { mode: "drone" } },
    code: code(`distance = 1
if distance <= 5:
    print("减速并监测")
elif distance <= 2:
    print("紧急停止")
else:
    print("继续前进")
print("本次避障决策完成，继续执行后续任务。")`),
  },
  {
    id: "vend-elif-practice",
    title: "随堂练习",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      vendPath: {
        mode: "guide",
        title: "随堂练习：多分支",
        conclusion: "空气质量指数 aqi 不超过 50 打印「优」，不超过 100 打印「良」，不超过 150 打印「轻度污染」，否则打印「需要防护」。更严格的上界写在前面。自验：aqi = 40；aqi = 80；aqi = 120；aqi = 180。",
      },
    },
    code: code(`aqi = 40
`),
    hints: [
      { level: 1, text: "四个结果：优、良、轻度污染、需要防护。前三个用 if、elif、elif，最后一个用 else。" },
      { level: 2, text: "上界从小到大写：先 <= 50，再 <= 100，再 <= 150。" },
      {
        level: 3,
        text: 'if aqi <= 50:\n    print("优")\nelif aqi <= 100:\n    print("良")\nelif aqi <= 150:\n    print("轻度污染")\nelse:\n    print("需要防护")',
      },
    ],
    reveal: {
      title: "对照",
      body: "40 为优，80 为良，120 为轻度污染，180 为需要防护。若把 <= 150 写在最前，80 也会进入轻度污染。",
    },
  },
];
