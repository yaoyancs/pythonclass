import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const COUNT =
  'n = 1\nwhile n <= 3:\n    print(n)\n    n = n + 1\nprint("结束")';

/** while：先判断，成立才执行；循环体里必须让条件有机会变成 False。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-while-syntax",
    title: "while 语句",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "while", mode: "syntax" } },
    code: code(COUNT),
  },
  {
    id: "scene-while-trace",
    title: "执行过程",
    type: "explain",
    layout: "fullscreen",
    content: { loopPath: { topic: "while", mode: "trace" } },
  },
  {
    id: "scene-while-read-assign",
    title: "阅读分析代码",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: { loopPath: { topic: "while", mode: "read" } },
    code: code("n = 1\nwhile n = 3:\n    print(n)\n    n = n + 1\nprint(\"结束\")\n"),
  },
  {
    id: "scene-while-read-indent",
    title: "阅读分析代码",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: { loopPath: { topic: "while", mode: "read" } },
    code: code('n = 1\nwhile n <= 3:\n    print(n)\nn = n + 1\nprint("结束")\n'),
  },
  {
    id: "scene-while-read-infinite",
    title: "阅读分析代码",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: { loopPath: { topic: "while", mode: "read" } },
    code: code('n = 1\nwhile n <= 3:\n    print(n)\n    n = n - 1\nprint("结束")\n'),
  },
  {
    id: "scene-while-read-skip",
    title: "阅读分析代码",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: { loopPath: { topic: "while", mode: "read" } },
    code: code('n = 1\nwhile n > 3:\n    print(n)\n    n = n + 1\nprint("结束")\n'),
  },
  {
    id: "scene-while-read-bound",
    title: "阅读分析代码",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: { loopPath: { topic: "while", mode: "read" } },
    code: code('n = 1\nwhile n < 3:\n    print(n)\n    n = n + 1\nprint("结束")\n'),
  },
  {
    id: "scene-while-practice",
    title: "随堂练习",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "while", mode: "practice" } },
    code: code('answer = "123456"\nwhile       :\n    \n'),
    hints: [
      { level: 1, text: "条件写成密码还不正确。正确密码是 123456。" },
      { level: 2, text: "input 放在循环体内。密码正确时条件变为 False，循环停止。" },
      { level: 3, text: 'password = ""\nwhile password != "123456":\n    password = input("请输入密码：")' },
    ],
    reveal: {
      title: "对照",
      body: 'while password != "123456" 在密码不正确时继续读入。输入 123456 后条件为 False，停止输入。',
    },
  },
];
