import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 条件表达式：按条件选择一个值，不执行语句块。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-ternary-01",
    title: "条件表达式",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "expr", mode: "ternary" } },
    code: code(
      'item = "香蕉皮"\nmessage = "厨余垃圾" if item == "香蕉皮" else "暂未识别"\nprint(message)',
    ),
  },
  {
    id: "scene-ternary-compare",
    title: "结果一样，写法为什么不同",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {},
    code: code(
      'item = "香蕉皮"\nmessage = (\n    "厨余垃圾"\n    if item == "香蕉皮"\n    else "暂未识别")\nprint(message)',
    ),
    pairedCode: {
      peerLabel: "条件表达式",
      label: "if ... else",
      initial:
        'item = "香蕉皮"\nif item == "香蕉皮":\n    message = "厨余垃圾"\nelse:\n    message = "暂未识别"\nprint(message)',
    },
    prediction: {
      question: "两段程序都判断香蕉皮，再 print(message)。运行结果会相同吗？",
      options: [
        { id: "same", label: "相同，都是厨余垃圾", isCorrect: true },
        { id: "diff", label: "不同" },
      ],
    },
    reveal: {
      body: "简单的二选一赋值，两种写法可以达到相同效果。结果一样，不表示它们在做同一件事。",
    },
  },
  {
    id: "scene-ternary-essence",
    title: "选择一个值，还是执行一组操作",
    type: "explain",
    layout: "fullscreen",
    content: { conditionPath: { topic: "expr", mode: "essence" } },
  },
  {
    id: "scene-ternary-one",
    title: "只计算被选中的一边",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "expr", mode: "oneSide" } },
    code: code(
      'item = "香蕉皮"\nmessage = print("厨余") if item == "易拉罐" else print("未识别")',
    ),
  },
  {
    id: "scene-ternary-choose",
    title: "任务升级，你会选哪种结构",
    type: "explain",
    layout: "fullscreen",
    content: { conditionPath: { topic: "expr", mode: "choose" } },
  },
  {
    id: "scene-ternary-02",
    title: "else 的取值",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "expr", mode: "review" } },
    code: code(
      'item = "易拉罐"\ncategory = "厨余垃圾" if item == "香蕉皮" else "其他垃圾"\nprint(category)',
    ),
  },
];
