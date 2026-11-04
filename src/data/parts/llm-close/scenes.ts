import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 课堂练习、要点、课后作业。 */
export const scenes: DraftScene[] = [
  {
    id: "llm-close-practice",
    title: "练习：这条日期能不能留",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      body: "通知不含绝对日期。若 date 非空且该字符串不在原文中，输出「不合格」，否则输出「合格」。使用当前 activity 运行。",
    },
    code: code(`notice = "周五晚上七点，在大学生活动中心举办Python交流会"
activity = {
    "name": "Python交流会",
    "date": "2026-11-07",
    "time": "19:00",
    "place": "大学生活动中心",
    "deadline": None,
}
`),
    hints: [
      { level: 1, text: "先判断 date 是否为非空值，再判断它是否为 notice 的子串。" },
      { level: 2, text: "None 表示未知，不应判为无依据填充。" },
      {
        level: 3,
        text: 'if activity["date"] and activity["date"] not in notice:\n    print("不合格")\nelse:\n    print("合格")',
      },
    ],
    reveal: {
      title: "对照",
      body: "2026-11-07 不是该通知的子串。缺少发布日期时，date 应保持为 None。",
    },
    expectedOutput: "不合格",
  },
  {
    id: "llm-close-points",
    title: "本讲要点",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "使用模型的同时验证结果",
      bulletPoints: [
        "正常结束只说明未抛出异常；边界输入用于检验规格",
        "最短反例是长度尽可能小、且能证明实现违背规格的输入",
        "计数、比较和持久化由程序完成；非结构化文本可由模型处理",
        "依据不足时使用 None，不填入未经证实的值",
        "JSON 可解析、字段齐全、字段值有原文依据，是三项独立条件",
        "提取函数可以替换；校验与保存保留在程序中",
      ],
    },
  },
  {
    id: "llm-close-homework",
    title: "课后作业",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "课后作业",
      bulletPoints: [],
    },
  },
];
