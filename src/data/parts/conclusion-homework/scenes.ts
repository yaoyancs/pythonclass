import type { DraftScene } from "../../../types/scene";

/** 第 2 讲收束：小结 + 作业。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-ch-01",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "本讲要点",
      finalVerdict: {
        lines: [
          "数据先有名字，再看它是哪一种。",
          "变量。名字指向对象，可以改指向。两个名字也可以指向同一个对象。",
          "类型。int、float、str、bool，用 type() 区分。",
          "数字。/ 得到小数。括号最先，然后 * / // %，再 + -。同级从左到右。",
          "字符串。下标从 0 开始，可以正向、负向取，也可以切片。不能改其中一格。",
          "布尔。比较得到 True 或 False。> 不含等于，>= 才含。and、or、not 把是非题合在一起。",
          "输入。input() 读到的是文字。要拿去算，先 int()。f\"...\" 把花括号里的值嵌进句子。",
        ],
      },
    },
  },
  {
    id: "scene-ch-02",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "课后作业",
      bulletPoints: [
        "收银找零。顾客付 100 元。从键盘输入应付的整数金额，打出三行：找零多少元、能换几张 20 元、剩下多少元。用 36 元自己验一次：找零 64 元，20 元有 3 张，剩下 4 元。",
        "快递单上的手机号。从键盘输入 11 位手机号，打出打码后的号码：前 3 位、四个 *、后 4 位。再打出长度是不是 11。用 13812345678 自己验一次：应当得到 138****5678，长度判断为 True。",
      ],
    },
  },
];
