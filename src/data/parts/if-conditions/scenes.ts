import type { DraftScene } from "../../../types/scene";

/** 条件怎么写：链式比较、优先级、值的真假、短路。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-if-cond-01",
    type: "run",
    layout: "split",
    content: {
      headline: "一档写成一条比较",
      bulletPoints: ["前两行一样吗？minutes > 15 == True 为什么是 False？"],
    },
    code: {
      initial:
        "minutes = 18\nprint(minutes > 15 and minutes <= 30)\nprint(15 < minutes <= 30)\nprint(minutes > 15 == True)",
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-if-cond-02",
    type: "run",
    layout: "split",
    content: {
      headline: "not 管住谁",
      bulletPoints: ["第一行 not 管住了谁？后两行为什么一样？"],
    },
    code: {
      initial:
        "minutes = 18\nfee = 27.0\nprint(not minutes > 15 and fee > 20)\nprint(not (minutes > 15 and fee > 20))\nprint(minutes <= 15 or fee <= 20)",
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-if-cond-03",
    type: "run",
    layout: "split",
    content: {
      headline: "空名字本身就是假",
      bulletPoints: ["空昵称算真还是假？n 能用来判断是不是学生吗？"],
    },
    code: {
      initial:
        'nickname = ""\nstudent = "n"\nif nickname:\n    print("有昵称")\nif student:\n    print("n 也会进来")\nprint("空字符串", bool(""))\nprint("n", bool("n"))\nprint("零", bool(0))',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-if-cond-04",
    type: "run",
    layout: "split",
    content: {
      headline: "右边可以不执行",
      bulletPoints: ["两行都没报错。哪一行是因为左边已经为真？"],
    },
    code: {
      initial:
        'nickname = ""\nprint(nickname != "" and nickname[0] == "李")\nprint(nickname == "" or nickname[0] == "李")',
      editable: true,
      resetToInitial: true,
    },
  },
];
