import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const MACHINE = `product = "橙汁"
price = 5
balance = 10
print("欢迎使用校园自动售货机")
print(f"您选择了：{product}")
print(f"商品价格：{price}元")
print(f"账户余额：{balance}元")
print("付款成功")
print("开始出货")
print("感谢使用，欢迎下次光临")`;

const SHORT = MACHINE.replace("balance = 10", "balance = 1");

const FORK = `product = "橙汁"
price = 5
balance = 1
if balance >= price:
    print("付款成功")
    print("开始出货")
else:
    print("余额不足，无法购买")
print("感谢使用，欢迎下次光临")`;

export const scenes: DraftScene[] = [
  {
    id: "vend-seq-run",
    title: "顺序结构",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      vendPath: {
        mode: "guide",
        title: "语句按什么顺序执行？",
        question: "左侧程序中，各语句的执行顺序由什么决定？",
        options: [
          { id: "order", label: "由语句的书写顺序决定", correct: true },
          { id: "cond", label: "由 balance 与 price 的比较结果决定", correct: false },
        ],
        okText: "顺序结构中，语句按书写顺序依次执行，执行过程中不进行条件判断。",
        badText: "这段程序没有 if。先运行左侧，观察输出是否覆盖每一条 print。",
      },
    },
    code: code(MACHINE),
  },
  {
    id: "vend-conflict-run",
    title: "顺序结构不选择语句",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "余额为1呢，还能付款成功吗？",
    },
    code: code(SHORT),
  },
  {
    id: "vend-fork-run",
    title: "分支结构",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      vendPath: {
        mode: "guide",
        title: "执行出货语句之前先求值什么？",
        question: "要使余额不足时不执行出货语句，程序应先求值什么？",
        options: [
          { id: "expr", label: "条件表达式 balance >= price", correct: true },
          { id: "next", label: "下一条 print 语句", correct: false },
        ],
        okText: "分支结构根据条件表达式的值选择执行路径。值为 True 时执行 if 语句块，为 False 时执行 else 语句块。",
        badText: "把 balance 改为 10 再运行。观察哪一个语句块被执行，哪一个被跳过。",
      },
    },
    code: code(FORK),
  },
];
