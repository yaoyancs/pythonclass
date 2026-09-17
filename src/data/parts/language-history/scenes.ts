import type { DraftScene } from '../../types/scene';

export const scenes: DraftScene[] = [
{
    id: 'scene-03',
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
  }
];
