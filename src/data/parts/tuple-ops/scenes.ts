import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 下标、index、count、len。元组不能增删，操作方法很少。 */
export const scenes: DraftScene[] = [
  {
    id: "tuple-ops-index-get",
    title: "按下标取值",
    type: "run",
    layout: "split",
    content: {
      headline: "根据下标取出数据",
      flowDiagram: ["元组[下标]"],
      body: "下标从 0 开始，写法和列表相同。",
      bulletPoints: ["t1[2] 取出 'hello'"],
    },
    code: code(`t1 = (1, 2, "hello")
print(t1[2])`),
  },
  {
    id: "tuple-ops-slice",
    title: "切片",
    type: "run",
    layout: "split",
    content: {
      headline: "元组和列表一样可以切片",
      flowDiagram: ["元组[起点:终点]"],
      body: "含头不含尾。省略终点则取到末尾。切片得到新元组，原来的不变。",
      bulletPoints: ["t3[2:4] 是 (4, 5)", "t3[2:] 从下标 2 取到末尾"],
    },
    code: code(`t3 = (2, 3, 4, 5, 6)
print(t3[2:4])
print(t3[2:])
print(t3)`),
  },
  {
    id: "tuple-ops-index",
    title: "查找下标",
    type: "run",
    layout: "split",
    content: {
      headline: "index()",
      flowDiagram: ["元组.index(元素)"],
      body: "查找某个数据。数据存在时返回对应的下标，找不到就报错 ValueError。有多个相同元素时，返回第一个匹配项。",
      bulletPoints: ["t1.index('hello') 的结果是 2"],
    },
    code: code(`t1 = (1, 2, "hello", 3, 4, "hello")
print(t1.index("hello"))`),
  },
  {
    id: "tuple-ops-count",
    title: "统计某元素",
    type: "run",
    layout: "split",
    content: {
      headline: "count()",
      flowDiagram: ["元组.count(元素)"],
      body: "统计某个数据在当前元组出现的次数。",
      bulletPoints: ["t1.count('hello') 的结果是 2"],
    },
    code: code(`t1 = (1, 2, "hello", 3, 4, "hello")
print(t1.count("hello"))`),
  },
  {
    id: "tuple-ops-len",
    title: "统计元素个数",
    type: "run",
    layout: "split",
    content: {
      headline: "len(元组)",
      flowDiagram: ["len(元组)"],
      body: "统计元组内的元素个数。",
      bulletPoints: ["len(t1) 的结果是 3"],
    },
    code: code(`t1 = (1, 2, 3)
print(len(t1))`),
  },
  {
    id: "tuple-ops-range",
    title: "由 range 生成",
    type: "run",
    layout: "split",
    content: {
      headline: "tuple(range(...))",
      flowDiagram: ["tuple(range(起点, 终点))"],
      body: "range 先产生整数序列，tuple 把它收成元组。含起点，不含终点。",
      bulletPoints: ["tuple(range(5)) 是 (0, 1, 2, 3, 4)"],
    },
    code: code(`a1 = tuple(range(5))
print(a1)
print(type(a1))`),
  },
  {
    id: "tuple-ops-table",
    title: "元组的相关操作",
    type: "explain",
    layout: "fullscreen",
    content: {
      body: "元组由于不可修改，操作方法非常少。",
      compareTable: {
        indexHeader: "编号",
        leftHeader: "方法",
        rightHeader: "作用",
        rows: [
          { left: "index()", right: "查找某个数据，如果数据存在返回对应的下标，否则报错" },
          { left: "count()", right: "统计某个数据在当前元组出现的次数" },
          { left: "元组[起点:终点]", right: "切片，含头不含尾，得到新元组" },
          { left: "len(元组)", right: "统计元组内的元素个数" },
          { left: "tuple(range(...))", right: "把整数序列收成元组" },
        ],
      },
    },
  },
];
