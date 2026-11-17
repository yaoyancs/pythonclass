import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/**
 * 函数是对象：赋值不调用，圆括号才调用。
 * 补充局部名字空间。不讲闭包、装饰器。
 */
export const scenes: DraftScene[] = [
  {
    id: "fn-call-bind",
    title: "函数名绑定函数对象",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "函数名绑定函数对象",
      image: {
        src: "/lesson08/fn-bind.svg",
        alt: "执行 def 创建函数对象，再把名字绑定到它。定义时函数体不执行。",
      },
    },
    code: code(`def average(scores):
    return sum(scores) / len(scores)

print(average)
print(type(average))`),
  },
  {
    id: "fn-call-paren",
    title: "括号决定是否调用",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "圆括号决定是否调用",
      image: {
        src: "/lesson08/fn-paren.svg",
        alt: "左边 task = average 保存同一个函数；右边加括号才得到返回值。",
      },
    },
    code: code(`def average(scores):
    return sum(scores) / len(scores)

task = average
print(task)
print(task([80, 90]))
print(average([80, 90]))`),
  },
  {
    id: "fn-call-forget",
    title: "调试：忘记写括号",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "补全函数调用与实参",
    },
    code: code(`def average(scores):
    return sum(scores) / len(scores)

res = average
print(res + 5)`),
    hints: [
      { level: 1, text: "print(average) 看到的是函数对象。加上圆括号才会执行。" },
      { level: 2, text: "average 需要一个列表实参。" },
      {
        level: 3,
        text: `def average(scores):
    return sum(scores) / len(scores)

res = average([80, 90, 70])
print(res + 5)`,
      },
    ],
    reveal: {
      title: "对照",
      body: "average([80, 90, 70]) 得到 80.0，再加 5 得到 85.0。漏写括号时，名字仍然指向函数对象。",
    },
    expectedOutput: "85.0",
  },
  {
    id: "fn-call-local",
    title: "局部变量",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "局部变量能否在函数外访问？",
      image: {
        src: "/lesson08/fn-scope.svg",
        alt: "调用时创建局部名字空间，avg 只存在于函数内部；调用结束后局部名字消失。",
      },
    },
    code: code(`def average(scores):
    avg = sum(scores) / len(scores)
    return avg

print(average([80, 90, 70]))
print(avg)`),
    prediction: {
      question: "第二行 print(avg) 会怎样？",
      options: [
        { id: "eighty", label: "再打印一次 80.0" },
        { id: "none", label: "打印 None" },
        { id: "error", label: "报 NameError，外部没有 avg", isCorrect: true },
      ],
    },
    reveal: {
      title: "函数内部的名字默认是局部的",
      body: "avg 是局部变量，函数结束后不可访问。结果须通过 return 传出。",
    },
  },
  {
    id: "fn-call-shadow",
    title: "局部变量与全局变量同名",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "局部变量是否覆盖全局变量？",
    },
    code: code(`line = 60

def is_pass(score):
    line = 90
    return score >= line

print(is_pass(80))
print(line)`),
    prediction: {
      question: "两行 print 的结果依次是？",
      options: [
        { id: "t-90", label: "True 与 90" },
        { id: "f-60", label: "False 与 60", isCorrect: true },
        { id: "f-90", label: "False 与 90" },
        { id: "t-60", label: "True 与 60" },
      ],
    },
    reveal: {
      title: "函数内的赋值绑定局部名字",
      body: "函数里的 line = 90 是局部变量，80 >= 90 为 False。外部的 line 仍是 60。两边只是碰巧同名，不是同一个绑定。",
    },
  },
  {
    id: "fn-call-global",
    title: "用 global 修改外部变量",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "先声明 global，再给外部同名变量赋值",
      bulletPoints: [
        "没有 global 时，函数里的赋值只建立局部名字",
        "global line 表示这一行改的是外面的 line",
      ],
    },
    code: code(`line = 60

def raise_line():
    global line
    line = 90

raise_line()
print(line)`),
    expectedOutput: "90",
  },
  {
    id: "fn-call-table",
    title: "函数对象作为字典的值",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "取出函数对象后再调用",
      image: {
        src: "/lesson08/fn-dict.svg",
        alt: "字典保存函数对象，按键取出后再用圆括号调用。",
      },
    },
    code: code(`def passed(score):
    return score >= 60

def full_mark(score):
    return score == 100

actions = {"及格": passed, "满分": full_mark}
check = actions["及格"]
print(check(60))
print(actions["满分"](99))`),
  },
];
