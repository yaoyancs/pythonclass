import type { DraftScene } from "../../../types/scene";

/** 本 part：只讲变量——起名、赋值、改变。输入与诗卡放在飞花令。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-fp-16",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "变量——程序怎样记住和改变数据",
      whyNeedVar: {
        bareCode: "print((92 + 85 + 88) / 3)",
        questions: [
          "这段程序在做什么？",
          "92、85、88 分别是哪一门课的成绩？",
          "如果数学成绩从 85 改成 89，应该改哪个数字？同一成绩用十次呢？",
        ],
        teacherLines: [
          "这段程序能运行，计算也正确，但它有一个问题：数字没有名字。",
          "计算机知道这里有三个数字，人却不知道每个数字代表什么。",
          "我们需要给数据起名字。",
        ],
        numbers: [
          { value: "92", label: "Python成绩" },
          { value: "85", label: "数学成绩" },
          { value: "88", label: "英语成绩" },
        ],
        namedCode:
          "python_score = 92\nmath_score = 85\nenglish_score = 88\n\naverage = (python_score + math_score + english_score) / 3\nprint(average)",
        summary: "变量最直接的作用，是给程序中的数据起一个有意义的名字。",
      },
    },
  },
  {
    id: "scene-fp-17",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "score = 92 究竟发生了什么",
      question: "这一行是在说「score 等于 92」吗？",
      varModel: {
        mode: "label",
        name: "score",
        value: "92",
        valueKind: "int",
        codeLines: ["score = 92"],
        boardNote: "赋值",
        teacherLine:
          "Python 执行赋值时，先得到右边的值 92，再让左边的名字 score 指向这个值。",
        conclusion:
          "变量可以先理解为程序给数据起的名字。程序中的 = 主要表示赋值，不是数学里的「左右永远相等」。",
      },
    },
  },
  {
    id: "scene-fp-18",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "第一次预测变量的值",
      varPredict: {
        code: "score = 92\nprint(score)",
        question: "输出的是单词 score，还是数字 92？",
        revealOutputs: ["92"],
        compareCode: 'print(score)\nprint("score")',
        compareOutputs: ["92", "score"],
        cards: [
          { caption: "score", value: "92", kind: "int" },
          { caption: '"score"', value: "score", kind: "str" },
        ],
        takeaway: [
          "score → 变量名，找到它当前对应的值",
          '"score" → 字符串，就是文字 score',
        ],
      },
    },
  },
  {
    id: "scene-fp-19",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "重新赋值：变量为什么叫「变」量",
      question: "最后输出 92 还是 95？请说出理由。",
      varModel: {
        mode: "rebind",
        name: "score",
        value: "92",
        nextValue: "95",
        valueKind: "int",
        codeLines: ["score = 92", "score = 95", "print(score)"],
        teacherLine:
          "第二次赋值不是让 92 变成 95，而是让名字 score 改为指向新的值 95。",
        conclusion: "程序运行的过程，就是数据状态不断变化的过程。",
      },
    },
  },
  {
    id: "scene-fp-20",
    type: "explain",
    layout: "fullscreen",
    content: {
      question: "数学里 score = score + 5 好像不成立。Python 为什么允许？",
      varModel: {
        mode: "update",
        name: "score",
        value: "90",
        nextValue: "95",
        valueKind: "int",
        codeLines: ["score = 90", "score = score + 5", "print(score)"],
        teacherLine:
          "左边的 score 表示要更新谁；右边的 score 表示取出它当前的值。",
        conclusion:
          "这不是数学等式，而是执行指令：取出旧值，加 5，再保存为新值。",
        humanTranslation: "把 score 当前的值增加 5。",
      },
    },
  },
  {
    id: "scene-fp-21",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "变量命名原则：代码首先写给人读",
      codeComparison: {
        left: {
          label: "难读",
          code: "a = 92\nb = 85\nc = 88\nd = (a + b + c) / 3",
        },
        right: {
          label: "表意",
          code: "python_score = 92\nmath_score = 85\nenglish_score = 88\n\naverage_score = (\n    python_score\n    + math_score\n    + english_score\n) / 3",
        },
      },
      bulletPoints: [
        "名字要表达含义",
        "多个单词推荐用下划线：student_name、average_score",
      ],
    },
  },
  {
    id: "scene-fp-22",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "标识符与 Python 保留字",
      identifiers: {
        definition:
          "在 Python 程序中用来起名字的字符序列。",
        examples: "如：变量名、函数名、类名、模块名。",
        rules: [
          "由大写字母、小写字母、数字、下划线、汉字组成",
          "对大小写敏感，不能以数字开头",
          "中间不能出现空格，长度没有限制",
        ],
        keywordLead: "这些词已经被语言占用，不能拿来当名字。",
        keywords: [
          "False",
          "None",
          "True",
          "and",
          "as",
          "assert",
          "async",
          "await",
          "break",
          "class",
          "continue",
          "def",
          "del",
          "elif",
          "else",
          "except",
          "finally",
          "for",
          "from",
          "global",
          "if",
          "import",
          "in",
          "is",
          "lambda",
          "nonlocal",
          "not",
          "or",
          "pass",
          "raise",
          "return",
          "try",
          "while",
          "with",
          "yield",
          "match",
          "case",
        ],
      },
    },
  },
];
