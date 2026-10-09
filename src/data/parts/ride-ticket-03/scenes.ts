import type { DraftScene } from "../../../types/scene";

/** 综合：还车小票。学生改右侧未完成的程序。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-ride-03",
    type: "run",
    layout: "split",
    content: {
      headline: "综合练习：还车小票",
      bulletPoints: ["18 分钟、日照、学生，费用应当是多少？注释里还缺哪一步？"],
    },
    code: {
      initial:
        'nickname = input("昵称：")\nminutes = int(input("分钟："))\ncampus = input("校区：")\nstudent = input("学生证 y/n：")\nprice = 1.5\n\n# 1. 昵称为空则提示并结束本段计价\n\n# 2. 分钟为负则提示「分钟无效」\n\n# 3. 校区不在名单则提示「此处不可还车」\nallowed = ("曲师大", "日照", "圣约翰")\n\n# 4. 按三档算费用，学生再减 2，最低为 0\nfee = 0\n\n# 5. 打印费用；超时的单在金额后加上（含超时加价）\nprint(fee)',
      editable: true,
      resetToInitial: true,
    },
  },
];
