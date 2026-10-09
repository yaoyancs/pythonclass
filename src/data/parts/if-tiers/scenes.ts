import type { DraftScene } from "../../../types/scene";

/** 多分支：三档加价只进一档。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-if-tier-01",
    type: "run",
    layout: "split",
    content: {
      headline: "40 分钟被加了两次",
      bulletPoints: ["40 分钟加了几次？10 分钟为什么又回到原价？"],
    },
    code: {
      initial:
        "limit = 15\nprice = 1.5\n\nminutes = 40\nfee = minutes * price\nif minutes > 30:\n    fee = fee + 10\nif minutes > limit:\n    fee = fee + 5\nif minutes <= limit:\n    fee = minutes * price\nprint(minutes, fee)\n\nminutes = 10\nfee = minutes * price\nif minutes <= 30:\n    fee = fee + 5\nif minutes <= limit:\n    fee = minutes * price\nprint(minutes, fee)",
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-if-tier-02",
    type: "run",
    layout: "split",
    content: {
      headline: "先写窄的一档",
      bulletPoints: ["40 分钟现在进了哪一档？两档对调之后呢？"],
    },
    code: {
      initial:
        "minutes = 40\nprice = 1.5\nfee = minutes * price\nif minutes > 15:\n    fee = fee + 5\nelif minutes > 30:\n    fee = fee + 10\nprint(fee)",
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-if-tier-03",
    type: "run",
    layout: "split",
    content: {
      headline: "可以不写 else",
      bulletPoints: ["-3 分钟走进了哪一档？无效时该怎么提示？"],
    },
    code: {
      initial:
        "minutes = -3\nprice = 1.5\nfee = 0\nif minutes > 30:\n    fee = minutes * price + 10\nelif minutes > 15:\n    fee = minutes * price + 5\nelif minutes >= 0:\n    fee = minutes * price\nprint(fee)",
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-if-tier-04",
    type: "run",
    layout: "split",
    content: {
      headline: "边界分别进哪一档",
      bulletPoints: ["-1、0、15、16、30、31 各进哪一档？15 和 30 加不加价？"],
    },
    code: {
      initial:
        'price = 1.5\n# for 只负责把这六个分钟依次代入，循环下一讲再讲\nfor minutes in (-1, 0, 15, 16, 30, 31):\n    if minutes > 30:\n        fee = minutes * price + 10\n    elif minutes > 15:\n        fee = minutes * price + 5\n    elif minutes >= 0:\n        fee = minutes * price\n    else:\n        fee = "无效"\n    print(minutes, fee)',
      editable: true,
      resetToInitial: true,
    },
  },
];
