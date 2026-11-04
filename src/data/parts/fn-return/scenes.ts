import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 有返回值、多个值是元组、没有 return 得到 None。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-return-one",
    title: "返回一个值",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "return 将结果返回调用方",
      body: "square(4) 的值是 16。该值可以继续参与运算，也可以赋给变量。",
      bulletPoints: ["调用表达式的值即 return 后的值", "执行 return 后，函数体中其后的语句不再执行"],
    },
    code: code(`def square(x):
    return x * x

print(square(4))
print(square(4) + 1)`),
  },
  {
    id: "fn-return-many",
    title: "返回多个值",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "多个值打包成元组",
      body: "return 后用逗号分隔多个表达式时，调用方得到一个元组。可以整体接收，也可以解包为多个变量。",
      bulletPoints: ["min、max 是内置函数", "解包时左侧变量个数必须与返回值个数一致"],
    },
    code: code(`def min_max(numbers):
    return min(numbers), max(numbers)

scores = [90, 78, 95, 88]
print(min_max(scores))
low, high = min_max(scores)
print(low, high)`),
  },
  {
    id: "fn-return-none",
    title: "print 与 return 的区别",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "只打印不返回，后续无法继续计算",
      body: "average 用 return 返回均值，调用方可以继续比较或求和。函数若只调用 print 而不 return，其返回值是 None。",
      bulletPoints: [
        "print 将内容写到标准输出",
        "return 将计算结果返回调用方，供后续语句使用",
      ],
    },
    code: code(`def average(scores):
    return sum(scores) / len(scores)

a = average([80, 90, 70])
b = average([75, 85, 95])
print(a, b)
print("两班总均分:", (a + b) / 2)`),
  },
  {
    id: "fn-return-area",
    title: "从目的写到测试",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "先确定输入与输出，再实现计算",
      body: "功能是计算矩形面积。输入为长和宽，输出为一个数值。函数体只做乘法，再用已知结果核对。",
      bulletPoints: ["文档字符串说明参数与返回值", "5×3 的结果为 15，2.5×4 的结果为 10.0"],
    },
    code: code(`def calculate_area(length, width):
    """计算矩形面积。length、width 是数字，返回面积。"""
    return length * width

print(calculate_area(5, 3))
print(calculate_area(2.5, 4))
print(calculate_area(1, 1))`),
  },
];
