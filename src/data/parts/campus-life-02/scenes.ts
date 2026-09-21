import type { DraftScene } from "../../../types/scene";

/** CampusLife 0.2：多类型输入 → 转换 → 计算 → 比较 → 输出。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-cl2-01",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "从 0.1 到 0.2：要能算",
      body: "0.1 能展示姓名与时长；0.2 要能接收真实输入并计算。",
      codeComparison: {
        left: {
          label: "0.1 偏展示",
          code: 'name = input("姓名：")\nweekday = "周一"\nstudy_hours = 2\nprint(name, weekday, study_hours)',
        },
        right: {
          label: "0.2 要可计算",
          code: "输入多项生活数据\n转成正确类型\n计算合计 / 是否达标\n打印报告",
        },
      },
      flowDiagram: [
        "记录一天",
        "→ 类型正确",
        "→ 可计算",
        "→ 可比较",
        "→（后续）保存与分析",
      ],
    },
  },
  {
    id: "scene-cl2-02",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "一天数据：先约定类型",
      bulletPoints: [
        "姓名 name → str",
        "学习 study_hours、睡眠 sleep_hours → float",
        "运动 exercise_minutes → int",
        "消费 spending → float",
        "是否达标 study_ok → bool（由比较得到）",
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
          "哪些 input 后面必须 float 或 int？",
          "total_hours 在算什么？",
          "study_ok 为什么是布尔？",
          "最后报告里应出现哪些信息？",
        ],
        conclusionLines: [
          "输入 → 按类型转换",
          "处理 → 合计时长 + 学习是否达标",
          "输出 → 用 f-string 打印报告",
        ],
        footer: "建议试输入：李华 / 2.5 / 7 / 30 / 18.5",
      },
    },
    code: {
      initial:
        'name = input("请输入姓名：")\nstudy_hours = float(input("今日学习时长（小时）："))\nsleep_hours = float(input("昨晚睡眠时长（小时）："))\nexercise_minutes = int(input("今日运动时长（分钟）："))\nspending = float(input("今日消费金额（元）："))\n\ntotal_hours = study_hours + sleep_hours\nstudy_ok = study_hours >= 2.0\n\nprint(f"\\n{name} 的今日生活报告")\nprint(f"学习：{study_hours} 小时")\nprint(f"睡眠：{sleep_hours} 小时")\nprint(f"运动：{exercise_minutes} 分钟")\nprint(f"消费：{spending} 元")\nprint(f"学习+睡眠合计：{total_hours} 小时")\nprint(f"学习是否达标（≥2小时）：{study_ok}")',
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
      body: "把达标线从 2.0 改成 3.0，或增加「运动是否达标」再打印一行。",
      bulletPoints: [
        "改的是规则（阈值），不是东拼西凑改输出文字",
        "改完用同一组输入再跑，核对 True/False 是否合理",
        "类型错了先查 type() 与转换，再查算术",
      ],
    },
    code: {
      initial:
        'name = input("请输入姓名：")\nstudy_hours = float(input("今日学习时长（小时）："))\nexercise_minutes = int(input("今日运动时长（分钟）："))\n\nstudy_ok = study_hours >= 2.0\nexercise_ok = exercise_minutes >= 30\n\nprint(f"{name}｜学习达标：{study_ok}｜运动达标：{exercise_ok}")',
      editable: true,
      resetToInitial: true,
    },
  },
];
