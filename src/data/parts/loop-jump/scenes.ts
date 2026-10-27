import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const ROW = `for i in range(1, 10):
    for j in range(1, i + 1):
        if j * i > 20:
            break
        print(f"{j}×{i}={j * i}", end="  ")
    print()
`;

const CONFLICT = `for i in range(5):
    score = int(input("输入成绩："))
    if score < 0 or score > 100:
        print("成绩无效")
    print("正在统计成绩")
    print("统计完成")
`;

const SKIP = `for i in range(5):
    score = int(input("输入成绩："))
    if score < 0 or score > 100:
        print("成绩无效")
        continue
    print("正在统计成绩")
    print("统计完成")
`;

const USE = `count = 0
total = 0
passed = 0
while True:
    score = int(input("请输入成绩："))
    if score == -1:
        break
    if score < 0 or score > 100:
        print("无效成绩，跳过")
        continue
    count += 1
    total += score
    if score >= 60:
        passed += 1
    print("成绩录入成功")
print(f"人数：{count}")
print(f"总分：{total}")
print(f"及格人数：{passed}")
`;

/** 九九表用 break 结束这一行。体测成绩用问题和配图引出 continue。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-jump-row",
    title: "break",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "jump", mode: "row" } },
    code: code(ROW),
  },
  {
    id: "scene-jump-still",
    title: "为什么还在统计",
    type: "explain",
    layout: "split",
    content: { loopPath: { topic: "jump", mode: "still" } },
    code: code(CONFLICT),
  },
  {
    id: "scene-jump-skip",
    title: "continue",
    type: "explain",
    layout: "split",
    content: { loopPath: { topic: "jump", mode: "skip" } },
    code: code(SKIP),
  },
  {
    id: "scene-jump-use",
    title: "无效成绩怎么处理",
    type: "explain",
    layout: "split",
    content: { loopPath: { topic: "jump", mode: "use" } },
    code: code(USE),
  },
];
