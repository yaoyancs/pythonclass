import type { DraftScene } from "../../../types/scene";

/** 双分支：超时加 5 元，否则保持原价。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-if-fee-01",
    type: "run",
    layout: "split",
    content: {
      headline: "没超时的费用还没写上",
      bulletPoints: ["10 分钟的费用为什么是 0？没超时应当是多少？"],
    },
    code: {
      initial:
        "minutes = 10\nlimit = 15\nprice = 1.5\nfee = 0\nif minutes > limit:\n    fee = minutes * price + 5\nprint(fee)",
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-if-fee-02",
    type: "run",
    layout: "split",
    content: {
      headline: "两边各走各的",
      bulletPoints: ["18、10、15 分钟各应付多少？15 分钟加不加 5？"],
    },
    code: {
      initial:
        "minutes = 18\nlimit = 15\nprice = 1.5\nif minutes > limit:\n    fee = minutes * price + 5\nelse:\n    fee = minutes * price\nprint(fee)",
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-if-fee-03",
    type: "run",
    layout: "split",
    content: {
      headline: "同一规则，三种结构",
      bulletPoints: ["15 分钟三种结果一样吗？哪一种两个条件都会检查？"],
    },
    code: {
      initial:
        'minutes = 15\nlimit = 15\nprice = 1.5\n\nfee = 0\nif minutes > limit:\n    fee = minutes * price + 5\nelse:\n    fee = minutes * price\nprint("if/else", fee)\n\nfee = 0\nif minutes > limit:\n    fee = minutes * price + 5\nif minutes <= limit:\n    fee = minutes * price\nprint("两个 if", fee)\n\nfee = minutes * price + 5 if minutes > limit else minutes * price\nprint("条件表达式", fee)',
      editable: true,
      resetToInitial: true,
    },
  },
];
