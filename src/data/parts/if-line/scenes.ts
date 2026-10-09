import type { DraftScene } from "../../../types/scene";

/** 单分支：超时才多打一行。单价 1.5，规定 15 分钟。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-if-line-01",
    type: "run",
    layout: "split",
    content: {
      headline: "这行不该总出现",
      bulletPoints: [
        "10 分钟也会打出「本单超时」吗？怎样才能只在超时时出现？",
        "加上 if 之后，「超时：」那一行还在语句块里吗？",
      ],
    },
    code: {
      initial:
        'minutes = 18\nlimit = 15\nprice = 1.5\nfee = minutes * price\novertime = minutes > limit\nprint(f"费用 {fee} 元")\nprint("本单超时")\nprint(f"超时：{overtime}")',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-if-line-03",
    type: "run",
    layout: "split",
    content: {
      headline: "两处会报错",
      bulletPoints: ["报错停在哪一行？改哪一处才能跑过？"],
    },
    code: {
      initial:
        'minutes = 18\nlimit = 15\nif minutes = 18:\nprint("本单超时")',
      editable: true,
      resetToInitial: true,
    },
  },
];
