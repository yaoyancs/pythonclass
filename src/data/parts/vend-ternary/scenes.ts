import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

export const scenes: DraftScene[] = [
  {
    id: "vend-ternary-run",
    title: "条件表达式",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      vendPath: {
        mode: "guide",
        title: "按条件选择一个值",
        question: "这行赋值执行的是语句块，还是在求一个值？",
        options: [
          { id: "value", label: "在求一个值，并赋给 message", correct: true },
          { id: "block", label: "在执行两个语句块中的一个", correct: false },
        ],
        okText: "条件表达式根据条件选择一个值，不构成语句块。将 balance 改为 10，message 的值随之改变。",
        badText: "看赋值号右侧。if 与 else 两侧各是一个字符串，不是 print 语句。",
      },
    },
    code: code(`product = "橙汁"
price = 5
balance = 1
message = "可以购买" if balance >= price else "余额不足"
print(message)`),
  },
];
