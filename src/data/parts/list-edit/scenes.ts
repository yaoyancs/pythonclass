import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const QUEUE = `queue = [
    "周宁",
    "李想",
    "赵敏",
    "陈一",
]`;

function practice(
  id: string,
  title: string,
  headline: string,
  body: string,
  initial: string,
  hint: [string, string, string],
  reveal: string,
  expectedOutput: string,
): DraftScene {
  return {
    id,
    title,
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: { headline, body },
    code: code(initial),
    hints: [
      { level: 1, text: hint[0] },
      { level: 2, text: hint[1] },
      { level: 3, text: hint[2] },
    ],
    reveal: { title: "对照", body: reveal },
    expectedOutput,
  };
}

/** 删除与修改。 */
export const scenes: DraftScene[] = [
  {
    id: "list-edit-pop",
    title: "pop",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "pop 删除一项并返回该项",
      markedPoints: [
        [
          { text: "pop(0)", mark: true },
          { text: " 删除下标 0，并返回该项。其后各项前移。" },
        ],
        [
          { text: "pop()", mark: true },
          { text: " 不写下标时，删除并返回最后一项。" },
        ],
      ],
    },
    code: code(`${QUEUE}
current = queue.pop(0)
print(current)
print(queue[0])
undone = queue.pop()
print(undone)`),
  },
  practice(
    "list-edit-pop-ex",
    "练习：pop",
    "删除并返回第一项",
    "删除第一项并打印该项，再打印新的第一项。",
    `${QUEUE}
`,
    ["删除并取得该项，用 pop。", "第一项的下标是 0。", "current = queue.pop(0)\nprint(current)\nprint(queue[0])"],
    "pop(0) 返回被删项。原下标 1 成为新的第一项。",
    "周宁\n李想",
  ),
  {
    id: "list-edit-remove",
    title: "remove 与 del",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "remove 按值删除，del 按下标删除",
      markedPoints: [
        [
          { text: "remove(x)", mark: true },
          { text: " 删除第一个等于 x 的项，不返回该项。" },
        ],
        [
          { text: "del queue[i]", mark: true },
          { text: " 删除下标 i，不返回该项。" },
        ],
        [{ text: "需要拿到被删项时用 pop。" }],
      ],
    },
    code: code(`${QUEUE}
queue.remove("李想")
print(queue)
del queue[0]
print(queue)`),
  },
  practice(
    "list-edit-remove-ex",
    "练习：remove",
    "按值删除一项",
    "删除 \"李想\"，并打印 queue。",
    `${QUEUE}
`,
    ["已知的是值，不是下标。", "remove 的参数须与该项完全相同。", "queue.remove(\"李想\")\nprint(queue)"],
    "remove 删除第一个相等项，不返回该项。",
    "['周宁', '赵敏', '陈一']",
  ),
  {
    id: "list-edit-clear",
    title: "clear",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "clear 清空原列表，= [] 另建空列表",
      markedPoints: [
        [
          { text: "clear()", mark: true },
          { text: " 删除全部项。列表对象不变，其他指向它的名字一起变空。" },
        ],
        [
          { text: "queue = []", mark: true },
          { text: " 让名字指向新建的空列表。原列表不受影响。" },
        ],
      ],
    },
    code: code(`${QUEUE}
screen = queue
queue.clear()
print(queue)
print(screen)
queue.append("下午周宁")
print(queue)`),
  },
  practice(
    "list-edit-clear-ex",
    "练习：clear",
    "清空后再追加",
    "清空 queue，再追加 \"下午周宁\"，并打印 queue。",
    `${QUEUE}
`,
    ["清空原列表用 clear。", "清空后再 append。", "queue.clear()\nqueue.append(\"下午周宁\")\nprint(queue)"],
    "clear 删除全部项。随后 append 的是清空后的第一项。",
    "['下午周宁']",
  ),
  {
    id: "list-edit-assign",
    title: "按下标替换",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "用下标指出位置，赋值替换一项或一段",
      markedPoints: [
        [
          { text: "queue[2] = x", mark: true },
          { text: " 替换下标 2 的那一项。" },
        ],
        [
          { text: "queue[1:3] = [...]", mark: true },
          { text: " 替换下标 1、2。新段更短时，后面的项前移。" },
        ],
      ],
    },
    code: code(`${QUEUE}
queue[2] = "赵明"
print(queue[2])
queue[1:3] = ["钱程"]
print(queue)`),
  },
  practice(
    "list-edit-assign-ex",
    "练习：替换",
    "替换下标 2",
    "将下标 2 替换为 \"赵明\"，并打印该项。",
    `${QUEUE}
`,
    ["用下标赋值替换一项。", "新值是要写入的那一项。", "queue[2] = \"赵明\"\nprint(queue[2])"],
    "queue[2] = x 只替换该下标，其余项不变。",
    "赵明",
  ),
];
