import type { DraftScene } from "../../../types/scene";
import { branchContestParts } from "../../lessons/branchContest";

/** elif、判断顺序、未知物品不归类。分支竞赛页面放在本块开头。 */
const elifScenes: DraftScene[] = [
  {
    id: "scene-waste-09",
    type: "run",
    layout: "split",
    content: {
      headline: "互斥分类是否需要四次独立判断？",
      bulletPoints: ["依次输入四种已知物品。"],
    },
    code: {
      initial:
        'item = input("请输入垃圾名称：")\nif item == "香蕉皮":\n    print("厨余垃圾")\nif item == "易拉罐":\n    print("可回收物")\nif item == "过期药品":\n    print("有害垃圾")\nif item == "榴莲壳":\n    print("其他垃圾")',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-waste-10",
    type: "run",
    layout: "split",
    content: {
      headline: "命中之后，后续分支是否继续判断？",
      bulletPoints: ["输入「易拉罐」。", "再输入「塑料瓶」。"],
    },
    code: {
      initial:
        'item = input("请输入垃圾名称：")\nif item == "香蕉皮":\n    print("厨余垃圾")\nelif item == "易拉罐":\n    print("可回收物")\nelif item == "过期药品":\n    print("有害垃圾")\nelif item == "榴莲壳":\n    print("其他垃圾")\nelse:\n    print("暂未收录，请查询当地分类指南")',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-waste-11",
    type: "predict",
    layout: "split",
    content: {
      headline: "含有「纸」是否应判为可回收物？",
      bulletPoints: ["先预测输出，再运行。"],
    },
    code: {
      initial:
        'item = "用过的纸巾"\nif "纸" in item:\n    print("可回收物")\nelif item == "用过的纸巾":\n    print("其他垃圾")',
      editable: true,
      resetToInitial: true,
    },
    prediction: {
      question: "实际输出是哪一句？",
      options: [
        { id: "recycle", label: "可回收物", isCorrect: true },
        { id: "other", label: "其他垃圾" },
      ],
    },
    reveal: {
      body: "程序执行的是已写规则。该规则与分类要求不一致。",
    },
  },
  {
    id: "scene-waste-12",
    type: "challenge",
    layout: "split",
    content: {
      headline: "如何实现互斥的四分类？",
      bulletPoints: ["四种指定物品各输出一行。", "未收录物品不归类。", "至少测试五组输入。"],
    },
    code: {
      initial:
        'item = input("请输入垃圾名称：")\nif item == "香蕉皮":\n    print("厨余垃圾")\n# 请继续完成',
      editable: true,
      resetToInitial: true,
    },
    hints: [
      { level: 1, text: "一次分类是否只需要一个结果？" },
      { level: 2, text: "后续类别用 elif。未收录用 else。" },
      { level: 3, text: "「废电池」未说明类型时，是否信息不足？" },
    ],
  },
];

export const scenes: DraftScene[] = [
  ...branchContestParts.flatMap((part) =>
    part.scenes.map((scene) => ({ ...scene, title: part.title })),
  ),
  ...elifScenes,
];
