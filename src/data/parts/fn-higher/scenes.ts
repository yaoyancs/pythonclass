import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** map、filter、sorted(..., key=...)。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-higher-bridge",
    title: "从函数参数到高阶函数",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {},
    code: code(`# 能接收函数作为参数的函数，称为高阶函数
# 上一节自己实现 batch_apply；Python 已经提供了功能相近的 map
def batch_apply(items, fn):
    return [fn(x) for x in items]

raw = ["31", "36", "29", "38"]
print(batch_apply(raw, int))
print(list(map(int, raw)))`),
    expectedOutput: `[31, 36, 29, 38]
[31, 36, 29, 38]`,
  },
  {
    id: "fn-higher-map",
    title: "map",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-higher-map.svg",
        alt: "map(int, raw)：对 raw 中每个字符串都调用一次 int，得到 [31, 36, 29, 38]",
      },
    },
    code: code(`# map(fn, seq) 对序列中每个元素依次调用 fn
# map 返回可迭代的 map 对象，用 list 得到结果列表
raw = ["31", "36", "29", "38"]
converted = map(int, raw)
print(type(converted))
print(list(converted))`),
    expectedOutput: `<class 'map'>
[31, 36, 29, 38]`,
  },
  {
    id: "fn-higher-filter",
    title: "filter",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-higher-filter.svg",
        alt: "filter(is_hot, temps)：每个元素交给 is_hot 判断，只保留结果为 True 的 36、38、35",
      },
    },
    code: code(`# filter 不收集函数的返回值
# 它根据 fn(x) 的真假，决定是否保留原元素 x
temps = [31, 36, 29, 38, 35]

def is_hot(t):
    return t >= 35

print(list(filter(is_hot, temps)))`),
    expectedOutput: "[36, 38, 35]",
  },
  {
    id: "fn-higher-sort",
    title: "sorted 与 key",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-higher-sort.svg",
        alt: "sorted(errors, key=abs)：先算每个元素的 abs 值，按它从小到大排，留下的仍是原来的元素",
      },
    },
    code: code(`# key 参数接收一个函数，按 key(x) 的返回值排序
errors = [-0.5, 2.1, -3.4, 0.2, -1.0]
print(sorted(errors, key=abs))`),
    expectedOutput: "[0.2, -0.5, -1.0, 2.1, -3.4]",
  },
  {
    id: "fn-higher-practice",
    title: "练习：数据清洗流水线",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`# 定义 hot_temps(raw)
# 1. 用 map(int, raw) 把字符串温度列表转为整数
# 2. 用 filter(is_hot, ...) 筛出 >= 35 的高温，转为 list 返回
def is_hot(t):
    return t >= 35

def hot_temps(raw):
    pass

print(hot_temps(["31", "36", "29", "38", "35"]))`),
    hints: [
      { level: 1, text: "先 nums = map(int, raw)，再 return list(filter(is_hot, nums))。" },
      { level: 2, text: "is_hot 已经定义，直接传给 filter 即可。" },
      {
        level: 3,
        text: `def is_hot(t):
    return t >= 35

def hot_temps(raw):
    nums = map(int, raw)
    return list(filter(is_hot, nums))

print(hot_temps(["31", "36", "29", "38", "35"]))`,
      },
    ],
    reveal: {
      title: "map 与 filter 串联完成数据清洗",
      body: "先转为整数，再筛出 36、38、35。",
    },
    expectedOutput: "[36, 38, 35]",
  },
  {
    id: "fn-higher-sort-practice",
    title: "练习：按文件大小降序",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`# 定义 get_size(item)，返回文件记录中的大小
# 再用 sorted 按文件大小从大到小排序
files = [("report.pdf", 420), ("icon.svg", 12), ("video.mp4", 8600)]

def get_size(item):
    pass

ranked = sorted(files, key=get_size, reverse=True)
print(ranked)`),
    hints: [
      { level: 1, text: "每条文件记录是 (文件名, 大小)，大小位于下标 1。" },
      { level: 2, text: "get_size 只负责提供排序依据：return item[1]。" },
      {
        level: 3,
        text: `files = [("report.pdf", 420), ("icon.svg", 12), ("video.mp4", 8600)]

def get_size(item):
    return item[1]

ranked = sorted(files, key=get_size, reverse=True)
print(ranked)`,
      },
    ],
    reveal: {
      title: "key 函数提供排序依据",
      body: "get_size 返回文件大小，sorted 负责排序；结果中保留的仍是原来的文件记录。下一节会用 lambda 简写这个一次性函数。",
    },
    expectedOutput: "[('video.mp4', 8600), ('report.pdf', 420), ('icon.svg', 12)]",
  },
  {
    id: "fn-higher-syntax",
    title: "语法小结：高阶函数",
    type: "explain",
    layout: "fullscreen",
    content: {
      syntaxMap: {
        root: "高阶函数",
        branches: [
          {
            title: "map",
            code: `list(map(int, raw))`,
            notes: ["对每个元素调用一次函数", "收集函数计算出的新值"],
          },
          {
            title: "filter",
            code: `filter(is_hot, temps)`,
            notes: ["根据函数返回的真假", "保留满足条件的原元素"],
          },
          {
            title: "sorted 与 key",
            code: `sorted(errors, key=abs)`,
            notes: ["按 key 函数的返回值排序", "reverse=True 从大到小"],
          },
        ],
      },
    },
  },
];
