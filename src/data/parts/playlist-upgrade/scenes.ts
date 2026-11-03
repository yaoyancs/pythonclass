import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const SONGS = `songs = ["晴天", "稻香", "夜曲"]`;
const SONGS4 = `songs = ["晴天", "稻香", "夜曲", "七里香"]`;

/** 升级：切片、查找、统计、排序、和字符串互转。仍是同一份歌单。 */
export const scenes: DraftScene[] = [
  {
    id: "playlist-up-slice-ask",
    title: "切片",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      body: "songs[1:3] 含头不含尾。",
    },
    code: code(`${SONGS4}
print(songs[1:3])
print(songs[:2])
print(songs[2:])
print(songs)`),
    prediction: {
      question: "songs[1:3] 得到什么？",
      options: [
        { id: "mid", label: '["稻香", "夜曲"]', isCorrect: true },
        { id: "tail", label: '["稻香", "夜曲", "七里香"]' },
        { id: "head", label: '["晴天", "稻香"]' },
      ],
    },
    reveal: {
      title: "含头不含尾",
      body: "取下标 1、2：稻香、夜曲。songs[:2] 从头取到下标 2 之前。songs[2:] 从下标 2 取到末尾。原列表不变。",
    },
  },
  {
    id: "playlist-up-slice-more",
    title: "切片的步长",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      markedPoints: [
        [
          { text: "songs[:]", mark: true },
          { text: "：整份复制，得到新列表。" },
        ],
        [
          { text: "songs[::2]", mark: true },
          { text: "：从头开始，每隔一个取一首。" },
        ],
        [
          { text: "songs[::-1]", mark: true },
          { text: "：倒序的新列表，原来的不动。" },
        ],
        [
          { text: "songs[10:20]", mark: true },
          { text: "：越界切片得到 []，不报 IndexError。" },
        ],
      ],
    },
    code: code(`${SONGS4}
print(songs[:])
print(songs[::2])
print(songs[::-1])
print(songs[10:20])
print(songs)`),
  },
  {
    id: "playlist-up-find-bridge",
    title: "查找",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "查找",
      body: "in：在不在。index：下标是几。",
      bulletPoints: [
        "in 得到 True 或 False",
        "index 从 0 数，位置要 + 1",
        "index(歌名, 起点) 从该下标往后找",
        "找不到会报错，先判断再 index",
      ],
    },
  },
  {
    id: "playlist-up-find",
    title: "in 与 index",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      markedPoints: [
        [
          { text: "name in songs", mark: true },
          { text: "：在不在。" },
        ],
        [
          { text: "songs.index(name)", mark: true },
          { text: "：第一次出现的下标。" },
        ],
        [
          { text: "index(name, 2)", mark: true },
          { text: "：从下标 2 往后找下一次。" },
        ],
      ],
    },
    code: code(`songs = ["晴天", "稻香", "夜曲", "稻香"]
name = "稻香"
print(name in songs)
print(songs.index(name))
print(songs.index(name, 2))`),
  },
  {
    id: "playlist-up-index-miss",
    title: "调试：index",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      body: "七里香不在，index 会报错。在则打印下标，不在打印「不存在」。",
    },
    code: code(`${SONGS}
name = "七里香"
print(songs.index(name))`),
    hints: [
      { level: 1, text: "先用 in 判断，再决定要不要调用 index。" },
      { level: 2, text: "不在时不要调用 index，改为打印「不存在」。" },
      {
        level: 3,
        text: `name = "七里香"
if name in songs:
    print(songs.index(name))
else:
    print("不存在")`,
      },
    ],
    reveal: {
      title: "对照",
      body: "先 in，再 index。",
    },
    expectedOutput: "不存在",
  },
  {
    id: "playlist-up-count",
    title: "count 与 len",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      markedPoints: [
        [
          { text: "count(\"晴天\")", mark: true },
          { text: "：这首歌出现几次。" },
        ],
        [
          { text: "len(songs)", mark: true },
          { text: "：一共几项。" },
        ],
      ],
    },
    code: code(`songs = ["晴天", "稻香", "晴天", "夜曲"]
print(songs.count("晴天"))
print(len(songs))`),
  },
  {
    id: "playlist-up-stats",
    title: "最大、最小与求和",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      markedPoints: [
        [
          { text: "max、min", mark: true },
          { text: "：这一列数字里的最大、最小值。" },
        ],
        [
          { text: "sum / len", mark: true },
          { text: "：总和除以个数，得到平均值。" },
        ],
      ],
    },
    code: code(`scores = [98, 76, 88, 65, 92]
print(max(scores))
print(min(scores))
print(sum(scores))
print(sum(scores) / len(scores))`),
  },
  {
    id: "playlist-up-range",
    title: "收成列表",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      markedPoints: [
        [
          { text: "list(...)", mark: true },
          { text: "：可迭代对象都能收成列表。range 含起点、不含终点；字符串按字符拆开。" },
        ],
        [
          { text: "append(i ** 2)", mark: true },
          { text: "：逐个放进平方数。" },
        ],
      ],
    },
    code: code(`nums = list(range(1, 6))
print(nums)
print(list("abc"))

squares = []
for i in range(1, 6):
    squares.append(i ** 2)
print(squares)
print(sum(squares))`),
  },
  {
    id: "playlist-up-unique",
    title: "练习：去重",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      body: "去掉重复，只留第一次出现的。结果：['晴天', '稻香', '夜曲']。",
    },
    code: code(`songs = ["晴天", "稻香", "晴天", "夜曲", "稻香"]
`),
    hints: [
      { level: 1, text: "准备一个空列表，按顺序看 songs 里的每一首。" },
      { level: 2, text: "还没收进新列表，就是 not in。收进去用 append。" },
      {
        level: 3,
        text: `unique = []
for song in songs:
    if song not in unique:
        unique.append(song)
print(unique)`,
      },
    ],
    reveal: {
      title: "对照",
      body: "没出现过才 append。原来的 songs 不动。",
    },
    expectedOutput: "['晴天', '稻香', '夜曲']",
  },
  {
    id: "playlist-up-sorted-ask",
    title: "sorted",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      body: "sorted 排出新顺序。原来的 songs 会变吗？",
    },
    code: code(`${SONGS}
ordered = sorted(songs)
print(ordered)
print(songs)`),
    prediction: {
      question: "两行都打印之后，变量 songs 里的顺序是？",
      options: [
        { id: "same", label: "仍是晴天、稻香、夜曲", isCorrect: true },
        { id: "sorted", label: "变成夜曲、晴天、稻香" },
      ],
    },
    reveal: {
      body: "sorted 得到新列表。songs 顺序不变。",
    },
  },
  {
    id: "playlist-up-sort",
    title: "sorted 与 sort",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      markedPoints: [
        [
          { text: "sorted(songs)", mark: true },
          { text: "：新列表，原顺序不变。" },
        ],
        [
          { text: "sort()", mark: true },
          { text: "：直接改原列表，自己的返回值是 None。" },
        ],
        [
          { text: "reverse=True", mark: true },
          { text: "：从大到小，或按字母倒序。" },
        ],
      ],
    },
    code: code(`${SONGS}
print(sorted(songs))
print(songs)
print(songs.sort())
print(songs)
print(sorted(songs, reverse=True))`),
  },
  {
    id: "playlist-up-reverse",
    title: "倒序",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      markedPoints: [
        [
          { text: "reverse()", mark: true },
          { text: "：把现有顺序倒过来，改原列表，返回 None。" },
        ],
        [{ text: "再调用一次，顺序回到原来。" }],
      ],
    },
    code: code(`${SONGS}
print(songs.reverse())
print(songs)
songs.reverse()
print(songs)`),
  },
  {
    id: "playlist-up-reversed-new",
    title: "不改原列表的倒序",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      markedPoints: [
        [
          { text: "songs[::-1]", mark: true },
          { text: "：切片得到倒序的新列表。" },
        ],
        [
          { text: "list(reversed(songs))", mark: true },
          { text: "：反向迭代再收成列表。原来的顺序不变。" },
        ],
      ],
    },
    code: code(`${SONGS}
print(songs[::-1])
print(list(reversed(songs)))
print(songs)`),
  },
  {
    id: "playlist-up-two-lists",
    title: "就地修改与新建",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "就地修改与新建列表",
      bulletPoints: [
        "append、remove、pop、下标赋值、sort、reverse：改原列表。sort 和 reverse 的返回值是 None",
        "切片、sorted、[::-1]、reversed：新列表，原列表不变",
        "b = a：两个名字同一份列表，改一边另一边一起变",
      ],
    },
  },
  {
    id: "playlist-up-join",
    title: "join 与 split",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      markedPoints: [
        [
          { text: '"、".join(songs)', mark: true },
          { text: "：合成一个字符串，中间用顿号。" },
        ],
        [
          { text: 'split("、")', mark: true },
          { text: "：按顿号拆回列表。" },
        ],
      ],
    },
    code: code(`${SONGS}
line = "、".join(songs)
print(line)
again = line.split("、")
print(again)`),
  },
  {
    id: "playlist-up-search",
    title: "练习：搜索",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      body: "夜曲在歌单里。打印「第3首」；不在则打印「不存在」。",
    },
    code: code(`${SONGS4}
name = "夜曲"
`),
    hints: [
      { level: 1, text: "先判断 name in songs。" },
      { level: 2, text: "index 从 0 数。显示给用户的位置要加 1。" },
      {
        level: 3,
        text: `if name in songs:
    print(f"第{songs.index(name) + 1}首")
else:
    print("不存在")`,
      },
    ],
    reveal: {
      title: "对照",
      body: "夜曲下标 2，第 3 首。先判断再 index。",
    },
    expectedOutput: "第3首",
  },
  {
    id: "playlist-up-practice",
    title: "练习：月支出",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      body: "四周支出是 120、80、150、90。从小到大排序后打印，再打印总额。",
    },
    code: code(`costs = [120, 80, 150, 90]
`),
    hints: [
      { level: 1, text: "sort() 会改原列表。总额用 sum。" },
      { level: 2, text: "先 sort，再 print 列表，再 print 总额。" },
      {
        level: 3,
        text: `costs = [120, 80, 150, 90]
costs.sort()
print(costs)
print(sum(costs))`,
      },
    ],
    reveal: {
      title: "对照",
      body: "排序后是 80、90、120、150，总额 440。",
    },
    expectedOutput: "[80, 90, 120, 150]\n440",
  },
  {
    id: "playlist-up-summary",
    title: "本讲小结",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "从单个数据到一批数据",
      bulletPoints: [
        "一个名字记住一批有顺序的数据",
        "下标从 0 数。给用户看的序号是 i + 1",
        "只要歌名：for song in songs。要位置：下标，或 enumerate",
        "数字列表可用 max、min、sum。平均值是 sum 除以 len",
        "append、extend、+=、sort、reverse 改原列表。+、切片、sorted、reversed 得到新列表",
        "查找可以手写循环，也可以先 in 再 index",
      ],
    },
  },
  {
    id: "playlist-up-homework",
    title: "课后作业",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "课后作业",
      bulletPoints: [
        "歌单里已有晴天、稻香、夜曲，用列表保存。从键盘输入一首歌名。若这首歌已经在歌单中，输出它的位置（第 1 首的位置是 1）；否则输出「不存在」。用循环和分支完成，这一题先不使用 index()。自验：输入稻香，输出 2；输入七里香，输出不存在。",
      ],
    },
  },
];
