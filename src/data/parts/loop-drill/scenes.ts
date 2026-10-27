import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const ORDER = `n = int(input())

count = 0
total = 0
max_money = 0

for i in range(n):
    status, money = map(int, input().split())

    if status == 1:
        count += 1
        total += money

        if money > max_money:
            max_money = money

print(count)
print(total)
print(max_money)
`;

const ORDER_COMPACT = `n = int(input())
count , total, max_money = 0,0,0
#遇到无效订单直接跳过，只处理有效订单
for i in range(n):
    status, money = map(int, input().split())

    if status == 1:
        count += 1
        total += money

        if money > max_money:
            max_money = money

print(count)
print(total)
print(max_money)
`;

const ORDER_WHILE = `n = int(input())

count = 0
total = 0
max_money = 0
i = 0

while i < n:
    status, money = map(int, input().split())

    if status == 1:
        count += 1
        total += money

        if money > max_money:
            max_money = money

    i += 1

print(count)
print(total)
print(max_money)
`;

const ORDER_MATH = `n = int(input())

count = 0
total = 0
max_money = 0

for i in range(n):
    status, money = map(int, input().split())

    count += status
    total += status * money

    if status == 1 and money > max_money:
        max_money = money

print(count)
print(total)
print(max_money)
`;

const TRUCK = `n, m = map(int, input().split())

count = 0
total = 0

for i in range(n):
    w = int(input())

    if w == 0:
        continue

    if total + w > m:
        break

    count += 1
    total += w

print(count)
print(total)
`;

const TRUCK_NEST = `n, m = map(int, input().split())

count = 0
total = 0

for i in range(n):
    w = int(input())

    if w > 0:
        if total + w > m:
            break

        count += 1
        total += w

print(count)
print(total)
`;

const TRUCK_WHILE = `n, m = map(int, input().split())

count = 0
total = 0
i = 0

while i < n:
    w = int(input())
    i += 1

    if w == 0:
        continue

    if total + w > m:
        break

    count += 1
    total += w

print(count)
print(total)
`;

const CHECKOUT = `n = int(input())

for i in range(n):
    total = 0

    while True:
        price = int(input())

        if price == 0:
            break

        total += price

    print(total)
`;

const CHECKOUT_WHILE = `n = int(input())
i = 0

while i < n:
    total = 0

    while True:
        price = int(input())

        if price == 0:
            break

        total += price

    print(total)
    i += 1
`;

const CHECKOUT_FOR = `n = int(input())

for i in range(n):
    total = 0

    for j in range(101):
        price = int(input())

        if price == 0:
            break

        total += price

    print(total)
`;

/** 循环综合练习。每页一道题，从本讲第 38 页起。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-drill-order",
    title: "练习1: 电商订单结算",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      loopDrill: {
        index: "1",
        title: "电商订单统计",
        situation: [
          "某电商商家需要统计一批订单的销售情况。已取消或全额退款的订单不计入统计",
        ],
        task: "当天共有 n 条订单记录（1 ≤ n ≤ 1000）。每条记录由两个整数构成：订单状态status 和 金额money。",
        rules: [
          "status = 1：有效订单，已完成且未退款。",
          "status = 0：无效订单，已取消或已全额退款。",
        ],
        goal: "统计有效订单数量、总金额和最高单笔金额",
        inputFormat: "第一行输入整数 n。接下来 n 行，每行两个整数 status 和 money，用空格隔开。",
        outputFormat: "分三行依次输出有效订单数量、有效订单金额合计和最高单笔金额。",
        sampleInput: "5\n1 120\n0 300\n1 85\n1 200\n0 150",
        sampleOutput: "3\n405\n200",
      },
    },
    code: code("n = int(input())\n"),
    hints: [
      { level: 1, text: "status 为 0 的订单直接跳过。循环开始前，数量、合计、最高金额都写成 0。一条有效订单都没有时，输出这三个 0。" },
      { level: 2, text: "循环 n 次。每次 input().split() 得到两个文字，下标 0 是 status，下标 1 是 money，都要先 int()。只有 status == 1 时才更新三个变量。" },
      { level: 3, text: ORDER },
    ],
    reveal: {
      title: "对照",
      body: "样例 5 条里，有效订单是 120、85、200。数量 3，合计 405，最高 200。status 为 0 的 300 和 150 不计入。",
    },
  },
  {
    id: "scene-drill-order-code",
    title: "练习1: 对照代码",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: {},
    code: code(ORDER),
  },
  {
    id: "scene-drill-order-compact",
    title: "练习1: 精简写法",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: {},
    code: code(ORDER_COMPACT),
  },
  {
    id: "scene-drill-order-while",
    title: "练习1: while 实现",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: {},
    code: code(ORDER_WHILE),
  },
  {
    id: "scene-drill-order-math",
    title: "练习1: 数学建模",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: {},
    code: code(ORDER_MATH),
  },
  {
    id: "scene-drill-truck",
    title: "练习2: 配送装车",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      loopDrill: {
        index: "2",
        title: "配送车装载统计",
        situation: [
          "一辆配送车最大载重为 m 千克，现有 n 个包裹需要按顺序装车。",
        ],
        task: "每个包裹的重量为 w，装车规则如下：",
        rules: [
          "w = 0：表示包裹破损，跳过该包裹。",
          "w > 0：若装入后不超载，则装车。",
          "若装入当前包裹会超载，则立即停止装车，不再处理后续包裹。",
        ],
        goal: "请统计成功装车的包裹数量和总重量。",
        inputFormat: "第一行输入两个整数 n 和 m（1 ≤ n ≤ 1000，1 ≤ m ≤ 10000）。接下来 n 行，每行一个整数 w（0 ≤ w ≤ 10000）。",
        outputFormat: "分两行输出成功装车的包裹数量和总重量。",
        sampleInput: "7 100\n20\n0\n35\n15\n40\n10\n5",
        sampleOutput: "3\n70",
        sampleNote:
          "第2个包裹破损，直接跳过；第1、3、4个包裹成功装车，总重量为70千克。第5个包裹重40千克，装入后将超载，因此停止装车。",
      },
    },
    code: code("n, m = map(int, input().split())\n"),
    hints: [
      { level: 1, text: "循环开始前，装车数量和总重量都写成 0。w 为 0 时跳过这一次，不要停止整个装车过程。" },
      { level: 2, text: "先判断 total + w 会不会超过 m。会超载就 break；不会超载才把数量加 1、总重量加上 w。" },
      { level: 3, text: TRUCK },
    ],
    reveal: {
      title: "对照",
      body: "依次装入 20、35、15，总重量 70。下一个 40 会超载，用 break 停止。后面的 10 和 5 不再处理。破损的 0 用 continue 跳过。",
    },
  },
  {
    id: "scene-drill-truck-code",
    title: "练习2: 先跳过再判断",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: {},
    code: code(TRUCK),
  },
  {
    id: "scene-drill-truck-nest",
    title: "练习2: 先判断完好",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: {},
    code: code(TRUCK_NEST),
  },
  {
    id: "scene-drill-truck-while",
    title: "练习2: while 实现",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: {},
    code: code(TRUCK_WHILE),
  },
  {
    id: "scene-drill-checkout",
    title: "练习3: 顾客结账",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      loopDrill: {
        index: "3",
        title: "超市顾客结账统计",
        situation: [
          "某超市有 n 名顾客依次结账。每名顾客购买的商品数量不同，收银员逐件扫描商品条码，直到该顾客的所有商品扫描完毕。",
        ],
        task: "每件商品输入一个正整数表示价格，输入规则如下：",
        rules: [
          "正整数：当前商品价格，计入该顾客金额。",
          "0：当前顾客的商品已扫描完毕。",
        ],
        goal: "请统计每名顾客的购物总金额。",
        inputFormat: "第一行输入整数 n（1 ≤ n ≤ 100）。接下来依次输入每名顾客的商品价格，每个价格单独占一行（1 ≤ price ≤ 10000），以 0 结束当前顾客。",
        outputFormat: "每名顾客输出一行，表示该顾客的购物总金额。",
        sampleInput: "3\n12\n8\n15\n0\n25\n10\n0\n18\n6\n9\n0",
        sampleOutput: "35\n35\n33",
        sampleNote: "三名顾客的金额分别是 12+8+15=35、25+10=35、18+6+9=33。",
      },
    },
    code: code("n = int(input())\n"),
    hints: [
      { level: 1, text: "外层循环处理 n 名顾客。每位顾客开始时，总金额写成 0。" },
      { level: 2, text: "内层反复读入价格。价格不是 0 就累加；读到 0 就结束这位顾客，打印总金额，再处理下一位。" },
      { level: 3, text: CHECKOUT },
    ],
    reveal: {
      title: "对照",
      body: "外层 for 走三位顾客。内层 while 读到 0 才停。每位顾客的 total 要重新写成 0，不能带到下一位。",
    },
  },
  {
    id: "scene-drill-checkout-code",
    title: "练习3: 扫完再结账",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: {},
    code: code(CHECKOUT),
  },
  {
    id: "scene-drill-checkout-while",
    title: "练习3: while + while",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: {},
    code: code(CHECKOUT_WHILE),
  },
  {
    id: "scene-drill-checkout-for",
    title: "练习3: for + for",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: {},
    code: code(CHECKOUT_FOR),
  },
  {
    id: "scene-drill-checkout-flows",
    title: "练习3: 三种流程图",
    type: "explain",
    layout: "fullscreen",
    content: {
      loopDrillFlows: {
        title: "练习3：三种嵌套写法流程图",
        charts: [
          {
            title: "for + while",
            nodes: [
              { kind: "start", text: "开始" },
              { kind: "process", text: "读入 n" },
              { kind: "process", text: "外层 for：处理一名顾客" },
              { kind: "process", text: "total = 0" },
              { kind: "process", text: "内层 while True：读入 price" },
              {
                kind: "decision",
                text: "price\n== 0?",
                yes: "打印 total，下一位顾客",
                no: "total += price，继续扫码",
              },
              { kind: "end", text: "结束" },
            ],
          },
          {
            title: "while + while",
            nodes: [
              { kind: "start", text: "开始" },
              { kind: "process", text: "读入 n，i = 0" },
              {
                kind: "decision",
                text: "i < n?",
                yes: "total = 0，进入扫码",
                no: "全部顾客处理完",
              },
              { kind: "process", text: "内层 while True：读入 price" },
              {
                kind: "decision",
                text: "price\n== 0?",
                yes: "打印 total，i += 1",
                no: "total += price，继续扫码",
              },
              { kind: "end", text: "结束" },
            ],
          },
          {
            title: "for + for",
            nodes: [
              { kind: "start", text: "开始" },
              { kind: "process", text: "读入 n" },
              { kind: "process", text: "外层 for：处理一名顾客" },
              { kind: "process", text: "total = 0" },
              { kind: "process", text: "内层 for j in range(101)" },
              {
                kind: "decision",
                text: "price\n== 0?",
                yes: "break 内层，打印 total",
                no: "total += price，继续扫码",
              },
              { kind: "end", text: "结束" },
            ],
          },
        ],
      },
    },
  },
];
