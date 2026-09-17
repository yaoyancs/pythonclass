import type { DraftScene } from '../../types/scene';

export const scenes: DraftScene[] = [
{
    id: 'scene-12',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '代码与数据不是一回事',
      typedDemo: {
        lead: '请在纸上写出四行输出——先别运行。',
        lines: [
          { code: 'print(10)' },
          { code: 'print(10 + 20)' },
          { code: 'print("10 + 20")' },
          { code: 'print("Hello" + "Python")' },
        ],
        predict: {
          question: '四行输出分别是？',
          codes: ['print(10)', 'print(10 + 20)', 'print("10 + 20")', 'print("Hello" + "Python")'],
          answers: ['10', '30', '10 + 20', 'HelloPython'],
        },
        takeaway: 'print() 负责输出；数字可计算；引号中的内容按文字处理。',
      },
    },
  },
{
    id: 'scene-13',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '数字也有不同类型',
      typedDemo: {
        lines: [
          {
            code: 'print(10)',
            tokens: [
              { text: 'print(', tone: 'plain' },
              { text: '10', tone: 'int' },
              { text: ')', tone: 'plain' },
            ],
          },
          {
            code: 'print(10.0)',
            tokens: [
              { text: 'print(', tone: 'plain' },
              { text: '10.0', tone: 'float' },
              { text: ')', tone: 'plain' },
            ],
          },
          {
            code: 'print(type(10))',
            tokens: [
              { text: 'print(type(', tone: 'plain' },
              { text: '10', tone: 'int' },
              { text: '))', tone: 'plain' },
            ],
          },
          {
            code: 'print(type(10.0))',
            tokens: [
              { text: 'print(type(', tone: 'plain' },
              { text: '10.0', tone: 'float' },
              { text: '))', tone: 'plain' },
            ],
          },
        ],
        predict: {
          question: '再预测这两行：',
          codes: ['print(10 + 5)', 'print("10" + "5")'],
          answers: ['15', '105'],
        },
        takeaway:
          '同样看起来像 10，在程序里可能是不同种类的数据；数据类型影响它能进行什么操作。',
      },
    },
  },
{
    id: 'scene-14',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '表达式',
      exprOrder: {
        expression: '2 + 3 * 4',
        studentPredict: '结果是多少？',
        steps: [
          { label: '先算乘法', focus: '2 + 3 × 4   →   2 + 12' },
          { label: '再算加法', focus: '2 + 12   →   14' },
        ],
        altExpression: '(2 + 3) * 4',
        altResult: '20',
        conclusion:
          '表达式是能够计算出一个值的代码。括号不仅影响数学结果，也是在明确地表达我们的意图。',
      },
    },
  },
{
    id: 'scene-15',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '最小语法规则',
      syntaxRules: {
        rules: [
          '英文符号',
          '成对的引号',
          '成对的括号',
          '一条语句完成一个明确动作',
          'Python 区分大小写',
          '错误信息是线索，不是惩罚',
        ],
        brokenCode: 'print("Hello)',
        fixSteps: ['看最后一行错误', '看箭头或行号', '回到对应代码检查符号'],
      },
    },
  },
{
    id: 'scene-16',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '变量——程序怎样记住和改变数据',
      whyNeedVar: {
        bareCode: 'print((92 + 85 + 88) / 3)',
        questions: [
          '这段程序在做什么？',
          '92、85、88 分别是哪一门课的成绩？',
          '如果数学成绩从 85 改成 89，应该改哪个数字？同一成绩用十次呢？',
        ],
        teacherLines: [
          '这段程序能运行，计算也正确，但它有一个问题：数字没有名字。',
          '计算机知道这里有三个数字，人却不知道每个数字代表什么。',
          '我们需要给数据起名字。',
        ],
        numbers: [
          { value: '92', label: 'Python成绩' },
          { value: '85', label: '数学成绩' },
          { value: '88', label: '英语成绩' },
        ],
        namedCode: 'python_score = 92\nmath_score = 85\nenglish_score = 88\n\naverage = (python_score + math_score + english_score) / 3\nprint(average)',
        summary: '变量最直接的作用，是给程序中的数据起一个有意义的名字。',
      },
    },
  },
{
    id: 'scene-17',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: 'score = 92 究竟发生了什么',
      question: '这一行是在说「score 等于 92」吗？',
      varModel: {
        mode: 'label',
        codeLines: ['score = 92'],
        boardNote: '赋值',
        teacherLine: 'Python 执行赋值时，先得到右边的值 92，再让左边的名字 score 指向这个值。',
        conclusion: '变量可以先理解为程序给数据起的名字。程序中的 = 主要表示赋值，不是数学里的「左右永远相等」。',
      },
    },
  },
{
    id: 'scene-18',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '第一次预测变量的值',
      varPredict: {
        code: 'score = 92\nprint(score)',
        question: '输出的是单词 score，还是数字 92？',
        revealOutputs: ['92'],
        compareCode: 'print(score)\nprint("score")',
        compareOutputs: ['92', 'score'],
        takeaway: [
          'score → 变量名，找到它当前对应的值',
          '"score" → 字符串，就是文字 score',
        ],
      },
    },
  },
{
    id: 'scene-19',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '重新赋值：变量为什么叫「变」量',
      question: '最后输出 92 还是 95？请说出理由。',
      varModel: {
        mode: 'rebind',
        codeLines: ['score = 92', 'score = 95', 'print(score)'],
        teacherLine: '第二次赋值不是让 92 变成 95，而是让名字 score 改为指向新的值 95。',
        conclusion: '程序运行的过程，就是数据状态不断变化的过程。',
      },
    },
  },
{
    id: 'scene-20',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '最重要的变量挑战',
      question: '数学里 score = score + 5 好像不成立。Python 为什么允许？',
      varModel: {
        mode: 'update',
        codeLines: ['score = 90', 'score = score + 5', 'print(score)'],
        teacherLine: '左边的 score 表示要更新谁；右边的 score 表示取出它当前的值。',
        conclusion: '这不是数学等式，而是执行指令：取出旧值，加 5，再保存为新值。',
        humanTranslation: '把 score 当前的值增加 5。',
      },
    },
  },
{
    id: 'scene-21',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '变量命名：代码首先写给人读',
      codeComparison: {
        left: {
          label: '难读',
          code: 'a = 92\nb = 85\nc = 88\nd = (a + b + c) / 3',
        },
        right: {
          label: '表意',
          code: 'python_score = 92\nmath_score = 85\nenglish_score = 88\n\naverage_score = (\n    python_score\n    + math_score\n    + english_score\n) / 3',
        },
      },
      bulletPoints: [
        '名字要表达数据的含义',
        '不能以数字开头',
        '名字中不能有空格',
        '多个单词推荐使用下划线连接',
      ],
      body: '例如：student_name = "张明"，average_score = 86.5。接下来，让程序真正向用户提问。',
    },
  },
{
    id: 'scene-22',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '所有程序都有共同结构',
      ipo: {
        task: '课堂任务：输入学生姓名和三门成绩，计算并输出平均分。先用自然语言拆解。',
        englishFlow: ['Input', 'Process', 'Output'],
        modules: [
          { title: '输入数据', prompt: '数据从哪里来？', answer: '姓名、三门成绩（用户输入）' },
          { title: '处理数据', prompt: '程序对数据做了什么？', answer: '三门成绩相加后除以 3' },
          { title: '输出结果', prompt: '结果到哪里去？', answer: '姓名和平均成绩显示在屏幕上' },
        ],
      },
    },
  },
{
    id: 'scene-23',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '让程序向用户提问',
      inputFlow: {
        mode: 'input',
        code: 'name = input("请输入学生姓名：")\nprint(name)',
        steps: [
          '程序执行到 input()',
          '程序暂停，等待用户输入',
          '用户输入「张明」',
          'name ─────→ "张明"',
          '程序继续向下执行',
        ],
        teacherLine: 'input() 不是直接替我们准备数据，而是让程序在运行过程中接收用户输入。',
      },
    },
  },
{
    id: 'scene-24',
    type: 'run',
    layout: 'split',
    content: {
      headline: '输入的「90」真的是数字吗',
      body: '运行后输入 90，观察 type(score)。',
      inputFlow: {
        mode: 'input',
        code: 'score = input("请输入成绩：")\nprint(score)\nprint(type(score))',
        steps: [
          '键盘输入进入程序',
          'Python 默认把它当作一串文字',
          '看起来像数字 ≠ 已经是数值',
        ],
        teacherLine: '键盘输入进入程序时，Python 默认把它当作一串文字。',
        typeContrast: [
          { label: '90', kind: '整数' },
          { label: '90.0', kind: '小数' },
          { label: '"90"', kind: '字符串' },
        ],
      },
    },
    code: {
      initial: 'score = input("请输入成绩：")\nprint(score)\nprint(type(score))',
      editable: false,
      resetToInitial: true,
    },
  },
{
    id: 'scene-25',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '把输入转换成可以计算的数字',
      inputFlow: {
        mode: 'float',
        code: 'score = float(input("请输入成绩："))',
        steps: [
          '用户输入 "90"',
          'input() 得到字符串 "90"',
          'float("90")',
          '得到数值 90.0',
          'score ─────→ 90.0',
        ],
        teacherLine: '这一行要从里面向外读：先 input()，再用 float() 转换，最后赋值给 score。',
      },
    },
  },
{
    id: 'scene-26',
    type: 'run',
    layout: 'split',
    content: {
      headline: '组装第一个完整程序',
      body: '先不运行。假设输入：张明 / 90 / 80 / 70。回答：暂停几次？name 类型？score1 文字还是数值？average？最后输出？',
      questionCascade: {
        title: '不运行，先回答',
        questions: [
          '程序一共暂停等待输入几次？',
          'name 中保存的是什么类型的数据？',
          'score1 中保存的是文字还是数值？',
          'average 的值是多少？',
          '最后一行会输出什么？',
        ],
        conclusionLines: [
          '输入 → name / score1 / score2 / score3',
          '处理 → average = (...)',
          '输出 → print(...)',
        ],
        footer: '验证输出：张明 的平均成绩是： 80.0',
      },
    },
    code: {
      initial: 'name = input("请输入学生姓名：")\n\nscore1 = float(input("请输入第一门成绩："))\nscore2 = float(input("请输入第二门成绩："))\nscore3 = float(input("请输入第三门成绩："))\n\naverage = (score1 + score2 + score3) / 3\n\nprint(name, "的平均成绩是：", average)',
      editable: true,
      resetToInitial: true,
    },
  },
{
    id: 'scene-27',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: 'AI 代码接管挑战',
      aiLiveCode: {
        prompt: '请编写一个 Python 程序，输入一名学生的姓名和三门成绩，计算平均分，并将结果保留两位小数。',
        presetReply: 'name = input("请输入学生姓名：")\nscore1 = float(input("请输入第一门成绩："))\nscore2 = float(input("请输入第二门成绩："))\nscore3 = float(input("请输入第三门成绩："))\n\naverage = (score1 + score2 + score3) / 3\n\nprint(f"{name}的平均成绩是：{average:.2f}")',
        admitLine: '这段代码是正确的。对于这样的基础任务，现在的 AI 通常可以又快又准确地完成。',
        challengeQuestion: '那么，我们是不是可以不用学习 Python 了？',
      },
    },
  },
{
    id: 'scene-28',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: 'AI 代码接管挑战：不运行，先回答',
      questionCascade: {
        questions: [
          '程序从哪一行开始执行？',
          '程序一共调用了几次 input()？',
          '为什么成绩前面需要 float()？',
          'average 中保存了什么？',
          '输入 90、81、70，结果大约是多少？',
          '.2f 可能有什么作用？',
          '如果要改成两门成绩，应该修改哪些地方？',
        ],
        conclusionLines: [
          'AI 写出来 ≠ 我学会了',
          '程序能运行 ≠ 我能解释',
          '结果看起来合理 ≠ 已经得到验证',
        ],
        footer: 'AI 完成了代码生成；答不出这些问题，就只是拥有代码，还没有掌握程序。',
      },
    },
  },
{
    id: 'scene-29',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '需求发生变化',
      codeChoice: {
        prompt: '权重改为 20%、30%、50%。应选哪一段？',
        oldCode: 'average = (score1 + score2 + score3) / 3',
        options: [
          { id: 'A', code: 'average = score1 + score2 + score3 / 3' },
          { id: 'B', code: 'average = (score1 + score2 + score3) / 3' },
          {
            id: 'C',
            code: 'average = (\n    score1 * 0.2\n    + score2 * 0.3\n    + score3 * 0.5\n)',
            correct: true,
          },
          { id: 'D', code: 'average = (score1 + score2 + score3) * 0.5' },
        ],
        followUps: [
          '人需要说明新规则',
          '人需要检查权重之和',
          '人需要判断程序改了哪一部分',
          '人需要准备数据验证结果',
          '人需要确定真实需求是否还有其他条件',
        ],
        conclusion: 'AI 擅长快速生成实现方案，人必须负责定义问题、明确规则和验证结果。',
      },
    },
  },
{
    id: 'scene-30',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '一次回答与可重复程序的区别',
      onceVsProgram: {
        aiAsk: '90、81、70 的平均分是多少？',
        aiAnswer: '80.33',
        programCode: 'score1 = float(input(...))\nscore2 = float(input(...))\nscore3 = float(input(...))\naverage = (score1 + score2 + score3) / 3',
        teacherLines: [
          '向 AI 问一次，我们得到一个答案。',
          '编写一个程序，我们建立了一个能够反复解决同类问题的过程。',
          '对于大数据专业，我们最终需要的往往不是计算一组数据，而是让同一套规则处理成千上万条数据。',
        ],
      },
    },
  },
{
    id: 'scene-31',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '课堂收束——AI 时代为什么还要学习编程',
      whyLearnWrap: {
        reopenQuestion: 'AI 已经会写 Python，我们为什么还要学习编程？',
        keywords: ['读懂', '修改', '验证', '规则', '数据', '控制', '责任'],
        layers: [
          { title: '第一层', body: '为了看懂、运行和修改 AI 生成的代码。' },
          { title: '第二层', body: '为了把模糊的想法转化为计算机可以准确执行的步骤。' },
          { title: '第三层', body: '为了定义问题、设计过程、验证结果，并对计算系统保持控制。' },
        ],
        flow: ['人的想法', '明确的数据和规则', '可执行的程序', '可观察的结果', '验证与改进'],
        aiNote: 'AI 可协助每一步，但不能替代人确定目标和承担责任。',
      },
    },
  },
{
    id: 'scene-32',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '第一课最终结论',
      finalVerdict: {
        lines: [
          '编程不是和 AI 比赛敲代码。',
          '编程是把想法变成可执行、可验证、可重复的系统。',
          '我们学习 Python，不是因为 AI 不会编程，而是因为我们不能把问题定义、判断和控制权一起交给 AI。',
        ],
        abilities: [
          '解释 Python 代码如何被执行',
          '预测简单程序的输出',
          '区分数字、字符串和表达式',
          '解释变量和赋值',
          '使用 input() 接收数据',
          '完成输入—处理—输出程序',
          '阅读并接管 AI 生成的代码',
          '根据需求变化修改程序规则',
        ],
        teaserCode: 'age = input("请输入年龄：")\nnext_year = age + 1\n\nprint("明年你", next_year, "岁")',
        teaserQuestion: '这段程序看起来很合理，为什么运行时可能出错？',
        teaserClose: '下一课：程序中的数据究竟有哪些类型，以及 Python 为什么如此在意数据类型。',
      },
    },
  },
{
    id: 'scene-33',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '课后作业',
      body: '第一次课后作业',
      bulletPoints: [
        '在个人笔记本电脑上搭建 Python 编程环境',
        '完成 PTA 中的编程练习',
      ],
    },
  }
];
