import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const TWO = `mine = {"晴天", "稻香", "夜曲"}
other = {"稻香", "七里香", "夜曲"}`;

/** 两份歌单：共同听过、只我听过。先运算符，方法名放小结。 */
export const scenes: DraftScene[] = [
  {
    id: "set-ops-ask",
    title: "集合运算的问题",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "我和同学各自听过哪些歌？",
      image: {
        src: "/lesson07/set-venn.svg",
        alt: "两份歌单的交集、并集、差集",
      },
      bulletPoints: [
        "我听过：晴天、稻香、夜曲",
        "同学听过：稻香、七里香、夜曲",
        "要回答三问：共同听过哪些；合在一起有哪些；哪几首只有我听过",
      ],
      preview: "下一页：先判断某一首在不在",
    },
  },
  {
    id: "set-ops-in",
    title: "成员检测（in）",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "in：问的是元素，不是下标",
      flowDiagram: [
        "元素 in 列表    # 从下标 0 起逐项比",
        "元素 in 集合    # 按元素本身判定",
      ],
      body: "写法相同。in 只回答有没有；次数要回到列表，用 count。",
    },
    code: code(`history = ["晴天", "稻香", "晴天", "夜曲"]
heard = set(history)
print("晴天" in history)
print(history.count("晴天"))
print("晴天" in heard)
print("七里香" not in heard)`),
  },
  {
    id: "set-ops-inter-union",
    title: "交集与并集",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "交集 & 　并集 |",
      flowDiagram: [
        "mine & other    # 两个人都听过",
        "mine | other    # 合在一起去重",
      ],
      body: "第一行是交集，第二行是并集。最后一行仍是原来的 mine：运算得到新集合，原来的歌单不变。",
    },
    code: code(`${TWO}
print(mine & other)
print(mine | other)
print(mine)`),
  },
  {
    id: "set-ops-diff",
    title: "差集",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "差集 -",
      flowDiagram: ["mine - other    # 我有、同学没有"],
      body: "减号左右不能对调。",
    },
    code: code(`${TWO}
print(mine - other)
print(other - mine)
print(mine)`),
  },
  {
    id: "set-ops-predict-diff",
    title: "运算得到新集合",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      body: "& 得到新集合 both。mine 仍是晴天、稻香、夜曲，len(mine) 还是 3。花括号里的先后不要当成答案。",
    },
    code: code(`${TWO}
both = mine & other
print(both)
print(mine)
print(len(mine))`),
  },
  {
    id: "set-ops-summary",
    title: "集合运算的方法",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "方法与运算符结果相同",
      flowDiagram: [
        "mine.intersection(other)  # 同 mine & other，都听过",
        "mine.union(other)          # 同 mine | other，合在一起",
        "mine.difference(other)     # 同 mine - other，只有我听过",
      ],
      body: "三行都得到新集合，mine 和 other 不变。",
    },
    code: code(`${TWO}
print(mine.intersection(other))
print(mine.union(other))
print(mine.difference(other))`),
  },
  {
    id: "set-ops-practice",
    title: "练习：交集、并集与差集",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      body: "先打印共同听过有几首，再打印只有我听过的是不是晴天、是不是稻香。",
    },
    code: code(`${TWO}
`),
    hints: [
      { level: 1, text: "共同听过用 mine & other，只有我听过用 mine - other。" },
      { level: 2, text: "用 len 看共同听过几首，用 in 看某一首在不在差集里。" },
      {
        level: 3,
        text: `print(len(mine & other))
print("晴天" in (mine - other))
print("稻香" in (mine - other))`,
      },
    ],
    reveal: {
      title: "对照",
      body: "共同听过稻香和夜曲，共 2 首。只有我听过的是晴天，不是稻香。",
    },
    expectedOutput: `2
True
False`,
  },
];
