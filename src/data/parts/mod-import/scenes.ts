import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/**
 * 模块：别人写好的 .py 可以整份引用。
 * 课堂里用标准库演示；自建文件的写法放在说明里，运行环境一次只执行一段代码。
 */
export const scenes: DraftScene[] = [
  {
    id: "mod-why",
    title: "为什么需要模块",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "功能一多，就不要全写在一个文件里",
      body: "一段脚本能写完的小练习，不必拆文件。功能变多以后，查找、统计、打印报告各放一个 .py，阅读和维护都更清楚。这样的文件就叫模块。使用方只按名字调用里面的函数，不必重写实现。",
      bulletPoints: [
        "一个 .py 文件就是一个模块",
        "import 模块名 之后，用 模块名.函数名() 调用",
        "标准库是 Python 自带、可直接 import 的模块",
      ],
    },
  },
  {
    id: "mod-math",
    title: "引用标准库",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "import math，再用 math. 取出函数",
      bulletPoints: [
        "ceil 向上取整，floor 向下取整",
        "sqrt 开平方；名字前面必须写模块名",
      ],
    },
    code: code(`import math

print(math.ceil(3.2))
print(math.floor(3.2))
print(math.sqrt(16))`),
    expectedOutput: "4\n3\n4.0",
  },
  {
    id: "mod-own",
    title: "自建模块怎么被引用",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "把函数放进 scores.py，调用方只写 import",
      body: "假设同目录有 scores.py，里面定义了 clean_scores。另一份脚本不必复制函数体，写 import scores 即可。调用写成 scores.clean_scores(raw)。调用方不关心函数体怎么写，只使用这个名字。",
      bulletPoints: [
        "scores.py 里：def clean_scores(raw): ...",
        "调用方：import scores",
        "使用：scores.clean_scores([80, -5, 100])",
      ],
    },
  },
  {
    id: "mod-as",
    title: "给模块起短名",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "import 模块 as 短名",
      bulletPoints: ["as 只改本次脚本里的称呼", "原模块名 math 在这行之后不再直接使用"],
    },
    code: code(`import math as m

print(m.ceil(2.1))
print(m.sqrt(9))`),
    expectedOutput: "3\n3.0",
  },
  {
    id: "mod-from",
    title: "只取出需要的名字",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "from 模块 import 名字",
      bulletPoints: [
        "取出后直接写 ceil、sqrt，前面不再加 math.",
        "多个名字用逗号隔开",
      ],
    },
    code: code(`from math import ceil, sqrt

print(ceil(3.2))
print(sqrt(16))`),
    expectedOutput: "4\n4.0",
  },
  {
    id: "mod-star",
    title: "星号导入会盖住同名",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "from math import * 之后，sqrt 指向谁？",
    },
    code: code(`def sqrt(n):
    return "自己的开方"

from math import *

print(sqrt(16))`),
    prediction: {
      question: "print 输出什么？",
      options: [
        { id: "own", label: "自己的开方" },
        { id: "four", label: "4.0", isCorrect: true },
        { id: "error", label: "NameError" },
      ],
    },
    reveal: {
      title: "后导入的名字覆盖先绑定的名字",
      body: "from math import * 把 math 里的 sqrt 绑到当前名字上，前面自己定义的 sqrt 被盖住。函数很多时也看不出名字从哪来，所以课堂练习用 import math 或 from math import ceil。",
    },
  },
  {
    id: "mod-random",
    title: "再引用一个标准库",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "random.choice 从序列里取一项",
      bulletPoints: ["先 import random", "seed 固定后，每次运行结果相同，便于对照"],
    },
    code: code(`import random

random.seed(0)
playlist = ["晴天", "稻香", "夜曲"]
print(random.choice(playlist))
print(random.randint(1, 3))`),
    expectedOutput: "稻香\n2",
  },
  {
    id: "mod-debug",
    title: "调试：先引用再使用",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "补上 import，让 ceil 可用",
    },
    code: code(`print(math.ceil(3.2))`),
    hints: [
      { level: 1, text: "math 不是内置名字，要用之前先 import。" },
      { level: 2, text: "报错是 NameError: name 'math' is not defined。" },
      {
        level: 3,
        text: `import math

print(math.ceil(3.2))`,
      },
    ],
    reveal: {
      title: "对照",
      body: "import 放在第一次使用之前。import math 引入整个模块，调用时写成 math.ceil。",
    },
    expectedOutput: "4",
  },
];
