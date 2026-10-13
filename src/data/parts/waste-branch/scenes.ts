import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const SINGLE =
  'item = "过期药品"\nif item == "过期药品":\n    print("请按有害垃圾要求投放")\nprint("分类检查结束")';

/** 单分支：条件成立才执行语句块，不成立则跳过，后续语句继续执行。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-if-06",
    title: "由比较进入语句",
    type: "explain",
    layout: "fullscreen",
    content: { conditionPath: { topic: "branch", mode: "meet" } },
  },
  {
    id: "scene-if-syntax",
    title: "if 语句",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "branch", mode: "syntax" } },
    code: code(SINGLE),
  },
  {
    id: "scene-if-assign",
    title: "条件里的等号",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "branch", mode: "assign" } },
    code: code('battery = 15\nif battery = 15:\n    print("电量不足，请返航")'),
  },
  {
    id: "scene-if-07",
    title: "执行语句块",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "branch", mode: "trace" } },
    code: code(SINGLE),
  },
  {
    id: "scene-if-08",
    title: "缩进",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "branch", mode: "indent" } },
    code: code(SINGLE),
  },
  {
    id: "scene-if-practice",
    title: "随堂练习",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "branch", mode: "practice" } },
    code: code("battery = 15\n# 低于 20 才打印「电量不足，请返航」\n# 无论电量多少，都打印「自检结束」\n"),
    hints: [
      { level: 1, text: "只问一件事：电量是否低于 20。" },
      { level: 2, text: "提醒缩进在 if 里。自检结束不要缩进。" },
      {
        level: 3,
        text: 'if battery < 20:\n    print("电量不足，请返航")\nprint("自检结束")',
      },
    ],
    reveal: {
      title: "对照",
      body: "15 会打出两行。改成 40 后，提醒被跳过，「自检结束」仍然打印。",
    },
  },
  {
    id: "scene-if-input",
    title: "键盘读入是字符串",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "branch", mode: "inputStr" } },
    code: code('battery = "15"\nif battery < 20:\n    print("电量不足，请返航")'),
  },
];
