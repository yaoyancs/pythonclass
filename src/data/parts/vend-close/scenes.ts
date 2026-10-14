import type { DraftScene } from "../../../types/scene";

export const scenes: DraftScene[] = [
  {
    id: "vend-values",
    title: "规则与输出",
    type: "explain",
    layout: "fullscreen",
    content: { vendPath: { mode: "values" } },
  },
  {
    id: "vend-summary",
    title: "小结",
    type: "explain",
    layout: "fullscreen",
    content: { vendPath: { mode: "summary" } },
  },
  {
    id: "vend-homework",
    title: "课后作业",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "课后作业",
      bulletPoints: [],
    },
  },
  {
    id: "vend-thanks",
    title: "谢谢",
    type: "explain",
    layout: "fullscreen",
    content: { vendPath: { mode: "thanks" } },
  },
];
