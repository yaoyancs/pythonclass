import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const SUM = "total = 0\nfor n in range(1, 4):\n    total = total + n\nprint(total)";

/** 累加：循环开始前准备结果，循环体里更新结果，循环结束后再使用。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-acc-pattern",
    title: "结果放在循环外面",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "acc", mode: "pattern" } },
    code: code(SUM),
  },
  {
    id: "scene-acc-trace",
    title: "1+2+3",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "acc", mode: "trace" } },
    code: code(SUM),
  },
  {
    id: "scene-acc-reset",
    title: "初值写进循环里",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "acc", mode: "reset" } },
    code: code("for n in range(1, 4):\n    total = 0\n    total = total + n\nprint(total)"),
  },
  {
    id: "scene-acc-count",
    title: "计数",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "acc", mode: "count" } },
    code: code('text = "aabbc"\ncount = 0\nfor ch in text:\n    if ch == "a":\n        count = count + 1\nprint(count)'),
  },
  {
    id: "scene-acc-practice",
    title: "随堂练习",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "acc", mode: "practice" } },
    code: code('text = "曲师大曲师"\n# 统计「曲」出现的次数，最后只打印这个整数\n'),
    hints: [
      { level: 1, text: "次数从 0 开始，写在 for 的前面。" },
      { level: 2, text: "每见到一个「曲」，次数加 1。print 不要缩进在循环里。" },
      {
        level: 3,
        text: 'text = "曲师大曲师"\ncount = 0\nfor ch in text:\n    if ch == "曲":\n        count = count + 1\nprint(count)',
      },
    ],
    reveal: {
      title: "对照",
      body: "「曲师大曲师」里有 2 个「曲」。若 count = 0 写在循环体内，最后只会剩下 0 或 1。",
    },
  },
];
