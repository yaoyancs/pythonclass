import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** *args 与 **kwargs。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-var-args",
    title: "可变位置参数 *args",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-var-args.svg",
        alt: "*args：调用时的多个位置实参被收集成一个元组 args，再用 \"/\".join 拼成路径",
      },
    },
    code: code(`# *args：在形参前加单星号 *，将调用时传入的任意多个位置实参自动收集成一个元组（tuple）
def join_path(*args):
    print(args)
    return "/".join(args)

print(join_path("src", "app.py"))
print(join_path("data", "2026", "11", "log.txt"))`),
    expectedOutput: `('src', 'app.py')
src/app.py
('data', '2026', '11', 'log.txt')
data/2026/11/log.txt`,
  },
  {
    id: "fn-var-kwargs",
    title: "可变关键字参数 **kwargs",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-var-kwargs.svg",
        alt: "**kwargs：调用时的多个 名=值 关键字实参被收集成一个字典 kwargs",
      },
    },
    code: code(`#在形参前加双星号 **，将调用时传入的任意多个 名=值 关键字实参自动收集成一个字典（dict
def make_config(**kwargs):
    print(kwargs)

make_config(lr=0.01, epochs=50, batch=32)`),
    expectedOutput: "{'lr': 0.01, 'epochs': 50, 'batch': 32}",
  },
  {
    id: "fn-var-both",
    title: "三类参数混合定义顺序",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-var-both.svg",
        alt: "三类形参的顺序：task 接第一个位置实参，*files 收集其余位置实参成元组，**options 收集关键字实参成字典",
      },
    },
    code: code(`# 普通形参、*args、**kwargs 可以按顺序组合使用，
#普通形参在前，*args 在中，**kwargs 在后
def run_task(task, *files, **options):
    print(task)
    print(files)
    print(options)

run_task("compress", "a.png", "b.png", quality=80, fmt="webp")`),
    expectedOutput: `compress
('a.png', 'b.png')
{'quality': 80, 'fmt': 'webp'}`,
  },
  {
    id: "fn-var-kwonly",
    title: "仅限关键字参数",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-var-kwonly.svg",
        alt: "仅限关键字参数：*parts 后面的 sep 只能写 sep=\"-\"；按位置写的 \"-\" 会被 *parts 收走，结果变成 src/app.py/-",
      },
    },
    code: code(`# 写在 *args 后面的形参，只能用 名=值 传入
# 按位置写的实参都会被 *parts 收走
def join_path(*parts, sep="/"):
    return sep.join(parts)

print(join_path("src", "app.py"))
print(join_path("src", "app.py", sep="-"))
print(join_path("src", "app.py", "-"))`),
    expectedOutput: `src/app.py
src-app.py
src/app.py/-`,
  },
  {
    id: "fn-var-practice",
    title: "练习",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`# 定义 span(*values)，返回任意个数采样值的极差（最大值 - 最小值）
# 若未传入任何数（len(values) == 0），返回 0
def span(*values):
    pass

print(span(12, 18, 9, 25))
print(span(7))
print(span())`),
    hints: [
      { level: 1, text: "先判断 if len(values) == 0: return 0，再返回 max(values) - min(values)。" },
      { level: 2, text: "values 是一个元组，可以直接传给 max() 和 min()。" },
      {
        level: 3,
        text: `def span(*values):
    if len(values) == 0:
        return 0
    return max(values) - min(values)

print(span(12, 18, 9, 25))
print(span(7))
print(span())`,
      },
    ],
    reveal: {
      title: "*values 在无实参时为空元组 ()",
      body: "4 个数的极差为 25 - 9 = 16，单个数的极差为 0，空调用返回 0。",
    },
    expectedOutput: `16
0
0`,
  },
  {
    id: "fn-var-syntax",
    title: "语法小结：可变参数",
    type: "explain",
    layout: "fullscreen",
    content: {
      syntaxMap: {
        root: "可变参数",
        branches: [
          {
            title: "*args",
            code: `def f(*args): ...
f("src", "app.py")`,
            notes: ["收集任意多个位置实参", "得到元组"],
          },
          {
            title: "**kwargs",
            code: `def f(**kwargs): ...
f(lr=0.01, epochs=50)`,
            notes: ["收集任意多个 名=值", "得到字典"],
          },
          {
            title: "定义顺序",
            code: `def f(task, *files, **opts): ...`,
            notes: ["普通形参在前", "*args 在中", "**kwargs 在后"],
          },
          {
            title: "仅限关键字参数",
            code: `def f(*parts, sep="/"): ...
f("a", "b", sep="-")`,
            notes: ["写在 *args 后面", "只能用 名=值 传入"],
          },
        ],
      },
    },
  },
];
