import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 形参、位置实参、实参个数。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-param-bind",
    title: "形参与实参",
    type: "run",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`def each(total, count):
    print(round(total / count, 2))

each(20, 4)`),
    expectedOutput: "5.0",
  },
  {
    id: "fn-param-pos",
    title: "位置对应",
    type: "run",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`def each(total, count):
    print(round(total / count, 2))

each(4, 20)
each(20, 4)`),
    expectedOutput: `0.2
5.0`,
  },
  {
    id: "fn-param-missing",
    title: "实参个数",
    type: "debug",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`def each(total, count):
    print(round(total / count, 2))

each(20)`),
    hints: [
      { level: 1, text: "TypeError: each() missing 1 required positional argument: 'count'" },
      { level: 2, text: "调用写成 each(20, 4)。" },
      {
        level: 3,
        text: `def each(total, count):
    print(round(total / count, 2))

each(20, 4)`,
      },
    ],
    reveal: {
      title: "无默认值的形参各需要一个实参",
      body: "each 有 total 和 count，调用只写了 20。",
    },
    expectedOutput: "5.0",
  },
  {
    id: "fn-param-practice",
    title: "练习：each",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`def each(total, count):
    pass

each(20, 4)
each(30, 5)`),
    hints: [
      { level: 1, text: "print(round(total / count, 2))" },
      { level: 2, text: "两次调用不要改。" },
      {
        level: 3,
        text: `def each(total, count):
    print(round(total / count, 2))

each(20, 4)
each(30, 5)`,
      },
    ],
    reveal: {
      title: "同一函数，两组位置实参",
      body: "20/4 得 5.0，30/5 得 6.0。",
    },
    expectedOutput: `5.0
6.0`,
  },
];
