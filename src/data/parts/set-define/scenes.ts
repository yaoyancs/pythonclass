import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 字面量、空集合、重复只留一份、从列表收成集合。 */
export const scenes: DraftScene[] = [
  {
    id: "set-define-syntax",
    title: "定义集合",
    type: "run",
    layout: "split",
    content: {
      headline: "定义集合",
      flowDiagram: [
        "{元素, 元素, ……, 元素}",
        "变量名称 = {元素, 元素, ……, 元素}",
        "变量名称 = set()",
      ],
      body: "集合字面量使用花括号，元素之间用逗号分隔。元素类型可以不同。",
      bulletPoints: ["空集合写为 set()", "集合无序，不能按输出顺序访问元素"],
    },
    code: code(`names = {"周杰伦", "林俊杰", "邓紫棋"}
print(names)
print(type(names))`),
  },
  {
    id: "set-define-empty",
    title: "空集合",
    type: "run",
    layout: "split",
    content: {
      headline: "空花括号表示空字典",
      flowDiagram: ["empty = set()", "not_set = {}"],
      body: "set() 得到空集合。写成 {} 得到的是空字典，类型是 dict。",
      bulletPoints: ["set() 的类型是 set", "{} 的类型是 dict"],
    },
    code: code(`empty = set()
print(empty)
print(type(empty))

not_set = {}
print(not_set)
print(type(not_set))`),
  },
  {
    id: "set-define-dup",
    title: "重复只留一份",
    type: "run",
    layout: "split",
    content: {
      headline: "重复元素只保留一个",
      body: "字面量中同一元素出现两次，构造后只保留一份。len 的结果是 2。",
      bulletPoints: ["相同元素只保留一个", "len 返回去重后的元素个数"],
    },
    code: code(`names = {"周杰伦", "林俊杰", "周杰伦"}
print(names)
print(len(names))`),
  },
  {
    id: "set-define-from-list",
    title: "由列表构造集合",
    type: "run",
    layout: "split",
    content: {
      headline: "set(可迭代对象) 去除重复",
      flowDiagram: ["names = set(arrived)"],
      body: "set 接收可迭代对象并构造集合，重复元素只保留一个。原列表不被修改。",
      bulletPoints: ["arrived 的长度仍为 3", "names 中该重复元素只有一个"],
    },
    code: code(`arrived = ["周杰伦", "林俊杰", "周杰伦"]
names = set(arrived)
print(arrived)
print(names)
print(len(names))`),
  },
  {
    id: "set-define-summary",
    title: "集合创建小结",
    type: "explain",
    layout: "fullscreen",
    content: {
      note: {
        title: "集合创建小结",
        points: [
          "集合的定义语法\n{元素1, 元素2, 元素3, …}",
          "空集合的写法\n使用 set()。{} 表示空字典。",
          "重复元素\n只保留一份。set(列表) 由已有序列构造集合。",
        ],
      },
    },
  },
];
