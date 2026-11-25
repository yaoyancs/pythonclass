import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 用内置函数演示调用：函数名、括号、参数、关键字参数、返回值。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-why-name",
    title: "函数调用",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-why-name.svg",
        alt: "len(date)：len 是函数名，括号表示调用，date 是参数；只写 len 得到函数本身",
      },
    },
    code: code(`date = "2026-11-24"
print(len("Python"))
print(max(18, 25, 21))
print(round(3.14159, 2))


print(len)
print(len(date))`),
    expectedOutput: `6
25
3.14
<built-in function len>
10`,
  },
  {
    id: "fn-why-one",
    title: "一个参数",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-why-one.svg",
        alt: "一个参数：把数据放进括号，len 得到 10，abs 得到 12.5",
      },
    },
    code: code(`# 函数的参数：在调用函数时给函数提供数据
date = "2026-11-24"

print(len(date))
print(abs(-12.5))`),
    expectedOutput: `10
12.5`,
  },
  {
    id: "fn-why-many",
    title: "多个参数",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-why-many.svg",
        alt: "多个参数用逗号分隔：round(3.14159, 2) 得到 3.14，max(18, 25, 21) 得到 25",
      },
    },
    code: code(`# 多个参数用","分隔
print(round(3.14159, 2))
print(max(18, 25, 21))`),
    expectedOutput: `3.14
25`,
  },
  {
    id: "fn-why-sep",
    title: "关键字参数 sep",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-why-sep.svg",
        alt: "关键字参数 sep：不写时 print 用空格分隔，写 sep=\"-\" 用横线分隔",
      },
    },
    code: code(`# 在使用函数时写不写参数，写几个参数由函数自身来决定
print(2026, 11, 24)
print(2026, 11, 24, sep="-")`),
    expectedOutput: `2026 11 24
2026-11-24`,
  },
  {
    id: "fn-why-none",
    title: "函数的返回值",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-why-none.svg",
        alt: "返回值：len(chars) 得到 3 并存进 count；chars.clear() 的返回值是 None",
      },
    },
    code: code(`# 函数的返回值：函数执行得到的结果
text = input()
print(text)
chars = list(text)
count = len(chars)
print(chars)
print(count)
res = chars.clear()
print(chars)
print(res)`),
  },
  {
    id: "fn-why-repeat",
    title: "同一套规则用在两处",
    type: "run",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {
      codeEvolution: {
        captions: [
          "录入一名同学，统计全班又写一遍",
          "规则收进 grade，两处各调用一次",
          "优秀线改成 85，只改函数里",
        ],
        focus: [2, 1, 2],
        steps: [
          `score = 86
if score >= 90:
    level = "优秀"
elif score >= 80:
    level = "良好"
elif score >= 60:
    level = "及格"
else:
    level = "不及格"
print("录入", score, level)

scores = [86, 58, 92]
failed = 0
for score in scores:
    if score >= 90:
        level = "优秀"
    elif score >= 80:
        level = "良好"
    elif score >= 60:
        level = "及格"
    else:
        level = "不及格"
    if level == "不及格":
        failed = failed + 1
print("不及格", failed, "人")`,
          `def grade(score):
    if score >= 90:
        level = "优秀"
    elif score >= 80:
        level = "良好"
    elif score >= 60:
        level = "及格"
    else:
        level = "不及格"
    return level

score = 86
print("录入", score, grade(score))

scores = [86, 58, 92]
failed = 0
for score in scores:
    if grade(score) == "不及格":
        failed = failed + 1
print("不及格", failed, "人")`,
          `def grade(score):
    if score >= 85:
        level = "优秀"
    elif score >= 80:
        level = "良好"
    elif score >= 60:
        level = "及格"
    else:
        level = "不及格"
    return level

score = 86
print("录入", score, grade(score))

scores = [86, 58, 92]
failed = 0
for score in scores:
    if grade(score) == "不及格":
        failed = failed + 1
print("不及格", failed, "人")`,
        ],
      },
    },
    code: code(`score = 86
if score >= 90:
    level = "优秀"
elif score >= 80:
    level = "良好"
elif score >= 60:
    level = "及格"
else:
    level = "不及格"
print("录入", score, level)

scores = [86, 58, 92]
failed = 0
for score in scores:
    if score >= 90:
        level = "优秀"
    elif score >= 80:
        level = "良好"
    elif score >= 60:
        level = "及格"
    else:
        level = "不及格"
    if level == "不及格":
        failed = failed + 1
print("不及格", failed, "人")`),
    expectedOutput: `录入 86 良好
不及格 1 人`,
  },
  {
    id: "fn-why-use",
    title: "语法小结：函数调用",
    type: "explain",
    layout: "fullscreen",
    content: {
      syntaxMap: {
        root: "函数调用",
        branches: [
          {
            title: "调用",
            code: `函数名(参数)`,
            notes: ["函数是一段有特定功能的代码", "调用函数就是使用函数"],
          },
          {
            title: "函数名",
            code: `print(len)`,
            notes: ["函数名是函数的标识符", "不加括号只是函数本身"],
          },
          {
            title: "参数",
            code: `max(18, 25, 21)
print(2026, 11, sep="-")`,
            notes: ["多个参数用逗号分隔", "写几个参数由函数决定"],
          },
          {
            title: "返回值",
            code: `count = len(chars)
res = chars.clear()`,
            notes: ["调用表达式的值就是返回值", "clear() 返回 None"],
          },
        ],
      },
    },
  },
];
