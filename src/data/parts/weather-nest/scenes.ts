import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const NEST = `at_crosswalk = True
pedestrian = True
if at_crosswalk:
    if pedestrian:
        print("停车让行")
    else:
        print("按限速通过")
else:
    print("继续正常行驶")`;

/** 嵌套：三种结论不能共用一个 else；elif 与嵌套都能表达这三条规则。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-weather-19",
    title: "三条规则",
    type: "explain",
    layout: "fullscreen",
    content: { conditionPath: { topic: "nest", mode: "cover" } },
  },
  {
    id: "scene-weather-20",
    title: "一个 else 的两种情况",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "nest", mode: "conflict" } },
    code: code(`at_crosswalk = False
pedestrian = False
if at_crosswalk and pedestrian:
    print("停车让行")
else:
    print("可以加速通过")`),
  },
  {
    id: "scene-weather-23",
    title: "两种写法",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "nest", mode: "lab" } },
    code: code(NEST),
  },
  {
    id: "scene-weather-25",
    title: "随堂练习",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "nest", mode: "practice" } },
    code: code(
      "weekday = True\nbefore_close = False\n# 工作日且未闭馆：开放。工作日已闭馆：已闭馆。非工作日：今日闭馆。\n",
    ),
    hints: [
      { level: 1, text: "先判断是否工作日，再判断是否已闭馆。" },
      { level: 2, text: "外层 else 对应非工作日。内层 else 对应工作日且已闭馆。" },
      {
        level: 3,
        text: 'if weekday:\n    if before_close:\n        print("开放")\n    else:\n        print("已闭馆")\nelse:\n    print("今日闭馆")',
      },
    ],
    reveal: {
      title: "对照",
      body: "三种结论不能写入同一个 else。先区分是否工作日，再区分是否已闭馆。",
    },
  },
];
