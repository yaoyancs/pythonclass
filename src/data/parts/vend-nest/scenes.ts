import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const NEST = `product = "橙汁"
price = 5
stock = 0
balance = 10
if stock > 0:
    if balance >= price:
        print("付款成功，开始出货")
    else:
        print("余额不足，无法购买")
else:
    print("商品已售罄")`;

const AND = `price = 5
stock = 0
balance = 10
if stock > 0 and balance >= price:
    print("付款成功，开始出货")
else:
    print("无法购买")`;

export const scenes: DraftScene[] = [
  {
    id: "vend-nest-run",
    title: "嵌套分支",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      vendPath: {
        mode: "guide",
        title: "外层条件控制内层是否执行",
        question: "stock 的值为 0 时，内层条件 balance >= price 是否求值？",
        options: [
          { id: "no", label: "不求值。外层语句块被跳过", correct: true },
          { id: "yes", label: "会求值。余额仍然要检查", correct: false },
        ],
        okText: "嵌套分支中，外层条件为 False 时，其语句块整体跳过，内层分支不执行。将 stock 改为 3，再分别令 balance 为 1 和 10。",
        badText: "内层 if 写在外层语句块内部。外层条件为 False，该语句块不会进入。",
      },
    },
    code: code(NEST),
  },
  {
    id: "vend-and",
    title: "复合条件",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      vendPath: {
        mode: "guide",
        title: "一个布尔值不能区分两种原因",
        question: "stock > 0 and balance >= price 的值为 False 时，能否区分「售罄」与「余额不足」？",
        options: [
          { id: "no", label: "不能。else 只对应这一个条件不成立", correct: true },
          { id: "yes", label: "能。and 会分别执行两种提示", correct: false },
        ],
        okText: "复合条件只产生一个布尔值。要分别执行不同语句，使用嵌套分支，先判断库存，再判断余额。",
        badText: "else 只有一个语句块。两种不成立原因都会进入这同一语句块。",
      },
    },
    code: code(AND),
  },
  {
    id: "vend-nest-practice",
    title: "随堂练习",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      vendPath: {
        mode: "guide",
        title: "随堂练习：嵌套分支",
        conclusion: "先判断图书馆是否开馆。open 为 False 时打印「今日闭馆」，不再判断座位。开馆后再判断 has_seat：有空座打印「可以入馆」，否则打印「暂无空座」。自验：open = False；open = True 且 has_seat = False；两者都为 True。",
      },
    },
    code: code(`open = False
has_seat = True
`),
    hints: [
      { level: 1, text: "外层条件是 open。闭馆提示放在外层 else。" },
      { level: 2, text: "内层再判断 has_seat。内层 if、else 比外层多缩进一层。" },
      {
        level: 3,
        text: 'if open:\n    if has_seat:\n        print("可以入馆")\n    else:\n        print("暂无空座")\nelse:\n    print("今日闭馆")',
      },
    ],
    reveal: {
      title: "对照",
      body: "open 为 False 时不判断座位。开馆且 has_seat 为 False 走内层 else，两者都为 True 走内层 if。",
    },
  },
];
