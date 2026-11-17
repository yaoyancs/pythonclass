import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const HEARD = `heard = {"晴天", "稻香"}`;

/** 听过的歌要能加、能删。不讲 pop、clear；remove 与 discard 放在同一需求里对照。 */
export const scenes: DraftScene[] = [
  {
    id: "set-edit-index",
    title: "代码分析",
    type: "debug",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`${HEARD}
print(heard[0])`),
    hints: [
      { level: 1, text: "集合不能像列表那样写 heard[0]。" },
      { level: 2, text: "TypeError: 'set' object is not subscriptable 表示不支持下标。" },
      { level: 3, text: "print(sorted(heard))" },
    ],
    reveal: {
      title: "对照",
      body: "集合没有下标，也不能切片。需要固定顺序时，用 sorted(heard) 得到列表。",
    },
    expectedOutput: "['晴天', '稻香']",
  },
  {
    id: "set-edit-add",
    title: "添加元素（add）",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "add：加入一首歌",
      flowDiagram: ["集合.add(元素)"],
      body: "七里香第一次出现。晴天已经听过，再 add 一次。先判断 len(heard)。",
    },
    code: code(`${HEARD}
heard.add("七里香")
heard.add("晴天")
print(sorted(heard))
print(len(heard))`),
    prediction: {
      question: "两次 add 之后，len(heard) 是？",
      options: [
        { id: "three", label: "3（晴天已在，不再加一份）", isCorrect: true },
        { id: "four", label: "4（晴天又加了一份）" },
        { id: "two", label: "2（七里香加不进去）" },
      ],
    },
    reveal: {
      title: "已有的元素再 add，集合不变",
      body: "七里香是新的，加进去。晴天已经在集合里，再 add 一次不会变成两份。晴天、稻香、七里香，len 是 3。",
    },
  },
  {
    id: "set-edit-update",
    title: "批量添加（update）",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "update：一次并入多首",
      flowDiagram: ["集合.update(列表)"],
      body: "同学推荐夜曲、七里香、晴天。已经听过的晴天不会变成两份。字典的 update 按键覆盖或新增；集合的 update 把列表里的元素并进来，已有的忽略。",
    },
    code: code(`${HEARD}
heard.update(["夜曲", "七里香", "晴天"])
print(sorted(heard))`),
  },
  {
    id: "set-edit-discard",
    title: "删除元素 discard()方法",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
    },
    code: code(`heard = {"晴天", "稻香", "夜曲"}
heard.discard("七里香")
heard.discard("夜曲")
print(sorted(heard))`),
    prediction: {
      question: "discard(\"七里香\") 会不会让程序停？",
      options: [
        { id: "go", label: "不会，程序继续", isCorrect: true },
        { id: "key", label: "会，KeyError 停住" },
        { id: "type", label: "会，TypeError 停住" },
      ],
    },
    reveal: {
      title: "discard：有就删，没有也不报错",
      body: "remove 在元素不存在时才会 KeyError。",
    },
  },
  {
    id: "set-edit-summary",
    title: "增删小结",
    type: "explain",
    layout: "fullscreen",
    content: {
      compareTable: {
        indexHeader: "编号",
        leftHeader: "使用方式",
        rightHeader: "作用",
        rows: [
          { left: "集合.add(元素)", right: "加入一首；已经有则忽略" },
          { left: "集合.update(容器)", right: "把列表或另一集合里的歌去重后并入" },
          { left: "集合.discard(元素)", right: "删除一首；没有则保持不变" },
          { left: "集合.remove(元素)", right: "删除一首；没有则 KeyError" },
          { left: "len(集合)", right: "不同歌曲的数量" },
        ],
      },
    },
  },
  {
    id: "set-edit-practice",
    title: "练习：增删集合成员",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      body: "heard 里已有晴天、稻香。加入夜曲，删掉晴天，对可能不存在的七里香用安全删除，最后打印 sorted(heard)。",
    },
    code: code(`${HEARD}
`),
    hints: [
      { level: 1, text: "加入用 add；可能没有的歌用 discard。" },
      { level: 2, text: "依次 add(\"夜曲\")、discard(\"晴天\")、discard(\"七里香\")。" },
      {
        level: 3,
        text: `${HEARD}
heard.add("夜曲")
heard.discard("晴天")
heard.discard("七里香")
print(sorted(heard))`,
      },
    ],
    reveal: {
      title: "对照",
      body: "加入夜曲、去掉晴天、忽略没有的七里香后，排序结果为 ['夜曲', '稻香']。",
    },
    expectedOutput: "['夜曲', '稻香']",
  },
];
