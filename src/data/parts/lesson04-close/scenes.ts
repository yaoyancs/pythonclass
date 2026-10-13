import type { DraftScene } from "../../../types/scene";

export const scenes: DraftScene[] = [
  {
    id: "scene-l4-close-01",
    title: "思政",
    type: "explain",
    layout: "fullscreen",
    content: { loopPath: { topic: "close", mode: "values" } },
  },
  {
    id: "scene-l4-close-02",
    title: "小结",
    type: "explain",
    layout: "fullscreen",
    content: { loopPath: { topic: "close", mode: "summary" } },
  },
  {
    id: "scene-l4-close-03",
    title: "课后作业",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "课后作业",
      loopPath: { topic: "close", mode: "homework" },
      bulletPoints: [],
    },
  },
  {
    id: "scene-l4-close-04",
    title: "谢谢",
    type: "explain",
    layout: "fullscreen",
    content: { loopPath: { topic: "close", mode: "thanks" } },
  },
];
