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
      image: { src: "/lesson04/lab-check.jpg", alt: "学生在机房逐台检查设备" },
      loopPath: { topic: "close", mode: "homework" },
      bulletPoints: [
        "实验室设备巡检。输入教室数量。每间教室逐台输入设备状态：1 表示正常，0 表示故障，-1 表示这间教室检查结束。输出每间教室的正常设备数和故障设备数，以及全校故障设备总数。故障设备要计入。",
      ],
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
