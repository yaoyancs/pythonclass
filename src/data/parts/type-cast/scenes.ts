import type { DraftScene } from "../../../types/scene";

/** 收束：input 得到 str，先转换再做数字运算。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-tc-01",
    type: "run",
    layout: "split",
    content: {
      headline: "先转换，再运算",
      bulletPoints: [
        'input() 得到的是字符串，例如 "18"。',
        "字符串不能直接乘 1.5。",
        "int() 转成整数，float() 转成浮点数，之后才能做数字运算。",
      ],
    },
    code: {
      initial:
        'minutes = input("骑了多少分钟：")\nminutes = int(minutes)\nfee = minutes * 1.5\nprint("费用", fee, "元")',
      editable: true,
      resetToInitial: true,
    },
  },
];
