import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 不能改元组本身；可以改元组里那个列表的内容；不能把列表换成别的对象。 */
export const scenes: DraftScene[] = [
  {
    id: "tuple-limit-assign",
    title: "不能修改元组内容",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "不可以修改元组的内容",
      body: "直接改某一项会报 TypeError。删掉赋值那一行，再打印元组。",
    },
    code: code(`t1 = (1, 2, 3)
t1[0] = 5
print(t1)`),
    hints: [
      { level: 1, text: "tuple 不支持按下标赋值。" },
      { level: 2, text: "报错信息是 TypeError: 'tuple' object does not support item assignment。" },
      { level: 3, text: "删掉 t1[0] = 5，只保留 print(t1)。" },
    ],
    reveal: {
      title: "对照",
      body: "元组一旦定义完成，就不能替换其中某一项。打印出来仍是 (1, 2, 3)。",
    },
    expectedOutput: "(1, 2, 3)",
  },
  {
    id: "tuple-limit-inner",
    title: "可以修改内部的列表",
    type: "run",
    layout: "split",
    content: {
      headline: "可以修改元组内的 list",
      flowDiagram: ["t1[2][1] = 'best'"],
      body: "元组里如果放了一个列表，可以修改这个列表的元素，也可以对它增加、删除。改的是列表，不是元组的某一项。",
      bulletPoints: ["t1[2][1] = 'best' 之后，元组仍是三项"],
    },
    code: code(`t1 = (1, 2, ["itheima", "itcast"])
t1[2][1] = "best"
print(t1)`),
  },
  {
    id: "tuple-limit-replace",
    title: "不能替换内部的列表",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "不可以把 list 换成其它对象",
      body: "把第 3 项整个换成另一个列表，仍然是在修改元组。删掉这行赋值，改为修改列表内部，再打印。",
    },
    code: code(`t1 = (1, 2, ["itheima", "itcast"])
t1[2] = [1, 2, 3]
print(t1)`),
    hints: [
      { level: 1, text: "替换某一项，和 t1[0] = 5 是同一种错误。" },
      { level: 2, text: "要改的是列表里面的元素，先取出 t1[2]。" },
      { level: 3, text: "t1[2][1] = \"best\"\nprint(t1)" },
    ],
    reveal: {
      title: "对照",
      body: "元组的第 3 项仍然是原来那个列表，只是列表里的第二项变成了 best。",
    },
    expectedOutput: "(1, 2, ['itheima', 'best'])",
  },
];
