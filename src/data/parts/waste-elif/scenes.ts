import type { DraftScene } from "../../../types/scene";
import { branchContestParts } from "../../lessons/branchContest";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const KEEP = new Set([
  "branch-conflict",
  "branch-trace",
  "branch-elif",
  "branch-lab",
]);

const TITLE: Record<string, string> = {
  "branch-conflict": "独立 if 的输出",
  "branch-trace": "独立 if 仍会判断",
  "branch-elif": "if-elif-else",
  "branch-lab": "独立 if 与 elif",
};

/** 多分支：先看独立 if，再给出 elif 语法与对照，最后用成绩分档讲判断顺序。 */
export const scenes: DraftScene[] = [
  ...branchContestParts
    .filter((part) => KEEP.has(part.ref))
    .flatMap((part) =>
      part.scenes.map((scene) => ({ ...scene, title: TITLE[part.ref] ?? part.title })),
    ),
  {
    id: "scene-elif-practice",
    title: "判断顺序",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "elif", mode: "practice" } },
    code: code(
      'score = 95\nif score >= 60:\n    print("及格")\nelif score >= 90:\n    print("优秀")\nelse:\n    print("不及格")',
    ),
    hints: [
      { level: 1, text: "95 同时满足 >= 60 和 >= 90。先被判断的条件会先成立。" },
      { level: 2, text: "把 score >= 90 写在 score >= 60 前面，并保留 else。" },
      {
        level: 3,
        text: 'if score >= 90:\n    print("优秀")\nelif score >= 60:\n    print("及格")\nelse:\n    print("不及格")',
      },
    ],
    reveal: {
      title: "对照",
      body: "95 分会打印「及格」。条件有包含关系时，更具体的条件要写在前面。",
    },
  },
];
