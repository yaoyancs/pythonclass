import type { DraftScene } from "../../../types/scene";

export const scenes: DraftScene[] = [
  {
    id: "scene-l3-close-01",
    title: "思政",
    type: "explain",
    layout: "fullscreen",
    content: { conditionPath: { topic: "close", mode: "values" } },
  },
  {
    id: "scene-l3-close-02",
    title: "小结",
    type: "explain",
    layout: "fullscreen",
    content: { conditionPath: { topic: "close", mode: "summary" } },
  },
  {
    id: "scene-l3-close-03",
    title: "课后作业",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "课后作业",
      conditionPath: { topic: "close", mode: "homework" },
      bulletPoints: [
        "垃圾分类。输入物品名称。香蕉皮→厨余垃圾，易拉罐→可回收物，过期药品→有害垃圾，榴莲壳→其他垃圾。每次只输出一行。其他名称只打印「暂未收录，请查询当地分类指南」。自验：易拉罐；榴莲壳；塑料瓶。",
        "出行提示。用 input 读三个 y/n：是否已核验预警、是否有暴雨预警、是否有大风预警。未核验只打印「信息未核验，请先查询官方预警」。已核验且有暴雨或大风，打印「存在预警，请查看官方防御指南」。已核验且两者都没有，打印「当前输入未标记预警，仍需关注天气」。不要输出「可以放心出行」。自验：n、n、n → 未核验；y、n、y → 存在预警；y、n、n → 未标记预警。",
      ],
    },
  },
  {
    id: "scene-l3-close-04",
    title: "谢谢",
    type: "explain",
    layout: "fullscreen",
    content: { conditionPath: { topic: "close", mode: "thanks" } },
  },
];
