import type { DraftScene } from "../../../types/scene";

/** CampusLife 0.1：先目标与任务，再用 print / 变量 / input 完成。幻灯片只放课堂概括。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-cl-43",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "CampusLife 要做什么",
      body: "大学生活数据助手：用程序记录一天的生活，并输出报告。",
      codeComparison: {
        left: {
          label: "整体目标",
          code: "记录一天的生活数据\n输出今日报告\n以后：能计算、能判断、能保存",
        },
        right: {
          label: "本节完成 0.1",
          code: "姓名\n星期\n学习时长\n打印这三项",
        },
      },
    },
  },
  {
    id: "scene-cl-req",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "0.1 任务要求",
      bulletPoints: [
        "打印：姓名、星期、学习时长",
        "三项数据放进变量",
        "姓名在运行时输入",
      ],
    },
  },
  {
    id: "scene-cl-44",
    type: "run",
    layout: "split",
    content: {
      headline: "先打印报告",
      question: "运行后应看到哪四行？",
    },
    code: {
      initial:
        'print("大学生活数据助手")\nprint("姓名：张明")\nprint("星期：周一")\nprint("今日学习时长：2小时")',
      editable: true,
      resetToInitial: true,
    },
    expectedOutput:
      "大学生活数据助手\n姓名：张明\n星期：周一\n今日学习时长：2小时",
  },
  {
    id: "scene-cl-45",
    type: "run",
    layout: "split",
    content: {
      headline: "数据放进变量",
      question: "把张明改成你的名字，应改哪一处？",
    },
    code: {
      initial:
        'name = "张明"\nweekday = "周一"\nstudy_hours = 2\n\nprint("大学生活数据助手")\nprint("姓名：", name)\nprint("星期：", weekday)\nprint("今日学习时长：", study_hours, "小时")',
      editable: true,
      resetToInitial: true,
    },
    expectedOutput:
      "大学生活数据助手\n姓名： 张明\n星期： 周一\n今日学习时长： 2 小时",
  },
  {
    id: "scene-cl-46",
    type: "run",
    layout: "split",
    content: {
      headline: "姓名改为输入",
      question: "运行后，程序会在哪一步停下来等你？",
    },
    code: {
      initial:
        'name = input("请输入你的姓名：")\nweekday = "周一"\nstudy_hours = 2\n\nprint("大学生活数据助手")\nprint("姓名：", name)\nprint("星期：", weekday)\nprint("今日学习时长：", study_hours, "小时")',
      editable: true,
      resetToInitial: true,
    },
    expectedOutput:
      "大学生活数据助手\n姓名： 李华\n星期： 周一\n今日学习时长： 2 小时",
  },
];
