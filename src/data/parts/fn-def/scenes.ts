import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 定义函数：无参数 → 形参实参 → 位置与个数 → 返回值 → 提前返回 → 多返回值 → 互相调用。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-def-shape",
    title: "定义函数",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-def-shape.svg",
        alt: "定义函数的结构：def 开头、函数名、括号、冒号、缩进的函数体，调用时才执行",
      },
    },
    code: code(`# 没有参数，没有返回值
def print_box():
    print("+------+")
    print("|  OK  |")
    print("+------+")

print_box()`),
    expectedOutput: `+------+
|  OK  |
+------+`,
  },
  {
    id: "fn-def-param",
    title: "形参与实参",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-def-param.svg",
        alt: "形参与实参：定义时的 phone 是形参，调用时的 \"13812345678\" 是实参",
      },
    },
    code: code(`# phone 是形参，调用时传入的 "13812345678" 是实参
def mask_phone(phone):
    masked = phone[:3] + "****" + phone[-4:]
    print(masked)

mask_phone("13812345678")
mask_phone("19987654321")`),
    expectedOutput: `138****5678
199****4321`,
  },
  {
    id: "fn-def-pos",
    title: "位置对应",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-def-pos.svg",
        alt: "位置实参从左到右对应形参：(100, 10) 得到 10.0，换成 (10, 100) 得到 0.1",
      },
    },
    code: code(`# 位置实参按从左到右顺序绑定形参
def download_time(size_mb, speed):
    seconds = round(size_mb / speed, 2)
    print(seconds)

download_time(100, 10)
download_time(10, 100)`),
    expectedOutput: `10.0
0.1`,
  },
  {
    id: "fn-def-missing",
    title: "实参个数",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-def-missing.svg",
        alt: "实参个数不够：download_time(100) 只给了 size_mb，speed 没有实参，报 TypeError",
      },
    },
    code: code(`# 无默认值的形参各需要一个实参
def download_time(size_mb, speed):
    seconds = round(size_mb / speed, 2)
    print(seconds)

download_time(100)`),
    hints: [
      { level: 1, text: "TypeError: download_time() missing 1 required positional argument: 'speed'" },
      { level: 2, text: "补上第二个实参，写成 download_time(100, 10)。" },
      {
        level: 3,
        text: `def download_time(size_mb, speed):
    seconds = round(size_mb / speed, 2)
    print(seconds)

download_time(100, 10)`,
      },
    ],
    reveal: {
      title: "无默认值的形参各需要一个实参",
      body: "download_time 需要 size_mb 和 speed，调用只传了 100。",
    },
    expectedOutput: "10.0",
  },
  {
    id: "fn-def-none",
    title: "没有 return",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-def-none.svg",
        alt: "没有 return：download_time 只在屏幕打印 10.0，调用结果是 None，t 得到 None",
      },
    },
    code: code(`# 不写 return 时，调用结果默认是 None
def download_time(size_mb, speed):
    seconds = round(size_mb / speed, 2)
    print(seconds)

t = download_time(100, 10)
print(t)`),
    expectedOutput: `10.0
None`,
  },
  {
    id: "fn-def-return",
    title: "返回值",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-def-return.svg",
        alt: "return 把结果交回调用处：两次调用分别得到 10.0 和 2.5，相加后 total 为 12.5",
      },
    },
    code: code(`# 用 return 返回结果，调用表达式可以继续参加运算
def download_time(size_mb, speed):
    seconds = round(size_mb / speed, 2)
    return seconds

total = download_time(100, 10) + download_time(25, 10)
print(total)`),
    expectedOutput: "12.5",
  },
  {
    id: "fn-def-stop",
    title: "return 结束调用",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-def-stop.svg",
        alt: "执行到 return 立即结束：长度不足、纯数字、通过三个出口，最后一行 print 不会执行",
      },
    },
    code: code(`# 一旦执行到 return，函数立即结束，下方语句不再执行
def check_password(pwd):
    if len(pwd) < 8:
        return "长度不足"
    if pwd.isdigit():
        return "不能纯数字"
    return "通过"
    print("这一行永远不会执行")

print(check_password("12345"))
print(check_password("12345678"))
print(check_password("py2026ok"))`),
    expectedOutput: `长度不足
不能纯数字
通过`,
  },
  {
    id: "fn-def-many",
    title: "多个返回值",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-def-many.svg",
        alt: "多个返回值：return mins, secs 打包成元组 (2, 15)，再分别交给 m 和 s",
      },
    },
    code: code(`# 把视频总秒数拆成「分钟」和「剩余秒数」
def parse_duration(seconds):
    mins = seconds // 60
    secs = seconds % 60
    return mins, secs

m, s = parse_duration(135)
print(m, "分", s, "秒")`),
    expectedOutput: "2 分 15 秒",
  },
  {
    id: "fn-def-mutual",
    title: "函数互相调用",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-def-mutual.svg",
        alt: "函数互相调用：ping 和 pong 互相调用没有出口会 RecursionError；pong 不再调用 ping 就能结束",
      },
    },
    code: code(`# ping 与 pong 互相调用，没有出口会报 RecursionError
def ping():
    print("ping")
    pong()

def pong():
    print("pong")
    ping()

ping()`),
    hints: [
      { level: 1, text: "RecursionError: maximum recursion depth exceeded" },
      { level: 2, text: "删掉 pong() 里的 ping()，让调用在 pong 处停止。" },
      {
        level: 3,
        text: `def ping():
    print("ping")
    pong()

def pong():
    print("pong")

ping()`,
      },
    ],
    reveal: {
      title: "ping 与 pong 互相调用没有终止",
      body: "调用链必须有一层不再回调对方。",
    },
    expectedOutput: `ping
pong`,
  },
  {
    id: "fn-def-practice",
    title: "练习",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`# 定义函数，功能是： 判断一个正整数是否为素数


`),
    hints: [
      { level: 1, text: "先写 if n < 2: return False，再用 for i in range(2, n): 判断 n % i == 0。" },
      { level: 2, text: "循环内发现 n % i == 0 时立即 return False，循环结束后 return True。" },
      {
        level: 3,
        text: `def is_prime(n):
    if n < 2:
        return False
    for i in range(2, n):
        if n % i == 0:
            return False
    return True

print(is_prime(1))
print(is_prime(9))
print(is_prime(17))`,
      },
    ],
    reveal: {
      title: "利用提前 return 判断素数",
      body: "1 不是素数，9 能被 3 整除提前返回 False，17 循环结束返回 True。",
    },
    expectedOutput: `False
False
True`,
  },
  {
    id: "fn-def-syntax",
    title: "语法小结：定义函数",
    type: "explain",
    layout: "fullscreen",
    content: {
      syntaxMap: {
        root: "定义函数",
        branches: [
          {
            title: "定义",
            code: `def 函数名(形参):
    函数体`,
            notes: ["函数体缩进", "定义后调用才执行"],
          },
          {
            title: "形参与实参",
            code: `def f(size, speed): ...
f(100, 10)`,
            notes: ["实参按位置对应形参", "个数要一致"],
          },
          {
            title: "return",
            code: `return 结果
return a, b`,
            notes: ["执行到 return 立即结束", "没有 return 得到 None"],
          },
          {
            title: "互相调用",
            code: `def a():
    b()`,
            notes: ["函数里可以调用别的函数", "必须有一层停下来"],
          },
        ],
      },
    },
  },
];
