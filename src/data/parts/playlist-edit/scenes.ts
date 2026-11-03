import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const SONGS = `songs = ["晴天", "稻香", "夜曲"]`;

/** 第三幕：先想清数据该怎么变，再写 append、remove、pop 和下标赋值。 */
export const scenes: DraftScene[] = [
  {
    id: "playlist-edit-overview",
    title: "列表的常用操作（方法）",
    type: "explain",
    layout: "fullscreen",
    content: {
      body: "列表除了可以定义、使用下标索引获取值以外，还提供了一系列功能。这些功能都称之为：列表的方法。",
      bulletPoints: ["插入元素", "删除元素", "清空列表", "修改元素", "统计元素个数"],
    },
  },
  {
    id: "playlist-edit-method",
    title: "方法与函数",
    type: "explain",
    layout: "fullscreen",
    content: {
      body: "函数是封装好的一段代码。定义在类里的函数称为方法。二者都有参数和返回值，调用格式不同。类的定义以后再学，现在先会使用方法。",
      flowDiagram: ["函数：num = add(1, 2)", "方法：num = student.add(1, 2)"],
      codeComparison: {
        left: {
          label: "函数",
          code: `def add(x, y):
    return x + y

num = add(1, 2)`,
        },
        right: {
          label: "方法",
          code: `class Student:
    def add(self, x, y):
        return x + y

student = Student()
num = student.add(1, 2)`,
        },
      },
    },
  },
  {
    id: "playlist-edit-index",
    title: "列表的查询功能（方法）",
    type: "run",
    layout: "split",
    content: {
      headline: "查找某元素的下标",
      flowDiagram: ["列表.index(元素)"],
      body: "查找指定元素在列表中的下标。找不到会报错 ValueError。index 是列表内置的方法。",
      bulletPoints: ["songs.index(\"稻香\") 的结果是 1"],
    },
    code: code(`${SONGS}
print(songs.index("稻香"))`),
  },
  {
    id: "playlist-edit-add-ask",
    title: "列表的修改功能（方法）",
    type: "run",
    layout: "split",
    content: {
      headline: "插入元素与追加元素",
      flowDiagram: ["列表.insert(下标, 元素)", "列表.append(元素)"],
      body: "insert 在指定下标插入元素。append 把元素追加到列表尾部；追加一个列表时，这个列表会成为尾部的一个元素。",
      bulletPoints: [
        "songs.insert(1, \"七里香\") 插到下标 1",
        "songs.append(\"七里香\") 加到末尾",
      ],
    },
    code: code(`${SONGS}
songs.insert(1, "七里香")
print(songs)

songs = ["晴天", "稻香", "夜曲"]
songs.append("七里香")
print(songs)

songs = ["晴天", "稻香", "夜曲"]
songs.append(["七里香", "青花瓷"])
print(songs)`),
  },
  {
    id: "playlist-edit-append-ex",
    title: "练习：添加",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      body: "把「青花瓷」加到末尾，并打印 songs。",
    },
    code: code(`${SONGS}
`),
    hints: [
      { level: 1, text: "加到末尾用 append。" },
      { level: 2, text: "括号里写要加入的歌名。" },
      { level: 3, text: "songs.append(\"青花瓷\")\nprint(songs)" },
    ],
    reveal: {
      title: "对照",
      body: "前三首的相对顺序不变，青花瓷在最后。",
    },
    expectedOutput: "['晴天', '稻香', '夜曲', '青花瓷']",
  },
  {
    id: "playlist-edit-extend",
    title: "追加多个元素",
    type: "run",
    layout: "split",
    content: {
      headline: "追加元素方式 2",
      flowDiagram: ["列表.extend(其它数据容器)"],
      body: "把其它数据容器里的元素依次追加到列表尾部。",
      bulletPoints: ["songs.extend([\"七里香\", \"青花瓷\"]) 得到五首歌"],
    },
    code: code(`${SONGS}
songs.extend(["七里香", "青花瓷"])
print(songs)`),
  },
  {
    id: "playlist-edit-concat",
    title: "拼接",
    type: "run",
    layout: "split",
    content: {
      headline: "四种加歌方式",
      flowDiagram: ["append", "extend", "+", "+="],
      body: "append 把整段当成一个元素。extend 和 += 拆开追加，改原列表。+ 得到新列表，原来的不动。",
      bulletPoints: [
        "append 之后末尾是一个列表",
        "+ 之后原来的 a 仍是两首歌",
        "+= 与 extend 一样，直接改 a",
      ],
    },
    code: code(`a = ["晴天", "稻香"]
a.append(["夜曲", "七里香"])
print(a)

a = ["晴天", "稻香"]
print(a + ["夜曲", "七里香"])
print(a)

a = ["晴天", "稻香"]
a += ["夜曲", "七里香"]
print(a)

a = ["晴天", "稻香"]
a.extend(["夜曲", "七里香"])
print(a)`),
  },
  {
    id: "playlist-edit-pop",
    title: "按下标删除",
    type: "run",
    layout: "split",
    content: {
      headline: "删除元素",
      flowDiagram: ["del 列表[下标]", "列表.pop(下标)", "列表.pop()"],
      body: "按位置删除。pop 还会把删掉的元素交回来。不写下标时，pop() 删除并返回最后一个。",
      bulletPoints: ["删掉下标 0 之后，剩下稻香和夜曲", "pop() 不写参数，删掉夜曲"],
    },
    code: code(`${SONGS}
del songs[0]
print(songs)

songs = ["晴天", "稻香", "夜曲"]
songs.pop(0)
print(songs)

songs = ["晴天", "稻香", "夜曲"]
last = songs.pop()
print(last)
print(songs)`),
  },
  {
    id: "playlist-edit-remove",
    title: "删除指定元素",
    type: "run",
    layout: "split",
    content: {
      headline: "删除第一个匹配项",
      flowDiagram: ["列表.remove(元素)"],
      body: "按元素的值删除。列表里有多个相同元素时，只删掉第一个。",
      bulletPoints: ["songs.remove(\"稻香\") 只删掉前面那一次"],
    },
    code: code(`songs = ["晴天", "稻香", "夜曲", "稻香"]
songs.remove("稻香")
print(songs)`),
  },
  {
    id: "playlist-edit-clear",
    title: "清空列表",
    type: "run",
    layout: "split",
    content: {
      headline: "清空列表内容",
      flowDiagram: ["列表.clear()"],
      body: "删掉列表里的全部元素，列表还在，只是变成空列表。",
      bulletPoints: ["songs.clear() 之后打印出来是 []"],
    },
    code: code(`${SONGS}
songs.clear()
print(songs)`),
  },
  {
    id: "playlist-edit-count",
    title: "统计某元素",
    type: "run",
    layout: "split",
    content: {
      headline: "统计某元素的数量",
      flowDiagram: ["列表.count(元素)"],
      body: "数出这个元素在列表里出现了多少次。",
      bulletPoints: ["songs.count(\"晴天\") 的结果是 3"],
    },
    code: code(`songs = ["晴天", "晴天", "晴天", "稻香", "夜曲"]
print(songs.count("晴天"))`),
  },
  {
    id: "playlist-edit-len",
    title: "统计元素个数",
    type: "run",
    layout: "split",
    content: {
      headline: "统计列表内有多少元素",
      flowDiagram: ["len(列表)"],
      body: "得到一个整数，表示列表里的元素数量。",
      bulletPoints: ["len(songs) 的结果是 5"],
    },
    code: code(`songs = ["晴天", "稻香", "夜曲", "七里香", "青花瓷"]
print(len(songs))`),
  },
  {
    id: "playlist-edit-methods",
    title: "列表的方法 - 总览",
    type: "explain",
    layout: "fullscreen",
    content: {
      compareTable: {
        indexHeader: "编号",
        leftHeader: "使用方式",
        rightHeader: "作用",
        rows: [
          { left: "列表.append(元素)", right: "向列表中追加一个元素" },
          { left: "列表.extend(容器)", right: "将数据容器的内容依次取出，追加到列表尾部" },
          { left: "列表 + 列表", right: "拼成新列表，原来的两个列表不变" },
          { left: "列表 += 列表", right: "等价于 extend，直接改左边这个列表" },
          { left: "列表.insert(下标, 元素)", right: "在指定下标处，插入指定的元素" },
          { left: "del 列表[下标]", right: "删除列表指定下标元素" },
          { left: "列表.pop(下标)", right: "删除指定下标的元素并返回它。不写下标则删除最后一个" },
          { left: "列表.remove(元素)", right: "从前向后，删除此元素第一个匹配项" },
          { left: "列表.clear()", right: "清空列表" },
          { left: "列表.count(元素)", right: "统计此元素在列表中出现的次数" },
          { left: "列表.index(元素, 起点)", right: "从起点下标往后找第一次出现的位置，找不到报错 ValueError" },
          { left: "len(列表)", right: "统计容器内有多少元素" },
        ],
      },
    },
  },
  {
    id: "playlist-edit-assign",
    title: "下标赋值",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      markedPoints: [
        [
          { text: "songs[1] = \"七里香\"", mark: true },
          { text: " 替换索引 1 上的那一首。其他位置不变。" },
        ],
      ],
    },
    code: code(`${SONGS}
songs[1] = "七里香"
print(songs)`),
  },
  {
    id: "playlist-edit-swap",
    title: "交换元素",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      body: "前两首对调，夜曲不动。两个位置上的歌互相交换。",
      markedPoints: [
        [
          { text: "songs[0], songs[1] = songs[1], songs[0]", mark: true },
          { text: " 同时读出两首，再写回对方的位置。" },
        ],
      ],
    },
    code: code(`${SONGS}
songs[0], songs[1] = songs[1], songs[0]
print(songs)`),
  },
  {
    id: "playlist-edit-debug-range",
    title: "调试：索引越界",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      body: "分析代码",
    },
    code: code(`${SONGS}
print(songs[3])`),
    hints: [
      { level: 1, text: "IndexError 表示这个索引上没有歌。" },
      { level: 2, text: "最后一首的索引是 2，从末尾数是 -1。" },
      { level: 3, text: "print(songs[-1])" },
    ],
    reveal: {
      title: "对照",
      body: "songs[3] 越出了这三首歌。最后一首用 songs[2] 或 songs[-1]。",
    },
    expectedOutput: "夜曲",
  },
  {
    id: "playlist-edit-debug-remove",
    title: "调试：remove",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      body: "remove 只能删已经在歌单里的歌名",
    },
    code: code(`${SONGS}
songs.remove("七里香")
print(songs)`),
    hints: [
      { level: 1, text: "ValueError 表示歌单里没有这个歌名。" },
      { level: 2, text: "括号里的歌名必须和某一项完全相同。" },
      { level: 3, text: "songs.remove(\"稻香\")\nprint(songs)" },
    ],
    reveal: {
      title: "对照",
      body: "七里香不在这份歌单里。删掉稻香之后，剩下晴天和夜曲。",
    },
    expectedOutput: "['晴天', '夜曲']",
  },
  {
    id: "playlist-edit-debug-pop",
    title: "调试：pop 与 remove",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      body: "按歌名删掉稻香",
    },
    code: code(`${SONGS}
songs.pop("稻香")
print(songs)`),
    hints: [
      { level: 1, text: "pop 的括号里要写索引，不能写歌名。" },
      { level: 2, text: "已知的是歌名。按歌名删除用 remove。" },
      { level: 3, text: "songs.remove(\"稻香\")\nprint(songs)" },
    ],
    reveal: {
      title: "对照",
      body: "知道歌名、不需要把那首交回来，用 remove。知道位置、还要拿到被删的歌，用 pop(索引)。",
    },
    expectedOutput: "['晴天', '夜曲']",
  },
  {
    id: "playlist-edit-alias",
    title: "列表的引用",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      body: "先写下你以为 print(a) 会看到什么，再运行。",
    },
    code: code(`a = [10, 20, 30]
b = a
b[0] = 100
print(a)`),
    prediction: {
      question: "print(a) 得到什么？",
      options: [
        { id: "old", label: "[10, 20, 30]" },
        { id: "new", label: "[100, 20, 30]", isCorrect: true },
        { id: "hundred", label: "100" },
      ],
    },
    reveal: {
      title: "两个名字指向同一列表",
      body: "b = a 没有复制出一份新列表。a 和 b 指向同一份列表。b[0] = 100 改的就是这一份，所以 print(a) 也是 [100, 20, 30]。歌单同样如此：两个变量名可以看着同一份 songs。",
    },
  },
  {
    id: "playlist-edit-practice",
    title: "练习：购物车",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      body: "购物车里已有牛奶、面包。追加鸡蛋，删掉面包，把第 1 件改成酸奶，再打印购物车。",
    },
    code: code(`cart = ["牛奶", "面包"]
`),
    hints: [
      { level: 1, text: "追加用 append，按名字删除用 remove，改第 1 件用下标 0。" },
      { level: 2, text: "先追加、再删除、再修改，最后 print。" },
      {
        level: 3,
        text: `cart = ["牛奶", "面包"]
cart.append("鸡蛋")
cart.remove("面包")
cart[0] = "酸奶"
print(cart)`,
      },
    ],
    reveal: {
      title: "对照",
      body: "面包被删掉，鸡蛋补在后面，第 1 件换成酸奶。结果是 ['酸奶', '鸡蛋']。",
    },
    expectedOutput: "['酸奶', '鸡蛋']",
  },
];
