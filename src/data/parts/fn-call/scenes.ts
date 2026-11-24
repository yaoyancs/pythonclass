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
        alt: "局部变量：dist 只在 earth_drop 调用期间存在，函数外 print(dist) 报 NameError",
      },
    },
    code: code(`# 函数内赋值的局部变量 dist，离开函数后不能直接访问
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
        alt: "全局变量：earth_drop 里只读取 GRAVITY，函数内没有就到函数外找到 9.8",
      },
    },
    code: code(`# 函数内只读取、不赋值，直接使用全局常量 GRAVITY
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
    id: "fn-call-practice",
    title: "练习",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`# 定义函数，功能： 设定一个限速值，判断车速是否超速（大于限速）
`),
    hints: [
      { level: 1, text: "return speed > SPEED_LIMIT。函数内不要给 SPEED_LIMIT 赋值。" },
      { level: 2, text: "110 未超速返回 False，135 超速返回 True。" },
      {
        level: 3,
        text: `SPEED_LIMIT = 120

def is_overspeed(speed):
    return speed > SPEED_LIMIT

print(is_overspeed(110))
print(is_overspeed(135))`,
      },
    ],
    reveal: {
      title: "函数内直接读取全局常量 SPEED_LIMIT",
      body: "110 得到 False，135 得到 True。",
    },
    expectedOutput: `False
True`,
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
            notes: ["函数内赋值", "函数外不能访问"],
          },
          {
            title: "全局变量",
            code: `GRAVITY = 9.8
def f(t):
    return GRAVITY * t`,
            notes: ["函数外定义", "函数内只读取，可以直接用"],
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
