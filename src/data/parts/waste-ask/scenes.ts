import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const COMPARE =
  'item = "香蕉皮"\nprint(item == "香蕉皮")\nprint(item == "易拉罐")';

/** 比较得到布尔值，再用 and、or、not 组合。条件表达式另成一节，放在嵌套之后。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-expr-01",
    title: "情境导入",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "同一规则，输入不同，结果不同",
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
    id: "scene-expr-02",
    title: "比较运算",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "expr", mode: "bool" } },
    code: code(COMPARE),
  },
  {
    id: "scene-expr-and",
    title: "and",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "expr", mode: "and" } },
    code: code("is_banana = True\nis_hazard = False\nprint(is_banana and is_hazard)"),
  },
  {
    id: "scene-expr-or",
    title: "or",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "expr", mode: "or" } },
    code: code("is_can = False\nis_paper = True\nprint(is_can or is_paper)"),
  },
  {
    id: "scene-expr-not",
    title: "not",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "expr", mode: "not" } },
    code: code("is_banana = True\nprint(not is_banana)"),
  },
  {
    id: "scene-expr-03",
    title: "优先级与括号",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "expr", mode: "precedence" } },
    code: code(
      "is_banana = True\nis_can = False\nis_paper = False\nprint(is_banana and not (is_can or is_paper))",
    ),
  },
  {
    id: "scene-expr-04",
    title: "比较式参与布尔运算",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "expr", mode: "cmpBool" } },
    code: code(
      'item = "易拉罐"\nprint(item == "香蕉皮" or item == "易拉罐")\nprint(not (item == "香蕉皮"))',
    ),
  },
  {
    id: "scene-expr-chain",
    title: "链式比较",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "expr", mode: "chain" } },
    code: code("minutes = 18\nprint(15 <= minutes < 30)\nprint(minutes >= 15 and minutes < 30)"),
  },
  {
    id: "scene-expr-short",
    title: "短路求值",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "expr", mode: "short" } },
    code: code('print(False and print("执行了"))\nprint(True or print("执行了"))'),
  },
  {
    id: "scene-expr-truthy",
    title: "非布尔值当作真假",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "expr", mode: "truthy" } },
    code: code('if "香蕉皮":\n    print("非空字符串当作真")\nif "":\n    print("空字符串当作真")\nelse:\n    print("空字符串当作假")\nif 0:\n    print("0 当作真")\nelse:\n    print("0 当作假")'),
  },
  {
    id: "scene-expr-input-item",
    title: "输入处理",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "expr", mode: "inputItem" } },
    code: code(
      'item = input("请输入垃圾名称：")\n\nif item:\n    print("已收到输入，准备进行分类")\nelse:\n    print("你还没有输入垃圾名称")',
    ),
  },
  {
    id: "scene-expr-operand",
    title: "真假决定去留，返回操作数",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "expr", mode: "operand" } },
    code: code('print("香蕉皮" and "易拉罐")\nprint("" or "暂未识别")'),
  },
];
