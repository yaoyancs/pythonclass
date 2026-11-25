import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 把函数对象当作实参传递。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-fnarg-object",
    title: "函数名与函数调用",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {},
    code: code(`# 先猜一猜：下面两行输出有什么不同？
print(str.strip)
print(str.strip("  Python  "))

# 不加括号：得到函数对象
# 加上括号：执行函数，得到返回值`),
    expectedOutput: `<method 'strip' of 'str' objects>
Python`,
  },
  {
    id: "fn-fnarg-apply",
    title: "把函数作为参数传入",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-fnarg-apply.svg",
        alt: "函数当实参：把 str.strip 这个函数对象（不加括号）交给形参 rule，函数体里 rule(text) 才执行它",
      },
    },
    code: code(`# 不加括号传入函数对象；进入 apply_rule 后再执行它
def apply_rule(text, rule):
    return rule(text)

raw = "  Python_3.12  "
print(apply_rule(raw, str.strip))
print(apply_rule(raw, str.lower))
print(apply_rule(raw, str.upper))`),
    expectedOutput: `Python_3.12
  python_3.12  
  PYTHON_3.12  `,
  },
  {
    id: "fn-fnarg-call",
    title: "通过形参名调用",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-fnarg-call.svg",
        alt: "通过形参名调用：to_slug 传给 rule 后，rule.__name__ 是 'to_slug'，rule(text) 就是 to_slug(text)",
      },
    },
    code: code(`# 传入自定义函数对象，在函数体内通过形参名调用
def to_slug(text):
    return text.strip().lower().replace(" ", "-")

def apply_rule(text, rule):
    print(rule.__name__)
    return rule(text)

print(apply_rule("  Hello Python World  ", to_slug))`),
    expectedOutput: `to_slug
hello-python-world`,
  },
  {
    id: "fn-fnarg-practice",
    title: "练习：batch_apply",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`# batch_apply(items, fn)：对每一项调用 fn，把结果收成新列表返回。
# shout(text)：自己定义，把文字变成大写后返回。

def batch_apply(items, fn):
    pass

def shout(text):
    pass

tags = ["  Python ", " AI", "Web  "]
print(batch_apply(tags, str.strip))
print(batch_apply(["a", "bb", "ccc"], len))
print(batch_apply(["python", "ai"], shout))`),
    hints: [
      { level: 1, text: "传给 batch_apply 的是函数名，不要加括号。str.strip 和 shout 都这样传。" },
      { level: 2, text: "遍历 items，把 fn(x) 放进新列表。shout 用 return text.upper()。" },
      {
        level: 3,
        text: `def batch_apply(items, fn):
    result = []
    for x in items:
        result.append(fn(x))
    return result

def shout(text):
    return text.upper()

tags = ["  Python ", " AI", "Web  "]
print(batch_apply(tags, str.strip))
print(batch_apply(["a", "bb", "ccc"], len))
print(batch_apply(["python", "ai"], shout))`,
      },
    ],
    reveal: {
      title: "同一个 batch_apply，通过换 fn 实现不同批处理",
      body: "str.strip、len 和自己写的 shout 都是传入的处理方法。这就是下一节 map 的核心。",
    },
    expectedOutput: `['Python', 'AI', 'Web']
[1, 2, 3]
['PYTHON', 'AI']`,
  },
  {
    id: "fn-fnarg-syntax",
    title: "语法小结：函数类型参数",
    type: "explain",
    layout: "fullscreen",
    content: {
      syntaxMap: {
        root: "函数作参数",
        branches: [
          {
            title: "函数名与调用",
            code: `str.strip
str.strip("  Python  ")`,
            notes: ["不加括号：函数对象", "加括号：执行并取得结果"],
          },
          {
            title: "函数作为实参",
            code: `apply(raw, str.strip)
apply(raw, to_slug)`,
            notes: ["传函数名，不加括号", "形参接收处理方法"],
          },
          {
            title: "通过形参调用",
            code: `def apply(text, rule):
    return rule(text)`,
            notes: ["用形参名加括号调用", "换一个函数，就换一种处理"],
          },
          {
            title: "连接高阶函数",
            code: `batch_apply(items, fn)`,
            notes: ["普通参数传数据", "函数参数传处理方法"],
          },
        ],
      },
    },
  },
];
