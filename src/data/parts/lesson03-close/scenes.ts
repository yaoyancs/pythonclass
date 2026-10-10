import type { DraftScene } from "../../../types/scene";

/** 第 3 讲收束：出口题 + 作业。作业条文由开课表覆盖。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-l3-close-01",
    type: "predict",
    layout: "fullscreen",
    content: {
      headline: "第一个条件成立后，后续 elif 是否执行？",
    },
    prediction: {
      question: "多分支里，第一个条件成立之后，后面的 elif 会怎样？",
      options: [
        { id: "all", label: "继续全部检查" },
        { id: "skip", label: "跳过后续分支", isCorrect: true },
        { id: "random", label: "随机选择一个分支" },
      ],
    },
    reveal: {
      body: "今天要带走的是：把问题写成明确条件，让计算机按路径执行，再用测试看规则够不够。",
    },
  },
  {
    id: "scene-l3-close-02",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "课后作业",
      bulletPoints: [],
    },
  },
];
