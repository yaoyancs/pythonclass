import type { DraftScene } from "../../../types/scene";

export const scenes: DraftScene[] = [
  {
    id: "scene-01",
    type: "question",
    layout: "fullscreen",
    content: {
      headline: "既然 AI 会写代码，我们为什么还要学 Python？",
      promptQuote:
        "编写一个Python程序，输入一名学生的三门成绩，计算平均分，并判断是否达到优秀。",
      question:
        "以前，计算机不会自主写程序，所以人必须学习编程。现在这句话已经不完全成立。AI可以根据一句自然语言要求生成一段完整代码。我们为什么还坐在这里学 Python？",
      emoji: "🤔",
    },
  },
  {
    id: "scene-read-code",
    type: "question",
    layout: "split",
    content: {
      question: "这段程序最后可能输出什么？",
      voteOptions: ["五个成绩", "平均成绩", "最高成绩", "学生姓名"],
    },
    code: {
      initial:
        "scores = [78, 92, 85, 61, 95]\naverage = sum(scores) / len(scores)\nprint(average)",
      editable: false,
      resetToInitial: true,
    },
  },
  {
    id: "scene-02",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "AI 时代的学习方式",
      learningFlow: {
        lead: "编程的第一项能力不是敲代码，而是建立从代码到行为的联系。",
        steps: [
          "提出问题",
          "拆分步骤",
          "阅读代码",
          "预测结果",
          "运行验证",
          "发现并修正问题",
        ],
        aiNote: {
          title: "AI 可以参与每一步",
          body: "但不能替你对结果负责",
        },
        principle: {
          label: "确立全课程固定流程",
          steps: ["Read", "Predict", "Run", "Explain", "Modify"],
        },
      },
    },
  },
  {
    id: "scene-method-verify",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "验证与巩固：你真的能接住 AI 的代码吗？",
      methodVerify: {
        prompt:
          "请编写一个Python程序，记录一名大学生一天的学习时长、睡眠时长、运动时长和消费金额，并输出一份今日生活报告。",
        presetReply:
          'name = input("请输入姓名：")\nstudy_hours = float(input("今日学习时长："))\nsleep_hours = float(input("昨晚睡眠时长："))\nexercise_minutes = int(input("今日运动时长："))\nspending = float(input("今日消费金额："))\n\nprint(f"\\n{name}的今日生活报告")\nprint(f"学习：{study_hours:.1f}小时")\nprint(f"睡眠：{sleep_hours:.1f}小时")\nprint(f"运动：{exercise_minutes}分钟")\nprint(f"消费：{spending:.2f}元")',
        admitLine:
          "对于这种基础任务，今天的强模型通常可以正确完成，而且比初学者写得更快。",
        questions: [
          "程序从哪一行开始执行？",
          "float()和int()分别有什么作用？",
          ".1f和.2f是什么意思？",
          "用户输入后，数据保存在哪里？",
          "如果增加“阅读时长”，应该修改哪几处？",
          "你是否敢把这段代码直接用于一个真实系统？",
        ],
        summary:
          "AI写出了代码，但如果我们不能解释、预测、运行、测试和修改，就只是拿到了一段代码，并没有掌握这个程序。",
      },
    },
  },
];
