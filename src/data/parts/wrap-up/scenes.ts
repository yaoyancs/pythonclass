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
          "本讲我们把程序跑了起来，用变量给数据起了名字，并做出了诗卡和飞花令开场。",
          "编程是把想法变成可执行、可验证、可重复的步骤。",
          "接下来要弄清：数据在程序里究竟有哪些类型。",
        ],
        abilities: [
          "解释 Python 代码如何被执行",
          "预测简单程序的输出",
          "区分数字、文字和表达式",
          "解释变量和赋值",
          "使用 input() 接收姓名",
          "做出诗卡，并用多个变量做出飞花令开场",
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
        "在自己电脑上搭建好 Python 编程环境。",
        "本地编写三个程序：（1）键盘输入 name，输出「大家好，我的名字叫XXX。」（2）定义单价、重量、总价，计算并输出总价。（3）用变量和 input() 打印校园卡：姓名、学号、专业、学院。",
        "完成 PTA 的 Lab 1。",
        "复习本讲课件与课本，预习第 2 讲。",
      ],
    },
  },
];
