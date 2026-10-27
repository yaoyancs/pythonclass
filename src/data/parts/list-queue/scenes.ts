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

/** 导入、容器、认识列表、创建与增加。 */
export const scenes: DraftScene[] = [
  {
    id: "list-q-lose",
    title: "导入",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "多人取号，如何存？",
      body: "银行业务窗口陆续来了周宁、李想、赵敏。用变量 current 存储。",
      markedPoints: [
        [{ text: "连续赋值后，前一个人的姓名被盖掉。" }],
        [{ text: "要同时保留整支队伍，需要能装一堆数据的类型。" }],
      ],
    },
    code: code(`current = "周宁"
current = "李想"
current = "赵敏"
print(current)`),
  },
  {
    id: "list-q-container",
    title: "容器类型",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "一堆数据，需要容器",
      body: "窗口要同时记住多人。一个变量只留最后一次赋值，装不下整支队伍。",
      bulletPoints: [
        "容器用来存放一组数据，而不是单个值",
        "常见容器：列表、元组、集合、字典",
        "本讲先学列表：有序、可改",
        "集合与字典见第 7 讲；元组另议",
      ],
    },
  },
  {
    id: "list-q-what",
    title: "认识列表",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "列表：有序、可改的一串数据",
      body: "银行排队可以写成一份名单。名单里的项有先后，也可以后来增删改。",
      bulletPoints: [
        "用方括号 [] 书写",
        "项与项之间用逗号分隔",
        "本讲用姓名字符串作为每一项",
      ],
      preview: "下一节：怎样创建列表",
    },
  },
  {
    id: "list-q-create",
    title: "创建列表",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "[] 建空列表，[a, b] 写入已有项",
      markedPoints: [
        [
          { text: "[]", mark: true },
          { text: " 创建空列表。" },
        ],
        [
          { text: '["周宁", "李想"]', mark: true },
          { text: " 用已有元素创建列表。" },
        ],
        [{ text: "创建后，名单里已经有人，顺序就是书写顺序。" }],
      ],
    },
    code: code(`queue = []
print(queue)
queue = ["周宁", "李想"]
print(queue)`),
  },
  {
    id: "list-look-hours",
    title: "list 与 *",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "list 由序列建立列表，* 重复项",
      markedPoints: [
        [
          { text: "list(range(8, 12))", mark: true },
          { text: " 得到 [8, 9, 10, 11]。止点不包含。" },
        ],
        [
          { text: "[0] * 4", mark: true },
          { text: " 得到四项，初值都是 0。各项可以分别赋值。" },
        ],
        [{ text: "下标表示第几格，不表示格中的数值。" }],
      ],
    },
    code: code(`hours = list(range(8, 12))
counts = [0] * 4
print(hours)
print(counts)
counts[0] = 3
counts[1] = 5
counts[2] = 5
counts[3] = 2
print(counts)`),
  },
  practice(
    "list-look-hours-ex",
    "练习：*",
    "重复初值后再赋值",
    "建立含 4 个 0 的列表，将下标 0 改为 3，并打印该列表。",
    "",
    ["重复项使用 *。", "第一项的下标是 0。", "counts = [0] * 4\ncounts[0] = 3\nprint(counts)"],
    "[0] * 4 得到四项 0。再对下标 0 赋值。",
    "[3, 0, 0, 0]",
  ),
  {
    id: "list-q-append",
    title: "append",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "append 追加到末尾",
      markedPoints: [
        [
          { text: "append(x)", mark: true },
          { text: " 把 x 加到末尾，原有顺序不变。" },
        ],
        [{ text: "可在空列表上连续 append，逐个加人。" }],
      ],
    },
    code: code(`queue = []
queue.append("周宁")
queue.append("李想")
print(queue)
queue = ["周宁", "李想"]
queue.append("赵敏")
print(queue)`),
  },
  practice(
    "list-q-append-ex",
    "练习：append",
    "追加到末尾",
    "将 \"孙可\" 追加到 queue 末尾，并打印 queue。",
    `${QUEUE}
`,
    ["追加到末尾用 append。", "参数是要加入的那一项。", "queue.append(\"孙可\")\nprint(queue)"],
    "append 加在末尾，原有四项的相对顺序不变。",
    "['周宁', '李想', '赵敏', '陈一', '孙可']",
  ),
  {
    id: "list-edit-insert",
    title: "insert",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "insert 插入到指定下标",
      markedPoints: [
        [
          { text: "insert(i, x)", mark: true },
          { text: " 把 x 插入下标 i，其后各项下标加 1。" },
        ],
        [
          { text: "append", mark: true },
          { text: " 只能加到末尾，不能指定位置。" },
        ],
      ],
    },
    code: code(`${QUEUE}
queue.insert(0, "林夏")
print(queue[0])
print(queue[1])`),
  },
  practice(
    "list-edit-insert-ex",
    "练习：insert",
    "插入到下标 0",
    "将 \"林夏\" 插入下标 0，并打印新的第一项。",
    `${QUEUE}
`,
    ["insert 的第一个参数是下标。", "第一项的下标是 0。", "queue.insert(0, \"林夏\")\nprint(queue[0])"],
    "insert(0, x) 使 x 成为第一项，原第一项下标变为 1。",
    "林夏",
  ),
  {
    id: "list-edit-extend",
    title: "extend 与 +",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "extend 就地追加多项，+ 得到新列表",
      markedPoints: [
        [
          { text: "extend(other)", mark: true },
          { text: " 把 other 中的各项依次加到末尾。" },
        ],
        [
          { text: "append(other)", mark: true },
          { text: " 把 other 整体作为一项加入。" },
        ],
        [
          { text: "queue + other", mark: true },
          { text: " 返回新列表，不修改 queue。" },
        ],
      ],
    },
    code: code(`${QUEUE}
other = ["孙可", "吴迪"]
queue.extend(other)
print(queue)
fresh = ["周宁", "李想"]
print(fresh + other)
print(fresh)`),
  },
  practice(
    "list-edit-extend-ex",
    "练习：extend",
    "逐项接到末尾",
    "将 other 的各项接到 queue 末尾，打印 queue 的项数。",
    `${QUEUE}
other = ["孙可", "吴迪"]
`,
    ["逐项追加用 extend。", "append(other) 只增加一项。", "queue.extend(other)\nprint(len(queue))"],
    "extend 使项数增加 other 的长度，结果为 6。",
    "6",
  ),
];
