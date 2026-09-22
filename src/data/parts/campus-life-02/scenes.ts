import type { DraftScene } from "../../../types/scene";

/** 飞花令 0.2：多类型输入 → 转换 → 计算 → 比较 → 输出。不写 if。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-cl2-01",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "从诗卡到飞花令 0.2：要能算",
      body: "第 1 讲诗卡能展示姓名与固定诗句；0.2 要接收轮次、得分并计算。",
      codeComparison: {
        left: {
          label: "0.1 偏展示",
          code: 'player = input("请输入你的名字：")\npoem = "春眠不觉晓"\nauthor = "孟浩然"\nprint(player, poem, author)',
        },
        right: {
          label: "0.2 要可计算",
          code: "输入姓名、主题、轮次、得分\n转成正确类型\n计算下一轮 / 是否及格\n打印开场与记分",
        },
      },
      flowDiagram: [
        "诗卡展示",
        "→ 类型正确",
        "→ 可计算",
        "→ 可比较",
        "→（第3讲）按结果说不同的话",
      ],
    },
  },
  {
    id: "scene-cl2-02",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "一场飞花令：先约定类型",
      bulletPoints: [
        "player、poem、author、theme → str",
        "round_no → int",
        "score → float",
        "passed → bool（由比较得到）",
      ],
      body: "写代码前先回答：这项要算吗？要算就转换。",
    },
  },
  {
    id: "scene-cl2-03",
    type: "run",
    layout: "split",
    content: {
      headline: "组装程序：先想再跑",
      questionCascade: {
        title: "不运行，先回答",
        questions: [
          "哪些 input 后面必须 int 或 float？",
          "next_round 在算什么？",
          "passed 为什么是布尔？",
          "最后开场里应出现哪些信息？",
        ],
        conclusionLines: [
          "输入 → 按类型转换",
          "处理 → 下一轮 + 是否及格",
          "输出 → 用 f-string 打印开场与记分",
        ],
        footer: "建议试输入：李华 / 花 / 春眠不觉晓 / 2 / 85.5",
      },
    },
    code: {
      initial:
        'player = input("请输入选手名：")\ntheme = input("本轮花名：")\npoem = input("请输入诗句：")\nround_no = int(input("现在是第几轮："))\nscore = float(input("本轮得分："))\n\nnext_round = round_no + 1\npassed = score >= 60\n\nprint(f"\\n{player} · {theme}令")\nprint(f"诗句：{poem}")\nprint(f"当前第 {round_no} 轮，下一轮是第 {next_round} 轮")\nprint(f"得分：{score}")\nprint(f"是否及格（≥60）：{passed}")',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-cl2-04",
    type: "run",
    layout: "split",
    content: {
      headline: "改需求：动一处，观察变化",
      body: "把及格线从 60 改成 80，或再打印一行 round_no > 1。",
      bulletPoints: [
        "改的是规则（阈值），不是东拼西凑改输出文字",
        "改完用同一组输入再跑，核对 True/False 是否合理",
        "类型错了先查 type() 与转换，再查算术",
        "仍然不写 if",
      ],
    },
    code: {
      initial:
        'player = input("请输入选手名：")\nround_no = int(input("现在是第几轮："))\nscore = float(input("本轮得分："))\n\npassed = score >= 60\nnot_first = round_no > 1\n\nprint(f"{player}｜及格：{passed}｜已经不是第一轮：{not_first}")',
      editable: true,
      resetToInitial: true,
    },
  },
];
