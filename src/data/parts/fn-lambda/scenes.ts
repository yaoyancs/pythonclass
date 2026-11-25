import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** lambda 与等价的 def，以及配合 sorted(..., key=...)。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-lambda-bridge",
    title: "从 def 到 lambda",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {},
    code: code(`# lambda 会创建函数对象，适合只使用一次的简单函数
def is_hot(t):
    return t >= 35

same_rule = lambda t: t >= 35

print(is_hot(36))
print(same_rule(36))
print(type(same_rule))`),
    expectedOutput: `True
True
<class 'function'>`,
  },
  {
    id: "fn-lambda-parameters",
    title: "参数与自动返回",
    type: "run",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`# lambda 参数: 表达式
# 可以没有参数、一个参数或多个参数；表达式的值自动返回
get_answer = lambda: 42
double = lambda x: x * 2
add = lambda x, y: x + y

print(get_answer())
print(double(5))
print(add(3, 4))`),
    expectedOutput: `42
10
7`,
  },
  {
    id: "fn-lambda-filter",
    title: "lambda 与 filter",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-lambda-filter.svg",
        alt: "lambda 参数: 表达式：lambda t: t >= 35 等价于 def is_hot(t): return t >= 35",
      },
    },
    code: code(`# lambda 参数: 表达式 —— 定义只用一次的单行匿名函数
temps = [31, 36, 29, 38, 35]

print(list(filter(lambda t: t >= 35, temps)))`),
    expectedOutput: "[36, 38, 35]",
  },
  {
    id: "fn-lambda-map",
    title: "lambda 与 map",
    type: "run",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`# map 收集 lambda 对每个元素计算出的新值
nums = [1, 2, 3, 4]
print(list(map(lambda x: x * x, nums)))`),
    expectedOutput: "[1, 4, 9, 16]",
  },
  {
    id: "fn-lambda-def",
    title: "用 lambda 提供排序依据",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-lambda-def.svg",
        alt: "def 与 lambda 等价：get_size 和 lambda item: item[1] 都取元组第 2 项，sorted 按它排序",
      },
    },
    code: code(`# key 函数只提供排序依据，sorted 仍返回原来的文件记录
files = [("report.pdf", 420), ("icon.svg", 12), ("video.mp4", 8600)]

def get_size(item):
    return item[1]

for item in files:
    print(item, "->", get_size(item))

print(sorted(files, key=lambda item: item[1]))`),
    expectedOutput: `('report.pdf', 420) -> 420
('icon.svg', 12) -> 12
('video.mp4', 8600) -> 8600
[('icon.svg', 12), ('report.pdf', 420), ('video.mp4', 8600)]`,
  },
  {
    id: "fn-lambda-practice",
    title: "练习：按气温降序排序",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`# 用 sorted 与 lambda，把 cities 按气温（第 2 项）从高到低排序并打印
cities = [("济南", 34), ("吐鲁番", 41), ("青岛", 27), ("武汉", 37)]

ranked = sorted(cities, key=lambda item: 0, reverse=True)
print(ranked)`),
    hints: [
      { level: 1, text: "把 lambda item: 0 改成 lambda item: item[1]。" },
      { level: 2, text: "reverse=True 已经写好，只需返回每个元组的气温 item[1]。" },
      {
        level: 3,
        text: `cities = [("济南", 34), ("吐鲁番", 41), ("青岛", 27), ("武汉", 37)]

ranked = sorted(cities, key=lambda item: item[1], reverse=True)
print(ranked)`,
      },
    ],
    reveal: {
      title: "lambda 适合作为 sorted 的排序依据 key",
      body: "按 item[1] 降序得到吐鲁番 41、武汉 37、济南 34、青岛 27。",
    },
    expectedOutput: "[('吐鲁番', 41), ('武汉', 37), ('济南', 34), ('青岛', 27)]",
  },
  {
    id: "fn-lambda-syntax",
    title: "语法小结：匿名函数",
    type: "explain",
    layout: "fullscreen",
    content: {
      syntaxMap: {
        root: "lambda",
        branches: [
          {
            title: "写法",
            code: `lambda: 42
lambda x: x * 2
lambda x, y: x + y`,
            notes: ["参数可以有零个、一个或多个", "表达式的值自动返回"],
          },
          {
            title: "与 def 等价",
            code: `def get(x): return x[1]
lambda x: x[1]`,
            notes: ["lambda 创建函数对象", "适合只用一次的小函数"],
          },
          {
            title: "常用位置",
            code: `map(lambda x: x * x, ns)
filter(lambda t: t >= 35, ts)
sorted(fs, key=lambda x: x[1])`,
            notes: ["转换、筛选、提供排序依据"],
          },
          {
            title: "使用边界",
            code: `lambda x: "及格" if x >= 60 else "不及格"`,
            notes: ["冒号后只能写一个表达式", "复杂或需复用的逻辑使用 def"],
          },
        ],
      },
    },
  },
];
