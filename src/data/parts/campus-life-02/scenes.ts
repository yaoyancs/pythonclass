import type { DraftScene } from "../../../types/scene";

/** 综合练习：李华骑行。单价 1.5，超过 15 分钟算超时。学校名只留「曲师大」。不写 if。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-cl2-practice",
    type: "run",
    layout: "split",
    content: {
      headline: "综合练习：骑行小票",
      bulletPoints: [
        "右侧代码能运行，但结果还不对。照着注释的 1 到 5 步，把它改对。",
      ],
    },
    code: {
      initial:
        'nickname = input("请输入昵称：")\nminutes = int(input("骑了多少分钟："))\ncampus = "曲阜师范大学"\nprice = 1.5\nlimit = 15\n\n# 1. 去掉昵称两端空格\n\n# 2. 取简称：隔一个字取一个\nshort = campus\n\n# 3. 算费用\nfee = 0\n\n# 4. 换算成小时和分钟\nhours = 0\nrest = minutes\n\n# 5. 是否超时\novertime = False\n\nprint(f"{nickname}在{short}骑行 {hours} 小时 {rest} 分钟")\nprint(f"费用 {fee} 元")\nprint(f"超时：{overtime}")',
      editable: true,
      resetToInitial: true,
    },
  },
];
