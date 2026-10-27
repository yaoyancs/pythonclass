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

/** 查询、拷贝与排序。 */
export const scenes: DraftScene[] = [
  {
    id: "list-q-index",
    title: "下标",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "下标按位置取值，起点为 0",
      markedPoints: [
        [
          { text: "queue[0]", mark: true },
          { text: " 取第一项。" },
        ],
        [
          { text: "queue[2]", mark: true },
          { text: " 取下标为 2 的项。" },
        ],
        [
          { text: "queue[-1]", mark: true },
          { text: " 取最后一项，queue[-2] 取倒数第二项。" },
        ],
      ],
    },
    code: code(`${QUEUE}
print(queue[0])
print(queue[2])
print(queue[-1])
print(queue[-2])`),
  },
  practice(
    "list-q-index-ex",
    "练习：下标",
    "取首项和末项",
    "打印 queue 的第一项和最后一项，各占一行。",
    `${QUEUE}
`,
    ["第一项的下标是 0。", "最后一项的下标是 -1。", "print(queue[0])\nprint(queue[-1])"],
    "queue[0] 为第一项，queue[-1] 为最后一项。",
    "周宁\n陈一",
  ),
  {
    id: "list-q-slice",
    title: "切片",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "切片取出一段，不含终点",
      markedPoints: [
        [
          { text: "queue[:3]", mark: true },
          { text: " 取下标 0 到 2。" },
        ],
        [
          { text: "queue[1:3]", mark: true },
          { text: " 取下标 1 到 2。queue[1:] 从下标 1 取到末尾。" },
        ],
        [{ text: "切片得到新列表，不修改原列表。" }],
      ],
    },
    code: code(`${QUEUE}
print(queue[:3])
print(queue[1:3])
print(queue[1:])
print(queue)`),
  },
  practice(
    "list-q-slice-ex",
    "练习：切片",
    "取前 3 项",
    "打印 queue 的前 3 项。",
    `${QUEUE}
`,
    ["终点下标不包含在结果中。", "省略起点即从 0 开始。", "print(queue[:3])"],
    "queue[:3] 含下标 0、1、2。",
    "['周宁', '李想', '赵敏']",
  ),
  {
    id: "list-q-step",
    title: "切片步长",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "步长决定取值间隔和方向",
      markedPoints: [
        [
          { text: "queue[::-1]", mark: true },
          { text: " 步长为 -1，得到逆序新列表。" },
        ],
        [
          { text: "queue[::2]", mark: true },
          { text: " 步长为 2，每隔一项取一次。" },
        ],
        [{ text: "原列表顺序不变。" }],
      ],
    },
    code: code(`${QUEUE}
print(queue[::-1])
print(queue[::2])
print(queue)`),
  },
  practice(
    "list-q-step-ex",
    "练习：步长",
    "得到逆序新列表",
    "打印 queue 的逆序，不要修改 queue。",
    `${QUEUE}
`,
    ["步长写在第二个冒号之后。", "逆序的步长是 -1。", "print(queue[::-1])"],
    "[::-1] 返回新列表，queue 保持原顺序。",
    "['陈一', '赵敏', '李想', '周宁']",
  ),
  {
    id: "list-q-for",
    title: "len 与遍历",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "len 取项数，for 按顺序逐项取出",
      markedPoints: [
        [
          { text: "len(queue)", mark: true },
          { text: " 返回当前项数。" },
        ],
        [
          { text: "for name in queue", mark: true },
          { text: " 按现有顺序逐项取出姓名。" },
        ],
      ],
    },
    code: code(`${QUEUE}
print(len(queue))
for name in queue:
    print(name)`),
  },
  practice(
    "list-q-for-ex",
    "练习：遍历",
    "逐项打印姓名",
    "按顺序每行打印 queue 中的一个姓名。",
    `${QUEUE}
`,
    ["用 for 逐项取出。", "循环变量就是当前姓名。", "for name in queue:\n    print(name)"],
    "for 按顺序取出每一项并打印。",
    "周宁\n李想\n赵敏\n陈一",
  ),
  {
    id: "list-look-find",
    title: "in、index、count",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "按值判断、定位和计数",
      markedPoints: [
        [
          { text: "x in queue", mark: true },
          { text: " 判断 x 是否存在。not in 判断不存在。" },
        ],
        [
          { text: "index(x)", mark: true },
          { text: " 返回第一个等于 x 的下标。x 不存在时不能调用。" },
        ],
        [
          { text: "count(x)", mark: true },
          { text: " 返回等于 x 的项数。比较的是整项。" },
        ],
      ],
    },
    code: code(`${QUEUE}
name = "赵敏"
print(name in queue)
print("无人" not in queue)
print(queue.index(name))
print(queue.count(name))`),
  },
  practice(
    "list-look-find-ex",
    "练习：index",
    "判断是否存在并取下标",
    "打印 name 是否在 queue 中，再打印它的下标。",
    `${QUEUE}
name = "李想"
`,
    ["in 的结果是 True 或 False。", "存在时，index 返回下标。", "print(name in queue)\nprint(queue.index(name))"],
    "in 判断存在，index 返回第一个相等项的下标。",
    "True\n1",
  ),
  {
    id: "list-look-stats",
    title: "len、sum、max、min",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "对数值列表求长度、总和和最值",
      markedPoints: [
        [
          { text: "len", mark: true },
          { text: " 返回项数。sum 返回各项之和。max、min 返回最大项、最小项。" },
        ],
        [
          { text: "count(5)", mark: true },
          { text: " 返回值等于 5 的项数。" },
        ],
      ],
    },
    code: code(`counts = [3, 5, 5, 2]
print(len(counts))
print(sum(counts))
print(max(counts))
print(min(counts))
print(counts.count(5))`),
  },
  practice(
    "list-look-stats-ex",
    "练习：sum 与 max",
    "求总和与最大值",
    "打印 counts 的总和，再打印最大值。",
    `counts = [3, 5, 5, 2]
`,
    ["总和用 sum。", "最大值用 max。", "print(sum(counts))\nprint(max(counts))"],
    "sum 返回各项之和，max 返回最大项。",
    "15\n5",
  ),
  {
    id: "list-look-numbers",
    title: "列表推导",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "推导按顺序收集各项，得到新列表",
      markedPoints: [
        [
          { text: "[name[0] for name in queue]", mark: true },
          { text: " 取出每个姓名的第一个字，组成新列表。" },
        ],
        [{ text: "原列表不变。" }],
      ],
    },
    code: code(`${QUEUE}
surnames = [name[0] for name in queue]
print(surnames)
print(queue)`),
  },
  practice(
    "list-look-numbers-ex",
    "练习：列表推导",
    "收集姓名长度",
    "按顺序收集每个姓名的字数，打印这个新列表。",
    `${QUEUE}
`,
    ["字数用 len。", "方括号内先写要收集的值，再写 for。", "lengths = [len(name) for name in queue]\nprint(lengths)"],
    "推导得到新列表，不修改 queue。",
    "[2, 2, 2, 2]",
  ),
  {
    id: "list-edit-copy",
    title: "copy",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "赋值共享同一列表，copy 得到新列表",
      markedPoints: [
        [
          { text: "board = queue", mark: true },
          { text: " 两个名字指向同一列表。修改其中一方，另一方同时改变。" },
        ],
        [
          { text: "queue.copy()", mark: true },
          { text: " 与 queue[:] 相同，返回新列表。修改副本不影响原列表。" },
        ],
      ],
    },
    code: code(`${QUEUE}
alias = queue
alias.pop(0)
print(len(queue))
queue = [
    "周宁",
    "李想",
    "赵敏",
    "陈一",
]
board = queue.copy()
board.pop(0)
print(len(queue))
print(len(board))`),
  },
  practice(
    "list-edit-copy-ex",
    "练习：copy",
    "修改副本",
    "复制出 board，只对 board 删除第一项。打印 queue 和 board 的项数。",
    `${QUEUE}
`,
    ["board = queue 指向同一列表。", "copy() 返回新列表。", "board = queue.copy()\nboard.pop(0)\nprint(len(queue))\nprint(len(board))"],
    "copy 后，pop 只改变被调用的那个列表。项数分别为 4 和 3。",
    "4\n3",
  ),
  {
    id: "list-look-rank",
    title: "sorted、sort、reverse",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "sorted 返回新列表，sort 与 reverse 修改原列表",
      markedPoints: [
        [
          { text: "sorted(counts, reverse=True)", mark: true },
          { text: " 返回降序新列表，不修改 counts。" },
        ],
        [
          { text: "sort()", mark: true },
          { text: " 将原列表改为升序。" },
        ],
        [
          { text: "reverse()", mark: true },
          { text: " 颠倒当前顺序，不按值重新排序。" },
        ],
      ],
    },
    code: code(`counts = [3, 5, 5, 2]
print(sorted(counts, reverse=True))
print(counts)
counts.sort()
print(counts)
counts.reverse()
print(counts)`),
  },
  practice(
    "list-look-rank-ex",
    "练习：sorted",
    "得到降序新列表",
    "打印 counts 的降序结果，再打印 counts，确认原列表未改。",
    `counts = [3, 5, 5, 2]
`,
    ["返回新列表用 sorted。", "降序设置 reverse=True。", "print(sorted(counts, reverse=True))\nprint(counts)"],
    "sorted 不修改原列表。sort 才会就地排序。",
    "[5, 5, 3, 2]\n[3, 5, 5, 2]",
  ),
];
