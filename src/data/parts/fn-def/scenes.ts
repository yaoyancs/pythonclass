import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** def、文档字符串、调用，以及函数名。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-def-shape",
    title: "写法",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "定义一个函数",
      flowDiagram: [
        "def 函数名(参数列表):",
        "    \"\"\"文档字符串\"\"\"",
        "    函数体",
        "    return 返回值",
      ],
      bulletPoints: [
        "def 后面是函数名和圆括号，行末是冒号",
        "函数体必须缩进，规则与 if、for 相同",
        "文档字符串说明功能，可以省略",
        "return 将结果返回调用方；可以没有 return",
      ],
    },
  },
  {
    id: "fn-def-greet",
    title: "定义与调用",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "定义和调用是两步",
      body: "执行 def 时创建函数对象，函数体不执行。执行 greet(\"周杰伦\") 时，形参 name 绑定实参，再执行 return。",
      bulletPoints: ["形参 name 接收调用时传入的实参", "print 输出的是 return 的返回值"],
    },
    code: code(`def greet(name):
    """向指定的人问好"""
    return f"Hello, {name}!"

print(greet("周杰伦"))`),
  },
  {
    id: "fn-def-when",
    title: "何时执行",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      body: "区分函数定义与函数调用。",
    },
    code: code(`def greet(name):
    print("函数体执行了")
    return f"Hello, {name}!"

print("定义结束")`),
    prediction: {
      question: "运行后的输出是什么？",
      options: [
        { id: "both", label: "先出现「函数体执行了」，再出现「定义结束」" },
        { id: "only-def", label: "只有「定义结束」", isCorrect: true },
        { id: "only-body", label: "只有「函数体执行了」" },
      ],
    },
    reveal: {
      title: "没有调用，函数体不执行",
      body: "def 只创建函数对象。函数名后没有调用运算符时，函数体不执行。写成 greet(\"周杰伦\") 才会执行函数体。",
    },
  },
  {
    id: "fn-def-name",
    title: "函数名",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "函数名和变量名同一套规则",
      bulletPoints: [
        "用小写字母，单词之间用下划线",
        "名称应表明用途，例如 calculate_area、print_score",
        "不要覆盖内置名，例如不要将自定义函数命名为 print、list、sum",
      ],
      flowDiagram: ["def calculate_area(length, width):", "def print_score(name, math, chinese):"],
    },
  },
];
