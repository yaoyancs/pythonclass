import type { DraftScene } from "../../../types/scene";

/** 本 part：只讲变量——为什么需要、是什么、赋值、取用、会变。输入与诗卡放在飞花令。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-fp-16",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "同一份数据要用两次",
      whyNeedVar: {
        bareCode: "print(92)\nprint(92 + 8)",
        questions: [
          "92 写了两遍。如果成绩改成 90，要改几处？",
          "程序知不知道 92 是 Python 成绩？",
        ],
        teacherLines: [
          "这段程序能运行，但数字没有名字。",
          "算完就丢了；改一处还得记得改另一处。",
        ],
        numbers: [{ value: "92", label: "Python成绩" }],
        namedCode: "score = 92\nprint(score)\nprint(score + 8)",
        summary: "反复出现的数据，需要被记住，并且有一个名字。",
      },
    },
  },
  {
    id: "scene-fp-16b",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "变量是什么",
      varDefinition: {
        parts: [
          { label: "名字", note: "标签", example: "score" },
          { label: "值", note: "盒子里的东西", example: "92" },
          { label: "赋值", note: "把标签贴上去", example: "score = 92" },
        ],
        definition:
          "变量 = 程序给一份数据起的名字。用它保存数据、之后取用，并且可以改成另一份数据。",
        mathLine: "数学里：未知数，等号两边永远相等。",
        programLine: "编程里：有名字的存储。等号是「把右边放进左边」。",
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
        codeLines: ["score = 92"],
        boardNote: "赋值",
        teacherLine:
          "先算右边，再贴左边：先得到值 92，再让名字 score 指向它。右边也可以是表达式，例如 10 + 20。",
        conclusion:
          "程序中的 = 主要表示赋值，不是数学里的「左右永远相等」。",
      },
    },
  },
  {
    id: "scene-fp-18",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "用名字，不是用文字",
      varPredict: {
        code: "score = 92\nprint(score)",
        question: "输出的是单词 score，还是数字 92？",
        revealOutputs: ["92"],
        compareCode: 'print(score)\nprint("score")',
        compareOutputs: ["92", "score"],
        cards: [
          { caption: "score", value: "92" },
          { caption: '"score"', value: "score" },
        ],
        takeaway: [
          "score → 变量名，找到它当前对应的值",
          '"score" → 字符串，就是文字 score',
          "上一页 print(10) 是直接写出值；现在值住在名字后面。",
        ],
      },
    },
  },
  {
    id: "scene-fp-19",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "变量为什么叫「变」量",
      question: "最后输出 92 还是 95？请说出理由。",
      varModel: {
        mode: "rebind",
        name: "score",
        value: "92",
        nextValue: "95",
        codeLines: ["score = 92", "score = 95", "print(score)"],
        teacherLine:
          "第二次赋值不是让 92 变成 95，而是让名字 score 改为指向新的值 95。",
        conclusion: "变的不是数字变魔术，变的是这个名字现在指向谁。",
        followOn: {
          question: "数学里 score = score + 5 好像不成立。Python 为什么允许？",
          codeLines: ["score = 90", "score = score + 5", "print(score)"],
          value: "90",
          nextValue: "95",
          teacherLine:
            "左边的 score 表示要更新谁；右边的 score 表示取出它当前的值。",
          conclusion:
            "取出旧值，加 5，再贴回去。这不是数学等式，而是一条执行指令。",
          humanTranslation: "把 score 当前的值增加 5。",
        },
      },
    },
  },
  {
    id: "scene-fp-21",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "名字要让人读懂",
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
        "不能用 print、if 这些已被语言占用的词当名字；完整规则见教材",
      ],
    },
  },
];
