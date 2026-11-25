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
    code: code(`# 设计三个函数，模拟视频播放器的进度控制：
# forward(seconds)：快进指定秒数。
# backward(seconds)：快退指定秒数。
# show()：显示当前播放时间，格式为 MM:SS。
# 视频总时长为 300 秒，初始播放进度为 0 秒。
# 播放进度不能小于 0，也不能超过视频总时长。

show()
forward(75)
show()
forward(300)
show()
backward(30)
show()
backward(400)
show()`),
    hints: [
      { level: 1, text: "总时长和播放进度写在函数外面。要在函数里改播放进度，先写 global。" },
      { level: 2, text: "快进、快退后把进度限制在 0 和 300 之间。show 里用进度算出分和秒，再按两位打印。" },
      {
        level: 3,
        text: `TOTAL = 300
progress = 0

def forward(seconds):
    global progress
    progress = progress + seconds
    if progress > TOTAL:
        progress = TOTAL

def backward(seconds):
    global progress
    progress = progress - seconds
    if progress < 0:
        progress = 0

def show():
    minute = progress // 60
    second = progress % 60
    print(f"{minute:02d}:{second:02d}")

show()
forward(75)
show()
forward(300)
show()
backward(30)
show()
backward(400)
show()`,
      },
    ],
    reveal: {
      title: "播放进度放在函数外，三个函数共用并修改它",
      body: "75 秒是 01:15。再快进 300 秒停在 05:00。快退 30 秒是 04:30，再快退 400 秒停在 00:00。",
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
