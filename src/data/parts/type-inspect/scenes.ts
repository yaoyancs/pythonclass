import type { DraftScene } from "../../../types/scene";

/** 本 part：值 + 类型两件套；字面量；type()；四类地图。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-ti-01",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "值与类型是两件套",
      body: "程序里每个数据都有「它是什么」和「它属于哪一类」。",
      bulletPoints: [
        "值：当前具体内容，如 2、2.5、\"张明\"",
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
        lead: "同是「2」的样子，写法不同，类型不同。",
        lines: [
          {
            code: "2",
            tokens: [{ text: "2", tone: "int" }],
          },
          {
            code: "2.0",
            tokens: [{ text: "2.0", tone: "float" }],
          },
          {
            code: '"2"',
            tokens: [{ text: '"2"', tone: "str" }],
          },
          {
            code: "True",
            tokens: [{ text: "True", tone: "plain" }],
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
        code: 'print(type(2))\nprint(type(2.0))\nprint(type("2"))\nprint(type(True))',
        question: "四行分别打印什么类型？",
        revealOutputs: [
          "<class 'int'>",
          "<class 'float'>",
          "<class 'str'>",
          "<class 'bool'>",
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
      headline: "本讲地图",
      body: "后面按这条路线推进：",
      flowDiagram: [
        "数值运算",
        "→ 字符串",
        "→ 转换（收束开场问题）",
        "→ 布尔与比较",
        "→ CampusLife 0.2",
      ],
      bulletPoints: [
        "先会认，再会算，再会转",
        "比较得到 True/False，为第 3 讲「选择」铺路",
      ],
    },
  },
];
