import type { DraftScene } from "../../../types/scene";

/** 成员判断、条件表达式、pass。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-if-campus-01",
    type: "run",
    layout: "split",
    content: {
      headline: "校区在不在名单里",
      bulletPoints: ["in 和 not in 分别是什么？改成曲师大之后呢？"],
    },
    code: {
      initial:
        'minutes = 18\nprice = 1.5\ncampus = "济南"\nallowed = ("曲师大", "日照", "圣约翰")\nprint(campus in allowed)\nprint(campus not in allowed)\nif campus not in allowed:\n    print("此处不可还车")\nelse:\n    print(minutes * price)',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-if-campus-02",
    type: "run",
    layout: "split",
    content: {
      headline: "标记写在一行里",
      bulletPoints: ["18 分钟和 10 分钟，行末有什么不同？加 5 的那一边还会算吗？"],
    },
    code: {
      initial:
        'minutes = 18\nlimit = 15\nprice = 1.5\novertime = minutes > limit\nfee = minutes * price + 5 if overtime else minutes * price\ntag = "（含超时加价）" if overtime else ""\nprint(f"{fee}{tag}")',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-if-campus-03",
    type: "run",
    layout: "split",
    content: {
      headline: "负数先占住",
      bulletPoints: ["-3 时为什么还会打印「继续算了」？怎样才能拦住？"],
    },
    code: {
      initial:
        'minutes = -3\nif minutes < 0:\n    pass\nprint("继续算了")',
      editable: true,
      resetToInitial: true,
    },
  },
];
