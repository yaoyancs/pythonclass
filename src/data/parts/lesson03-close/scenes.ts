import type { DraftScene } from "../../../types/scene";

/** 第 3 讲收束：小结 + 作业。作业条文由开课表覆盖。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-l3-close-01",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "本讲要点",
      finalVerdict: {
        lines: [
          "if 下面缩进的语句才受这个条件管。缩进退回之后，语句就回到条件外面。",
          "else 不写条件，接住这个 if 的另一边。配对看缩进，不看先后。",
          "elif 保证多档只进一档。几个独立的 if 会重复进入，后一档还可能把前一档的结果盖掉。",
          "宽条件写在窄条件前面，后面的档进不去。没有剩余情况时，else 可以不写。",
          "链式比较从左到右，每相邻两项各自比较。not 先于 and，and 先于 or。",
          "not (A and B) 与 (not A) or (not B) 同真同假。and 左边为假、or 左边为真时，右边不算。",
          "空字符串、0、None 为假。非空字符串都为真，n 不能代替 student == \"y\"。",
          "in / not in 问一项在不在一组值里。条件表达式只计算走到的那一边。空的语句块用 pass 占住。",
        ],
      },
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
