import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 课堂练习、要点、课后作业。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-close-pipeline",
    title: "多个函数协作",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "多函数协作与数据传递",
      flowDiagram: [
        "raw ──► clean_scores ──► 有效成绩",
        "          calc_stats ──► 平均, 最高",
        "          make_report ──► 一句话",
      ],
    },
    code: code(`def clean_scores(raw):
    valid = []
    for s in raw:
        if 0 <= s <= 100:
            valid.append(s)
    return valid

def calc_stats(scores):
    avg = sum(scores) / len(scores)
    return avg, max(scores)

def make_report(name, raw):
    valid = clean_scores(raw)
    avg, top = calc_stats(valid)
    return f"{name}: 有效{len(valid)}人, 平均{avg:.1f}, 最高{top}"

print(make_report("一班", [80, 90, -5, 100]))
print(make_report("二班", [75, 85, 95]))`),
  },
  {
    id: "fn-close-practice",
    title: "练习：补全报告流水线",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "补全统计函数与报告函数",
      bulletPoints: [
        "calc_stats：return 平均分, 最高分",
        "make_report：先清洗，再统计，再 return 那句话",
      ],
    },
    code: code(`def clean_scores(raw):
    valid = []
    for s in raw:
        if 0 <= s <= 100:
            valid.append(s)
    return valid

def calc_stats(scores):
    return

def make_report(name, raw):
    return

print(make_report("一班", [80, 90, -5, 100]))
`),
    hints: [
      { level: 1, text: "calc_stats 返回 sum(scores) / len(scores) 与 max(scores)。" },
      { level: 2, text: "make_report 里先 valid = clean_scores(raw)，再 avg, top = calc_stats(valid)。" },
      {
        level: 3,
        text: `def calc_stats(scores):
    return sum(scores) / len(scores), max(scores)

def make_report(name, raw):
    valid = clean_scores(raw)
    avg, top = calc_stats(valid)
    return f"{name}: 有效{len(valid)}人, 平均{avg:.1f}, 最高{top}"`,
      },
    ],
    reveal: {
      title: "对照",
      body: "有效成绩是 80、90、100。平均 90.0，最高 100。三个函数各做一件事，靠 return 把数据交给下一个函数。",
    },
    expectedOutput: "一班: 有效3人, 平均90.0, 最高100",
  },
  {
    id: "fn-close-points",
    title: "本讲要点",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "本讲要点",
      bulletPoints: [
        "def 创建函数对象，调用时才执行函数体",
        "位置实参按顺序传递；关键字实参按名传递；默认参数可省略",
        "print 输出到标准输出；return 将结果返回调用方",
        "函数内部的名字是局部变量；要改外面的同名变量，须先写 global",
        "不加括号引用函数对象，加括号才执行调用",
        "import 模块名 后用 模块名.函数()；from 模块 import 名字 后可直接调用",
      ],
    },
  },
  {
    id: "fn-close-homework",
    title: "课后作业",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "课后作业",
      bulletPoints: [],
    },
  },
];
