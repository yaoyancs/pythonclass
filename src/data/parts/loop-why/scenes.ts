import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const ONCE = `secret = 37
guess = int(input("输入一个整数："))
#  =37 猜中了， > 37 大了, < 37 小了




`;

const REVIEWED = `secret = 37
guess = int(input("输入一个整数："))
if guess == secret:
    print("猜中")
elif guess > secret:
    print("大了")
else:
    print("小了")
`;

/** 导入：三种基本结构里，今天只展开循环；再用猜数字说明一次判断不够。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-loop-why-00",
    title: "三种基本结构",
    type: "explain",
    layout: "fullscreen",
    content: { loopPath: { topic: "why", mode: "map" } },
  },
  {
    id: "scene-loop-why-01",
    title: "分支判断",
    type: "explain",
    layout: "split",
    content: { loopPath: { topic: "why", mode: "once" } },
    code: code(ONCE),
  },
  {
    id: "scene-loop-why-02",
    title: "重复读入",
    type: "explain",
    layout: "split",
    content: { loopPath: { topic: "why", mode: "until" } },
    code: code(REVIEWED),
  },
  {
    id: "scene-loop-why-03",
    title: "次数上限",
    type: "explain",
    layout: "split",
    content: { loopPath: { topic: "why", mode: "limit" } },
    code: code(REVIEWED),
  },
];
