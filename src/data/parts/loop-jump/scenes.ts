import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** break 离开整个循环；continue 跳过本轮剩余语句，进入下一轮。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-jump-aisle",
    title: "第 3 座不出售",
    type: "explain",
    layout: "split",
    content: { loopPath: { topic: "jump", mode: "aisle" } },
    code: code(`for row in range(1, 6):
    for seat in range(1, 7):
        if seat == 3:
            continue
        print("第", row, "排，第", seat, "座")
`),
  },
  {
    id: "scene-jump-break",
    title: "break",
    type: "explain",
    layout: "split",
    content: { loopPath: { topic: "jump", mode: "break" } },
    code: code(`for row in range(1, 6):
    for seat in range(1, 7):
        if seat == 3:
            break
        print("第", row, "排，第", seat, "座")
`),
  },
  {
    id: "scene-jump-continue",
    title: "break 与 continue",
    type: "explain",
    layout: "fullscreen",
    content: { loopPath: { topic: "jump", mode: "continue" } },
  },
  {
    id: "scene-jump-read-break",
    title: "阅读分析代码",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: { loopPath: { topic: "jump", mode: "read" } },
    code: code(`for i in range(3):
    password = input("请输入密码：")
    if password == "123456":
        print("登录成功")
        break
    print("密码错误")

print("本次登录验证结束")
`),
  },
  {
    id: "scene-jump-read-continue",
    title: "阅读分析代码",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: { loopPath: { topic: "jump", mode: "read" } },
    code: code(`for i in range(3):
    password = input("请输入密码：")
    if password == "123456":
        print("登录成功")
        continue
    print("密码错误")

print("本次登录验证结束")
`),
  },
  {
    id: "scene-jump-read-order",
    title: "阅读分析代码",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: { loopPath: { topic: "jump", mode: "read" } },
    code: code(`for i in range(3):
    password = input("请输入密码：")
    if password == "123456":
        print("登录成功")
    print("密码错误")
    break

print("本次登录验证结束")
`),
  },
  {
    id: "scene-jump-read-total",
    title: "阅读分析代码",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: { loopPath: { topic: "jump", mode: "read" } },
    code: code(`total = 0

while True:
    price = int(input("请输入商品价格："))

    if price < 0:
        continue

    if price == 0:
        break

    total += price

print("总金额：", total)
`),
  },
  {
    id: "scene-jump-read-board",
    title: "阅读分析代码",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: { loopPath: { topic: "jump", mode: "read" } },
    code: code(`total = 0

while True:
    n = int(input("本站上车人数："))

    if n < 0:
        break

    if n == 0:
        continue

    total += n

print("上车总人数：", total)
`),
  },
  {
    id: "scene-jump-read-zero",
    title: "阅读分析代码",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: { loopPath: { topic: "jump", mode: "read" } },
    code: code(`while True:
    n = int(input("请输入整数，输入0结束："))

    if n == 0:
        break

    print("输入的数字是：", n)
`),
  },
  {
    id: "scene-jump-check",
    title: "综合练习",
    type: "challenge",
    layout: "split",
    content: { loopPath: { topic: "jump", mode: "check" } },
    code: code("# 编写程序，判断用户输入的密码是否同时包含英文字母和数字\n"),
    hints: [
      { level: 1, text: "用 for ch in password 逐个看字符。用两个变量记下有没有见过字母、有没有见过数字。" },
      { level: 2, text: "数字：'0' <= ch <= '9'。字母再分小写和大写。" },
      {
        level: 3,
        text: "password = input(\"请输入密码：\")\nhas_letter = False\nhas_digit = False\nfor ch in password:\n    if '0' <= ch <= '9':\n        has_digit = True\n    elif 'a' <= ch <= 'z' or 'A' <= ch <= 'Z':\n        has_letter = True\nif has_letter and has_digit:\n    print(\"符合要求\")\nelse:\n    print(\"不符合要求\")",
      },
    ],
    reveal: {
      title: "对照",
      body: "abc123、Py2026 符合要求。python 只有字母，123456 只有数字，不符合。",
    },
  },
  {
    id: "scene-jump-close",
    title: "Python 循环小结",
    type: "explain",
    layout: "fullscreen",
    content: { loopPath: { topic: "jump", mode: "close" } },
  },
  {
    id: "scene-jump-homework",
    title: "本讲作业",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "课后作业",
      loopPath: { topic: "jump", mode: "homework" },
      bulletPoints: [],
    },
  },
];
