import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

export const scenes: DraftScene[] = [
  {
    id: "vend-cmp",
    title: "比较表达式",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      vendPath: {
        mode: "guide",
        title: "比较表达式的值",
        question: "balance 为 1、price 为 5 时，balance >= price 的值是什么？",
        options: [
          { id: "false", label: "False", correct: true },
          { id: "true", label: "True", correct: false },
        ],
        okText: "比较表达式的运算结果是布尔值 True 或 False。判断相等使用 ==，一个 = 是赋值。",
        badText: "先计算 1 >= 5。该比较不成立，结果为 False。",
      },
    },
    code: code(`price = 5
balance = 1
print(balance >= price)
print(balance == price)
print(balance < price)`),
  },
  {
    id: "vend-bool-ops",
    title: "布尔运算",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      vendPath: {
        mode: "guide",
        title: "用布尔运算组合条件",
        rows: [
          { name: "and", detail: "两个操作数都为 True" },
          { name: "or", detail: "至少一个操作数为 True" },
          { name: "not", detail: "对布尔值取反" },
        ],
        question: "stock 为 0、balance 为 10、price 为 5 时，stock > 0 and balance >= price 的值是什么？",
        options: [
          { id: "false", label: "False。and 要求两个操作数都为 True", correct: true },
          { id: "true", label: "True。余额已经足够", correct: false },
        ],
        okText: "复合条件的结果仍是一个布尔值。stock > 0 为 False 时，and 表达式的值为 False。",
        badText: "and 的左侧先为 False。左侧为 False 时，整个 and 表达式为 False。",
      },
    },
    code: code(`price = 5
balance = 10
stock = 0
print(stock > 0 and balance >= price)
print(balance < price or stock == 0)
print(not (balance >= price))`),
  },
  {
    id: "vend-bool-prec",
    title: "优先级与括号",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      vendPath: {
        mode: "guide",
        title: "布尔运算的优先级",
        rows: [
          { name: "括号", detail: "最先计算" },
          { name: "not", detail: "先于 and" },
          { name: "and", detail: "先于 or" },
        ],
        question: "balance >= 5 and not (stock == 0 or paid) 的值是什么？",
        options: [
          { id: "false", label: "False", correct: true },
          { id: "true", label: "True", correct: false },
        ],
        okText: "先算括号中的 or，得到 True；not True 为 False；False and 任何操作数都为 False。",
        badText: "先算括号里的 stock == 0 or paid，再算 not，最后算 and。",
      },
    },
    code: code(`balance = 10
stock = 0
paid = False
print(balance >= 5 and not (stock == 0 or paid))`),
  },
  {
    id: "vend-bool-cmp",
    title: "比较式参与布尔运算",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      vendPath: {
        mode: "guide",
        title: "比较表达式可以参与布尔运算",
        question: 'not code == "A1" 等价于哪一个表达式？',
        options: [
          { id: "group", label: 'not (code == "A1")', correct: true },
          { id: "not-first", label: '(not code) == "A1"', correct: false },
        ],
        okText: "比较运算先于 not、and、or。not code == \"A1\" 先比较，再对布尔值取反。",
        badText: "先看 == 与 not 哪一个先运算。比较运算的优先级更高。",
      },
    },
    code: code(`code = "A2"
print(code == "A1" or code == "A2")
print(not code == "A1")
print(not (code == "A1"))`),
  },
  {
    id: "vend-bool-chain",
    title: "链式比较",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      vendPath: {
        mode: "guide",
        title: "链式比较与 and",
        question: "price 为 5 时，2 <= price <= 8 与 price >= 2 and price <= 8 的值是否相同？",
        options: [
          { id: "same", label: "相同，都是 True", correct: true },
          { id: "diff", label: "不同，链式比较会报错", correct: false },
        ],
        okText: "链式比较等价于用 and 连接的两个比较表达式。它表示一个值是否落在区间内。",
        badText: "先判断 5 >= 2，再判断 5 <= 8。两项都成立，结果为 True。",
      },
    },
    code: code(`price = 5
print(2 <= price <= 8)
print(price >= 2 and price <= 8)`),
  },
  {
    id: "vend-bool-short",
    title: "短路求值",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      vendPath: {
        mode: "guide",
        title: "and 遇假即停，or 遇真即停",
        question: "stock 为 0，条件中写了 price / stock。运行后会报 ZeroDivisionError 吗？",
        options: [
          { id: "no", label: "不会。and 的左操作数为 False，右操作数不求值", correct: true },
          { id: "yes", label: "会。条件里出现了除法", correct: false },
        ],
        okText: "and 在左操作数为假时不再求值右操作数；or 在左操作数为真时不再求值右操作数。被跳过的是后续表达式，不是整个程序。",
        badText: "先看 stock != 0 的值。它为 False 时，右侧的除法不会执行。",
      },
    },
    code: code(`price = 5
stock = 0
if stock != 0 and price / stock < 3:
    print("单价低于3元")
else:
    print("不满足判断条件")`),
  },
  {
    id: "vend-bool-truthy",
    title: "非布尔值当作真假",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      vendPath: {
        mode: "guide",
        title: "不是布尔值，也能拿去判断",
        question: 'if "橙汁" 与 if "" 分别执行哪一个语句块？',
        options: [
          { id: "split", label: "非空字符串当作真，空字符串当作假", correct: true },
          { id: "both", label: "都当作真，因为类型都是 str", correct: false },
          { id: "err", label: "报错，if 的条件只能是 True 或 False", correct: false },
        ],
        okText: "非空字符串、非零数值当作真。空字符串、0、None 当作假。if 的条件不必先写成布尔值。",
        badText: "运行左侧，看哪几条 print 出现在输出中。",
      },
    },
    code: code(`if "橙汁":
    print("非空字符串当作真")
if "":
    print("空字符串当作真")
else:
    print("空字符串当作假")
if 0:
    print("0 当作真")
else:
    print("0 当作假")`),
  },
  {
    id: "vend-bool-operand",
    title: "返回操作数",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      vendPath: {
        mode: "guide",
        title: "and 与 or 返回操作数本身",
        question: 'print("橙汁" and "矿泉水") 与 print("" or "余额不足") 的输出是什么？',
        options: [
          { id: "vals", label: "矿泉水，然后余额不足", correct: true },
          { id: "bools", label: "True，然后 True", correct: false },
        ],
        okText: "and、or 用操作数的真假决定是否继续求值，返回的是某个操作数本身，不是布尔值 True 或 False。",
        badText: "左操作数「橙汁」当作真，and 返回右操作数。空字符串当作假，or 返回右操作数。",
      },
    },
    code: code(`print("橙汁" and "矿泉水")
print("" or "余额不足")`),
  },
];
