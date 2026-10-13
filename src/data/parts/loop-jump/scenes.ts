import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** break 离开整个循环；continue 跳过本轮剩余语句，进入下一轮。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-jump-break",
    title: "break",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "jump", mode: "break" } },
    code: code('for item in ["香蕉皮", "过期药品", "易拉罐"]:\n    if item == "过期药品":\n        print("遇到有害垃圾，停止分拣")\n        break\n    print(item)\n'),
  },
  {
    id: "scene-jump-continue",
    title: "continue",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "jump", mode: "continue" } },
    code: code('for n in range(1, 6):\n    if n == 3:\n        continue\n    print(n)\n'),
  },
  {
    id: "scene-jump-place",
    title: "放在 print 后面",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "jump", mode: "place" } },
    code: code('for n in range(1, 6):\n    print(n)\n    if n == 3:\n        continue\n'),
  },
  {
    id: "scene-jump-practice",
    title: "随堂练习",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "jump", mode: "practice" } },
    code: code('for n in range(1, 8):\n    # 遇到 5 就停止\n    # 偶数不打印\n    # 其余数字各打印一行\n    print(n)\n'),
    hints: [
      { level: 1, text: "先判断是不是 5，用 break 离开循环。再判断偶数，用 continue 跳过打印。" },
      { level: 2, text: "偶数写成 n % 2 == 0。print 要放在两个判断之后。" },
      {
        level: 3,
        text: "for n in range(1, 8):\n    if n == 5:\n        break\n    if n % 2 == 0:\n        continue\n    print(n)",
      },
    ],
    reveal: {
      title: "对照",
      body: "打印 1 和 3。5 触发 break，后面的 6、7 不再看。2 和 4 被 continue 跳过。",
    },
  },
];
