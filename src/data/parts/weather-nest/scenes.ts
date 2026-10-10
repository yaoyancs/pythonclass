import type { DraftScene } from "../../../types/scene";

/** 嵌套判断。else 的结论需要单独检验。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-weather-18",
    type: "run",
    layout: "split",
    content: {
      headline: "外层条件为假时，内层是否执行？",
      bulletPoints: ["先按当前值运行。", "再将 warning_checked 改为 False。"],
    },
    code: {
      initial:
        'warning_checked = True\nrain_warning = True\nwind_warning = False\nif warning_checked:\n    if rain_warning or wind_warning:\n        print("存在预警，请查看官方防御指南")\n    else:\n        print("当前输入未标记预警，仍需关注天气")\nelse:\n    print("信息未核验，请先查询官方预警")',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-weather-19",
    type: "run",
    layout: "split",
    content: {
      headline: "嵌套与复合条件是否等价？",
      bulletPoints: ["只核对是否输出这一句。", "再考虑两种失败原因是否需要不同提示。"],
      codeComparison: {
        left: {
          label: "嵌套",
          code: "if warning_checked:\n    if rain_warning or wind_warning:\n        print(\"查看官方防御指南\")",
        },
        right: {
          label: "复合条件",
          code: "if warning_checked and (rain_warning or wind_warning):\n    print(\"查看官方防御指南\")",
        },
      },
    },
    code: {
      initial:
        'warning_checked = True\nrain_warning = False\nwind_warning = True\nif warning_checked:\n    if rain_warning or wind_warning:\n        print("查看官方防御指南")',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-weather-20",
    type: "debug",
    layout: "split",
    content: {
      headline: "else 的输出是否有依据？",
      bulletPoints: ["先判断语法是否正确。", "再看 warning_checked 为 False 时进入哪一支。"],
    },
    code: {
      initial:
        'warning_checked = False\nrain_warning = False\nif warning_checked and rain_warning:\n    print("注意天气风险")\nelse:\n    print("可以放心出行")',
      editable: true,
      resetToInitial: true,
    },
    hints: [
      { level: 1, text: "分别计算两个变量，再计算 and。" },
      { level: 2, text: "and 为假的原因是否只有一种？" },
      { level: 3, text: "未核验、有预警、已核验且未标记预警，是否应各有一句输出？" },
    ],
  },
];
