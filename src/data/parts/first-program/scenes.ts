import type { DraftScene } from "../../../types/scene";

/** 本 part：记住数据 → 接收输入 → 完成第一个 IPO 程序。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-fp-16",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "变量——程序怎样记住和改变数据",
      whyNeedVar: {
        bareCode: "print((92 + 85 + 88) / 3)",
        questions: [
          "这段程序在做什么？",
          "92、85、88 分别是哪一门课的成绩？",
          "如果数学成绩从 85 改成 89，应该改哪个数字？同一成绩用十次呢？",
        ],
        teacherLines: [
          "这段程序能运行，计算也正确，但它有一个问题：数字没有名字。",
          "计算机知道这里有三个数字，人却不知道每个数字代表什么。",
          "我们需要给数据起名字。",
        ],
        numbers: [
          { value: "92", label: "Python成绩" },
          { value: "85", label: "数学成绩" },
          { value: "88", label: "英语成绩" },
        ],
        namedCode:
          "python_score = 92\nmath_score = 85\nenglish_score = 88\n\naverage = (python_score + math_score + english_score) / 3\nprint(average)",
        summary: "变量最直接的作用，是给程序中的数据起一个有意义的名字。",
      },
    },
  },
  {
    id: "scene-fp-17",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "score = 92 究竟发生了什么",
      question: "这一行是在说「score 等于 92」吗？",
      varModel: {
        mode: "label",
        codeLines: ["score = 92"],
        boardNote: "赋值",
        teacherLine:
          "Python 执行赋值时，先得到右边的值 92，再让左边的名字 score 指向这个值。",
        conclusion:
          "变量可以先理解为程序给数据起的名字。程序中的 = 主要表示赋值，不是数学里的「左右永远相等」。",
      },
    },
  },
  {
    id: "scene-fp-18",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "第一次预测变量的值",
      varPredict: {
        code: "score = 92\nprint(score)",
        question: "输出的是单词 score，还是数字 92？",
        revealOutputs: ["92"],
        compareCode: 'print(score)\nprint("score")',
        compareOutputs: ["92", "score"],
        takeaway: [
          "score → 变量名，找到它当前对应的值",
          '"score" → 字符串，就是文字 score',
        ],
      },
    },
  },
  {
    id: "scene-fp-19",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "重新赋值：变量为什么叫「变」量",
      question: "最后输出 92 还是 95？请说出理由。",
      varModel: {
        mode: "rebind",
        codeLines: ["score = 92", "score = 95", "print(score)"],
        teacherLine:
          "第二次赋值不是让 92 变成 95，而是让名字 score 改为指向新的值 95。",
        conclusion: "程序运行的过程，就是数据状态不断变化的过程。",
      },
    },
  },
  {
    id: "scene-fp-20",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "最重要的变量挑战",
      question: "数学里 score = score + 5 好像不成立。Python 为什么允许？",
      varModel: {
        mode: "update",
        codeLines: ["score = 90", "score = score + 5", "print(score)"],
        teacherLine:
          "左边的 score 表示要更新谁；右边的 score 表示取出它当前的值。",
        conclusion:
          "这不是数学等式，而是执行指令：取出旧值，加 5，再保存为新值。",
        humanTranslation: "把 score 当前的值增加 5。",
      },
    },
  },
  {
    id: "scene-fp-21",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "变量命名：代码首先写给人读",
      codeComparison: {
        left: {
          label: "难读",
          code: "a = 92\nb = 85\nc = 88\nd = (a + b + c) / 3",
        },
        right: {
          label: "表意",
          code: "python_score = 92\nmath_score = 85\nenglish_score = 88\n\naverage_score = (\n    python_score\n    + math_score\n    + english_score\n) / 3",
        },
      },
      bulletPoints: [
        "名字要表达含义；不能以数字开头、不能有空格",
        "多个单词推荐用下划线：student_name、average_score",
      ],
      body: "接下来，让程序真正向用户提问。",
    },
  },
  {
    id: "scene-fp-22",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "所有程序都有共同结构",
      ipo: {
        task: "课堂任务：输入学生姓名和三门成绩，计算并输出平均分。先用自然语言拆解。",
        englishFlow: ["Input", "Process", "Output"],
        modules: [
          {
            title: "输入数据",
            prompt: "数据从哪里来？",
            answer: "姓名、三门成绩（用户输入）",
          },
          {
            title: "处理数据",
            prompt: "程序对数据做了什么？",
            answer: "三门成绩相加后除以 3",
          },
          {
            title: "输出结果",
            prompt: "结果到哪里去？",
            answer: "姓名和平均成绩显示在屏幕上",
          },
        ],
      },
    },
  },
  {
    id: "scene-fp-23",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "让程序向用户提问",
      inputFlow: {
        mode: "input",
        code: 'name = input("请输入学生姓名：")\nprint(name)',
        steps: [
          "程序执行到 input()",
          "程序暂停，等待用户输入",
          "用户输入「张明」",
          'name ─────→ "张明"',
          "程序继续向下执行",
        ],
        teacherLine:
          "input() 不是直接替我们准备数据，而是让程序在运行过程中接收用户输入。",
      },
    },
  },
  {
    id: "scene-fp-24",
    type: "run",
    layout: "split",
    content: {
      headline: "输入的「90」真的是数字吗",
      body: "运行后输入 90，观察输出——看起来像数字，程序里却是文字。",
      inputFlow: {
        mode: "input",
        code: 'score = input("请输入成绩：")\nprint(score)\nprint(type(score))',
        steps: [
          "键盘输入进入程序",
          "Python 默认把它当作一串文字",
          "看起来像数字 ≠ 已经是数值",
        ],
        teacherLine: "键盘输入进入程序时，Python 默认把它当作一串文字。",
        typeContrast: [
          { label: "90", kind: "整数" },
          { label: "90.0", kind: "小数" },
          { label: '"90"', kind: "字符串" },
        ],
      },
    },
    code: {
      initial:
        'score = input("请输入成绩：")\nprint(score)\nprint(type(score))',
      editable: false,
      resetToInitial: true,
    },
  },
  {
    id: "scene-fp-25",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "把输入转换成可以计算的数字",
      inputFlow: {
        mode: "float",
        code: 'score = float(input("请输入成绩："))',
        steps: [
          '用户输入 "90"',
          'input() 得到字符串 "90"',
          'float("90")',
          "得到数值 90.0",
          "score ─────→ 90.0",
        ],
        teacherLine:
          "这一行要从里面向外读：先 input()，再用 float() 转换，最后赋值给 score。计算前先变成数值即可；类型细节下一课再展开。",
      },
    },
  },
  {
    id: "scene-fp-26",
    type: "run",
    layout: "split",
    content: {
      headline: "组装第一个完整程序",
      body: "先不运行。假设输入：张明 / 90 / 80 / 70。回答：暂停几次？name 保存的是文字吗？score1 文字还是数值？average？最后输出？",
      questionCascade: {
        title: "不运行，先回答",
        questions: [
          "程序一共暂停等待输入几次？",
          "name 中保存的是文字还是数值？",
          "score1 中保存的是文字还是数值？",
          "average 的值是多少？",
          "最后一行会输出什么？",
        ],
        conclusionLines: [
          "输入 → name / score1 / score2 / score3",
          "处理 → average = (...)",
          "输出 → print(...)",
        ],
        footer: "验证输出：张明 的平均成绩是： 80.0",
      },
    },
    code: {
      initial:
        'name = input("请输入学生姓名：")\n\nscore1 = float(input("请输入第一门成绩："))\nscore2 = float(input("请输入第二门成绩："))\nscore3 = float(input("请输入第三门成绩："))\n\naverage = (score1 + score2 + score3) / 3\n\nprint(name, "的平均成绩是：", average)',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-fp-29",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "需求发生变化",
      codeChoice: {
        prompt: "权重改为 20%、30%、50%。应选哪一段？",
        oldCode: "average = (score1 + score2 + score3) / 3",
        options: [
          { id: "A", code: "average = score1 + score2 + score3 / 3" },
          { id: "B", code: "average = (score1 + score2 + score3) / 3" },
          {
            id: "C",
            code: "average = (\n    score1 * 0.2\n    + score2 * 0.3\n    + score3 * 0.5\n)",
            correct: true,
          },
          { id: "D", code: "average = (score1 + score2 + score3) * 0.5" },
        ],
        followUps: [
          "人需要说明新规则",
          "人需要检查权重之和",
          "人需要判断程序改了哪一部分",
          "人需要准备数据验证结果",
        ],
        conclusion:
          "AI 可以很快写出实现；改需求时，仍要由人定义规则并验证结果。",
      },
    },
  },
];
