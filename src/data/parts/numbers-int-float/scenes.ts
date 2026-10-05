import type { DraftScene } from "../../../types/scene";

/** 基本类型：数字。int / float、四则与整除余数、先乘后加。单价 1.5。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-num-01",
    type: "run",
    layout: "split",
    content: {
      headline: "小数点",
      intFloat: {
        intNote: "18 存在整数对象里，是精确的 18，没有小数位。",
        floatNote: "18.0 和 1.5 都写了小数点，都是 float。整数 18 没有小数点。",
        equalNote:
          "== 比数值。18 和 18.0 数值相同，所以为真。类型仍不同，也不是同一个对象。",
      },
    },
    code: {
      initial:
        "a = 18\nb = 18.0\nprint(type(a))\nprint(type(b))\nprint(type(1.5))\nprint(a == b)\nprint(a is b)",
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-num-02",
    type: "run",
    layout: "split",
    content: {
      headline: "运算符",
      markedPoints: [
        [{ text: "minutes * price 算费用，minutes + 2、minutes - 2 改分钟。" }],
        [
          { text: "/ 是除法，结果类型是 " },
          { text: "float", mark: true },
          { text: "。18 / 2 得到 9.0。两边是整数也是 " },
          { text: "float", mark: true },
          { text: "。" },
        ],
        [
          { text: "// 是整除，两边都是整数时结果类型是 " },
          { text: "int", mark: true },
          { text: "。18 分钟换成小时，18 // 60 得到 0 小时。只要有一边是 " },
          { text: "float", mark: true },
          { text: "，结果就是 " },
          { text: "float", mark: true },
          { text: "，例如 18.0 // 60 得到 0.0。" },
        ],
        [
          { text: "% 是余数，类型规则和 // 相同：两边都是整数时是 " },
          { text: "int", mark: true },
          { text: "，剩下的分钟 18 % 60 得到 18；有一边是 " },
          { text: "float", mark: true },
          { text: " 时结果是 " },
          { text: "float", mark: true },
          { text: "。" },
        ],
        [
          { text: "0.1 + 0.2 不一定是精确的 0.3。本讲费用仍用 " },
          { text: "float", mark: true },
          { text: " 单价。" },
        ],
      ],
    },
    code: {
      initial:
        "minutes = 18\nprice = 1.5\nprint(minutes * price)\nprint(minutes + 2)\nprint(minutes - 2)\nprint(minutes / 2)\nprint(type(minutes / 2))\nprint(minutes // 60)\nprint(type(minutes // 60))\nprint(minutes % 60)\nprint(type(minutes % 60))\nprint(18.0 // 60)\nprint(type(18.0 // 60))\nprint(18.0 % 60)\nprint(type(18.0 % 60))\nprint(0.1 + 0.2)\nprint(0.1 + 0.2 == 0.3)",
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-num-03",
    type: "run",
    layout: "split",
    content: {
      headline: "运算符优先级",
      exprOrder: {
        tiers: [
          { rank: "最高", ops: "( )", note: "括号里先算完" },
          { rank: "其次", ops: "*  /  //  %", note: "同级，从左到右" },
          { rank: "再次", ops: "+  -", note: "同级，从左到右" },
        ],
        cases: [
          {
            expr: "18 + 2 * 1.5",
            result: "21.0",
            note: "先乘。多骑 2 分钟的费用，不是先把 18 和 2 加起来。",
          },
          {
            expr: "(18 + 2) * 1.5",
            result: "30.0",
            note: "括号改顺序。",
          },
          {
            expr: "18 / 2 * 3",
            result: "27.0",
            note: "除和乘同级，从左到右。写成 18 / (2 * 3) 才是 3.0。",
          },
          {
            expr: "18 - 3 - 2",
            result: "13",
            note: "减号同级，从左到右。不是 18 - (3 - 2) 的 17。",
          },
        ],
      },
    },
    code: {
      initial:
        "print(18 + 2 * 1.5)\nprint((18 + 2) * 1.5)\nprint(18 / 2 * 3)\nprint(18 - 3 - 2)",
      editable: true,
      resetToInitial: true,
    },
  },
];
