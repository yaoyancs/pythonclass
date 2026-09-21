import type { DraftScene } from "../../../types/scene";

/** CampusLife 0.1：产品壳 + 输入输出。写死打印 → 变量输出 → input()。不讲类型。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-cl-43",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "CampusLife：大学生活数据助手",
      body: "本课第一个小程序——先输出一天的姓名、星期、学习时长。数据从哪来：先写在程序里，再改为运行时输入。",
    },
  },
  {
    id: "scene-cl-44",
    type: "run",
    layout: "split",
    content: {
      headline: "先只会输出",
      question: "这四行都是在输出。换你的名字和学习时长，要改哪几行？",
      body: "print 负责把结果送到屏幕。",
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
      headline: "输出用变量",
      body: "只改三个变量，不要改 print。print 输出的是变量当前的值；逗号是把几段内容挨着打印。",
      question: "数据仍写在源代码里。每次换人，是不是还得改程序？",
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
      headline: "输入 + 输出",
      question: "执行到 input() 时，程序会怎样？",
      body: "跑一遍，输入自己的姓名。",
      bulletPoints: [
        "input()：停下来，把键盘内容放进变量（输入）",
        "print()：把变量里的内容送到屏幕（输出）",
      ],
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
