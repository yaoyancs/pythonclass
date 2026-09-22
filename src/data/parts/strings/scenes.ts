import type { DraftScene } from "../../../types/scene";

/** 本 part：飞花令字符串；拼接；一种 f-string 浅讲。不做切片。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-str-01",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "字符串是文字序列",
      body: "用引号包起来的内容，类型是 str。",
      typedDemo: {
        lead: "选手名、花名、诗句，都是字符串。",
        lines: [
          {
            code: 'player = "李华"',
            kind: "str",
            tokens: [
              { text: "player = ", tone: "plain" },
              { text: '"李华"', tone: "str" },
            ],
          },
          {
            code: 'theme = "花"',
            kind: "str",
            tokens: [
              { text: "theme = ", tone: "plain" },
              { text: '"花"', tone: "str" },
            ],
          },
          {
            code: "print(type(theme))",
            tokens: [{ text: "print(type(theme))", tone: "plain" }],
          },
        ],
        takeaway: "单引号与双引号在本课等价；成对使用即可。",
      },
    },
  },
  {
    id: "scene-str-02",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "拼接与重复",
      varPredict: {
        code: 'player = "李华"\ntheme = "花"\nprint("你好，" + player)\nprint(theme + " 令")\nprint("*" * 3)',
        question: "三行 print 分别输出什么？",
        revealOutputs: ["你好，李华", "花 令", "***"],
        takeaway: [
          "+ 连接字符串",
          "* 整数可重复字符串",
          "字符串与数字不能直接用 + 混加（下一节转换）",
        ],
      },
    },
  },
  {
    id: "scene-str-03",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "print 怎样拼出一句话",
      body: "两种常用写法：",
      codeComparison: {
        left: {
          label: "多参数（自动空格）",
          code: 'player = "李华"\nround_no = 2\nprint("选手", player, "第", round_no, "轮")',
        },
        right: {
          label: "先拼成一句再打印",
          code: 'player = "李华"\nprint("选手：" + player)',
        },
      },
      bulletPoints: [
        "print 多个参数时，默认用空格隔开",
        "用 + 拼接时，两边都要是字符串",
      ],
    },
  },
  {
    id: "scene-str-04",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "一种格式化：f-string（浅讲）",
      body: "在字符串前加 f，用 {变量} 嵌入值。",
      varPredict: {
        code: 'player = "李华"\ntheme = "花"\npoem = "春眠不觉晓"\nprint(f"{player} · {theme}令")\nprint(f"{poem}")',
        question: "两行输出是哪两句？",
        revealOutputs: ["李华 · 花令", "春眠不觉晓"],
        takeaway: [
          "本课只要求会读、会写这种最简 f-string",
          "对齐宽度、多格式说明以后再用",
        ],
      },
    },
  },
  {
    id: "scene-str-05",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "和数值的边界",
      typedDemo: {
        lead: "两行看起来都有「2」和「1」，结果一样吗？",
        lines: [
          {
            code: 'print("2" + "1")',
            tokens: [
              { text: "print(", tone: "plain" },
              { text: '"2"', tone: "str" },
              { text: " + ", tone: "plain" },
              { text: '"1"', tone: "str" },
              { text: ")", tone: "plain" },
            ],
          },
          {
            code: "print(2 + 1)",
            tokens: [
              { text: "print(", tone: "plain" },
              { text: "2", tone: "int" },
              { text: " + ", tone: "plain" },
              { text: "1", tone: "int" },
              { text: ")", tone: "plain" },
            ],
          },
        ],
        predict: {
          question: "输出分别是？",
          codes: ['print("2" + "1")', "print(2 + 1)"],
          answers: ["21", "3"],
        },
        takeaway: "同符号不同含义：字符串相加是拼接，整数相加是算术。下一节：如何把输入转成能算的轮次。",
      },
    },
  },
];
