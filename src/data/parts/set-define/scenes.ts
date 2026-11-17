import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const HISTORY = `history = ["晴天", "稻香", "晴天", "夜曲", "稻香"]`;

/** 语法从「听过的歌」长出来：字面量、空集合与 {} 冲突、set(列表) 去重。 */
export const scenes: DraftScene[] = [
  {
    id: "set-define-syntax",
    title: "定义集合",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "只写下过哪些歌",
      flowDiagram: [
        "{元素1, 元素2, 元素3, ...}",
        "heard = {元素1, 元素2, 元素3, ...}",
        "heard = set()    # 空集合，不能写成 {}",
      ],
      body: "集合用花括号 {}，元素之间用逗号隔开。这里没有键，每一项就是一个元素。一个元素都没有时，空集合必须写 set()。",
      bulletPoints: [
        "和字典一样用 {}，但里面不是 key: value",
        "空集合写成 set()；{} 是空字典",
        "没有顺序：花括号里先写后写，比的是有没有这些歌",
      ],
      stepRun: true,
    },
    code: code(`heard = {"晴天", "稻香", "夜曲"}
again = {"夜曲", "晴天", "稻香"}
print(heard)
print(again)
print(heard == again)

songs = ["晴天", "稻香", "夜曲"]
print(songs == ["夜曲", "晴天", "稻香"])`),
  },
  {
    id: "set-define-dup",
    title: "元素唯一且不可变",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      bulletPoints: [
        "同一元素写两次，只留一份，不报错",
        "元素必须是不可变类型：str / int / tuple 可以；list 不可以",
      ],
      stepRun: true,
    },
    code: code(`heard = {"晴天", "稻香", "晴天", "夜曲", "稻香"}
print(heard)
print(len(heard))

bad = {["晴天", "稻香"]}
print(bad)`),
  },
  {
    id: "set-define-from-list",
    title: "由列表转成集合",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: { stepRun: true },
    code: code(`${HISTORY}
heard = set(history)
print(history)
print(heard)
print(len(heard))`),
  },
  {
    id: "set-define-summary",
    title: "集合创建小结",
    type: "explain",
    layout: "fullscreen",
    content: {
      note: {
        title: "集合创建小结",
        points: [
          "集合解决什么问题？\n只记录元素是否出现过。最近播放用列表；「听过哪些歌」用集合。",
          "定义语法\n{元素1, 元素2, …}；空集合必须写 set()，{} 是空字典。",
          "已有列表怎么去重？\nset(列表) 得到新集合，原列表不变。重复项只留一份。",
          "有没有顺序？\n没有。写法顺序不同的两个集合，元素一样就相等。列表换个顺序就不相等。打印出来的先后也不要当成「第几首」。",
        ],
      },
    },
  },
  {
    id: "set-define-practice",
    title: "练习：合并两份歌单并去重",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      body: "mine 是我的收藏，tips 是同学推荐，两边都有重复。合并成一份不重复的歌单，打印一共几首，以及七里香、晴天在不在。",
    },
    code: code(`mine = ["晴天", "稻香", "晴天", "夜曲"]
tips = ["稻香", "七里香", "夜曲", "稻香"]
`),
    hints: [
      { level: 1, text: "先把两个列表接成一个，再 set() 去重。" },
      { level: 2, text: "len 看去重后有几首，in 看某一首在不在。" },
      {
        level: 3,
        text: `mine = ["晴天", "稻香", "晴天", "夜曲"]
tips = ["稻香", "七里香", "夜曲", "稻香"]
heard = set(mine + tips)
print(len(heard))
print("七里香" in heard)
print("晴天" in heard)`,
      },
    ],
    reveal: {
      title: "对照",
      body: "两份名单接在一起有 8 次出现，去重后是晴天、稻香、夜曲、七里香，共 4 首。集合不保留名单里的先后。",
    },
    expectedOutput: `4
True
True`,
  },
];
