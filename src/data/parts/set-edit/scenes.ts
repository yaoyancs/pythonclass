import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** add、remove、discard、pop；集合没有下标。 */
export const scenes: DraftScene[] = [
  {
    id: "set-edit-add",
    title: "添加",
    type: "run",
    layout: "split",
    content: {
      headline: "add 添加一个元素",
      flowDiagram: ["names.add(\"邓紫棋\")"],
      body: "add 向集合加入一个元素。元素已存在时，再次 add 不改变集合。",
      bulletPoints: ["每次添加一个元素", "重复添加不增加元素个数"],
    },
    code: code(`names = {"周杰伦", "林俊杰"}
names.add("邓紫棋")
names.add("周杰伦")
print(names)`),
  },
  {
    id: "set-edit-remove",
    title: "删除指定元素",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "remove 找不到就报错",
      body: "集合中不存在该元素。remove 抛出 KeyError。改为删除已存在的元素后再输出。",
    },
    code: code(`names = {"周杰伦", "林俊杰"}
names.remove("蔡依林")
print(names)`),
    hints: [
      { level: 1, text: "remove 要求元素已经在集合里。" },
      { level: 2, text: "报错信息是 KeyError: '蔡依林'。" },
      { level: 3, text: "把 \"蔡依林\" 改成 \"周杰伦\"。" },
    ],
    reveal: {
      title: "对照",
      body: "指定元素被删除。元素可能不存在时，使用 discard，避免抛出 KeyError。",
    },
    expectedOutput: "{'林俊杰'}",
  },
  {
    id: "set-edit-discard",
    title: "discard",
    type: "run",
    layout: "split",
    content: {
      headline: "元素不存在时不抛出异常",
      flowDiagram: ["names.discard(\"蔡依林\")"],
      body: "discard 删除指定元素。元素不在集合中时，集合保持不变，程序继续执行。",
      bulletPoints: ["remove：元素不存在时抛出 KeyError", "discard：元素不存在时不修改集合"],
    },
    code: code(`names = {"周杰伦", "林俊杰"}
names.discard("蔡依林")
names.discard("周杰伦")
print(names)`),
  },
  {
    id: "set-edit-pop",
    title: "取出一个",
    type: "run",
    layout: "split",
    content: {
      headline: "pop 取出并删除一个元素",
      flowDiagram: ["name = names.pop()"],
      body: "集合仅有一个元素时，pop 返回该元素。存在多个元素时，返回哪一个没有保证，不能用 pop 删除指定元素。",
      bulletPoints: ["pop 修改原集合", "删除指定元素使用 remove 或 discard"],
    },
    code: code(`names = {"周杰伦"}
name = names.pop()
print(name)
print(names)`),
  },
  {
    id: "set-edit-index",
    title: "没有下标",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "不能按下标取元素",
      body: "集合不支持下标。names[0] 抛出 TypeError。删除该语句，改为 print(sorted(names))。",
    },
    code: code(`names = {"周杰伦", "林俊杰"}
print(names[0])`),
    hints: [
      { level: 1, text: "集合不能像列表那样用下标。" },
      { level: 2, text: "报错信息是 TypeError: 'set' object is not subscriptable。" },
      { level: 3, text: "删掉 names[0]，写成 print(sorted(names))。" },
    ],
    reveal: {
      title: "对照",
      body: "sorted 返回按字典序排列的列表。集合本身不支持下标。判断元素是否存在使用 in。",
    },
    expectedOutput: "['周杰伦', '林俊杰']",
  },
];
