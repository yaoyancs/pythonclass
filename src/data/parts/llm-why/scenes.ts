import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 运行成功不等于符合规则。用边界数据审一段「AI 提交」的程序。 */
export const scenes: DraftScene[] = [
  {
    id: "llm-why-vote",
    title: "可运行不等于符合规格",
    type: "question",
    layout: "fullscreen",
    content: {
      headline: "正常结束只说明没有抛出异常",
      question: "模型生成的程序已经运行并产生输出。是否可以据此认定它满足规格？",
      voteOptions: ["可以，有输出即正确", "不可以，必须用规格设计测试", "依据代码是否接近教材示例"],
    },
  },
  {
    id: "llm-why-court",
    title: "审查生成代码",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "规格：分数大于或等于 60 为及格",
      body: "下列程序由模型生成。运行后判断：值为 60 的元素是否被计入。",
      bulletPoints: ["输入包含 59、60、61", "按规格，及格元素为 60、61、80、95，共 4 个"],
    },
    code: code(`scores = [59, 60, 61, 80, 95]
count = 0
for x in scores:
    if x > 60:
        count += 1
print(count)`),
  },
  {
    id: "llm-why-boundary",
    title: "专门测边界",
    type: "modify",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "用边界输入检验比较运算符",
      body: "输入改为 [60]。按规格应输出 1。当前条件使用 >，输出为 0。将条件改为大于或等于 60。",
    },
    code: code(`scores = [60]
count = 0
for x in scores:
    if x > 60:
        count += 1
print(count)`),
    hints: [
      { level: 1, text: "按规格，60 应当被计入。" },
      { level: 2, text: "运算符 > 不包含相等。" },
      { level: 3, text: "把 x > 60 改成 x >= 60。" },
    ],
    reveal: {
      title: "对照",
      body: "全部高于阈值的输入不能暴露该错误。等于阈值的输入可以。空序列与全部低于阈值的序列，期望结果都是 0。",
    },
    expectedOutput: "1",
  },
  {
    id: "llm-why-suite",
    title: "一组测试各管一件事",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "先确定期望输出，再执行",
      gridTable: {
        headers: ["输入", "期望", "用来检验"],
        rows: [
          ["[80, 90]", "2", "普通及格"],
          ["[40, 50]", "0", "全部不及格"],
          ["[60]", "1", "刚好等于标准"],
          ["[]", "0", "没有数据"],
        ],
      },
      body: "规格由人确定，实现可以由模型生成，测试由人设计，由解释器执行。流程是规格、实现、测试、修正。",
    },
  },
];
