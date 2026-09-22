import type { DraftScene } from "../../../types/scene";

/** 第 2 讲开篇：用飞花令诗卡回看变量。不讲类型名。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-vr-01",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "第 1 讲的诗卡",
      body: "上讲我们做出了飞花令诗卡：输入名字，打印一句诗。",
      codeComparison: {
        left: {
          label: "诗句写死在 print 里",
          code: 'player = input("请输入你的名字：")\n\nprint(player, "的诗卡", sep="")\nprint("春眠不觉晓")\nprint("—— 孟浩然")',
        },
        right: {
          label: "改诗要改几处？",
          code: 'print("春眠不觉晓")\nprint("春眠不觉晓")  # 若再打印一次？',
        },
      },
      bulletPoints: [
        "player 是名字，指向现场输入的值",
        "诗句和作者还没有自己的名字",
        "反复出现的数据，应该被记住",
      ],
    },
  },
  {
    id: "scene-vr-02",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "给诗句和作者起名字",
      varDefinition: {
        parts: [
          { label: "名字", note: "标签", example: "poem" },
          { label: "值", note: "盒子里的东西", example: "春眠不觉晓" },
          { label: "赋值", note: "把标签贴上去", example: 'poem = "春眠不觉晓"' },
        ],
        definition:
          "变量 = 程序给一份数据起的名字。诗卡里的选手、诗句、作者，都可以有名字。",
        mathLine: "数学里：未知数，等号两边永远相等。",
        programLine: "编程里：有名字的存储。等号是「把右边放进左边」。",
      },
    },
  },
  {
    id: "scene-vr-03",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "用名字，不是用文字",
      varPredict: {
        code: 'player = "李华"\nprint(player)\nprint("player")',
        question: "两行 print 分别输出什么？",
        revealOutputs: ["李华", "player"],
        compareCode: 'print(player)\nprint("player")',
        compareOutputs: ["李华", "player"],
        cards: [
          { caption: "player", value: "李华" },
          { caption: '"player"', value: "player" },
        ],
        takeaway: [
          "player → 变量名，找到它当前对应的值",
          '"player" → 字符串，就是文字 player',
          "诗卡标题要用名字里的值，不能打印单词 player",
        ],
      },
    },
  },
  {
    id: "scene-vr-04",
    type: "run",
    layout: "split",
    content: {
      headline: "升级诗卡：三份数据三个名字",
      body: "改一句诗，只改 poem 一处。",
      question: "为什么 player 不加引号，而 poem 的值要加引号？",
    },
    code: {
      initial:
        'player = input("请输入你的名字：")\npoem = "春眠不觉晓"\nauthor = "孟浩然"\n\nprint(player, "的诗卡", sep="")\nprint(poem)\nprint("——", author)',
      editable: true,
      resetToInitial: true,
    },
    expectedOutput: "李华的诗卡\n春眠不觉晓\n—— 孟浩然",
  },
];
