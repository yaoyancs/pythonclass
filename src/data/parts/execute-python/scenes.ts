import type { DraftScene } from "../../../types/scene";

/** 本 part：怎么跑、跑的时候看见什么（不含变量 / 输入 / IPO）。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-10",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "两种跑法：交互试算 vs 脚本文件",
      replDemo: {
        steps: [
          {
            input: "1 + 2",
            promptPredict: "会得到什么？",
            output: "3",
            note: "表达式会被计算",
          },
          {
            input: '"1 + 2"',
            promptPredict: "和刚才一样吗？",
            output: "'1 + 2'",
            note: "引号里是文字，原样留下",
          },
          { input: 'print("Hello, Python!")', output: "Hello, Python!" },
        ],
        suitedFor: ["快速尝试", "验证表达式", "观察结果"],
        designNote:
          "课件里的交互窗口只是演示。本课主路径仍是本机解释器 + 编辑器：写好 .py 文件再运行。",
      },
    },
  },
  {
    id: "scene-11",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "从文件到输出",
      stepExec: {
        filename: "hello.py",
        pipeline: [
          "hello.py",
          "解释器读入下一行",
          "执行该行语句",
          "Console 显示结果",
        ],
        lines: ['print("第一行")', 'print("第二行")', 'print("第三行")'],
        outputs: ["第一行", "第二行", "第三行"],
        conclusion: "默认情况下，Python 从上到下，一次执行一条语句。",
      },
    },
  },
  {
    id: "scene-12",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "代码与数据不是一回事",
      typedDemo: {
        lead: "请在纸上写出四行输出——先别运行。",
        lines: [
          { code: "print(10)" },
          { code: "print(10 + 20)" },
          { code: 'print("10 + 20")' },
          { code: 'print("Hello" + "Python")' },
        ],
        predict: {
          question: "四行输出分别是？",
          codes: [
            "print(10)",
            "print(10 + 20)",
            'print("10 + 20")',
            'print("Hello" + "Python")',
          ],
          answers: ["10", "30", "10 + 20", "HelloPython"],
        },
        takeaway: "print() 负责输出；数字可计算；引号中的内容按文字处理。",
      },
    },
  },
  {
    id: "scene-14",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "表达式",
      exprOrder: {
        expression: "2 + 3 * 4",
        studentPredict: "结果是多少？",
        steps: [
          { label: "先算乘法", focus: "2 + 3 × 4   →   2 + 12" },
          { label: "再算加法", focus: "2 + 12   →   14" },
        ],
        altExpression: "(2 + 3) * 4",
        altResult: "20",
        conclusion:
          "表达式是能够计算出一个值的代码。括号不仅影响数学结果，也是在明确地表达我们的意图。",
      },
    },
  },
  {
    id: "scene-15",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "最小语法规则",
      syntaxRules: {
        rules: [
          "英文符号",
          "成对的引号",
          "成对的括号",
          "一条语句完成一个明确动作",
          "Python 区分大小写",
          "错误信息是线索，不是惩罚",
        ],
        brokenCode: 'print("Hello)',
        fixSteps: [
          "先看最后一行：错误类型（如 SyntaxError）在说什么",
          "再看箭头或行号：问题大概在哪一行、哪个位置",
          "回到对应代码，优先检查引号、括号是否成对",
        ],
      },
    },
  },
];
