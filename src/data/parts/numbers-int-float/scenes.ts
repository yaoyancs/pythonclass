import type { DraftScene } from "../../../types/scene";

/** 本 part：飞花令轮次 / 得分；/ 与 // 点到为止。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-num-01",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "整数与浮点数",
      body: "飞花令里两类常见数值：",
      bulletPoints: [
        "int（整数）：轮次、人数、答对句数 —— 没有小数部分",
        "float（浮点数）：平均分、部分计分 —— 可以有小数",
        "写法：90 是 int；90.0 是 float",
      ],
      codeComparison: {
        left: {
          label: "整数例子",
          code: "round_no = 2\nline_count = 3",
        },
        right: {
          label: "浮点例子",
          code: "score = 85.5\naverage = 80.0",
        },
      },
    },
  },
  {
    id: "scene-num-02",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "加减乘：先预测结果",
      exprOrder: {
        expression: "10 + 3 * 2",
        studentPredict: "结果是多少？",
        steps: [
          { label: "先算乘法", focus: "10 + 3 × 2   →   10 + 6" },
          { label: "再算加法", focus: "10 + 6   →   16" },
        ],
        altExpression: "(10 + 3) * 2",
        altResult: "26",
        conclusion: "数值表达式按优先级计算；需要改变顺序时用括号。作业里的单价×重量，也是同一套规则。",
      },
    },
  },
  {
    id: "scene-num-03",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "除法：/ 与 //、%",
      typedDemo: {
        lead: "7 分两人对半分，或看整轮与余数。三行分别得到什么？",
        lines: [
          { code: "print(7 / 2)", kind: "float", tokens: [{ text: "print(7 / 2)", tone: "float" }] },
          { code: "print(7 // 2)", kind: "int", tokens: [{ text: "print(7 // 2)", tone: "int" }] },
          { code: "print(7 % 2)", kind: "int", tokens: [{ text: "print(7 % 2)", tone: "int" }] },
        ],
        predict: {
          question: "输出分别是？",
          codes: ["print(7 / 2)", "print(7 // 2)", "print(7 % 2)"],
          answers: ["3.5", "3", "1"],
        },
        takeaway:
          "/ 得到浮点除法结果；// 是向下取整的整除；% 是余数。需要「几个整份」时用 //。",
      },
    },
  },
  {
    id: "scene-num-04",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "混合运算：两轮平均分",
      question: "两轮得分 90 与 80，平均分是多少？",
      varPredict: {
        code: "score1 = 90\nscore2 = 80\naverage = (score1 + score2) / 2\nprint(average)",
        question: "输出是整数还是带小数的数？具体是多少？",
        revealOutputs: ["85.0"],
        takeaway: [
          "与 float 参与运算时，结果常常是 float（这里 / 2 已是浮点除法）",
          "看起来「整」的 85.0，类型仍可能是 float",
        ],
      },
    },
  },
  {
    id: "scene-num-05",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "易错点：除零与「看起来像整数」",
      bulletPoints: [
        "除数为 0 会报错：ZeroDivisionError（平均分时人数不能为 0）",
        "print(4 / 2) 得到 2.0，不是 2 —— 用 type() 可查证",
        "轮次用 int；平均分用 float 想清楚单位，再写表达式",
      ],
      body: "浮点有时会有微小误差；本课先会正确选用类型与运算即可。",
    },
  },
];
