import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 签到名单里同一个人写了两次。列表能存，查重要自己扫。 */
export const scenes: DraftScene[] = [
  {
    id: "set-why-open",
    title: "引入",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "需要元素唯一的数据",
      bulletPoints: [
        "记录一组标识",
        "同一元素只保留一次",
        "判断某元素是否存在",
        "比较两个集合的成员",
      ],
      preview: "下一页：用列表保存含重复项的数据",
    },
  },
  {
    id: "set-why-list",
    title: "列表里的重复",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "列表保留重复元素",
      body: "同一字符串出现两次。列表长度为 3，输出仍包含全部元素。",
      bulletPoints: ["列表允许重复元素", "元素顺序与写入顺序一致"],
    },
    code: code(`arrived = ["周杰伦", "林俊杰", "周杰伦"]
print(arrived)
print(len(arrived))`),
  },
  {
    id: "set-why-scan",
    title: "手动去重",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "用线性扫描实现去重",
      body: "新建空列表，仅在元素尚未出现时 append。每次插入都要扫描已有元素，数据量增大后开销上升。",
      bulletPoints: ["not in 判断元素是否已存在", "append 只追加新元素"],
    },
    code: code(`arrived = ["周杰伦", "林俊杰", "周杰伦"]
unique = []
for name in arrived:
    if name not in unique:
        unique.append(name)
print(unique)`),
  },
  {
    id: "set-why-need",
    title: "为什么需要集合",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "成员不重复，用集合",
      bulletPoints: [
        "集合里的每个元素只保留一份",
        "由含重复元素的列表构造集合时，重复元素被去除",
        "按键检索对应值时使用字典",
      ],
    },
  },
];
