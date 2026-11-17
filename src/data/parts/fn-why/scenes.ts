import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const CLASS_A = `[80, 90, -5, 100]`;
const CLASS_B = `[75, 85, 95]`;
const CLASS_C = `[60, 70, 101, 88]`;

/** 三个班要做同一套成绩分析：复制粘贴撑不住，才引入函数。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-why-task",
    title: "引入",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "多班级共用同一处理流程",
      image: {
        src: "/lesson08/fn-why.svg",
        alt: "一班、二班、三班都经过过滤、统计、打印，得到各自的成绩报告",
      },
      bulletPoints: ["步骤相同", "只有数据不同"],
    },
  },
  {
    id: "fn-why-repeat",
    title: "重复的分析代码",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "重复代码难以同步维护",
      bulletPoints: ["处理逻辑相同", "仅实参数据不同"],
    },
    code: code(`raw_a = ${CLASS_A}
valid_a = []
for s in raw_a:
    if 0 <= s <= 100:
        valid_a.append(s)
avg_a = sum(valid_a) / len(valid_a)
print(f"一班: 有效{len(valid_a)}人, 平均{avg_a:.1f}")

raw_b = ${CLASS_B}
valid_b = []
for s in raw_b:
    if 0 <= s <= 100:
        valid_b.append(s)
avg_b = sum(valid_b) / len(valid_b)
print(f"二班: 有效{len(valid_b)}人, 平均{avg_b:.1f}")`),
  },
  {
    id: "fn-why-modify-format",
    title: "修改：三处一起改",
    type: "modify",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "在两处输出中同步增加最高分",
    },
    code: code(`raw_a = ${CLASS_A}
valid_a = []
for s in raw_a:
    if 0 <= s <= 100:
        valid_a.append(s)
avg_a = sum(valid_a) / len(valid_a)
print(f"一班: 有效{len(valid_a)}人, 平均{avg_a:.1f}")

raw_b = ${CLASS_B}
valid_b = []
for s in raw_b:
    if 0 <= s <= 100:
        valid_b.append(s)
avg_b = sum(valid_b) / len(valid_b)
print(f"二班: 有效{len(valid_b)}人, 平均{avg_b:.1f}")`),
    hints: [
      { level: 1, text: "有效成绩列表已经算好，最高分用 max(valid_a) 和 max(valid_b)。" },
      { level: 2, text: "把两行 print 都改成带「最高」的 f-string。" },
      {
        level: 3,
        text: 'print(f"一班: 有效{len(valid_a)}人, 平均{avg_a:.1f}, 最高{max(valid_a)}")\nprint(f"二班: 有效{len(valid_b)}人, 平均{avg_b:.1f}, 最高{max(valid_b)}")',
      },
    ],
    reveal: {
      title: "对照",
      body: "需求只改了一句，代码却要改两处。班级再增加，改动次数继续增加。",
    },
    expectedOutput: `一班: 有效3人, 平均90.0, 最高100
二班: 有效3人, 平均85.0, 最高95`,
  },
  {
    id: "fn-why-wrap",
    title: "封装为函数",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "一次定义，多次调用",
      flowDiagram: [
        "def make_report(name, raw):",
        "    ...",
        "make_report(\"一班\", raw_a)",
        "make_report(\"二班\", raw_b)",
      ],
    },
    code: code(`def make_report(name, raw):
    valid = []
    for s in raw:
        if 0 <= s <= 100:
            valid.append(s)
    avg = sum(valid) / len(valid)
    print(f"{name}: 有效{len(valid)}人, 平均{avg:.1f}, 最高{max(valid)}")

make_report("一班", ${CLASS_A})
make_report("二班", ${CLASS_B})
make_report("三班", ${CLASS_C})`),
  },
  {
    id: "fn-why-one-change",
    title: "修改：只改函数体",
    type: "modify",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "修改函数体即可更新全部调用",
      bulletPoints: ["在输出中增加最低分", "调用语句保持不变"],
    },
    code: code(`def make_report(name, raw):
    valid = []
    for s in raw:
        if 0 <= s <= 100:
            valid.append(s)
    avg = sum(valid) / len(valid)
    print(f"{name}: 有效{len(valid)}人, 平均{avg:.1f}, 最高{max(valid)}")

make_report("一班", ${CLASS_A})
make_report("二班", ${CLASS_B})
make_report("三班", ${CLASS_C})`),
    hints: [
      { level: 1, text: "最低分是 min(valid)。" },
      { level: 2, text: "只改函数体里的 print，不要去改三行调用。" },
      {
        level: 3,
        text: 'print(f"{name}: 有效{len(valid)}人, 平均{avg:.1f}, 最高{max(valid)}, 最低{min(valid)}")',
      },
    ],
    reveal: {
      title: "对照",
      body: "调用处不用动。同一逻辑定义一次，修改一次，所有调用都使用新格式。",
    },
    expectedOutput: `一班: 有效3人, 平均90.0, 最高100, 最低80
二班: 有效3人, 平均85.0, 最高95, 最低75
三班: 有效3人, 平均72.7, 最高88, 最低60`,
  },
  {
    id: "fn-why-roles",
    title: "函数的作用",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "函数的作用",
      bulletPoints: [
        "封装可复用逻辑",
        "集中修改，所有调用同步生效",
        "将复杂任务分解为多个函数",
      ],
    },
  },
];
