import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 位置参数、默认参数、关键字参数。可变参数本讲不讲。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-param-pos",
    title: "位置参数",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "按顺序传入",
      body: "add 有两个形参，调用时实参个数必须匹配。5 绑定到 a，3 绑定到 b，返回值为 8。",
      bulletPoints: ["实参过少或过多都会抛出 TypeError", "位置实参的顺序与形参列表一致"],
    },
    code: code(`def add(a, b):
    return a + b

print(add(5, 3))`),
  },
  {
    id: "fn-param-default",
    title: "默认参数",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "省略实参时使用默认值",
      body: "greeting 的默认值是 Hello。只传入 name 时使用该默认值；传入第二个实参时覆盖这一次调用的默认值。",
      bulletPoints: ["带默认值的形参必须位于无默认值形参之后", "每次调用可以单独覆盖默认值"],
    },
    code: code(`def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("周杰伦"))
print(greet("周杰伦", "Hi"))`),
  },
  {
    id: "fn-param-keyword",
    title: "关键字参数",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "写出参数名再传值",
      body: "name=\"林俊杰\" 按形参名绑定，不依赖从左到右的位置。位置实参与关键字实参可以混用，关键字实参必须写在位置实参之后。",
      bulletPoints: ["关键字必须与形参名一致", "位置实参在前，关键字实参在后"],
    },
    code: code(`def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet(name="林俊杰", greeting="Hi"))
print(greet("邓紫棋", greeting="Hey"))`),
  },
  {
    id: "fn-param-quiz",
    title: "哪种调用合法",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      body: "函数签名为 calculate(a, b=10)。判断下列调用是否合法。",
    },
    code: code(`def calculate(a, b=10):
    return a * b`),
    prediction: {
      question: "哪一次调用可以正常执行？",
      options: [
        { id: "a", label: "calculate(5, 20)", isCorrect: true },
        { id: "b", label: "calculate(a=5, 20)" },
        { id: "c", label: "calculate(b=20, 5)" },
        { id: "d", label: "calculate(, 20)" },
      ],
    },
    reveal: {
      title: "只有符合传参规则的调用合法",
      body: "calculate(5, 20) 将 5 绑定到 a、20 绑定到 b，返回值为 100。关键字实参不能位于位置实参之前，因此后两种调用不合法。省略第一个实参也不合法。b 有默认值，calculate(5) 合法，返回值为 50。",
    },
  },
];
