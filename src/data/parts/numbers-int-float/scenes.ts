import type { DraftScene } from "../../../types/scene";

/** 本 part：int / float 与基本运算；/ 与 // 点到为止。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-num-01",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "整数与浮点数",
      body: "CampusLife 里两类常见数值：",
      bulletPoints: [
        "int（整数）：运动分钟、人数、次数 —— 没有小数部分",
        "float（浮点数）：学习小时、睡眠小时、消费金额 —— 可以有小数",
        "写法：90 是 int；90.0 是 float",
      ],
      codeComparison: {
        left: {
          label: "整数例子",
          code: "exercise_minutes = 30\nday_count = 7",
        },
        right: {
          label: "浮点例子",
          code: "study_hours = 2.5\nspending = 18.5",
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
        conclusion: "数值表达式按优先级计算；需要改变顺序时用括号。",
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
        lead: "三行分别得到什么？先写再对照。",
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
      headline: "混合运算：加权平均",
      question: "权重 20% / 30% / 50% 时，average 是多少？",
      varPredict: {
        code: "score1 = 90\nscore2 = 80\nscore3 = 70\naverage = (\n    score1 * 0.2\n    + score2 * 0.3\n    + score3 * 0.5\n)\nprint(average)",
        question: "输出是整数还是带小数的数？具体是多少？",
        revealOutputs: ["78.0"],
        takeaway: [
          "与 float 参与运算时，结果常常是 float",
          "看起来「整」的 78.0，类型仍可能是 float",
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
        "除数为 0 会报错：ZeroDivisionError",
        "print(4 / 2) 得到 2.0，不是 2 —— 用 type() 可查证",
        "金额、时长优先用 float 想清楚单位，再写表达式",
      ],
      body: "浮点有时会有微小误差；本课先会正确选用类型与运算即可。",
    },
  },
];
