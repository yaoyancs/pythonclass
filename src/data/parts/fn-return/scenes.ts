import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 有返回值、print 与 return 的冲突、多个值是元组、提前 return。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-return-one",
    title: "返回一个值",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "return 将结果返回调用方",
      bulletPoints: ["调用表达式的值即返回值", "返回值可继续参与运算"],
    },
    code: code(`def average(scores):
    return sum(scores) / len(scores)

print(average([80, 90, 70]))
print(average([80, 90, 70]) + 5)`),
  },
  {
    id: "fn-return-print-predict",
    title: "预测：无 return 的返回值",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "赋值得到的是返回值还是 None？",
      image: {
        src: "/lesson08/fn-return.svg",
        alt: "print 只写到屏幕，调用方得到 None；return 才能继续计算",
      },
    },
    code: code(`def average(scores):
    print(sum(scores) / len(scores))

a = average([80, 90, 70])
print("返回值:", a)`),
    prediction: {
      question: "运行后第二行打印的是什么？",
      options: [
        { id: "eighty", label: "返回值: 80.0" },
        { id: "none", label: "返回值: None", isCorrect: true },
        { id: "error", label: "报错，因为没有 return" },
      ],
    },
    reveal: {
      title: "没有 return 时，返回值是 None",
      body: "print 的输出不是返回值。未写 return 时，a 为 None。",
    },
  },
  {
    id: "fn-return-none-debug",
    title: "调试：None 不能继续计算",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "将 print 替换为 return",
      compareTable: {
        leftHeader: "写法",
        rightHeader: "调用方拿到",
        rows: [
          { left: "print(均分)", right: "None" },
          { left: "return 均分", right: "80.0" },
        ],
      },
    },
    code: code(`def average(scores):
    print(sum(scores) / len(scores))

a = average([80, 90, 70])
b = average([75, 85, 95])
print("两班总均分:", (a + b) / 2)`),
    hints: [
      { level: 1, text: "报错信息含 NoneType。a 和 b 都是 None。" },
      { level: 2, text: "print 给人看；return 把结果交回程序。" },
      {
        level: 3,
        text: `def average(scores):
    return sum(scores) / len(scores)

a = average([80, 90, 70])
b = average([75, 85, 95])
print("两班总均分:", (a + b) / 2)`,
      },
    ],
    reveal: {
      title: "对照",
      body: "a 是 80.0，b 是 85.0，总均分是 82.5。屏幕上看见数字，不等于调用方拿到了这个数字。",
    },
    expectedOutput: "两班总均分: 82.5",
  },
  {
    id: "fn-return-early",
    title: "预测：return 后的控制流",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "return 之后的语句是否执行？",
    },
    code: code(`def average(scores):
    avg = sum(scores) / len(scores)
    return avg
    print("这行还会执行吗")

print(average([80, 90, 70]))`),
    prediction: {
      question: "运行后会打印哪些内容？",
      options: [
        { id: "both", label: "先 80.0，再「这行还会执行吗」" },
        { id: "only-avg", label: "只有 80.0", isCorrect: true },
        { id: "only-line", label: "只有「这行还会执行吗」" },
      ],
    },
    reveal: {
      title: "return 立即结束函数",
      body: "执行 return avg 后，函数把 80.0 交回调用方，函数体中其后的语句不再执行。外层 print 打印的是返回值。",
    },
  },
  {
    id: "fn-return-empty",
    title: "提前返回",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "非法输入时提前返回",
      bulletPoints: ["有效成绩为空则返回 0", "避免除数为零"],
    },
    code: code(`def average(scores):
    valid = []
    for s in scores:
        if 0 <= s <= 100:
            valid.append(s)
    if len(valid) == 0:
        return 0
    return sum(valid) / len(valid)

print(average([-3, 101]))
print(average([80, -1, 90]))`),
  },
  {
    id: "fn-return-many",
    title: "返回多个值",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "多返回值打包为元组",
      flowDiagram: [
        "return 最低, 最高, 平均",
        "low, high, avg = min_max_avg(scores)",
      ],
    },
    code: code(`def min_max_avg(scores):
    return min(scores), max(scores), sum(scores) / len(scores)

scores = [90, 78, 95, 88]
print(min_max_avg(scores))
low, high, avg = min_max_avg(scores)
print(low, high, avg)`),
  },
  {
    id: "fn-return-practice",
    title: "练习：及格统计",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "定义多返回值函数",
      bulletPoints: [
        "pass_stat(scores, line=60)",
        "解包后同一行 print",
      ],
    },
    code: code(`scores = [55, 60, 90, 72]

`),
    hints: [
      { level: 1, text: "先数 score >= line 的个数，最高分用 max(scores)。" },
      { level: 2, text: "return passed, top，再写成 n, high = pass_stat(scores)。" },
      {
        level: 3,
        text: `def pass_stat(scores, line=60):
    passed = 0
    for s in scores:
        if s >= line:
            passed += 1
    return passed, max(scores)

scores = [55, 60, 90, 72]
n, high = pass_stat(scores)
print(n, high)`,
      },
    ],
    reveal: {
      title: "对照",
      body: "60、90、72 及格，共 3 人；最高分 90。默认参数 line=60，调用时不必再传分数线。",
    },
    expectedOutput: "3 90",
  },
];
