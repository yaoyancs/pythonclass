import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 遍历、特点、把有重复的名单收成集合再打印。 */
export const scenes: DraftScene[] = [
  {
    id: "set-walk-for",
    title: "for 遍历",
    type: "run",
    layout: "split",
    content: {
      headline: "集合可以被遍历",
      flowDiagram: ["for name in names:"],
      body: "for 每次绑定一个元素。集合不支持下标，不能用 while 配合下标访问。遍历顺序没有保证。",
      bulletPoints: ["每次迭代得到一个元素", "程序逻辑不应依赖遍历顺序"],
    },
    code: code(`names = {"周杰伦", "林俊杰", "邓紫棋"}
for name in sorted(names):
    print(name)`),
  },
  {
    id: "set-walk-traits",
    title: "集合的特点",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "集合的特点",
      bulletPoints: [
        "元素不重复",
        "没有顺序，不能用下标",
        "可以 add、remove、discard",
        "支持 for 循环",
        "支持 in、&、|、-",
      ],
    },
  },
  {
    id: "set-walk-practice",
    title: "练习：签到去重",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      body: "arrived 含重复元素。构造集合后按字典序输出，每个元素一行。不修改原列表。",
    },
    code: code(`arrived = ["周杰伦", "林俊杰", "周杰伦", "邓紫棋"]
`),
    hints: [
      { level: 1, text: "set(arrived) 得到不重复的姓名。" },
      { level: 2, text: "sorted 后再 for，这样顺序固定。" },
      {
        level: 3,
        text: "for name in sorted(set(arrived)):\n    print(name)",
      },
    ],
    reveal: {
      title: "对照",
      body: "三个不同元素各输出一次。列表中的重复元素未进入集合。",
    },
    expectedOutput: `周杰伦
林俊杰
邓紫棋`,
  },
];
