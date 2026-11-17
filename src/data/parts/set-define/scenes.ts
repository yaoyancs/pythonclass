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
        "不要依赖打印顺序，问的是有没有这些歌",
      ],
      stepRun: true,
    },
    code: code(`heard = {"晴天", "稻香", "夜曲"}
print(heard)
print(type(heard))`),
  },
  {
    id: "set-define-dup",
    title: "元素唯一且不可变",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      bulletPoints: [
        "同一元素写两次，只留一份，不报错",
        "元素必须是不可变类型：str / int / tuple 可以；list 不可以",
      ],
    },
    code: code(`heard = {"晴天", "稻香", "晴天", "夜曲", "稻香"}
print(heard)
print(len(heard))

bad = {["晴天", "稻香"]}
print(bad)`),
    prediction: {
      question: "print(len(heard)) 的结果是？",
      options: [
        { id: "three", label: "3", isCorrect: true },
        { id: "five", label: "5" },
        { id: "error", label: "引发异常" },
      ],
    },
    reveal: {
      title: "重复只留一份，列表不能当元素",
      body: "字面量写了 5 项，去重后是晴天、稻香、夜曲，len 为 3。最后一行把列表放进花括号，创建时失败。",
    },
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
        ],
      },
    },
  },
  {
    id: "set-define-practice",
    title: "练习：统计不同元素个数",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      body: "history 是最近播放。用集合去重后，打印不同歌曲的数量。",
    },
    code: code(`${HISTORY}
`),
    hints: [
      { level: 1, text: "set(history) 把列表转成集合。" },
      { level: 2, text: "再用 len() 打印集合里有几首歌。" },
      {
        level: 3,
        text: `${HISTORY}
heard = set(history)
print(len(heard))`,
      },
    ],
    reveal: {
      title: "对照",
      body: "5 次点击里只有晴天、稻香、夜曲 3 首，len(set(history)) 为 3。",
    },
    expectedOutput: "3",
  },
];
