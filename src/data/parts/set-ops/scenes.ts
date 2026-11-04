import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const CLUBS = `guitar = {"周杰伦", "林俊杰", "邓紫棋"}
choir = {"林俊杰", "蔡依林"}`;

/** in、交集、并集、差集。 */
export const scenes: DraftScene[] = [
  {
    id: "set-ops-in",
    title: "是否成员",
    type: "run",
    layout: "split",
    content: {
      headline: "in 与 not in",
      flowDiagram: ["\"林俊杰\" in names"],
      body: "in 判断元素是否属于集合，结果为 True 或 False。成员检测不需要手写循环。",
      bulletPoints: ["元素存在时结果为 True", "元素不存在时结果为 False"],
    },
    code: code(`names = {"周杰伦", "林俊杰"}
print("林俊杰" in names)
print("蔡依林" not in names)`),
  },
  {
    id: "set-ops-calc",
    title: "交并差",
    type: "run",
    layout: "split",
    content: {
      headline: "交集、并集与差集",
      flowDiagram: ["guitar & choir", "guitar | choir", "guitar - choir"],
      body: "& 得到同时属于两个集合的元素。| 得到至少属于其中一个集合的元素。- 得到属于左操作数、不属于右操作数的元素。两个原集合均不被修改。",
      bulletPoints: ["& 交集", "| 并集", "- 差集"],
    },
    code: code(`${CLUBS}
print(guitar & choir)
print(guitar | choir)
print(guitar - choir)
print(guitar)`),
  },
  {
    id: "set-ops-read",
    title: "运算结果",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "两组示例数据的运算结果",
      bulletPoints: [
        "交集：林俊杰",
        "并集：周杰伦、林俊杰、邓紫棋、蔡依林",
        "差集 guitar - choir：周杰伦、邓紫棋",
        "集合输出顺序不固定，比较的是元素成员",
      ],
    },
  },
  {
    id: "set-ops-practice",
    title: "练习：两个社团",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      body: "先输出 guitar 与 choir 的交集，再输出 guitar - choir。每一组按字典序排列，每个元素占一行。",
    },
    code: code(`${CLUBS}
`),
    hints: [
      { level: 1, text: "交集使用 &，差集使用 guitar - choir。" },
      { level: 2, text: "sorted 得到排好序的列表，再用 for 一行打印一个姓名。" },
      {
        level: 3,
        text: "for name in sorted(guitar & choir):\n    print(name)\nfor name in sorted(guitar - choir):\n    print(name)",
      },
    ],
    reveal: {
      title: "对照",
      body: "交集为林俊杰。差集为周杰伦、邓紫棋。",
    },
    expectedOutput: `林俊杰
周杰伦
邓紫棋`,
  },
];
