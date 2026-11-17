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
      { level: 3, text: "print(len(heard))" },
    ],
    reveal: {
      title: "对照",
      body: "集合没有下标，也不能切片。要看有几首，用 len(heard)。",
    },
    expectedOutput: "2",
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
print(heard)
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
print(heard)`),
  },
  {
    id: "set-edit-discard",
    title: "删除元素 discard 与 remove",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "删一首：discard 与 remove",
      flowDiagram: [
        "集合.discard(元素)",
        "集合.remove(元素)",
      ],
      body: "歌在集合里时，两行都删掉它。差别在这首本来没有：discard 保持原样，程序继续；remove 报 KeyError，停住。",
    },
    code: code(`heard = {"晴天", "稻香", "夜曲"}
heard.discard("七里香")
heard.remove("夜曲")
print(heard)`),
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
    editorOnly: true,
    content: {},
    code: code(`# heard 里已有晴天、稻香。
# 用 add 加入夜曲。
# 用 discard 删掉晴天。
# 七里香可能不在里面，也用 discard 删，没有就跳过。
# 然后依次打印三行："夜曲" in heard、"晴天" in heard、len(heard)。
${HEARD}
`),
    hints: [
      { level: 1, text: "加入写 heard.add(\"夜曲\")。删掉写 heard.discard(\"歌名\")。七里香用 discard，不要用 remove，否则这首不在会 KeyError。" },
      { level: 2, text: "打印用 print(\"夜曲\" in heard)、print(\"晴天\" in heard)、print(len(heard))。" },
      {
        level: 3,
        text: `${HEARD}
heard.add("夜曲")
heard.discard("晴天")
heard.discard("七里香")
print("夜曲" in heard)
print("晴天" in heard)
print(len(heard))`,
      },
    ],
    reveal: {
      title: "对照",
      body: "加入夜曲、去掉晴天、忽略没有的七里香。夜曲还在，晴天不在，一共 2 首。",
    },
    expectedOutput: `True
False
2`,
  },
];
