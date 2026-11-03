import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 字面量、变量、空元组、单元素逗号、嵌套。 */
export const scenes: DraftScene[] = [
  {
    id: "tuple-define-syntax",
    title: "定义元组",
    type: "run",
    layout: "split",
    content: {
      headline: "定义元组",
      flowDiagram: [
        "(元素, 元素, ……, 元素)",
        "变量名称 = (元素, 元素, ……, 元素)",
        "变量名称 = ()",
        "变量名称 = tuple()",
      ],
      body: "定义元组使用小括号，用逗号隔开各个数据。数据可以是不同的数据类型。",
      bulletPoints: ["空元组可以写成 ()，也可以写成 tuple()"],
    },
    code: code(`t1 = (1, "Hello", True)
print(t1)

empty = ()
also_empty = tuple()
print(empty)
print(also_empty)`),
  },
  {
    id: "tuple-define-one",
    title: "一个元素的元组",
    type: "run",
    layout: "split",
    content: {
      headline: "只有一个数据时要加逗号",
      flowDiagram: ["t2 = ('Hello',)"],
      body: "元组只有一个数据时，这个数据后面要添加逗号。否则小括号只表示运算顺序，结果不是元组。",
      bulletPoints: ["('Hello',) 的类型是 tuple", "('Hello') 的类型是 str"],
    },
    code: code(`t2 = ("Hello",)
print(t2)
print(type(t2))

not_tuple = ("Hello")
print(not_tuple)
print(type(not_tuple))`),
  },
  {
    id: "tuple-define-nest",
    title: "元组的嵌套",
    type: "run",
    layout: "split",
    content: {
      headline: "元组也支持嵌套",
      flowDiagram: ["t1[0][0]"],
      body: "元组里可以再放元组。先用外层下标取出内层元组，再用内层下标取出元素。",
      bulletPoints: ["t1[0] 取出 (1, 2, 3)", "t1[0][0] 再取出 1"],
    },
    code: code(`t1 = ((1, 2, 3), (4, 5, 6))
print(t1[0])
print(t1[0][0])`),
  },
];
