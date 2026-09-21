import type { DraftScene } from "../../../types/scene";

export const scenes: DraftScene[] = [
  {
    id: "scene-01",
    type: "question",
    layout: "fullscreen",
    content: {
      headline: "既然 AI 会写代码，我们为什么还要学 Python？",
      promptQuote:
        "编写一个Python程序，输入一名学生的三门成绩，计算平均分，并判断是否达到优秀。",
      question:
        "以前，计算机不会自主写程序，所以人必须学习编程。现在这句话已经不完全成立。AI可以根据一句自然语言要求生成一段完整代码。我们为什么还坐在这里学 Python？",
      emoji: "🤔",
    },
  },
  {
    id: "scene-read-code",
    type: "question",
    layout: "split",
    content: {
      question: "这段程序最后可能输出什么？",
      voteOptions: ["五个成绩", "平均成绩", "最高成绩", "学生姓名"],
    },
    code: {
      initial:
        "scores = [78, 92, 85, 61, 95]\naverage = sum(scores) / len(scores)\nprint(average)",
      editable: false,
      resetToInitial: true,
    },
  },
  {
    id: "scene-02",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "AI 时代的学习方式",
      learningFlow: {
        lead: "编程的第一项能力不是敲代码，而是建立从代码到行为的联系。",
        steps: [
          "提出问题",
          "拆分步骤",
          "阅读代码",
          "预测结果",
          "运行验证",
          "发现并修正问题",
        ],
        aiNote: {
          title: "AI 可以参与每一步",
          body: "但不能替你对结果负责",
        },
      },
    },
  },
];
