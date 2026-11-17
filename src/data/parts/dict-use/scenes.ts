import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const LENGTH = `length = {"晴天": "4:29", "稻香": "3:43", "夜曲": "3:46"}`;

/** 第七幕：完全对标 playlist-edit 的节奏，将字典的每一个操作拆分为独立单页，配齐总览表、调试题、引用预测与练习。 */
export const scenes: DraftScene[] = [
  {
    id: "dict-use-overview",
    title: "字典的常用操作",
    type: "explain",
    layout: "fullscreen",
    content: {
      body: "今晚的歌单按歌名来查、改、删，不按下标。",
      bulletPoints: [
        "按歌名取出时长，或先问这首在不在",
        "有人点新歌就加进去；唱错时长就按歌名改",
        "唱完的歌按歌名拿掉",
      ],
    },
  },
  {
    id: "dict-use-get-key",
    title: "按键获取值",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "按键取出对应的值",
      flowDiagram: [
        "字典[Key]",
        "{\"晴天\": \"4:29\", \"稻香\": \"3:43\", \"夜曲\": \"3:46\"}",
      ],
      bulletPoints: [
        "字典没有下标 0、1、2，方括号里写的是键（Key）",
        "length[\"稻香\"] 取出对应的时长 3:43",
        "最后一行键不存在，字典[Key] 会报 KeyError",
      ],
    },
    code: code(`${LENGTH}
print(length["晴天"])
print(length["稻香"])
print(length["七里香"])`),
  },
  {
    id: "dict-use-get",
    title: "键不在时用 get",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "字典.get(键, 默认值)",
      flowDiagram: ["字典.get(键, 默认值)"],
      body: "键在就返回时长，键不在就返回默认值，不报错。",
    },
    code: code(`${LENGTH}
print(length.get("稻香", "歌单里没有"))
print(length.get("七里香", "歌单里没有"))`),
  },
  {
    id: "dict-use-predict-in",
    title: "判断 Key 是否存在（in）",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      body: "🤔 in 用在字典上时，判断的是键 还是 值？",
    },
    code: code(`${LENGTH}
print("稻香" in length)
print("3:43" in length)`),
    prediction: {
      question: "两行 print 的结果分别是？",
      options: [
        { id: "tf", label: "True 和 False", isCorrect: true },
        { id: "tt", label: "True 和 True" },
        { id: "ft", label: "False 和 True" },
      ],
    },
    reveal: {
      title: "in 默认只检查 Key，不检查 Value",
      body: "\"稻香\" 是歌名，也就是键，结果为 True。\"3:43\" 是时长，也就是值，不是键，所以 \"3:43\" in length 为 False。",
    },
  },
  {
    id: "dict-use-in-then-get",
    title: "先问再取",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      
      flowDiagram: ["if 键 in 字典:", "    字典[键]"],
      body: "先用 in 问歌名在不在。在，再按键取时长，避免 KeyError。",
    },
    code: code(`${LENGTH}
if "稻香" in length:
    print(length["稻香"])`),
  },
  {
    id: "dict-use-views",
    title: "获取全部的键、值、键值对",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "keys()、values() 与 items()",
      image: {
        src: "/lesson07/dict-views.svg",
        alt: "keys() 获取全部键、values() 获取全部值、items() 获取全部键值对",
      },
      flowDiagram: [
        "字典.keys()     # 全部歌名",
        "字典.values()   # 全部时长",
        "字典.items()    # 歌名和时长成对",
      ],
      body: "直接打印 .keys() 得到的是视图 dict_keys，外面套 list() 才变成列表。",
    },
    code: code(`${LENGTH}
print(length.keys())
print(list(length.keys()))
print(list(length.values()))
print(list(length.items()))`),
  },
  {
    id: "dict-use-assign",
    title: "新增与修改键值对",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
     
      image: {
        src: "/lesson07/dict-mutation.svg",
        alt: "字典赋值：Key不存在则新增，Key已存在则覆盖修改",
      },
      flowDiagram: ["字典[Key] = Value"],
      body: "字典和列表一样可以修改。通过 Key 改对应的 Value：Key 不存在就是新增，Key 已存在就是覆盖原来的值。",
      bulletPoints: [
        "字典不靠位置编号排列，不能像列表那样用下标 0、1、2 去改",
        "要改某一项，只能通过 Key 找到它",
      ],
    },
    code: code(`length = {"晴天": "4:29", "稻香": "3:43"}
# Key 不存在 -> 新增一首歌
length["夜曲"] = "3:46"
print(length)

# Key 已存在 -> 修改这首歌的时长
length["晴天"] = "4:11"
print(length)`),
  },
  {
    id: "dict-use-update",
    title: "批量更新（update）",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "把另一份歌单并进来",
      flowDiagram: ["字典.update(其它字典)"],
      body: "update 按键并入另一份字典。",
    },
    code: code(`${LENGTH}
more = {"晴天": "4:11", "七里香": "4:59"}
length.update(more)
print(length)`),
    prediction: {
      question: "update 之后，晴天、稻香、七里香的时长分别是？",
      options: [
        { id: "cover-add", label: "4:11、3:43、4:59", isCorrect: true },
        { id: "keep-sunny", label: "4:29、3:43、4:59（晴天仍是原来的时长）" },
        { id: "no-new", label: "4:11、3:43、歌单里没有（七里香加不进去）" },
      ],
    },
    reveal: {
      title: "已有的键被覆盖，没有的键被新增",
      body: "晴天原来就在，时长改成 4:11。稻香不在 more 里，仍是 3:43。七里香是新键，加进来，时长 4:59。",
    },
  },
  {
    id: "dict-use-del",
    title: "删除元素（pop 与 del）",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "按键删除键值对",
      flowDiagram: [
        "值 = 字典.pop(Key)",
        "del 字典[Key]",
      ],
      body: "列表的 pop() 从末尾拿一项。字典的 pop(歌名) 按歌名删，并把时长交回来。del 只删，没有返回值。歌名不存在时，del 会 KeyError。不写第二个参数时，pop(\"七里香\") 同样会 KeyError；只有 pop(歌名, 默认值) 才返回默认值、不报错。",
    },
    code: code(`${LENGTH}
val = length.pop("晴天")
print("取出的时长:", val)
print("pop 后的歌单:", length)

del length["稻香"]
print("del 后的歌单:", length)

print(length.pop("七里香", "歌单里没有"))
print("还剩几首:", len(length))`),
  },
  {
    id: "dict-use-alias",
    title: "赋值与对象别名",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      body: "🤔  b = a 发生了什么❓",
    },
    code: code(`a = {"晴天": "4:29"}
b = a
b["晴天"] = "4:11"
print(a["晴天"])`),
    prediction: {
      question: "print(a[\"晴天\"]) 得到什么？",
      options: [
        { id: "new", label: "4:11", isCorrect: true },
        { id: "old", label: "4:29" },
        { id: "err", label: "引发异常" },
      ],
    },
    reveal: {
      title: "两个名字指向同一个字典",
      body: "b = a 并不复制歌单，a 与 b 指向同一对象。经 b 把晴天改成 4:11 后，a 里也是 4:11。要单独留一份，用下一页的 copy()。",
    },
  },
  {
    id: "dict-use-copy",
    title: "复制字典（copy）",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      
      stepRun: true,
    },
    code: code(`a = {"晴天": "4:29"}
b = a

b["晴天"] = "4:11"

c = {"晴天": "4:29"}
d = c.copy()
d["晴天"] = "4:11"`),
  },
  {
    id: "dict-use-list-value",
    title: "值为列表的字典",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      body: "按歌手取出的是列表。点下一步：append 往这张列表里加一格，不是再写一个键。",
      stepRun: true,
    },
    code: code(`albums = {"周杰伦": ["晴天", "稻香"], "林俊杰": ["江南"]}
albums["周杰伦"].append("夜曲")`),
  },
  {
    id: "dict-use-practice",
    title: "练习：新歌追加还是整份替换",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`# more 是新上榜的歌
# 已经在榜上的歌手：新歌追加进去，原来的歌要留着
# 还没有的歌手：整份加进 chart
# 各打印一行：Jay 的歌、Jolin 的歌
chart = {"Jay": ["晴天"], "Eason": ["十年"]}
more = {"Jay": "七里香", "Jolin": "日不落"}
`),
    hints: [
      { level: 1, text: "Jay 已经在 chart 里，取出的是列表，用 append 加「七里香」。不要用 update，否则原来的「晴天」会被盖掉。" },
      { level: 2, text: "Jolin 不在 chart 里，赋一份新列表：chart[\"Jolin\"] = [\"日不落\"]。" },
      {
        level: 3,
        text: `chart["Jay"].append(more["Jay"])
chart["Jolin"] = [more["Jolin"]]
print(chart["Jay"])
print(chart["Jolin"])`,
      },
    ],
    reveal: {
      title: "对照",
      body: "Jay 原来就有「晴天」，七里香追加在后面。Jolin 是新歌手，值写成只有「日不落」的列表。update 会把 Jay 的整份列表换成字符串，第一行就对不上。",
    },
    expectedOutput: `['晴天', '七里香']
['日不落']`,
  },
];
