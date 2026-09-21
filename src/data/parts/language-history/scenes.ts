import type { DraftScene } from "../../../types/scene";

export const scenes: DraftScene[] = [
  {
    id: "scene-03",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "为什么需要编程语言？",
      historyDialogue: {
        task: "计算：12 + 8",
        subtitle: "计算机真正听得懂什么？",
        humanText: "请帮我计算 12 + 8",
        cpuConfused: "???",
        cpuBinary: ["10110000 00001100", "00000100 00001000", "11100100", "…"],
        transformHint: "CPU能够直接执行的是机器指令",
      },
      digestPipeline: {
        sourceCode: "result = 12 + 8",
        sourceLabel: "源码",
        translatorLabel: "翻译器",
        translatorHint: "编译器 / 解释器",
        machineLines: ["10110000", "00001100", "00000100", "00001000"],
        machineLabel: "机器指令",
        cpuLabel: "CPU",
        result: "20",
        resultLabel: "结果",
        conclusion: "高级语言给人看；机器只执行指令；中间必须有翻译。",
      },
    },
  },
  {
    id: "scene-03b",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "计算机怎样执行人的指令",
      translateStack: {
        lead: "人写的是「我想做什么」，CPU 执行的是机器指令；编程语言和翻译程序连接这两端。",
        task: "计算 12 + 8",
        layers: [
          {
            label: "人",
            note: "目标",
            body: "请帮我计算 12 + 8",
          },
          {
            label: "Python",
            note: "供人编写",
            body: "result = 12 + 8",
          },
          {
            label: "汇编",
            note: "需汇编器翻译",
            body: "MOV A, 12\nADD A, 8",
          },
          {
            label: "机器指令",
            note: "CPU 直接执行 · 示意",
            body: "10110000 00001100\n00000100 00001000",
          },
          {
            label: "CPU",
            note: "取出并执行",
            body: "20",
          },
        ],
        conclusion:
          "高级语言不是 CPU 直接执行的。接下来依次看机器语言、汇编语言和高级语言。",
      },
    },
  },
  {
    id: "scene-04",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "机器语言",
      machineLang: {
        era: "1940s–1950s · 第一代",
        taskNote: "CPU 直接执行的指令",
        binaryLines: ["10110000 00001100", "00000100 00001000"],
        question:
          "如果一个程序有 10 万条指令，人直接使用 0 和 1 编写，最容易出现什么问题？",
        painPoints: ["难写", "难读", "难找错误", "和具体机器绑定"],
        bugHint: "某一位写错了——你能一眼找出来吗？",
      },
    },
  },
  {
    id: "scene-04b",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "汇编语言",
      assemblyLang: {
        binaryLines: ["10110000 00001100", "00000100 00001000"],
        assemblyLines: ["MOV A, 12", "ADD A, 8"],
        teacherNote:
          "还是同一层指令，只是换成好记的符号。第一次出现翻译程序：汇编器。",
        assemblerLabel: "汇编器",
        translatorHint: "第一次出现「翻译程序」",
      },
    },
  },
  {
    id: "scene-04c",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "高级语言",
      highLevelCompare: {
        columns: [
          { label: "汇编", code: "MOV A, 12\nADD A, 8" },
          { label: "C 风格", code: "result = 12 + 8;" },
          { label: "Python", code: "result = 12 + 8" },
        ],
        question: "哪种写法最接近我们描述问题和书写数学表达式的方式？",
        conclusion:
          "高级语言让人用变量和表达式描述问题，离硬件更远。要运行，仍须翻译成机器指令。",
      },
    },
  },
  {
    id: "scene-04d",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "高级语言有很多种",
      tiobeRank: {
        lead: "TIOBE 指数按工程师数量、课程与厂商等信号估算流行度，每月更新——它不回答「哪种语言最好」。",
        sourceLabel: "TIOBE Index · 2026 年 9 月",
        rows: [
          { rank: 1, language: "Python", rating: 17.76 },
          { rank: 2, language: "C", rating: 10.28 },
          { rank: 3, language: "C++", rating: 8.67 },
          { rank: 4, language: "Java", rating: 7.54 },
          { rank: 5, language: "C#", rating: 4.22 },
          { rank: 6, language: "JavaScript", rating: 2.76 },
          { rank: 7, language: "Visual Basic", rating: 2.55 },
          { rank: 8, language: "SQL", rating: 2.16 },
          { rank: 9, language: "R", rating: 1.69 },
          { rank: 10, language: "Rust", rating: 1.34 },
        ],
        href: "https://www.tiobe.com/tiobe-index/",
      },
    },
  },
  {
    id: "scene-05",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "自然语言能代替编程语言吗？",
      languageTimeline: {
        eras: [
          "机器语言",
          "汇编语言",
          "高级语言",
          "自然语言编程",
        ],
        axisLeft: "关注机器如何执行",
        axisRight: "关注人想实现什么",
        conflictQuestion:
          "当我们只需要描述目标，AI就能生成代码时，Prompt会成为新的编程入口吗？",
        teacherHold:
          "Vibe Coding 用自然语言描述目标，由 AI 生成代码。它没有取消编程语言：生成的通常仍是 Python 等正式代码，还要经过翻译才能被 CPU 执行。人要负责把模糊想法变成明确需求，并验证结果。",
        tableTitle: "不同语言各有用途，Vibe Coding 改变的是代码怎么写出来",
        tableRows: [
          { language: "C/C++", uses: "操作系统、嵌入式、高性能程序" },
          { language: "Java", uses: "大型应用和企业系统" },
          { language: "JavaScript", uses: "网页交互" },
          { language: "SQL", uses: "查询和处理结构化数据" },
          { language: "Python", uses: "数据分析、AI、自动化、科学计算" },
        ],
      },
    },
  },
];
