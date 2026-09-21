import type { DraftScene } from "../../../types/scene";

/** 飞花令：先做成个人诗卡，再升级为开场界面。不在本讲做判断。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-cl-43",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "我的第一张诗卡",
      body: "输入名字，输出自己的诗卡。",
      bulletPoints: [
        "姓名现场输入",
        "打印一句诗和作者",
      ],
    },
  },
  {
    id: "scene-cl-44",
    type: "run",
    layout: "split",
    content: {
      headline: "跑出诗卡",
      body: 'print 里的 sep="" 表示两个内容之间不加空格。',
      question: '为什么 player 不加引号，而 "的诗卡" 要加引号？',
    },
    code: {
      initial:
        'player = input("请输入你的名字：")\n\nprint(player, "的诗卡", sep="")\nprint("春眠不觉晓")\nprint("—— 孟浩然")',
      editable: true,
      resetToInitial: true,
    },
    expectedOutput: "李华的诗卡\n春眠不觉晓\n—— 孟浩然",
  },
  {
    id: "scene-cl-45",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "飞花令开场",
      body: "输入玩家和本轮指定字，显示示例诗句。现在还不能判断这句能不能接。",
      bulletPoints: [
        "名字、指定字、诗句、作者各用一个变量",
        "指定字改成「月」，再运行一次",
      ],
    },
  },
  {
    id: "scene-cl-46",
    type: "run",
    layout: "split",
    content: {
      headline: "从诗卡到开场",
      question: "指定字改成「月」再运行，哪一行会变？诗句会不会自动换成含「月」的句子？",
    },
    code: {
      initial:
        'player = input("请输入你的名字：")\nkeyword = input("请输入本轮指定字：")\n\npoem_line = "春眠不觉晓"\nauthor = "孟浩然"\n\nprint()\nprint(player, "的飞花令诗卡", sep="")\nprint("本轮指定字：", keyword)\nprint("我的诗句：", poem_line)\nprint("——", author)',
      editable: true,
      resetToInitial: true,
    },
    expectedOutput:
      "李华的飞花令诗卡\n本轮指定字： 春\n我的诗句： 春眠不觉晓\n—— 孟浩然",
  },
];
