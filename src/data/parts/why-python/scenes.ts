import type { DraftScene } from "../../../types/scene";

export const scenes: DraftScene[] = [
  {
    id: "scene-06",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "为什么第一门编程语言选择 Python？",
      whyPythonCompare: {
        taskLabel: "同一任务：让计算机说 Hello, world!",
        left: {
          label: "C 语言",
          code: '#include <stdio.h>\n\nint main(void) {\n    printf("Hello, world!\\n");\n    return 0;\n}',
        },
        right: {
          label: "Python",
          code: 'print("Hello, world!")',
        },
        hiddenLineIndexes: [0, 1, 2, 4, 5],
        explanation:
          "Python 把暂时不需要初学者关注的底层细节隐藏起来，使我们更早把注意力放到问题、数据和算法上。",
      },
    },
  },
  {
    id: "scene-07",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "Python 与大数据专业",
      bigDataPath: {
        steps: [
          "Python 基础",
          "NumPy 数组计算",
          "Pandas 数据处理",
          "Matplotlib 数据可视化",
          "机器学习",
          "AI 与大数据应用",
        ],
        chartTitle: "校园消费（示意）",
        chartBars: [
          { label: "一食堂", value: 12840 },
          { label: "二食堂", value: 9650 },
          { label: "超市", value: 7420 },
          { label: "打印店", value: 3180 },
          { label: "快递柜", value: 4560 },
        ],
        bridgeQuote:
          "今天学的是 score = 90。以后你们会处理几十万行数据。但无论数据多少，背后仍然是在保存数据、计算数据和根据结果作出判断。",
      },
    },
  },
];
