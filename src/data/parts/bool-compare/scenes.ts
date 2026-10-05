import type { DraftScene } from "../../../types/scene";

/** 布尔：规定超过 15 分钟才算超时。18 分钟、单价 1.5。不写 if。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-bc-01",
    type: "run",
    layout: "split",
    content: {
      headline: "是非题",
      bulletPoints: [
        "这趟骑行要回答：超时了吗？",
        "是非题只有两个回答：True 和 False。首字母必须大写。",
        "True 是布尔，type(True) 是 bool。\"True\" 带引号，是字符串。",
        "这一页先由人写下回答。下一页改成让程序自己比。",
      ],
    },
    code: {
      initial: 'overtime = True\nprint(overtime)\nprint(type(overtime))\nprint(type("True"))',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-bc-02",
    type: "run",
    layout: "split",
    content: {
      headline: "比较运算",
      bulletPoints: [
        "比较写在程序里。分钟一改，overtime 跟着重算。",
        "规定超过 15 分钟才算超时。这个 15 记在 limit 里。",
        "18 分钟，单价 1.5，费用是 18 * 1.5，得到 27.0。",
        "overtime = minutes > limit 得到 True。超时了。",
        "fee > 20 得到 True。费用超过 20 了。",
      ],
    },
    code: {
      initial:
        "minutes = 18\nlimit = 15\nprice = 1.5\nfee = minutes * price\novertime = minutes > limit\nprint(overtime)\nprint(fee)\nprint(fee > 20)",
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-bc-03",
    type: "run",
    layout: "split",
    content: {
      headline: "大于和大于等于",
      bulletPoints: [
        "规则是「超过规定分钟」，不是「骑满规定分钟」。",
        "minutes 改成 15 时，minutes > limit 是 False。",
        "骑满也算超时，写成 minutes >= limit，这时才是 True。",
        "minutes == limit 问的是「是不是刚好等于规定分钟」。== 是比较，= 是赋值。",
        "18 分钟时，minutes != limit 是 True。",
      ],
    },
    code: {
      initial:
        "limit = 15\nminutes = 15\nprint(minutes > limit)\nprint(minutes >= limit)\nprint(minutes == limit)\nminutes = 18\nprint(minutes != limit)\nprint(minutes > limit)",
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-bc-04",
    type: "run",
    layout: "split",
    content: {
      headline: "and 和 or",
      bulletPoints: [
        "规定 15 分钟。18 分钟，费用 27.0。两个回答要合成一句。",
        "minutes > limit and fee > 20 得到 True。两边都真，and 才为真。",
        "minutes > limit and fee > 30 得到 False。超时了，但费用是 27，没有超过 30。",
        "minutes > limit or fee > 30 得到 True。有一边为真，or 就为真。",
        "比较先算，再 and、or。这句不用加括号。",
      ],
    },
    code: {
      initial:
        "minutes = 18\nlimit = 15\nfee = 27.0\nboth = minutes > limit and fee > 20\nprint(both)\nprint(minutes > limit and fee > 30)\nprint(minutes > limit or fee > 30)",
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-bc-05",
    type: "run",
    layout: "split",
    content: {
      headline: "not",
      bulletPoints: [
        "规定 15 分钟，单价 1.5。分钟改一次，回答跟着算一次。",
        "10 分钟，费用 15.0：超时 False，费用也没超过 20，所以「超时并且费用超过 20」是 False。没有超时：True。",
        "15 分钟，费用 22.5：没有超过规定分钟，超时 False。费用超过了 20，但「超时并且费用超过 20」仍是 False。没有超时：True。",
        "18 分钟，费用 27.0：超时 True，费用也超过 20，所以「超时并且费用超过 20」是 True。没有超时：False。",
        "not 把真假反过来。比较先于 not，所以 not minutes > limit 就是 not (minutes > limit)。",
      ],
    },
    code: {
      initial:
        'limit = 15\nprice = 1.5\n\nminutes = 10\nfee = minutes * price\novertime = minutes > limit\nprint("分钟", minutes, "超时", overtime, "并且超过20", overtime and fee > 20, "没有超时", not overtime)\n\nminutes = 15\nfee = minutes * price\novertime = minutes > limit\nprint("分钟", minutes, "超时", overtime, "并且超过20", overtime and fee > 20, "没有超时", not overtime)\n\nminutes = 18\nfee = minutes * price\novertime = minutes > limit\nprint("分钟", minutes, "超时", overtime, "并且超过20", overtime and fee > 20, "没有超时", not overtime)',
      editable: true,
      resetToInitial: true,
    },
  },
];
