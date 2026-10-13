import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const COUNT =
  'n = 1\nwhile n <= 3:\n    print(n)\n    n = n + 1\nprint("结束")';

/** while：先判断，成立才执行；循环体里必须让条件有机会变成 False。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-while-syntax",
    title: "while 语句",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "while", mode: "syntax" } },
    code: code(COUNT),
  },
  {
    id: "scene-while-trace",
    title: "走一遍",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "while", mode: "trace" } },
    code: code(COUNT),
  },
  {
    id: "scene-while-infinite",
    title: "条件一直成立",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "while", mode: "infinite" } },
    code: code('n = 1\nwhile n <= 3:\n    print(n)\nprint("结束")'),
  },
  {
    id: "scene-while-practice",
    title: "随堂练习",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "while", mode: "practice" } },
    code: code("# 用 while 打印 1 2 3，每个数字一行\n# 循环结束后再打印「结束」\n"),
    hints: [
      { level: 1, text: "准备一个会变化的数，条件写成「还没超过 3」。" },
      { level: 2, text: "循环体里先打印，再把这个数加 1。「结束」不要缩进。" },
      { level: 3, text: 'n = 1\nwhile n <= 3:\n    print(n)\n    n = n + 1\nprint("结束")' },
    ],
    reveal: {
      title: "对照",
      body: "输出四行：1、2、3、结束。若没有 n = n + 1，条件会一直成立。",
    },
  },
];
