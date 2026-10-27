import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const QUEUE = `queue = [
    (1, "周宁"),
    (2, "李想"),
    (3, "赵敏"),
    (4, "陈一"),
]`;

/** 按位置看人、截取一段、查找某张号票。 */
export const scenes: DraftScene[] = [
  {
    id: "list-look-index",
    title: "按位置看人",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "位置从 0 数，队尾不用先数完",
      markedPoints: [
        [
          { text: "queue[0]", mark: true },
          { text: " 是最前一位。起点还没往后数，所以下标是 0。" },
        ],
        [
          { text: "queue[2]", mark: true },
          { text: " 是从起点往后数 2 位。号票号码仍是 3。" },
        ],
        [
          { text: "queue[-1]", mark: true },
          { text: " 是当前队尾，queue[-2] 是倒数第二位。人继续来，-1 指的人会变。" },
        ],
      ],
    },
    code: code(`${QUEUE}
print(queue[0])
print(queue[2])
print(queue[-1])
print(queue[-2])`),
  },
  {
    id: "list-look-slice",
    title: "屏幕上的一段",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "只显示连续的若干位",
      markedPoints: [
        [
          { text: "queue[:3]", mark: true },
          { text: " 从开头取到下标 3 之前。下标 3 不包含。" },
        ],
        [
          { text: "queue[1:3]", mark: true },
          { text: " 从下标 1 取到下标 3 之前。queue[1:] 从下标 1 取到队尾。" },
        ],
        [{ text: "切出来的是新的一段。原队伍还在，号票号码也不变。" }],
      ],
    },
    code: code(`${QUEUE}
print(queue[:3])
print(queue[1:3])
print(queue[1:])
print(queue)`),
  },
  {
    id: "list-look-step",
    title: "倒序核对",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "从队尾核对，原顺序不动",
      markedPoints: [
        [
          { text: "queue[::-1]", mark: true },
          { text: " 步长是 -1，从后往前取出每一条，得到一份倒序名单。" },
        ],
        [
          { text: "queue[::2]", mark: true },
          { text: " 步长是 2，每隔一位抽查。" },
        ],
        [{ text: "切片得到新列表。原队伍仍按先来后到排列。" }],
      ],
    },
    code: code(`${QUEUE}
print(queue[::-1])
print(queue[::2])
print(queue)`),
  },
  {
    id: "list-look-find",
    title: "这张号票还在吗",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "按整条号票查找",
      markedPoints: [
        [
          { text: "in", mark: true },
          { text: " 问整条号票在不在队伍里。not in 问的是不在。" },
        ],
        [
          { text: "index", mark: true },
          { text: " 给出这张号票现在的下标。人不在队伍里时不能用 index。" },
        ],
        [
          { text: "count", mark: true },
          { text: " 数完全相同的号票有几条。同名不同号是两条，不能只拿姓名去数。" },
        ],
      ],
    },
    code: code(`${QUEUE}
ticket = (3, "赵敏")
print(ticket in queue)
print((9, "无人") not in queue)
print(queue.index(ticket))
print(queue.count(ticket))
print(queue.count((3, "赵明")))`),
  },
  {
    id: "list-look-numbers",
    title: "屏幕只显示号码",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "从每条号票取出号码",
      markedPoints: [
        [{ text: "屏幕这一栏只要号码，不要姓名。号码是每条号票的第 1 项，下标是 0。" }],
        [
          { text: "for", mark: true },
          { text: " 按当前顺序逐条取出，再拆成号码和姓名。" },
        ],
        [
          { text: "[ticket[0] for ticket in queue]", mark: true },
          { text: " 得到只含号码的新列表。原队伍仍是一条条号票。" },
        ],
      ],
    },
    code: code(`${QUEUE}
for ticket in queue:
    number, name = ticket
    print(number, name)
numbers = [ticket[0] for ticket in queue]
print(numbers)
print(len(queue))`),
  },
];
