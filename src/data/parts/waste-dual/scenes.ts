import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const DUAL =
  'item = "易拉罐"\nif item == "香蕉皮":\n    print("厨余垃圾")\nelse:\n    print("暂未识别，请查询分类指南")\nprint("本次分类检查完成")';

const BUG =
  'item = "香蕉皮"\nif item == "香蕉皮":\n    print("厨余垃圾")\nif item == "易拉罐":\n    print("可回收物")\nelse:\n    print("暂未识别")';

/** 双分支：两条语句块只执行一条。条件表达式放到嵌套之后。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-else-10",
    title: "单分支的缺口",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "dual", mode: "gap" } },
    code: code('item = "易拉罐"\nif item == "香蕉皮":\n    print("厨余垃圾")\nprint("分类检查结束")'),
  },
  {
    id: "scene-else-11",
    title: "if...else",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "dual", mode: "paths" } },
    code: code(DUAL),
  },
  {
    id: "scene-else-meaning",
    title: "else 的含义",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "dual", mode: "meaning" } },
    code: code(
      'item = "易拉罐"\nif item == "香蕉皮":\n    print("厨余垃圾")\nelse:\n    print("其他垃圾")',
    ),
  },
  {
    id: "scene-else-13",
    title: "else 的配对",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "dual", mode: "elseBug" } },
    code: code(BUG),
  },
  {
    id: "scene-else-practice",
    title: "随堂练习",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "dual", mode: "practice" } },
    code: code("battery = 15\n# 低于 20：打印「电量不足，请返航」\n# 否则：打印「电量正常」\n# 两种情况之后都打印「自检结束」\n"),
    hints: [
      { level: 1, text: "只问一件事：电量是否低于 20。成立走 if，不成立走 else。" },
      { level: 2, text: "两句提醒各自缩进。自检结束和 if 对齐，不要缩进。" },
      {
        level: 3,
        text: 'if battery < 20:\n    print("电量不足，请返航")\nelse:\n    print("电量正常")\nprint("自检结束")',
      },
    ],
    reveal: {
      title: "对照",
      body: "15 走 if，40 走 else。两条路径只执行一条，「自检结束」都会打印。",
    },
  },
];
