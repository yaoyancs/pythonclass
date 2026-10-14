import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const SINGLE = `product = "橙汁"
price = 5
balance = 1
print(f"您选择了：{product}")
if balance < price:
    print("余额不足，请先充值")
print("感谢使用，欢迎下次光临")`;

export const scenes: DraftScene[] = [
  {
    id: "vend-if-syntax",
    title: "if 语句",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: {
      vendPath: {
        mode: "guide",
        title: "if 语句的三个部分",
        rows: [
          { name: "条件", detail: 'balance < price' },
          { name: "冒号", detail: "条件之后的 :" },
          { name: "语句块", detail: "缩进的 print" },
        ],
        conclusion: "条件为 True 时执行语句块。条件为 False 时跳过语句块，其后未缩进的语句继续执行。",
      },
    },
    code: code(SINGLE),
  },
  {
    id: "vend-if-trace",
    title: "执行语句块",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { vendPath: { mode: "trace" } },
    code: code(SINGLE),
  },
  {
    id: "vend-if-indent",
    title: "缩进",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: {
      vendPath: {
        mode: "guide",
        title: "缩进划定语句块",
        question: "若将 print(\"感谢使用，欢迎下次光临\") 缩进到 if 内，balance 为 10 时它还会执行吗？",
        options: [
          { id: "no", label: "不会。它成为该语句块的一部分", correct: true },
          { id: "yes", label: "会。它写在 if 之后", correct: false },
        ],
        okText: "缩进决定语句是否属于该 if。条件为 False 时，整个语句块被跳过。",
        badText: "先看这条 print 与 if 是否对齐。缩进后，它不再是语句块之后的语句。",
      },
    },
    code: code(SINGLE),
  },
];
