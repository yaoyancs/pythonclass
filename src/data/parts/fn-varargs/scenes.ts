import type { DraftScene } from "../../../types/scene";

const flow = (
  kind: "pack" | "unpack" | "compare" | "kwargs" | "kwunpack" | "mixed" | "bench" | "forward" | "quiz",
): DraftScene["content"] => ({
  starFlow: { kind },
});

function runFlow(
  id: string,
  title: string,
  kind: "pack" | "unpack" | "compare" | "kwargs" | "kwunpack" | "mixed" | "bench" | "forward" | "quiz",
  initial: string,
  expectedOutput?: string,
): DraftScene {
  return {
    id,
    title,
    type: "run",
    layout: "split",
    editorSide: "left",
    content: flow(kind),
    code: { initial, editable: true, resetToInitial: true },
    ...(expectedOutput ? { expectedOutput } : {}),
  };
}

/** 不定个数：位置参数与关键字参数的打包、解包和绑定。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-var-why",
    title: "从固定个数到不定个数",
    type: "run",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: {
      initial: `# max 和 print 都能接收不同个数的参数。
print(max(10, 20))
print(max(10, 20, 30, 40))
print("Python", "AI", 2026)

def add(a, b):
    return a + b

def total(*nums):
    return sum(nums)

print(total(10, 20, 30))
print(total())`,
      editable: true,
      resetToInitial: true,
    },
    expectedOutput: `20
40
Python AI 2026
60
0`,
  },
  {
    id: "fn-star-pack",
    title: "位置参数打包",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: flow("pack"),
    code: {
      initial: "def add(*nums):\n    return sum(nums)\n\nprint(add(10, 20, 30))",
      editable: true,
      resetToInitial: true,
    },
    expectedOutput: "60",
  },
  runFlow("fn-star-unpack", "位置参数解包", "unpack", "def add(a, b, c):\n    return a + b + c\n\nnums = [10, 20, 30]\nprint(add(*nums))", "60"),
  runFlow("fn-star-compare", "打包与解包", "compare", "def f(*args):\n    return args\n\nnums = [10, 20, 30]\nprint(f(10, 20, 30))\nprint(f(*nums))", "(10, 20, 30)\n(10, 20, 30)"),
  runFlow("fn-star-kwargs", "关键字参数打包", "kwargs", "def f(**kwargs):\n    print(kwargs)\n\nf(x=10, y=20, z=30)", "{'x': 10, 'y': 20, 'z': 30}"),
  runFlow("fn-star-kwunpack", "关键字参数解包", "kwunpack", "def f(a, b):\n    print(a, b)\n\ndata = {\"b\": 20, \"a\": 10}\nf(**data)", "10 20"),
  runFlow("fn-star-mixed", "参数混合与绑定", "mixed", "def f(a, b, *args):\n    print(a)\n    print(b)\n    print(args)\n\nf(10, 20, 30, 40, 50)", "10\n20\n(30, 40, 50)"),
  runFlow("fn-star-bench", "参数绑定实验", "bench", "def f(a, b=0, *args, c=100, **kwargs):\n    print(a, b, args, c, kwargs)\n\nf(10, 20, 30, c=50)", "10 20 (30,) 50 {}"),
  runFlow("fn-star-forward", "参数转发", "forward", "def show(*args, **kwargs):\n    print(*args, **kwargs)\n\nshow(\"Python\", \"AI\", sep=\" | \", end=\"!\")", "Python | AI!"),
  runFlow("fn-star-quiz", "课堂互动", "quiz", "def f(*args):\n    print(args)\n\nf([1, 2, 3])", "([1, 2, 3],)"),
];
