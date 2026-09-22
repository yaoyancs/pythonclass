import type { DraftScene } from "../../../types/scene";

/** 认类型：飞花令里诗句 / 轮次 / 得分；含 input 下一轮冲突。不讲转换。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-ti-00",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "看起来很合理的程序",
      body: "飞花令要进入下一轮：当前轮次加 1。上讲预告的「年龄 + 1」是同一类写法。",
      question: "若用户输入 2，你期望下一轮是几？",
      codeComparison: {
        left: {
          label: "自然语言想法",
          code: "读入当前轮次\n下一轮 = 轮次 + 1\n打印下一轮",
        },
        right: {
          label: "Python 写法",
          code: 'round_no = input("现在是第几轮：")\nnext_round = round_no + 1\nprint("下一轮是第", next_round, "轮")',
        },
      },
    },
  },
  {
    id: "scene-ti-00b",
    type: "run",
    layout: "split",
    content: {
      headline: "运行后发生了什么",
      body: "先预测，再运行。输入 2 时：会得到 3，还是报错，还是别的结果？",
      question: "错误信息或奇怪结果，在提示什么？",
    },
    code: {
      initial:
        'round_no = input("现在是第几轮：")\nnext_round = round_no + 1\nprint("下一轮是第", next_round, "轮")',
      editable: false,
      resetToInitial: true,
    },
  },
  {
    id: "scene-ti-00c",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "冲突不在「加减」，在类型",
      body: "input() 得到的是文字，即使你键入的是 2。",
      bulletPoints: [
        "看起来像数字 ≠ 程序里已经是数值",
        "文字不能按「下一轮」的规则去加",
        "诗句、轮次、得分看起来都能写进变量，但不是一类东西",
        "本讲先学会认类型；如何转换，后面专门解决",
      ],
    },
  },
  {
    id: "scene-ti-01",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "值与类型是两件套",
      body: "程序里每个数据都有「它是什么」和「它属于哪一类」。",
      bulletPoints: [
        "值：当前具体内容，如 2、2.5、\"春眠不觉晓\"",
        "类型：这类值能做什么运算、不能做什么",
        "认错类型，就会写出「看起来合理、运行却翻车」的代码",
      ],
    },
  },
  {
    id: "scene-ti-02",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "字面量：代码里直接写出的值",
      typedDemo: {
        lead: "同是「2」的样子，写法不同，类型不同。飞花令里都会遇到。",
        lines: [
          {
            code: "2",
            kind: "int",
            tokens: [{ text: "2", tone: "int" }],
          },
          {
            code: "2.0",
            kind: "float",
            tokens: [{ text: "2.0", tone: "float" }],
          },
          {
            code: '"花"',
            kind: "str",
            tokens: [{ text: '"花"', tone: "str" }],
          },
          {
            code: "True",
            kind: "bool",
            tokens: [{ text: "True", tone: "bool" }],
          },
        ],
        takeaway:
          "字面量是写在代码里的直接值。引号会把内容变成字符串；True/False 是布尔字面量。",
      },
    },
  },
  {
    id: "scene-ti-03",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "用 type() 查证",
      varPredict: {
        code: 'print(type(2))\nprint(type(2.0))\nprint(type("花"))\nprint(type(True))',
        question: "四行分别打印什么类型？",
        revealOutputs: [
          "<class 'int'>",
          "<class 'float'>",
          "<class 'str'>",
          "<class 'bool'>",
        ],
        cards: [
          { caption: "2", value: "2", kind: "int" },
          { caption: "2.0", value: "2.0", kind: "float" },
          { caption: '"花"', value: '"花"', kind: "str" },
          { caption: "True", value: "True", kind: "bool" },
        ],
        takeaway: [
          "type(值) 用来查证，不靠猜",
          "int / float / str / bool 是本讲主地图",
        ],
      },
    },
  },
  {
    id: "scene-ti-04",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "飞花令里的四类数据",
      body: "后面按这条路线推进：",
      flowDiagram: [
        "变量回看",
        "→ 认类型",
        "→ 得分运算",
        "→ 诗句拼接",
        "→ 转换（收束下一轮）",
        "→ 比较",
        "→ 飞花令 0.2",
      ],
      bulletPoints: [
        "player / poem / author / theme 是文字",
        "round_no 是整数；score 可以是整数或浮点",
        "passed 是布尔：本讲只打印，不写 if",
      ],
    },
  },
];
