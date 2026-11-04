import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 三条格式不同的通知：什么交给规则，什么交给语言模型，什么必须标成未知。 */
export const scenes: DraftScene[] = [
  {
    id: "llm-notices",
    title: "三份活动通知",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "同一字段，原文格式并不统一",
      bulletPoints: [
        "文本 A：周五晚上七点，在大学生活动中心举办 Python 交流会。周四中午截止报名。",
        "文本 B：数据分析工作坊将于 11 月 20 日 14:00 在图书馆报告厅举行，报名截止日期为 11 月 18 日。",
        "文本 C：下周准备组织一场人工智能主题分享，具体时间地点另行通知。",
      ],
      body: "目标字段为名称、日期、时间、地点、报名截止。字符串查找和固定规则可以提取稳定模式；表述变化增多时，规则维护成本上升。语言模型适合处理这类句子，但可能补出原文没有的值。",
    },
  },
  {
    id: "llm-auction",
    title: "划分处理职责",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "按任务性质选择实现方式",
      body: "先判断由确定性程序完成、由模型完成，还是两者配合。下表是一种可辩护的划分。",
      gridTable: {
        headers: ["子任务", "更合适的做法"],
        rows: [
          ["计算已报名人数", "Python"],
          ["解释「周四中午截止」", "模型提取，再人工核对"],
          ["截止是否早于活动日期", "Python"],
          ["从非结构化文本提取名称", "模型输出固定字段"],
          ["保存为 JSON 文件", "Python"],
          ["「下周」对应的绝对日期", "依据不足，记为未知"],
        ],
      },
    },
  },
  {
    id: "llm-find-limit",
    title: "成员检测不能完成信息抽取",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "in 与 find 只判断子串是否出现",
      body: "二者不识别「周五晚上七点」的时间语义，也不抽取活动名称。",
      bulletPoints: ["in 的结果为 True 表示子串存在", "find 返回起始下标，不存在时返回 -1"],
    },
    code: code(`notice = "周五晚上七点，在大学生活动中心举办Python交流会"
print("Python" in notice)
print(notice.find("活动中心"))`),
  },
  {
    id: "llm-unknown",
    title: "没有依据就写成未知",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "缺少参照信息时使用 None",
      body: "原文未给出发布日期，无法确定绝对日期。date 与 deadline 取 None，表示未知，不填入未经证实的值。",
      bulletPoints: ["「晚上七点」可规范为 19:00", "地点与名称在原文中有明确依据"],
    },
    code: code(`activity = {
    "name": "Python交流会",
    "date": None,
    "time": "19:00",
    "place": "大学生活动中心",
    "deadline": None,
}
print(activity["name"])
print(activity["date"])
print(activity["time"])`),
  },
];
