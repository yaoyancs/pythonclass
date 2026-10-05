import type { DraftScene } from "../../../types/scene";

/** 认类型：四个字面量，以及同一个名字换值后类型跟着变。不讲 input。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-ti-03",
    type: "run",
    layout: "split",
    content: {
      headline: "type()",
      typeProbe: {
        ask: "它们是不是同一种数据？",
        classNote: "屏幕上的 <class 'int'> 读成「整数」。class 先不管。",
        nameNote: "type() 问的是名字现在指向的对象，不是名字本身。所以还是 int。",
        quoteNote:
          "引号让 \"18\" 变成一串字符。名字改指向它，类型变成 str。原来的整数 18 没有变成字符串。",
        literalsCode:
          'print(type(18))\nprint(type(1.5))\nprint(type("李华"))\nprint(type(True))',
        nameCode:
          'minutes = 18\nprint(type(minutes))\nminutes = "18"\nprint(type(minutes))',
        literals: [
          { value: "18", type: "int", read: "整数" },
          { value: "1.5", type: "float", read: "浮点数" },
          { value: '"李华"', type: "str", read: "字符串" },
          { value: "True", type: "bool", read: "布尔" },
        ],
      },
    },
    code: {
      initial: 'print(type(18))\nprint(type(1.5))\nprint(type("李华"))\nprint(type(True))',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-ti-map",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "类型地图",
      typeMap: {},
    },
  },
];
