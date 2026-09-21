import type { DraftScene } from "../../../types/scene";

/** 本 part：bool 与比较；不写 if。 */
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
          code: "ok = True\ndone = False",
        },
        right: {
          label: "常见写错",
          code: "ok = true   # 报错\nok = \"True\" # 那是字符串",
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
        code: "print(3 > 2)\nprint(3 == 2)\nprint(3 != 2)\nprint(2.5 >= 2.5)",
        question: "四行分别输出 True 还是 False？",
        revealOutputs: ["True", "False", "True", "True"],
        takeaway: [
          "== 判断相等；!= 判断不等",
          "< > <= >= 做大小比较",
          "比较的结果类型是 bool",
        ],
      },
    },
  },
  {
    id: "scene-bc-03",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "和生活数据的关系",
      body: "CampusLife：学习是否达标，先得到一个布尔值。",
      varPredict: {
        code: "study_hours = 2.5\ntarget = 2.0\nreached = study_hours >= target\nprint(reached)\nprint(type(reached))",
        question: "reached 是什么？type(reached) 呢？",
        revealOutputs: ["True", "<class 'bool'>"],
        takeaway: [
          "达标线是数值比较，不是口头感觉",
          "本节能打印 True/False；按结果走不同分支是下一讲",
        ],
      },
    },
  },
  {
    id: "scene-bc-04",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "和下节课的关系",
      body: "现在我们能算出 True / False，但程序还不会根据结果走不同的路。",
      bulletPoints: [
        "本讲：算出判断结果，并打印出来",
        "第 3 讲：用 if 根据 True/False 走不同代码路径",
        "先会比较，再学分支 —— 顺序不能反",
      ],
      preview: "下一节：把类型、转换、比较装进 CampusLife 0.2",
    },
  },
];
