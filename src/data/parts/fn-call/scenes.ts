import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/**
 * 函数是对象：赋值不调用，圆括号才调用。
 * 不讲闭包、装饰器和类的 __call__。
 */
export const scenes: DraftScene[] = [
  {
    id: "fn-call-bind",
    title: "函数名绑定函数对象",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "def 创建函数对象并绑定名称",
      body: "名称 square 引用一个函数对象。输出该名称得到的是函数对象，不是调用结果。type 的结果是 function。",
      bulletPoints: ["定义时函数体不执行", "函数也是一种值，可以查看类型"],
      image: {
        src: "/lesson08/fn-bind.svg",
        alt: "执行 def 创建函数对象，再把名字 square 绑定到它。定义时函数体不执行。",
      },
    },
    code: code(`def square(x):
    return x * x

print(square)
print(type(square))`),
  },
  {
    id: "fn-call-paren",
    title: "括号决定是否调用",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "圆括号决定是否调用",
      body: "task = square 只增加一个指向同一函数对象的名称，不执行函数体。square(4) 才是调用，返回值为 16。",
      bulletPoints: ["无圆括号：引用函数对象", "有圆括号：执行函数体并得到返回值"],
      image: {
        src: "/lesson08/fn-paren.svg",
        alt: "左边 task = square 保存同一个函数；右边 square(4) 先调用，result 保存 16。",
      },
    },
    code: code(`def square(x):
    return x * x

task = square
print(task)
print(task(4))
print(square(4))`),
  },
  {
    id: "fn-call-predict",
    title: "看返回的是什么",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      body: "两个函数都使用 return，差别在于返回的是函数对象还是调用结果。",
      image: {
        src: "/lesson08/fn-return.svg",
        alt: "return square 交回函数，之后才能 picked(3)；return square() 会立刻调用并因缺少参数报错。",
      },
    },
    code: code(`def square(x):
    return x * x

def give_square():
    return square

picked = give_square()
print(picked(3))`),
    prediction: {
      question: "picked(3) 打印出什么？",
      options: [
        { id: "nine", label: "9", isCorrect: true },
        { id: "fn", label: "函数 square 本身" },
        { id: "err", label: "报错，因为 give_square 没有参数" },
      ],
    },
    reveal: {
      title: "return square 返回函数对象",
      body: "give_square() 不调用 square，而是返回函数对象。picked 与 square 引用同一函数，picked(3) 计算 3×3，结果为 9。若写成 return square()，函数定义合法，但调用时会因 square 缺少实参而抛出 TypeError。",
    },
  },
  {
    id: "fn-call-table",
    title: "放进字典",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "用名字查出要调用的函数",
      body: "字典的值是函数对象，写入时不加调用运算符。按键取出后再调用，并传入实参。",
      bulletPoints: ["actions[\"及格\"] 得到函数对象", "随后的 (60) 才执行调用"],
      image: {
        src: "/lesson08/fn-dict.svg",
        alt: "字典保存函数对象，按键取出后再用圆括号调用。",
      },
    },
    code: code(`def passed(score):
    return score >= 60

def full_mark(score):
    return score == 100

actions = {"及格": passed, "满分": full_mark}
check = actions["及格"]
print(check(60))
print(actions["满分"](99))`),
  },
];
