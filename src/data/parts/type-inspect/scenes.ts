import type { DraftScene } from "../../../types/scene";

/** 第 8 页：先看见三种 18，再引出类型。定义不先讲存储。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-ti-03",
    type: "run",
    layout: "split",
    content: {
      headline: "数据类型",
      typeProbe: {},
    },
    code: {
      initial: "",
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-ti-map",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "类型地图",
      typeMap: {},
    },
  },
];
