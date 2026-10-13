import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

export const scenes: DraftScene[] = [
  {
    id: "scene-weather-13",
    type: "explain",
    layout: "fullscreen",
    content: { conditionPath: { topic: "bool", mode: "cover" } },
  },
  {
    id: "scene-weather-14",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "bool", mode: "conflict" } },
    code: code(
      "rain_warning = False\nwind_warning = True\nif rain_warning:\n    print(\"存在天气风险提示，请查阅官方防御指南\")",
    ),
  },
  {
    id: "scene-weather-15",
    type: "explain",
    layout: "fullscreen",
    content: { conditionPath: { topic: "bool", mode: "trace" } },
  },
  {
    id: "scene-weather-16",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "bool", mode: "syntax" } },
    code: code(
      "rain_warning = False\nwind_warning = True\nif rain_warning or wind_warning:\n    print(\"存在天气风险提示，请查阅官方防御指南\")",
    ),
  },
  {
    id: "scene-weather-17",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "bool", mode: "lab" } },
    code: code(
      "rain_warning = False\nwind_warning = True\nif rain_warning or wind_warning:\n    print(\"存在天气风险提示，请查阅官方防御指南\")",
    ),
  },
  {
    id: "scene-weather-18",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: { conditionPath: { topic: "bool", mode: "extend" } },
    code: code('warning_checked = False\nif not warning_checked:\n    print("尚未核验官方预警，请先核实")'),
  },
];
