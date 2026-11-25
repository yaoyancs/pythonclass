import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 递归：基线条件、调用栈、常见错误、结构递归与适用场景。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-recur-fact",
    title: "递归：函数调用自身",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      recursionTrace: {
        functionName: "fact",
        argument: 3,
      },
    },
    code: code(`def fact(n):
    if n == 0:
        return 1
    return n * fact(n-1)

print(fact(3))`),
    expectedOutput: "6",
  },
  {
    id: "fn-recur-missing",
    title: "没有终止条件",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-recur-missing.svg",
        alt: "没有终止条件：fact(5) 调 fact(4)…一直调到负数也停不下来，最后 RecursionError",
      },
    },
    code: code(`# 缺少终止条件时，调用不会停止，触发 RecursionError
def fact(n):
    return n * fact(n - 1)

print(fact(5))`),
    hints: [
      { level: 1, text: "RecursionError: maximum recursion depth exceeded" },
      { level: 2, text: "在 return 前加上终止条件：if n <= 1: return 1" },
      {
        level: 3,
        text: `def fact(n):
    if n <= 1:
        return 1
    return n * fact(n - 1)

print(fact(5))`,
      },
    ],
    reveal: {
      title: "递归必须有不再调用自身的终止条件",
      body: "每次调用都会产生新的栈帧；没有终止条件时，调用栈不断增长，最终超过 Python 的最大递归深度。",
    },
    expectedOutput: "120",
  },
  {
    id: "fn-recur-wrong-direction",
    title: "有终止条件也可能停不下来",
    type: "debug",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`# 虽然写了终止条件，但 n 每次加 1，离 1 越来越远
def fact(n):
    if n == 1:
        return 1
    return n * fact(n + 1)

print(fact(5))`),
    hints: [
      { level: 1, text: "调用顺序是 fact(5)、fact(6)、fact(7)……永远到不了 fact(1)。" },
      { level: 2, text: "把 n + 1 改成 n - 1，让问题规模逐步缩小。" },
      {
        level: 3,
        text: `def fact(n):
    if n == 1:
        return 1
    return n * fact(n - 1)

print(fact(5))`,
      },
    ],
    reveal: {
      title: "递归调用必须向基线条件靠近",
      body: "只写终止条件还不够。每次调用都要缩小问题规模，并保证最终能到达终止条件。",
    },
    expectedOutput: "120",
  },
  {
    id: "fn-recur-folder",
    title: "嵌套文件夹统计",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-recur-folder.svg",
        alt: "嵌套文件夹统计：遇到整数直接返回大小，遇到列表就对每个子项递归再相加，总共 490",
      },
    },
    code: code(`# 整数表示文件大小(KB)，列表表示子文件夹（嵌套层数未知）
def folder_size(node):
    if isinstance(node, int):
        return node
    total = 0
    for child in node:
        total += folder_size(child)
    return total

project = [120, [45, 80], [200, [15, 30]]]
print(folder_size(project))`),
    expectedOutput: "490",
  },
  {
    id: "fn-recur-practice",
    title: "练习：power",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`# 用递归定义 power(x, n)，计算 x 的 n 次方（n 为非负整数）
# 终止条件：n == 0 时返回 1
# 递推关系：x * power(x, n - 1)
def power(x, n):
    pass

print(power(2, 0))
print(power(2, 5))
print(power(3, 4))`),
    hints: [
      { level: 1, text: "先写 if n == 0: return 1。" },
      { level: 2, text: "否则 return x * power(x, n - 1)。" },
      {
        level: 3,
        text: `def power(x, n):
    if n == 0:
        return 1
    return x * power(x, n - 1)

print(power(2, 0))
print(power(2, 5))
print(power(3, 4))`,
      },
    ],
    reveal: {
      title: "每次递归将指数 n 减 1，直到 n == 0",
      body: "2^0 = 1，2^5 = 32，3^4 = 81。",
    },
    expectedOutput: `1
32
81`,
  },
  {
    id: "fn-recur-flatten",
    title: "练习：展开嵌套列表",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`# 定义 flatten(items)，把任意层数的嵌套列表展开为一层
# 遇到列表：递归展开；遇到普通元素：直接加入结果
def flatten(items):
    pass

print(flatten([1, [2, 3], [4, [5, [6]]]]))
print(flatten([]))`),
    hints: [
      { level: 1, text: "先创建 result = []，再遍历 items。" },
      { level: 2, text: "列表用 result.extend(flatten(item))；普通元素用 result.append(item)。" },
      {
        level: 3,
        text: `def flatten(items):
    result = []
    for item in items:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result

print(flatten([1, [2, 3], [4, [5, [6]]]]))
print(flatten([]))`,
      },
    ],
    reveal: {
      title: "数据结构嵌套，处理过程也递归",
      body: "停止条件是「这个元素不是列表」，把它放进结果。空列表不是停止条件，它没有元素，循环不进入，所以结果是 []。一层里可以有多项，每一项各自决定要不要再递归。",
    },
    expectedOutput: `[1, 2, 3, 4, 5, 6]
[]`,
  },
  {
    id: "fn-recur-hanoi",
    title: "拓展：汉诺塔",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      hanoiTrace: {
        disks: 3,
      },
    },
    code: code(`# 把 n 个圆盘从 source 经 auxiliary 移到 target
def hanoi(n, source, auxiliary, target):
    if n == 1:
        print(source, "->", target)
        return

    # 1. 上面的 n-1 个先让路
    hanoi(n - 1, source, target, auxiliary)
    # 2. 最大圆盘移到目标柱
    print(source, "->", target)
    # 3. n-1 个再移到最大圆盘上
    hanoi(n - 1, auxiliary, source, target)

hanoi(3, "A", "B", "C")`),
    expectedOutput: `A -> C
A -> B
C -> B
A -> C
B -> A
B -> C
A -> C`,
  },
  {
    id: "fn-recur-syntax",
    title: "语法小结：递归",
    type: "explain",
    layout: "fullscreen",
    content: {
      syntaxMap: {
        root: "递归",
        branches: [
          {
            title: "终止条件",
            code: `if n == 0:
    return 1`,
            notes: ["基线条件", "不再调用自身，直接返回"],
          },
          {
            title: "缩小规模",
            code: `return n * fact(n - 1)`,
            notes: ["调用自身", "每次让问题更小"],
          },
          {
            title: "保证能够到达",
            code: `fact(n - 1)`,
            notes: ["规模逐步缩小", "方向必须靠近基线条件"],
          },
          {
            title: "调用栈过深",
            code: `RecursionError`,
            notes: ["每次调用产生一个栈帧", "超过最大递归深度"],
          },
          {
            title: "选用递归",
            code: `[120, [45, 80], [200, [15]]]`,
            notes: ["树、文件夹、任意层嵌套结构", "简单重复计算通常优先用循环"],
          },
          {
            title: "拆成同类子问题",
            code: `hanoi(n - 1, ...)`,
            notes: ["先移动上面的 n-1 个", "n 个圆盘最少移动 2ⁿ - 1 次"],
          },
        ],
      },
    },
  },
];
