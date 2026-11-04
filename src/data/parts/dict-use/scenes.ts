import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const ROSTER = `roster = {"2024001": "周杰伦", "2024002": "林俊杰"}`;

/** 取值、KeyError、get、增改删、值是列表。 */
export const scenes: DraftScene[] = [
  {
    id: "dict-use-get-key",
    title: "按键取值",
    type: "run",
    layout: "split",
    content: {
      headline: "用键取出对应的值",
      flowDiagram: ["roster[\"2024002\"]"],
      body: "方括号中写入键，返回该键对应的值。按键访问不需要循环。",
      bulletPoints: ["键必须与字典中的键一致", "返回的是值，不是整条映射"],
    },
    code: code(`${ROSTER}
print(roster["2024002"])`),
  },
  {
    id: "dict-use-missing",
    title: "键不存在",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "键不存在时抛出 KeyError",
      body: "字典中没有键 \"2024009\"。方括号访问抛出 KeyError。改为访问 \"2024001\" 后再输出。",
    },
    code: code(`${ROSTER}
print(roster["2024009"])`),
    hints: [
      { level: 1, text: "方括号取值要求键已经在字典里。" },
      { level: 2, text: "报错信息是 KeyError: '2024009'。" },
      { level: 3, text: "把 \"2024009\" 改成 \"2024001\"。" },
    ],
    reveal: {
      title: "对照",
      body: "键 \"2024001\" 对应的值是周杰伦。键可能不存在时使用 get，避免程序因 KeyError 中断。",
    },
    expectedOutput: "周杰伦",
  },
  {
    id: "dict-use-get",
    title: "get",
    type: "run",
    layout: "split",
    content: {
      headline: "键不存在时返回默认值",
      flowDiagram: ["roster.get(\"2024009\", \"查无此人\")"],
      body: "get 的第二个参数是键不存在时的返回值。键存在时返回对应的值。",
      bulletPoints: ["键存在：返回对应值", "键不存在：返回指定的默认值"],
    },
    code: code(`${ROSTER}
print(roster.get("2024002", "查无此人"))
print(roster.get("2024009", "查无此人"))`),
  },
  {
    id: "dict-use-assign",
    title: "新增与修改",
    type: "run",
    layout: "split",
    content: {
      headline: "赋值用于插入或更新",
      flowDiagram: ["roster[键] = 值"],
      body: "键不存在时，赋值插入新项。键已存在时，赋值覆盖原值。",
      bulletPoints: ["\"2024003\" 是新键", "\"2024001\" 的值被覆盖"],
    },
    code: code(`${ROSTER}
roster["2024003"] = "邓紫棋"
roster["2024001"] = "周杰伦（班长）"
print(roster["2024003"])
print(roster["2024001"])`),
  },
  {
    id: "dict-use-del",
    title: "删除",
    type: "run",
    layout: "split",
    content: {
      headline: "del 与 pop",
      flowDiagram: ["del roster[键]", "roster.pop(键)"],
      body: "del 按键删除项，不返回值。pop 删除项并返回原值。键不存在时，两种操作都抛出 KeyError。",
      bulletPoints: ["del 无返回值", "pop 返回被删除的值"],
    },
    code: code(`${ROSTER}
name = roster.pop("2024002")
print(name)
del roster["2024001"]
print(roster)`),
  },
  {
    id: "dict-use-list-value",
    title: "值可以是列表",
    type: "run",
    layout: "split",
    content: {
      headline: "修改的是值所引用的列表",
      flowDiagram: ["clubs[\"2024001\"].append(\"合唱团\")"],
      body: "值是列表。append 修改该列表对象，键保持不变。",
      bulletPoints: ["先按键取出列表", "再对该列表调用 append"],
    },
    code: code(`clubs = {"2024001": ["吉他社"], "2024002": ["合唱团"]}
clubs["2024001"].append("合唱团")
print(clubs["2024001"])`),
  },
];
