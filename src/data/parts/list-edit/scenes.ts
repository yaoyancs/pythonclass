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

/** 改号票、插入急诊、叫号、弃号、清空，以及抄给导诊台的那一份。 */
export const scenes: DraftScene[] = [
  {
    id: "list-edit-assign",
    title: "录错姓名",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "换掉这一条号票",
      markedPoints: [
        [{ text: "3 号写成了赵敏，实际是赵明。号码不变，整条换成 (3, \"赵明\")。" }],
        [
          { text: "queue[2] = ...", mark: true },
          { text: " 按位置替换一项。一条号票不能再追加第三栏。" },
        ],
        [
          { text: "queue[1:3] = [...]", mark: true },
          { text: " 把下标 1、2 这两位换成新的一段。新一段可以更短，后面的人往前靠。" },
        ],
      ],
    },
    code: code(`${QUEUE}
queue[2] = (3, "赵明")
print(queue[2])
queue[1:3] = [(7, "钱程")]
print(queue)`),
  },
  {
    id: "list-edit-insert",
    title: "急诊插入",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "加到指定位置，不是队尾",
      markedPoints: [
        [
          { text: "insert(0, 号票)", mark: true },
          { text: " 把急诊放到最前。原来的队头变成下标 1。" },
        ],
        [{ text: "append 只会加到队尾。急诊若 append，就要等普通人全部叫完。" }],
        [{ text: "插入之后，后面每个人的位置都加 1。号票上的号码不变。" }],
      ],
    },
    code: code(`${QUEUE}
queue.insert(0, (8, "林夏"))
print(queue)
print(queue[0])
print(queue[1])`),
  },
  {
    id: "list-edit-pop",
    title: "叫号和撤销队尾",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "拿走某一位，还要拿到这张号票",
      markedPoints: [
        [
          { text: "pop(0)", mark: true },
          { text: " 叫走队头，并把这张号票交给护士去报。后面的人前移。" },
        ],
        [
          { text: "pop()", mark: true },
          { text: " 不写下标时，撤销队尾。最后一位挂错号，用它拿回来。" },
        ],
        [{ text: "拿走之后，位置变了，留下的人号码不变。" }],
      ],
    },
    code: code(`${QUEUE}
current = queue.pop(0)
print(current)
print(queue[0])
undone = queue.pop()
print(undone)
print(queue)`),
  },
  {
    id: "list-edit-remove",
    title: "弃号",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "知道是谁，或知道在第几位",
      markedPoints: [
        [
          { text: "remove", mark: true },
          { text: " 按整条号票划掉，不返回号票。相同号票只划掉第一条。" },
        ],
        [
          { text: "del queue[i]", mark: true },
          { text: " 按位置划掉。不需要把号票取回来时报号。" },
        ],
        [{ text: "叫号要用这张票，用 pop。弃号只是从队伍消失，用 remove 或 del。" }],
      ],
    },
    code: code(`${QUEUE}
queue.remove((2, "李想"))
print(queue)
del queue[0]
print(queue)`),
  },
  {
    id: "list-edit-clear",
    title: "午休清空",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "下午从空队伍重新开始",
      markedPoints: [
        [
          { text: "clear", mark: true },
          { text: " 去掉全部号票。queue 还是原来的那支队伍，只是变成空的。" },
        ],
        [
          { text: "queue = []", mark: true },
          { text: " 是另建一支空队伍。已经抄走的名单若仍指着旧队伍，不会跟着变。" },
        ],
        [{ text: "午休时诊室这块屏要清空，用 clear。下午新来的人再 append。" }],
      ],
    },
    code: code(`${QUEUE}
screen = queue
queue.clear()
print(queue)
print(screen)
queue.append((11, "下午周宁"))
print(queue)`),
  },
  {
    id: "list-edit-copy",
    title: "抄给导诊台",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "导诊划掉一位，诊室原队还在",
      markedPoints: [
        [
          { text: "board = queue", mark: true },
          { text: " 两个名字指向同一支队伍。导诊 pop 一位，诊室也少一位。" },
        ],
        [
          { text: "queue.copy()", mark: true },
          { text: " 和 queue[:] 都抄出一支新队伍。改抄件，原队不变。" },
        ],
        [{ text: "号票本身不再拆开改写，所以抄这一层就够。抄件里仍是原来的那些号票。" }],
      ],
    },
    code: code(`${QUEUE}
alias = queue
alias.pop(0)
print(queue)
queue = [
    (1, "周宁"),
    (2, "李想"),
    (3, "赵敏"),
    (4, "陈一"),
]
board = queue.copy()
board.pop(0)
print(queue)
print(board)`),
  },
];
