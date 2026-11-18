import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 第四部分：辨析 print 与 return、掌握提前返回拦截边界条件、利用元组解包接收多返回值，完成「手气最佳」统计函数。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-return-print-predict",
    title: "认知冲突：为什么红包池变成了 None？",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "函数里只写了 print，调用处能拿到列表吗？",
      body: "make_equal 把 20 元平分成 4 个 5.0 元的红包并 print 了出来。外部用变量 pool 接收调用结果，准备发给群友。",
    },
    code: code(`def make_equal(total, count=4):
    each = round(total / count, 2)
    packets = [each] * count
    print("函数内生成:", packets)

pool = make_equal(20, 4)
print("外部拿到的红包池:", pool)`),
    prediction: {
      question: "第二行「外部拿到的红包池:」后面会打印什么？",
      options: [
        { id: "list", label: "[5.0, 5.0, 5.0, 5.0]" },
        { id: "none", label: "None", isCorrect: true },
        { id: "err", label: "程序报错" },
      ],
    },
    reveal: {
      title: "不写 return 的函数，默认一律返回 None",
      body: "print 只是把列表画在屏幕上给人看，并没有把列表交还给调用者。没有 return 时，pool 接到的只是空值 None。",
    },
  },
  {
    id: "fn-return-none-debug",
    title: "print 与 return：看结果 vs 交回结果",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "后续代码还要继续用的结果，必须 return",
      image: {
        src: "/lesson08/rp-return.svg",
        alt: "print 只显示在屏幕上、调用方得到 None；return 把数据交回调用处继续运算",
      },
      body: "小明在宿舍群和班级群各领了一包平分红包，想把两笔金额加起来算总收获，运行却报错了。请把函数改成用 return 交回金额。",
    },
    code: code(`def calc_each(total, count):
    each = round(total / count, 2)
    print(each)

m1 = calc_each(20, 4)
m2 = calc_each(30, 5)
print("两轮共抢到:", m1 + m2)`),
    hints: [
      { level: 1, text: "报错 TypeError: unsupported operand type(s) for +: 'NoneType' and 'NoneType'——m1 和 m2 全是 None！" },
      { level: 2, text: "把函数里的 print(each) 改成 return each，让调用表达式本身等于算出的金额。" },
      {
        level: 3,
        text: `def calc_each(total, count):
    each = round(total / count, 2)
    return each

m1 = calc_each(20, 4)
m2 = calc_each(30, 5)
print("两轮共抢到:", m1 + m2)`,
      },
    ],
    reveal: {
      title: "调用表达式的值 = return 后面的值",
      body: "改成 return each 后，calc_each(20, 4) 求值得到 5.0，calc_each(30, 5) 得到 6.0，后续加法、比较、存入列表都能正常进行。",
    },
    expectedOutput: "两轮共抢到: 11.0",
  },
  {
    id: "fn-return-early",
    title: "return 执行后立即离开函数",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "遇到 return 函数当场结束，下方语句不再执行",
      body: "观察左侧代码：return 后面还写了一行 print(\"发放完毕\")。",
    },
    code: code(`def make_equal(total, count=4):
    each = round(total / count, 2)
    return [each] * count
    print("发放完毕")

pool = make_equal(20, 4)
print(pool)`),
    prediction: {
      question: "运行后屏幕输出什么？",
      options: [
        { id: "both", label: "先输出「发放完毕」，再输出 [5.0, 5.0, 5.0, 5.0]" },
        { id: "only-list", label: "只输出 [5.0, 5.0, 5.0, 5.0]", isCorrect: true },
        { id: "only-msg", label: "只输出「发放完毕」" },
      ],
    },
    reveal: {
      title: "return 是函数的出口",
      body: "一旦执行到 return，函数立刻带着返回值退出，同一代码块里排在 return 后面的语句永远不会运行。",
    },
  },
  {
    id: "fn-return-empty",
    title: "提前返回：拦截「手慢抢空」与「金额不足」",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "先用 if 拦截异常情况并提前 return，主逻辑更清爽",
      flowDiagram: [
        "def grab_packet(packets):",
        "    if len(packets) == 0:",
        "        return 0.0   # 抢空了直接退回 0.0",
        "    return packets.pop()",
      ],
      body: "利用「遇到 return 立即结束」的特性，可以在函数开头先检查红包池空没空：空了就直接 return 0.0，避免对空列表执行 pop() 引发报错。",
    },
    code: code(`def grab_packet(packets):
    """从红包池取出一包；若已抢完则返回 0.0"""
    if len(packets) == 0:
        return 0.0
    return packets.pop()

pool = [6.66, 8.88]
print("第 1 人抢到:", grab_packet(pool))
print("第 2 人抢到:", grab_packet(pool))
print("第 3 人抢到:", grab_packet(pool))`),
    expectedOutput: `第 1 人抢到: 8.88
第 2 人抢到: 6.66
第 3 人抢到: 0.0`,
  },
  {
    id: "fn-return-many",
    title: "多个返回值：打包成元组与解包接收",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "return a, b 实质是返回一个元组，可用多个变量解包",
      flowDiagram: [
        "return count, total, best       # 自动打包为元组",
        "n, s, top = round_stats(r1)     # 元组解包一一接收",
      ],
      body: "一轮红包结束后，我们常需要一次拿到「包数、总额、最高金额」三个指标。用逗号隔开写在 return 后面即可一并交回。",
    },
    code: code(`def round_stats(amounts):
    """同时返回红包个数、总金额和最高金额"""
    return len(amounts), round(sum(amounts), 2), max(amounts)

r1 = [3.28, 8.66, 1.42, 6.64]

# 1. 直接打印：看到的是一个元组
print(round_stats(r1))

# 2. 元组解包：三个变量分别接住三个值
n, total, best = round_stats(r1)
print(f"共 {n} 包，总额 {total} 元，最高 {best} 元")`),
    expectedOutput: `(4, 20.0, 8.66)
共 4 包，总额 20.0 元，最高 8.66 元`,
  },
  {
    id: "fn-return-practice",
    title: "实战练习：评出本轮「手气最佳」",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "模块组件 ③：find_lucky_king(records)",
      body: "群友抢完红包后，账单保存在字典 records 中（键是姓名，值是金额）。请编写函数找出手气最佳的姓名和金额并一并返回：",
      bulletPoints: [
        "若字典为空（len(records) == 0），提前 return \"无人\", 0.0",
        "遍历 records.items()，找出最高金额对应的姓名 king_name 和金额 king_money",
        "return king_name, king_money",
        "调用函数解包接收，打印：手气最佳：{name}（{money} 元）",
      ],
    },
    code: code(`records = {"小明": 3.28, "小红": 8.66, "小刚": 1.42, "小美": 6.64}

# 请定义 find_lucky_king(records) 并解包打印结果
`),
    hints: [
      { level: 1, text: '先处理空字典：if len(records) == 0: return "无人", 0.0。再初始化 king_name = "" 和 king_money = -1。' },
      { level: 2, text: "用 for name, money in records.items(): 遍历，若 money > king_money 则更新 king_name 和 king_money，循环后 return king_name, king_money。" },
      {
        level: 3,
        text: `records = {"小明": 3.28, "小红": 8.66, "小刚": 1.42, "小美": 6.64}

def find_lucky_king(records):
    """返回抢包记录字典中金额最高的 (姓名, 金额)"""
    if len(records) == 0:
        return "无人", 0.0
    king_name = ""
    king_money = -1.0
    for name, money in records.items():
        if money > king_money:
            king_name = name
            king_money = money
    return king_name, king_money

name, money = find_lucky_king(records)
print(f"手气最佳：{name}（{money} 元）")`,
      },
    ],
    reveal: {
      title: "对照：字典遍历 + 多返回值解包",
      body: "find_lucky_king 把「谁抢最多」和「抢了多少」打包返回，主程序一行解包即可拿到手气王信息。这也是综合红包系统的核心结算组件。",
    },
    expectedOutput: "手气最佳：小红（8.66 元）",
  },
];
