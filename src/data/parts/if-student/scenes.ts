import type { DraftScene } from "../../../types/scene";

/** 嵌套：超时后，学生加 2，其他人加 5。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-if-stu-01",
    type: "run",
    layout: "split",
    content: {
      headline: "and 给不出两个加价",
      bulletPoints: ["把 y 改成 n，5 元写在哪里？"],
    },
    code: {
      initial:
        'minutes = 18\nlimit = 15\nprice = 1.5\nstudent = "y"\nfee = 0\nif minutes > limit and student == "y":\n    fee = minutes * price + 2\nprint(fee)',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-if-stu-02",
    type: "run",
    layout: "split",
    content: {
      headline: "外层问超时，内层问学生",
      bulletPoints: ["else 跟的是哪一层？18 分钟的学生为什么没加价？"],
    },
    code: {
      initial:
        'minutes = 18\nlimit = 15\nprice = 1.5\nstudent = "y"\nfee = minutes * price\nif minutes > limit:\n    if student == "n":\n        fee = fee + 5\nelse:\n    fee = fee + 2\nprint(fee)',
      editable: true,
      resetToInitial: true,
    },
  },
];
