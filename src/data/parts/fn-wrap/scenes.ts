import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 三道易错代码分析、本讲总结、课后作业。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-wrap-unbound",
    title: "代码分析 1：先读后赋值",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      body: "🤔 函数里能不能直接给全局变量 count 加 1？",
    },
    code: code(`count = 0

def add():
    count = count + 1
    return count

print(add())`),
    prediction: {
      question: "运行结果是？",
      options: [
        { id: "one", label: "A. 1" },
        { id: "zero", label: "B. 0" },
        { id: "error", label: "C. 报错", isCorrect: true },
      ],
    },
    reveal: {
      title: "函数里一旦给 count 赋值，count 就是局部变量",
      body: "count = ... 让整个函数里的 count 都成了局部变量，右边的 count + 1 读取的是还没赋值的局部变量，引发 UnboundLocalError。\n改法：把 count 作为参数传入，用 return 交回新值：def add(count): return count + 1。",
    },
  },
  {
    id: "fn-wrap-default-list",
    title: "代码分析 2：默认值是列表",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      body: "🤔 两次调用都没传 playlist，用的是同一个列表吗？",
    },
    code: code(`def add_song(song, playlist=[]):
    playlist.append(song)
    return playlist

print(add_song("晴天"))
print(add_song("稻香"))`),
    prediction: {
      question: "第二行打印什么？",
      options: [
        { id: "fresh", label: "A. ['稻香']" },
        { id: "shared", label: "B. ['晴天', '稻香']", isCorrect: true },
        { id: "error", label: "C. 报错" },
      ],
    },
    reveal: {
      title: "默认值只在 def 执行时创建一次",
      body: "两次调用共用同一个默认列表，第二次在第一次的基础上继续 append。\n改法：默认值写 None，在函数里新建列表：\ndef add_song(song, playlist=None):\n    if playlist is None:\n        playlist = []",
    },
  },
  {
    id: "fn-wrap-print-return",
    title: "代码分析 3：print 不是 return",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      body: "🤔 map 收集的是什么？",
    },
    code: code(`def double(x):
    print(x * 2)

nums = list(map(double, [1, 2, 3]))
print(nums)`),
    prediction: {
      question: "最后一行打印什么？",
      options: [
        { id: "values", label: "A. [2, 4, 6]" },
        { id: "none", label: "B. [None, None, None]", isCorrect: true },
        { id: "error", label: "C. 报错" },
      ],
    },
    reveal: {
      title: "map 收集的是每次调用的返回值",
      body: "double 只打印、不返回，每次调用得到 None。屏幕上先出现 2、4、6，最后一行是 [None, None, None]。\n改法：把 print(x * 2) 改成 return x * 2。",
    },
  },
  {
    id: "fn-wrap-points",
    title: "本讲总结",
    type: "explain",
    layout: "fullscreen",
    content: {
      syntaxMap: {
        root: "函数",
        branches: [
          {
            title: "定义与返回",
            code: `def f(x):
    return 结果`,
            notes: ["没有 return 得到 None", "print 不是返回"],
          },
          {
            title: "参数",
            code: `def f(a, b=1, *args, k=0, **kw):`,
            notes: ["调用时位置实参在前", "默认值不要用列表"],
          },
          {
            title: "作用域",
            code: `def add(count):
    return count + 1`,
            notes: ["函数内赋值即局部变量", "参数传入，return 交回"],
          },
          {
            title: "函数作数据",
            code: `sorted(fs, key=lambda x: x[1])`,
            notes: ["函数名可以作实参", "一次性小函数用 lambda"],
          },
          {
            title: "递归",
            code: `if n <= 1: return 1
return n * fact(n - 1)`,
            notes: ["必须有终止条件", "每次让规模变小"],
          },
        ],
      },
    },
  },
  {
    id: "fn-wrap-homework",
    title: "课后作业",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "课后作业",
      bulletPoints: [],
    },
  },
];
