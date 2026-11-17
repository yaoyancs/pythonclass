import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const PLAYS = `plays = {"晴天": 12, "稻香": 30, "夜曲": 7}`;

/** 延续歌单：同一份播放次数，遍历、计数。综合实例放在全讲作业前。 */
export const scenes: DraftScene[] = [
  {
    id: "dict-walk-for-keys",
    title: "遍历字典（方式 1：keys）",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "循环取出全部 Key",
      flowDiagram: [
        "for key in 字典.keys():",
        "    print(\"key:\", key)",
      ],
      body: ".keys() 每次给出一个键。这里只打印歌名，不打印次数。",
      bulletPoints: [
        "字典没有整数下标，不能用 while 配下标逐项遍历",
      ],
    },
    code: code(`${PLAYS}
for key in plays.keys():
    print("key:", key)`),
  },
  {
    id: "dict-walk-for-values",
    title: "遍历字典（方式 2：values）",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "循环取出全部 Value",
      flowDiagram: [
        "for value in 字典.values():",
        "    print(\"value:\", value)",
      ],
      body: ".values() 每次给出一个值。这里只打印次数，歌名不会出现。",
    },
    code: code(`${PLAYS}
for value in plays.values():
    print("value:", value)`),
  },
  {
    id: "dict-walk-for-items",
    title: "遍历字典（方式 3：items）",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "同时取出 Key 和 Value",
      flowDiagram: [
        "for key, value in 字典.items():",
        "    print(\"key:\", key, \", value:\", value)",
      ],
      body: ".items() 每次同时给出键和值，解包到两个变量上。",
      bulletPoints: [
        "key 绑定歌名",
        "value 绑定播放次数",
      ],
    },
    code: code(`${PLAYS}
for key, value in plays.items():
    print("key:", key, ", value:", value)`),
  },
  {
    id: "dict-walk-choose",
    title: "遍历方式对比",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "直接 for 遍历字典得到什么？",
      codeComparison: {
        left: {
          label: "写法 A：直接遍历字典",
          code: "for x in plays:\n    print(x)",
        },
        right: {
          label: "写法 B：遍历 items()",
          code: "for k, v in plays.items():\n    print(k, v)",
        },
      },
    },
    code: code(`${PLAYS}
for x in plays:
    print(x)`),
    prediction: {
      question: "直接写 for x in plays: 时，打印出来的 x 是什么？",
      options: [
        { id: "key", label: "只是键（晴天、稻香、夜曲）", isCorrect: true },
        { id: "val", label: "只是值（12、30、7）" },
        { id: "both", label: "键和值一起打印" },
      ],
    },
    reveal: {
      title: "直接遍历字典得到的是 Key",
      body: "for x in plays 和 for key in plays.keys() 一样，取出的是歌名。只要次数用 .values()；歌名和次数一起用 .items()。",
    },
  },
  {
    id: "dict-walk-tally",
    title: "应用：频次统计",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "每听一次，对应次数加 1",
      body: "history 记下每一次点击。右侧逐步执行：还没有这把钥匙时从 0 起算，再碰到同一首歌就加 1。",
      stepRun: true,
    },
    code: code(`history = ["晴天", "稻香", "晴天", "夜曲", "稻香", "晴天"]
counts = {}
for name in history:
    counts[name] = counts.get(name, 0) + 1
print(counts)`),
  },
  {
    id: "dict-walk-mutate",
    title: "遍历过程中修改字典",
    type: "debug",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`${PLAYS}
for name in plays:
    if name == "稻香":
        del plays[name]
print(plays)`),
    hints: [
      { level: 1, text: "遍历字典的同时增删它的键，会报 RuntimeError。" },
      { level: 2, text: "for 循环里不要 del。先用变量记下「稻香」，循环结束后再 pop。" },
      {
        level: 3,
        text: `${PLAYS}
found = None
for name in plays:
    if name == "稻香":
        found = name
if found is not None:
    plays.pop(found, None)
print(plays)`,
      },
    ],
    reveal: {
      title: "对照",
      body: "遍历这个字典时不能增删它的键。循环里先记下歌名，循环结束后再 pop。",
    },
    expectedOutput: "{'晴天': 12, '夜曲': 7}",
  },
  {
    id: "dict-walk-traits",
    title: "字典的特点",
    type: "explain",
    layout: "fullscreen",
    content: {
      body: "字典以「键值对（Key: Value）」的方式存储关联数据。",
      bulletPoints: [
        "可以容纳多个数据，每个元素是一组「键: 值」",
        "Key 不可重复（重复会对原有数据覆盖），Value 可以重复",
        "Key 必须是不可变类型，Value 可以是任意类型",
        "没有整数下标，只能通过 Key 取得对应的 Value",
        "可以修改（支持新增、更新、删除键值对）",
        "逐项遍历用 for；不能用下标配合 while 逐项走。while 仍可用于菜单",
      ],
    },
  },
  {
    id: "dict-walk-summary",
    title: "字典总结",
    type: "explain",
    layout: "fullscreen",
    content: {
      note: {
        title: "",
        points: [
          "字典的定义方式\n{key: value, key: value, ……}；空字典写成 {} 或 dict()。",
          "字典的常用操作\n字典[key] 或 get 取值；字典[key] = value 新增或修改；pop 按键删除；keys / values / items 取出键、值、键值对。循环里可用 get 累加次数。",
          "字典的注意事项\nKey 不可重复且不可变；in 默认只判断 Key 是否存在；没有整数下标，不能靠下标配合 while 逐项遍历。",
        ],
      },
    },
  },
];
