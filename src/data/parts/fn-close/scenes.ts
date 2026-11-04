import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 课堂练习、要点、课后作业。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-close-pipeline",
    title: "多个函数协作",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "用多个函数分解任务",
      body: "将过滤、统计和报告拆成三个函数。每个函数只完成一项功能，数据通过参数和返回值传递。",
      flowDiagram: [
        "clean_scores(过滤有效成绩)",
        "calc_stats(计算均值与最高分)",
        "make_report(生成文字报告)",
      ],
    },
    code: code(`def clean_scores(raw):
    return [s for s in raw if 0 <= s <= 100]

def calc_stats(scores):
    return sum(scores) / len(scores), max(scores)

def make_report(name, raw):
    valid = clean_scores(raw)
    avg, top = calc_stats(valid)
    return f"{name}: 有效{len(valid)}人, 平均{avg:.1f}, 最高{top}"

print(make_report("一班", [80, 90, -5, 100]))`),
  },
  {
    id: "fn-close-practice",
    title: "练习：票价",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      body: "定义 ticket_total(count, price=180)，返回 count * price。先输出 count 为 3 且使用默认 price 的结果，再输出 count 为 2、price 为 200 的结果。",
    },
    code: code(`def ticket_total(count, price=180):
    return count * price
`),
    hints: [
      { level: 1, text: "使用默认 price 时不必传入第二个实参。" },
      { level: 2, text: "第二行调用写成 ticket_total(2, 200) 或 ticket_total(2, price=200)。" },
      {
        level: 3,
        text: "print(ticket_total(3))\nprint(ticket_total(2, 200))",
      },
    ],
    reveal: {
      title: "对照",
      body: "3 × 180 是 540。2 × 200 是 400。",
    },
    expectedOutput: `540
400`,
  },
  {
    id: "fn-close-points",
    title: "本讲要点",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "函数",
      bulletPoints: [
        "def 创建函数并绑定名字，调用时才执行函数体",
        "位置参数按顺序传；默认参数可省略；关键字参数按名字传，且写在位置参数后面",
        "return 返回结果；多个值构成一个元组；没有 return 时返回值为 None",
        "不加括号保存的是函数，加括号才调用",
        "函数可以赋给变量，也可以作为字典的值",
      ],
    },
  },
  {
    id: "fn-close-homework",
    title: "课后作业",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "课后作业",
      bulletPoints: [],
    },
  },
];
