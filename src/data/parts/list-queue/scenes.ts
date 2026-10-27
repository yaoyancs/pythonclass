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

/** 第 6 讲列表：校医院候诊。先交代这一上午要做的事，再建队伍。 */
export const scenes: DraftScene[] = [
  {
    id: "list-q-task",
    title: "这一上午要做的事",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "候诊队伍和各小时人数都要留着",
      markedPoints: [
        [{ text: "夜班交出一份已经在等的名单。上午还会有人取号，另一诊室也可能整队并过来。" }],
        [{ text: "屏幕要按位置看人、只显示前几位、查某人还在不在、叫号、弃号、插入急诊、午休清空。" }],
        [{ text: "导诊台要抄一份当前队伍，划掉一个人不能把原队一起改掉。" }],
        [{ text: "另外记下 8 点到 11 点每个小时的候诊人数，闭诊后算总数、最忙的一小时，并排出一份名次。时间顺序的原表还要留着。" }],
      ],
    },
  },
  {
    id: "list-q-lose",
    title: "一个变量留不住队伍",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "下一位到来，上一位就没了",
      markedPoints: [
        [
          { text: "current", mark: true },
          { text: " 每次被下一张号票盖住。周宁、李想都留不住。" },
        ],
        [{ text: "号码和姓名要一起走。只留姓名，叫号时不知道报几号。" }],
        [{ text: "人会陆续到来，不能事先写成 ticket1、ticket2、ticket3。" }],
      ],
    },
    code: code(`current = (1, "周宁")
current = (2, "李想")
current = (3, "赵敏")
print(current)`),
  },
  {
    id: "list-q-literal",
    title: "夜班交出的名单",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "人已经在，直接写成一队",
      markedPoints: [
        [{ text: "方括号里按先来后到写下号票，这是列表字面量。顺序就是等待顺序。" }],
        [
          { text: "(号码, 姓名)", mark: true },
          { text: " 是一条号票。两项绑在一起，作为列表中的一项。" },
        ],
        [
          { text: "queue = []", mark: true },
          { text: " 是还没有人的空队伍。下午开诊就从空列表开始。" },
        ],
      ],
    },
    code: code(`${QUEUE}
print(queue)
afternoon = []
print(afternoon)`),
  },
  {
    id: "list-q-append",
    title: "新取号的人",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "来一位，加到队尾",
      markedPoints: [
        [
          { text: "append", mark: true },
          { text: " 加的是一条号票。先来的仍在前面。" },
        ],
        [{ text: "人数事先不定，所以在已有名单后面追加，而不是重写整个字面量。" }],
        [{ text: "下标是现在的位置。号票上的号码写在记录里面，两边各记各的。" }],
      ],
    },
    code: code(`${QUEUE}
queue.append((5, "孙可"))
print(queue)
print(queue[0])
print(queue[-1])`),
  },
  {
    id: "list-q-extend",
    title: "另一诊室整队并过来",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "接上的是一条条号票",
      markedPoints: [
        [
          { text: "extend", mark: true },
          { text: " 把另一支队伍里的号票逐条接上。" },
        ],
        [
          { text: "append", mark: true },
          { text: " 若加的是整支队伍，队伍会变成一项。里面又嵌着一支队伍，无法按号票叫号。" },
        ],
        [{ text: "两个诊室仍要分开叫时，把两支队伍放进一个列表。rooms[1][0] 是二诊室队头。" }],
      ],
    },
    code: code(`${QUEUE}
other = [(5, "孙可"), (6, "吴迪")]
joined = queue.copy()
joined.extend(other)
print(joined)
nested = queue.copy()
nested.append(other)
print(nested)
rooms = [queue, other]
print(rooms[1][0])`),
  },
  {
    id: "list-q-plus",
    title: "合并出一支新队",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "原队还要留底",
      markedPoints: [
        [
          { text: "queue + other", mark: true },
          { text: " 得到一支新队伍。queue 和 other 都不变。" },
        ],
        [
          { text: "extend", mark: true },
          { text: " 改的是自己。原队不需要留下时才用它。" },
        ],
        [
          { text: "+", mark: true },
          { text: " 的两边都是列表。一条号票要先放进列表再相加。" },
        ],
      ],
    },
    code: code(`${QUEUE}
other = [(5, "孙可"), (6, "吴迪")]
merged = queue + other
print(merged)
print(queue)
print(other)`),
  },
];
