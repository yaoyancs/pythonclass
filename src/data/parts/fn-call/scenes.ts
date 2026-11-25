import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 局部名字、读取全局名字、局部赋值遮蔽。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-call-local",
    title: "局部变量",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-call-local.svg",
        alt: "局部名字 dist 只在这次调用里能用。函数返回后，外面不能写 dist；返回的那个数还在",
      },
    },
    code: code(`# dist 是函数里的名字，外面不能写 dist
# return 交回的是那个数，不是把名字一起交出去
def earth_drop(t):
    dist = round(0.5 * 9.8 * t * t, 2)
    return dist

print(earth_drop(3))
print(dist)`),
  },
  {
    id: "fn-call-read",
    title: "全局变量",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-call-read.svg",
        alt: "函数体里没有给 GRAVITY 赋值，读取的才是全局 9.8。只要有赋值，整个函数里的 GRAVITY 都是局部名字",
      },
    },
    code: code(`# 函数体里没有 GRAVITY = ...，读取的是全局名字
GRAVITY = 9.8

def earth_drop(t):
    return round(0.5 * GRAVITY * t * t, 2)

print(earth_drop(2))
print(earth_drop(3))`),
    expectedOutput: `19.6
44.1`,
  },
  {
    id: "fn-call-shadow",
    title: "局部赋值",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-call-shadow.svg",
        alt: "同名赋值：moon_drop 里的 GRAVITY = 1.62 是新的局部变量，全局 GRAVITY 仍是 9.8",
      },
    },
    code: code(`# 函数内对同名变量赋值，只新建局部变量，不改全局 GRAVITY
GRAVITY = 9.8

def moon_drop(t):
    GRAVITY = 1.62
    return round(0.5 * GRAVITY * t * t, 2)

print(moon_drop(2))
print(GRAVITY)`),
    expectedOutput: `3.24
9.8`,
  },
  {
    id: "fn-call-bind",
    title: "改对象，还是改名字",
    type: "run",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {
      codeEvolution: {
        captions: [
          "append 改的是同一个列表",
          "data = ... 只改函数里的名字",
          "n = n + 1 也只改函数里的名字",
        ],
        focus: [2, 2, 2],
        steps: [
          `def change(data):
    data.append(4)

numbers = [1, 2, 3]
change(numbers)
print(numbers)`,
          `def change(data):
    data = [4, 5, 6]

numbers = [1, 2, 3]
change(numbers)
print(numbers)`,
          `def change(n):
    n = n + 1

number = 10
change(number)
print(number)`,
        ],
      },
    },
    code: code(`def change(data):
    data.append(4)

numbers = [1, 2, 3]
change(numbers)
print(numbers)`),
    expectedOutput: "[1, 2, 3, 4]",
  },
  {
    id: "fn-call-practice",
    title: "练习",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`# 三个函数都不要改外面的变量，进度由调用处接收返回值。
# forward(progress, seconds)：快进，返回新进度。
# backward(progress, seconds)：快退，返回新进度。
# show(progress)：按 MM:SS 打印进度，不用返回。
# 总时长 300 秒。进度不能小于 0，也不能超过 300。
# 从 0 秒开始，依次显示：快进 75 秒、再快进 300 秒、快退 30 秒、再快退 400 秒。
# 每次变化前后都显示一次当前进度。`),
    hints: [
      { level: 1, text: "快进、快退算出新进度后 return，不要写 global。调用处用 progress = forward(...) 接住。" },
      { level: 2, text: "返回前把进度限制在 0 和 TOTAL 之间。show 用 // 和 % 得到分和秒，再按两位打印。" },
      {
        level: 3,
        text: `TOTAL = 300

def forward(progress, seconds):
    progress = progress + seconds
    if progress > TOTAL:
        progress = TOTAL
    return progress

def backward(progress, seconds):
    progress = progress - seconds
    if progress < 0:
        progress = 0
    return progress

def show(progress):
    minute = progress // 60
    second = progress % 60
    print(f"{minute:02d}:{second:02d}")

progress = 0
show(progress)
progress = forward(progress, 75)
show(progress)
progress = forward(progress, 300)
show(progress)
progress = backward(progress, 30)
show(progress)
progress = backward(progress, 400)
show(progress)`,
      },
    ],
    reveal: {
      title: "新进度用 return 交回调用处",
      body: "函数里给 progress 赋值只影响这次调用。75 秒是 01:15，再快进停在 05:00，快退 30 秒是 04:30，再快退停在 00:00。",
    },
    expectedOutput: `00:00
01:15
05:00
04:30
00:00`,
  },
  {
    id: "fn-call-syntax",
    title: "语法小结：变量作用域",
    type: "explain",
    layout: "fullscreen",
    content: {
      syntaxMap: {
        root: "变量作用域",
        branches: [
          {
            title: "局部变量",
            code: `def f(t):
    dist = ...
print(dist)  # 报错`,
            notes: ["函数外不能用这个名字", "return 交回的是对象"],
          },
          {
            title: "全局变量",
            code: `GRAVITY = 9.8
def f(t):
    return GRAVITY * t`,
            notes: ["函数体里没有同名赋值", "有赋值则整个函数都是局部名字"],
          },
          {
            title: "同名赋值",
            code: `GRAVITY = 9.8
def f(t):
    GRAVITY = 1.62`,
            notes: ["函数内新建局部变量", "外面的 GRAVITY 不变"],
          },
        ],
      },
    },
  },
];
