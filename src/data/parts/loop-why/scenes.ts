import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 重复：同一条语句要做很多次时，复制粘贴会随着次数一起膨胀。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-loop-why-01",
    title: "同一句话写三遍",
    type: "explain",
    layout: "fullscreen",
    content: { loopPath: { topic: "why", mode: "copy" } },
  },
  {
    id: "scene-loop-why-02",
    title: "次数一变",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "why", mode: "count" } },
    code: code('print("请打卡")\nprint("请打卡")\nprint("请打卡")\n'),
  },
  {
    id: "scene-loop-why-03",
    title: "循环要记住什么",
    type: "explain",
    layout: "fullscreen",
    content: { loopPath: { topic: "why", mode: "parts" } },
  },
];
