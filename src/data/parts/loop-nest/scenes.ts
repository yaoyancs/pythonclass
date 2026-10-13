import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const GRID =
  "for row in range(1, 3):\n    for col in range(1, 4):\n        print(row, col)\n";

/** 嵌套：外层每走一轮，内层都要把自己的序列走完。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-nest-grid",
    title: "外层一轮，内层一轮",
    type: "explain",
    layout: "fullscreen",
    content: { loopPath: { topic: "nest", mode: "grid" } },
  },
  {
    id: "scene-nest-trace",
    title: "两层 for",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "nest", mode: "trace" } },
    code: code(GRID),
  },
  {
    id: "scene-nest-practice",
    title: "随堂练习",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "nest", mode: "practice" } },
    code: code("# 打印九九乘法表中 1×1 到 3×3 的左下三角\n# 每一行形如：1×1=1    或    2×1=2  2×2=4\n"),
    hints: [
      { level: 1, text: "外层是被乘数 i，从 1 到 3。内层乘数 j 不超过 i。" },
      { level: 2, text: "内层用 end=\"  \" 留在同一行，内层结束后 print() 换行。" },
      {
        level: 3,
        text: 'for i in range(1, 4):\n    for j in range(1, i + 1):\n        print(f"{j}×{i}={j * i}", end="  ")\n    print()',
      },
    ],
    reveal: {
      title: "对照",
      body: "三行：1×1=1；2×1=2  2×2=4；3×1=3  3×2=6  3×3=9。内层终点写成 i 会少掉每行最后一个。",
    },
  },
];
