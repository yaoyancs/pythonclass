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
print(sorted(mine & other))
print(sorted(mine | other))
print(sorted(mine))`),
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
print(sorted(mine - other))
print(sorted(other - mine))
print(sorted(mine))`),
  },
  {
    id: "set-ops-predict-diff",
    title: "预测：原集合变不变",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      body: "交集赋给 both 之后，mine 里还剩哪些歌？",
    },
    code: code(`${TWO}
both = mine & other
print(sorted(both))
print(sorted(mine))`),
    prediction: {
      question: "两行 print 依次是？",
      options: [
        { id: "new-and-mine", label: "['夜曲', '稻香'] 和 ['夜曲', '晴天', '稻香']", isCorrect: true },
        { id: "mine-shrunk", label: "['夜曲', '稻香'] 和 ['夜曲', '稻香']" },
        { id: "same-three", label: "两行都是 ['夜曲', '晴天', '稻香']" },
      ],
    },
    reveal: {
      title: "运算得到新集合",
      body: "& 得到新集合 both。mine 仍是晴天、稻香、夜曲。",
    },
  },
  {
    id: "set-ops-summary",
    title: "集合运算小结",
    type: "explain",
    layout: "fullscreen",
    content: {
      compareTable: {
        indexHeader: "编号",
        leftHeader: "使用方式",
        rightHeader: "作用",
        rows: [
          { left: "元素 in 集合", right: "这首歌是否出现过" },
          { left: "mine & other", right: "交集：两个人都听过（新集合）" },
          { left: "mine | other", right: "并集：合在一起去重（新集合）" },
          { left: "mine - other", right: "差集：只有我听过（新集合）" },
        ],
      },
      body: "方法名 intersection、union、difference 与 & | - 结果相同。课堂用运算符即可。",
    },
  },
  {
    id: "set-ops-practice",
    title: "练习：交集、并集与差集",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      body: "先输出共同听过的歌，再输出只有我听过的歌。每组按字典序，每首歌一行。",
    },
    code: code(`${TWO}
`),
    hints: [
      { level: 1, text: "共同听过用 mine & other，只有我听过用 mine - other。" },
      { level: 2, text: "sorted() 排好序，再用 for 一行打印一首。" },
      {
        level: 3,
        text: `for name in sorted(mine & other):
    print(name)
for name in sorted(mine - other):
    print(name)`,
      },
    ],
    reveal: {
      title: "对照",
      body: "先是夜曲、稻香，然后是晴天。",
    },
    expectedOutput: `夜曲
稻香
晴天`,
  },
];
