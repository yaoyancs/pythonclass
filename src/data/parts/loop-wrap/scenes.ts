import type { DraftScene } from "../../../types/scene";

/** 顺序、分支、循环系统归纳。给学生看的课件，从本讲第 48 页起。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-wrap-overview",
    title: "整体认识",
    type: "explain",
    layout: "fullscreen",
    content: { loopWrap: { mode: "overview" } },
  },
  {
    id: "scene-wrap-flows",
    title: "三种流程图",
    type: "explain",
    layout: "fullscreen",
    content: { loopWrap: { mode: "flows" } },
  },
  {
    id: "scene-wrap-sequence",
    title: "顺序结构",
    type: "explain",
    layout: "fullscreen",
    content: { loopWrap: { mode: "sequence" } },
  },
  {
    id: "scene-wrap-branch",
    title: "分支结构",
    type: "explain",
    layout: "fullscreen",
    content: { loopWrap: { mode: "branch" } },
  },
  {
    id: "scene-wrap-branch-key",
    title: "分支要点",
    type: "explain",
    layout: "fullscreen",
    content: { loopWrap: { mode: "branchKey" } },
  },
  {
    id: "scene-wrap-loop",
    title: "循环结构",
    type: "explain",
    layout: "fullscreen",
    content: { loopWrap: { mode: "loop" } },
  },
  {
    id: "scene-wrap-loop-model",
    title: "循环模型",
    type: "explain",
    layout: "fullscreen",
    content: { loopWrap: { mode: "loopModel" } },
  },
  {
    id: "scene-wrap-combine",
    title: "结构组合",
    type: "explain",
    layout: "fullscreen",
    content: { loopWrap: { mode: "combine" } },
  },
  {
    id: "scene-wrap-choose",
    title: "如何选择",
    type: "explain",
    layout: "fullscreen",
    content: { loopWrap: { mode: "choose" } },
  },
  {
    id: "scene-wrap-quality",
    title: "正确与效率",
    type: "explain",
    layout: "fullscreen",
    content: { loopWrap: { mode: "quality" } },
  },
  {
    id: "scene-wrap-table",
    title: "知识体系表",
    type: "explain",
    layout: "fullscreen",
    content: { loopWrap: { mode: "table" } },
  },
  {
    id: "scene-wrap-goals",
    title: "课堂总结",
    type: "explain",
    layout: "fullscreen",
    content: { loopWrap: { mode: "goals" } },
  },
];
