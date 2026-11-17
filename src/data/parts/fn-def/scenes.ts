import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** def、文档字符串、调用时机，以及函数名。 */
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
        '    """文档字符串"""',
        "    函数体",
        "    return 返回值",
      ],
      bulletPoints: [
        "def 这一行末尾是冒号",
        "函数体缩进，和 if、for 一样",
        "文档字符串、return 都可以没有",
      ],
    },
  },
  {
    id: "fn-def-report",
    title: "定义与调用",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "定义与调用分离",
      bulletPoints: [
        "def 创建函数对象，此时不执行函数体",
        "report_student(...) 才进入函数体",
      ],
    },
    code: code(`def report_student(name, score):
    """按统一格式播报一名学生的成绩"""
    print(f"{name}: {score}分")

report_student("周杰伦", 95)
report_student("林俊杰", 88)`),
  },
  {
    id: "fn-def-when",
    title: "何时执行",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "定义阶段是否执行函数体？",
    },
    code: code(`def report_student(name, score):
    print("函数体执行了")
    print(f"{name}: {score}分")

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
      body: "未经调用时，函数体不执行。",
    },
  },
  {
    id: "fn-def-order",
    title: "调试：先调用后定义",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "将定义置于首次调用之前",
    },
    code: code(`report_student("周杰伦", 95)

def report_student(name, score):
    print(f"{name}: {score}分")
`),
    hints: [
      { level: 1, text: "Python 从上往下执行。调用时，函数名必须已经绑定。" },
      { level: 2, text: "报错信息是 NameError: name 'report_student' is not defined。" },
      {
        level: 3,
        text: `def report_student(name, score):
    print(f"{name}: {score}分")

report_student("周杰伦", 95)`,
      },
    ],
    reveal: {
      title: "对照",
      body: "先执行 def，再写调用。定义可以离调用很远，但不能出现在第一次调用之后。",
    },
    expectedOutput: "周杰伦: 95分",
  },
  {
    id: "fn-def-syntax",
    title: "调试：冒号与缩进",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "补全函数头冒号与函数体缩进",
    },
    code: code(`def report_student(name, score)
print(f"{name}: {score}分")

report_student("林俊杰", 88)`),
    hints: [
      { level: 1, text: "def 行末必须有冒号。" },
      { level: 2, text: "print 这一行属于函数体，相对 def 缩进 4 个空格。" },
      {
        level: 3,
        text: `def report_student(name, score):
    print(f"{name}: {score}分")

report_student("林俊杰", 88)`,
      },
    ],
    reveal: {
      title: "对照",
      body: "函数头以冒号结束。函数体必须缩进。调用语句与 def 对齐，不缩进。",
    },
    expectedOutput: "林俊杰: 88分",
  },
  {
    id: "fn-def-name",
    title: "函数名",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "函数命名规范",
      bulletPoints: [
        "小写字母与下划线：make_report",
        "名称应表明功能",
        "不要覆盖内置名 print、list、sum",
      ],
      flowDiagram: [
        "def make_report(name, raw):",
        "def report_student(name, score):",
      ],
    },
  },
  {
    id: "fn-def-practice",
    title: "练习：定义并调用",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "定义 report_student 并完成调用",
      bulletPoints: [
        "定义 report_student(name, score)",
        "打印「姓名: 分数分」",
        "调用：周杰伦 95，邓紫棋 92",
      ],
    },
    code: code(`# 在这里定义 report_student

`),
    hints: [
      { level: 1, text: "先写 def report_student(name, score):，函数体里用 print。" },
      { level: 2, text: "定义写完后，再写两行调用。" },
      {
        level: 3,
        text: `def report_student(name, score):
    print(f"{name}: {score}分")

report_student("周杰伦", 95)
report_student("邓紫棋", 92)`,
      },
    ],
    reveal: {
      title: "对照",
      body: "定义一次，调用两次。输出各占一行。",
    },
    expectedOutput: `周杰伦: 95分
邓紫棋: 92分`,
  },
];
