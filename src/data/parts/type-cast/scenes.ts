import type { DraftScene } from "../../../types/scene";

/** 本 part：收束下一轮冲突；int/float/str 转换；失败案例。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-tc-01",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "input() 永远先给你字符串",
      inputFlow: {
        mode: "input",
        code: 'round_no = input("现在是第几轮：")\nprint(round_no)\nprint(type(round_no))',
        steps: [
          "用户键入 2",
          'input() 得到的是字符串 "2"',
          "round_no 指向的是文字，不是整数 2",
        ],
        teacherLine: "回扣开场：问题不是加法本身，而是 round_no 的类型不对。上讲年龄程序同理。",
        typeContrast: [
          { label: "2", kind: "整数 int" },
          { label: "2.0", kind: "浮点 float" },
          { label: '"2"', kind: "字符串 str" },
        ],
      },
    },
  },
  {
    id: "scene-tc-02",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "三种常用转换",
      body: "把一种类型的值，变成另一种类型的值。",
      codeComparison: {
        left: {
          label: "转成可计算的数",
          code: 'int("2")    # → 2\nfloat("85.5") # → 85.5',
        },
        right: {
          label: "转成文字",
          code: 'str(2)      # → "2"\nstr(85.5)   # → "85.5"',
        },
      },
      bulletPoints: [
        "要加减乘除 → 先 int() 或 float()",
        "要和文字拼接 → 常先 str()，或用 f-string",
        "int 丢弃小数部分；需要小数用 float",
      ],
    },
  },
  {
    id: "scene-tc-03",
    type: "run",
    layout: "split",
    content: {
      headline: "修好「下一轮」",
      body: "先转换，再加 1。输入 2，应得到下一轮第 3 轮。",
      question: "为什么必须写 int(round_no) 或 int(input(...))？",
    },
    code: {
      initial:
        'round_no = int(input("现在是第几轮："))\nnext_round = round_no + 1\nprint("下一轮是第", next_round, "轮")',
      editable: true,
      resetToInitial: true,
    },
    expectedOutput: "下一轮是第 3 轮",
  },
  {
    id: "scene-tc-04",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "转换失败长什么样",
      syntaxRules: {
        rules: [
          "只能转换「看起来合法」的文字",
          'int("2") 可以；int("第二轮") 不行',
          'float("85.5") 可以；float("八十五") 不行',
          "报错类型名是线索：ValueError 常与转换失败有关",
        ],
        brokenCode: 'round_no = int("第二轮")',
        fixSteps: [
          "看错误类型：ValueError 表示值不合法",
          "检查传入 int()/float() 的字符串内容",
          "提醒用户输入纯数字，或先清洗再转换",
        ],
      },
    },
  },
  {
    id: "scene-tc-05",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "转换清单（课堂口诀）",
      bulletPoints: [
        "要算 → 先转成 int 或 float",
        "要展示拼接 → 常保持 str，或 str(数值)，或 f-string",
        "input() 之后立刻想：接下来要算还是只显示？",
        "不确定就 print(type(变量)) 查证",
      ],
      preview: "下一节：比较运算会得到 True / False —— 布尔类型",
    },
  },
];
