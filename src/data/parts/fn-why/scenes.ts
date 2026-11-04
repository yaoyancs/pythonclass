import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 成绩单上同一句式写了三遍。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-why-repeat",
    title: "重复的输出语句",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "相同格式的语句重复出现",
      body: "三条输出语句结构相同，只有姓名和分数不同。格式一旦改变，每一条语句都要修改。",
      bulletPoints: ["输出格式相同", "变化的是参数数据"],
    },
    code: code(`print("学生A: 数学90分，语文85分")
print("学生B: 数学78分，语文92分")
print("学生C: 数学95分，语文88分")`),
  },
  {
    id: "fn-why-wrap",
    title: "封装为函数",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "定义一次，调用多次",
      body: "将输出逻辑封装为 print_score。姓名和两门分数通过参数传入。新增一条记录时，只增加一次函数调用。",
      bulletPoints: ["def 定义函数", "调用时写出函数名并传入实参"],
    },
    code: code(`def print_score(name, math, chinese):
    print(f"{name}: 数学{math}分，语文{chinese}分")

print_score("学生A", 90, 85)
print_score("学生B", 78, 92)
print_score("学生C", 95, 88)`),
  },
  {
    id: "fn-why-roles",
    title: "函数的作用",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "一段可重复使用的代码",
      bulletPoints: [
        "同一逻辑定义一次，可多次调用",
        "函数名表明功能，调用处保持简短",
        "修改格式或计算时，只修改函数体",
        "复杂任务分解为多个函数",
      ],
    },
  },
];
