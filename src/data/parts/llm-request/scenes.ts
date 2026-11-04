import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 最短反例，以及「有的输入看起来对」的整除平均值。 */
export const scenes: DraftScene[] = [
  {
    id: "llm-counter-run",
    title: "回文判断",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "三条调用均返回 True，且未抛出异常",
      body: "回文指正向与反向的字符序列相同。运行后判断哪一个输入的期望值应为 False。",
      bulletPoints: ["\"a\"、\"aa\" 是回文", "\"ab\" 不是回文"],
    },
    code: code(`def is_palindrome(s):
    for i in range(len(s) // 2):
        if s[i] != s[-i]:
            return False
    return True

print(is_palindrome("a"))
print(is_palindrome("aa"))
print(is_palindrome("ab"))`),
  },
  {
    id: "llm-counter-why",
    title: "为什么 ab 没被抓住",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "i 为 0 时，-i 仍为 0",
      bulletPoints: [
        "\"ab\" 的长度为 2，循环只执行 i = 0",
        "s[-0] 即 s[0]，比较的是同一下标",
        "\"a\" 与 \"aa\" 的返回值恰好为 True，不能暴露该错误",
        "最短反例是 \"ab\"：实际返回 True，期望为 False",
      ],
    },
  },
  {
    id: "llm-counter-fix",
    title: "改比较的位置",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      body: "右操作数应是从末尾向前的对应字符。i 为 0 时比较最后一个字符，i 为 1 时比较倒数第二个。修正后 \"ab\" 为 False，\"aba\" 为 True。",
    },
    code: code(`def is_palindrome(s):
    for i in range(len(s) // 2):
        if s[i] != s[-i]:
            return False
    return True

print(is_palindrome("ab"))
print(is_palindrome("aba"))`),
    hints: [
      { level: 1, text: "下标 -1 表示最后一个字符。" },
      { level: 2, text: "i 增加 1 时，右侧下标应再向前 1，即 -(i + 1)。" },
      { level: 3, text: "把 s[-i] 改成 s[-i - 1]。" },
    ],
    reveal: {
      title: "对照",
      body: "\"ab\" 两端字符不同，返回 False。\"aba\" 仅比较两端，均为 \"a\"，返回 True。",
    },
    expectedOutput: `False
True`,
  },
  {
    id: "llm-mystery",
    title: "单次通过不能证明正确",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "[80, 90] 的结果为 85，与真除法一致",
      body: "平均值定义为总和除以元素个数。[80, 81] 的正确结果是 80.5。该实现使用整除 //。",
      bulletPoints: ["一组通过的测试不能推出所有输入都正确", "应补充能区分 // 与 / 的输入"],
    },
    code: code(`def mystery_average(scores):
    return sum(scores) // len(scores)

print(mystery_average([80, 90]))
print(mystery_average([80, 81]))`),
  },
];
