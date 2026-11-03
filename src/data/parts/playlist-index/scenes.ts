import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const SONGS4 = `songs = ["晴天", "稻香", "夜曲", "七里香"]`;

/** 第二幕：索引从 0 开始，负索引从末尾数，越界会报错。 */
export const scenes: DraftScene[] = [
  {
    id: "playlist-why-hold",
    title: "列表的下标(索引)",
    type: "run",
    layout: "split",
    content: {
      headline: "如何从列表中取出特定位置的数据呢？",
      flowDiagram: [
        "列表[下标]",
        "['Try', '逆光', '大鱼']",
        "  0       1       2",
        " -3      -2      -1",
      ],
      bulletPoints: [
        "列表中每个元素都有编号，这个编号叫下标，也叫索引",
        "下标从 0 开始",
        "从右往左数时，最后一个元素的下标是 -1",
        "我们只需要按照下标索引，即可取得对应位置的元素。",
      ],
    },
    code: code(`songs = ['Try', '逆光', '大鱼']
print(songs[0])  # 结果：？
print(songs[1])  # 结果：？
print(songs[2])  # 结果：？`),
  },
  {
    id: "playlist-index-zero",
    title: "正索引",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {},
    code: code(`${SONGS4}
print(songs[0])
print(songs[1])`),
    prediction: {
      question: "第 1 首，如何输出？",
      options: [
        { id: "zero", label: "songs[0] 的结果：晴天", isCorrect: true },
        { id: "one-name", label: "songs[1] 的结果：晴天" },
        { id: "one", label: "songs[1] 的结果：稻香" },
      ],
    },
    reveal: {
      title: "偏移 0 个位置",
      body: "第 1 首离起点偏移了 0 个位置，所以是 songs[0]。songs[1] 已经是第 2 首「稻香」。日常说的第几首从 1 数，索引从 0 数。",
    },
  },
  {
    id: "playlist-index-neg",
    title: "负索引",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      body: "负索引从右边数。",
    },
    code: code(`${SONGS4}
print(songs[-1])
print(songs[-2])`),
    prediction: {
      question: "songs[-1] 是哪一首？",
      options: [
        { id: "first", label: "晴天" },
        { id: "last", label: "七里香", isCorrect: true },
        { id: "third", label: "夜曲" },
      ],
    },
    reveal: {
      title: "同一首可以有两种数法",
      body: "songs[-1] 是最后一首「七里香」，也就是 songs[3]。songs[-2] 是倒数第二首「夜曲」。",
    },
  },
  {
    id: "playlist-index-range",
    title: "索引越界",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      body: "",
    },
    code: code(`${SONGS4}
print(songs[4])`),
    prediction: {
      question: "print(songs[4]) 会得到什么？",
      options: [
        { id: "last", label: "七里香" },
        { id: "error", label: "报错，没有索引 4", isCorrect: true },
        { id: "empty", label: "空字符串" },
      ],
    },
    reveal: {
      title: "索引必须落在现有的位置上",
      body: "没有索引 4。最后一首是 songs[3]，也是 songs[-1]。访问超出范围的索引，程序会报 IndexError。",
    },
  },
  {
    id: "playlist-index-nest",
    title: "嵌套列表",
    type: "run",
    layout: "split",
    content: {
      headline: "嵌套列表的下标（索引）",
      flowDiagram: [
        "外层下标：0  和  1",
        "[1, 2, 3]    [4, 5, 6]",
        "内层下标：0 1 2   0 1 2",
      ],
      body: "嵌套列表同样用下标取值，下标有 2 个层级。",
      bulletPoints: [
        "my_list[0] 取出 [1, 2, 3]",
        "my_list[0][0] 再取出 1",
        "len 只数最外层：这里是 2，不是 6。内层个数用 len(my_list[0])",
      ],
    },
    code: code(`# 2层嵌套 list
my_list = [[1, 2, 3], [4, 5, 6]]

# 获取内层第一个 list
print(my_list[0])  # 结果：[1, 2, 3]

# 获取内层第一个 list 的第一个元素
print(my_list[0][0])  # 结果：1

# len 只数外层有几项
print(len(my_list))
print(len(my_list[0]))`),
  },
  {
    id: "playlist-index-summary",
    title: "下标小结",
    type: "explain",
    layout: "fullscreen",
    content: {
      note: {
        title: "",
        points: [
          "列表的下标索引是什么？\n列表的每一个元素都有编号，称之为下标索引。从前向后从 0 开始递增，从后向前从 -1 开始递减。",
          "如何通过下标索引取出对应位置的元素？\n列表[下标]，即可取出。",
          "下标索引的注意事项\n要注意下标索引的取值范围，超出范围无法取出元素，并且会报错。",
        ],
      },
    },
  },
  {
    id: "playlist-index-practice",
    title: "练习：成绩单",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      body: "成绩依次是 88、92、76、95。打印第 1 个成绩和最后一个成绩，各占一行。",
    },
    code: code(`scores = [88, 92, 76, 95]
`),
    hints: [
      { level: 1, text: "第 1 个的下标是 0。最后一个可以用 -1。" },
      { level: 2, text: "两行各写一次 print。" },
      {
        level: 3,
        text: `scores = [88, 92, 76, 95]
print(scores[0])
print(scores[-1])`,
      },
    ],
    reveal: {
      title: "对照",
      body: "第 1 个是 88，最后一个是 95。",
    },
    expectedOutput: "88\n95",
  },
];
