import type { DraftScene } from "../../../types/scene";

/** if、else、缩进、赋值和比较。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-waste-04",
    type: "run",
    layout: "split",
    content: {
      headline: "条件为假时，未缩进语句是否执行？",
      bulletPoints: ["先以「香蕉皮」运行。", "再将 item 改为「易拉罐」。"],
    },
    code: {
      initial:
        'item = "香蕉皮"\nif item == "香蕉皮":\n    print("厨余垃圾")\nprint("分类检查结束")',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-waste-05",
    type: "predict",
    layout: "split",
    content: {
      headline: "缩进不同，输出是否相同？",
      bulletPoints: ["item 为「易拉罐」。对照左右两段。"],
      codeComparison: {
        left: {
          label: "两句同级缩进",
          code: 'if item == "香蕉皮":\n    print("厨余垃圾")\n    print("分类完成")',
        },
        right: {
          label: "第二句无缩进",
          code: 'if item == "香蕉皮":\n    print("厨余垃圾")\nprint("分类完成")',
        },
      },
    },
    code: {
      initial:
        'item = "易拉罐"\nif item == "香蕉皮":\n    print("厨余垃圾")\nprint("分类完成")',
      editable: true,
      resetToInitial: true,
    },
    prediction: {
      question: "右侧程序是否打印「分类完成」？",
      options: [
        { id: "yes", label: "打印", isCorrect: true },
        { id: "no", label: "不打印" },
      ],
    },
    reveal: {
      body: "无缩进的语句不在该代码块内。",
    },
  },
  {
    id: "scene-waste-06",
    type: "debug",
    layout: "split",
    content: {
      headline: "该程序能否通过语法检查？",
      bulletPoints: ["先预测，再运行。", "根据报错修改后再次运行。"],
    },
    code: {
      initial: 'item = "香蕉皮"\nif item = "香蕉皮"\n    print("厨余垃圾")',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-waste-07",
    type: "run",
    layout: "split",
    content: {
      headline: "else 能否直接判定为其他垃圾？",
      bulletPoints: ["输入易拉罐，观察输出。"],
    },
    code: {
      initial:
        'item = input("请输入垃圾名称：")\nif item == "香蕉皮":\n    print("厨余垃圾")\nelse:\n    print("暂未识别该物品")',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-waste-08",
    type: "predict",
    layout: "split",
    content: {
      headline: "多个独立 if 是否都会执行？",
      bulletPoints: ["预测输出行数，再运行。"],
    },
    code: {
      initial:
        'item = "塑料瓶"\nif "瓶" in item:\n    print("瓶类物品")\nif "塑料" in item:\n    print("塑料制品")',
      editable: true,
      resetToInitial: true,
    },
    prediction: {
      question: "输出为几行？",
      options: [
        { id: "one", label: "一行" },
        { id: "two", label: "两行", isCorrect: true },
      ],
    },
    reveal: {
      body: "各 if 单独判断。前一个成立，不跳过后一个。",
    },
  },
];
