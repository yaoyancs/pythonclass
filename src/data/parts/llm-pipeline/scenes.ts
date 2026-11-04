import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/**
 * 离线整理器：extract_activity 的输入输出固定，里面现在是预设结果。
 * 真实模型以后只替换这个函数。
 */
export const scenes: DraftScene[] = [
  {
    id: "llm-tool-mock",
    title: "先跑通离线版本",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "当前实现返回固定示例，并未解析输入",
      body: "extract_activity 对任意通知返回同一字典。函数契约是：输入为通知文本，输出为字典。替换为真实模型调用时，主流程保持不变。",
      bulletPoints: ["check_activity 只检查五个键是否存在", "检查通过后才写入 activity.json"],
    },
    code: code(`import json

def extract_activity(notice):
    return {
        "name": "数据分析工作坊",
        "date": "2026-11-20",
        "time": "14:00",
        "place": "图书馆报告厅",
        "deadline": "2026-11-18",
    }

def check_activity(activity):
    required = ["name", "date", "time", "place", "deadline"]
    for key in required:
        if key not in activity:
            return False
    return True

notice = "11月20日14:00，数据分析工作坊将在图书馆报告厅举行，11月18日截止报名。"
activity = extract_activity(notice)
if check_activity(activity):
    with open("activity.json", "w", encoding="utf-8") as f:
        json.dump(activity, f, ensure_ascii=False)
    print(activity["name"])
    print("已保存")
else:
    print("数据不完整")`),
  },
  {
    id: "llm-tool-miss",
    title: "缺地点就不保存",
    type: "modify",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "返回值缺少 place",
      body: "示例字典没有 place。检查应失败，并输出「数据不完整」。不要补入原文未出现的地点。",
    },
    code: code(`def extract_activity(notice):
    return {
        "name": "数据分析工作坊",
        "date": "2026-11-20",
        "time": "14:00",
        "deadline": "2026-11-18",
    }

def check_activity(activity):
    required = ["name", "date", "time", "place", "deadline"]
    for key in required:
        if key not in activity:
            return False
    return True

activity = extract_activity("活动通知")
if check_activity(activity):
    print("已保存")
else:
    print("通过")`),
    hints: [
      { level: 1, text: "place 不在字典里，check_activity 应返回 False。" },
      { level: 2, text: "当前 else 分支输出「通过」，与失败分支的语义不一致。" },
      { level: 3, text: 'else 分支改成 print("数据不完整")。' },
    ],
    reveal: {
      title: "对照",
      body: "缺少键属于结构错误，由字典检查处理。该检查不验证日期是否有原文依据。",
    },
    expectedOutput: "数据不完整",
  },
  {
    id: "llm-tool-date",
    title: "截止日期晚于活动",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "字段齐全时，日期关系仍可能矛盾",
      body: "日期采用 YYYY-MM-DD 时，可按字符串比较先后。截止日期晚于活动日期时输出「需人工复核」，不将其视为有效记录。",
      bulletPoints: ["先后比较由程序完成", "该结论不由模型生成"],
    },
    code: code(`activity = {
    "name": "数据分析工作坊",
    "date": "2026-11-20",
    "time": "14:00",
    "place": "图书馆报告厅",
    "deadline": "2026-11-21",
}
if activity["deadline"] > activity["date"]:
    print("需人工复核")
else:
    print("日期关系通过")`),
  },
  {
    id: "llm-tool-swap",
    title: "模型只替换一个函数",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "调用点保持不变，只替换函数实现",
      bulletPoints: [
        "调用形式保持为 activity = extract_activity(notice)",
        "离线实现返回预设字典",
        "接入接口时，在函数内部请求模型，再将 JSON 文本解析为字典",
        "密钥存放在环境变量中，不写入提交代码，不出现在前端",
        "解析失败、缺少字段、无依据的日期、截止日期晚于活动日期，均须显式处理，不得直接保存",
      ],
    },
  },
];
