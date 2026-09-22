import type { DraftScene } from "../../../types/scene";

/** 本 part：制造类型冲突（飞花令下一轮）；不讲完转换（留给 type-cast）。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-tw-01",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "看起来很合理的程序",
      body: "飞花令要进入下一轮：当前轮次加 1。上讲预告的「年龄 + 1」是同一类写法。",
      question: "若用户输入 2，你期望下一轮是几？",
      codeComparison: {
        left: {
          label: "自然语言想法",
          code: "读入当前轮次\n下一轮 = 轮次 + 1\n打印下一轮",
        },
        right: {
          label: "Python 写法",
          code: 'round_no = input("现在是第几轮：")\nnext_round = round_no + 1\nprint("下一轮是第", next_round, "轮")',
        },
      },
    },
  },
  {
    id: "scene-tw-02",
    type: "run",
    layout: "split",
    content: {
      headline: "运行后发生了什么",
      body: "先预测，再运行。输入 2 时：会得到 3，还是报错，还是别的结果？",
      question: "错误信息或奇怪结果，在提示什么？",
    },
    code: {
      initial:
        'round_no = input("现在是第几轮：")\nnext_round = round_no + 1\nprint("下一轮是第", next_round, "轮")',
      editable: false,
      resetToInitial: true,
    },
  },
  {
    id: "scene-tw-03",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "冲突不在「加减」，在类型",
      body: "input() 得到的是文字，即使你键入的是 2。",
      bulletPoints: [
        "看起来像数字 ≠ 程序里已经是数值",
        "文字不能按「下一轮」的规则去加",
        "诗句、轮次、得分看起来都能写进变量，但不是一类东西",
        "本讲先学会认类型；如何转换，后面专门解决",
      ],
      preview: "下一节：值、类型、字面量，以及 type()",
    },
  },
];
