import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const SEATS = `for row in range(1, 6):
    for seat in range(1, 7):
        print("第", row, "排，第", seat, "座")
`;

/** 嵌套：先确定一排，再把这一排的座位走完。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-nest-find",
    title: "第 3 排第 5 座",
    type: "explain",
    layout: "fullscreen",
    content: { loopPath: { topic: "nest", mode: "find" } },
  },
  {
    id: "scene-nest-repeat",
    title: "两层重复",
    type: "explain",
    layout: "fullscreen",
    content: { loopPath: { topic: "nest", mode: "repeat" } },
  },
  {
    id: "scene-nest-code",
    title: "两层 for",
    type: "explain",
    layout: "split",
    content: { loopPath: { topic: "nest", mode: "code" } },
    code: code(SEATS),
  },
  {
    id: "scene-nest-gen",
    title: "座位编号",
    type: "explain",
    layout: "fullscreen",
    content: { loopPath: { topic: "nest", mode: "gen" } },
  },
  {
    id: "scene-nest-show",
    title: "嵌套代码",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: { loopPath: { topic: "nest", mode: "show" } },
    code: code(SEATS),
  },
];
