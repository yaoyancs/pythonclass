import type { DraftScene } from "../../../types/scene";

/** 综合练习：李华骑行。单价 1.5，超过 15 分钟算超时，与比较那一节同一条规定。学校名只留「曲师大」。不写 if。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-cl2-02",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "李华骑行",
      bulletPoints: [
        "李华在曲阜师范大学扫码骑共享单车。",
        "单价 1.5 元/分钟。从键盘输入昵称，以及骑了多少分钟。",
        "超过 15 分钟算超时。这个规定和前面的比较一样。",
        "算出费用，并打出是否超时。",
        "学校名只显示「曲师大」。",
      ],
    },
  },
  {
    id: "scene-cl2-conflict",
    type: "run",
    layout: "split",
    content: {
      headline: "费用",
      bulletPoints: [
        "单价 1.5 元/分钟。",
        "骑行时间从键盘输入。input() 得到文字，先 int() 再乘。",
      ],
    },
    code: {
      initial:
        'minutes = int(input("骑了多少分钟："))\nprice = 1.5\nfee = minutes * price\nprint(fee)',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-cl2-run",
    type: "run",
    layout: "split",
    content: {
      headline: "简称",
      bulletPoints: [
        "学校全称是「曲阜师范大学」。打印时要「曲师大」。",
        "campus[::] 还是全称。步长写成 2，隔一个字取一个。",
      ],
    },
    code: {
      initial:
        'nickname = input("请输入昵称：")\nminutes = int(input("骑了多少分钟："))\ncampus = "曲阜师范大学"\nshort = campus[::]\nprice = 1.5\nfee = minutes * price\nprint(f"{nickname}在{short}骑了{minutes}分钟，费用{fee}元")',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-cl2-04",
    type: "run",
    layout: "split",
    content: {
      headline: "超时",
      bulletPoints: [
        "规定超过 15 分钟才算超时。15 记在 limit 里。",
        "overtime = minutes > limit。超时打出 True，没超时打出 False。",
      ],
    },
    code: {
      initial:
        'nickname = input("请输入昵称：")\nminutes = int(input("骑了多少分钟："))\ncampus = "曲阜师范大学"\nshort = campus[::2]\nprice = 1.5\nlimit = 15\nfee = minutes * price\novertime = minutes > limit\nprint(f"{nickname}在{short}骑了{minutes}分钟，费用{fee}元")\nprint(f"超时：{overtime}")',
      editable: true,
      resetToInitial: true,
    },
  },
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
