import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 本讲开场：先用「抽屉贴标签」引出字典，再延续第 6 讲歌单看两列数据对不齐的问题。 */
export const scenes: DraftScene[] = [
  {
    id: "dict-why-drawer",
    title: "为什么需要字典",
    type: "explain",
    layout: "fullscreen",
    content: {
      images: [
        {
          src: "/lesson07/drawer-list.png",
          alt: "没有标签的一排抽屉，只能一个个打开检查",
          caption: "列表 List：没有标签，只能逐个打开查找",
        },
        {
          src: "/lesson07/drawer-label.png",
          alt: "给抽屉贴上标签，按标签直接定位",
          caption: "字典 Dict：贴上标签，按 Key 立刻定位",
        },
      ],
      body: "列表就像一排抽屉，每一格都是一个存储单元，比一个个变量存放高效得多；但找东西时容易忘在哪格，只能逐个打开检查。给抽屉贴上标签，下次按标签就能立刻找到位置——这就是字典（Dict）。",
      bulletPoints: [
        "标签与内容：每个元素都有一个标签（Key），对应存放着它的值（Value）",
        "Key 唯一：抽屉不能重名，否则分不清到底要找哪一个",
        "Value 多样：里面可以放数字、字符串、列表，甚至另一个字典",
      ],
   
    },
  },
  {
    id: "dict-why-scan",
    title: "平行列表的局限",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      bulletPoints: [
        "点一首歌，要先在歌名列找到它在第几行，再取同一行的时长",
        "两列必须同一行对齐，错一位，后面每首歌的时长都错",
        "歌名列插进或删掉一首，时长列没跟着改，进度条就对错歌",
      ],
    },
    code: code(`songs = ["晴天", "稻香", "夜曲"]
durations = ["4:29", "3:43", "3:46"]
idx = songs.index("稻香")
print(idx)
print(durations[idx])`),
  },
  {
    id: "dict-why-need",
    title: "按键取值",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "字典{key:value, key:value, ...}",
      image: {
        src: "/lesson07/lookup-vs-scan.svg",
        alt: "歌单自第 1 首起逐项比较；字典按歌名直接取时长",
      },
      flowDiagram: [
        "{键: 值, 键: 值, ...}",
        "durations[\"稻香\"]",
      ],
      body: "歌名是键，时长是值。",
    },
    code: code(`durations = {"晴天": "4:29", "稻香": "3:43", "夜曲": "3:46"}
print(durations["稻香"])`),
  },
  {
    id: "dict-why-zip",
    title: "由两列列表构造字典",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      
      flowDiagram: [
        "length = dict(zip(songs, durations))",
        "liked = {}    # 空字典，今晚还没点歌",
      ],
      body: "zip 按同一下标把歌名和时长配成一对，dict 收成映射。两列长度应相同。空字典写成 {}。",
    },
    code: code(`songs = ["晴天", "稻香", "夜曲"]
durations = ["4:29", "3:43", "3:46"]
length = dict(zip(songs, durations))
print(length)

liked = {}
print(liked)`),
  },
  {
    id: "dict-why-dup-key",
    title: "键必须唯一且不可变",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "键必须唯一且不可变",
      bulletPoints: [
        "键必须唯一：同一键写两次，后写的值覆盖先写的",
        "键必须是不可变类型：str / int / tuple 可以；list 不可以",
      ],
     
     
    },
    code: code(`durations = {"晴天": "4:29", "稻香": "3:43", "晴天": "4:11"}
print(durations)
print(durations["晴天"])

length = {["周杰伦", "晴天"]: "4:29"}
print(length)`),
  },
  {
    id: "dict-why-nest",
    title: "字典的嵌套",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
    
      image: {
        src: "/lesson07/dict-nest.svg",
        alt: "嵌套字典两层按键取值示意图",
      },
      flowDiagram: [
        "字典[外层键][内层键]",
      ],
      body: "同名歌靠歌手区分：值可以是另一份字典。先按歌手取出他的歌，再按歌名取时长。",
    },
    code: code(`playlist = {
    "周杰伦": {"晴天": "4:29", "稻香": "3:43"},
    "林俊杰": {"江南": "4:27"},
}
print(playlist["周杰伦"])
print(playlist["周杰伦"]["晴天"])`),
  },
  {
    id: "dict-why-summary",
    title: "字典定义小结",
    type: "explain",
    layout: "fullscreen",
    content: {
      note: {
        title: "字典创建小结",
        points: [
          "字典解决什么问题？\n将标识与信息绑定为键值对，按 Key 检索，无需维护两个列表的下标对应关系。",
          "定义语法\n{键: 值, …}；空字典写成 {}；两列列表用 dict(zip(键列表, 值列表))。",
          "键值对有什么要求？\n键必须唯一（后写的值覆盖先写的），且必须是不可变类型。值可以是字符串，也可以是另一份字典：字典[外层键][内层键]。",
        ],
      },
    },
  },
  {
    id: "dict-why-practice",
    title: "练习：由两列数据构造字典",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`# 任务：创建 歌手 → 上榜曲字典

songs = ["晴天", "十年", "光年之外", "七里香"]
singers = ["Jay", "Eason", "Gem", "Jay"]
`),
    hints: [
      { level: 1, text: "dict(zip(songs, durations)) 按位置配对。" },
      { level: 2, text: "赋给 length 后，用 length[\"稻香\"] 取值。" },
      {
        level: 3,
        text: `songs = ["晴天", "十年", "光年之外", "七里香"]
singers = ["Jay", "Eason", "Gem", "Jay"]
length = dict(zip(singers, singers))
print(length["七里香"])`,
      },
    ],
    reveal: {
      title: "对照",
      body: "歌名和时长两列构造成映射后，按键「Jay」取值，结果为 七里香。",
    },
    expectedOutput: "3:43",
  },
];
