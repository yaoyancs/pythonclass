import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** return、None、return 结束调用。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-return-none",
    title: "没有 return",
    type: "run",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`def make_equal(total, count):
    each = round(total / count, 2)
    print([each] * count)

pool = make_equal(20, 4)
print(pool)`),
    expectedOutput: `[5.0, 5.0, 5.0, 5.0]
None`,
  },
  {
    id: "fn-return-value",
    title: "return",
    type: "debug",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`def calc(total, count):
    each = round(total / count, 2)
    print(each)

print(calc(20, 4) + calc(30, 5))`),
    hints: [
      { level: 1, text: "TypeError: unsupported operand type(s) for +: 'NoneType' and 'NoneType'" },
      { level: 2, text: "把 print(each) 改成 return each。" },
      {
        level: 3,
        text: `def calc(total, count):
    each = round(total / count, 2)
    return each

print(calc(20, 4) + calc(30, 5))`,
      },
    ],
    reveal: {
      title: "调用表达式的值是 return 的操作数",
      body: "calc(20, 4) 为 5.0，calc(30, 5) 为 6.0。",
    },
    expectedOutput: "11.0",
  },
  {
    id: "fn-return-stop",
    title: "return 结束调用",
    type: "run",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`def make_equal(total, count):
    each = round(total / count, 2)
    return [each] * count
    print("发放完毕")

print(make_equal(20, 4))`),
    expectedOutput: "[5.0, 5.0, 5.0, 5.0]",
  },
  {
    id: "fn-return-practice",
    title: "练习：两笔金额相加",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`def calc(total, count):
    pass

print(calc(20, 4) + calc(30, 5))`),
    hints: [
      { level: 1, text: "return round(total / count, 2)" },
      { level: 2, text: "不要在函数里 print。" },
      {
        level: 3,
        text: `def calc(total, count):
    return round(total / count, 2)

print(calc(20, 4) + calc(30, 5))`,
      },
    ],
    reveal: {
      title: "两次调用的返回值相加",
      body: "5.0 + 6.0 = 11.0。",
    },
    expectedOutput: "11.0",
  },
];
