import type { DraftScene } from "../../../types/scene";

/** 本 part：制造类型冲突；不讲完转换（留给 type-cast）。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-tw-01",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "看起来很合理的程序",
      body: "接上讲收束：想根据输入年龄，算出「明年多少岁」。",
      question: "若用户输入 2，你期望输出什么？",
      codeComparison: {
        left: {
          label: "自然语言想法",
          code: "读入年龄\n明年 = 年龄 + 1\n打印明年",
        },
        right: {
          label: "Python 写法",
          code: 'age = input("请输入年龄：")\nnext_year = age + 1\nprint("明年你", next_year, "岁")',
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
        'age = input("请输入年龄：")\nnext_year = age + 1\nprint("明年你", next_year, "岁")',
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
        "文字不能直接按「加一岁」的规则去加",
        "本讲先学会认类型；如何转换，后面专门解决",
      ],
      preview: "下一节：值、类型、字面量，以及 type()",
    },
  },
];
