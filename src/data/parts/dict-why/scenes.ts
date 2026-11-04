import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 名单要按学号查找。列表得扫，字典按键取。 */
export const scenes: DraftScene[] = [
  {
    id: "dict-why-need",
    title: "为什么需要字典",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "按键检索对应值",
      body: "集合成员检测回答元素是否存在。字典按键返回对应值。若用列表存放键值对，查找需要线性扫描。",
      bulletPoints: [
        "每条记录由键和值组成",
        "给出键，取出对应的值",
        "键必须唯一",
      ],
    },
  },
  {
    id: "dict-why-scan",
    title: "在列表里找",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "在列表中线性查找",
      body: "数据是元组列表。查找键 \"2024002\" 时，从首项开始比较，相等后取出对应值。",
      bulletPoints: ["每项为 (键, 值)", "记录数增加时，每次查找都要扫描"],
    },
    code: code(`rows = [("2024001", "周杰伦"), ("2024002", "林俊杰")]
target = "2024002"
for sid, name in rows:
    if sid == target:
        print(name)`),
  },
  {
    id: "dict-why-syntax",
    title: "定义字典",
    type: "run",
    layout: "split",
    content: {
      headline: "定义字典",
      flowDiagram: [
        "{键: 值, 键: 值, ……}",
        "变量名称 = {键: 值, 键: 值, ……}",
        "变量名称 = {}",
      ],
      body: "字典字面量写为键: 值，项之间用逗号分隔。空字典写为 {}。",
      bulletPoints: ["键不重复", "本例的键是编号，值是字符串"],
    },
    code: code(`roster = {"2024001": "周杰伦", "2024002": "林俊杰"}
print(roster)
print(type(roster))

empty = {}
print(empty)
print(type(empty))`),
  },
];
