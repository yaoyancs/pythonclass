import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const GAP = `product = "橙汁"
price = 5
balance = 10
if balance < price:
    print("余额不足，请先充值")
print("感谢使用，欢迎下次光临")`;

const DUAL = `product = "橙汁"
price = 5
balance = 1
if balance >= price:
    print("付款成功")
    print("开始出货")
else:
    print("余额不足，无法购买")`;

export const scenes: DraftScene[] = [
  {
    id: "vend-dual-gap",
    title: "单分支的缺口",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: {
      vendPath: {
        mode: "guide",
        title: "条件不成立时没有对应语句",
        question: "balance 为 10 时，程序是否输出购买结果？",
        options: [
          { id: "none", label: "不输出。只执行语句块之后的语句", correct: true },
          { id: "vend", label: "输出「付款成功」", correct: false },
        ],
        okText: "单分支在条件为 False 时跳过语句块，且没有另一条分支。需要在条件不成立时执行另一语句块，使用 else。",
        badText: "左侧没有 else，也没有「付款成功」。条件不成立时，该 if 不产生输出。",
      },
    },
    code: code(GAP),
  },
  {
    id: "vend-dual-paths",
    title: "if...else",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { vendPath: { mode: "paths" } },
    code: code(DUAL),
  },
  {
    id: "vend-dual-practice",
    title: "随堂练习",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      vendPath: {
        mode: "guide",
        title: "随堂练习：双分支",
        conclusion: "score >= 60 时打印「及格」，否则打印「不及格」。两条路径只执行一条。自验：score = 45；score = 80。",
      },
    },
    code: code(`score = 45
`),
    hints: [
      { level: 1, text: "条件用 score >= 60。成立与不成立各有一个语句块。" },
      { level: 2, text: "if 与 else 对齐。两条 print 各自缩进在对应语句块内。" },
      {
        level: 3,
        text: 'if score >= 60:\n    print("及格")\nelse:\n    print("不及格")',
      },
    ],
    reveal: {
      title: "对照",
      body: "score 为 45 走 else，为 80 走 if。两个语句块不会同时执行。",
    },
  },
];
