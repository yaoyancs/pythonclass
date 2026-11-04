import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 格式、结构、内容是三种不同的错。JSON 合法也不证明内容真实。 */
export const scenes: DraftScene[] = [
  {
    id: "llm-json-ok",
    title: "先变成字典",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "将约定格式的 JSON 解析为字典",
      body: "json.loads 将文本转换为字典。JSON 的 null 对应 Python 的 None。五个字段齐全后才能继续处理。",
      bulletPoints: ["字段名为 name、date、time、place、deadline", "输出仅为 JSON，不附加说明文本"],
    },
    code: code(`import json

response = """
{
    "name": "Python交流会",
    "date": null,
    "time": "19:00",
    "place": "大学生活动中心",
    "deadline": null
}
"""
activity = json.loads(response)
print(activity["name"])
print(activity["place"])
print(activity["date"])`),
  },
  {
    id: "llm-json-miss",
    title: "结构不完整",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "缺少 place 时不能当作空字符串",
      body: "文本可以解析，但没有 place。方括号访问抛出 KeyError。改为：键存在时输出值，否则输出「缺少字段」。",
    },
    code: code(`import json

response = """
{
    "name": "Python交流会",
    "date": null,
    "time": "19:00",
    "deadline": null
}
"""
activity = json.loads(response)
print(activity["place"])`),
    hints: [
      { level: 1, text: "loads 已经成功，错误出在键不存在。" },
      { level: 2, text: "使用 get，第二个参数为键不存在时的输出。" },
      { level: 3, text: 'print(activity.get("place", "缺少字段"))' },
    ],
    reveal: {
      title: "对照",
      body: "解析成功只说明语法合法。字段是否齐全需要再检查键。",
    },
    expectedOutput: "缺少字段",
  },
  {
    id: "llm-json-fact",
    title: "内容是否有依据",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "JSON 合法并不保证字段值有依据",
      body: "原文只有「周五」，不包含 2026-11-07。日期未出现在原文中时，判定为不合格。",
      bulletPoints: ["语法错误：引号或括号不配对，loads 抛出异常", "结构错误：缺少字段", "内容错误：填入原文没有的信息"],
    },
    code: code(`notice = "周五晚上七点，在大学生活动中心举办Python交流会"
activity = {
    "name": "Python交流会",
    "date": "2026-11-07",
    "time": "19:00",
    "place": "大学生活动中心",
    "deadline": None,
}
if activity["date"] and activity["date"] not in notice:
    print("不合格")
else:
    print("合格")`),
  },
];
