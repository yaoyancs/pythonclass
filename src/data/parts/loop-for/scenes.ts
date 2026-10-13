import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** for：次数或序列已经明确时，让 range 或字符串依次交出每一项。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-for-meet",
    title: "次数已经明确",
    type: "explain",
    layout: "fullscreen",
    content: { loopPath: { topic: "for", mode: "meet" } },
  },
  {
    id: "scene-for-range",
    title: "range",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "for", mode: "range" } },
    code: code("for n in range(1, 4):\n    print(n)\n"),
  },
  {
    id: "scene-for-stop",
    title: "停在终点之前",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "for", mode: "stop" } },
    code: code("for n in range(1, 4):\n    print(n)\n"),
    prediction: {
      question: "range(1, 4) 会把哪些数交给 n？",
      options: [
        { id: "a", label: "1、2、3、4" },
        { id: "b", label: "1、2、3", isCorrect: true },
        { id: "c", label: "0、1、2、3" },
      ],
    },
    reveal: {
      title: "终点不包含",
      body: "range(起点, 终点) 含起点、不含终点。range(1, 4) 是 1、2、3。",
    },
  },
  {
    id: "scene-for-step",
    title: "步长",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "for", mode: "step" } },
    code: code("for n in range(0, 6, 2):\n    print(n)\n"),
  },
  {
    id: "scene-for-string",
    title: "遍历字符串",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "for", mode: "string" } },
    code: code('word = "曲师"\nfor ch in word:\n    print(ch)\n'),
  },
  {
    id: "scene-for-practice",
    title: "随堂练习",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "for", mode: "practice" } },
    code: code("# 用 for 和 range 打印 2 4 6，每个数字一行\n"),
    hints: [
      { level: 1, text: "三个参数：起点、终点、步长。终点不包含在序列里。" },
      { level: 2, text: "从 2 开始，每次加 2，停在 6 的下一个数之前。" },
      { level: 3, text: "for n in range(2, 7, 2):\n    print(n)" },
    ],
    reveal: {
      title: "对照",
      body: "range(2, 7, 2) 给出 2、4、6。写成 range(2, 6, 2) 会少掉 6。",
    },
  },
];
