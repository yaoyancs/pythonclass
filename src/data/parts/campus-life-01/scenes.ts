import type { DraftScene } from "../../../types/scene";

/** 飞花令：先做成个人诗卡，再升级为开场界面。不在本讲做判断。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-cl-43",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "打印诗卡",
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
      headline: "思考",
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

  
];
