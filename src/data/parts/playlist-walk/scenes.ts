import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const SONGS = `songs = ["晴天", "稻香", "夜曲"]`;

/** 第四幕：只要歌名，或还要序号。len 是当前有几首。 */
export const scenes: DraftScene[] = [
  {
    id: "playlist-walk-ask",
    title: "遍历任务",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "遍历列表",
      body: "按顺序显示歌单，序号从 1 开始。",
      preview: "先复习已经学过的 for",
    },
  },
  {
    id: "playlist-walk-item",
    title: "遍历元素",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      markedPoints: [
        [
          { text: "for song in songs", mark: true },
          { text: "：每次取出一首歌名。" },
        ],
        [{ text: "song 就是当前这首歌。" }],
      ],
    },
    code: code(`${SONGS}
for song in songs:
    print(song)`),
  },
  {
    id: "playlist-walk-index",
    title: "遍历索引",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      markedPoints: [
        [
          { text: "len(songs)", mark: true },
          { text: "：有几首。" },
        ],
        [
          { text: "range(len(songs))", mark: true },
          { text: "：下标 0、1、2。" },
        ],
        [
          { text: "i + 1", mark: true },
          { text: "：第几首。songs[i]：那首歌。" },
        ],
      ],
    },
    code: code(`${SONGS}
for i in range(len(songs)):
    print(i + 1, songs[i])`),
  },
  {
    id: "playlist-walk-enum",
    title: "enumerate",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      markedPoints: [
        [
          { text: "enumerate(songs)", mark: true },
          { text: "：同时给出下标和歌名。下标从 0 开始。" },
        ],
        [
          { text: "start=1", mark: true },
          { text: "：序号直接从 1 开始，不必再加 1。" },
        ],
      ],
    },
    code: code(`${SONGS}
for i, song in enumerate(songs):
    print(i, song)

for n, song in enumerate(songs, start=1):
    print(n, song)`),
  },
  {
    id: "playlist-walk-choose",
    title: "访问方式的选择",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "按任务选择访问方式",
      body: "只打印歌名，用哪一种？",
      codeComparison: {
        left: {
          label: "任务 A：逐首显示歌名",
          code: "for song in songs:\n    print(song)",
        },
        right: {
          label: "任务 B：显示序号和歌名",
          code: "for i in range(len(songs)):\n    print(i + 1, songs[i])",
        },
      },
    },
    code: code(`${SONGS}
for song in songs:
    print(song)`),
    prediction: {
      question: "只打印歌名、不打印序号时，哪一种更直接？",
      options: [
        { id: "item", label: "for song in songs", isCorrect: true },
        { id: "index", label: "for i in range(len(songs))" },
      ],
    },
    reveal: {
      body: "只要歌名：for song in songs。要序号：打印 i + 1 和 songs[i]。",
    },
  },
  {
    id: "playlist-walk-ex",
    title: "练习：序号与歌名",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      body: "每行打印：序号 歌名。序号从 1 开始。",
    },
    code: code(`${SONGS}
`),
    hints: [
      { level: 1, text: "需要位置，用 range(len(songs))。" },
      { level: 2, text: "给用户看的序号是 i + 1，取歌仍用 songs[i]。" },
      { level: 3, text: "for i in range(len(songs)):\n    print(i + 1, songs[i])" },
    ],
    reveal: {
      title: "对照",
      body: "i 是 0、1、2，打印出来是 1、2、3。",
    },
    expectedOutput: "1 晴天\n2 稻香\n3 夜曲",
  },
  {
    id: "playlist-walk-practice",
    title: "练习：体温复查",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      body: "4 个体温依次是 36.5、37.8、36.6、38.2。高于 37.3 的，打印「第n个偏高」。n 从 1 数。",
    },
    code: code(`temps = [36.5, 37.8, 36.6, 38.2]
`),
    hints: [
      { level: 1, text: "要知道第几个，用 range(len(temps))。" },
      { level: 2, text: "temps[i] > 37.3 时，打印的序号是 i + 1。" },
      {
        level: 3,
        text: `temps = [36.5, 37.8, 36.6, 38.2]
for i in range(len(temps)):
    if temps[i] > 37.3:
        print(f"第{i + 1}个偏高")`,
      },
    ],
    reveal: {
      title: "对照",
      body: "37.8 是第 2 个，38.2 是第 4 个。",
    },
    expectedOutput: "第2个偏高\n第4个偏高",
  },
];
