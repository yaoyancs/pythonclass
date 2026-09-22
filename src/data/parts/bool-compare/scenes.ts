import type { DraftScene } from "../../../types/scene";

/** 本 part：bool 与比较；飞花令是否及格。不写 if。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-bc-01",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "布尔：只有两个值",
      body: "bool 用来表示「是 / 否」这类判断结果。",
      bulletPoints: [
        "只有 True 和 False（首字母大写）",
        "不是字符串 \"True\"，也不是数字 1/0（虽然有时看起来像）",
        "type(True) → <class 'bool'>",
      ],
      codeComparison: {
        left: {
          label: "正确字面量",
          code: "passed = True\nagain = False",
        },
        right: {
          label: "常见写错",
          code: "passed = true   # 报错\npassed = \"True\" # 那是字符串",
        },
      },
    },
  },
  {
    id: "scene-bc-02",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "比较会产生布尔",
      varPredict: {
        code: "score = 85.5\nround_no = 1\nprint(score >= 60)\nprint(round_no == 1)\nprint(score != 0)",
        question: "三行分别输出 True 还是 False？",
        revealOutputs: ["True", "True", "True"],
        takeaway: [
          "score >= 60 问是否达标；round_no == 1 问是否第一轮",
          "== 判断相等；!= 判断不等",
          "比较的结果类型是 bool；本讲只打印，不写 if",
        ],
      },
    },
  },
  {
    id: "scene-bc-03",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "和飞花令得分的关系",
      body: "本轮是否及格，先得到一个布尔值。",
      varPredict: {
        code: "score = 85.5\ntarget = 60\npassed = score >= target\nprint(passed)\nprint(type(passed))",
        question: "passed 是什么？type(passed) 呢？",
        revealOutputs: ["True", "<class 'bool'>"],
        takeaway: [
          "及格线是数值比较，不是口头感觉",
          "本节能打印 True/False；按结果走不同分支是下一讲",
        ],
      },
    },
  },
];
