import type { DraftScene } from "../../../types/scene";

/** and、or、not。数据为课堂模拟。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-weather-13",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "单一条件能否决定是否出行？",
      bulletPoints: ["户外计划、暴雨预警、大风预警、预警是否已核验。", "以下数据为课堂模拟。"],
    },
  },
  {
    id: "scene-weather-14",
    type: "question",
    layout: "fullscreen",
    content: {
      headline: "两种预警有多少种取值组合？",
      question: "「两者同时出现才提醒」与「出现一种即提醒」，条件是否相同？",
      bulletPoints: ["列出暴雨、大风各自为 True 或 False 的全部组合。"],
    },
  },
  {
    id: "scene-weather-15",
    type: "run",
    layout: "split",
    content: {
      headline: "and 为假时，是否表示没有风险？",
      bulletPoints: ["将两个变量分别设为四组 True / False。", "每次先预测是否输出。"],
    },
    code: {
      initial:
        "outdoor_plan = True\nrain_warning = True\nif outdoor_plan and rain_warning:\n    print(\"请先查阅官方防御指南，调整户外计划\")",
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-weather-16",
    type: "predict",
    layout: "split",
    content: {
      headline: "仅有大风预警时，条件是否成立？",
      bulletPoints: ["预测后运行。", "再将 or 改为 and。"],
    },
    code: {
      initial:
        "rain_warning = False\nwind_warning = True\nif rain_warning or wind_warning:\n    print(\"存在天气风险提示，请查阅官方防御指南\")",
      editable: true,
      resetToInitial: true,
    },
    prediction: {
      question: "当前 or 条件是否成立？",
      options: [
        { id: "yes", label: "成立", isCorrect: true },
        { id: "no", label: "不成立" },
      ],
    },
    reveal: {
      body: "or 在至少一边为真时成立。",
    },
  },
  {
    id: "scene-weather-17",
    type: "run",
    layout: "split",
    content: {
      headline: "尚未核验，能否视为没有预警？",
      bulletPoints: ["观察 warning_checked 为 False 时的输出。"],
    },
    code: {
      initial:
        'warning_checked = False\nif not warning_checked:\n    print("尚未核验官方预警，请先核实")',
      editable: true,
      resetToInitial: true,
    },
  },
];
