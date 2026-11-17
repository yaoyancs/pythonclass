import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const QUEUE = `queue = [
    "周宁",
    "李想",
    "赵敏",
    "陈一",
]`;

const RECORD = `record = ("周宁", "62220001")`;

function practice(
  id: string,
  title: string,
  body: string,
  initial: string,
  hint: [string, string, string],
  reveal: string,
  expectedOutput: string,
): DraftScene {
  return {
    id,
    title,
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: { body },
    code: code(initial),
    hints: [
      { level: 1, text: hint[0] },
      { level: 2, text: hint[1] },
      { level: 3, text: hint[2] },
    ],
    reveal: { title: "对照", body: reveal },
    expectedOutput,
  };
}

/** 卡号与元组：不可变身份信息、打包拆包。 */
export const scenes: DraftScene[] = [
  {
    id: "tuple-card-bridge",
    title: "过渡",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      body: "排队名单会变；办业务还要核对卡号。卡号写错或被程序改掉是事故。",
      markedPoints: [
        [{ text: "queue 是名单：可以增删改。" }],
        [{ text: "卡号、身份证号写定后不该再改。" }],
      ],
    },
    code: code(`${QUEUE}
print(queue)
queue.append("王芳")
print(queue)`),
  },
  {
    id: "tuple-card-what",
    title: "认识元组",
    type: "explain",
    layout: "fullscreen",
    content: {
      body: "卡号这类身份信息用元组存放。有顺序，但写定后不能改其中一项。",
      bulletPoints: [
        "用圆括号 () 书写",
        "项与项之间用逗号分隔",
        "本段用短卡号字符串作示例",
      ],
      preview: "下一节：怎样创建元组",
    },
  },
  {
    id: "tuple-card-create",
    title: "创建元组",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      markedPoints: [
        [
          { text: "cards = (\"62220001\", \"62220002\")", mark: true },
          { text: " 圆括号写出多项。" },
        ],
        [
          { text: "one = (\"62220001\",)", mark: true },
          { text: " 只有一项时，逗号不能省，否则不是元组。" },
        ],
      ],
    },
    code: code(`cards = ("62220001", "62220002")
print(cards)
print(type(cards))
one = ("62220001",)
print(one)
print(type(one))`),
  },
  practice(
    "tuple-card-create-ex",
    "练习：创建",
    "创建元组 cards，包含两张卡号 62220001 与 62220002，并打印。",
    ``,
    [
      "用圆括号与逗号。",
      "两项都写成字符串。",
      'cards = ("62220001", "62220002")\nprint(cards)',
    ],
    "圆括号里按顺序写出两项卡号。",
    "('62220001', '62220002')",
  ),
  {
    id: "tuple-card-immutable",
    title: "不可变",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      markedPoints: [
        [
          { text: "queue[0] = \"王芳\"", mark: true },
          { text: " 列表允许改其中一项。" },
        ],
        [
          { text: "cards[0] = \"99990000\"", mark: true },
          { text: " 元组禁止改项，运行报 TypeError。类型不允许改，对应卡号不该被改掉。" },
        ],
      ],
    },
    code: code(`${QUEUE}
queue[0] = "王芳"
print(queue)
cards = ("62220001", "62220002")
cards[0] = "99990000"
print(cards)`),
  },
  practice(
    "tuple-card-immutable-ex",
    "练习：整体替换",
    "cards 当前是两张旧卡号。不能改其中一项。请整体换成新元组 (\"62220003\", \"62220004\")，再打印 cards。",
    `cards = ("62220001", "62220002")
`,
    [
      "下标赋值会 TypeError。",
      "用赋值把名字指向新的元组。",
      'cards = ("62220003", "62220004")\nprint(cards)',
    ],
    "不能改项，只能让 cards 指向另一份元组。",
    "('62220003', '62220004')",
  ),
  {
    id: "tuple-card-lookup",
    title: "查询",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      markedPoints: [
        [
          { text: "cards[0]", mark: true },
          { text: " 按下标读取，与列表相同。" },
        ],
        [
          { text: "len(cards)", mark: true },
          { text: " 项数。" },
        ],
        [
          { text: "\"62220001\" in cards", mark: true },
          { text: " 是否包含某项。" },
        ],
      ],
    },
    code: code(`cards = ("62220001", "62220002")
print(cards[0])
print(len(cards))
print("62220001" in cards)`),
  },
  {
    id: "tuple-card-pack",
    title: "打包",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      markedPoints: [
        [
          { text: 'record = ("周宁", "62220001")', mark: true },
          { text: " 姓名与卡号绑成一条办理信息。" },
        ],
      ],
    },
    code: code(`${RECORD}
print(record)
print(record[0])
print(record[1])`),
  },
  {
    id: "tuple-card-unpack",
    title: "拆包",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      markedPoints: [
        [
          { text: "name, card = record", mark: true },
          { text: " 按顺序拆到两个名字上。" },
        ],
      ],
    },
    code: code(`${RECORD}
name, card = record
print(name)
print(card)`),
  },
  practice(
    "tuple-card-unpack-ex",
    "练习：拆包",
    "把 record 拆成 name 与 card，依次打印姓名和卡号。",
    `${RECORD}
`,
    [
      "左边写两个名字，中间用逗号。",
      "顺序与元组中一致。",
      "name, card = record\nprint(name)\nprint(card)",
    ],
    "拆包后分别打印两项。",
    "周宁\n62220001",
  ),
  {
    id: "tuple-card-convert",
    title: "list 与 tuple",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      markedPoints: [
        [
          { text: "tuple(queue)", mark: true },
          { text: " 把当前名单转成元组快照。" },
        ],
        [
          { text: "list(record)", mark: true },
          { text: " 需要改项时，先转成列表。" },
        ],
      ],
    },
    code: code(`${QUEUE}
snap = tuple(queue)
print(snap)
print(type(snap))
${RECORD}
editable = list(record)
editable[1] = "62229999"
print(editable)`),
  },
  practice(
    "tuple-card-convert-ex",
    "练习：转换",
    "把 queue 转成元组 snap 并打印；再把 record 转成列表 editable 并打印。",
    `${QUEUE}
${RECORD}
`,
    [
      "tuple(...) 与 list(...)。",
      "分别赋给 snap 与 editable。",
      "snap = tuple(queue)\nprint(snap)\neditable = list(record)\nprint(editable)",
    ],
    "两种方向的转换各做一次。",
    "('周宁', '李想', '赵敏', '陈一')\n['周宁', '62220001']",
  ),
  {
    id: "tuple-card-wrap",
    title: "对比收束",
    type: "explain",
    layout: "fullscreen",
    content: {
      body: "同一银行窗口里，名单与身份信息用不同容器。",
      bulletPoints: [
        "列表：可变的队伍，可增删改",
        "元组：绑死的身份或记录字段，写定后不能改项",
        "打包拆包：几项绑成一条，再按顺序拆开",
        "字典和集合见第 7 讲",
      ],
    },
  },
];
