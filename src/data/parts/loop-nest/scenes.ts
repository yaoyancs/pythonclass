import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const NAIVE = `print("1×1=1")
print("1×2=2  2×2=4")
print("1×3=3  2×3=6  3×3=9")
print("1×4=4  2×4=8  3×4=12 4×4=16")
`;

const FIXED = `for i in range(1, 10):
    for j in range(1, 10):
        print(f"{j}×{i}={i*j}", end="  ")
    print()
`;

const NOLINE = `for i in range(1, 10):
    for j in range(1, i + 1):
        print(f"{j}×{i}={i*j}", end="  ")
`;

const INDENT = `for i in range(1, 10):
    for j in range(1, i + 1):
        print(f"{j}×{i}={i*j}", end="  ")
        print()
`;

const SCALE = `n = int(input("请输入行数："))
for i in range(1, n + 1):
    for j in range(1, i + 1):
        print(f"{j}×{i}={j * i}", end="  ")
    print()
`;

const REVERSE = `for i in range(9, 0, -1):
    for j in range(1, i + 1):
        print(f"{j}×{i}={j * i}", end="  ")
    print()
`;

const LIMIT = `for i in range(1, 10):
    for j in range(1, i + 1):
        if j * i > 20:
            break
        print(f"{j}×{i}={j * i}", end="  ")
    print()
`;

/** 先看乘法表和逐行 print，再用三道挑战把行数、方向和停止条件交给学生。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-nest-find",
    title: "打印乘法表",
    type: "explain",
    layout: "split",
    content: { loopPath: { topic: "nest", mode: "find" } },
    code: code(NAIVE),
  },
  {
    id: "scene-nest-fixed",
    title: "代码分析",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: { loopPath: { topic: "nest", mode: "fixed" } },
    code: code(FIXED),
  },
  {
    id: "scene-nest-noline",
    title: "代码分析",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: { loopPath: { topic: "nest", mode: "noline" } },
    code: code(NOLINE),
  },
  {
    id: "scene-nest-indent",
    title: "代码分析",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: { loopPath: { topic: "nest", mode: "indent" } },
    code: code(INDENT),
  },
  {
    id: "scene-nest-scale",
    title: "挑战1：任意规模",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "nest", mode: "scale" } },
    code: code('n = int(input("请输入行数："))\n'),
    hints: [
      { level: 1, text: "外层循环变量 i 表示行号，从 1 走到 n。" },
      { level: 2, text: "内层 j 从 1 走到 i。这一行打完后，用不带 end 的 print() 换行。" },
      { level: 3, text: SCALE },
    ],
    reveal: {
      title: "对照",
      body: "输入 3，输出三行：1×1=1；1×2=2  2×2=4；1×3=3  2×3=6  3×3=9。把 9 换成 n，固定的九九表就变成任意规模。",
    },
  },
  {
    id: "scene-nest-reverse",
    title: "挑战2：倒三角形",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "nest", mode: "reverse" } },
    code: code("# 先输出第 9 行，最后输出第 1 行\n"),
    hints: [
      { level: 1, text: "外层要从 9 变到 1。range 的第三个参数是步长，写成 -1。" },
      { level: 2, text: "range(9, 0, -1) 取出 9 到 1。内层仍从 1 走到当前行号。" },
      { level: 3, text: REVERSE },
    ],
    reveal: {
      title: "对照",
      body: "第一行是 1×9=9 到 9×9=81，最后一行是 1×1=1。变的是外层的方向，内层还是从 1 数到行号。",
    },
  },
  {
    id: "scene-nest-limit",
    title: "挑战3：乘积不超过20",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "nest", mode: "limit" } },
    code: code("# 九九乘法表中，只输出乘积不超过 20 的算式\n"),
    hints: [
      { level: 1, text: "先按九九乘法表写两层循环。j * i 大于 20 时，这个算式不打印。" },
      { level: 2, text: "同一行里 j 越来越大，乘积只会更大。超过 20 后，用 break 结束内层循环。" },
      { level: 3, text: LIMIT },
    ],
    reveal: {
      title: "对照",
      body: "第 5 行停在 4×5=20。第 9 行停在 2×9=18，3×9=27 不再打印。break 结束的是内层，下一行还要继续。",
    },
  },
];
