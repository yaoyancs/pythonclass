import type { DraftScene } from "../../../types/scene";

/** 第 1 讲收束：课堂小结 + 课后作业（应挂在开课表最后） */
export const scenes: DraftScene[] = [
  {
    id: "scene-wrap-summary",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "课堂小结",
      finalVerdict: {
        lines: [
          "本讲我们把程序跑了起来，用变量给数据起了名字，并做出了 CampusLife 小程序。",
          "编程是把想法变成可执行、可验证、可重复的步骤。",
          "接下来要弄清：数据在程序里究竟有哪些类型。",
        ],
        abilities: [
          "解释 Python 代码如何被执行",
          "预测简单程序的输出",
          "区分数字、文字和表达式",
          "解释变量和赋值",
          "使用 input() 接收姓名",
          "在 CampusLife 里改数据、跑通输出",
        ],
        teaserCode:
          'age = input("请输入年龄：")\nnext_year = age + 1\n\nprint("明年你", next_year, "岁")',
        teaserQuestion: "这段程序看起来很合理，为什么运行时可能出错？",
        teaserClose:
          "下一课：程序中的数据究竟有哪些类型，以及 Python 为什么如此在意数据类型。",
      },
    },
  },
  {
    id: "scene-wrap-homework",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "课后作业",
      body: "第一次课后作业",
      bulletPoints: [
        "确认编程环境验收仍可通过（版本 / 解释器 / Hello）",
        "完成 PTA 中的编程练习",
      ],
    },
  },
];
