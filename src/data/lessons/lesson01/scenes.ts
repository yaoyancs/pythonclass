import type { Scene } from '../../../types/scene';

export const lesson01Scenes: Scene[] = [
  {
    id: 'scene-course-intro',
    index: 1,
    title: '课程简介',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '各位步入大学后的第一门编程课',
      body: '专业必修课  ·  共 48 学时',
      schedule: [
        {
          title: '理论 32 学时',
          subtitle: '第 1 至 11 周',
          rows: [
            { time: '周二 3–5 节', place: 'JC405（1 班）' },
            { time: '周三 3–5 节', place: 'JS104（2 班）' },
          ],
        },
        {
          title: '上机 16 学时',
          subtitle: '第 1 至 18 周 · 单周',
          rows: [{ time: '周四 6–7 / 8–9 节', place: 'JS325' }],
        },
      ],
      image: {
        src: '/python-meme.png',
        alt: '人生苦短，我用 Python',
      },
    },
  },
  {
    id: 'scene-course-tools',
    index: 2,
    title: '课堂辅助工具',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      infoCards: [
        {
          title: 'QQ 群',
          items: ['通知发布', '答疑讨论'],
        },
        {
          title: 'PTA 实验平台',
          href: 'https://pintia.cn/',
          items: ['上机练习与机考都在这个平台完成'],
        },
      ],
      image: {
        src: '/qq-group.png',
        alt: '26秋 Python 程序设计 QQ 群二维码',
      },
    },
  },
  {
    id: 'scene-course-grading',
    index: 3,
    title: '如何考核',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      gradeItems: [
        {
          label: '平时成绩',
          percent: '10%',
          children: [
            { label: '课堂表现', percent: '5%' },
            { label: '平时作业', percent: '5%', note: '记 5 / 8 次' },
          ],
        },
        {
          label: '期中考试',
          percent: '20%',
          note: 'PTA 机考，闭卷，第 6～8 周',
        },
        {
          label: '上机实践',
          percent: '30%',
          children: [
            { label: '基础语法 PTA', percent: '20%' },
            { label: '综合项目', percent: '10%' },
          ],
        },
        {
          label: '期末考试',
          percent: '40%',
          note: 'PTA 机考，闭卷',
        },
      ],
    },
  },
  {
    id: 'scene-course-catalog',
    index: 4,
    title: '本讲目录',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      body: '第 1 讲 · 基础语法　共 3 课时',
      catalog: [
        { index: '01', title: 'AI 时代为什么学编程' },
        { index: '02', title: '编程语言发展历史' },
        { index: '03', title: 'Python 的发展历史' },
        { index: '04', title: 'Python 编程环境' },
        { index: '05', title: '基础语法' },
      ],
    },
  },
  {
    id: 'scene-01',
    index: 5,
    title: 'AI 时代为什么学编程',
    type: 'question',
    layout: 'fullscreen',
    content: {
      headline: '既然 AI 会写代码，我们为什么还要学 Python？',
      promptQuote: '编写一个Python程序，输入一名学生的三门成绩，计算平均分，并判断是否达到优秀。',
      question: '以前，计算机不会自主写程序，所以人必须学习编程。现在这句话已经不完全成立。AI可以根据一句自然语言要求生成一段完整代码。我们为什么还坐在这里学 Python？',
      emoji: '🤔',
    },
  },
  {
    id: 'scene-read-code',
    index: 6,
    title: 'AI 时代为什么学编程',
    type: 'question',
    layout: 'split',
    content: {

      question: '这段程序最后可能输出什么？',
      voteOptions: ['五个成绩', '平均成绩', '最高成绩', '学生姓名'],
    },
    code: {
      initial: 'scores = [78, 92, 85, 61, 95]\naverage = sum(scores) / len(scores)\nprint(average)',
      editable: false,
      resetToInitial: true,
    },
  },
  {
    id: 'scene-02',
    index: 7,
    title: 'AI 时代为什么学编程',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: 'AI 时代的学习方式',
      learningFlow: {
        lead: '编程的第一项能力不是敲代码，而是建立从代码到行为的联系。',
        steps: ['提出问题', '拆分步骤', '阅读代码', '预测结果', '运行验证', '发现并修正问题'],
        aiNote: {
          title: 'AI 可以参与每一步',
          body: '但不能替你对结果负责',
        },
        principle: {
          label: '确立全课程固定流程',
          steps: ['Read', 'Predict', 'Run', 'Explain', 'Modify'],
        },
      },
    },
  },
  {
    id: 'scene-method-verify',
    index: 8,
    title: '验证与巩固',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '验证与巩固：你真的能接住 AI 的代码吗？',
      methodVerify: {
        prompt:
          '请编写一个Python程序，记录一名大学生一天的学习时长、睡眠时长、运动时长和消费金额，并输出一份今日生活报告。',
        presetReply:
          'name = input("请输入姓名：")\nstudy_hours = float(input("今日学习时长："))\nsleep_hours = float(input("昨晚睡眠时长："))\nexercise_minutes = int(input("今日运动时长："))\nspending = float(input("今日消费金额："))\n\nprint(f"\\n{name}的今日生活报告")\nprint(f"学习：{study_hours:.1f}小时")\nprint(f"睡眠：{sleep_hours:.1f}小时")\nprint(f"运动：{exercise_minutes}分钟")\nprint(f"消费：{spending:.2f}元")',
        admitLine:
          '对于这种基础任务，今天的强模型通常可以正确完成，而且比初学者写得更快。',
        questions: [
          '程序从哪一行开始执行？',
          'float()和int()分别有什么作用？',
          '.1f和.2f是什么意思？',
          '用户输入后，数据保存在哪里？',
          '如果增加“阅读时长”，应该修改哪几处？',
          '你是否敢把这段代码直接用于一个真实系统？',
        ],
        summary:
          'AI写出了代码，但如果我们不能解释、预测、运行、测试和修改，就只是拿到了一段代码，并没有掌握这个程序。',
      },
    },
  },
  {
    id: 'scene-03',
    index: 9,
    title: '计算机真正听得懂什么',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '编程语言发展历史',
      historyDialogue: {
        task: '让计算机计算：12 + 8',
        subtitle: '计算机真正听得懂什么？',
        humanText: '请帮我计算 12 + 8',
        cpuConfused: '???',
        cpuBinary: [
          '10110000 00001100',
          '00000100 00001000',
          '11100100',
          '…',
        ],
        transformHint: 'CPU能够直接执行的是机器指令',
      },
    },
  },
  {
    id: 'scene-04',
    index: 10,
    title: '编程语言演进',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '第一代——机器语言',
      machineLang: {
        era: '1940s–1950s',
        taskNote: '任务：计算 12 + 8',
        binaryLines: ['10110000 00001100', '00000100 00001000'],
        question: '如果一个程序有 10 万条指令，人直接使用 0 和 1 编写，最容易出现什么问题？',
        painPoints: ['难写', '难读', '难找错误', '和具体机器绑定'],
        bugHint: '某一位写错了——你能一眼找出来吗？',
      },
    },
  },
  {
    id: 'scene-04b',
    index: 11,
    title: '编程语言演进',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '第二代——汇编语言',
      assemblyLang: {
        binaryLines: ['10110000 00001100', '00000100 00001000'],
        assemblyLines: ['MOV A, 12', 'ADD A, 8'],
        teacherNote:
          '人们开始用容易记忆的符号表示机器操作。这仍然接近硬件，但人终于不必直接记住大量 0 和 1。',
        assemblerLabel: '汇编器',
        translatorHint: '第一次出现「翻译程序」',
      },
    },
  },
  {
    id: 'scene-04c',
    index: 12,
    title: '编程语言演进',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '第三代——高级语言',
      highLevelCompare: {
        columns: [
          { label: '汇编', code: 'MOV A, 12\nADD A, 8' },
          { label: 'C 风格', code: 'result = 12 + 8;' },
          { label: 'Python', code: 'result = 12 + 8' },
        ],
        question: '哪种写法最接近我们描述问题和书写数学表达式的方式？',
        conclusion:
          '编程语言的发展，不只是「越来越先进」，而是不断提高人表达问题的效率和抽象层次。',
      },
    },
  },
  {
    id: 'scene-05',
    index: 13,
    title: '编程语言演进',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '从高级语言到自然语言＋AI',
      languageTimeline: {
        eras: ['机器语言', '汇编语言', 'C 等高级语言', 'Python', '自然语言＋AI'],
        axisLeft: '机器细节多',
        axisRight: '人类意图多',
        conflictQuestion: '如果提示词越来越像程序，Prompt 是不是新一代编程语言？',
        teacherHold:
          '自然语言容易表达意图，却经常含糊；程序语言表达麻烦一些，却要求精确。AI 时代真正重要的，正是把人的模糊目标转变为可验证的精确过程。',
        tableTitle: '不同语言仍有不同任务（不是谁比谁「更好」）',
        tableRows: [
          { language: 'C/C++', uses: '操作系统、嵌入式、高性能程序' },
          { language: 'Java', uses: '大型应用和企业系统' },
          { language: 'JavaScript', uses: '网页交互' },
          { language: 'SQL', uses: '查询和处理结构化数据' },
          { language: 'Python', uses: '数据分析、AI、自动化、科学计算' },
        ],
      },
    },
  },
  {
    id: 'scene-06',
    index: 14,
    title: 'Why Python',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '为什么第一门编程语言选择 Python？',
      whyPythonCompare: {
        taskLabel: '同一任务：让计算机说 Hello, world!',
        left: {
          label: 'C 语言',
          code: '#include <stdio.h>\n\nint main(void) {\n    printf("Hello, world!\\n");\n    return 0;\n}',
        },
        right: {
          label: 'Python',
          code: 'print("Hello, world!")',
        },
        hiddenLineIndexes: [0, 1, 2, 4, 5],
        explanation:
          'Python 把暂时不需要初学者关注的底层细节隐藏起来，使我们更早把注意力放到问题、数据和算法上。',
      },
    },
  },
  {
    id: 'scene-07',
    index: 15,
    title: 'Why Python',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: 'Python 与大数据专业',
      bigDataPath: {
        steps: [
          'Python 基础',
          'NumPy 数组计算',
          'Pandas 数据处理',
          'Matplotlib 数据可视化',
          '机器学习',
          'AI 与大数据应用',
        ],
        chartTitle: '校园消费（示意）',
        chartBars: [
          { label: '一食堂', value: 12840 },
          { label: '二食堂', value: 9650 },
          { label: '超市', value: 7420 },
          { label: '打印店', value: 3180 },
          { label: '快递柜', value: 4560 },
        ],
        bridgeQuote:
          '今天学的是 score = 90。以后你们会处理几十万行数据。但无论数据多少，背后仍然是在保存数据、计算数据和根据结果作出判断。',
      },
    },
  },
  {
    id: 'scene-08',
    index: 16,
    title: 'Why Python',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: 'Python 的优点与边界',
      pythonPros: {
        question: '为什么用 Python？请点选你认同的理由',
        reasons: ['容易读', '库丰富', '数据与 AI 生态成熟', '开发速度快'],
        boundary:
          'Python 并不是所有场景下运行最快的语言。选择语言看任务，而不是进行语言崇拜。',
      },
    },
  },
  {
    id: 'scene-09',
    index: 17,
    title: '三种容易混淆的东西',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '一段 Python 程序究竟怎样运行？',
      runtimeModel: {
        items: [
          { title: 'Python 语言', body: '代码应当怎样书写' },
          { title: 'Python 解释器', body: '读取并执行 Python 代码' },
          { title: 'PyCharm', body: '帮助我们编辑、运行和调试代码的工具' },
        ],
        analogies: [
          { label: 'Python 语言', value: '菜谱使用的表达规则' },
          { label: '.py 文件', value: '写好的菜谱' },
          { label: '解释器', value: '按菜谱做菜的人' },
          { label: 'PyCharm', value: '提供工具和工作台的厨房' },
        ],
        caveat: 'PyCharm 不是 Python。安装了 PyCharm，也不一定已经有可以运行代码的 Python 解释器。',
      },
    },
  },
  {
    id: 'scene-10',
    index: 18,
    title: '浏览器交互式运行',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '浏览器里的交互式 Python',
      replDemo: {
        steps: [
          { input: '1 + 2', promptPredict: '会得到什么？', output: '3', note: '表达式会被计算' },
          { input: '"1 + 2"', promptPredict: '和刚才一样吗？', output: "'1 + 2'", note: '引号里是文字，原样留下' },
          { input: 'print("Hello, Python!")', output: 'Hello, Python!' },
        ],
        suitedFor: ['快速尝试', '验证表达式', '观察结果'],
        designNote: '把讲解和可执行代码放在同一页，是非常适合初学者的设计。',
      },
    },
  },
  {
    id: 'scene-11',
    index: 19,
    title: '从文件到输出',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '从文件到输出',
      stepExec: {
        filename: 'hello.py',
        pipeline: [
          'hello.py',
          '解释器读取一行',
          '理解 print 指令',
          '执行指令',
          'Console 显示结果',
        ],
        lines: ['print("第一行")', 'print("第二行")', 'print("第三行")'],
        outputs: ['第一行', '第二行', '第三行'],
        conclusion: '默认情况下，Python 从上到下，一次执行一条语句。',
      },
    },
  },
  {
    id: 'scene-12',
    index: 20,
    title: '代码与数据',
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
    index: 21,
    title: '数字也有不同类型',
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
    index: 22,
    title: '表达式',
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
    index: 23,
    title: '最小语法规则',
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
    index: 24,
    title: '为什么需要变量',
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
    index: 25,
    title: 'score = 92 发生了什么',
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
    index: 26,
    title: '第一次预测变量的值',
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
    index: 27,
    title: '重新赋值',
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
    index: 28,
    title: '最重要的变量挑战',
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
    index: 29,
    title: '变量命名',
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
    index: 30,
    title: '输入—处理—输出',
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
    index: 31,
    title: '让程序向用户提问',
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
    index: 32,
    title: '输入的 90 是数字吗',
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
    index: 33,
    title: '转换成可计算的数字',
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
    index: 34,
    title: '组装第一个完整程序',
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
    index: 35,
    title: '让 AI 现场完成任务',
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
    index: 36,
    title: '代码写对了，你能接住吗',
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
    index: 37,
    title: '需求发生变化',
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
    index: 38,
    title: '一次回答与可重复程序',
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
    index: 39,
    title: 'AI 时代为什么还要学编程',
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
    index: 40,
    title: '第一课最终结论',
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
    index: 41,
    title: '课后作业',
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
  },
];
