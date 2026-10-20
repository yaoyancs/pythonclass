import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const CHECK = `n = 153
a = n // 100
b = n // 10 % 10
c = n % 10
if a**3 + b**3 + c**3 == n:
    print("是水仙花数")
else:
    print("不是水仙花数")
`;

const SCAN = `n = 100
while n <= 999:
    a = n // 100
    b = n // 10 % 10
    c = n % 10
    if a**3 + b**3 + c**3 == n:
        print(n)
    n = n + 1
`;

const FOR_SCAN = `for n in range(100, 1000):
    a = n // 100
    b = n // 10 % 10
    c = n % 10
    if a**3 + b**3 + c**3 == n:
        print(n)
`;

/** for：要检查的整数范围已经明确，就让 range 依次把每个数交出来。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-for-flower",
    title: "水仙花数",
    type: "explain",
    layout: "fullscreen",
    content: { loopPath: { topic: "for", mode: "flower" } },
  },
  {
    id: "scene-for-check",
    title: "判断一个数",
    type: "explain",
    layout: "split",
    content: { loopPath: { topic: "for", mode: "check" } },
    code: code(CHECK),
  },
  {
    id: "scene-for-while",
    title: "逐个检查",
    type: "explain",
    layout: "split",
    content: { loopPath: { topic: "for", mode: "while" } },
    code: code(""),
  },
  {
    id: "scene-for-meet",
    title: "for 语句",
    type: "explain",
    layout: "split",
    content: { loopPath: { topic: "for", mode: "meet" } },
    code: code(FOR_SCAN),
  },
  {
    id: "scene-for-contrast",
    title: "while 与 for",
    type: "explain",
    layout: "fullscreen",
    content: { loopPath: { topic: "for", mode: "contrast" } },
  },
  {
    id: "scene-for-range-observe",
    title: "range 从哪来",
    type: "explain",
    layout: "fullscreen",
    content: { loopPath: { topic: "for", mode: "observe" } },
  },
  {
    id: "scene-for-range-explore",
    title: "range 怎么取数",
    type: "explain",
    layout: "fullscreen",
    content: { loopPath: { topic: "for", mode: "explore" } },
  },
  {
    id: "scene-for-range-forms",
    title: "range 的三种写法",
    type: "explain",
    layout: "fullscreen",
    content: { loopPath: { topic: "for", mode: "forms" } },
  },
  {
    id: "scene-for-range-quiz",
    title: "range 预测",
    type: "explain",
    layout: "fullscreen",
    content: { loopPath: { topic: "for", mode: "quiz" } },
  },
  {
    id: "scene-for-run",
    title: "内存里怎么执行",
    type: "explain",
    layout: "fullscreen",
    content: { loopPath: { topic: "for", mode: "run" } },
  },
  {
    id: "scene-for-var",
    title: "循环变量用不用",
    type: "explain",
    layout: "fullscreen",
    content: { loopPath: { topic: "for", mode: "var" } },
  },
  {
    id: "scene-for-sum",
    title: "循环变量与累加变量",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: { loopPath: { topic: "for", mode: "sum" } },
    code: code("for i in range(1, 5):\n    total = 0\n    total = total + i\nprint(total)\n"),
  },
  {
    id: "scene-for-filter",
    title: "练习",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: { loopPath: { topic: "for", mode: "filter" } },
    code: code("# 任务：从 1～100 的整数中找出能被 3 整除，但不能被 5 整除的数\n"),
  },
];
