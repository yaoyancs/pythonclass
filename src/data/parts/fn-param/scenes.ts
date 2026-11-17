import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 位置参数、默认参数、关键字参数。可变参数本讲不讲。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-param-pos",
    title: "位置参数",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "位置实参按形参顺序绑定",
      image: {
        src: "/lesson08/fn-param.svg",
        alt: "40 绑定 usual，60 绑定 exam，返回 52.0",
      },
      bulletPoints: ["40 → usual", "60 → exam"],
    },
    code: code(`def calc_final(usual, exam):
    return usual * 0.4 + exam * 0.6

print(calc_final(40, 60))
print(calc_final(80, 90))`),
  },
  {
    id: "fn-param-missing",
    title: "调试：实参个数不匹配",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "补齐缺失的位置实参",
    },
    code: code(`def calc_final(usual, exam):
    return usual * 0.4 + exam * 0.6

print(calc_final(80))`),
    hints: [
      { level: 1, text: "报错会提示 missing 1 required positional argument: 'exam'。" },
      { level: 2, text: "第二个实参是期末分。" },
      { level: 3, text: "print(calc_final(80, 90))" },
    ],
    reveal: {
      title: "对照",
      body: "80 × 0.4 + 90 × 0.6 = 86.0。位置实参必须按形参个数配齐，除非后面的形参带有默认值。",
    },
    expectedOutput: "86.0",
  },
  {
    id: "fn-param-default",
    title: "默认参数",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "省略实参时使用默认值",
      compareTable: {
        leftHeader: "调用",
        rightHeader: "exam_weight",
        rows: [
          { left: "calc_final(40, 60)", right: "0.6（默认）" },
          { left: "calc_final(40, 60, 0.7)", right: "0.7（这一次覆盖）" },
        ],
      },
    },
    code: code(`def calc_final(usual, exam, exam_weight=0.6):
    usual_weight = 1 - exam_weight
    return usual * usual_weight + exam * exam_weight

print(calc_final(40, 60))
print(calc_final(40, 60, 0.7))`),
  },
  {
    id: "fn-param-keyword",
    title: "关键字参数",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "关键字实参按形参名绑定",
      bulletPoints: [
        "exam=90 不依赖位置顺序",
        "位置实参须写在关键字实参之前",
      ],
    },
    code: code(`def calc_final(usual, exam, exam_weight=0.6):
    usual_weight = 1 - exam_weight
    return usual * usual_weight + exam * exam_weight

print(calc_final(usual=80, exam=90))
print(calc_final(80, exam=90, exam_weight=0.5))`),
  },
  {
    id: "fn-param-quiz",
    title: "合法调用",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "下列哪一次调用合法？",
    },
    code: code(`def calc_final(usual, exam, exam_weight=0.6):
    usual_weight = 1 - exam_weight
    return usual * usual_weight + exam * exam_weight`),
    prediction: {
      question: "哪一次调用可以正常执行？",
      options: [
        { id: "a", label: "calc_final(80, 90)", isCorrect: true },
        { id: "b", label: "calc_final(usual=80, 90)" },
        { id: "c", label: "calc_final(exam_weight=0.5, 80, 90)" },
        { id: "d", label: "calc_final(, 90)" },
      ],
    },
    reveal: {
      title: "只有符合传参规则的调用合法",
      body: "位置参数在前。关键字不能写在位置参数前面。",
    },
  },
  {
    id: "fn-param-order",
    title: "调试：关键字写在位置参数前面",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "位置实参须位于关键字实参之前",
    },
    code: code(`def calc_final(usual, exam, exam_weight=0.6):
    usual_weight = 1 - exam_weight
    return usual * usual_weight + exam * exam_weight

print(calc_final(exam_weight=0.5, 80, 90))`),
    hints: [
      { level: 1, text: "位置实参 80、90 不能写在关键字实参后面。" },
      { level: 2, text: "可以写成 calc_final(80, 90, exam_weight=0.5)。" },
      { level: 3, text: "print(calc_final(80, 90, exam_weight=0.5))" },
    ],
    reveal: {
      title: "对照",
      body: "80 × 0.5 + 90 × 0.5 = 85.0。规则是：位置实参在前，关键字实参在后。",
    },
    expectedOutput: "85.0",
  },
  {
    id: "fn-param-practice",
    title: "练习：网购结算",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "定义带默认参数的函数",
      bulletPoints: [
        "order_total(amount, shipping=8)",
        "返回金额 + 运费",
        "先 print(99)，再 print(199, 0)",
      ],
    },
    code: code(`# 定义 order_total，再写两行 print

`),
    hints: [
      { level: 1, text: "第二个形参写成 shipping=8。" },
      { level: 2, text: "第一次调用只传 99；第二次传 199 和 0。" },
      {
        level: 3,
        text: `def order_total(amount, shipping=8):
    return amount + shipping

print(order_total(99))
print(order_total(199, 0))`,
      },
    ],
    reveal: {
      title: "对照",
      body: "99 + 8 = 107。满额包邮时运费为 0，199 + 0 = 199。",
    },
    expectedOutput: `107
199`,
  },
];
