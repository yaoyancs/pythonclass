import type { DraftScene } from "../../../types/scene";

/** CampusLife 0.1：固定输出 → 变量 → 输入（场景 43–46） */
export const scenes: DraftScene[] = [
  {
    id: "scene-cl-43",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "CampusLife：大学生活数据助手",
      body: "最终将处理：",
      bulletPoints: [
        "日期",
        "学习时长",
        "睡眠时长",
        "运动时长",
        "消费金额",
      ],
      flowDiagram: [
        "记录一天",
        "→ 记录一周",
        "→ 保存文件",
        "→ 批量统计",
        "→ 表格分析",
        "→ 生成图表和周报",
      ],
    },
  },
  {
    id: "scene-cl-44",
    type: "question",
    layout: "split",
    content: {
      headline: "固定输出版本",
      question: "如果换一名学生，是不是要在程序中到处寻找和修改姓名？",
    },
    code: {
      initial:
        'print("大学生活数据助手")\nprint("姓名：张明")\nprint("星期：周一")\nprint("今日学习时长：2小时")',
      editable: false,
      resetToInitial: true,
    },
  },
  {
    id: "scene-cl-45",
    type: "explain",
    layout: "split",
    content: {
      headline: "变量版本",
      body: "数据集中放在前面；输出通过变量使用；改一处，输出同步变化。",
      bulletPoints: [
        "数据集中放在程序前面",
        "后面的输出通过变量使用数据",
        "修改变量值，输出会同步变化",
      ],
    },
    code: {
      initial:
        'name = "张明"\nweekday = "周一"\nstudy_hours = 2\n\nprint("大学生活数据助手")\nprint("姓名：", name)\nprint("星期：", weekday)\nprint("今日学习时长：", study_hours, "小时")',
      editable: false,
      resetToInitial: true,
    },
  },
  {
    id: "scene-cl-46",
    type: "run",
    layout: "split",
    content: {
      headline: "加入用户输入",
      body: '把 name = "张明" 改成 name = input("请输入你的姓名：")。学生活动：',
      bulletPoints: [
        "输入自己的姓名",
        "修改星期",
        "修改学习时长",
        "运行程序",
        "检查输出",
      ],
    },
    code: {
      initial:
        'name = input("请输入你的姓名：")\n\nweekday = "周一"\nstudy_hours = 2\n\nprint("大学生活数据助手")\nprint("姓名：", name)\nprint("星期：", weekday)\nprint("今日学习时长：", study_hours, "小时")',
      editable: true,
      resetToInitial: true,
    },
    expectedOutput:
      "大学生活数据助手\n姓名： 李华\n星期： 周一\n今日学习时长： 2 小时",
  },
];
