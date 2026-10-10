import type { DraftScene } from "../../../types/scene";

/** 从分类需求抽象出条件。先不出现 if。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-waste-01",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "垃圾如何分类",
      gallery: [
        { id: "banana", src: "/lesson03/waste-banana.jpg", alt: "香蕉皮" },
        { id: "durian", src: "/lesson03/waste-durian.jpg", alt: "榴莲壳" },
        { id: "can", src: "/lesson03/waste-can.jpg", alt: "易拉罐" },
        { id: "medicine", src: "/lesson03/waste-medicine.jpg", alt: "过期药品" },
        { id: "green", src: "/lesson03/bin-green.jpg", alt: "绿色垃圾桶" },
        { id: "gray", src: "/lesson03/bin-gray.jpg", alt: "灰色垃圾桶" },
        { id: "red", src: "/lesson03/bin-red.jpg", alt: "红色垃圾桶" },
        { id: "blue", src: "/lesson03/bin-blue.jpg", alt: "蓝色垃圾桶" },
      ],
      galleryLinks: [
        { from: "banana", to: "green", color: "#2f9e44" },
        { from: "durian", to: "gray", color: "#8b9096" },
        { from: "can", to: "blue", color: "#2f6fdb" },
        { from: "medicine", to: "red", color: "#e03131" },
      ],
    },
  },
  {
    id: "scene-waste-02",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "代码实现分类需求了吗？",
      clickLines: [
        "为什么它能运行，却不能正确完成任务",
        "程序执行正确不等于处理结果正确",
      ],
    },
    code: {
      initial: 'item = "易拉罐"\nprint("可回收物")',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-waste-03",
    type: "explain",
    layout: "split",
    content: {
      headline: "计算机怎样知道条件是否满足？",
      compareTable: {
        leftHeader: "自然语言",
        rightHeader: "Python条件",
        rows: [
          { left: "物品是香蕉皮吗？", right: 'item == "香蕉皮"' },
          { left: "物品不是香蕉皮吗？", right: 'item != "香蕉皮"' },
        ],
      },
    },
    code: {
      initial: 'item = "香蕉皮"\nprint(item == "香蕉皮")\nprint(item == "易拉罐")\nprint(item != "香蕉皮")',
      editable: true,
      resetToInitial: true,
    },
  },
];
