import type { DraftScene } from "../../../types/scene";

/** 独立实现课堂规则。只使用虚构测试密码。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-pw-21",
    type: "question",
    layout: "fullscreen",
    content: {
      headline: "长度达到 15 是否构成安全？",
      question: "123456789012345 与 C7!p2K，风险是否相同？",
      bulletPoints: ["仅使用虚构测试密码。"],
    },
  },
  {
    id: "scene-pw-22",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "四条规则应按什么顺序判断？",
      bulletPoints: [
        "空输入 → 请输入测试密码。",
        "长度不足 15 → 密码偏短。",
        "等于 123456789012345 → 请避免简单数字规律。",
        "其余 → 通过课堂基础检查，但不能保证安全。",
      ],
    },
  },
  {
    id: "scene-pw-23",
    type: "challenge",
    layout: "split",
    content: {
      headline: "如何用分支实现上述规则？",
      bulletPoints: ["区分空输入、长度与指定弱样本。", "结论不超过已检查的规则。"],
    },
    code: {
      initial: 'password = input("请输入虚构测试密码：")\n# 请完成条件判断',
      editable: true,
      resetToInitial: true,
    },
    hints: [
      { level: 1, text: "len(password) 得到什么？空字符串的长度是多少？" },
      { level: 2, text: "这几条提示是否应同时输出？" },
      { level: 3, text: "能否用 if ... elif ... else？弱样本应写在长度检查之后还是之前？" },
    ],
    reveal: {
      title: "完成后对照",
      body: 'if password == "":\n    print("请输入测试密码")\nelif len(password) < 15:\n    print("密码偏短")\nelif password == "123456789012345":\n    print("请避免简单数字规律")\nelse:\n    print("通过课堂基础检查，但不能保证安全")',
    },
  },
  {
    id: "scene-pw-24",
    type: "run",
    layout: "split",
    content: {
      headline: "abcdefghijklmno 会输出哪一句？",
      bulletPoints: ["再测试空字符串、abcdef12345678、123456789012345。"],
    },
    code: {
      initial:
        'password = "abcdefghijklmno"\nif password == "":\n    print("请输入测试密码")\nelif len(password) < 15:\n    print("密码偏短")\nelif password == "123456789012345":\n    print("请避免简单数字规律")\nelse:\n    print("通过课堂基础检查，但不能保证安全")',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-pw-25",
    type: "predict",
    layout: "split",
    content: {
      headline: "该条件表达式的值是什么？",
      bulletPoints: ["password 为 abc。先预测，再运行。"],
    },
    code: {
      initial:
        'password = "abc"\nif len(password) >= 15 or password != "123456789012345":\n    print("密码通过检查")\nelse:\n    print("密码不符合要求")',
      editable: true,
      resetToInitial: true,
    },
    prediction: {
      question: "条件整体为真还是为假？",
      options: [
        { id: "true", label: "True", isCorrect: true },
        { id: "false", label: "False" },
      ],
      stepTrace: [
        "len(password) >= 15 → False",
        'password != "123456789012345" → True',
        "False or True → True",
      ],
    },
    reveal: {
      body: "or 的右侧为 True，整体为 True。",
    },
  },
  {
    id: "scene-pw-26",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "通过基础检查是否等于密码安全？",
      bulletPoints: ["若密码被提交到钓鱼页面，本程序能否阻止？"],
    },
  },
];
